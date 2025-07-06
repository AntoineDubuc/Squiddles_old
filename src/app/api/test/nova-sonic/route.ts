import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { BedrockRuntimeClient, ListFoundationModelsCommand } = await import('@aws-sdk/client-bedrock-runtime');
    
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_BEDROCK_REGION || 'us-west-2',
    });

    // List available models to check if Nova Sonic is accessible
    const command = new ListFoundationModelsCommand({
      byProvider: 'Amazon'
    });

    const response = await client.send(command);
    
    // Check if Nova Sonic is in the list
    const novaSonicModels = response.modelSummaries?.filter(model => 
      model.modelId?.includes('nova-sonic')
    ) || [];

    return NextResponse.json({
      success: true,
      novaSonicAvailable: novaSonicModels.length > 0,
      novaSonicModels: novaSonicModels.map(model => ({
        modelId: model.modelId,
        modelName: model.modelName,
        providerName: model.providerName
      })),
      region: process.env.AWS_BEDROCK_REGION || 'us-west-2',
      totalAmazonModels: response.modelSummaries?.length || 0
    });

  } catch (error) {
    console.error('❌ Nova Sonic test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      novaSonicAvailable: false,
      awsConfigured: !!(
        process.env.AWS_REGION &&
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY
      )
    });
  }
}