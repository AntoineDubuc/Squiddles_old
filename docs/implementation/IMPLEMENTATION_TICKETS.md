# Squiddles Implementation Tickets

## 🎯 **Ticket Creation Guidelines**
- Each ticket should take 2-4 hours for a junior developer
- Clear acceptance criteria with specific UI/UX requirements
- Testable with both unit tests and manual testing steps
- Minimal dependencies between tickets

---

## **EPIC 1: Core Data Infrastructure**

### **TICKET-001: Set up Enhanced User Types and Authentication**
**Priority**: Critical  
**Effort**: 3 hours  
**Dependencies**: None

**Description:**
Set up the core user data types and basic authentication system to support the dashboard UI.

**Acceptance Criteria:**
- [ ] Create `/src/lib/auth.ts` with user session management
- [ ] Implement `User` and `UserPreferences` types from ui-models.ts
- [ ] Create basic login/logout API endpoints
- [ ] Add user context provider for React components
- [ ] Create mock user data for development

**Technical Requirements:**
```typescript
// Must implement these interfaces:
interface User {
  id: string;
  name: string;
  email: string;
  role: 'pm' | 'tpm' | 'po' | 'eng' | 'sm' | 'other';
  avatarUrl?: string;
  preferences: UserPreferences;
}
```

**Files to Create:**
- `/src/lib/auth.ts`
- `/src/app/contexts/UserContext.tsx`
- `/src/app/api/auth/login/route.ts`
- `/src/app/api/auth/logout/route.ts`
- `/src/lib/mock-data/users.ts`

**Testing Requirements:**
- Unit test: User context provider state management
- Unit test: Auth API endpoints return correct data format
- Manual test: Login flow works with mock user
- Manual test: User preferences persist across page refreshes

**Definition of Done:**
- All TypeScript types compile without errors
- Mock user "Jordan Kim" can log in successfully
- User context is available throughout the app
- Tests pass with 100% coverage for auth functions

---

### **TICKET-002: Create Enhanced Ticket Data Models**
**Priority**: Critical  
**Effort**: 4 hours  
**Dependencies**: TICKET-001

**Description:**
Implement the ticket data structure with voice integration support to replace the basic Pinecone ticket model.

**Acceptance Criteria:**
- [ ] Implement `EnhancedTicket`, `Comment`, and `TicketSection` types
- [ ] Create ticket validation schemas using Zod
- [ ] Build mock ticket data for development (minimum 10 tickets)
- [ ] Create ticket utilities for filtering and sorting
- [ ] Add ticket status and priority enums

**Technical Requirements:**
```typescript
// Must support these ticket operations:
const ticket = createTicket(ticketData);
const filtered = filterTickets(tickets, { status: 'in_progress' });
const sorted = sortTickets(tickets, 'priority', 'desc');
```

**Files to Create:**
- `/src/lib/tickets/types.ts`
- `/src/lib/tickets/validation.ts`
- `/src/lib/tickets/utils.ts`
- `/src/lib/mock-data/tickets.ts`
- `/src/lib/mock-data/comments.ts`

**Mock Data Requirements:**
- 3 tickets with status 'in_progress'
- 2 tickets with status 'done'
- 5 tickets with status 'todo'
- Each ticket has 2-4 comments
- Tickets span multiple types (story, bug, task)

**Testing Requirements:**
- Unit test: Ticket validation accepts valid tickets
- Unit test: Ticket validation rejects invalid data
- Unit test: Filtering works for each ticket property
- Unit test: Sorting works for priority, date, title
- Manual test: Mock data displays correctly in console

**Definition of Done:**
- All ticket operations work with TypeScript intellisense
- Mock data includes realistic Jira-style ticket keys (PROD-001, etc.)
- Validation catches common data errors
- Utility functions handle edge cases (empty arrays, null values)

---

### **TICKET-003: Set up Sprint and Project Data Models**
**Priority**: High  
**Effort**: 3 hours  
**Dependencies**: TICKET-002

**Description:**
Create sprint and project data structures to support dashboard metrics and ticket organization.

**Acceptance Criteria:**
- [ ] Implement `Sprint` and `Project` types
- [ ] Create sprint utilities for metrics calculation
- [ ] Build mock project and sprint data
- [ ] Add sprint capacity and velocity calculations
- [ ] Create project-ticket relationship utilities

