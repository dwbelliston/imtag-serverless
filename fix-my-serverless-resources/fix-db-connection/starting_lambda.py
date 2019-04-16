import json
import pymysql
import random
import os

def lambda_handler(event, context):
    print("lambda_handler")
    try:
        response = main(event, context)
        return response
    except Exception as err:
        return {
            'statusCode': 500,
            'body': json.dumps(err, default=str)
        }


def main(event, context):
    print("Start")

    db_conn = connect_db()

    rows = get_image_urls(db_conn)

    image_to_return = random.choice(rows)

    return {
        'headers': {
            "Access-Control-Allow-Origin": "*",
        },
        'statusCode': 200,
        'body': json.dumps(image_to_return, default=str)
    }


def get_image_urls(db_conn):
    """
    Get Images from DB
    """
    rows = []

    with db_conn.cursor() as cur:
        cur.execute("select image_url from image_urls;")
        for row in cur:
            print(row)
            rows.append({
                "image_url": row[0]
            })

    db_conn.commit()

    return rows


def connect_db():
    """
    Establish db connection
    """
    print("***********Connect DB*********")
    try:
        db_endpoint = os.environ["DB_HOSTNAME"]
        db_user = os.environ["DB_USER"]
        db_password = os.environ["DB_PASSWORD"]
        db_name = os.environ["DB_NAME"]
    except:
        print(
            "Unable to load connection parameters from environment variables")

    try:
        print('---', db_endpoint)
        conn = pymysql.connect(db_endpoint, user=db_user,
                               password=db_password, db=db_name, connect_timeout=5)
        print("SUCCESS: Connection to RDS MySQL instance succeeded")

        return conn

    except Exception as err:
        print(
            "ERROR: Unexpected error: Could not connect to MySQL instance.")
        print(err)
        raise err