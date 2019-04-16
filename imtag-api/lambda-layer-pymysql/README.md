# Lambda Layer for `pymysql`

Provides package for pymysql and a connection function to return connection to db provided valid endpoint and connection credentials are submitted

## Steps

- Create the bucket for where your layers code will live

  `aws s3 mb s3://BUCKET_NAME`

- Place the source code for your layer under a folder language. Note this section of aws docs

  When a Lambda function configured with a Lambda layer is executed, AWS downloads any specified layers and extracts them to the /opt directory on the function execution environment. Each runtime then looks for a language-specific folder under the /opt directory. [View Docs](https://aws.amazon.com/blogs/compute/working-with-aws-lambda-and-lambda-layers-in-aws-sam/)

  Here is the example tree for creating a python layer

  ```text
  ├── src
  │   └── python
  │       ├── pymysql_db.py
  │       └── requirements.txt
  └── template.yaml
  ```

- Build artifact and place in s3

  The artifact needs to be prpared and a zip file uploaded to s3 location. There is a script to prepare the zip, inspect its contents to see how zip is created.

  `.prep.sh`

  Once the zip artifact is prepared, you need to upload it to s3, you can use `aws s3` cli for this upload, example is in deploy script

  `.deploy.sh`

- Create lambda layer version template

  Now that lambda layer is prepared and in s3, the code in s3 can be used to create a layer for lambda. The cloud formation template for this looks like the following:

  ```yaml
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  Description: "Lambda layer for database connection with pymysql"

  Resources:
    LambdaLayerPymysql:
      Type: AWS::Serverless::LayerVersion
      Properties:
        LayerName: LambdaLayerPymysql
        Description: Provides db connection functionality
        ContentUri: s3://BUCKET_NAME/NAME_OF_GENERATED_ZIP.zip
        CompatibleRuntimes:
          - python3.7
        RetentionPolicy: Retain

  Outputs:
    LambdaLayerPymysql:
      Description: "Arn for pymysql lambda layer"
      Value: !Ref LambdaLayerPymysql
  ```

- Package template

  Package the cloud formation template, using AWS SAM

  ```bash
  sam package \
      --output-template-file packaged.yaml \
      --s3-bucket BUCKET_NAME
  ```

- Deploy the cloud formation stack

  ```bash
  aws cloudformation deploy \
    --template-file packaged.yaml \
    --stack-name STACK_NAME \
    --capabilities CAPABILITY_IAM
  ```

## Example Use

Now that the lambda layer is available you can add it to the function you want to use it. This is what an example cloudformation template would look like. You place the arn of the layer in the function template. Then you can import it in your code.

```yaml
FunctionNameHere:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: src/
    Handler: app.lambda_handler
    Runtime: python3.7
    Events:
      GetTagsEvent:
        Type: Api
        Properties:
          Path: /path
          Method: POST
    Layers:
      - arn:aws:lambda:us-east-1:ACCOUNT_NUMBER:layer:LambdaLayerPymysql:3
```

In code you would import the name of the file that is going to be loaded into the `dependencies/python` folder when layer is downloaded to lambda container

```python
import pymysql_db
```

## Misc

```bash
sam package \
    --output-template-file packaged.yaml \
    --s3-bucket 1s-lambda-layer-pymysql

aws cloudformation deploy \
  --template-file packaged.yaml \
  --stack-name lambda-layer-pymysql \
  --capabilities CAPABILITY_IAM
```
