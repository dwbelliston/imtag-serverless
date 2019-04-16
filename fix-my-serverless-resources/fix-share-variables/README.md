# Variable Stored

Many options are available for moving variables out of code and into other stores.

At the least, use lambdas environment variables for config variables.

Some options are

- ENV Variables
- Parameter Store
- Secrets Manager
- DynamoDb
- Anywhere else - if you can get to it

With Parameter store you can set it up like this for getting a secure string from ssm.
Make sure your lambda has a role that allows this.

```python
password = ssm_client.get_parameter(Name="DB_PASSWORD", WithDecryption=True)
```
