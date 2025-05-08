import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.REGION || "us-east-1" });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
};

// Nova pricing per 1K tokens (as of March 2024)
const PRICING = {
  input: 0.0001,  // $0.0001 per 1K input tokens
  output: 0.0002  // $0.0002 per 1K output tokens
};

function calculateCost(usage) {
  if (!usage) return { totalCost: 0, breakdown: {} };
  
  const inputCost = (usage.promptTokens / 1000) * PRICING.input;
  const outputCost = (usage.completionTokens / 1000) * PRICING.output;
  const totalCost = inputCost + outputCost;

  return {
    totalCost: parseFloat(totalCost.toFixed(6)),
    breakdown: {
      inputCost: parseFloat(inputCost.toFixed(6)),
      outputCost: parseFloat(outputCost.toFixed(6)),
      inputTokens: usage.promptTokens,
      outputTokens: usage.completionTokens,
      totalTokens: usage.totalTokens
    }
  };
}

export const handler = async (event) => {
  // Log the entire event
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Parse the request body from the event
    const { message } = JSON.parse(event.body);
    
    if (!message) {
      throw new Error('Message is required');
    }

    const input = {
      modelId: "amazon.nova-micro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inferenceConfig: {
          max_new_tokens: 1000
        },
        messages: [
          {
            role: "user",
            content: [
              {
                text: message
              }
            ]
          }
        ]
      })
    };

    console.log('Sending to Bedrock:', JSON.stringify(input, null, 2));

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString("utf-8"));

    console.log('Bedrock response:', JSON.stringify(responseBody, null, 2));

    // Calculate costs
    const costEstimate = calculateCost(responseBody.usage);

    const lambdaResponse = {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        message: responseBody.output?.message?.content?.[0]?.text || "No response generated",
        usage: responseBody.usage || {},
        cost: costEstimate
      }),
    };

    console.log('Sending response:', JSON.stringify(lambdaResponse, null, 2));
    return lambdaResponse;
  } catch (err) {
    console.error("Error invoking model:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Failed to invoke model",
        details: err.message 
      }),
    };
  }
};