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
      // Enable API key requirement
      apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
    });

    // Create usage plan
    const usagePlan = new apigateway.UsagePlan(this, 'ChatbotUsagePlan', {
      name: 'Chatbot Usage Plan',
      description: 'Usage plan for the Chatbot API',
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
      // Set rate limits and quotas
      throttle: {
        rateLimit: 10, // requests per second
        burstLimit: 20, // maximum requests in a burst
      },
      quota: {
        limit: 1000, // requests per day
        period: apigateway.Period.DAY,
      },
    });

    // Create API key
    const apiKey = new apigateway.ApiKey(this, 'ChatbotApiKey', {
      apiKeyName: 'Chatbot API Key',
      description: 'API Key for Chatbot API',
      enabled: true,
    });

    // Associate API key with usage plan
    usagePlan.addApiKey(apiKey);

    // Create API Gateway integration
    const integration = new apigateway.LambdaIntegration(chatbotLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    // Add POST method to API Gateway with API key requirement
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
        // Require API key for this method
        apiKeyRequired: true,
      });

    // Output the API endpoint and API key
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'ApiKey', {
      value: apiKey.keyId,
      description: 'API Key ID',
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MuseaiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