**Technical Requirements:**
```typescript
// Must calculate these metrics:
const sprintMetrics = calculateSprintMetrics(sprint);
// Returns: { completedPoints, totalPoints, completionPercentage, daysLeft }

const projectSummary = getProjectSummary(project);
// Returns: { totalTickets, activeTickets, completedThisWeek }
```

**Files to Create:**
- `/src/lib/projects/types.ts`
- `/src/lib/projects/utils.ts`
- `/src/lib/sprints/utils.ts`
- `/src/lib/mock-data/projects.ts`
- `/src/lib/mock-data/sprints.ts`

**Mock Data Requirements:**
- 2 projects: "Product Core" and "E-commerce Platform"
- 1 active sprint with 7 days remaining
- Sprint includes 6 tickets totaling 25 story points
- 3 tickets completed (13 points), 3 in progress (12 points)

**Testing Requirements:**
- Unit test: Sprint metrics calculate correctly
- Unit test: Project summary aggregates ticket data
- Unit test: Date calculations for sprint timeline
- Manual test: Dashboard metrics match expected values

**Definition of Done:**
- Sprint velocity and capacity calculations are accurate
- Project-ticket relationships work correctly
- Mock data reflects realistic sprint planning
- All date calculations handle timezone differences

---

## **EPIC 2: Dashboard Implementation**

### **TICKET-004: Create Dashboard Layout Component**
**Priority**: Critical  
**Effort**: 4 hours  
**Dependencies**: TICKET-001

**Description:**
Build the main dashboard layout structure with header, navigation, and collapsible panels matching the mockup design.

**Acceptance Criteria:**
- [ ] Create responsive dashboard layout component
- [ ] Implement collapsible left and right panels
- [ ] Add header with user info and global voice button
- [ ] Create navigation breadcrumbs
- [ ] Add panel toggle animations (0.3s transition)

**Component Structure:**
```tsx
<DashboardLayout>
  <Header user={user} onVoiceClick={handleVoice} />
  <Breadcrumb path={["Dashboard"]} />
  <MainContent>
    <LeftPanel collapsible={true} />
    <CenterPanel />
    <RightPanel collapsible={true} />
  </MainContent>
</DashboardLayout>
```

**Files to Create:**
- `/src/app/components/dashboard/DashboardLayout.tsx`
- `/src/app/components/dashboard/Header.tsx`
- `/src/app/components/dashboard/Breadcrumb.tsx`
- `/src/app/components/dashboard/CollapsiblePanel.tsx`

**Design Requirements:**
- Matches mockup color scheme (dark theme with glass morphism)
- Panel toggle buttons on edges (‹ › arrows)
- Auto-collapse panels on screens < 1200px width
- Smooth CSS transitions for all animations

**Testing Requirements:**
- Unit test: Panel collapse/expand state management
- Unit test: Responsive behavior at different screen sizes
- Visual test: Compare with mockup screenshot
- Manual test: Panel animations are smooth
- Manual test: Header navigation works

**Definition of Done:**
- Layout matches product-manager-dashboard-v3.html mockup
- All animations run at 60fps
- Component is fully responsive
- Passes accessibility audit (keyboard navigation)

---

### **TICKET-005: Implement Dashboard Metrics Cards**
**Priority**: High  
**Effort**: 3 hours  
**Dependencies**: TICKET-003, TICKET-004

**Description:**
Create metrics cards for the dashboard showing user statistics, sprint progress, and team velocity.

**Acceptance Criteria:**
- [ ] Create MetricsCard component with consistent styling
- [ ] Display user ticket counts (total, active, completed this week)
- [ ] Show sprint progress with visual progress bar
- [ ] Add team velocity and capacity metrics
- [ ] Include loading and error states

**Component API:**
```tsx
<MetricsCard
  title="Sprint Progress"
  value="13/25"
  subtitle="Story Points"
  progress={52}
  trend="up"
  loading={false}
/>
```

**Files to Create:**
- `/src/app/components/dashboard/MetricsCard.tsx`
- `/src/app/components/dashboard/ProgressBar.tsx`
- `/src/app/components/dashboard/MetricsGrid.tsx`
- `/src/hooks/useDashboardMetrics.ts`

