import json
import boto3

dynamodb = boto3.client('dynamodb')
TABLE_NAME = "BikeBookings"

def handler(event, context):
    try:
        response = dynamodb.scan(TableName=TABLE_NAME)
        items = response.get('Items', [])
        def deserialize(item):
            return {
                "bookingId": item.get("bookingId", {}).get("S", ""),
                "bikeId": item.get("bikeId", {}).get("S", ""), 
                "model": item.get("model", {}).get("S", ""),
                "location": item.get("location", {}).get("S", ""),
                "hourlyRate": float(item.get("hourlyRate", {}).get("N", 0)),
                "startDate": item.get("startDate", {}).get("S", ""),
                "duration": int(item.get("duration", {}).get("N", 0)),
                "status": item.get("status", {}).get("S", ""),
                "createdAt": item.get("createdAt", {}).get("S", "")
            }

        bookings = [deserialize(item) for item in items]

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"bookings": bookings})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": str(e)})
        }
