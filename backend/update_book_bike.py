import json
import boto3
import os

dynamodb = boto3.client('dynamodb')
TABLE_NAME = "BikeBookings"

def send_notification(username, notification_type, booking_data=None):
    """Send notification via API call"""
    try:
        notification_data = {
            'notification_type': notification_type,
            'username': username,
            'booking_data': booking_data
        }
        
        # Send notification via API Gateway
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

def handler(event, context):
    try:
        data = json.loads(event['body'])
        
        # Get bookingId from path parameters (URL) instead of body
        path_params = event.get('pathParameters', {})
        booking_id = path_params.get('bookingId')
        status = data.get('status')  # 'approved' or 'rejected'
        
        if not booking_id or not status:
            return {
                'statusCode': 400,
                'headers': {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "PUT,OPTIONS"
                },
                'body': json.dumps({'error': 'Missing bookingId or status'})
            }
        
        # Update booking status in DynamoDB
        dynamodb.update_item(
            TableName=TABLE_NAME,
            Key={'bookingId': {'S': booking_id}},
            UpdateExpression='SET #status = :status',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':status': {'S': status}}
        )
        
        # Get booking details for notification
        try:
            booking_response = dynamodb.get_item(
                TableName=TABLE_NAME,
                Key={'bookingId': {'S': booking_id}}
            )
            
            if 'Item' in booking_response:
                booking_item = booking_response['Item']
                customer_username = booking_item.get('customerUsername', {}).get('S', 'unknown')
                
                # Prepare booking data for notification
                booking_data = {
                    'bookingId': booking_id,
                    'startDate': booking_item.get('startDate', {}).get('S', 'N/A'),
                    'model': booking_item.get('model', {}).get('S', 'N/A'),
                    'duration': str(booking_item.get('duration', {}).get('N', 'N/A'))
                }
                
                print(f"Prepared booking data for notification: {booking_data}")
                
                # Send booking status notification
                notification_type = "booking_confirmation" if status == "approved" else "booking_rejection"
                send_notification(customer_username, notification_type, booking_data)
                
        except Exception as e:
            print(f"Error sending booking status notification: {str(e)}")
            # Don't fail the status update if notification fails
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "PUT,OPTIONS"
            },
            'body': json.dumps({'message': 'Booking status updated successfully'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "PUT,OPTIONS"
            },
            'body': json.dumps({'error': str(e)})
        }
