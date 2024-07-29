
from aws_connect import AwsConnect


AWS_CONNECT = AwsConnect()

class ApiHandler():

    def handle_event(self, event, context):
        self.aws_connect = AWS_CONNECT
        print(self.aws_connect.boto_session)
        print(event)
        print(context)


def lambda_handler(event, context):

    api_handler = ApiHandler()
    response = api_handler.handle_event(event, context)

    return response


if __name__ == "__main__":

    lambda_handler({}, {})