**Visual Requirements:**
- Glass morphism effect with subtle borders
- Color-coded progress bars (green: >75%, yellow: 50-75%, red: <50%)
- Trend indicators with up/down arrows
- Consistent spacing and typography

**Testing Requirements:**
- Unit test: Metrics calculations from mock data
- Unit test: Progress bar percentage calculations
- Unit test: Loading and error states render correctly
- Visual test: Cards match mockup styling
- Manual test: Hover effects work

**Definition of Done:**
- All metrics display real data from mock sprint/tickets
- Progress bars animate smoothly when values change
- Cards are responsive and accessible
- Error boundaries handle data loading failures

---

### **TICKET-006: Build Voice Activation Hero Section**
**Priority**: Critical  
**Effort**: 4 hours  
**Dependencies**: TICKET-004

**Description:**
Implement the prominent voice activation button in the "What would you like to do?" section with interactive states.

**Acceptance Criteria:**
- [ ] Create large, prominent voice button with microphone icon
- [ ] Implement voice states: idle → listening → processing → action
- [ ] Add pulsing animation during listening state
- [ ] Show voice transcript feedback
- [ ] Simulate voice command processing with realistic timing

**Voice States:**
```typescript
type VoiceState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

interface VoiceButtonProps {
  state: VoiceState;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  transcript?: string;
}
```

**Files to Create:**
- `/src/app/components/dashboard/VoiceHeroButton.tsx`
- `/src/app/components/dashboard/VoiceTranscript.tsx`
- `/src/hooks/useVoiceActivation.ts`
- `/src/lib/voice/simulation.ts`

**Interaction Flow:**
1. **Idle**: "Just ask me" + "Press Space or click to speak"
2. **Listening**: Red pulsing + "Listening..." (2 seconds)
3. **Processing**: "Processing..." + show transcript (2 seconds)
4. **Success**: "Creating ticket..." + redirect to creation page

**Testing Requirements:**
- Unit test: Voice state transitions work correctly
- Unit test: Keyboard shortcut (Space) activates voice
- Unit test: Simulation timing matches expectations
- Manual test: Animations are smooth and engaging
- Manual test: Voice button works on mobile (touch)

**Definition of Done:**
- Button matches dashboard mockup exactly
- All voice states have appropriate visual feedback
- Keyboard accessibility fully implemented
- Button redirects to ticket creation after voice processing

---

### **TICKET-007: Create Activity Feed Component**
**Priority**: High  
**Effort**: 3 hours  
**Dependencies**: TICKET-002

**Description:**
Build the activity feed showing recent ticket updates, comments, and mentions with real-time styling.

**Acceptance Criteria:**
- [ ] Create scrollable activity feed component
- [ ] Display different activity types with appropriate icons
- [ ] Show relative timestamps ("2 minutes ago")
- [ ] Add user avatars and actions
- [ ] Implement unread/read states

**Activity Types:**
- Comment added 💬
- Ticket updated 📝
- Status changed 🔄
- User mentioned 📌
- Ticket assigned 👤

**Component Structure:**
```tsx
<ActivityFeed activities={activities} maxHeight="400px">
  <ActivityItem
    type="comment"
    actor="Jordan Kim"
    action="commented on"
    target="PROD-234"
    timestamp={timestamp}
    unread={true}
  />
</ActivityFeed>
```

**Files to Create:**
- `/src/app/components/dashboard/ActivityFeed.tsx`
- `/src/app/components/dashboard/ActivityItem.tsx`
- `/src/lib/utils/timeFormat.ts`
- `/src/lib/mock-data/activities.ts`

**Testing Requirements:**
- Unit test: Time formatting for various intervals
- Unit test: Activity grouping by date
- Unit test: Unread state management
- Manual test: Smooth scrolling performance
- Manual test: Activity items clickable and navigable

**Definition of Done:**
- Feed displays 20+ realistic activity items
- Timestamps update automatically
- Unread items have visual distinction
- Component handles empty states gracefully

---

## **EPIC 3: Ticket Creation Interface**

