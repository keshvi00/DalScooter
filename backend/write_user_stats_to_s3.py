import boto3
import csv
import os
from datetime import datetime, timedelta

USER_POOL_ID = os.environ['USER_POOL_ID']
BUCKET_NAME = os.environ['BUCKET_NAME']

cognito = boto3.client('cognito-idp')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    users = []
    pagination_token = None

    while True:
        kwargs = {'UserPoolId': USER_POOL_ID}
        if pagination_token:
            kwargs['PaginationToken'] = pagination_token

        response = cognito.list_users(**kwargs)
        users.extend(response['Users'])

        if 'PaginationToken' in response:
            pagination_token = response['PaginationToken']
        else:
            break

    total_users = len(users)
    confirmed = sum(1 for u in users if u['UserStatus'] == 'CONFIRMED')
    unconfirmed = sum(1 for u in users if u['UserStatus'] == 'UNCONFIRMED')
    disabled = sum(1 for u in users if any(attr['Name'] == 'enabled' and attr['Value'] == 'false' for attr in u.get('Attributes', [])))

    recent_cutoff = datetime.utcnow() - timedelta(days=7)
    recent_users = sum(
        1 for u in users
        if 'UserCreateDate' in u and u['UserCreateDate'].replace(tzinfo=None) >= recent_cutoff
    )

    # Prepare CSV
    csv_data = [
        ['Metric', 'Count'],
        ['Total Users', total_users],
        ['Confirmed Users', confirmed],
        ['Unconfirmed Users', unconfirmed],
        ['Disabled Users', disabled],
        ['Recent Signups (7d)', recent_users]
    ]

    filename = 'user_stats.csv'
    with open(f'/tmp/{filename}', mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(csv_data)

    with open(f'/tmp/{filename}', 'rb') as file_data:
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=file_data,
            ContentType='text/csv'
            # Removed ACL
        )

    return {
        'statusCode': 200,
        'body': f'Successfully uploaded {filename} to S3 bucket {BUCKET_NAME}.'
    }
