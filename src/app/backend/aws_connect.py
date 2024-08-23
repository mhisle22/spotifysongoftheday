import base64
from datetime import datetime
import os
from botocore.config import Config as BotoConfig
from boto3.session import Session

TABLE = 'SpotifySongsOfTheDay'

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

        self.table_name = TABLE

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

    def get_playlist_from_dynamodb(self, username):
        encoded_username = base64.b64encode(username.encode('utf-8')).decode('utf-8')
        
        expression_attribute_values = {
            ':username': {'S': encoded_username}
        }
        key_condition_expression = 'username = :username'
        projection_expression = 'username, URI, artist, link, song, suggestTime'

        response = self.dynamodb_client.query(
            TableName=TABLE,
            ExpressionAttributeValues=expression_attribute_values,
            KeyConditionExpression=key_condition_expression,
            ProjectionExpression=projection_expression
        )
        
        return response
    

    def post_songs_to_playlist(self, songs, id, limit):
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        max_items = 25

        encoded_username = base64.b64encode(id.encode('utf-8')).decode('utf-8')

        # Query existing items for the given username
        response = self.dynamodb_client.query(
            TableName=self.table_name,
            KeyConditionExpression='username = :username',
            ExpressionAttributeValues={':username': {'S': encoded_username}},
            ProjectionExpression='username, URI, suggestTime'
        )

        items = response.get('Items', [])

        # Sort items by suggestTime and remove the oldest if over the limit
        if len(items) + min(limit, 25) > max_items:
            items.sort(key=lambda x: x['suggestTime']['S'])
            items_to_delete = items[:len(items) + min(limit, 25) - max_items]

            for item in items_to_delete:
                self.dynamodb_client.delete_item(
                    TableName=self.table_name,
                    Key={
                        'username': item['username'],
                        'URI': item['URI']
                    }
                )

        # Prepare the new songs to add (up to 25)
        items_array = []
        for i in range(min(limit, 25)):
            item = {
                'PutRequest': {
                    'Item': {
                        'username': {'S': encoded_username},  # PK
                        'URI': {'S': songs[i]['uri']},  # SortKey
                        'artist': {'S': songs[i]['artist']},
                        'link': {'S': songs[i]['spotify_link']},
                        'song': {'S': songs[i]['song']},
                        'suggestTime': {'S': time}  # For sorting and trimming
                    }
                }
            }
            items_array.append(item)

        params = {
            'RequestItems': {
                self.table_name: items_array
            }
        }

        try:
            response = self.dynamodb_client.batch_write_item(RequestItems=params['RequestItems'])
            return response
        except Exception as e:
            print(f"Unable to add items. Error: {str(e)}")