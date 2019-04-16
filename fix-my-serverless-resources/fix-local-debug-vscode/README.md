# AWS SAM Debug with VS Code

I had a hard time setting it up. This is the guide I wish I found when looking for resources to help on this.

## Setup

The AWS SAM docs are almost awesome. They got me pretty far, but a couple things were missing so It did not work for me. Start with the docs, which will help you set up `ptvsd`

  https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging-python.html

To set up `ptvsd` you will be walked through the pip install and then adding a snippet of code to python that looks like this.

```python
import ptvsd

# Enable ptvsd on 0.0.0.0 address and on port 5890 that we'll connect later with our IDE
ptvsd.enable_attach(address=('0.0.0.0', 5890), redirect_output=True)
ptvsd.wait_for_attach()
```

With that in place your code is ready, but vscode now needs to be told how to work with the application. In vscode console you should see the debug icon on the far left pane, same location as where your file directory, search, extensions and git icon live. If you dont see it, right click that pane and toggle the debug icon on. Click the debug and open the debug pane.

You will need to add a launch configuration to vscode. This is a json definition that will tell vscode where to find the running application and then where the source code will be. With the debug pane open, click on the settings on the top left and add for python environment. There will be a few different configurations already in place, just add the configuration below, Make sure to add the correct `localRoot` which will be the path to the function inside the `.aws-sam` build (if you dont have the build, you can create that with `sam build`)

```json
{
  "name": "SAM CLI Python Imtag Api Images",
  "type": "python",
  "request": "attach",
  "port": 5890,
  "host": "localhost",
  "pathMappings": [
    {
      "localRoot": "${workspaceFolder}/imtag-api-images/.aws-sam/build/ImtagImagesGetFunction",
      "remoteRoot": "/var/task"
    }
  ]
}
```

After that configuration is finished you can now run the build to get any of the latest code changes. sam build takes your function source, gets all the dependencies and packages it inside the .aws-sam directory.

Run

`sam build`

Now you code is in the .aws-sam folder, review it to see how it is built, double check the launch configuration you have above has a valid `localRoot` path mapping

Run

`sam local start-api -d 5890`

This will start the api, listening on port 3000 with a debug port open at 5890. I wasnt sure what this was doing at first, but basically that application is now available for the vscode to latch on to it at port 5890, which is the same port we defined in the debug launch configuration

Go to browser and open the function, review the cloud formation to determine the path to the lambda functions api.

In my example it was `http://localhost:3000/tags` /tags being the path defined in the cloud formation template.

You can see in your terminal that the function stops. It is waiting at the point where our `ptvsd` code is waiting for attachment.

Now you can resume the debug with the debug feature in vscode. Go the the debug pane and at the top select your launch configuration from the step above. This is where everything ties together. Vscode attaches to the debug port and takes you into the source code defined in the launch configuration.

Use the debug controls to navigate throught the code.

---

## 1 gotcha

When you are debugging it takes you to the file in the .aws-sam directory, many times after debugging i would make changes to the code at the file it navigated to for me. Dont edit this one! WHen you do a new build it will be delete and written with the code from the top level directory. Make sure you are editing the application outside the build folder.
