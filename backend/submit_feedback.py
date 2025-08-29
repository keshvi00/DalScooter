import json
import boto3
import uuid
from datetime import datetime

# DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Feedback')

# Offline sentiment keywords
positive_words = {"good", "great", "excellent", "amazing", "awesome", "satisfied", "love", "happy", "nice", "positive"}
negative_words = {"bad", "terrible", "awful", "worst", "poor", "disappointed", "angry", "hate", "negative", "sad"}

def analyze_sentiment(text):
    text = text.lower()
    pos_count = sum(word in text for word in positive_words)
    neg_count = sum(word in text for word in negative_words)

    if pos_count > neg_count:
        return "positive"
    elif neg_count > pos_count:
        return "negative"
    else:
        return "neutral"

def lambda_handler(event, context):
    # Handle CORS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }

    try:
        body = json.loads(event.get("body", "{}"))
        booking_reference = body.get("bookingReference")
        feedback_text = body.get("feedback")

        if not booking_reference or not feedback_text:
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Missing fields"})
            }

        sentiment = analyze_sentiment(feedback_text)

        feedback_id = str(uuid.uuid4())
        item = {
            "feedback_id": feedback_id,
            "booking_reference": booking_reference,
            "feedback_text": feedback_text,
            "timestamp": datetime.utcnow().isoformat(),
            "sentiment": sentiment
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Feedback submitted successfully!",
                "sentiment": sentiment
            })
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }