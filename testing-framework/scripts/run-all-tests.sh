#!/bin/bash

# Comprehensive Test Runner for Squiddles Voice Interface
# Runs all automated tests against the isolated Squiddles application

set -e

echo "🚀 Starting Squiddles Voice Interface Automated Testing Suite"
echo "================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQUIDDLES_DIR="$(dirname "$TEST_DIR")"
RESULTS_DIR="$TEST_DIR/test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "📁 Test Framework: $TEST_DIR"
echo "📁 Squiddles App: $SQUIDDLES_DIR"
echo "📁 Results Dir: $RESULTS_DIR"
echo ""

# Ensure results directory exists
mkdir -p "$RESULTS_DIR"

# Function to log with timestamp
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

# Step 1: Verify Squiddles app is ready
log "Checking Squiddles application..."

cd "$SQUIDDLES_DIR"
if [ ! -f "package.json" ]; then
    error "Squiddles package.json not found!"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    warning "Installing Squiddles dependencies..."
    npm install
fi

success "Squiddles app verified"

# Step 2: Setup test framework
log "Setting up test framework..."

cd "$TEST_DIR"
if [ ! -d "node_modules" ]; then
    log "Installing test framework dependencies..."
    npm install
fi

success "Test framework ready"

# Step 3: Generate test audio files
log "Generating test audio files..."

if [ ! -d "test-data/audio-samples" ] || [ -z "$(ls -A test-data/audio-samples 2>/dev/null)" ]; then
    log "Creating test audio files..."
    npm run generate-audio || {
        warning "Audio generation failed, but continuing with placeholders"
    }
else
    success "Test audio files already exist"
fi

# Step 4: Start Squiddles app in background
log "Starting Squiddles application..."

cd "$SQUIDDLES_DIR"

# Kill any existing dev server
pkill -f "next dev" || true
sleep 2

# Start the app in background
npm run dev > "$RESULTS_DIR/app-startup-$TIMESTAMP.log" 2>&1 &
APP_PID=$!

log "Squiddles app starting (PID: $APP_PID)..."

# Wait for app to be ready
log "Waiting for app to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        success "Squiddles app is ready at http://localhost:3000"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Squiddles app failed to start within 30 seconds"
        kill $APP_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Function to cleanup on exit
cleanup() {
    log "Cleaning up..."
    kill $APP_PID 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    success "Cleanup completed"
}

trap cleanup EXIT

# Step 5: Run test suites
cd "$TEST_DIR"

echo ""
echo "🧪 Running Test Suites"
echo "======================"

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_test_suite() {
    local suite_name=$1
    local test_pattern=$2
    local description=$3
    
    log "Running $suite_name: $description"
    
    local result_file="$RESULTS_DIR/${suite_name}-results-$TIMESTAMP.json"
    local log_file="$RESULTS_DIR/${suite_name}-log-$TIMESTAMP.txt"
    
    if npm test -- --testNamePattern="$test_pattern" --json --outputFile="$result_file" > "$log_file" 2>&1; then
        success "$suite_name completed successfully"
        local suite_passed=$(grep -o '"numPassedTests":[0-9]*' "$result_file" | cut -d':' -f2 || echo "0")
        PASSED_TESTS=$((PASSED_TESTS + suite_passed))
    else
        error "$suite_name failed"
        local suite_failed=$(grep -o '"numFailedTests":[0-9]*' "$result_file" | cut -d':' -f2 || echo "1")
        FAILED_TESTS=$((FAILED_TESTS + suite_failed))
        
        # Show last few lines of error log
        echo "Last few lines of error log:"
        tail -n 10 "$log_file" | sed 's/^/  /'
    fi
    
    local suite_total=$(grep -o '"numTotalTests":[0-9]*' "$result_file" | cut -d':' -f2 || echo "1")
    TOTAL_TESTS=$((TOTAL_TESTS + suite_total))
}

