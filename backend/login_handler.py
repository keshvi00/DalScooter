import boto3
import json
import os
from datetime import datetime
from botocore.exceptions import ClientError

client = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')

CLIENT_ID = os.environ.get('COGNITO_CLIENT_ID')
DYNAMO_TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')

table = dynamodb.Table(DYNAMO_TABLE_NAME)
login_log_table = dynamodb.Table("UserLogins")  # Hardcoded login logging table

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def log_login_attempt(username, status):
    timestamp = datetime.utcnow().isoformat()
    date_str = timestamp.split("T")[0]  # Format: yyyy-mm-dd
    try:
        login_log_table.put_item(
            Item={
                'username': username,
                'login_timestamp': timestamp,
                'status': status,
                'date': date_str
            }
        )
    except Exception as e:
        print("Failed to log login attempt:", str(e))

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))

        body = json.loads(event.get('body', '{}'))
        username = body.get('username')
        password = body.get('password')

        if not username or not password:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "Missing username or password"})
            }

        try:
            response = client.initiate_auth(
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': username,
                    'PASSWORD': password
                },
                ClientId=CLIENT_ID
            )
        except client.exceptions.UserNotConfirmedException:
            log_login_attempt(username, "FAILURE")
            return {
                "statusCode": 403,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "User not confirmed. Please verify your email before logging in."})
            }
        except client.exceptions.NotAuthorizedException:
            log_login_attempt(username, "FAILURE")
            return {
                "statusCode": 401,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": "Incorrect username or password."})
            }
        except ClientError as e:
            log_login_attempt(username, "FAILURE")
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"message": str(e)})
            }

        auth = response.get("AuthenticationResult")
        if not auth:
            log_login_attempt(username, "FAILURE")
            return {
                "statusCode": 401,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "message": "Login failed — check username/password",
                    "debug": str(response)
                })
            }

        print(f"Login successful for user: {username}")
        log_login_attempt(username, "SUCCESS")

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "message": "Login successful",
                "access_token": auth['AccessToken'],
                "id_token": auth['IdToken'],
                "refresh_token": auth['RefreshToken']
            })
        }

    except Exception as e:
        print("Exception occurred:", str(e))
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "message": "Internal Server Error",
                "debug": str(e)
            })
        }
