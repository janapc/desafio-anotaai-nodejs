#!/usr/bin/env bash

echo "configure a new aws profile"
echo "==================="

PROFILE_NAME=localstack
AWS_ACCESS_KEY_ID=na
AWS_ACCESS_KEY_SECRET=na
AWS_REGION=us-east-1

aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID" --profile $PROFILE_NAME && \
aws configure set aws_secret_access_key "$AWS_ACCESS_KEY_SECRET" --profile $PROFILE_NAME && \
aws configure set region "$AWS_REGION" --profile $PROFILE_NAME && \
aws configure set output "json" --profile $PROFILE_NAME
