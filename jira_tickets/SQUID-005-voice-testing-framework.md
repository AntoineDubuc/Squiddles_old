# Implement Voice Interface for Browser Testing

## Description
Create a complete web-based voice interface application using Next.js and React that enables browser testing of the Squiddles agent system with OpenAI Realtime API integration.

## User Story
As a Technical Product Manager, I want a browser-based voice interface so that I can test the complete Squiddles agent workflow through natural voice interaction and see all agents working together in real-time.

## Priority/Effort
- **Priority**: High
- **Story Points**: 8
- **Estimated Time**: 3-4 days

## Technical Approach
### Dependencies/Prerequisites
- OpenAI TTS API access for test audio generation
- Jest testing framework setup
- Puppeteer for browser automation
- Core tentacle system for testing voice workflows

### Architecture Notes
- Test audio generation system using OpenAI TTS with multiple voices
- Automated testing runner with Jest + Puppeteer integration
- Mock MediaDevices.getUserMedia for controlled audio input
- Performance benchmarking and accuracy measurement tools

### APIs/Data Models
- Test scenario definitions with expected outcomes
- Audio file naming conventions and metadata
- Test result reporting with accuracy metrics
- CI/CD integration configuration

## Inputs
- Test scenario library (voice commands and expected responses)
- Voice variation parameters (speed, accent, background noise)
- Performance benchmarks and accuracy thresholds
- Browser compatibility requirements

## Outputs
- Generated test audio files for 50+ scenarios
- Automated test suite with Jest integration
- Performance dashboard with accuracy metrics
- CI/CD pipeline configuration for voice regression testing

## Acceptance Criteria
- [ ] Generate test audio files using OpenAI TTS with multiple voice variations
- [ ] Automated test runner executes voice scenarios in headless browser
- [ ] Accuracy measurement compares transcription with expected results
- [ ] Performance benchmarking measures response times and latency
- [ ] CI/CD integration runs tests on code changes
- [ ] Developer testing panel in UI for manual verification
- [ ] Test results reporting with detailed failure analysis
- [ ] Regression detection prevents voice accuracy degradation

## QA Tests
- [ ] Generate test audio for basic voice commands and verify quality
- [ ] Run automated test suite and validate accuracy measurements
- [ ] Test with different browser environments and audio configurations
- [ ] Verify CI/CD integration triggers tests on pull requests
- [ ] Test developer panel functionality and real-time results
- [ ] Validate error handling for missing audio files or test failures

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
- `tests/voice/audio-generator.ts` - OpenAI TTS integration for generating test audio files with multiple voice variations and scenarios
- `tests/voice/voice-test-runner.ts` - Jest + Puppeteer automation framework for voice command testing with accuracy measurement
- `tests/voice/test-scenarios.ts` - Comprehensive library of 50+ voice command scenarios with expected outcomes
- `src/components/VoiceTestPanel.tsx` - Developer testing interface for manual voice testing and result visualization
- `.github/workflows/voice-tests.yml` - CI/CD configuration for automated voice testing on code changes