### **TICKET-008: Create Ticket Form Layout**
**Priority**: Critical  
**Effort**: 4 hours  
**Dependencies**: TICKET-002, TICKET-004

**Description:**
Build the main ticket creation form layout with voice input area, type selector, and dynamic sections.

**Acceptance Criteria:**
- [ ] Create three-column layout (context | form | actions)
- [ ] Add voice input area with microphone button
- [ ] Implement ticket type selector with icons
- [ ] Create basic form fields (title, description)
- [ ] Add collapsible panels from TICKET-004

**Form Structure:**
```tsx
<TicketCreationLayout>
  <ContextPanel /> {/* Recent discussions, metrics */}
  <FormPanel>
    <VoiceInputArea />
    <TypeSelector />
    <TitleField />
    <DescriptionField />
    <DynamicSections />
  </FormPanel>
  <ActionsPanel /> {/* Create button, templates */}
</TicketCreationLayout>
```

**Files to Create:**
- `/src/app/components/tickets/TicketCreationLayout.tsx`
- `/src/app/components/tickets/VoiceInputArea.tsx`
- `/src/app/components/tickets/TypeSelector.tsx`
- `/src/app/components/tickets/FormField.tsx`

**Design Requirements:**
- Matches product-manager-create-v2.html mockup
- Form fields have glass morphism styling
- Type selector highlights auto-detect option
- Voice input area is prominent and accessible

**Testing Requirements:**
- Unit test: Form state management
- Unit test: Type selection updates form
- Visual test: Layout matches mockup
- Manual test: Form is keyboard accessible
- Manual test: Voice button responds to clicks

**Definition of Done:**
- Layout is pixel-perfect to mockup
- Form handles validation states
- All interactive elements work smoothly
- Component is fully responsive

---

### **TICKET-009: Implement Dynamic Ticket Sections**
**Priority**: High  
**Effort**: 3 hours  
**Dependencies**: TICKET-008

**Description:**
Create dynamic form sections that change based on ticket type (story, bug, task, spike, epic).

**Acceptance Criteria:**
- [ ] Add type-specific sections when ticket type changes
- [ ] Implement section templates for each ticket type
- [ ] Allow adding/removing custom sections
- [ ] Validate required sections per ticket type

**Section Templates:**
- **Story**: User Story template + Acceptance Criteria
- **Bug**: Steps to Reproduce + Expected vs Actual + Environment
- **Task**: Task Details + Definition of Done
- **Spike**: Research Goal + Time Box + Expected Outputs

**Component API:**
```tsx
<DynamicSections
  ticketType="bug"
  sections={sections}
  onSectionAdd={handleAdd}
  onSectionRemove={handleRemove}
  onSectionUpdate={handleUpdate}
/>
```

**Files to Create:**
- `/src/app/components/tickets/DynamicSections.tsx`
- `/src/app/components/tickets/SectionTemplate.tsx`
- `/src/lib/tickets/sectionTemplates.ts`
- `/src/lib/tickets/validation.ts`

**Testing Requirements:**
- Unit test: Section templates load correctly per type
- Unit test: Adding/removing sections updates state
- Unit test: Validation works for required sections
- Manual test: Smooth transitions when changing types
- Manual test: Form submission includes all section data

**Definition of Done:**
- All 5 ticket types have appropriate sections
- Section transitions are animated smoothly
- Form validation prevents submission with missing required sections
- Section templates match Jira/Agile best practices

---

### **TICKET-010: Add Voice Integration to Ticket Creation**
**Priority**: Critical  
**Effort**: 4 hours  
**Dependencies**: TICKET-009

**Description:**
Integrate voice commands with ticket creation form, allowing voice input to populate form fields and select ticket types.

**Acceptance Criteria:**
- [ ] Voice button activates speech recognition simulation
- [ ] Voice commands auto-detect ticket type
- [ ] Transcript populates form fields automatically
- [ ] Voice states update UI with feedback
- [ ] Support "continue editing" after voice input

**Voice Commands to Support:**
- "Create a bug report for checkout issues"
- "I need a user story for authentication"
- "Create a task to update the API documentation"
- "Add a spike to research payment options"

