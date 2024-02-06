#!/usr/bin/env bash

LOCALSTACK_ENDPOINT=http://localhost:4566
SQS_NAME=catalog-queue
SNS_TOPIC=catalog-topic
BUCKET_API=catalog-bucket
REGION=us-east-1
PROFILE_NAME=localstack
FUNCTION_NAME=catalog-consumer

echo "create sqs queue"
echo "==================="
aws --endpoint-url $LOCALSTACK_ENDPOINT sqs create-queue --queue-name $SQS_NAME --region $REGION --profile localstack --no-cli-pager

echo "create sns topic"
echo "==================="
aws --endpoint-url $LOCALSTACK_ENDPOINT sns create-topic --name $SNS_TOPIC --region $REGION --profile localstack --no-cli-pager

echo "notification sqs with sns"
echo "==================="
aws --endpoint-url $LOCALSTACK_ENDPOINT sns subscribe --topic-arn arn:aws:sns:$REGION:000000000000:$SNS_TOPIC --protocol \
sqs --notification-endpoint arn:aws:sqs:$REGION:000000000000:$SQS_NAME --region $REGION --profile localstack --no-cli-pager

echo "create s3 bucket api"
echo "==================="
aws --endpoint-url $LOCALSTACK_ENDPOINT s3api create-bucket --bucket $BUCKET_API --region $REGION --profile localstack --no-cli-pager

echo "create lambda function"
echo "==================="
aws --endpoint-url $LOCALSTACK_ENDPOINT lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime "nodejs18.x" \
    --role arn:aws:iam::123456789012:role/trigger \
    --environment "`cat $(PWD)/.aws-config/lambda_envs.json`" \
    --zip-file fileb://$(PWD)/lambda/dist/function.zip \
    --handler index.handler \
    --region $REGION --profile localstack --no-cli-pager

echo "event sqs to lambda function"
echo "==================="
aws --endpoint-url $LOCALSTACK_ENDPOINT lambda create-event-source-mapping \
 --batch-size 10 --maximum-batching-window-in-seconds 60 \
 --event-source-arn arn:aws:sqs:us-east-1:000000000000:$SQS_NAME \
 --function-name arn:aws:lambda:us-east-1:000000000000:function:$FUNCTION_NAME \
 --region $REGION --profile localstack --no-cli-pager