**Key Code Snippets:**
```typescript
// Test audio generation system
interface TestScenario {
  id: string;
  text: string;
  expectedTranscription: string;
  expectedIntent: string;
  category: 'creation' | 'management' | 'communication';
  priority: 'high' | 'medium' | 'low';
}

const generateTestAudio = async (scenario: TestScenario, voice: string, speed: number) => {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice as any,
    input: scenario.text,
    speed: speed,
    response_format: "wav"
  });
  
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `${scenario.id}_${voice}_${speed}_clean.wav`;
  fs.writeFileSync(`tests/audio/${filename}`, buffer);
  
  return { filename, scenario, voice, speed };
};

// Automated voice testing framework
const runVoiceTest = async (audioFile: string, expectedResult: any) => {
  const page = await browser.newPage();
  
  // Mock getUserMedia with test audio
  await page.evaluateOnNewDocument(() => {
    navigator.mediaDevices.getUserMedia = jest.fn().mockResolvedValue(mockAudioStream);
  });
  
  await page.goto('http://localhost:3000');
  
  // Trigger voice input with test audio
  await page.evaluate((audioFile) => {
    // Simulate audio input
    window.testAudioInput(audioFile);
  }, audioFile);
  
  // Wait for transcription and measure accuracy
  const transcription = await page.waitForSelector('[data-testid="transcription"]');
  const result = await transcription.textContent();
  
  const accuracy = calculateAccuracy(expectedResult.transcription, result);
  return { audioFile, expected: expectedResult, actual: result, accuracy };
};

// Performance benchmarking
const benchmarkVoice = async (testSuite: TestScenario[]) => {
  const results = [];
  
  for (const scenario of testSuite) {
    const startTime = Date.now();
    const result = await runVoiceTest(`${scenario.id}_alloy_1.0_clean.wav`, scenario);
    const endTime = Date.now();
    
    results.push({
      scenario: scenario.id,
      accuracy: result.accuracy,
      responseTime: endTime - startTime,
      category: scenario.category
    });
  }
  
  return {
    averageAccuracy: results.reduce((sum, r) => sum + r.accuracy, 0) / results.length,
    averageResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
    categoryBreakdown: groupBy(results, 'category')
  };
};
```

### Problems and Solutions
**Problem 1:** Simulating realistic voice input in automated tests
- **Root Cause:** Browser automation can't directly inject audio into getUserMedia streams
- **Solution:** Created mock audio stream system that replays generated test files through simulated MediaRecorder
- **Why this approach:** Provides controlled, repeatable test conditions while maintaining realistic audio processing pipeline

**Problem 2:** Measuring voice recognition accuracy objectively
- **Root Cause:** Need quantitative metrics to detect regression in voice accuracy
- **Solution:** Implemented Levenshtein distance algorithm to measure transcription accuracy with word-level comparison
- **Why this approach:** Provides precise, comparable metrics that can trigger CI/CD failures when accuracy drops below thresholds

**Problem 3:** Test audio generation at scale
- **Root Cause:** Need diverse voice samples covering different accents, speeds, and scenarios without manual recording
- **Solution:** Automated OpenAI TTS generation with systematic voice/speed matrix covering 200+ test file combinations
- **Why this approach:** Creates comprehensive test coverage with consistent quality while being maintainable and cost-effective

### Udemy Tutorial Script
"In this lesson, we're implementing something crucial that most voice interface tutorials skip - comprehensive automated testing. Testing voice interfaces manually is time-consuming and error-prone, but with the right framework, we can catch issues before they reach users.

The challenge with voice testing is that it involves audio input, which is inherently harder to automate than clicking buttons or typing text. But we're going to solve this by creating a complete testing ecosystem that generates test audio, runs automated scenarios, and measures accuracy.

Let's understand what we're building:
1. Test audio generation using OpenAI TTS
2. Automated browser testing with audio simulation
3. Accuracy measurement and performance benchmarking
4. CI/CD integration for continuous testing
5. Developer tools for manual testing and debugging

This framework will give us confidence that our voice interface works reliably across different scenarios and won't regress when we make changes.

Let's start with test audio generation. Create `tests/voice/audio-generator.ts`:

```typescript
interface TestScenario {
  id: string;
  text: string;
  expectedTranscription: string;
  expectedIntent: string;
  category: 'creation' | 'management' | 'communication';
}

const testScenarios: TestScenario[] = [
  {
    id: 'create_user_story_basic',
    text: 'Create a user story for login functionality',
    expectedTranscription: 'create a user story for login functionality',
    expectedIntent: 'create_user_story',
    category: 'creation'
  },
  {
    id: 'jira_ticket_create',
    text: 'Create a Jira ticket for this story',
    expectedTranscription: 'create a jira ticket for this story',
    expectedIntent: 'create_jira_ticket',
    category: 'management'
  }
];
```

The key is creating scenarios that cover your actual use cases. We want to test the happy path, edge cases, and potential failure scenarios.

Now let's generate the audio files:

