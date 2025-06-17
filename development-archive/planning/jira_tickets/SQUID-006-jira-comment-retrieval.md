# SQUID-006: Implement Jira Comment Retrieval for Team Activity

## Description
Implement functionality to retrieve and display Jira comments from team tickets, with priority given to direct mentions. This feature will enable users to stay informed about discussions on their team's tickets and respond quickly to mentions.

## User Story
As a Product Manager, I want to see all comments on my team's tickets (prioritizing my mentions) so that I can stay informed about project discussions and respond promptly when my input is needed.

## Priority/Effort
- **Priority**: High
- **Story Points**: 8
- **Estimated Time**: 4-5 days

## Technical Approach
### Dependencies/Prerequisites
- Jira API access configured (API token in .env)
- User authentication system to identify current user
- Team/Project membership data available

### Architecture Notes
- Use Jira REST API (determine version based on available endpoints)
- Implement comment fetching for current sprint only
- Team definition: All tickets in projects where user is a member
- Store comments locally with future Pinecone integration planned
- No caching initially, sync every 15 minutes
- Handle Jira API rate limiting gracefully

### APIs/Data Models
```typescript
interface JiraComment {
  id: string;
  ticketId: string;
  ticketKey: string; // e.g., "PROD-234"
  author: {
    accountId: string;
    displayName: string;
    avatarUrl?: string;
  };
  body: string;
  created: string; // ISO date
  updated?: string;
  mentions: string[]; // Array of mentioned accountIds
  isDirectMention: boolean; // True if current user is mentioned
}

interface CommentFetchConfig {
  userId: string;
  projectKeys: string[]; // User's team projects
  sprintId?: string; // Current sprint
  lastSyncTime?: string;
}

interface UserPreferences {
  notificationSettings: {
    showMentions: boolean;
    showTeamComments: boolean;
    mutedTickets: string[];
  };
}
```

## Inputs
- User's Jira account ID
- User's team project keys
- Current sprint ID
- API authentication token from .env

## Outputs
- Sorted list of comments (mentions first, then chronological)
- Unread comment count
- Comment metadata (ticket info, author, timestamp)
- Mention highlighting in comment text

## Acceptance Criteria
- [ ] Retrieve all comments from current sprint tickets in user's projects
- [ ] Prioritize comments where user is @mentioned at the top
- [ ] Display comments with ticket context (ID, title, status)
- [ ] Sync comments every 15 minutes automatically
- [ ] Show visual indicator for direct mentions vs team comments
- [ ] Implement "dismiss" (X) functionality to hide comments
- [ ] Store user preferences for notification settings
- [ ] Handle Jira API errors gracefully with user-friendly messages
- [ ] Display relative timestamps (e.g., "2 hours ago")
- [ ] Support for parsing @mentions in comment body

## QA Tests
- [ ] Verify comments load for all team tickets in current sprint
- [ ] Confirm mentions appear at top of list regardless of timestamp
- [ ] Test 15-minute sync interval updates comment list
- [ ] Verify dismissed comments don't reappear until new activity
- [ ] Test error handling when Jira API is unavailable
- [ ] Verify comment text properly highlights @mentions
- [ ] Test filtering works with user preferences
- [ ] Confirm no duplicate comments appear after sync
- [ ] Test performance with 100+ comments
- [ ] Verify rate limiting doesn't break the feature

## Definition of Done
- [ ] Code implemented and tested
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed (self-review)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Performance acceptable

---

## Implementation Details (Post-Development)

### Code Created
**Files Modified/Created:**
- `path/to/file.js` - [Purpose and key functions]
- `path/to/file.css` - [Styling changes]

**Key Code Snippets:**
```javascript
// Explain what this does and why
function exampleFunction() {
  // Implementation with detailed comments for junior developers
}
```

### Problems and Solutions
**Problem 1:** [Description]
- **Root Cause:** 
- **Solution:** 
- **Why this approach:** 

### Udemy Tutorial Script
"In this lesson, we're going to implement [feature]. This is important because [context and business value].

First, let's understand what we're building. [Explain the feature from user perspective]

Now, let's look at the technical approach. We'll need to [list main steps]:
1. [Step 1 with explanation]
2. [Step 2 with explanation]

Let's start coding. Open your editor and create/modify [file]. Here's what we're going to write and why...

[Continue with step-by-step implementation narrative, explaining each decision and code block as if teaching a student]

Now let's test our implementation. Run [command] and you should see [expected result]. If you get [common error], here's how to fix it...

Great! We've successfully implemented [feature]. The key concepts we learned were [summarize learning objectives]. In the next lesson, we'll [preview next steps]."

---

## Implementation Notes

### Current Decisions:
1. **Scope**: All comments on team tickets in current sprint, mentions prioritized
2. **Team Definition**: Tickets in projects where user is a member
3. **Time Range**: Current sprint only
4. **Sync Frequency**: Every 15 minutes
5. **Storage**: Local storage for now, Pinecone integration planned
6. **UI**: Simple X to dismiss, user preferences for filtering

### Open Questions:
1. **Jira API Version**: Need to check what's available with current token
2. **Rate Limiting**: Research Jira's limits and implement backoff strategy
3. **Voice Commands**: To be determined in future iteration
4. **Real-time Updates**: Webhooks possible but not in initial version

### Future Enhancements:
1. Pinecone integration for comment search
2. Real-time updates via Jira webhooks
3. Voice command support ("Show my mentions", "Read team comments")
4. Smart summarization of long comment threads
5. Integration with notification system

### Technical Considerations:
```javascript
// Jira API endpoints to use:
// GET /rest/api/3/search - Get tickets in sprint
// GET /rest/api/3/issue/{issueIdOrKey}/comment - Get comments per ticket
// GET /rest/api/3/myself - Get current user info
// GET /rest/api/3/project/{projectIdOrKey} - Get project members

// Comment fetching strategy:
// 1. Get current sprint ID
// 2. Fetch all tickets in sprint for user's projects
// 3. For each ticket, fetch comments
// 4. Parse comments for @mentions
// 5. Sort by mention priority, then timestamp
// 6. Store locally with sync timestamp

// Rate limiting approach:
// - Implement exponential backoff
// - Queue requests to stay under limits
// - Show cached data if API unavailable
// - Log rate limit headers for monitoring
```

### Environment Variables Needed:
```bash
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-token-here
```