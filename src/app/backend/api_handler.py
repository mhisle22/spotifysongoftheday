
import json
from aws_connect import AwsConnect


AWS_CONNECT = AwsConnect()

class ApiHandler():

    def handle_event(self, event, context):
        self.aws_connect = AWS_CONNECT
        print(self.aws_connect.boto_session)
        print(event)
        print(context)

        if (event.get('httpMethods') == 'OPTIONS'):
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': self.get_request_origin(event=event),
                    'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Api-Key,x-api-key',
                    'Content-Type': 'application/json',
                },
                'body': None
            }

        else:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': self.get_request_origin(event=event)
                },
                'body': json.dumps({
                    'message': 'Request handled successfully',
                    'event': event,
                    'context': str(context)
                })
            }
        
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

