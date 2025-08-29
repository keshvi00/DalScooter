import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Bikes')

def lambda_handler(event, context):
    try:
        method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method')

        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': cors_headers(),
                'body': ''
            }

        data = json.loads(event.get('body', '{}'), parse_float=Decimal)

        if method == 'POST':
            item = {
                'bikeId': str(uuid.uuid4()),
                'model': data.get('model'),
                'type': data.get('type'),
                'hourlyRate': data.get('hourlyRate'),
                'location': data.get('location'),
                'features': data.get('features', []),
                'status': data.get('status', 'available'),
                'createdAt': datetime.utcnow().isoformat()
            }

            table.put_item(Item=item)

            return {
                'statusCode': 200,
                'headers': cors_headers(),
                'body': json.dumps({'message': 'Bike added successfully', 'bike': item}, default=str)
            }

        elif method == 'PUT':
            path_params = event.get('pathParameters') or {}
            bike_id = path_params.get('bikeId')

            if not bike_id:
                raise Exception("Missing bikeId in path")

            update_expr_parts = []
            expr_attr_values = {}
            expr_attr_names = {}

            if 'model' in data:
                update_expr_parts.append("model = :m")
                expr_attr_values[":m"] = data['model']
            if 'type' in data:
                update_expr_parts.append("#tp = :t")
                expr_attr_values[":t"] = data['type']
                expr_attr_names["#tp"] = "type"
            if 'hourlyRate' in data:
                update_expr_parts.append("hourlyRate = :hr")
                expr_attr_values[":hr"] = data['hourlyRate']
            if 'location' in data:
                update_expr_parts.append("#loc = :l")
                expr_attr_values[":l"] = data['location']
                expr_attr_names["#loc"] = "location"
            if 'features' in data:
                update_expr_parts.append("features = :f")
                expr_attr_values[":f"] = data['features']
            if 'status' in data:
                update_expr_parts.append("#st = :s")
                expr_attr_values[":s"] = data['status']
                expr_attr_names["#st"] = "status"

            if not update_expr_parts:
                return {
                    'statusCode': 400,
                    'headers': cors_headers(),
                    'body': json.dumps({'error': 'No fields provided for update'})
                }

            update_expr = "SET " + ", ".join(update_expr_parts)

            table.update_item(
                Key={"bikeId": bike_id},
                UpdateExpression=update_expr,
                ExpressionAttributeValues=expr_attr_values,
                ExpressionAttributeNames=expr_attr_names or None
            )

            return {
                'statusCode': 200,
                'headers': cors_headers(),
                'body': json.dumps({'message': 'Bike updated successfully', 'bikeId': bike_id})
            }

        else:
            return {
                'statusCode': 405,
                'headers': cors_headers(),
                'body': json.dumps({'error': 'Method Not Allowed'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers(),
            'body': json.dumps({'error': str(e)})
        }

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT'
    }
