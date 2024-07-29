class ApiHandler():

    def handle_event(event, context):
        print(event)
        print(context)


def lambda_handler(self, event, context):

    api_handler = ApiHandler()
    response = api_handler.handle_event(event, context)

    return response


if __name__ == "__main__":

    lambda_handler({}, {})

