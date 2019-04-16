# imtag-api-tags

Review the (Images API)[../imtag-api-images] for more detail on how to work with AWS SAM

```bash
# Package
sam package \
    --output-template-file packaged.yaml \
    --s3-bucket 1s-imtag-api-tags

# Deploy
aws cloudformation deploy \
  --template-file packaged.yaml \
  --stack-name imtag-api-tags \
  --parameter-overrides file://environments/dev.json \
  --capabilities CAPABILITY_IAM
```