```typescript
const generateTestAudio = async (scenario: TestScenario, voice: string, speed: number) => {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: scenario.text,
    speed: speed,
    response_format: "wav"
  });
  
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `${scenario.id}_${voice}_${speed.toFixed(1)}_clean.wav`;
  
  fs.writeFileSync(`tests/audio/${filename}`, buffer);
  return filename;
};

// Generate test matrix
const voices = ['alloy', 'echo', 'nova'];
const speeds = [0.8, 1.0, 1.2];

for (const scenario of testScenarios) {
  for (const voice of voices) {
    for (const speed of speeds) {
      await generateTestAudio(scenario, voice, speed);
    }
  }
}
```

This creates a comprehensive test matrix. We're testing different voices (to simulate different speakers) and different speeds (to simulate fast/slow speech patterns).

Now let's create the automated test runner. Create `tests/voice/voice-test-runner.ts`:

```typescript
const runVoiceTest = async (audioFile: string, expectedResult: TestScenario) => {
  const page = await browser.newPage();
  
  // This is the key - we mock getUserMedia to use our test audio
  await page.evaluateOnNewDocument(() => {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      // Return a mock stream that plays our test audio
      return createMockAudioStream(window.currentTestAudio);
    };
  });
  
  await page.goto('http://localhost:3000');
  
  // Load the test audio file
  await page.evaluate((audioFile) => {
    window.currentTestAudio = audioFile;
  }, audioFile);
  
  // Trigger voice input
  await page.click('[data-testid="start-listening"]');
  
  // Wait for results
  const transcription = await page.waitForSelector('[data-testid="transcription"]', { timeout: 10000 });
  const result = await transcription.textContent();
  
  return {
    audioFile,
    expected: expectedResult.expectedTranscription,
    actual: result,
    accuracy: calculateAccuracy(expectedResult.expectedTranscription, result)
  };
};
```

The accuracy calculation is crucial for objective measurement:

```typescript
const calculateAccuracy = (expected: string, actual: string): number => {
  const expectedWords = expected.toLowerCase().split(' ');
  const actualWords = actual.toLowerCase().split(' ');
  
  // Use Levenshtein distance for word-level comparison
  const distance = levenshteinDistance(expectedWords, actualWords);
  const maxLength = Math.max(expectedWords.length, actualWords.length);
  
  return Math.max(0, (maxLength - distance) / maxLength);
};
```

Now let's integrate with Jest for proper test reporting:

```typescript
describe('Voice Interface Tests', () => {
  beforeAll(async () => {
    // Generate test audio if not exists
    await generateAllTestAudio();
  });
  
  test.each(testScenarios)('should recognize "$text" correctly', async (scenario) => {
    const audioFile = `${scenario.id}_alloy_1.0_clean.wav`;
    const result = await runVoiceTest(audioFile, scenario);
    
    expect(result.accuracy).toBeGreaterThan(0.85); // 85% accuracy threshold
  });
  
  test('performance benchmark', async () => {
    const results = await benchmarkAllScenarios();
    expect(results.averageAccuracy).toBeGreaterThan(0.90);
    expect(results.averageResponseTime).toBeLessThan(3000); // 3 second max
  });
});
```

Finally, let's set up CI/CD integration. Create `.github/workflows/voice-tests.yml`:

```yaml
name: Voice Interface Tests
on: [push, pull_request]

jobs:
  voice-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Generate test audio
        run: npm run generate-test-audio
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          
      - name: Run voice tests
        run: npm run test:voice
        
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: voice-test-results
          path: test-results/
```

Now let's test our framework:

```bash
npm run generate-test-audio  # Creates all test files
npm run test:voice          # Runs the automated test suite
```

You should see comprehensive test results showing accuracy percentages for each scenario and overall performance metrics.

Excellent! We've built a complete voice testing framework. Key concepts we learned:
1. Automated test audio generation for consistent testing
2. Browser automation with audio simulation
3. Objective accuracy measurement with quantitative metrics
4. CI/CD integration for continuous quality assurance
5. Performance benchmarking for regression detection

This framework gives us confidence that our voice interface works reliably and will catch any regressions before they impact users. In the next lesson, we'll put it all together with a complete demo of the Squiddles system in action."