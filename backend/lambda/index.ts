import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ChatRequest, ChatResponse, DynamoDBItem, BedrockRequest } from './types';

const bedrockClient = new BedrockRuntimeClient({});
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new Error('Request body is missing');
    }

    const request: ChatRequest = JSON.parse(event.body);
    const timestamp = Date.now();
    const conversationId = `${request.userId}-${timestamp}`;

    // Prepare messages for Bedrock
    const bedrockRequest: BedrockRequest = {
      modelId: 'anthropic.claude-v2', // Using Claude v2
      messages: request.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      maxTokens: 1000
    };

    // Call Bedrock
    const command = new InvokeModelCommand({
      modelId: bedrockRequest.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(bedrockRequest)
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const assistantMessage = responseBody.content[0].text;

    // Create response message
    const chatResponse: ChatResponse = {
      message: {
        role: 'assistant',
        content: assistantMessage,
        timestamp
      },
      conversationId
    };

    // Save to DynamoDB
    const dynamoItem: DynamoDBItem = {
      userId: request.userId,
      timestamp,
      conversationId,
      messages: [...request.messages, chatResponse.message]
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: dynamoItem
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(chatResponse)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}; 