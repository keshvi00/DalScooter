import json
import boto3
import random
import string
import os
from datetime import datetime

dynamodb = boto3.client('dynamodb')
sqs = boto3.client('sqs')
TABLE_NAME = "BikeBookings"

def generate_short_booking_ref(length=5):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))

def handler(event, context):
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": ""
        }

    try:
        body = json.loads(event.get("body", "{}"))

        required_fields = ["bikeId", "model", "location", "hourlyRate", "startDate", "duration", "customerUsername"]
        for field in required_fields:
            if field not in body:
                return {
                    "statusCode": 400,
                    "headers": {"Access-Control-Allow-Origin": "*"},
                    "body": json.dumps({"message": f"Missing field: {field}"})
                }

        booking_id = generate_short_booking_ref(5)

        item = {
            "bookingId": {"S": booking_id},
            "customerUsername": {"S": body["customerUsername"]},
            "bikeId": {"S": body["bikeId"]},
            "model": {"S": body["model"]},
            "location": {"S": body["location"]},
            "hourlyRate": {"N": str(body["hourlyRate"])},
            "startDate": {"S": body["startDate"]},
            "duration": {"N": str(body["duration"])},
            "status": {"S": "Pending"},
            "createdAt": {"S": datetime.utcnow().isoformat()}
        }

        dynamodb.put_item(TableName=TABLE_NAME, Item=item)

        # Add booking request to SQS queue for processing
        try:
            queue_message = {
                "bookingId": booking_id,
                "customerUsername": body["customerUsername"],
                "bikeId": body["bikeId"],
                "model": body["model"],
                "location": body["location"],
                "hourlyRate": body["hourlyRate"],
                "startDate": body["startDate"],
                "duration": body["duration"]
            }
            
            # Send message to SQS queue
            sqs_url = os.environ.get('SQS_QUEUE_URL', '')
            if not sqs_url:
                print("SQS_QUEUE_URL environment variable not set")
                return {
                    "statusCode": 500,
                    "headers": {"Access-Control-Allow-Origin": "*"},
                    "body": json.dumps({"message": "SQS configuration error"})
                }
            sqs.send_message(
                QueueUrl=sqs_url,
                MessageBody=json.dumps(queue_message)
            )
            
            print(f"Booking request added to SQS queue: {booking_id}")
            
        except Exception as e:
            print(f"Failed to add booking to SQS queue: {str(e)}")
            # Don't fail the booking if SQS fails

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "You have booked the bike successfully, waiting for Franchise to approve it",
                "bookingId": booking_id
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": f"Error: {str(e)}"})
        }
