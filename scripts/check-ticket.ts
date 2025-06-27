#!/usr/bin/env tsx
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

async function checkTicket(ticketKey: string) {
  const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}`;
  const auth = Buffer.from(`${process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    
    console.log(`Ticket: ${data.key}`);
    console.log(`Summary: ${data.fields.summary}`);
    console.log(`Status: ${data.fields.status.name}`);
    console.log(`Created: ${new Date(data.fields.created).toLocaleString()}`);
    console.log(`Updated: ${new Date(data.fields.updated).toLocaleString()}`);
    console.log(`Last Tuesday: ${new Date('2025-06-17').toLocaleString()}`);
    console.log(`Was updated since last Tuesday: ${new Date(data.fields.updated) >= new Date('2025-06-17') ? 'YES' : 'NO'}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTicket('DE-3397');