#!/usr/bin/env tsx
/**
 * Compare old vs optimized metadata storage approaches
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

// Old approach - everything in metadata
const oldMetadata = {
  authorEmail: "adubuc@cloudgeometry.com",
  authorId: "712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e",
  authorName: "Antoine Dubuc",
  components: [],
  content: "[IMP] LinkedIn Connector\n\n LinkedIn is part of our Roadmap for Q2.  Initial research done  here . And documented in this Confluence page  here . Spike was done in    by Arthur.  Implement LinkedIn as a new data connector.   Bronze layer:   .  Deployed LinkedIn connector pipeline code. Deployed Gold and SQL Layers Connector documentation (schemas, mapping, logic, operations). Unit and integration tests.  Successfully reads LinkedIn bronze layer data. Correctly processes and populates required dashboard tables. Correctly populate Gold and SQL layer in both staging and PROD envs Implements robust error handling for pipeline failures (e.g., S3 access, data issues) and sufficient operational logging.  Link to the code files Documentation for the new connector for developers onboarding later on Examples of final data-api data (please share tables and queries to view on my own).",
  createdAt: 1749586383352,
  hasRichContent: true,
  issueType: "Story",
  labels: [],
  mentions: [],
  priority: "P2",
  relatedEmails: [],
  relatedPages: [],
  reporter: "712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e",
  searchableText: "DE-3397: [IMP] LinkedIn Connector [IMP] LinkedIn Connector\n\n LinkedIn is part of our Roadmap for Q2...",
  status: "In Progress",
  title: "DE-3397: [IMP] LinkedIn Connector",
  type: "jira_ticket",
  updatedAt: 1750865595143,
  urgencyLevel: "low",
  url: "undefined/browse/DE-3397"
};

// New approach - minimal metadata
const optimizedMetadata = {
  type: "jira_ticket",
  source: "jira",
  ticketKey: "DE-3397",
  projectKey: "DE",
  status: "In Progress",
  priority: "P2",
  authorId: "712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e",
  createdAt: 1749586383352,
  updatedAt: 1750865595143,
  hasAttachments: false,
  isUrgent: false
};

// Document data stored separately
const documentData = {
  id: "jira_ticket_DE-3397",
  title: "DE-3397: [IMP] LinkedIn Connector",
  content: "[IMP] LinkedIn Connector\n\n LinkedIn is part of our Roadmap for Q2...",
  url: "https://extendtv.atlassian.net/browse/DE-3397",
  author: {
    id: "712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e",
    name: "Antoine Dubuc",
    email: "adubuc@cloudgeometry.com"
  },
  assignee: {
    id: "712020:eeb0ae82-eac5-4ebb-a40f-7e1a46eb3a38",
    name: "Some User",
    email: "user@example.com"
  },
  attachments: [],
  components: [],
  customFields: {
    issueType: "Story",
    issueTypeId: "10001",
    statusId: "3",
    priorityId: "3",
    projectName: "Data Engineering"
  }
};

console.log('📊 METADATA STORAGE COMPARISON\n');
console.log('='*60 + '\n');

// Calculate sizes
const oldSize = JSON.stringify(oldMetadata).length;
const newSize = JSON.stringify(optimizedMetadata).length;
const docSize = JSON.stringify(documentData).length;

console.log('1️⃣ OLD APPROACH (Everything in Pinecone metadata):');
console.log(`   Size: ${oldSize.toLocaleString()} bytes`);
console.log(`   Fields: ${Object.keys(oldMetadata).length}`);
console.log('   Issues:');
console.log('   - Large content stored in metadata');
console.log('   - Duplicate searchableText field');
console.log('   - Non-filterable fields (url, names, emails)');
console.log('   - Performance impact on vector search');
console.log('   - Higher Pinecone storage costs');

console.log('\n2️⃣ OPTIMIZED APPROACH:');
console.log(`   Metadata size: ${newSize.toLocaleString()} bytes (${Math.round((1 - newSize/oldSize) * 100)}% reduction)`);
console.log(`   Metadata fields: ${Object.keys(optimizedMetadata).length}`);
console.log(`   Document store size: ${docSize.toLocaleString()} bytes`);
console.log(`   Total size: ${(newSize + docSize).toLocaleString()} bytes`);
console.log('   Benefits:');
console.log('   - Minimal metadata = faster queries');
console.log('   - Only filterable fields in Pinecone');
console.log('   - Full content in embeddings (searchable)');
console.log('   - Display data in separate store');
console.log('   - Easy to update without reindexing');

console.log('\n3️⃣ SEARCH PERFORMANCE:');
console.log('   Old: Vector search slowed by large metadata');
console.log('   New: Fast vector search + single document fetch');

console.log('\n4️⃣ EXAMPLE QUERIES:\n');

console.log('   Find DE tickets in progress:');
console.log('   filter: { projectKey: "DE", status: "In Progress" }');

console.log('\n   Find urgent tickets by Antoine:');
console.log('   filter: { authorId: "712020:...", isUrgent: true }');

console.log('\n   Find tickets updated this week:');
console.log('   filter: { updatedAt: { $gte: ' + new Date(Date.now() - 7*24*60*60*1000).getTime() + ' } }');

console.log('\n5️⃣ STORAGE COMPARISON:');
const numDocs = 1000;
console.log(`\n   For ${numDocs.toLocaleString()} documents:`);
console.log(`   Old approach: ${(oldSize * numDocs / 1024 / 1024).toFixed(2)} MB in Pinecone`);
console.log(`   New approach: ${(newSize * numDocs / 1024 / 1024).toFixed(2)} MB in Pinecone`);
console.log(`                + ${(docSize * numDocs / 1024 / 1024).toFixed(2)} MB in document store`);
console.log(`   Pinecone savings: ${((oldSize - newSize) * numDocs / 1024 / 1024).toFixed(2)} MB`);

console.log('\n6️⃣ METADATA FIELDS COMPARISON:\n');
console.log('   OLD METADATA:');
Object.keys(oldMetadata).forEach(key => {
  const value = (oldMetadata as any)[key];
  const size = JSON.stringify(value).length;
  const keep = ['type', 'source', 'ticketKey', 'projectKey', 'status', 'priority', 'authorId', 'createdAt', 'updatedAt'].includes(key);
  console.log(`   ${keep ? '✅' : '❌'} ${key}: ${size} bytes`);
});

console.log('\n   OPTIMIZED METADATA:');
Object.keys(optimizedMetadata).forEach(key => {
  const value = (optimizedMetadata as any)[key];
  const size = JSON.stringify(value).length;
  console.log(`   ✅ ${key}: ${size} bytes (filterable)`);
});

console.log('\n✨ RECOMMENDATION:');
console.log('   Use optimized approach for better performance and lower costs.');
console.log('   Store only filterable fields in Pinecone metadata.');
console.log('   Keep full document data in Redis/PostgreSQL.');