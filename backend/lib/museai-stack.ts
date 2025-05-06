import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MuseaiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const chatbotLambda = new lambda.Function(this, 'ChatbotFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        REGION: this.region,
      },
    });

    // Add Bedrock permissions to Lambda
    chatbotLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'bedrock:InvokeModel',
          'bedrock:ListFoundationModels',
          'bedrock:GetFoundationModel'
        ],
        resources: ['*'], // You might want to restrict this to specific model ARNs
      })
    );

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'ChatbotApi', {
      restApiName: 'Chatbot API',
      description: 'API for the Chatbot service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Create API Gateway integration
    const integration = new apigateway.LambdaIntegration(chatbotLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    // Add POST method to API Gateway
    api.root.addResource('chat')
      .addMethod('POST', integration, {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      });

    // Output the API endpoint
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MuseaiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
