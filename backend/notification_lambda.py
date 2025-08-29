import json
import boto3
import os
from datetime import datetime

sns = boto3.client('sns')
dynamodb = boto3.resource('dynamodb')

SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')
DYNAMO_TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')

table = dynamodb.Table(DYNAMO_TABLE_NAME)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def get_user_from_dynamodb(username):

    try:
        response = table.get_item(Key={'username': username})
        return response.get('Item', {})
    except Exception as e:
        print(f"Error fetching user from DynamoDB: {str(e)}")
        return {}

def send_notification_to_sns(notification_type, username, user_type=None, booking_data=None):

    try:
        message_data = {
            'notification_type': notification_type,
            'username': username,
            'user_type': user_type,
            'booking_data': booking_data,
            'timestamp': str(datetime.now())
        }
        
        if notification_type == "registration":
            email_message = f"""
Welcome to DalScooter Portal!

Dear {username},

Your account has been successfully verified and registered.

Best regards,
The DalScooter Team
                """
                
        elif notification_type == "login":
            email_message = f"""
Login Successful!

Dear {username},

You have successfully logged in to DalScooter Portal.

Best regards,
The DalScooter Team
                """
                
        elif notification_type == "booking_confirmation":
            booking_id = booking_data.get('bookingId', 'N/A')
            start_date = booking_data.get('startDate', 'N/A')
            model = booking_data.get('model', 'N/A')
            duration = booking_data.get('duration', 'N/A')
            
            email_message = f"""
Booking Confirmed!

Dear {username},

Your booking has been approved!

Booking Details:
• Booking ID: {booking_id}
• Vehicle: {model}
• Date: {start_date}
• Duration: {duration}

Pickup Instructions:
Please visit our pickup location with your booking ID.

Thank you for choosing DalScooter Portal!

Best regards,
The DalScooter Team
                """
                
        elif notification_type == "booking_rejection":
            booking_id = booking_data.get('bookingId', 'N/A')
            
            email_message = f"""
Booking Update

Dear {username},

Your booking (ID: {booking_id}) has been rejected.

This could be due to:
• Vehicle unavailability
• Invalid booking details
• System requirements not met

Please try booking again or contact our support team for assistance.

Best regards,
The DalScooter Team
                """
        else:
            email_message = f"""
Notification from DalScooter Portal

Dear {username},

You have received a notification from DalScooter Portal.

Please log in to your account for more details.

Best regards,
The DalScooter Team
                """
        response = sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=email_message,
            Subject=f"Dal Scooter Portal - {notification_type.replace('_', ' ').title()}",
            MessageAttributes={
                'notification_type': {
                    'DataType': 'String',
                    'StringValue': notification_type
                },
                'username': {
                    'DataType': 'String',
                    'StringValue': username
                },
                'user_type': {
                    'DataType': 'String',
                    'StringValue': user_type or 'unknown'
                }
            }
        )
        
        print(f"Notification sent to SNS successfully: {response['MessageId']}")
        return True
        
    except Exception as e:
        print(f"Error sending notification to SNS: {str(e)}")
        return False

def lambda_handler(event, context):
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': ''
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        notification_type = body.get('notification_type')
        username = body.get('username')
        user_type = body.get('user_type')
        booking_data = body.get('booking_data')
        
        if not notification_type or not username:
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Missing notification_type or username'})
            }
        
        user_data = get_user_from_dynamodb(username)
        user_email = user_data.get('email')
        
        if not user_email:
            return {
                'statusCode': 404,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'User email not found'})
            }
        
        if not user_type:
            user_type = user_data.get('userType')

        success = send_notification_to_sns(notification_type, username, user_type, booking_data)
        
        if success:
            return {
                'statusCode': 200,
                'headers': CORS_HEADERS,
                'body': json.dumps({
                    'message': 'Notification queued successfully',
                    'user_email': user_email,
                    'note': 'Email will be sent via SNS -> Email Sender Lambda'
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Failed to queue notification'})
            }
    
    except Exception as e:
        print(f"Lambda handler error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        } 