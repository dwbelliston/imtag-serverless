# Prepare artifact
./prep.sh
# Copy to bucket
aws s3 cp lambda-layer-pymysql.zip s3://1s-lambda-layer-pymysql/lambda-layer-pymysql.zip
# Create new version

