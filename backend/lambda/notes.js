import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand,
  DeleteCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
};

export const handler = async (event) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    switch (event.httpMethod) {
      case 'POST':
        const { action, note } = JSON.parse(event.body);
        switch (action) {
          case 'saveNote':
            return await saveNote(note);
          case 'syncNotes':
            return await syncNotes(note.lastSync);
          default:
            throw new Error('Invalid action');
        }
      case 'GET':
        return await getNotes();
      case 'DELETE':
        const { id } = JSON.parse(event.body);
        return await deleteNote(id);
      default:
        throw new Error(`Unsupported HTTP method: ${event.httpMethod}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function saveNote(note) {
  const timestamp = Date.now();
  const noteWithTimestamp = {
    ...note,
    id: note.id || `note_${timestamp}`,
    updatedAt: timestamp
  };

  await docClient.send(new PutCommand({
    TableName: process.env.NOTES_TABLE,
    Item: noteWithTimestamp
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(noteWithTimestamp)
  };
}

async function getNotes() {
  const result = await docClient.send(new ScanCommand({
    TableName: process.env.NOTES_TABLE
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result.Items)
  };
}

async function deleteNote(noteId) {
  await docClient.send(new DeleteCommand({
    TableName: process.env.NOTES_TABLE,
    Key: { id: noteId }
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'Note deleted successfully' })
  };
}

async function syncNotes(lastSync) {
  const result = await docClient.send(new ScanCommand({
    TableName: process.env.NOTES_TABLE,
    FilterExpression: 'updatedAt > :lastSync',
    ExpressionAttributeValues: {
      ':lastSync': lastSync || 0
    }
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      notes: result.Items,
      syncTimestamp: Date.now()
    })
  };
} 