import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMO_TABLE_NAME'])

cognito = boto3.client('cognito-idp')
sns = boto3.client('sns')

USER_POOL_ID = os.environ.get('COGNITO_USER_POOL_ID') 
CLIENT_ID = os.environ.get('COGNITO_CLIENT_ID')
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def subscribe_email_to_sns(email):
    
    try:
        response = sns.subscribe(
            TopicArn=SNS_TOPIC_ARN,
            Protocol='email',
            Endpoint=email
        )
        print(f"Successfully subscribed {email} to SNS topic: {response['SubscriptionArn']}")
        return True
    except Exception as e:
        print(f"Error subscribing {email} to SNS: {str(e)}")
        return False

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])
        print("Received signup data:", json.dumps(data))

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        userType = data.get('userType')
        question = data.get('question')
        answer = data.get('answer')

        print(f"Security question received: {question}")
        print(f"Security answer received: {answer}")

        if not all([username, email, password, userType, question, answer]):
            print("Missing required fields")
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Missing required fields'})
            }

        # Create user in Cognito
        cognito.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[{'Name': 'email', 'Value': email}]
        )
        
        # Store user data in DynamoDB
        table.put_item(Item={
            'username': username,
            'email': email,
            'password': password,
            'userType': userType,
            'question': question,
            'answer': answer
        })

        # Subscribe user's email to SNS topic for notifications
        subscription_success = subscribe_email_to_sns(email)
        
        if subscription_success:
            print(f"User {username} ({email}) registered and subscribed to notifications")
        else:
            print(f"User {username} ({email}) registered but SNS subscription failed")

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'message': 'Check your email for verification and notification subscription',
                'sns_subscribed': subscription_success
            })
        }

    except cognito.exceptions.UsernameExistsException:
        return {
            'statusCode': 400,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Username already exists'})
        }

    except Exception as e:
        print("Exception occurred:", str(e))
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        }
