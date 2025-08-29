import json
import boto3
import os

cognito = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')
CLIENT_ID = os.environ['COGNITO_CLIENT_ID']
DYNAMO_TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')
NOTIFICATION_API_URL = os.environ.get('NOTIFICATION_API_URL')

table = dynamodb.Table(DYNAMO_TABLE_NAME)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def send_notification(username, notification_type, user_type):
    try:
        notification_data = {
            'notification_type': notification_type,
            'username': username,
            'user_type': user_type
        }
        
        response = boto3.client('lambda').invoke(
            FunctionName='NotificationHandler',
            InvocationType='Event',
            Payload=json.dumps({
                'body': json.dumps(notification_data)
            })
        )
        
        print(f"Notification sent for {username}: {notification_type}")
        return True
    except Exception as e:
        print(f"Failed to send notification: {str(e)}")
        return False

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])

        username = data.get('username')
        code = data.get('code')

        if not all([username, code]):
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Missing username or code'})
            }

        response = cognito.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            ConfirmationCode=code
        )

        try:
            user_data = table.get_item(Key={'username': username})
            user_type = user_data.get('Item', {}).get('userType', 'user')
            
            send_notification(username, "registration", user_type)
            
        except Exception as e:
            print(f"Error sending notification: {str(e)}")

        print(f"Email confirmation successful for user: {username}")

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Verified & Signup successful'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        }
