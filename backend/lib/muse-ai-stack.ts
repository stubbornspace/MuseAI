import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MuseAiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table for chat history
    const chatHistoryTable = new dynamodb.Table(this, 'ChatHistoryTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN for production
    });

    // Create Lambda function
    const chatbotLambda = new lambda.Function(this, 'ChatbotFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: chatHistoryTable.tableName,
      },
    });

    // Grant Lambda permissions to access DynamoDB
    chatHistoryTable.grantReadWriteData(chatbotLambda);

    // Grant Lambda permissions to access Bedrock
    chatbotLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'], // Consider restricting to specific models
    }));

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'ChatbotApi', {
      restApiName: 'MuseAI Chatbot API',
      description: 'API for MuseAI chatbot powered by Bedrock',
    });

    // Create API key
    const apiKey = new apigateway.ApiKey(this, 'ChatbotApiKey');

    // Create usage plan
    const usagePlan = new apigateway.UsagePlan(this, 'ChatbotUsagePlan', {
      name: 'Chatbot Usage Plan',
      apiStages: [{
        api,
        stage: api.deploymentStage,
      }],
    });

    // Add API key to usage plan
    usagePlan.addApiKey(apiKey);

    // Create API Gateway integration with Lambda
    const integration = new apigateway.LambdaIntegration(chatbotLambda);

    // Add resource and method to API Gateway
    const chatResource = api.root.addResource('chat');
    chatResource.addMethod('POST', integration, {
      apiKeyRequired: true,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MuseAiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
