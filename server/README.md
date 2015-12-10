# votely-server

## Setup

Install dependencies by running `npm install`.

To start the server, execute `npm run`.

### Environment Variables

You must set the following environment variables:

- `AWS_BUCKET` - The name of the AWS bucket you want to upload images into.

### AWS User

Additionally, you should [set your AWS credentials][aws-credentials]. One easy way to do it is to set the following environment variables:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Tests

Tests are located in `./test`. To run tests, execute `npm test`.


<!-- Links -->

[aws-credentials]: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
