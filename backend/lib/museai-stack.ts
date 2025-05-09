import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MuseaiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table for notes
    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Keep the table when stack is destroyed
    });

    // Create DynamoDB table for tags
    const tagsTable = new dynamodb.Table(this, 'TagsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for syncing
    notesTable.addGlobalSecondaryIndex({
      indexName: 'updatedAt-index',
      partitionKey: { name: 'updatedAt', type: dynamodb.AttributeType.NUMBER },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Create Lambda functions
    const chatbotLambda = new lambda.Function(this, 'ChatbotFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        REGION: this.region,
      },
    });

    const notesLambda = new lambda.Function(this, 'NotesFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'notes.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        REGION: this.region,
        NOTES_TABLE: notesTable.tableName,
        TAGS_TABLE: tagsTable.tableName,
      },
    });

    // Add Bedrock permissions to Chatbot Lambda
    chatbotLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'bedrock:InvokeModel',
          'bedrock:ListFoundationModels',
          'bedrock:GetFoundationModel'
        ],
        resources: ['*'],
      })
    );

    // Add DynamoDB permissions to Notes Lambda
    notesTable.grantReadWriteData(notesLambda);
    tagsTable.grantReadWriteData(notesLambda);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'MuseaiApi', {
      restApiName: 'MuseAI API',
      description: 'API for MuseAI services',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
    });

    // Create usage plan
    const usagePlan = new apigateway.UsagePlan(this, 'MuseaiUsagePlan', {
      name: 'MuseAI Usage Plan',
      description: 'Usage plan for MuseAI API',
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
      quota: {
        limit: 1000,
        period: apigateway.Period.DAY,
      },
    });

    // Create API key
    const apiKey = new apigateway.ApiKey(this, 'MuseaiApiKey', {
      apiKeyName: 'MuseAI API Key',
      description: 'API Key for MuseAI API',
      enabled: true,
    });

    // Associate API key with usage plan
    usagePlan.addApiKey(apiKey);

    // Create API Gateway integrations
    const chatbotIntegration = new apigateway.LambdaIntegration(chatbotLambda);
    const notesIntegration = new apigateway.LambdaIntegration(notesLambda);

    // Add methods to API Gateway
    api.root.addResource('chat')
      .addMethod('POST', chatbotIntegration, {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
        apiKeyRequired: true,
      });

    const notesResource = api.root.addResource('notes');
    
    // Add POST method for saving and syncing notes
    notesResource.addMethod('POST', notesIntegration, {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
      apiKeyRequired: true,
    });

    // Add GET method for retrieving notes
    notesResource.addMethod('GET', notesIntegration, {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
      apiKeyRequired: true,
    });

    // Add DELETE method for deleting notes
    notesResource.addMethod('DELETE', notesIntegration, {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
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