**Voice Processing Flow:**
```typescript
const processVoiceCommand = (transcript: string) => {
  const intent = detectIntent(transcript);
  const ticketType = extractTicketType(transcript);
  const fields = extractFields(transcript);
  
  updateForm({ type: ticketType, ...fields });
};
```

**Files to Create:**
- `/src/lib/voice/ticketCommands.ts`
- `/src/lib/voice/intentDetection.ts`
- `/src/hooks/useVoiceTicketCreation.ts`
- `/src/app/components/tickets/VoiceProcessor.tsx`

**Testing Requirements:**
- Unit test: Intent detection for each ticket type
- Unit test: Field extraction from voice transcript
- Unit test: Form updates correctly after voice input
- Manual test: Voice flow feels natural and responsive
- Manual test: Error handling for unclear voice commands

**Definition of Done:**
- Voice successfully creates different ticket types
- Form fields populate accurately from voice input
- User can edit form after voice input
- Voice errors provide helpful feedback

---

## **EPIC 4: Settings and Configuration**

### **TICKET-011: Create Settings Layout and Navigation**
**Priority**: Medium  
**Effort**: 3 hours  
**Dependencies**: TICKET-004

**Description:**
Build the settings page layout with tabbed navigation for different configuration sections.

**Acceptance Criteria:**
- [ ] Create settings page layout with sidebar navigation
- [ ] Add tabs for Voice, Integrations, Notifications, Account
- [ ] Implement active tab highlighting
- [ ] Add breadcrumb navigation
- [ ] Create consistent form styling

**Settings Sections:**
1. **Voice Settings** - Audio configuration and voice preferences
2. **Integrations** - Jira, Slack, Pinecone connections
3. **Notifications** - Email, browser, mention preferences
4. **Account** - Profile, password, preferences

**Files to Create:**
- `/src/app/settings/layout.tsx`
- `/src/app/components/settings/SettingsNav.tsx`
- `/src/app/components/settings/SettingsTab.tsx`
- `/src/app/components/settings/SettingsForm.tsx`

**Design Requirements:**
- Matches settings-configuration.html mockup
- Tab transitions are smooth
- Form fields have consistent validation styling
- Save/cancel buttons are clearly visible

**Testing Requirements:**
- Unit test: Tab navigation state management
- Unit test: Active tab persistence on refresh
- Visual test: Layout matches mockup
- Manual test: Keyboard navigation between tabs
- Manual test: Form validation visual feedback

**Definition of Done:**
- Settings page accessible via navigation
- All tabs render with placeholder content
- Tab state persists during navigation
- Layout is fully responsive

---

### **TICKET-012: Implement Voice Settings Configuration**
**Priority**: High  
**Effort**: 4 hours  
**Dependencies**: TICKET-011

**Description:**
Create the voice settings tab with audio device selection, quality settings, and voice activation preferences.

**Acceptance Criteria:**
- [ ] Add microphone/speaker device selection dropdowns
- [ ] Implement audio quality slider (low/standard/high/premium)
- [ ] Add sensitivity and push-to-talk controls
- [ ] Create voice test functionality
- [ ] Show real-time audio level indicator

**Voice Settings Form:**
```tsx
<VoiceSettingsForm>
  <DeviceSelector type="input" devices={inputDevices} />
  <DeviceSelector type="output" devices={outputDevices} />
  <QualitySlider value={quality} onChange={setQuality} />
  <SensitivityControl value={sensitivity} />
  <ToggleSwitch label="Push to Talk" checked={pushToTalk} />
  <VoiceTest onTest={handleVoiceTest} />
</VoiceSettingsForm>
```

**Files to Create:**
- `/src/app/components/settings/VoiceSettings.tsx`
- `/src/app/components/settings/DeviceSelector.tsx`
- `/src/app/components/settings/AudioLevelMeter.tsx`
- `/src/app/components/settings/VoiceTest.tsx`

**Testing Requirements:**
- Unit test: Form state updates correctly
- Unit test: Device enumeration works
- Unit test: Audio level detection
- Manual test: Voice test provides clear feedback
- Manual test: Settings save and persist

**Definition of Done:**
- All voice settings save to user preferences
- Voice test demonstrates audio input/output
- Audio level meter responds to microphone input
- Settings integrate with voice activation throughout app

---