# Run individual test suites
run_test_suite "voice-basic" "Basic Voice Interaction" "Basic voice recognition and response"
run_test_suite "voice-agent" "Product Manager Agent" "Agent functionality and tool execution"
run_test_suite "voice-performance" "Performance and Reliability" "Latency and streaming performance"
run_test_suite "voice-errors" "Error Handling" "Edge cases and error recovery"
run_test_suite "ui-integration" "UI Component Integration" "User interface integration"

# Step 6: Generate comprehensive report
log "Generating test report..."

cat > "$RESULTS_DIR/comprehensive-test-report-$TIMESTAMP.md" << EOF
# Squiddles Voice Interface Test Report

**Generated:** $(date)
**Test Framework Version:** 1.0.0
**Squiddles App:** Running at http://localhost:3000

## Test Summary

- **Total Tests:** $TOTAL_TESTS
- **Passed:** $PASSED_TESTS
- **Failed:** $FAILED_TESTS
- **Success Rate:** $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%

## Test Suites

### ✅ Completed Test Suites

1. **Basic Voice Interaction**
   - Voice recognition accuracy
   - AI response generation
   - Audio playback verification
   - Real-time conversation flow

2. **Product Manager Agent Features**
   - User story creation workflow
   - Tool execution validation
   - Agent handoff functionality
   - Business logic integration

3. **Performance and Reliability**
   - Response latency measurement
   - Streaming performance validation
   - Resource usage monitoring
   - Connection reliability

4. **Error Handling and Edge Cases**
   - Unclear speech processing
   - Connection recovery testing
   - Graceful degradation
   - Error message validation

5. **UI Component Integration**
   - Real-time transcript updates
   - Connection status indicators
   - Event logging verification
   - User interaction validation

## Test Environment

- **Node.js Version:** $(node --version)
- **Browser:** Chromium (Playwright)
- **Test Framework:** Jest + Playwright
- **Audio Testing:** Generated WAV files + Real WebRTC
- **API Testing:** Real OpenAI Realtime API calls

## Files Generated

- Test logs: \`test-results/*-log-*.txt\`
- Test results: \`test-results/*-results-*.json\`
- Screenshots: \`test-results/screenshots/\` (on failures)
- Network logs: \`test-results/network-logs/\`

## Next Steps

$(if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 **All tests passed!** The Squiddles voice interface is working correctly."
    echo ""
    echo "### Validation Complete"
    echo "- Voice recognition: ✅ Working"
    echo "- AI responses: ✅ Working"  
    echo "- Audio playback: ✅ Working"
    echo "- Agent handoffs: ✅ Working"
    echo "- Tool execution: ✅ Working"
    echo "- UI integration: ✅ Working"
else
    echo "⚠️ **Some tests failed.** Review the failed tests and fix the issues."
    echo ""
    echo "### Failed Areas"
    echo "Check the individual test logs for specific failure details."
    echo "Common issues:"
    echo "- OpenAI API connectivity"
    echo "- Audio device permissions"
    echo "- WebRTC configuration"
    echo "- Event processing timing"
fi)

---

*This report was generated by the Squiddles automated testing framework.*
EOF

# Step 7: Display final results
echo ""
echo "📊 Test Results Summary"
echo "======================"
success "Total Tests: $TOTAL_TESTS"
success "Passed: $PASSED_TESTS"
if [ $FAILED_TESTS -gt 0 ]; then
    error "Failed: $FAILED_TESTS"
else
    success "Failed: $FAILED_TESTS"
fi

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "${GREEN}Squiddles voice interface is working correctly!${NC}"
    exit_code=0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED ❌${NC}"
    echo -e "${RED}Check the test logs for details${NC}"
    exit_code=1
fi

echo ""
echo "📁 Full test report: $RESULTS_DIR/comprehensive-test-report-$TIMESTAMP.md"
echo "📁 Test artifacts: $RESULTS_DIR/"

exit $exit_code