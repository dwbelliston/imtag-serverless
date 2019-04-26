# Developing a Serverless API

- intro

You have heard of serverless, no doubt. Many companies are starting to build serverless applications and explore the different use cases for them. The severless future is exciting to say the least, and with more people joining the community we can see the reason for the buzz, it is fitting nicely into the world of cloud computing where we dont want to fuss with managing infrastructure and just want to focus on source code that gives our businesses an edge.

- reason for blog (why)

The reason for this blog is to walk through the developers journey of starting to develop a serverless api. You can find alot of resources about serverless and what it is and why you would want to use it. Once you have decided you want to start building a serverless api, then this blog post can be handy. Certainly, there are other blog posts like this one as well. This is not an exhaustive tutorial, but should get you moving in the right direction and help you navigate a few setup issues I had when starting. There will also be a few lambda best practice tips along the way.

- backdrop to problem

In an ideal world you are given some requirements for your application. Lets start there. Your design team has handed you some specs for a new web application they want for their machine learning team. After review, you create a list of the backend work that will need to be done to provide an api to service the webpage that the frontend team will be building. You identify the following requirements:

- API to receive a single image from a database
- API to receive custom tags from a database
- API to for user to post an image with a given tag
- API to receive what tags user has created

Pretty simple API to develop, so lets get started building and talk about some tips along the way.

- hand wave prereqs

We are going to move pass a few things that will need to be in place before you start with this. We are assuming you have an AWS environment and access to it, both through the web browser console and programmtic access set up with cli. We will also assume there is a database with some data available for use to use to test the apis we call. If you dont have that setup, the blog post will still show you what building a serverless app will look like, just dont expect it to work. :) Some instructions on how to set that up can be found in this (guide)[https://github.com/dwbelliston/imtag-serverless/tree/master/guide], so take a look at that if you need some pointers on how to get the aws environment and database setup.

# Developer Stop 1: Use tooling so you can build locally

A natural place to start building an api is with AWS Lambda web console. When you navigate to the console, there is a simple wizard you can use to create a function. This is great and works for simple functions, but you will soon find that it will quickly be less than adequate for working through building your api. You should choose a framework that will give you ability to run and test lambdas locally and then will aid you in packging those up and getting them to the cloud. Google (or Bing or AskJeeves) 'serverless frameworks' and you will see that there are many options. One that is provided by AWS is called AWS SAM. Lets use that for this tutorial.

Install AWS SAM through the (online docs)[https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html]

Once installed, you can get running serverless app with the 'init' command. This command will start you out with the following files:

`sam init --runtime python3.7`

```
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

(Example generated app) [https://github.com/dwbelliston/imtag-serverless/tree/master/fix-my-serverless-resources/fix-local-development]

This app is ready out of the box. You can start this up locally with the command:

`sam local start-api`

You can then invoke this function as its running through your borwser at "http://localhost:3000/hello"

Awesome! Lambdas running locally, starting out right. This will make it way easier to iterate over our code and get things in shape before deploying.

# Developer Stop 2: Use tooling to debug locally

I remember my early days of web development, `console.log()` was my best friend but, then, I was taught how to use the chrome debugger tool and I was reborn. Certainly logging has a place, but a step through debugger is crucial to those super tricky situations where you just wish you could pause time. Luckily, we can achieve that same goodness with our serverless apps.

AWS SAM and VS Code play nice together. Lets walk through setting up a debugging environment.

The AWS SAM docs are almost awesome. They got me pretty far, but a couple things were missing so It did not work for me. Start with the docs, which will help you set up `ptvsd`

  https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging-python.html

To set up `ptvsd` you will be walked through the pip install and then adding a snippet of python code to the function that looks like this.

```python
import ptvsd

# Enable ptvsd on 0.0.0.0 address and on port 5890 that we'll connect later with our IDE
ptvsd.enable_attach(address=('0.0.0.0', 5890), redirect_output=True)
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

After that configuration is finished you can now run `sam build` to get any of the latest code changes. `sam build` takes your function source, gets all the dependencies and packages it inside the .aws-sam directory.

Run

`sam build`

Now you code is in the .aws-sam folder, review it to see how it is built, double check the launch configuration you have above has a valid `localRoot` path mapping

Run

`sam local start-api -d 5890`

This will start the api, listening on the default port 3000 with a debug port open at 5890. I wasnt sure what this was doing at first, but basically that application is now available for the VS Code to latch on to it at port 5890, which is the same port we defined in the debug launch configuration

Go to browser and invoke the function

`http://localhost:3000/hello`

You can see in your terminal that the function stops. It is waiting at the point where our `ptvsd` code is waiting for attachment.

Now you can resume the debug with the debug feature in VS Code. Go to the debug pane and at the top select your launch configuration from the step above. This is where everything ties together. VS Code attaches to the debug port and takes you into the source code defined in the launch configuration.

Use the debug controls to navigate throught the code.

You are a time pausing wizard. At least in a small way.

# Developer Stop 3: Use tooling to package and deploy your app

The app is running locally, super! But we have heard enough of the whole 'It works on my machine' and dont want to add to that. AWS SAM makes this easy for us. You will need to create an S3 bucket for the zipped artifact first though.

`aws s3 mb s3://mybucket-for-serverless`

THe following commands will package the lambda function for us along with all its dependencies. AWS SAM is just cloud formation with some syntatic sugar. The 

- Build the app locally

  sam build

- Package the template, code is placed in S3 and Cloudformation

  sam package \
   --output-template-file packaged.yaml \
   --s3-bucket BUCKET_NAME

- Deploy the app through cloud formation stack

  sam deploy \
    --template-file packaged.yaml \
    --stack-name STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --region us-east-1

When you get more sophisticated there will be more that goes into building and deploying, but this is working great for us. SAM is going to package the lambda for us, create an artifact and setup that lambda behind an API Gateway. Where did the API Gateway come in? Check out the 'template.yaml' project folder and you can see that there are events tied to your function creation. The event type 'API' is what is creating the API Gateway.

Go to the console and check out what is created for Lambda, CloudFormation and Api Gateway. Make sure you are in the region set in your aws cli profile.

