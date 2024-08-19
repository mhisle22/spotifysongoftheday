
import json
from aws_connect import AwsConnect


AWS_CONNECT = AwsConnect() # pre-init

class ApiHandler():

    def create_successful_response(self, event, context, data=None):
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': self.get_request_origin(event=event),
                'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key,x-api-key,username',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Request handled successfully',
                'event': event,
                'context': str(context),
                'data': data
            })
        }
    
    def create_failure_response(self, event, context):
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': self.get_request_origin(event=event),
                'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
                'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key,x-api-key,username',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Invalid request',
                'event': event,
                'context': str(context)
            })
        }
    
    def handle_get_method(self, event, context):
        username = event.get('headers', {}).get('username')
        if username:
            response = self.aws_connect.get_playlist_from_dynamodb(username=username)
            print(response)
            return self.create_successful_response(event=event, context=context, data=response)
        else:
            print('get error case')
            return self.create_failure_response(event=event, context=context)
        
    def handle_post_method(self, event, context):
        body = json.loads(event.get('body', '{}'))
        songs = body.get('songs', [])
        id = body.get('id', '')
        limit = body.get('limit', None)
        if songs and id and limit:
            response = self.aws_connect.post_songs_to_playlist(songs=songs, id=id, limit=limit)
            print(response)
            return self.create_successful_response(event=event, context=context)
        else:
            print('post error case')
            return self.create_failure_response(event=event, context=context)
        
    def handle_event(self, event, context):
        try:
            self.aws_connect = AWS_CONNECT
            print(event)
            print(context)

            if (event.get('httpMethod') == 'OPTIONS'):
                print('handling options...')
                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': self.get_request_origin(event=event),
                        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
                        'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key,x-api-key,username',
                        'Content-Type': 'application/json',
                    },
                    'body': None
                }
            elif (event.get('httpMethod') == 'GET'):
                print('retrieving playlist...')
                return self.handle_get_method(event=event, context=context)
            elif (event.get('httpMethod') == 'POST'):
                print('posting playlist...')
                return self.handle_post_method(event=event, context=context)
            else:
                return self.create_failure_response(event=event, context=context)
        except Exception as e:
            print(e)
            return self.create_failure_response(event=event, context=context)
        
    def get_request_origin(self, event):

        try:
            request_origin = event['headers']['origin']
        except KeyError:
            request_origin = event['requestContext']['identity']['sourceIp']

        return request_origin

def lambda_handler(event, context):

    api_handler = ApiHandler()
    response = api_handler.handle_event(event, context)

    return response


if __name__ == "__main__":

    lambda_handler({}, {})

