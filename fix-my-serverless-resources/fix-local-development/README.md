# AWS SAM for local development

Sam provides a few really nice features that allow us to take the code out of the console and onto our local computer. This is way better for iterating with a shorter feedback loop.

## Setup

You can use the sam cli to init an example hello world application. This is a great way to start building out your own api.

Run

`sam init -n my-app`

This provides you with the application and some great documentation on what each file is for and how to use the sam cli to start the api and invoke the functions.

Read the [docs](./my-app) in the generated app

## Gotchas

- Which template does it use?

  If you run `sam package` and there is a sam build artifact, it will use the template from inside the `.aws-sam` folder to create the aritifact. It will then create the 'packaged.yaml' output file as directed in the command.

  ```bash
  sam package \
  --output-template-file packaged.yaml \
  --s3-bucket 1s-imtag-api-tags
  ```

  This tripped me up because sometimes I would update the cloudformation template at the top level, but wouldnt see me changes reflected in the output of packaged.yaml. You have to run the `sam build` to get the template file updated in the build folder. Then it will be grabbed.

- No instrinsic functions

  Sam local doesnt work with intrinsic functions, so hard to pass values as params [Track the github issue](https://github.com/awslabs/aws-sam-cli/issues/528)

  You can use the `aws cloudformation` for sending in parameter overrides to get the template to work if you need this. I had luck with the following development flow. Here is an example environment file

  ```json
  [
    "Env=dev",
    "UseParameterStore=True",
    "DatabaseHostname=/DB/DEV/ENDPOINT",
    "DatabaseUsername=/DB/DEV/USERNAME",
    "DatabasePassword=/DB/DEV/PASSWORD",
    "DatabaseName=dev"
  ]
  ```

  ```bash
  # Build the package
  sam build

  # Package the template, code is placed in s3 and cloudformation
  sam package \
      --output-template-file packaged.yaml \
      --s3-bucket BUCKET_NAME

  # Deploy that stack with path to environments
  aws cloudformation deploy \
    --template-file packaged.yaml \
    --stack-name STACK_NAME \
    --parameter-overrides file://environments/dev.json \
    --capabilities CAPABILITY_IAM
  ```
