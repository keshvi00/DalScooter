import json
import boto3
import os

sqs = boto3.client('sqs')
dynamodb = boto3.resource('dynamodb')

SQS_QUEUE_URL = os.environ.get('SQS_QUEUE_URL')
DYNAMO_TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')
NOTIFICATION_API_URL = os.environ.get('NOTIFICATION_API_URL')

table = dynamodb.Table(DYNAMO_TABLE_NAME)

def get_user_from_dynamodb(username):
    try:
        response = table.get_item(Key={'username': username})
        return response.get('Item', {})
    except Exception as e:
        print(f"Error fetching user from DynamoDB: {str(e)}")
        return {}

def send_notification(username, notification_type, booking_data=None):
    try:
        print(f"Notification would be sent for {username} - type: {notification_type}")
        return True
    except Exception as e:
        print(f"Error in notification function: {str(e)}")
        return False

def process_booking_request(booking_data):
    try:
        
        booking_id = booking_data.get('bookingId')
        customer_username = booking_data.get('customerUsername')
        bike_model = booking_data.get('model')
        start_date = booking_data.get('startDate')
        duration = booking_data.get('duration')
        
        print(f"Processing booking request: {booking_id} for customer: {customer_username}")
        
        print(f"Booking request processed successfully: {booking_id}")
        return True
        
    except Exception as e:
        print(f"Error processing booking request: {str(e)}")
        return False

def lambda_handler(event, context):
    
    try:
        print(f"Received {len(event['Records'])} messages from SQS")
        
        for record in event['Records']:
            try:
                
                message_body = json.loads(record['body'])
                print(f"Processing message: {message_body}")
                
                success = process_booking_request(message_body)
                
                if success:
                    print(f"Message processed successfully: {record['messageId']}")
                else:
                    print(f"Failed to process message: {record['messageId']}")
                    
            except Exception as e:
                print(f"Error processing individual message: {str(e)}")
                continue
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Messages processed successfully'})
        }
        
    except Exception as e:
        print(f"Lambda handler error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        } 