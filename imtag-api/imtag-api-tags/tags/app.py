import boto3
import logging
import json
import pymysql_db
import random
import os
import ptvsd

from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

patch_all()

# Enable ptvsd on 0.0.0.0 address and on port 5890 that we'll connect later with our IDE
if os.environ["ENV"] == "debug":
    print("gonna debug")
    ptvsd.enable_attach(address=('0.0.0.0', 5890), redirect_output=True)
    print("Waiting for attach!")
    ptvsd.wait_for_attach()

# Setup Logger
LOGGER = logging.getLogger()
log_handler = logging.StreamHandler()
log_formatter = logging.Formatter(
    '%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
log_handler.setFormatter(log_formatter)
if (LOGGER.hasHandlers()):
    LOGGER.handlers.clear()
LOGGER.addHandler(log_handler)
LOGGER.setLevel(logging.INFO)

# Keep DB connection out here for reuse
db_conn = None
ssm_client = None

def get_handler(event, context):
    LOGGER.info("get_handler tags")
    try:
        response = get_main(event, context)
        return response
    except Exception as err:
        return {
            'statusCode': 500,
            'body': json.dumps(err, default=str)
        }


def post_handler(event, context):
    LOGGER.info("post_handler tags")
    try:
        response = post_main(event, context)
        return response
    except Exception as err:
        return {
            'statusCode': 500,
            'body': json.dumps(err, default=str)
        }


def get_main(event, context):
    LOGGER.info("Start get_main")

    # Connect to db
    try:
        set_db_connection()
    except Exception as err:
        LOGGER.error("Unable to establish connection")
        raise err

    # Check for query to know filtering to user should happen
    if event['queryStringParameters'] and event['queryStringParameters']['user']:
        rows = get_user_tags(event['queryStringParameters']['user'])
    else:
        rows = get_tags()

    return {
        'headers': {
            "Access-Control-Allow-Origin": "*",
        },
        'statusCode': 200,
        'body': json.dumps(rows, default=str)
    }

def get_tags():
    """
    Get Tags from DB
    """
    rows = []

    with db_conn.cursor() as cur:
        cur.execute("select tag_id, name from tags;")
        for row in cur:
            LOGGER.info(row)
            rows.append({
                "tag_id": row[0],
                "name": row[1]
            })

    db_conn.commit()

    return rows


def get_user_tags(user):
    """
    Get User Tags from DB
    """
    rows = []

    with db_conn.cursor() as cur:
        sql = "SELECT user_id, image_url, tag_name, created_at from user_tags WHERE user_id = (%s);"
        cur.execute(sql, (user))
        for row in cur:
            LOGGER.info(row)
            rows.append({
                "user_id": row[0],
                "image_url": row[1],
                "tag_name": row[2],
                "created_at": row[3]
            })

    db_conn.commit()

    return rows


def post_main(event, context):
    LOGGER.info("Start post_main")

    # Connect to db
    try:
        set_db_connection()
    except Exception as err:
        LOGGER.error("Unable to establish connection")
        raise err

    res = post_tag(json.loads(event['body']))

    return {
        'headers': {
            "Access-Control-Allow-Origin": "*",
        },
        'statusCode': 200,
        'body': json.dumps(res, default=str)
    }

def post_tag(payload):
    """
    Post tag to db for user
    """
    user = payload['user']
    tag = payload['tag']
    image = payload['image']

    with db_conn.cursor() as cur:
        # Create a new record
        sql = "INSERT INTO `user_tags` (`user_id`, `image_url`, `tag_name`) VALUES (%s, %s, %s)"
        cur.execute(sql, (user, image, tag))

    db_conn.commit()

    return payload


def set_db_connection():
    global ssm_client

    if not ssm_client:
        ssm_client = boto3.client('ssm')

    global db_conn

    if not db_conn:
        LOGGER.info("**** ESTABLISH DB CONNECTION ****")

        try:
            # Default to env variables
            db_name = os.environ["DB_NAME"]
            db_endpoint = os.environ["DB_HOSTNAME"]
            db_user = os.environ["DB_USER"]
            db_password = os.environ["DB_PASSWORD"]

            if os.environ["USE_PARAMETER_STORE"] == "True":
                LOGGER.info("Getting params from parameter store")
                p_endpoint = ssm_client.get_parameter(
                    Name=os.environ["DB_HOSTNAME"], WithDecryption=True)
                p_user = ssm_client.get_parameter(
                    Name=os.environ["DB_USER"], WithDecryption=True)
                p_password = ssm_client.get_parameter(
                    Name=os.environ["DB_PASSWORD"], WithDecryption=True)

                db_endpoint = p_endpoint['Parameter']['Value']
                db_user = p_user['Parameter']['Value']
                db_password = p_password['Parameter']['Value']

        except Exception as err:
            LOGGER.error(
                "Unable to load connection parameters from environment variables")
            raise err

        try:
            db_conn = pymysql_db.connect(
                db_endpoint, db_user, db_password, db_name)
        except Exception as err:
            LOGGER.error("Unable to establish connection")
            raise err

    return