### **TICKET-013: Build Integration Status Dashboard**
**Priority**: High  
**Effort**: 4 hours  
**Dependencies**: TICKET-011

**Description:**
Create the integration management interface showing connection status, health metrics, and configuration options.

**Acceptance Criteria:**
- [ ] Display integration cards for Jira, Slack, Pinecone, OpenAI
- [ ] Show connection status with colored indicators
- [ ] Add health metrics (uptime, response time, error rate)
- [ ] Implement test connection functionality
- [ ] Create setup wizard for new integrations

**Integration Status Card:**
```tsx
<IntegrationCard
  type="jira"
  name="Jira Software"
  status="connected"
  url="company.atlassian.net"
  metrics={{ uptime: 99.2, responseTime: 850, errorRate: 2.1 }}
  onTest={handleTest}
  onConfigure={handleConfigure}
/>
```

**Files to Create:**
- `/src/app/components/settings/IntegrationDashboard.tsx`
- `/src/app/components/settings/IntegrationCard.tsx`
- `/src/app/components/settings/HealthMetrics.tsx`
- `/src/app/components/settings/IntegrationSetup.tsx`

**Testing Requirements:**
- Unit test: Status indicators update correctly
- Unit test: Health metrics calculate properly
- Unit test: Test connection provides feedback
- Manual test: Setup wizard completes successfully
- Manual test: Error states display helpful messages

**Definition of Done:**
- All integration types display with realistic data
- Test connection simulates actual API calls
- Setup wizard guides user through configuration
- Integration status updates reflect in other parts of app

---

## **EPIC 5: Error Handling and Recovery**

### **TICKET-014: Create Error Boundary Components**
**Priority**: Medium  
**Effort**: 3 hours  
**Dependencies**: None

**Description:**
Implement comprehensive error boundaries for graceful error handling with recovery options.

**Acceptance Criteria:**
- [ ] Create reusable ErrorBoundary component
- [ ] Add different error UI for different error types
- [ ] Implement error recovery actions (retry, reset, report)
- [ ] Log errors for debugging and monitoring
- [ ] Create error state illustrations

**Error Types to Handle:**
- Network/API errors
- Voice processing errors  
- Authentication errors
- Integration failures
- Unexpected crashes

**Files to Create:**
- `/src/app/components/common/ErrorBoundary.tsx`
- `/src/app/components/common/ErrorFallback.tsx`
- `/src/lib/errors/errorHandler.ts`
- `/src/lib/errors/errorRecovery.ts`

**Testing Requirements:**
- Unit test: Error boundary catches errors correctly
- Unit test: Recovery actions work as expected
- Unit test: Error logging captures necessary info
- Manual test: Error UI is user-friendly
- Manual test: Recovery options restore functionality

**Definition of Done:**
- Error boundaries wrap all major components
- Error messages are clear and actionable
- Recovery options work reliably
- Error logging helps with debugging

---

## **Quality Assurance Requirements**

### **Code Quality Standards:**
- TypeScript strict mode enabled
- ESLint and Prettier configured
- 90%+ test coverage for business logic
- All props and functions documented with JSDoc
- Consistent naming conventions throughout

### **Performance Requirements:**
- Component render time < 16ms (60fps)
- Initial page load < 2 seconds
- Voice processing feedback < 500ms
- Smooth animations at 60fps
- Bundle size impact < 100KB per component

### **Accessibility Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Screen reader compatibility
- High contrast support
- Focus management during navigation

### **Browser Support:**
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## **Getting Started for Junior Developers**

### **Setup Checklist:**
1. Clone repository and install dependencies
2. Run `npm run dev` to start development server
3. Read `/src/app/types/ui-models.ts` for data structures
4. Review existing components in `/src/app/components/`
5. Start with TICKET-001 (User Authentication)

### **Development Workflow:**
1. Create feature branch: `git checkout -b feature/TICKET-XXX`
2. Implement ticket requirements
3. Write unit tests
4. Test manually using provided test cases
5. Submit PR with detailed description
6. Address code review feedback

### **Testing Commands:**
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
npm run lint          # Check code style
npm run type-check    # TypeScript validation
```

Each ticket is designed to be completed by a junior developer in 2-4 hours with clear acceptance criteria and comprehensive testing requirements.