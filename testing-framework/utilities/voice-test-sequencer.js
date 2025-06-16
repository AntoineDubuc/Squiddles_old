// Simple test sequencer for voice tests
class VoiceTestSequencer {
  sort(tests) {
    // Run tests in order of importance
    const testOrder = [
      'Basic Voice Interaction',
      'Product Manager Agent', 
      'Performance',
      'Error Handling',
      'UI Component'
    ];
    
    return tests.sort((a, b) => {
      const aIndex = testOrder.findIndex(pattern => a.includes(pattern));
      const bIndex = testOrder.findIndex(pattern => b.includes(pattern));
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
  }
}

module.exports = VoiceTestSequencer;