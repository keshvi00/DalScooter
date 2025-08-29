import boto3
import json
from collections import Counter

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Feedback')

def lambda_handler(event, context):
    try:
        # Scan all feedback items
        response = table.scan()
        items = response.get('Items', [])

        # Count sentiments using Counter
        sentiment_list = [item.get("sentiment", "neutral").lower() for item in items]
        counts = Counter(sentiment_list)

        # Prepare response format
        result = [
            {"sentiment": "positive", "count": counts.get("positive", 0)},
            {"sentiment": "neutral", "count": counts.get("neutral", 0)},
            {"sentiment": "negative", "count": counts.get("negative", 0)},
        ]

        return {
            "statusCode": 200,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "body": json.dumps(result)
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "body": json.dumps({"error": str(e)})
        }
