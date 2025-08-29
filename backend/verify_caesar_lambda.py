import json
import boto3
import os

CIPHER_TEXT = "vhuyhuohvv"  
SHIFT_KEY = 3 

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')
NOTIFICATION_API_URL = os.environ.get('NOTIFICATION_API_URL')

def send_notification(username, notification_type, user_type):
    """Send notification via NotificationHandler Lambda"""
    try:
        lambda_client = boto3.client('lambda')
        payload = {
            "body": json.dumps({
                "username": username,
                "notification_type": notification_type,
                "user_type": user_type
            })
        }
        
        response = lambda_client.invoke(
            FunctionName='NotificationHandler',
            InvocationType='Event',
            Payload=json.dumps(payload)
        )
        print(f"Notification sent successfully: {response}")
        return True
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
        return False

def caesar_decrypt(cipher_text, shift):
    decrypted = ""
    for char in cipher_text.lower():  
        if char.isalpha():
            base = ord('a')
            decrypted += chr((ord(char) - base - shift) % 26 + base)
        else:
            decrypted += char
    return decrypted

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))
        
        http_method = event.get('requestContext', {}).get('http', {}).get('method', 'POST')
        
        path = event.get('requestContext', {}).get('http', {}).get('path', '')
        print(f"HTTP Method: {http_method}")
        print(f"Path: {path}")
        
        if http_method == 'GET':

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                },
                "body": json.dumps({
                    "clue": CIPHER_TEXT,
                    "shift": SHIFT_KEY
                })
            }
        elif http_method == 'POST':
           
            body = json.loads(event.get('body', '{}'))
            user_answer = body.get("answer")
            username = body.get("username")

            if not user_answer:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "Missing answer"})
                }

            expected = caesar_decrypt(CIPHER_TEXT, SHIFT_KEY)
            print(f"Expected answer: {expected}")
            print(f"User answer: {user_answer}")
            print(f"Path: {path}")

            if expected.strip() == user_answer.strip().lower():
               
                if path == '/login-step3' and username:
                    print("Processing login-step3 with username:", username)
                    try:
                        table = dynamodb.Table(TABLE_NAME)
                        response = table.get_item(Key={"username": username})
                        
                        if 'Item' in response:
                            user_type = response['Item'].get('userType', 'customer')
                            print(f"Found user type: {user_type}")
                            
                            # Send login notification after successful completion of all steps
                            print(f"Sending login notification for user: {username}")
                            send_notification(username, "login", user_type)
                            
                            return {
                                "statusCode": 200,
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "Content-Type",
                                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                                },
                                "body": json.dumps({
                                    "message": "Login successful",
                                    "userType": user_type
                                })
                            }
                        else:
                            print("User not found in DynamoDB")
                            return {
                                "statusCode": 404,
                                "body": json.dumps({"message": "User not found"})
                            }
                    except Exception as e:
                        print(f"Error fetching user type: {str(e)}")
                        return {
                            "statusCode": 500,
                            "body": json.dumps({"message": "Error fetching user type", "debug": str(e)})
                        }
                else:
                    print("Regular Caesar verification (not login-step3)")
                    # Regular Caesar verification
                    return {
                        "statusCode": 200,
                        "headers": {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Content-Type",
                            "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                        },
                        "body": json.dumps({"message": "Caesar verification successful"})
                    }
            else:
                print(f"Answer mismatch. Expected: {expected}, Got: {user_answer}")
                return {
                    "statusCode": 401,
                    "body": json.dumps({"message": "Incorrect Caesar answer"})
                }
        else:
            return {
                "statusCode": 405,
                "body": json.dumps({"message": "Method not allowed"})
            }

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error", "debug": str(e)})
        }
