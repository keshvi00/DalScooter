import boto3
import csv
import os
import tempfile
from datetime import datetime, timedelta
import random

def lambda_handler(event, context):
    today = datetime.utcnow()
    rows = [["Date", "TotalUsers", "Logins"]]
    total_users = 150

    for i in range(5):
        date = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        logins = random.randint(20, 50)
        total_users += random.randint(1, 5)
        rows.append([date, total_users, logins])

    with tempfile.NamedTemporaryFile("w", delete=False) as tmp:
        writer = csv.writer(tmp)
        writer.writerows(rows)
        tmp.flush()
        filename = tmp.name

    s3 = boto3.client("s3")
    bucket = os.environ["BUCKET_NAME"]
    s3.upload_file(filename, bucket, "login_stats.csv", ExtraArgs={'ACL': 'public-read'})

    return {
        "statusCode": 200,
        "body": f"Uploaded to s3://{bucket}/login_stats.csv"
    }
