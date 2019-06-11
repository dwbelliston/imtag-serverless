# Tooling for Serverless

---

You have heard of serverless, no doubt. Many companies are starting to build serverless applications and explore the different use cases for them. The serverless future is exciting to say the least, and with more people joining the community we can see the reason for the buzz, it is fitting nicely into the world of cloud computing where we dont want to fuss with managing infrastructure and just want to focus on source code that differentiates our business.

The reason for this blog is to walk through some tooling setup you should use when starting to develop a serverless api. You can find alot of resources about serverless and what it is and why you would want to use it. Once you have decided you want to start building a serverless api, then this blog post can be handy. Certainly, there are other blog posts like this one as well. This is not an exhaustive tutorial, but should get you moving in the right direction and help you navigate a few setup issues I had when starting.

---

### Background

In an ideal world you are given some requirements for your application. Lets start there. Your design team has handed you some specs for a new web application they want for their machine learning team. One of the tasks they have assigned to you is to build an API that will allow a user to tag an image with classifications.

### Prerequisites

We are going to move pass a few things that will need to be in place before you start with this. We are assuming you have an AWS environment and access to it, both through the web browser console and programmtic access set up with cli.

## Developer Tool 1: Build locally

A natural place to start building an api is with AWS Lambda web console. When you navigate to the console, there is a simple wizard you can use to create a function. This is great and works for simple functions, but you will soon find that it will quickly be less than adequate for working through building your api. You should choose a framework that will give you ability to run and test lambdas locally and then will aid you in packging those up and getting them to the cloud. Google 'serverless frameworks' and you will see that there are many options. One that is provided by AWS is called AWS SAM. Lets use that for this tutorial.

Install AWS SAM through the [online docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Once installed, you can get running serverless app with the 'init' command. This command will start you out with the following files:

`sam init --runtime python3.7`

```bash
.
├── README.md
├── event.json
├── hello_world
│   ├── __init__.py
│   ├── app.py
│   └── requirements.txt
├── template.yaml
└── tests
    └── unit
        ├── __init__.py
        └── test_handler.py
```

This app is ready out of the box. You can start this up locally with the command:

`sam local start-api`

You can then invoke this function as its running through your borwser at "http://localhost:3000/hello"

Awesome! Lambdas running locally, starting out right. This will make it way easier to iterate over our code and get things in shape before deploying.

## Developer Tool 2: Debug locally

I remember my early days of web development, `console.log()` was my best friend but, then, I was taught how to use the Chrome debugger tool! Certainly logging has a place, but a step through debugger is crucial to those super tricky situations where you just wish you could pause time. Luckily, we can achieve that same developer experience with our serverless apps.

AWS SAM and VS Code play nice together. Lets walk through setting up a debugging environment.

The AWS SAM docs are almost awesome. They got me pretty far, but a couple things were missing so It did not work for me. Start with the [docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging-python.html), which will help you set up `ptvsd`

To set up `ptvsd` you will be walked through the pip install and then adding a snippet of python code to the function that looks like this.

```python
import ptvsd

# Enable ptvsd on 0.0.0.0 address and on port 5890 that we'll connect later with our IDE
ptvsd.enable_attach(address=('0.0.0.0', 5890), redirect_output=True)
print('Hello, Im going to wait for vs code to attach to me before I continue...')
ptvsd.wait_for_attach()
```

With that in place your code is ready, but VS Code now needs to be told how to work with the application. In VS Code console you should see the debug icon on the far left pane, same location as where your file directory, search, extensions and git icon live. If you dont see it, right click that pane and toggle the debug icon on. Click the debug and open the debug pane.

You will need to add a launch configuration to VS Code. This is a json definition that will tell VS Code where to find the running application and then where the source code will be. With the debug pane open, click on the settings on the top left and add for python environment. There will be a few different configurations already in place, just add the configuration below, Make sure to add the correct `localRoot`. When you run the `sam build` command it generates the `.aws-sam` folder. The folder contains the bundles application and is the path you need to tell VS Code about. You will need to also tell it the function name inside the build folder.

```json
{
  "name": "SAM CLI For Python Sample API",
  "type": "python",
  "request": "attach",
  "port": 5890,
  "host": "localhost",
  "pathMappings": [
    {
      "localRoot": "${workspaceFolder}/serverless-app-name/.aws-sam/build/NameOfFunction",
      "remoteRoot": "/var/task"
    }
  ]
}
```

After that configuration is finished you can now run `sam build` to get any of the latest code changes. `sam build` takes your function source, gets all the dependencies and packages it inside the `.aws-sam` directory.

Run

`sam build`

Now you code is in the `.aws-sam` folder, review it to see how it is built, double check the launch configuration you have above has a valid `localRoot` path mapping

Run

`sam local start-api -d 5890`

This will start the api, listening on the default port 3000 with a debug port open at 5890. I wasnt sure what this was doing at first, but basically that application is now available for the VS Code to latch on to it at port 5890, which is the same port we defined in the debug launch configuration

Go to browser and invoke the function

`http://localhost:3000/hello`

You can see in your terminal that the function stops. It is waiting at the point where our `ptvsd` code is waiting for attachment.

Now you can resume the debug with the debug feature in VS Code. Go to the debug pane and at the top select your launch configuration from the step above. This is where everything ties together. VS Code attaches to the debug port and takes you into the source code defined in the launch configuration.

Use the debug controls to navigate through the code.

## Developer Tool 3: Package and deploy locally

The app is running locally, super! AWS SAM makes the next step of deploying very easy. You will need to create an S3 bucket for the zipped artifact first though.

`aws s3 mb s3://mybucket-for-serverless`

THe following commands will package the lambda function for us along with all its dependencies. AWS SAM is just CloudFormation with some syntatic sugar.

- Build the app locally

```bash
sam build
```

- Package the template, code is placed in S3 and Cloudformation

```bash
sam package \
  --output-template-file packaged.yaml \
  --s3-bucket BUCKET_NAME
```

- Deploy the app through cloud formation stack

```bash
sam deploy \
  --template-file packaged.yaml \
  --stack-name STACK_NAME \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

When you get more sophisticated there will be more that goes into building and deploying, but this is working great for us. SAM is going to package the lambda for us, create an artifact and setup that lambda behind an API Gateway. Where did the API Gateway come in? Check out the `template.yaml` in the project folder and you can see that there are events tied to your function creation. The event type `API` is what is creating the API Gateway.

Go to the console and check out what is created for Lambda, CloudFormation and Api Gateway. Make sure you are in the region set in your aws cli profile.

You will see in the output section of the CloudFormation stack a URL for the api you have deployed.

Something like this

https://RANDOM_STUFF.execute-api.us-east-1.amazonaws.com/Prod/hello/

A living Serverless API... that does nothing. But an API none the less.

## Just Beginning

Hopefully this will give you some momentum towards mastering serverless development. I think its really worthwile to spend some time getting up to speed on serverless application development, this is just the beginning.
