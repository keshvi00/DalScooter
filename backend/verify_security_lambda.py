import boto3
import json
import os

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))
        
        # For API Gateway HTTP API v2, the method is in requestContext.http.method
        http_method = event.get('requestContext', {}).get('http', {}).get('method', 'POST')
        print(f"HTTP Method: {http_method}")
        
        if http_method == 'GET':
            # Handle GET request - fetch security question
            username = event.get('queryStringParameters', {}).get('username')
            print(f"GET request - Username from query params: {username}")
            
            if not username:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "Missing username parameter"})
                }

            table = dynamodb.Table(TABLE_NAME)
            response = table.get_item(Key={"username": username})
            print(f"DynamoDB response: {response}")

            if 'Item' not in response:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "User not found"})
                }

            question = response['Item'].get('question', '')
            print(f"Found question: {question}")
            
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                },
                "body": json.dumps({"question": question})
            }
            
        elif http_method == 'POST':
            # Handle POST request - verify security answer
            body = json.loads(event.get('body', '{}'))
            username = body.get('username')
            input_question = body.get('question')
            input_answer = body.get('answer')

            if not username or not input_question or not input_answer:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": "Missing username/question/answer"})
                }

            table = dynamodb.Table(TABLE_NAME)
            response = table.get_item(Key={"username": username})

            if 'Item' not in response:
                return {
                    "statusCode": 404,
                    "body": json.dumps({"message": "User not found"})
                }

            stored_q = response['Item'].get('question', '').lower().strip()
            stored_a = response['Item'].get('answer', '').lower().strip()

            if stored_q == input_question.lower().strip() and stored_a == input_answer.lower().strip():
                return {
                    "statusCode": 200,
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
                    },
                    "body": json.dumps({"message": "2FA Security Question Verified"})
                }
            else:
                return {
                    "statusCode": 401,
                    "body": json.dumps({"message": "Incorrect security answer"})
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
            "body": json.dumps({
                "message": "Internal Server Error",
                "debug": str(e)
            })
        }
