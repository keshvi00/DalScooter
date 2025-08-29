import json
import boto3
import os
from boto3.dynamodb.conditions import Key
import traceback

# DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Feedback')  # If using env var: os.environ['FEEDBACK_TABLE']

def lambda_handler(event, context):
    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }

    try:
        # Scan the table to get all feedbacks
        print("Scanning Feedback table...")
        response = table.scan(
            ProjectionExpression="feedback_text, sentiment, #ts, booking_reference",
            ExpressionAttributeNames={"#ts": "timestamp"}
        )
        feedback_items = response.get('Items', [])

        # Optional: sort by timestamp descending
        feedback_items.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(feedback_items)
        }

    except Exception as e:
        print("Error fetching feedback:", traceback.format_exc())
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": "Could not retrieve feedbacks."})
        }