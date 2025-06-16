// src/app/api/responses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Exact implementation from working code
export async function POST(req: NextRequest) {
  const body = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Handle structured responses with JSON schema
  if (body.text?.format?.type === 'json_schema') {
    return await structuredResponse(openai, body);
  } else {
    return await textResponse(openai, body);
  }
}

async function structuredResponse(openai: OpenAI, body: any) {
  try {
    const response = await openai.chat.completions.create({
      model: body.model,
      messages: body.input,
      response_format: body.text?.format,
      tools: body.tools,
      stream: false,
    });
    
    const message = response.choices[0]?.message;
    return NextResponse.json({
      content: message?.content || '',
      finish_reason: response.choices[0]?.finish_reason,
    });
  } catch (err) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 }); 
  }
}

async function textResponse(openai: OpenAI, body: any) {
  try {
    const response = await openai.chat.completions.create({
      model: body.model,
      messages: body.input,
      tools: body.tools,
      stream: false,
    });

    const message = response.choices[0]?.message;
    
    if (message?.tool_calls && message.tool_calls.length > 0) {
      return NextResponse.json({
        content: message.content,
        tool_calls: message.tool_calls,
        finish_reason: response.choices[0]?.finish_reason,
      });
    } else {
      return NextResponse.json({
        content: message?.content || '',
        finish_reason: response.choices[0]?.finish_reason,
      });
    }
  } catch (err) {
    console.error('chat completion error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}