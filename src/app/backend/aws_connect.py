import os
from botocore.config import Config as BotoConfig
from boto3.session import Session

class AwsConnect(object):

    def __init__(self, boto3_session=None):

        self.boto_session = boto3_session
        self.boto_config = BotoConfig(retries={'max_attempts': 50, 'mode': 'standard'}, region_name='us-east-2')
        self.role = "spotifysongoftheday_lambda_role"

        if not self.boto_session:

            self.boto_session = self.get_boto3_session()

            self.sts_client = self.boto_session.client('sts', config=self.boto_config)
            self.aws_account_id = self.sts_client.get_caller_identity()['Account']

            if not os.environ.get("AWS_EXECUTION_ENV"):
                self.boto_session = self.get_boto3_session()

        self.apigw_client = self.boto_session.client('apigateway', config=self.boto_config)
        self.lambda_client = self.boto_session.client('lambda', config=self.boto_config)
        self.dynamodb_client = self.boto_session.client('dynamodb', config=self.boto_config)

    def get_boto3_session(self):

        try:

            if os.environ.get("AWS_EXECUTION_ENV"):
                print("Using the lambda's default session and role")
                return Session()
            
            try:
                response = self.sts_client.assume_role(
                    RoleArn='arn:aws:iam::%s:role/%s' % (self.aws_account_id, self.role),
                    RoleSessionName='local_dev'
                )

                session = Session(
                    aws_access_key_id=response['Credentials']['AccessKeyId'],
                    aws_secret_access_key=response['Credentials']['SecretAccessKey']
                )
                

            except Exception:

                session = Session(
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
                )

            return session
        
        except Exception:

            return Session()


