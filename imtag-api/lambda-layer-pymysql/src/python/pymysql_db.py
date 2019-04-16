import logging
import pymysql


# Setup Logger
LOGGER = logging.getLogger()
log_handler = logging.StreamHandler()
log_formatter = logging.Formatter(
    '%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
log_handler.setFormatter(log_formatter)
LOGGER.addHandler(log_handler)
LOGGER.setLevel(logging.INFO)


def connect(db_endpoint, db_user, db_password, db_name):
    """
    Establish db connection
    """
    LOGGER.info("Connect to DB")

    try:
        conn = pymysql.connect(db_endpoint, user=db_user,
                               password=db_password, db=db_name, connect_timeout=5)
        LOGGER.info("SUCCESS: Connection to RDS MySQL instance succeeded")

        return conn

    except Exception as err:
        LOGGER.error(
            "ERROR: Unexpected error: Could not connect to MySQL instance.")
        LOGGER.error(err)
        raise err
