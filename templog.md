Dashboard.tsx:311 🎤 Microphone button debug - sessionStatus: DISCONNECTED isListening: false
Dashboard.tsx:312 🎤 Should be green? false
page.tsx:217 🎤 Starting session...
page.tsx:221 🎤 Requesting microphone permissions...
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:246 ✅ Microphone permission granted [MediaStreamTrack]
page.tsx:265 🎙️ Voice provider detected: nova-sonic
page.tsx:276 🔊 Using Nova Sonic for voice, but also fetching OpenAI key for agent processing...
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:282 ✅ Got OpenAI ephemeral key for agents: ek_6876d6b...
page.tsx:285 🤖 Setting up agents...
page.tsx:286 🤖 Current selectedAgentSet: squiddles
page.tsx:287 🤖 Available agent sets: (13) ['squiddles', 'unified', 'collaborative', 'minimal', 'jira', 'confluence', 'slack', 'gmail', 'withJira', 'withConfluence', 'withSlack', 'withGmail', 'full']
page.tsx:288 🤖 Reply state selected mention: null
voices.ts:109 🎵 Loading voice config for productManager: Found saved settings
voices.ts:113 🎵 Parsed settings: {globalVoice: 'matthew', globalTone: 'friendly', globalSpeed: 1, agentVoices: {…}}
voices.ts:127 🎵 Using global voice config for productManager: {voice: 'matthew', tonality: 'friendly', style: 'Be warm, friendly, and approachable. Use casual language and show enthusiasm for helping.'}
page.tsx:293 🔍 DEBUG: Using agent set: squiddles
page.tsx:294 🤖 Selected agents: (3) ['ProductManagerAssistant', 'confluenceIntegration', 'jiraIntegration']
page.tsx:296 🔌 Creating UnifiedVoiceClient...
page.tsx:297 🔍 DEBUG: Agent details: (3) [{…}, {…}, {…}]
page.tsx:303 🔍 DEBUG: Audio element: <audio autoplay controls style=​"display:​ none;​" src=​"blob:​http:​/​/​localhost:​3002/​0358d4ee-8bbe-4a23-86c7-25b480cdb467">​</audio>​media
page.tsx:304 🔍 DEBUG: Extra context: {selectedMention: null, hasAddTranscriptMessage: true}
unifiedVoiceClient.ts:113 🔧 UnifiedVoiceClient Configuration:
unifiedVoiceClient.ts:114   Provider: nova-sonic
unifiedVoiceClient.ts:115   Fallback: Disabled (configured through Settings only)
page.tsx:763 🚀 Connecting to OpenAI Realtime API...
unifiedVoiceClient.ts:159 🎙️ Connecting using Nova Sonic for voice
page.tsx:342 🔌 Connection status changed: connecting
page.tsx:343 🔌 Before update - sessionStatus: DISCONNECTED isListening: false
page.tsx:357 🔌 After update - should be CONNECTING
unifiedVoiceClient.ts:165 🔗 Nova Sonic mode: connecting both Nova Sonic (voice) and OpenAI (agents)
novaSonicClient.ts:98 🔧 Nova Sonic Configuration:
novaSonicClient.ts:99   Region: us-east-1
novaSonicClient.ts:100   Model ID: amazon.nova-sonic-v1:0
novaSonicClient.ts:101   Voice ID: matthew
novaSonicClient.ts:102   Access Key ID: AKIA2LIP...
novaSonicClient.ts:103   Secret Key: ***configured***
novaSonicClient.ts:130 📝 Nova Sonic system prompt updated
unifiedVoiceClient.ts:269 📝 Set Nova Sonic system prompt from agents
novaSonicClient.ts:141 🔊 Connecting to Nova Sonic via bidirectional streaming...
novaSonicClient.ts:142 🔧 Nova Sonic config: {region: 'us-east-1', modelId: 'amazon.nova-sonic-v1:0', voiceId: 'matthew', sampleRate: 24000}
page.tsx:342 🔌 Connection status changed: connecting
page.tsx:343 🔌 Before update - sessionStatus: DISCONNECTED isListening: false
page.tsx:357 🔌 After update - should be CONNECTING
novaSonicClient.ts:468 🔄 Initializing Nova Sonic bidirectional stream...
novaSonicClient.ts:331 📝 Starting Nova Sonic session generator...
novaSonicClient.ts:346 📤 Yielding session start event
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:374 📤 Yielding prompt start event
novaSonicClient.ts:506 🔄 Starting to process Nova Sonic response stream...
novaSonicClient.ts:490 ✅ Nova Sonic bidirectional stream initialized
novaSonicClient.ts:163 ⏳ Waiting for system prompt to be processed...
novaSonicClient.ts:401 📤 Yielding system content start event
novaSonicClient.ts:419 📤 Yielding system text event
novaSonicClient.ts:436 📤 Yielding system content end event
novaSonicClient.ts:444 📝 Session and prompt started, now processing dynamic events...
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 22
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 0,
            "textTokens": 22
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 22,
      "totalOutputTokens": 0,
      "totalTokens": 22
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 22, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 150,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 150,
            "textTokens": 22
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 172,
      "totalOutputTokens": 0,
      "totalTokens": 172
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 172, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 1
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 150,
            "textTokens": 23
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 173,
      "totalOutputTokens": 0,
      "totalTokens": 173
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 173, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 43
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 150,
            "textTokens": 66
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 216,
      "totalOutputTokens": 0,
      "totalTokens": 216
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 216, …}
novaSonicClient.ts:608 🎙️ Requesting microphone access for Nova Sonic...
novaSonicClient.ts:621 ✅ Microphone access granted for Nova Sonic
novaSonicClient.ts:628 [Deprecation] The ScriptProcessorNode is deprecated. Use AudioWorkletNode instead. (https://bit.ly/audio-worklet)
startAudioCapture @ novaSonicClient.ts:628
await in startAudioCapture
connect @ novaSonicClient.ts:168
await in connect
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
novaSonicClient.ts:691 🎵 Sent audio content start event to Nova Sonic
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:655 🎤 PCM audio capture started for Nova Sonic streaming
page.tsx:342 🔌 Connection status changed: connected
page.tsx:343 🔌 Before update - sessionStatus: DISCONNECTED isListening: false
page.tsx:352 🔌 Current voice provider: nova-sonic
page.tsx:354 🔌 After update - should be CONNECTED and listening:true
novaSonicClient.ts:171 ✅ Nova Sonic connected via bidirectional streaming
page.tsx:342 🔌 Connection status changed: connecting
page.tsx:343 🔌 Before update - sessionStatus: DISCONNECTED isListening: false
page.tsx:357 🔌 After update - should be CONNECTING
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
realtimeClient.ts:158 🔧 Configuring VAD for cost optimization: {threshold: 0.6, prefix_padding_ms: 200, silence_duration_ms: 800}
page.tsx:342 🔌 Connection status changed: connected
page.tsx:343 🔌 Before update - sessionStatus: DISCONNECTED isListening: false
page.tsx:352 🔌 Current voice provider: nova-sonic
page.tsx:354 🔌 After update - should be CONNECTED and listening:true
unifiedVoiceClient.ts:170 ✅ Nova Sonic + OpenAI agent processing connected
unifiedVoiceClient.ts:328 📝 Connecting text client: openai
unifiedVoiceClient.ts:335 📝 OpenAI text client ready (using realtime connection)
unifiedVoiceClient.ts:183 ✅ Successfully connected to nova-sonic
page.tsx:765 ✅ Successfully connected to OpenAI Realtime API!
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
realtimeClient.ts:103 🔧 Session configured
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
realtimeClient.ts:103 🔧 Session configured
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
page.tsx:403 🎤 User started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 100,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 250,
            "textTokens": 66
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 316,
      "totalOutputTokens": 0,
      "totalTokens": 316
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 316, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 3
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 250,
            "textTokens": 69
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 319,
      "totalOutputTokens": 0,
      "totalTokens": 319
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 319, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "completionStart": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: completionStart
novaSonicClient.ts:598 📨 Unknown Nova Sonic event type: completionStart
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "additionalModelFields": "{\"generationStage\":\"FINAL\"}",
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "cd5db9f9-0f03-47a6-8f02-cb03dd8e1d3d",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "USER",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "textOutputConfiguration": {
        "mediaType": "text/plain"
      },
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentStart
novaSonicClient.ts:556 🎤 Nova Sonic content start
unifiedVoiceClient.ts:308 🎤 Nova Sonic: Voice activity started
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "textOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "hi can you look in jira to see if we have tickets",
      "contentId": "cd5db9f9-0f03-47a6-8f02-cb03dd8e1d3d",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "USER",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: textOutput
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "cd5db9f9-0f03-47a6-8f02-cb03dd8e1d3d",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "PARTIAL_TURN",
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentEnd
novaSonicClient.ts:583 🔇 Nova Sonic content end
unifiedVoiceClient.ts:313 🔇 Nova Sonic: Voice activity ended
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 36,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 69
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 355,
      "totalOutputTokens": 0,
      "totalTokens": 355
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 355, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 4
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 73
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 359,
      "totalOutputTokens": 0,
      "totalTokens": 359
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 359, …}
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 20
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 73
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 20
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 359,
      "totalOutputTokens": 20,
      "totalTokens": 379
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 359, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "additionalModelFields": "{\"generationStage\":\"FINAL\"}",
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "907d38b9-7dde-45e2-ab40-3f83c73345c7",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "USER",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "textOutputConfiguration": {
        "mediaType": "text/plain"
      },
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentStart
novaSonicClient.ts:556 🎤 Nova Sonic content start
unifiedVoiceClient.ts:308 🎤 Nova Sonic: Voice activity started
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "textOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "about linkedin",
      "contentId": "907d38b9-7dde-45e2-ab40-3f83c73345c7",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "USER",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: textOutput
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "907d38b9-7dde-45e2-ab40-3f83c73345c7",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "PARTIAL_TURN",
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentEnd
novaSonicClient.ts:583 🔇 Nova Sonic content end
unifiedVoiceClient.ts:313 🔇 Nova Sonic: Voice activity ended
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 1
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 74
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 20
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 360,
      "totalOutputTokens": 20,
      "totalTokens": 380
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 360, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 2813
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 20
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 20,
      "totalTokens": 3193
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
page.tsx:405 🎤 User finished speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:487 🤖 Agent is responding...
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 32
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 0,
            "textTokens": 52
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 52,
      "totalTokens": 3225
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "additionalModelFields": "{\"generationStage\":\"SPECULATIVE\"}",
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "71e8a634-4052-4263-8606-26dede0cad9d",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "textOutputConfiguration": {
        "mediaType": "text/plain"
      },
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentStart
novaSonicClient.ts:556 🎤 Nova Sonic content start
unifiedVoiceClient.ts:308 🎤 Nova Sonic: Voice activity started
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "textOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "Absolutely, I'll check Jira for any tickets related to LinkedIn right away.",
      "contentId": "71e8a634-4052-4263-8606-26dede0cad9d",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: textOutput
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "71e8a634-4052-4263-8606-26dede0cad9d",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "PARTIAL_TURN",
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentEnd
novaSonicClient.ts:583 🔇 Nova Sonic content end
unifiedVoiceClient.ts:313 🔇 Nova Sonic: Voice activity ended
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "audioOutputConfiguration": {
        "channelCount": 1,
        "encoding": "base64",
        "mediaType": "audio/lpcm",
        "sampleRateHertz": 24000,
        "sampleSizeBits": 16
      },
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "type": "AUDIO"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentStart
novaSonicClient.ts:556 🎤 Nova Sonic content start
unifiedVoiceClient.ts:308 🎤 Nova Sonic: Voice activity started
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "AAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD//wAAAAAAAAAA//8AAAAAAAAAAAAA//8AAP//AAD//wAAAAAAAP//AAAAAP////8AAP//AAD/////AAD/////AAD/////AAAAAAAA/////wAA//8AAAAA/v///wAAAAD9//////8AAP7//v///wAA///+////AAD+/wAAAAD//wAA/v////7////+/////v////7///////7/AAD//////v/9/////////wAA/v///////v///////v8AAP//AAD8//7/AAAAAP3//v///wAA/v////////8AAP////8AAP///v/+/////////////////wAA///////////////////+/wAA////////AAAAAP////////////8AAP////8AAAAA/////wAAAAD//////v8AAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAQABAAEAAAAAAAEAAAABAAAAAQAAAAEAAgAAAAAAAQAAAAEAAgABAAEAAAACAAIAAgABAAEAAQACAAIAAgABAAMAAgABAAIAAgABAAIAAgADAAMAAgABAAMAAQADAAIAAwACAAQAAwACAAQAAgADAAQAAwACAAQAAwADAAQAAwADAAMABAADAAMAAwAEAAUABAADAAMABQADAAUABQAEAAQAAwAEAAQABAADAAQABAAFAAMABAAEAAQABAAEAAMABAADAAQABAAFAAUABAADAAQABAADAAQAAwAEAAMABQACAAQABAADAAQAAwAEAAMAAwADAAMAAwADAAMAAgADAAIAAgACAAIAAgABAAIAAgABAAIAAQABAAEAAgABAAIAAgAAAAEAAQAAAAEAAQABAAAAAAAAAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAP//AAAAAAAA///////////+/////v/+///////+//3////+//7//v/+//7//v/9//7//f/+//7//f/9//3//f/8//3//f/9//3//P/9//z//f/7//z//P/8//z//P/7//v/+v/8//z/+//6//v/+//6//v/+//6//r/+//5//r/+v/6//r/+f/6//r/+v/6//n/+//4//v/+v/6//n/+f/6//v/+v/5//r/+v/5//r/+v/6//r/+v/6//r/+f/6//n/+f/7//n/+f/5//r/+f/6//n/+P/5//r/+v/5//r/+P/5//n/+f/5//n/+P/5//r/+f/3//n/+v/5//r/+f/6//r/+v/5//n/+f/5//r/+P/5//n/+f/4//j/+P/5//n/+f/4//j/+P/4//n/+P/4//j/+P/4//j/+P/3//j/+f/4//n/+P/5//n/+P/6//n/+f/5//f/+v/6//j/+v/6//n/+P/6//r/+f/7//r/+v/6//v/+v/6//v/+v/8//z//P/8//z//f/8/////v/+//3///////7//////wAAAAAAAAAAAAAAAAEAAQABAAIAAQABAAIAAgAEAAQABAAFAAQABgAGAAYABgAIAAkACQAIAAoACgAJAAsACwALAA4ADgAMAA0ADwAPAA8AEAAQAA8AEgARABEAEgATABMAFAAUABMAFgAXABUAFwAWABcAGQAaABkAGgAaABsAGgAcAB0AHAAeAB8AHgAdAB8AHwAgACEAIAAhACEAIQAgACMAIwAgACMAIwAiACMAJAAlACUAJwAkACUAJQAkACUAJQAlACUAJAAkACIAIgAjACIAIwAjACIAIgAiACMAIwAjACMAIgAiACEAIgAhACEAIQAgAB0AHQAeAB8AGwAcABoAGQAbABkAGQAZABoAGQAZABgAGQAYABUAFwAZABoAFgAVABUAEwAUABIAFAAPABcAEQAIAAgA+f///wAA+P8DABMAFQARABEADgD1//b/7P/8/wcADAAAAAQABADb/9b/6f/3//H//P/w/9r/7P/a/9r////q/+b/yP/Q/+b/3f/s//7//P/Q/8H/wf+t/8n/9P/b/+n/+//M/8H/xf+v/8b/0v/R/9H/wP+7/6z/rf+5/7//1//H/7n/xf/C/7z/w//M/8D/xv/G/8D/yf+8/8D/uv+g/6T/q/+r/6j/tv+u/53/pP+v/6z/rP+2/7L/vP+x/57/gv/C//X/0f/N/77/p/94/2f/p//A/7//y/+8/6X/iP+W/8X/v/+2/8v/xP+2/6X/rv/C/7//xv/H/83/yf+//8v/1//O/8z/2P/W/8z/3P/e/97/2v/n/+7/0v/d/+P/3P/Z/+z/5v/3/+//6P/6//D/9v/n/wMA/v8AAAwAEgAVABQAEwAEAAsAFgAZABQADQAUABgADAAdABgAFQAoABwAJQAjABQAFwAbADMAHgAZACIALQA0ACkANgA1ACsAJwAtADIANQA/AEcATABeAFUARAA4ADoAPwBFAFEAWgBTAFYATwBOAEoARwBbAE8AewBtAGQAYQBkAGYAUQBdAFkAYABlAGkAZwB1AGkAYQBfAE8ATgBcAFoA",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 18,
            "textTokens": 2
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 18,
            "textTokens": 54
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 72,
      "totalTokens": 3245
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "8f68+w0BVv53BOYCTgY2/gb/wPrN/iMCLgZgA8X+y/zl+EgAHQFzBVAF2QI7+uH7gvw6AnoEcARv/YT8HQIj/L4BfAGrAvUAUv3UALr7H/8aBMsDzv+E/mn5b/31BnQACgHp+UL8EPuvAZcCKgNK/4/6qP2w/Ib/uQTUBCr7ivtq/RgEuvqfBpoBg/fy/vsAs/w6/uMCWwIDAE/3l/xU/OADVACnBLb6x/cFAmf9xQFhAagEPfiX/ef63v3P/lkAeghL/f/4PvgQ/8361AoJ/Rf+Ff6N9yf/Wv+RAXkCBASl94P8OP2A/dYDjAZ/+/QCCPqx+ogBov7kAIkAgv90+Sz7zv/EAdoHQv1u+wEAtvdjB0P7CAjuA1X7e/Xw/csFRP5fA5j+CgAk9pb6cQCwCfEDZwKp+WH7//vjAJoAqwbOB6P8B/af9zMInAHRByz/uQNw+Yn49f5ZAQQSwQRu99TxrP64BDD/9QrOCKH7fvXJ/ND8CAalDlIErPxr9vf7Wv1ABdkHcAqI/Lvz4/2uAtn6xANOEh3+t/jP/Mv6mf++B50L+QOF/Mb7F/k9BLIGqgGqB+f/VPm3/XL94AfRBDsEMv79+NgCbQGS+7UG4gqq9qf3tf5mBqEArQku+eED3gVb+E4CVPqiDWv/uALb/SUEifoo+2UIUgDQBl/4VwXO+5L+ogJFBscBYv0JBMT9ngEO/fP+jP5zCWgAO/aFA4gC3P03BiYBR/oHAKgA1QPvAPH7HACaCbr8IffRAb4EmQZo+qT8mAX3+0v9gv//AzsAM/rLA1v+tQOBAAf7lABlA4QEAv85AIT8HflbBMEB1v0yBOT7Df0T/Y0F5AEP/wQCG/1V/mUBGgO6+i8DAP8T/RAAZv+b/sMAhQS4+6z8tv1pBp8B4vWM/+IDbv9X/A/5KPxMBef/0wE8ACT3XQCSA678iP/lBN/9Vv1TANf/Df8o/Cf/pQlUA2v3/fpl/HUAMwdtAAIC4f6s+cX4Ov/IBlcEEwOXAEb8C/DxAIAMNgWm+O7+sf6s+dr6CgV/A+QDQP8T8PsDBP30BHUGOP+5+c/5g/82AucElQYX/9D4CfnTBcoImfyeBRD+BQKn9wn6/QWFBi4Hr/mZ9H//hQMDAJsDCAMo/g3/fwDd96wCEgqQ/9j5WAWV/3b5GwSVA536OwHQBbv/W/vl91ACmAi+/YH4fwwF+Wf0hgYQC1UB8fudAKQAlgB3+ykI3gNnAQH7BfZwBRwEov6GA7oBJwRU9Ur3Lw0nB6f7JwFmBdf2IPcyBYoFbgAyBMYCavkO9S8GPBBz+m3+WwlR/jj0+vt7A6f+Lwy3/V71dPt3ASUDtQNABLoDQv0c+CsIGvk6/zgU4QNF8Kj5UwHeCS4CJP/IA1/6zf9e/EAApQOsBBIAIf8v+wn7ywXFAlQEbfv6AbEFr/A+/yYTlP6r97kE0QAM/hv72f8tAzABPgOi/M/8DADaAS3+OAEuBmf6nvg9AtwJvPn5+1oEkACuAGD9if61ATYImP95+//6IgRJBPUE1/uQ9af8XANHBhUBWwDX9Ef/pASgAwT+fv++/Yz/PAPM/QUGJ/4y+C/+xgSRAU8Cz/wF+av+VATMACH9SQNq/GYBTP+2/PX/SARUAK38NgJI/Kz7LP4EA18EYwUy+k74vvxmDfUB/PaUCoP7SPerAEoFSQDz/+39bf3z+uoBKgZ6+DQAggMvApn8pfe3AwwF6vnd/8EA/wJhAWr4KgGY/6kDUQczAnL4SPohAC4A5QfuAlP7CPxk//n+1wEnAFUDQQHJ/df+u/rrA3wFmwBh+27/mALW/R78awKHAqn+qgHu+rQAqAG+ARMCfP6V+NX+iApI/0L8Nv/3ASACJwQB+qv8Jwg1B6r9zvN7AHUHtATB+Wb+6AJF/pn8jgOUCPz3qP4OCDH/Mfx/BvIB/ffXApYBQAAhAhv+Zv7t/mP/1wT6AFECcP/q/d76o//qDrb8mfei/c8CiAKy/mUAVf+PAD8EVfwGAGkCDAMA/dT6/QUXAlL92foLCbf/dvryAggBtgCjA7IBcPjj/58CZfddCuIOgvYv88L/4wFaCV8K2PYA9r0BDAdSAoz2pfugD34Axv5f9Sb3bgemCvgD4vsT/Yb5IwSVAlMCiwI0ACr3yv9rA1cAHgQ1/3H7s/69AOD/0P3wAjoF8vfP+D4CUQVI/TQE5ANr9ID6agiwCfn7HAAlAmb72QA1Axf9P/tyBFYG5f408osB3AHJAgwFH/rL/bYCnv2m9+wH9AmbACjzyvVVBSQJKQMe/bD6iP60Aj/8yQUSBPf6Zv4E/DAC4/t5BVsCMfqcA7P5avlQBpQGFf88Asz2DvsNAqoEsgxz/jrv9fjnBLULYQ0m9VnygQCAA+AC8wAXApX9qvsK/Ez++ASDBa0EyvfG9EUB+Qh5BNr4C//k/jr+SP90CdT9xfPDAucDyP40AX4GSPpo/F4FSwNA+ZIElv8d+qgIdQEa9YsCWQVU/jwBWfnU/TsF/Qar/Z0BfPi0/jcG4AFMBDn57vfN/44HBwIH/2j90/1r/1v+",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:520 🤖 Agent started speaking
page.tsx:520 🤖 Agent started speaking
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 20,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 38,
            "textTokens": 54
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 92,
      "totalTokens": 3265
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "CwABAPz/9/8AAA8ACgARABwAGwAdACEAHgAfAB8AGgAWABcAIAAmACcAKwAnACcAKAAoACoAKQApADcAQwBJAEkARwBDADUALAAiACIAKAA5AD4AQgBPAFIASwBBADgALQArADMANwA1ADsAPQBCAD8AMwAzADYAOwA4AD4ATABbAFsAUQBHAD8APwA/AD0AOwA/AEUASABEAEMATwBUAEkAPwA/AEMARgBCADoANAA4ADgAOgA/AE0ATQBFAEYAPQBBAEYARABIAEwAUwBXAFYAWABMAEMAPAA4ADoAOgBFAF0AaQBtAGUAVwBIADgALAAiACUALgA8AD4APgBGAE8ARwA+ADUALAAsADIAOQA3ADgAOwA6ADAAKgAyADkAOQA5ADkARABEAEMARgA/ADoAMQApACQAHQAYABAABwAIAAUAEAAZABkADgD9//j/7v/t//n/AAAEAAcACQAAAPz/9P/r/+z//f8BAAsAHgAsACoAGAANAAIA+f/9/wYACQAQABIAHwAWAAwAFAAVABsAFQAOAAUAAAAAAAIAAwACAP7/+v/w/+b/4//m/+3/6//h/9v/3//i/97/3f/a/9f/1//T/9n/2//U/9X/0v/C/7//xf/J/9f/3//q/+v/5v/f/8b/sv+t/7H/vv/O/93/5P/u/+7/3P/J/8n/yv/A/7n/vP+9/7X/tf+j/5j/kf+a/6D/p/+6/8f/u/+g/4v/hP+J/53/sP+z/7z/sP+q/6P/mP+h/6P/n/+k/6//yv/W/9n/1//F/7H/jv99/4r/of+5/9D/5f8AAAUAAgDy/9n/w/+z/7n/2v/1/wcAFgAJAOP/u/+l/6r/vP/H/9f/8P8DAA4AAADp/87/tf+w/7v/1P/u/wQABgD+/+v/3v/k/+v/8P/3/wUA/P/6//j/6v/a/83/0//c/+X/9v8IAAoAFwAVAAkADwAaABkACgANAA0ACgAHAAgAAwD//wUAAgD4/+7/+v8BAAMABAANACAAHQAHAO7/5f/U/87/0//e/+//AgAfACQAKgAzADkAJgAaACAAKQAxAC8AJgAXABMAGQAiACEAIwAmACkAJwAUABUAHQAbAAgABQAPABkAGwANAAQA9P/0//v/DAAaACQALwAnAB0AEwASAB4AJAAUAAoAAAABAAoABwAKABIAMgBFAEYATwBYAEcAKwASAPf/+/8lAFAAVQBVAFUAVABTAEYAOwArAB8ABQDy/+r/7v8KACwAMAADAP//GAAnABUAEQAgACUAIAAZABwAIABCAEIAKgAZACsANgAvACEACAADAA4AGgAYACYANQA4ACMAEAACAP3////9//v/+P///w0AGwArAEMAUABGADoAPAA7AC8AIQAoACsAHQAUACEAOQBEAD8AMwAyACcAIQAVAAoABwD1/+X/6f/4/woAIgBBAEsAOAAmABQABwABAPv/BwAcACsANwAxABYAAAD1/+3/4v/o/xYAOwBFAEUANAArABwACwDp/9b/4v/o/9z/5//+/wEABwAIAAQA9f8IACcAJgAcAB4AEwDh/7f/p/+7/9//DwAoAEEAZwBkADQACQDo/8j/t/+x/9D/8P8fADcAIwD1/8z/tv+k/5r/qf/O//r/IgAdABQA/v/j/8D/lf+N/67/zv/n//n//f/1/+f/7v/p/+b/9//7//L/7//q/9//2P/f/+T/8f8LACoAPQArABcADADp/8X/sv/E/9v/6v/p//n/AgDq/8//xf++/6b/pf+w/7D/rv/D/9H/w//M/97/4f/b/93/2f/X/93/2f/U/9f/5v/t//v/DAD3/+H/4v/b/9D/1P/q/+3/2P/G/83/4P8GACsAGQD8/9X/vP+5/8//9f8CAP//7//o//D/EAAkACsADQDs/9H/sP/D/9j/5f/j/+T/6f/+/xwAJgAZAP3/0/+3/6L/qf/O/+n/7v/1/xAAHAAjABgACQDq/8v/sP+y/93//f/7//f/AgD3/+3/8v8AAP//8f/1/wwAIAAhAC4APgA2ABYABQD+////8//w/wEAHQA3AD8ASgA6ABUA+//j/8X/yP/O/73/q/+1/73/xP/Y//7/GwAtADkAIQAAAOr/3f+9/7z/1v/9/yYAPQBVAFwAVgA6AAYA1v/Z/9v/4v8LAEAAZQBdAFAARgAcAN7/xP++/8j/+f8XACgARABYAEwAIwACAP3/9v/3//f/8v8AABUAFwAKAAcAHgAoACEALgA+ADUADgD7/+//5P/7/yQAOgA6AD0AMQAEAOz/9v/4//H/7//9/xgALgA5ADQANgAmAAgA//8LAAoABgAOAAYA9//w//L/+/8dACUACADp/+3/+f/o/8D/vP/q/wYAHAAfADUAOAAeAOr/uv+//9P/zf/Y//7/GQAtAEcAWgBDAA0A8v/o/8//3/8dAEQAWABWAFIAVgA+ABcADgAYABkAEAAjADsANQAhAAEA+v8BABIAMwBZAFYAPgAoABsABwD9/xAAAgD4/wkAIQAmAB4ADgDu/8v/uP+2/9r/FABRAHUAdABkAGkAbABNACsA",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:520 🤖 Agent started speaking
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "lP+n/8D/2/8UAFsAiACpAMYAqgCpAJ0AegBvAEAA5P+e/4T/gv92/2f/mf+9/9//NQBMAFkAQwAyAC0ABQDt/+r/2f+v/5f/mf/D/8b/8P8IAAIAFQAyAEEADgDz/wAA7f+v/9L/3v/1//f/8P8QADgAXgBSAF8AbQBqAGAAUgBIACcA///Q/6j/mv+v/7L/jv+R/47/lf+o/8L/9f8AAAMAFAA7AFUAUgBcAHAAVQBAADgAOQAiAAcACADL/6H/iP99/3v/fv92/4L/nP+z/9X/3f8OABwAGQA7AFAAVgBzAIUAYABIADAAHAAPAOj/AADk/7f/nv+B/4//hf9+/27/jv+8/8//8P8XACMASgBiAGsAiACJAHcAVwA5AB8ADgAAAPX/5v/G/7D/nf+U/5r/nf+w/5z/ov+z/9b/6//9/xcACwAnAEcAZQBvAIAAkwCKAIAAZABXADwAKAD7/9//xf+1/8b/rP+u/6b/nP+M/6n/3P/W/9r/7f8BAP//EAA9AEUASAA0ADkAUQBBADkAMgAUAAMA9v/n/+P/xv/P/9H/wv+4/8r/6P/1/wAAIABJAEUATABVAGUAWwBTAEcANAApAAgA///0/+f/3v/j/+r/5f/w//H/6//p/9X/2//3//7/FAATACsASABfAGkAbwCPAIwAgwB0AGgASQA7ABoACgDq/9//7v/c/9v/0v/a/9H/7P/2////FAAGABIAIQAxADcAPgA+AEQAUABSAFkARQBHADUAGAAcAAMA9P/6/+z/x//k/+n/2f/3////CgAZACkAUwBZAG4AcABuAIYAhAB/AH4AXwA8ADkAGAAWAAMA+v8FAPv/EAAAAPb/+//s/+7/8/8OAC0AIwAWACQAOQAmADAASgBDAEQALgAtACYA+P/x/9r/0P/E/8X/vP+w/7//xP/D/8v/0//W//v/5P/3//7/9P/h/9X/1//M/8v/2P/S/7j/xf++/9D/x/+4/6n/nP+Y/5X/pf+j/5r/of+G/47/qf+p/6r/o/+o/6H/rP+w/7//v/+y/63/uP/H/8v/wP/I/8L/tv+7/7b/r/+m/6n/m/+U/5//s/+n/6z/n/+o/8j/v//E/8n/yf/G/8b/0f/i/9L/2f/M/8H/y//N/8L/uf+6/7P/sP+w/6z/tP+7/7n/0P/S/8f/zv/k/+H/5f/v/+3/9f/3/+j/6v/y////BgD8/+n/+P8CAPP/8P/g//L/6v8AABMAFQARAAkAFgAjABsAHAA5ACoAJgAvADMAMgA+AD4AOgA0ADkAPQAtADAALQAlACkAJwAfACkAIQAcACQAKgAsAD0ARwAyACYAKgA6AEAAPABTAFoAUwBXAE0AWABqAGAAVwBjAGkAXQBHAFQAXABNAFUAXQBkAFoAUwBQAEgATwBVAEwAQwBRAE4ARQBKAEUAPABRAEQARQBHAEAAPwA+AFgAPAA+AEQAQwBFADkAQQBPAEcAPgBFADYAQQBLAEUARgBHAD0ANwA6AD0ALQAcACoAMQAbABoALQAnABsACwAGABkACwAOABQAAQAOABAACAD6/wcABQACAAAA8f8HAPn/7v/1//n//v/1/+v/9v/w/+7/7f/y//b/4P/c/+//6f/l/+j/4//g/9r/5f/P/8X/1//W/8L/yv/T/9n/wv/N/+T/0//N/9f/8f/c/9j/1f/S/9P/1P/S/9n/zP/P/9j/2f/X/8H/2P/K/9b/0f/K/9j/yP+8/8z/3v/D/8b/xv/I/8n/z//R/8z/0P/V/9H/wf/Q/8j/zP/i/+T/1P/b/+T/1f/f/+n/6P/z/9z/3P/1/9//5P/p/+3/5f/f/+b/6f/r//r/+f/n/+n/5v/2////+v/u//z//P/v//T/+/8JAPX/9//9//j/+v/8//r/9//8/wYAEAD4/wMAAAAEAAAA/P8LAAsACQD+/wAAAAAIAAoAFwAOABEAGQATABAABAAKAA0ADAAVABQABgANABQAEwAZABYACgAEABAAFAD+/woABQAOAA4ACgAVAAkAAwD8/wMA/f/1//z/AQD6//v/+//+/wMA9P/8//z//f///wEAAwD7/wUA9v8LAAsABQD9////BAAIAAwAAAAGAPb/AgD6//P/9//u//3/+P/u/wAABgADAPv/9v///wEAEQACAPf//f8FAAQAAQACAAIA//8FAAUA+//8/wMAAwD9/wEAAAD5//v/+/8AAPv///8EAAAA/f/v//f/9v/4//r////1//L/BAD2//v/AAD5/wAA9v/2/wEA/P/+//r/AQACAPf//P8AAAgA/v/v//v//P/9/wAAAAADAAEA/P/5/wAA7//w/wcA+f/3/wAAAgD9////CQAAAAIADQACAAYADwACAAAAAwD9//7///8PAAYACAAMAP//AwAHABEA9f8BAAAADQAUAAQABAACAAgA//8AAAAACgACAAUAAgAHAAcACQAIAAMACgAWAAoABgAKABUAFAABAAcAFAAcAA0AJwARAAsAFgAVACUAEgAHABIAGgAiAB4AHwAoABwAKgAhACMAIwAiAB4A",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "HgAcAB8AHQAfACIAFQAcABcAGQAeACEADwAYAB4AIQAfABYAFAAOABIAFQAbACEAGgAPAA0ADAASABAADgAHAP3//P/6/wMA+P/2/wIA+f/z//f/+/8KAPz/8v/1//3/BAAAAPn//P8LAAEA8P/+/w4AAgD0/wAABQDy//L/7//8//n/6//3/wAABQDu//H//f/2/+z/+P/4//v/AAD3/+7/+f/3//j/AAD5//3/5////wYA+//8/wIA9P/q//X/7//0//f/9//6//T/8f/1//T//P/m//P/AADr//r/+f/p/+//9f/v//D/9/8NAO7/5v/0/+T/+//1/+z/7v/y//P/+v/9/wIABAD3//r/6v/7//3/8v8AAP//9P8AAAQA9v/+//D//f/6//f//v/4//3/CgAEAPX/9//9//3/AgD6//7/+/8GAP3/4v8AAAsAAgACAP//6v/1/wAABAD9//3/DQD7//7/8f/t/wQA+v8JAPf/6/8BAAMA5v/u//L/9v/x/+v/+f/4//7/4//r//L/9f/m//r/+v/r//H/AAD2/9f/9f/5//z/5//p/+7/9v/y/+f/+v/p/+T/9f8AAPf/7P/x//z/9v/c//H/CQD+//P/+P/p/+b//v/u/+T/8P8BAOf/8v/y//D/7//q/wAA7f/9//7////n/+T/9P/8//r/9/8MAAQA/P/3/wgAAAD///L/6v/w//L/+f/t//X/AQD1/wYAAAD//xEAAAAJAAQAAAALAAAA+/8LABEAFQACABcAEgAAABQAEAAYABQACAAZABwAIAAeABIAEAAWACEAEwASABQAHgAaABEAFQAiABYAFAANAAcAJwAqAA8A/v8OACAAFQAFACAAEgATABUAFgAXAAwADwAVACAAFAAPAA8AFwAVACUADwARABoAFQAYABEAGAAhABwADgALAAoAFAAWAAsAAgAYABkABAAAABcAFAALAAQACwAaABAADAAAAAsADAAOABIADgAIABIADgAMAAYA/P8GABMAGAAEAAUABgAAAAQAAQAGAAAAAwADAAMAAgAFAAkA+P8AAP//EAAFAPv/AAABAP//CQAQAPX/CgD+//L/8/8DAAYA+f/3//n/DAAEAAEABQD8//b//f8AAP3/+v8AAAIA/f/5//f/BwAAAPz/+v8BAAIA//8BAAAA/f/7/wgA/v/7/wAAAAAEAP3//f/+//v/AAAAAAAABAAHAP//9P/3/wEAAgD5///////4////9//8/wIABAD3/+3/9f8EAPD/6//w//X/+//v////8v/4//D/7P/m//r/+f/0//f/6v/4/+7/8//w//D/6f/z//X/9v/p//f/9//v//v/9f/1//X/AADx//T/9//9/+3/9P/z/+3/+v/w/+7/7//6/+r/6v/z/+7/8f/v/+//6//4/+//7//7/wMA+v/s/wEA7v/s/+r/8f/+/+7/6v/y//L/8//z//D/6f/q/wMA8v/y//b/+P/6//X/7v/p//L/8f/z/+X/7f/7//r/7P/s//z//f/6//r/+f/y//b/AAD+//b//v8BAPT/8v/8//r/+//5//X/+v/3//v//P/0//7//v/7//z/AQAAAPP/8/8AAP7/9f/1/wAA/v/5////+v/6//f/+P/2/wIACAAAAP7/AAACAAQA///9//3//v8CAPf//f8EAAcA/P/3//3/AwAFAAAA+//9/wQADgAKAPX//f8BAPL/9v/7/wMAAwD9/wIAAAAJAA0ABwAAAAwACgAEAAAAAAALAAEAAQAAAAQABAD6/wAA+P8AAA4ABwAIAAQADgASAA0ADwARABgACgAGABQADwARAA4ACAASABkAGgAPABQAGQAWABsAHgAaACAAIQAUAA8AGwAfAP7/AwAWABIAGAAMAAwAHQAtACkAGwASACEAKgAWABAAGQAzACYACgATABsAIAAcABcAEQAYACkAFAAnACQAFwAdAB0AGwAGABgAHgAZABMAEgAfADQAHAANACoALQA3AB8AFgAoABoAEADy/wAAGQAGAAkAFAAlACwAIgAZAB0ARQBIABoAKwAoACkALAARABwAMAAgACQAQQA9AFsAQgArACoAIwAvABgA9P8BAAUABAAFAPz/NwAxABIAKgBdAE0ALwA3AFsAVQAlACcAJgD//7r/tv+i/5b/mf+Z/5T/rP/w/wAAzP/o/xkA/P/T//T/AgDZ/7X/iP+j/5r/s/9s/0P/if+X/xD/D/+e/9X/Ov8D/6//sf9f/xz/eP9Y/03/I//x/tn+4P7b/r7+LP9w/z3/J/+6/xP/+P5q/87/m//K/tv+7/4O/0/+Df7k/cn9vP0A/eH8iv3x/vf+ef5b/0YBPAJPAZABMgMEBPYCCwIvAnMCPwFEAD8ABwBCAOX/wf/W/6EAeAE3AuACSAOLA6ID7APIA/MCUwP0A/cCjAJyAkIDIAN/AvECbgOjA3MDvQNPA/UCXwMFAz0CSgLjAsQCxgEAAq8C9gIGAzYDxwPtAzoEwgNBA0EDMwMSAhIBsADP/1X+Cf2T/L37Qft8+4r7",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 20,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 58,
            "textTokens": 54
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 112,
      "totalTokens": 3285
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "PwBEAEgARgBGAEUARgBFAEMAQgBEAEMAQwBDAEUARQBFAEMAQwBIAEYARgBJAEwATABNAE8ARgBJAEoAQgBCAD4AQgBJAEEAPwA+AEAAMwAuACwALgA5ADgAOwAxADQAKwAuACgAMAAsAC8AKwAdAB4AIAAYAB0AOwBOAGwA5f/N/yoAQgDw/+f/NQAPABQAIQAAABIAOQALAP7/EAAOAAYAIQAOAA4ABgABAAMA4P8IAAsA1v+0/+f/OgAhACoAUQD5/87/o//T/zIAGgAGAA8ABQDi/7v/3P/8/+3/BADs/9r/6P/w//X/9P8CAPf/6P/q/+n/+v8HAAMA+P/z//D/8v/u/+//AAD///P/7//o/+v/7P/o/+f/5//s/+3/7v/s/+z/4v/g/97/2//j/+b/6f/o/+f/4//g/+X/5f/k/+v/5v/l/+T/4f/m/+j/6P/n/+P/4v/l/+L/4//o/+b/4v/l/+j/4//k/+r/5f/h/+j/6v/r/+r/7v/t/+z/6f/o/+3/7//w//L/8v/u//X/9f/5//n/9//0//j/+v8AAAcABQAIAAwACwAIAAoADgAOAA4AEwARABIAGAAYABoAGgAbABYAHAAhABgAGgAZABUAFQAUABQAFQAWABMAFgAYABYAEwASABIAEAARABcAEAANAA8ADQAHAAMABwALAAsABQAEAAcABwD+//v/AgABAPz/AAABAPz/+f/7//3/+f/4//b/9f/3//L/7//q/+3/8P/t/+b/4v/m/+P/5v/v/+v/6v/l/+H/3f/d/+D/4f/f/9r/3//c/9P/2P/e/9//3v/d/9//3//d/+T/4v/h/+L/4//i/+H/4v/n/+n/6v/r/+r/6//q/+j/5//w//T/9v/0//X/9P/p//H/8//x//b/8//0//X/+P/4//X/8//w//D/9P/1//X/+v/3//b/8v/2//L/+P/5//f/+f///////P////z/+v8AAAoABQACAAMABwAGAAUAAwAAAAQABQAFAAMADQARAAwABQAFAAcABAAJAAcABAAKAAkABgAGAA0ADAALAAQAAwACAAYACAAIAAoABwAHAAYABAAJAA8AEAALAA4ADwAKAAcACQAKAAsAEAANAAwACQAIAAcACwAOAAwADgAOABIADwAPAA8ADAAQABIAFAASABUAEwASABcAGwAYABcAGAAYABgAGgAdAB4AHQAdABoAGgAeAB0AHAAfAB4AHAAfACIAIAAgABoAHgAaABcAHQAiACgAIwAoACcAGwAdACMAKgAiAB8AGgAZABcAGwAcAB4AIgARAA8AFgAZABUACgAEAAIADAAOAA4AFgATAP//9f8AAAcAAAD6//z/9P/2////+f/8/wQAAQD1//T/9//5//X/8f/x/+z/7//t//X/+P/u/+7/6v/e/97/6v/p//D/+f/w/+T/7v/w/+//7//h/+L/6//r//D/8v/z//X/7//t/+r/5//w//b/9P/5//X/8f/v/+z/+P/y//T//f8EAPj/BAAKAAsAAAD//wAAAQD//w0AGQAaAA0A9//4/+n/BwAQAC4AHQAhABUAMQAeADwAawCMAKkAmgDvAMkA6gDhAQcCwP8M/w39xfo9/AQAkQOEA5ACIwBL/Xv8cv4QAYQC4wLtAKr+BP3K/VcAMgKsAZ3/Uv6n/Qb+yf+NBD8FcAEE/wf++fua/DYC2wNbAQEBX//u+7v90QE0Aub/uP9e/yYA9P7j/JECHwZwAKf7fP3T/p7+EAEBA9sBlP2y/eH/Mv+R/1kBEwKj/3n+Rv0G/8IChgF2/qQAkAA3/eH/iQH6/yj/Xf9RAOL/zP9y/88BawAL/G4AfgIAAPL+1QGE/iH9xwHUAQv/R/+M/6z+hQFBAFn+AAAzA5H/WPxB/o0AewG8AkQBDP5q/6D/Of1A/Q8DNwJS/1f/w/+qASIA5/3c/UIBfAKp/LT9UAWQAGH92P5x/gAAlP9EAGz/vwEmAxcAAf0a/vL9hf/OAjECsv/z/rMAfwK0/RX56QIWCGf/nvcRAeMG8fyW+JUEZApM/pb3PgDhBPT75/uMB/sE//qY+wP+bwOeA5kBOgD1/1oANf6K/4T8RgD9CRMDsfir/j8GrP9M/usD0Pti+wUF4P7z/JQDYwWK/9n8UAV1/Qn27AL7Ah79IghbBaj2wf3gBjz//vlUBLoLG/eF+I8GCP4a/GUDyAJYBKoAHfkS/hT81AX6A8f/y/1D/zQCk/0c/MUB/gTt/dr/hALtAt38TAD+/WX8HQDlAv4DR/26AuYCx/uE/bn9kwCXBSH+X/4lAJz9hQLlA28Bhv08/84CmfoY/ekCpgQqA/L5W/ojBLQLIvec9KsGiwwu+cXxQwgWDRL5N/UaA4EDTQQt/WoAy/35/LL8xQQfA0n5YwEuB6QBZvhh+k4AVAe7/dn+BAbG//b48Pz+BFQAtP2FChMBTvP2/oMCqf6yABgIPQQD9jj+zP/i+AoIIQ3e91j7iQPs95z6cwoTEDn79fQT9N79ugZbBvsBnQL1BWX4SvYW+OwDNwyDBAn+6foQ95n9",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 20,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 78,
            "textTokens": 54
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 132,
      "totalTokens": 3305
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "3PyXAfsEiwbDCFMLhApsCd4IKQjHB+oGqQcbCsgK0woCDX4PahC/EAoSAhOSEtIR8BFVEt0Qqg/0DhYNCAvlCNIGQAQjAUr/Lf4l/Cf7J/xV/Hn7pvtR/PL7HPp49z/2WfQ58J/ty+w17Irrwetn7hryQ/S89mv6df0M/yX/k//3/2X+H/yT+2L7y/ql+5D9AgCcA8oHbwuLDuAR+hPiE2wTUxI1D78LZQhZBH0BZAB+/kj9q/6v/8n/oAAGAqUB7v8E/gH7APiu9cLyJPA28FPwD/B28pH18vfx+Xz7//vD+xH7UvnL9z/2NfTQ8tzywfML9d/2nPgH+r76Hvts+4768/hb94/1S/NO8s7ye/Ln8gn0lfT39Bj1UvVy9DHzwfEI8ATvDu757cLt+u3b7bHtXe4j7rztP+0j7b7sL+2T7Wnv3/J78/v0WPjA+eT5fPou+yX8ifxx/M7/5wa8CtYOzhaGHQch4yG8JGklpSHKGwUWuBI+D2oKBwk1DtUQ5RD7FQQdACAGIGEgIx2FGN4RNghhAcn8pPe38Q/x3vOa9mz6pf6kA2wHJgg3Bu0ELgUvAf756vcJ+Fb11fMn9wz8G/8FAhwFVgqDDwsQWBDpEvETsBFJEE8RvxFvEBkP5g5ZD1UPhQ40Dp4Oyw4vDWcMMQ3+DMYMCAw+CikJfwiqBaIBif88/Z343vR78yTzofL88fXyAPVO9y74Avj++cn6qPco9O7z1vJC7wju7O5V8Njx7PPO9x79oQCNAsEF9wh3CScIAwguBzoElgGPAOj/hP/NAAoCLQSDByMKAg1OD7YQWBFOENENygrAB6ID2f7S+gn4yPW885vzKfVj9n33Q/nD+u77GfxB+2r6MvkX98b01/P/8/nzt/Qe94L5sPsa/igAIwG4AWEBlv+S/sj8b/oO+eH36faY9h33/Pa497P4Zfhd+Ar45/at9Wn0kPKW8dfwb+/Z7tbuGO7O7ZztEO2B7Dns8etk677st+xi7YDvRvAT8CPx3fKl8Q/x3vE78ufw9/FN9NL0t/jq+vb7mP9tAuYBmwFcBPoDWANFA6AFdgt/DfwQMRgMHakf6iAQIlwjIiAfGSAV7hHlC9oHWwcRCQELnwt2DvsTWxbaFkwX3hSwEcsKNAOV/5X6Q/XI8vXyL/O49RX7Sv5bAi0G5QblBn8GIQZXBDYBUP/C/q/+R/7c/1kEfQclCMgJEw+dEScQYxI+FfMTXBIoE74TjBPyEhER8w+dD6AMtAlDCTQIlwU5A3EDLQSRA/EDDAUKBREEQQNwAfj+W/xz+Af1bvKR797u0u/a7zXxPfRW92X5WfvL/av+qv2c+7z6gfk39xX2jfWD9jv4PvlS/N4AhgPjBcIIygohDCoM+wrzCT0IlQRYAnsBv/+V/m3+hP82ACABiwO8BYgG7gZdBzwG1QS/AgMA7P37+kX3CvZi9Tr0c/Vk9pn3jvmY+vj7n/2N/tb9lv3n/KH7xvpB+in7+vrC+3r9b/4mAEkCswLnAm4DeQGFAHP///wZ/BX7qvhb96v3efaf9c/17fQ49KTyUvFR8Drv7u3T7Hjsr+tQ6/PqwOt/6vvpNeyM6s/pN+xS7ajsge6U8LXwhfR38+bz5PYy9jT1Q/Rv9sj0t/Sc9KX1VPgy+cb6dfzKAAICjgGJAS4FSAS7/1wCEAHrAbcDXgRFCsYQGxbrF6EcBCFYIoAfLRy2HG4WhA1sCtUIvAawBiYHYApnD28Q7RF9Fm0YOhUiELYNTgm1Aaz8dvvl+G71yfVn97/7Mf8rAL8DVwj/B/0ENAerCW8GxANrBOwEiwTgBN8F5QdQCnIKDQqiDBMQTRD3D5MRGRNAE44TBhOwEqoSKRD5C1cJRAgxBUkBJP+r/o3+Lf4f/qr/zwGBAlcBcgHWAc//8vzA+Vn3RPXM8gXxhvDw8XnzRvTB9if7Ef6r/rcAmgIRAs4Apv+e/kz9K/uW+gL8y/yQ/ZT/7AJ8BaEG/AeACiwLfghJBq4FrQPC/1D8FPxo/Jb5avgV+0j9HP1J/a7/0AFLAWwAnQFBAloAvP/0/p/9Fv3z+wH7f/qa+rj60PqR+uT77v08/hH/DAGBAnYC0AHXAX4BqP/A/a/8lvuC+tH5V/oX/Cf9+f0gAHkB/gCJANv/9f3y+sj39/SQ8u7vzu217dPtnO0C7rrvNPDw7z/wa+9J74Dty+vb6zfr6elH6jzszuzL7XbvbfGy8gHzmPS09Ar1CfYd9Yr13va39sz2Y/kH+FH4h/rQ+PP3zPjh+c34ofn2+pr7Yf6J/rz9DgDwAp8BDf/3AqwH0AcECe4P7hZVGqgaER47I5oi5B2lGosaCxUCDuEKkQkkC5sK2ghNDVwS+xILE8UUbBWiEmoMBQd9BFMAmfrH9qz2mvfj9sX3NvwnANMBwwICBMgGVAeSBAcFtwf3BhIE7AVwCT0JcghBCfwL8gxLDMEMfw/2EU0R1RHXFLYWmBVQFGwTDhEkDeUIgwTqACr+HPv0+Ab5OPuh/I79rP+RAVQCrwETACH+rftX+L70avI+8Tfxq/F48gn1",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
 🤖 Agent started speaking
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🤖 Agent started speaking
 🤖 Agent started speaking
 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "MwAyADAALgAuAC0ALQAyADAALAAyADIALgAxACkAMAAqACsALAApACUALQAkACQAIgAhACEAJQAaABcAGAAYABYAIAABAA8AOQAJAAwA/P8ZABwAHgAFABUAJgAOABkAGQAQAAIAGgAUAAEACAALAAgABQAFAP//BQAMAPj/BgD8//v/AQD4//j/9v/9//z/9//1//H/9v/w/+3/9f/x/+3/6v/s/+b/7P/o/+j/4f/i/+j/4f/r/+n/4v/f/+T/3P/d/+n/3P/l/+f/3//n/+L/5v/l/+T/7f/m/+n/6v/l/+r/4v/l/+P/4f/q/+L/4f/k/+D/5f/j/9//4f/g/97/3P/l/+D/2v/h/9//3f/b/9//2//h/9z/2//h/9j/3//j/9v/2//a/9//3//Y/+H/4P/c/9r/2v/Z/93/3v/b/9r/3P/Y/9z/2f/Z/+D/1P/b/+D/2//h/9z/3//f/+D/5//j/9v/5f/h/+T/5f/f/97/4//g/+b/5v/f/+f/5v/i/+P/6//l/+X/5v/o/+v/7P/p/+3/6//o//D/8f/1/+7/+P/y//L//P/6////AAAAAPr/AwAAAP7/CQAHAAgADQAJAAIADwALAAsAEQASABIAFAALABUAFwAMABMAFAAgABQAFgAXABcAHAAQABwAGwAiACMAHQAbACMAHgAiACIAIAAtACYAKAAoADIALQAwADAAMgAwADEANwAxAC0AMgAvADIAMgAyAD0APAA+ADoAOQA4ADwAOAA3ADUAPQAuADgANAA3ADwAKgAxADQALwAxADIAMAAxACgAKwAmACsAJAAsACIAKQAoACIAJgAlACQAIQAkABcAJAAeABwAGQAhACQAHAAaAB8AGAAbAB4AGAAbABkAGwAXABAADgAVAAwAEgANABAACgAHAAgABQAHAP//BAACAPn/9//7//f/+f/z//H/8//0//v/8P/v/+7/7f/w/+3/6f/t/+f/5f/l/+X/5v/p/+P/5v/j/+P/4f/a/+H/3P/f/9X/3v/Z/9b/3P/W/+D/1v/X/9f/3v/X/9n/2P/U/+H/0f/b/93/1f/a/9f/3v/d/9n/0P/Z/9n/1v/e/9f/3P/e/93/3P/k/9z/4f/c/9v/5v/e/+j/5P/h/+P/4f/o/+f/5//q/+b/6//o/+r/8P/1/+v/7//s/+3/9P/t//X/8//v//H/8f/3//P/8P/7//L/+P/2//z/+v/9//7/9v8AAAQAAgD7/wIA/v8AAAMAAgAAAAQAAQAAAAIAAgASAP3/AgAKAAAABgD9/wEACQAKAAoADQAGAAsACQAHAA8ACgAMAAoAEgAOAA0AFAAJABMAEQAKABcAFAAUABYAEwASABYAEgANABUAEQAUABAAGAASAAsAGAAPAAsABgAWABIAEQAZAAoAFgANAA8AGQAOAA4ACQAOAA8ADQAMABAAFAAUAAwADAASAA8ADQAPAAcADAANAAoADQABAAgACwAIAAcABgAMAAMAAAAKAAMAAAD///3/BgD//wIAAQD2//3/+P8AAP7/+v////r/+//4//b/+P/9//T/9v/3//H/+v/0//n/9//v//b/9v/w//P/8v/v//T/8v/6//T/7f/3//r/9//t//T/7//u//T/+P/2//H/8v/n//L/7f/y//D/9v/5/+z/+f/0//D/+P/x/+3/+v/0//H/8P/0//L/8//x//P/8//x//X/8v/y//H/+P/9/+r/6v/5//X/+//2//X/+v/4//b//v/8//f/+//7/wAA8//7//r/+P8DAPv//P8EAPr/BgAAAPn/AQAAAAAABwARAP//BAAHAAAABwACAP7/BgAHAAkABwAQAAkABQABAAsAEwAOABEACgAOABIAFwAPAAsAEQAPAA4AEQAMAAsAEAARAAoAEQARABIAEwAWABMADgAIAAsAEgASAA0AEAAYAA0AFwAQABcAEQAPAA4ADQAWAA0ABgAMAAsADQAOAAkADQALABEAEAALAA4ADQAKAAsACgAKAAIADAAMAAkABwAGAAYABAASAAsACgAOAAUABAABAAoACAADAAEABAAFAP//CAABAAQABgACAAAACgADAAkAAgAEAAcA//8JAAkABgACAAsACAAIAAAAAAAFAAIADwAJAP////8CAA4AAQABAAYAAwABAAUAAwAAAAUAAAAAAP//AgD9//z/+v8EAAUABAAIAAMABAABAAEAAAADAP7/AwACAAAAAgAAAAIACwAGAP//BwACAAcAAQAJAAcAAgACAAAABgAHAAkACAAKAAQADQAJAAQAAAD+/wYA+v8GAAoA/P8AAAAA///+/wwABAAAAAMABQAEAAAAAAD7/wEABAAFAPv/AAAAAAMAAAD+/wAA/f/+/wAAAAD0//P/+f/3//X/7//0//P/9f/8//r//P/x//f/8P/z//H/7f/w/+v/8f/t/+7/7v/m/+j/6P/j//D/6P/v//D/6v/r/+3/6//h/+j/7f/u/+z/4//p//L/4//m/+X/5//s/+7/8P/v/+7/6v/n/+f/4//z/+7/7P/y/+3/",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "7v/w/+//7f/0/+//7f/s//H/6//t/+7/9f/u/+v/9v/w/+z/6P/j/+n/9v/0//L/7v/n/+f/7v/v/+//AADx/+n/+f/4//X/7//y//H/+f/z/+j/+f/0////8v/x//H/9f/1//L/8//1/wIA9f8AAPr//v/+//n//P/6/wEA9f/9/wEA/v8AAPz/BAAIAAIABAALAAAAAAAFAAEAAgAIAAkAAgAIABAABwAAAAMAAwD8////CQAFAAQADQAEAA0ADQAJABMABwAQAAgACwALABEAEwAPABsAFgAZABcAFgASABUADAATAB0AFgAeABoAHAAZABUAGAARABYAFQARAB0AHAAZAB0AFQAbABwAGgAcABAAGwARABQAEgATABkAFgAUABQAGAATABMAEwAZABIACwALABQAFQAYABIAGQAXABgAHwAOABsAEAAJABIAGwAQABcAEwAVABQAEwAMABAAEgAJABkADAAUAAgAFQAKAAgAEQANAAYACwAOAAkABQAGABAADAAJAAkACgD9/wcABwADAAIAAgADAAYAAwAFAAQABQAEAAUACAD8//v/AAADAP7////3/wIA/P8EAP7//f8FAPz/+//6//z/7f/z//3/9f/7//j/+f/2//v/+//1//j/8f/4//f/+//z//j/+f/4//r/9P/2//X/+f/4//P/8f/1/+//9//2//n/+f/0//X/9P/y//P/+P/w//P/9v/x//X/8//t//L/7P/w//P/7v/w/+3/6f/2//H/6//3/+z/7//3//r/9//0//P/+v/2/+3/9//v//f/9v/w//7/8v/4//j/7v/8//n/9//0//j/+f8AAPf/8/8AAP7/+v/u//T/9P/9/wAA/v/0//X/+v/w//X/8//+//r/+v/1//z//f8AAPz/AQAAAP3/AAD+/wsACQADAAQAAwD8/wgABwAHAAAACAAFAAMAAgAEAAcACgAGAAMADAAGAAsABQAFAAMABwACAAkAAwACAAsACAAFAP3/BgD9/wYABAABAAYAAQAGAAQACQAIAAIAAQAAAAAAAwAHAP7/AgACAPr/AwAAAAoABwD+/wMABQAIAAEA/P/7/wUA+/8AAAAAAQACAAAAAAACAAgABAAGAPv///8AAAEAAAD8//3//f8AAP3/AAD8//j/AAAAAP3//v8CAP3/+/////3/+/////j////+//z/AAD7//j/AAAAAP3//v/6/wMA9P/2//z/+//+/wQAAQD8//v/8/8BAPv/+v/8//n//P/4//v/+v/3//7/AAD+//7/+//5//7/AAD4/wQAAAD+////+v/9//v/AQD9/wMAAQAAAP//+f/+/////f8CAAAAAAAGAAAAAAD+//3/+P/2/wAA/f/3//f/8//+//3/9v////n/9//5//P/+f/7//3/+/8AAP3//P/8//v/AQD1/wQA+//+/woA9/8AAAAA/v8CAAEA///9//r/+v8AAPz/+f8EAP3//P8AAAEAAQD5/wAA/f/6//3/AgD+//r/AAD//wEA///+/wkAAgABAAIA+P8CAAEAAwD//wAACQABAAYABAANAAQAAwAJAAoACAAGAAQACwAJAA4ACgAEAAoAAQAMAAkAAwAEAAwADQAJAAsADQAMAAUAEgATAAYABwAOABIACQAHAAkAAQD//wwADQALAAkACQAMAAwAFAATABQACQARABAACAAPAAUADgAIAA8ACwAEABMACgANABEACQAOAA4ACAAQAA4AEAAJAA0ADAANAAwAAAAOAAwAEwAUABAABwAKAAsAAQANAA0ABgARAAwAAgAJAAcACwD+/wkABQANAA8A/P8EAAQABwD7/wIA//8EAAMAAAABAP//BwD5//3/AAAKAPj/AAD8//7/AgD4//3/9f/9///////y//b/8v/6//n/+v8BAPf/9//4//f/9P/8//j//v/3//n//P/1//n/7P/5//z/9v/9//z/9v/2//7/+v8AAPz//f/5//z/BQD2////9//8//X/8//2/+7/8//2//v/9v/6//f/+//7//n//v/3////+P8AAPb/9//+//r////z/wEA8f8AAPX/7v/2//z/+f/0//j/9f/6/+7/+//w//X/9//8//z//P/+/wAA+f/z//j/9P/3/+///f/2//n/+f////z/+v8AAAEA+v/6/wQA+P8BAPf//v8CAPv/AAD1//r//v8JAP7/+f8JAAgAAwD9/wIAAwADAAgAAgACAPv/AQADAAMACAAEAP3///8IAAgABgAEAAYAAQAJAAAAAAAHAAoACAD9/wUAAwAGAAgA//8LAAsA/v8MABMABgD//xIADQADAAYADQAMAAIADAAAAP//EQAJAAgAAAAEAAoAAwAAAAIAAAAHAAcAAgACAAIAAwD//wMA8f8AAAAACAD///r///////r/8P/1//f//f/5//v/8P/9//z//v/x//v/+v8AAPj/9//7//L////r//j/8/8EAPH/BgD6//r/BADz/wEA+P/4/+7/AgACAPv/+f8BAP//+v/8//j/+P/5//z/",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "+P/y/wUA9//v//3/9P8DAPv/+P/4/wEA/f/3//v/8P8BAAAA+f/5//f/9//x//X/7P/u////9//s//X/+v/4//H/9P/4//r/+v/r////8//5//r/7/8AAPr/+//y//r/BQAAAOn/8/8AAPT/7//w//b/9//y//L/9f/5/wkA+v/+//r//P/2//n//P/4//3///8KAPP/BgD5/wIA/f/9/wAA/f8AAP3/AADx/xIA+P/+/wMA+f/+/wwABgD+/wYAAwALAPr/+P8GAAAABAALAAAACgABAAcABwDy/xEAEgD4/wwAAwAHAAYA8/8UAAAAAAAYAP3/CgAYAAEADwALAA0AFAAAAAwAGgACABQACQAHAB0A8v8QABMAAAAXAA0AAAARAA4AEAAOAAoAJAAIAAgAGQAHAA8AFAARABEAEQAQAA0ACgAbABcAAgAOABgAEwAMABoAEAAXABAAEwAYAAQAHwARAA8AHgATABwAFwAOABsABQAXABwAAAAZAA4ADQAHAAsADAAUABEACwAXABIAEgATAA0ADQAWABAADQARACIADgATABYAFwAeABcAGQAKABoADgARABkAHAAfABQAEwATABIAGgAKABEAJwAMAAoAGwANABUAGgAIAAUACQAbAAcADgAcAAUAFQARAAQABgARABUABwD6/w8AFAALAAQACgATAAEAAgAIAA4ACQAIABQABAAAABEA+f8GAAIA9f8EAAgADgD6/w8ACwAQAAQA8P8IAAsA8P/+//z/9f8XAPv/AAD5//j/CAABAN7/5/8SAOr/uv8GAOn/DgAOAK7/aQBvABAAKACa/2L/t/9d//L+r/80AR8BeQACAQAB+f8q/yUA1P/G/uAAzwDa/yMAmf/h/9r/aP9c/8b/MQBHAF//Yv8eAMr/qv9f/i3/jgB5/7n/uP/i/2AAof/6/o7/bQAcAIz/zv+F/44A0//D/goAuf+y/4H/l/+F//f/zf/A/qL/DgBE/48Bwf9q/zsBMv8UANj+Cv9AAFsAgv+v/2MBwQHM/94A9/8EAKUAKP4z/y//ZAEXAfX+aAADA8sAJ/+y/n8B/P+H/nH/Ef/6AucApgAxAaL/+gFJ/4P6XAC+/n39fv2H/FEA1f/5/QsAbAA9/U3+7fx0+lj7Bv/5+3b8mv/s/27/UP6H/hn/tPwt+0T/M/wN/IUAIP/8+/L99v5j/Tv8WPzu/XL9P/4q//b/SwGfAmcCiAHoAT8EbwTsAW8DrgVbBSIE1QTlBXcF4AVcBFYE3QSuA2kEjwLzAdYDxwMiAs0C+gJCAuEAVADx//j/MAFcAb8BwwFRA/gC6QKeAu4DkwPeA78ELwRfBbQFVQZ2BWkFBwYXBvUEgQWCBVQElgRMBP0CHQMyA1QCrAKWAAQBUQFU//3+s/53/mD9nv0Q/lL98v3Q/av98fzF+6P9fPwb+0X8zPtF+0j6qftK+/D47fvF+sD5Ovoq90D6VffO9EL5+PXE+GP5mPe0+HD2cPjr9cz0e/f093/4U/fs97/6+/c2+N75pPiq+XP4Uvnd+Vn6OfvD+738w/oe/Qz8/fh6/O/5BPrd+/b6TP4IAID/KgHDA/UDPQimC8wMKBDGDTMLrwlNB10JJwvpDLgQdRF7EMYONw0sC/MG4gR0AnMBgQHCAQEDaAJuAiQBEf/9/qT+tP5S/ib9qf6l/5cABAMZBX0GtgaKBvsGrgf7CFQJpwmUCvwK7Au9C2UMAQ25C0MKSggOB/YFwwPsAhMC4wBgACX/7v3v/Kr7/PmY+B/4J/g4+Pz3cviT+W/5CPoU+0z7hfxB/UH9Wv5P/z8AxAGWA/kElQUKBgkFQQT7AzEDJAN2A5kCygI3ARUAQQAw/tL99/x4+2T6VPnx+L74tPfo9zT4QveD+Mb52PnP+gf8MfxK+w79BP0//Dn/lf69/0IAyP+LAdj/gv/A/Kz7sv1k+rz5Gvs0+d/40Pbo8Rfzw/QI8RLxYfJw8ZTxCPD075jxQPFT8AfyWPKL9Iz3ffdd+j36yvnQ+476Tfw1/p/9SgACAJD/6P8qACMC0QBm/mAAdP8W/5sBhATdDAgSbBMlE3MNwQhxBGYALwPMBiQN1w8HD1sRahA1DlELfAaNAwsB0f85AlAEMgduCKwGuAOXAwsElwMVAxUCPgF9AX0CKAUFCY0KsAt9ClsJoAkxCjQKdAhvB7IICwkfC2oOPw/2DSgL2QevBAgEpgOVA0YCVwGnAaIAo/8XAEf+Wfzp+sf4MPmD+eD5avp++mX6bfzB/fX9xv9RALr+D/6u/RT+SP9iAG8CRwTlBZ8GGQYlBV4EHgKj/7D+k/9iAM7/wgDWAXEB8/8W/nr9V/x8+w76Rvks+2D88vzy/In+4v6k/h7+JfyX/e79CfyK/Cr+Z/8LAWMB2AHFAVoA3P45/KL6Pvo4+Bf3vvl+/E/8H/yn/Kz4S/Vw8WzuA/HD7g7tdvBX8QzzmPR08yf1e/Np73jtbe1c8KryWfOH9P/3/vc6+LL6+Pn4+9D8UvkP+4r8O/z5/Y/+sfu6/Dn+jfpl/k79a/qg/Q/6",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 20,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 98,
            "textTokens": 54
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 152,
      "totalTokens": 3325
    }
  }
}
 📨 Processing event type: usageEvent
 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🤖 Agent started speaking
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:520 🤖 Agent started speaking
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "sgC4AMAAxADPANwA4gDgAOIA8gD9APwACwEHAQMBFwEcASIBGQEjAS0BMgE5AT8BSgFOAU8BTAFXAVcBYwFlAWgBbwFtAWwBcwGDAYEBhwGGAYYBiQGHAYkBiAGOAYkBgQGFAYkBhQGHAYgBhQF/AXoBeAF1AXABcgFsAWABXgFbAVcBUAFGAUUBPAE4ATEBJQEbAR8BFwETAQQB/QD2AO4A6QDdAOMA1wDSAMcAwgC/ALwAsQCpAJsAmACMAIYAfgBwAHYAXwBpAFwATgBLAE4ASgA4ADgANgAhAB0AHAAWABQABwD3//X/7P/n/9r/z//Y/8j/w/+3/6//q/+e/5n/lv+T/4L/g/+H/3f/dP9p/2H/Zf9f/17/Vv9P/1b/TP8+/0T/P/84/zL/K/8u/yP/LP8l/x7/GP8Z/xX/Fv8P/w7/E/8R/xX/CP8H/wT/B/8I/wT/Av8C/wD/BP8C/wL/A/8D/wr/BP8E/wf/CP8C/wT/Av8F///+CP8L/wn/Bf8I/wz/C/8S/xb/F/8Q/xf/G/8d/x//I/8e/yD/Jf8n/yv/K/8z/zn/Pv9A/0L/Rf9C/03/Sv9O/1H/T/9V/1X/W/9n/2L/Z/94/2//cf9z/3v/e/+B/3//hP+J/4T/kv+Y/5j/mP+W/5//of+j/7H/r/+0/7j/uf+4/8D/xf/N/87/zf/W/9T/3//b/+D/6P/n/+7/9v/7//7/BwAFAA0AFgAXABwAIgAoACkAMwA1ADoAPwBFAEsASgBYAFoAXgBtAGcAdAB2AH4AggCHAIkAkQCfAJgAowCmAKgAsQCzALsAvwDBAMcAyQDQANIA1ADaANsA4ADhANoA3wDnAOQA6ADpAOYA5wDnAOQA5wDkAOYA5gDjAOIA3ADhAN8A2wDVANwA1gDWANMA1ADVAMwAzADGAMoAygDDAL8AxAC4ALYAsgCtAKQApwCqAJsAmgCdAJMAjQCFAH4AfgB6AIEAdQB0AHQAcQBoAGUAZABiAG0AZABeAF0AYgBeAFoAVwBSAFEASwBKAEYAQgBGAD8ARAA8ADoAOQA6AC8ANQAvACoALgAhACAAGQAbABwAFwAZABkAEQAQABEADgAOAA4ADQAKAAQABgAAAAUAAAD9//v/+P/6//X/9//r//D/5//m/+r/4//l/9j/2P/Z/9n/z//O/8v/xv/A/8T/wP+6/7T/tf+t/6v/qf+o/6X/o/+l/6D/n/+f/5//kv+R/4r/hv+L/4j/hP+H/3f/dv94/3P/cP9s/2r/bf9q/2j/Y/9c/2T/Y/9j/2P/Yf9a/1v/XP9X/2H/Xv9b/17/W/9Z/1z/Wv9U/1T/WP9T/13/Wv9c/2P/XP9k/2H/a/9k/2r/bf9o/2z/bP9s/3L/df90/3T/d/98/3j/f/+A/4D/iP+L/4v/lP+X/5T/nP+e/6P/n/+r/6j/sv+v/7H/uP+0/77/uv+//8D/wv/H/8r/y//V/8z/2P/V/9b/4f/f/9n/2//n/+D/6P/o/+v/6P/o//D/9v/z//f/AAAAAAYABQAKAA0AEQASABQAHAAaABsAIAAkACQALwA0ADMANAA0ADUAOAA5ADwAOwA+AD8ARwBEAEYARwBEAEoARABJAEwAUgBNAFcAVABUAFwAWwBdAFsAYABjAGQAYQBdAGUAZwBkAGYAYwBoAGgAZABkAGwAbgBoAGgAaABhAGcAYgBlAGMAXwBhAFwAYQBhAGEAXgBaAGAAXgBfAGQAWwBeAFsAWABXAE8ATwBKAE4ASwBLAEcARwBMAEYAQABFAEIAQQBAAD8APwA7ADoAMAA8ADQALAAwACsAKgArACUAIgAgACQAIwAiAB8AHQAaABcAFgAXABUAFgARAAsAEgAOAAcADQASAAUABAAGAAsACgAAAP//AgD8//z//f/8/wMA8f/3/wUAEwAaAA4A9f/q/+v/AgAiACgAHADy/9r/2f/2/xoAHAAFAOP/0P/e/wAAFwAPAPb/2v/c/+//AwAKAAIA7v/s//D/AAACAPH/4P/c/+X/7v/+/+z/3v/c/+T/9v/3/+3/4P/X/+T/9P/4//D/4v/Z/9b/5P/q/+n/5P/W/87/1//j/+f/4v/W/8//0f/W/+P/3//k/+L/2f/V/8//0P/X/+T/5//b/8v/xf/M/9n/5f/l/9X/wv/C/9L/5P/x/+v/0//H/87/4f/0//H/4v/M/8//2//r//P/6//X/9L/2f/b/+X/4f/e/9j/5v/o/+v/5//j/9//7////wAA7//m/+r/8/8BAA4AAwD0/9//6f8XACcAGAD+//X/7f8LAAQALAAaADAAGwA3ADAASgBZADQAUABzAAIBwwCEAYEDngY+BSIA4vr9+p3/ogFFAOz8F/6IAJgA3f+aAJ4BSACw/cX9VACFAdUBfwH+ANQAFf92/jL/2/5o/gv+Ov/S/0UAHAJcBSEE9f1r/iME5QfqBK797vo8/xX8bvuIAc0E4QKQ+4T8RwGk/+n8Sf9w/fn5DwGdBysAH/zT/W4FhwPs+ZL91/pdAXkGzPhg+z8DowlbAO76YwGnAxYJ",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 19,
            "textTokens": 1
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 117,
            "textTokens": 55
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 172,
      "totalTokens": 3345
    }
  }
}
 📨 Processing event type: usageEvent
 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "8BNuFHgTrRGUEaYQQxIQFHgURxT6Ei4RIRDkEGYRrBHpEAYQ1Q1VDAML0witB4UFQQQ2BMYElAW7BZYEowHL/pb8R/uo+tP63frW+sD7Kvya/OP8CfzX+h/60flf+qT7oPy5/I/8vPxJ/Wb+tP/DAFQBvQHsARECFwIHAocBCAEzAdcBZAPiBM4F6wUvBTgEbQPDAn8COAIAAuEBzgEDAuMBswH5AOP/wf4c/sH9pP1l/en8Pfyc+0P79voU+0D7IPvd+pL6EPrs+bT5UPne+NT4/vjl+dP64vus/PT8aP1//QL95fxs/cv9t/4X/9j/pwDqATECewKBAusBTALeAbgBhwGiAYsBowFmAUwBuwFrAYMBBgEWADr/f/6z/Tr9AP2T/L38evx//Fr8Cvxz+5P6mfl5+OD3qfe399b35ffs97X3kvei90j3/vZO9ub1NfWK9d71DPY+9kH27fXY9VP2QvbF9ob2afa09QP22vXO9bL2jfYQ9pb2NfhX+FH5u/jM94r3nPYP99/3JPky+XL5MPoQ+pH7pPxj/d/90fxM/OD7I/wq/Eb9bP2Q/SL/av9qAHABRgFXAcsCQQRMCcwN7g/kEG0OmwsLCVEJXAuwDhcSRxTKFoMXSxjeF38WaRT6EQ0RtBFMFAoVRxY5FdQSZhFXEN0QzRA3ETwPVA1jC/0I3wcQBu4EYgP0AmUDGwTQBC0EvwHz/Xr7zfhc+Hv5Bvo6+w38Wfzb/NP9Of1g/I77Q/pa+n/7v/wD/sj+6P42/x8AawHtAhcEaQQZBIsDNQMdAxYDGwNDA64DqwQfBloH6gdFB70FMAS+AgkCHgI+Am0CWQIHAr4BcQH2APr//P6+/c/8YPwh/PP7l/sA+0P6BPpO+tP6HfsQ+4z6xvlB+Wj4Nfie+Ef44fiA+UT6r/u0/P388fzH/An8n/x1/X39gP67/hX/KQDtAOMBqQL8AnICtgIQAuEBRAKiAYABRQFrAboBTQKDAtYBwgA4/yP+zv1H/fj81vyR/GX8Gvya+2b71foS+sv5c/kV+eL4Rfh/95723fWA9d31l/a/9sv2BPb49YH1u/Rb9MXzafMs84/zH/P085307/OY9Jv08fQa9VP19PW19Gz0gPTX8+f0KfYP9t72OPlu+Nz4IfrA+Qj5ZPg4+uL3H/uW+237ff6H/S793/vC/hz9IP9j/5f+yv+z/m3/Gv6wAYkAGARZCacMvhEcETgR6wyuCnoJhQg4DPAPPRJMFUAYvhchGJEYvhSSE54SXxBjEi4UJhVhExoTYhFmEI4RYRG7EcgQIw9zCxUKgggtBnQFOQRKBM8DtATZBSkFzQMYAMn8cfqw+aP5hvrA+wX87/yS/f79N/55/Xn8s/tm+xH8AP3R/ZX+xf68/gwAWwH2AnUEkgRyBPYDFQOJAnQCZgJaAu8CLwSxBT8H4AdOB84FBQSwAtIB3AGzAZgBDALUAaoBxAFKAZAAuv+2/tj9R/3j/GH8s/sA+3L6RPr0+jz7hPvr+7L7Svvm+m36bfkE+bD4A/ke+s/64Pse/df8w/xV/L77jfz1/Bj9Cv6X/rH+IwCUAJQAMAHlABsB7AHPAQcCNQKFAfIA6QChANYAwAHFAf0BVAFQAKT/hf7R/ej8R/xU/AT9hP3A/U39Pvx9+3r6v/nk+Df5MPlJ+dP5pPm3+Vn5nfho9572zPVh9aH10fUX9sr1uPXz9fv13fVr9ev0RfQ49PTz/PPf8170dPRT9E/1UPbM9in31Peb9kz2xvWQ9Y31F/dy9nX3cvn0+EH7jvo4+9/77/tR+w/8uvtb+0D72fv5/Yf+QwCc/9X/WwBB/7n+wv+l/ksBAgNRB7IMLw44EQcOeAsRCncHsQk/DS4OSRCeEfQS4BP7FcMVahTmEnIRyRGOEq0TgxJIEdEPXA9NDq8Q0xKSEkkSXQ9zDPcK8ghJBy0G2ASXA3gE8AXSBpMGqgNzAX7+1fxb/Bf8JfwW/NP77Pvm/J79K/5u/t39NP3x/Oz8KP0a/Zz87vtc/A/+ewA9ArUD6AMlA7wCKAKqAR0BfAB9ADMBlAL8AyYF9wWRBeoEEwRVAwEDwAJvArgBGAGKAJgASgFeASkB3gCnAG0AHQBM//L9x/z6+9r7Fvxn/Kv88fxe/Wj94PyO/Mv7E/v3+sH6p/r4+in7qPsd/Cv8bPy2/Gf9bf1L/Tf9Iv2X/cP9Tf7A/hz/WABjAckB4QFWAS0B3QCSAO4A6wDhAOwARQGTAdsBxAF9Ac8AKgCH/xb/D/+G/jv+4f1Z/WX9vf2w/cr9+vy7+9j6Lfr4+cH5n/mH+QD59PgP+SL5H/lo+EH3SfZR9k32cfZ39mz2H/Zf9nn2XfYi90r3NfdA9ir1t/Rx9U72F/Z09lL3NPcp+JH5l/le+MT3gPeh9tL3RPhK+Az4evmP+d/67fsD++H7svx0/Nz6OvsQ+4j8+/zy/N78Ev21/cv+JQAxAen/aP/H/8X+6/61/94ANgKoBYMIKgx8DAoMLgpzCFwHiweNCVALEA2MDY4Ogg+bEE8R8xHUEC0QkA9VECoR",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "EhE4EM0Oow2RDbAOZRCMEd0Qlg/YDXkMMgsBCvsIQAfjBaUFzAW+BvYG5QXzA+IBPwDx/+T/v/8W/9D9FP0J/af9Vf5W/t/9Rf1P/cP9GP4d/jr9Cvzu+iD7Pvze/df+Rf8f/9r+Gf9h/37/Ev81/sL9L/48/34AHAFFAdoAegCCABEB2QFBAg4CdAHGAJIAyQAKAScBCQEJAWMB5AE6AjICkwGAAIz/FP8f/5D/x//N/6D/Zf81/zr/Kf/X/lL+2v2x/aT9nP26/bj9jf1g/Wb9Gv4n/9r/6v+s/+r+5v7l/s3+LP9D/3H/lf/x/z4AXgBFALP/J/96/l3+oP6z/tn+Mf7a/dP9Iv4Y/lD+hf7X/eX9l/0e/Vv9Hv5P/GP84vua+zj8nPyD/Cb6hPvj+b77sPv5+MP5Vfq0+uX5D/m0+PH6Afti+hD5G/ly+tn7AfoS+uz6lPj6+WD6oPl8+uX6T/kM+cL6afod+s77IPpH+RX6OPss+4n7+ftq+1n8NvwO/HL8Rv5E/mD9Q/27/Un+Af+Q/wD/n/6//mT/sv9xAI4A7P+1/63/9f9vAO4AkwBFAGYAQwBaAJ8AmQCVAKUAhQCiAOkAFwEgASsB5gDoADoBiwHdATkCNAIYAhcCBgIXAmECugLjAhUDNQORA8IDNQSKBIkEgwS7BBkFYgXDBekF9AX6BRIGGwZmBrkG2gb4BhIHKQc1BzsHMwclB/sG0wbABsEG0QbRBsMGkQZzBmQGYwZwBnEGTwYhBgMG8wXtBewF4gXGBasFnAWeBaQFlQVlBSUF7gTPBL4EqwSPBFkEJATxA84DrQOCA0QDBgPSAqECfgJPAhsC2QGTAVABFQHnALUAcQAjANz/lP9T/xH/y/59/ir+3v2i/W/9Qf0J/cf8hfxP/Cf8A/zg+7f7kPtt+1P7P/sz+yz7KPsj+yj7NvtH+1D7Wvtb+2T7gPu1++77IvxO/Hz8q/zf/BT9Qv1p/ZD9xf0H/kz+hP6x/tr+//4i/0f/b/+R/67/yf/i//T/BwAYACAAJQArAC4AMAA8AEIAPwApAAkA5//O/8T/sv+d/3X/TP8i/wT/6/7N/qX+fP5S/i3+GP4F/uz9wP2Q/Wb9Sv03/SL9CP3k/MP8pPyH/G38V/w5/Br8/Pvo+9r70fu/+6f7iftr+1r7TvtH+z37L/sZ+wj7/vr/+gL7A/sC+//6APsG+xT7IPsp+yr7Lfs4+1P7efuf+7772Pvs+wP8JfxL/HH8k/y1/N78EP1H/X39rP3U/ff9Hf5O/oH+t/7p/hL/O/9n/5f/zP/7/yYASgBrAJAAtQDaAP4AFwExAU0BcwGdAcoB9wEfAkUCaAKNAq8C0gLtAgMDHwM9A2MDjwPAA/EDIQRUBIUEvATtBBcFPwVmBZEFvwXwBSYGWQaMBroG6wYbB0oHbweMB6AHsQe8B8QHxwfJB8kHyAfIB8sH0AfMB70HpweHB2gHSwc0BxwHAQfkBsgGqgaLBmkGPAYJBtMFmwVlBS8F+QS9BIEEPwQBBMcDjgNWAxsD2AKYAlYCEgLOAYsBTAEMAdEAmwBrADsABgDO/5D/Uf8W/97+sf6F/l3+Nf4U/vD91f29/aH9h/1s/Vb9Rv08/TP9Jv0Y/QX99/zq/Oj86vzr/Or84vza/NH80fzR/NL81fzW/Nv85vz4/An9Ff0Y/Rv9Hv0t/UL9W/10/Yj9l/2p/bz90/3p/fn9Bv4V/iv+RP5g/nn+jv6b/qf+tv7M/uT++/4K/w3/EP8S/xn/H/8n/yr/Kf8l/yf/If8c/w7/+f7e/sn+uf6v/qT+l/6A/mL+RP4n/gv+8f3Y/bz9nP1//WP9R/0s/RH98vzP/Kz8jfxw/FP8NPwX/Pn73vvI+7n7q/ud+4v7ePtl+1T7SPtA+z77P/s++0H7RPtR+177bft6+4L7i/uX+6r7wfvZ++77B/wg/Dv8YPyF/Kj8x/zi/P/8H/0//WP9gf2e/b394f0K/jX+YP5+/pj+tP7O/vL+FP83/1b/cf+Q/7P/2P8CACQARgBfAH0AnAC8AOEAAgEfATsBWgF8AaIBzAHwAQ0CJQI7AlkCdgKSAq8CxgLfAvcCFQM3A1UDbQOAA40DngO0A8oD4gP0AwIEEQQfBDQESwReBG4EdwR+BIcElASiBKwEtAS5BL0EwwTNBNsE5gTsBO4E7QTtBPME+AT7BPkE9gTxBO4E7gTvBOsE5ATbBNIEzATJBMMEtwSlBJMEhQR6BHMEaARZBEYEMQQdBAsE/QPvA9wDxgOvA5gDhQNzA10DRQMqAw8D9gLfAsgCrQKRAnICVAI5Ah0CBQLpAcsBrQGOAXIBVgE5ARsB+wDbAL4AnwCCAGQAQQAgAAAA3//D/6j/i/9t/1L/NP8a/wD/6v7P/rX+n/6F/nL+XP5K/jT+H/4L/vj96f3b/cr9uf2q/Zf9if19/XX9a/1g/VT9Sv09/TX9Lv0n/SH9Fv0M/QX9//z6/Pf87/zp/OD83fza/Nn81/zR/Mz8x/zE/MH8wfzD/L/8vfy7/Lv8vPy9/Lr8uPy2/Lb8",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "Fv0E/cf8tfy3/H38B/zL+8n7uftx+xD72vrH+ln65/n6+R/6DPon+tD6S/uh+wv8H/2//fv9tv7z/60AsgANAQMCmwL0AQMC4QJ6A/YCTwM9BHkEVQRbBAsFOQUhBTkFuwV/BesE5QSDBMADVwOwAh4CigG+AFgAqf8Q/5H+HP6u/XL9b/1+/Yf9TP1C/Xf9VP0g/WD9b/0D/cz8xPye/An8nvtj+yz7tPpt+nP6M/rY+V/5XPlY+Sj5y/jc+Nj4Tvjg9873hfcB97r2S/YM9qP1a/Ur9eL0lvTu84XzXfOC80PzAvP+8uXycfIf8ovydPJz8rDy4PLE8rzyX/Po88XzzfNf9Bb1ZPU29Qz20/aE9pf2MvfS90L4Xfic+Fz5nfk9+dn5uvo3+xv7HPwr/QD+Sf9RAV8DLwTcBTwHKwl6CjQMXA5OD2wPwQ+zENoQ2RDJEAMRLhCPD+EPMxCTD/UOOQ9HDwEPJA9mEN0QQhASEE8QXhCZDysPWQ+NDtwMsQsxC/MJJgioBvEFpgQRA1UCPQLZAc8AKgAQABkABwBpAOkAEQH6AO0ADgE5AVEBRAH9ALUAjQBcADgADwDJ/3v/MP9B/6r/LQCLAMYAHQF2AeQBfwJHA/IDVQSPBK4EygQLBRYF2AScBC8EvQNuAzgD2gJLAqYBIwG/AH4AWABVADMAz/+Y/5b/n/+b/47/hP9M//z+3f7g/qT+AP6E/Vr9Dv2W/Gn8c/xO/NH7pfsF/EL8Tfyn/Ev9pv31/ZT+aP/z/1EAKwHOASoCjwL8AmkDbQONA6kDlANpA3MDjAM6A+0C7ALaAqkCbQJbAoECQwL/AdkBtAF+AUMBHgHLAEQA4P+D/wb/bP7r/Xz98fxB/KT7TPvT+k362vmJ+Sn51viW+Ef49/eq94r3P/cA9+P22PaB9i/2Kfbr9Uv1BvWi9W31ifSG9C71FfVe9Aj0hvQ09dT0HvSN9Hn1B/Uw9ID0WfVF9aD0mPRh9c31R/UL9dX1Ofan9ab1p/b09tX28PYu96f3pvfl9zn4yPjg+OX4S/nA+fz5BfqW+jn7qvsV/PH8d/5xADUB0wHPAwEF3AXBBxUKzwsuDM4Mig0FD38PNA89EJsQIhBdD/sPlhBREIoPIA98D8IPvA8KENMQAxEnEK0PkBAPEboQSRAOEH0PdQ6IDeIMLAzHCs0ImAe1BocFcQRtAykCvwDs/2z/Sf9S/yT/zP5x/mr+xv4r/2T/aP9f/1T/Lv82/1n/GP9w/t39o/15/XX9j/1m/QH9y/zp/Cr9y/2L/gX/Wv+P/zoALQG6AR4CxAI2AyEDUAP6AzwE6gN5AzYDAAO6AoMCZwJHAq4B+QDDAOYA3gDXAMUAmgCTAKIAzQD6AAsBsgB9AJsAdQBmAHUACgBa/8v+rv53/iP+/v31/ZH99fwi/br9yv28/Sv+yP4i/4//tQBgAYwBCAKQAg4DOQOXAxwEDgSsA3ADhQNIA9UCsQKQAjkCugGVAZEBSwEFAQwBKwH4ANoADAEtAesAngB1ACAAv/9y//r+ZP6t/fL8NfyI+7v64vl4+fv4JPiQ91D3//av9kb27vUS9lL2L/bx9RL2efZd9t71l/UP9k/2s/Xx9BL1gPXL9A70AvQ59OjzmfOO8+bzVvQC9MbzePQH9Rn1SvUy9vT2svaF9j/39ffV96b32/ch+BT4MvgI+Fr4iviz+M/4g/hX+ZT5j/lg+sr61voz+3n86f2k/rL/hwBXAg4DBANtBfwHOAntCNsJnQtHDKIMWA3FDgsPHw4tDlEPDBBID5sOIw9iD6sOmQ6lD0AQcw/RDgwPdw+2D3sPlw8qD3kOAQ6sDSYNUwx9CzYK+ggDCDgHRgYeBb4DfwKGAeEAgQAqAKH/7/5r/k/+ef6S/rT+yv6h/or+t/7q/gr//f66/lf+MP4r/jX+If7E/Vz9I/0L/RH9af2v/ZD9mv3u/Uf+p/41/+P/PQB2ANMAfgEXAjcCVgKrAssCpwLLAjkDJwOZAi0CNQIXArcBrgGwAVsB3QDKAPAA9ADqANgA4wD4ABIBYgFxAVwBTwEbAe8A+AAsAdwAaAA2AN3/mf9v/1j/N/8D//X+9/4w/1T/hP/m/zMAnwAfAZIBCQKZAsQCyQJuA8kDqgOZA80DtQMQA/cC/wLJAjEC0wHMAUoBEAHTAIcAPwAyAEYAuf/I/9X/Uv8A/+3+Gv+1/vH9mv18/Z38vvve+277Mvqq+Un5lvjb9573ffeg9tD1zvVj9s31+vRj9RP2jvV09An1Cva19bf0+fSD9Sz1ovSW9DX1wfTj81v0LfVj9Mbz3PQP9XX0qvRF9Rn2Hfbd9YH2VveD9zP3B/hP+BX4eviv+DT5OPkY+Vn52Pm5+bv5Ofqe+iP7/fol+0v8g/0R/kv/GgCAANUBzgJGBFAGQAcJB2MIFgpYCuoKOgxTDewM1Ax+DYgOBg+UDo4OiQ7DDuIOLQ9mD2EPVA+6DpYOGQ9RDw8Pbw5HDv0NQA0SDfMMawwfCwsKlgngCD8IdgdYBiQFBARbA+gCjAK2Af8AXACK/3b/",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "nALdAhcD/QImArkALf8r/lr+Df+Z/hH9uftE+7/7tvy4/c79Vf30/IH9qv7l/7MAjQDy/5P/BQDdAD0B5gAYACL/7P5R/9r/NwAiAKL/UP/A/+cAIQK9Ar4CkALoArcDmQTVBIQEBQR8AzkDZwNUAwsDOAJ0AQkBzgAZATkBBAGKAHAAjgDWAEMBdQFWAXgBJgFxAekBhgKJAkACIgP8ApQDAgSmA2kFGQZLBY4ErwjVCgAFRQPFAcICdQTaA5kEHQOkAk4B7/3W/uAAgAAvAEX/lABRAcoAk/8T/+j+VvxW+yH7nPs0+vX2TPXD9CL0cfLU8tnzSfIu74zuHPA28WPvWO427x7w7e8D79PvvO+S74rtGuy97KPuH+537F7s6ez/61frruxK7iXvw+777vzv/fE08vPxpfIX9KrztfO49Iv2Yvi0+CP7vv6VAl4F+waNCpUM4QyQDg8R3hNAE/URTRK2EUMQwA/pD/cPQA7ADZkP1xBnEIsP5A9jD8UOdQ5XD0AP+Qs8CG4GYQTcAbv/xv7Q/Y77hfp++lr7LvwZ/Rz+mP4sAIICKwSvBGIEMgSUA6IC/wKNBBQF9gMfA/oDSwVXBpcH0QnzC4QMQg2yDj8Q5A8fDt0MCAytCh0J0AdkBk4EZQGO/xn/WP9+/2f/p//V/1b/3P6y/kL+Vf0m/DP7cfqt+Vb44fYG9oj1yPXO9qL4i/rx+0D9fP79/w4CjwNQBCAFyQWjBX0FYwYcB6YGWwb7BpoIDAqfCwsNAQ6LDm8OUA/AD0gPpg52DTcLFwkFCKsGSgRmAoYBKgEYANv/6QD0AEUAnf9cAEMBOQH9AHQAsv9+/m39SP3a/J/8NfwK/H/8E/2u/f/9wP31/Hz8o/wk/KP68vnw9yL1YvK58Cjwku6q7Ovrsuue6x7rHOt76ynriOnx5xnpW+kV6SDokuVE5dvkxOKK42vmdOc2593oN+pR7F3uAu527w7yPvLJ8onyLfUJ+PD1YvaV+10AUQaBDJARlBcNGPMVbxX0GcwbfhrOGKYWSRRQDyEMSg2nDXkMiwtrCpwMqg1yDCIKcQe+A3oA+P5M/l39tvqm9efxP/DR8dX1VfjH+hv9eP6G/60CzQZoCZIJ4Ah/Cc4LxAzyDXcPOQ9gDi0OmxHFFl4Z+hmQGdwXjBXdExUTphLWD/IK3gbvA6kBzf6y/Mj62PgA+NL4fPqk+u74WfY99CPzMPMk9AH1q/RW8yXy6fKE9SL4z/pp/VAAngPjBTIIRQrbCvUJ5AimCe4KJgs/CtMIhgewBiQGDwftCJgJrgjvB1sH6AY5BqMEtgNKAoQAEgA9AKH/5P6M/rj9zv26/6MBeAS8BNIElQUPBfkEBgVeBuwGEwceBy8HFQgyCEcHKQjLCJkJsAliCS8JzAceBsED/AEGAez/Ff/w/TP8O/uW+YL4Tfdb9lf2TfU285vxAvCf7s/sNuuV6a/oTOi95sDloeYL5wvmguSy4svkPOZN5dHlMehG6eLnHuj26s7syu3A7fTv0vGp8bTwi/K69d/zdvNs9rz4Tfn/+Bz50vum/WP+5AHwChATWhVDExoU8hHHD1AOrwwGEHMQKw73COAH7whkCRQJEQjYCNcLkglHBysH4ASCAa37Qfmo/CcAEgBDACcA/f+H/vL/lwVWC84LHgsLDJcL6wqJCnQMEw0VDPgLlg7IEqsUGxTGEh4SJhFjEFgRPBI2ELgLxAZHA6ACPwL3AaAB6ADS/4L/gP+G/sb8L/oE+NL2XPeU+CL5kfgQ95L1UvbF+Sv9qP8uAZkB4wFwAYYBLgLQAtoCAgLLAukE0gZYBqkFKQX0BOwFlwZ6B2IH8QTIAD7+Xf0//a39Pv6u/vP9LP4U/wwAJwF+AXQBowJwBKMExwVABWsDLAMAAxUE3wbOCWEKegqjCiUKiQuHC5oK8QreCZAIsAYoBicFKANTApkBtQF0AgUDCAPtAXz/iv0i/Ir7XPp6+Fv45/bF9Gj0KvQ99I3z3vKG8TDxH/Dj7bLrNOq76Frm0+Wl5c/lieYp5r7l3+cc6UDocOnl6gDpeOch5gbpy+p464PsEO/w8kPyf/IF9g74NfcL9172Pvgy+dn2Z/W7+Vv+wQBvBoAQZBc2GyEWnhBID64MGwxgCVEMqg1xC9YJ2winC2UQhA7dDfUPHQ8rDVgJ7wQVAoD9/fjE+hoAswXcB5oI/giACWsIUApRDS8OLwxOCDkHGwf5B1oIKgoiDZoOCRHUE+YWSRcWExwOngoJCVwI/gfWB2MHGwXUAjAD+gT+BX8FTgPiAJD/TP2b+tH4P/ZY9IHz3PR6+L/7ff2T/S39fvwL/Pv70vz8/E38x/sH/Hn9MP+XAAYC+gNfBV4GrweqB7gF7gKu/xj+r/3C/Q/+t/53/3D/fgDlASECtwLgApsBOwHnABcAYAA0ARgB4AH1A24GvgiYCYkJ7glLCpkJrwgQCIUIdwhEB+YHsghFCXEJOwiTCPAItgczBswEZQPsAer/Dv8N/zT/Nv+J/t/9pv1Z/AX7y/kB+K72sPW69Mnz/vI48env",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "OgbUBQsFpgSgAxwDdgOEA/ADpQOPA5QDzgImAtEBjgFNAc4A3AAyASECEgKMAUQBegBl/1n+2f0R/Qj9WfwJ++P5avlF+LD2e/UJ9D7zTfKV8WzxmPAF8Bfvi+0p7WTsmes36/jqCekk6GDod+Yj58nn4uf86Ozph+ne6HHqP+nf6Inq6+pU7Q3vC/CM8Tvy7/N79CL22/rS/1sC7QQFBiQFyQUUBuoG5AqLD1cQRBLHEmkR6BH1EOkOmg6mD9kPgxHTFGkVLhVxE5kPCQ1gCx8LNgsNDAwNaQ2TDfkNuw2SCygJFAdeBT8G6Ai2C+8Nlw7sDEUKCAndB3cHqAf3B/UIkQocDLoMDg0RDCwJ1wa+BVwGawjMCTYKxwkdCfAHTAYMBZQDwgFVAIv/BwByAUMCZQE5/7v8efq/+Cf4+vf192b4SfhS+Bz4xvfc9pv1dfSC84r0wPX79kz4w/gx+VD57Pjw+KH5vfof/HL9Nf8jAbMClgMYBEYEWgScBPUECQaSB9IIXgmYCRUJhQj3B5cHgQdqB5YHywf8BwwI7AfwBtkF8gTCA0IDtAP1AzYE7wNIA48C4AEBAfn/p/8F/8P+yf7y/iT/1P60/Tv84fqt+fT4Qvga+KT3Dfcm9jj1hfSC87Pyj/Eo8JfvX+/07ufumO6k7bTs7evA6sHpIupU6qvpOer56d7pcerU6Q/pnul46ojpReu37KXs5e4s72DvP/Ge80z1Jfjw+438wv6+/1//dAG5AsYEGwdDCa4KTQu2DKUMqQzgDLsMtg3GDlEQ4REBE4ATjxKqEGkPwQ4nDkkOdg7RDtcPOxDvD4EPmg7wDEgLXgpRCgIMkA1lDnsOpw2RDK0KNQmdCFgImwgrCe4Jqwp/C3QL/wlhCOUGKQZJBkgHhAiKCQIKXglQCAEHvQW9BMEDGQMbA6UDcwS4BBcE5AImARv/jf2e/G380fwL/ef8cvy7+8D6efkI+Nz2UfZd9uj2nvc0+KP4Yvik9//2ffbe9sL3l/i8+fX6Ivz7/I/9qf27/TP+h/5W/5oALgKdA1QEiASIBLQEpATMBA8FeQVKBu0GYwfzBxQIxAcuB3UGLAZZBpYGwgYPBwgHswZZBrkF5wQ3BHMDwwJ2Am4CeQJYArcBqwCO/3T+hP2n/Pn7cfvX+iT6dPnA+Af4I/fq9dz0F/Rl88nyVPKp8enwNfBM75vuN+637Qztbezq623rNesb6+/qtOqS6ojqduqq6tTq7uo/62frVOuW65jsWu1w7gfwfPGn86/15fYH+Fr5C/qG+lr7p/yZ/qcAHAJwAyUFdwblBgEHrwfUCM4JBAutDH8OSBDvEIwQIhAnENMPiw/wD+MQQhJjE94TJBQ/FJMTSxIxEdYQFRHSEZsSEhMYE48SOxGGDxEOGA1fDFoMvgwDDWYNYA2MDC8LpglVCJAHcAfKB0wI3AjhCA0IzQZaBfsDzwIHArMB+QGXAuYCqAL2AdYAY//o/bb8H/w4/I38u/y7/HL8wvu3+pP5dvjN98D3EPi9+Iv5Gfop+t/5K/lg+P/3Evik+IX5cPpM+wT8XvxH/BD88fsk/Kv8c/2R/s//9wCtAdYB3AH+ASoCVALSAosDiQSQBSsGdQahBnsGKwbWBbsFFQa+BloHoge8B5gHKAdsBpQF7wSjBJAEbgRABBUEtwPmArQBawBk/5f+6v1G/dD8cPzM+8z6l/lu+G33d/aE9d30VPTN8yXzM/IW8RXwLu827oPtFe227HLsI+yV6/Dqjuo56tnppOmh6e3pUepY6jnqReqF6oXqf+rj6vXrde3/7qXwg/KF9Nn1efYm9/339/g2+nX7Mf1s/0YBggKcA6MEdAXsBVQGXgceCRcLuQxADmsPEhAkEMEPdA+4D08Q8hDRER8TbBRGFWcV1BQfFG8T4BJ/EsoSmBMzFDcUqhPJEtgRohApD/8NjQ2sDd4NEQ4YDtYN6QxYC5sJcQgDCNYH0gcMCDsIDghjBzIG6wS1A5sCtwGPAQgCmgLWAqICxgGFACH/sv2x/D38Q/xu/LX82Pyk/A78Gfvw+fv4aPhJ+Jv4Sfn5+Wb6Xfre+UH5j/j+98/3PfgS+Rn6+PqP+wD8Nvwk/BT8P/zi/M79x/7M/9EAvQEbAhoCEgJFArICLQPUA8MEwwV1Bs8G9wYMB/cG0QbHBv0GbQfqByMIPggoCMEHHAeFBhcGxQWHBVEFIwXgBGIEjwOZApkBmACV/6r++P1p/cf89fv9+gj6G/kd+C/3WPag9Q31ZPSO87fy8PH78PDvAe8s7qPtQe257ELs3utm69zqbOoV6s/ptemQ6Xfpj+m26bzp5ekL6uLpHeqF6vTqheuQ7A3up+928fzyUvTz9Qj3bvcd+HX5Bvun/D/+0v/UAbUDwQRRBWcGcgdPCBcJVgo0DC4Oew/4D3gQEBEpEQMRWREgEikTERTwFMkVthb/FlsWeBX7FHUUIhQ7FJcU+RTuFEgUIBMdEv8Q0Q/ZDnQOUQ5SDlUODQ5YDTAMngoNCdQHIAfYBuMGCgfpBmsGigV0BDsDIQJAAbkA",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 20,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 137,
            "textTokens": 55
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 192,
      "totalTokens": 3365
    }
  }
}
 📨 Processing event type: usageEvent
 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 🤖 Agent said: Sure thing! I'll check Jira for any tickets related to LinkedIn. Give me a moment to pull that information.
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🤖 Agent finished responding
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
await in initializeBidirectionalStream
connect @ webpack-internal:///…vaSonicClient.ts:88
connectNovaSonic @ webpack-internal:///…dVoiceClient.ts:204
connect @ webpack-internal:///…edVoiceClient.ts:81
startSession @ webpack-internal:///…rc/app/page.tsx:742
await in startSession
processDispatchQueue @ webpack-internal:///…evelopment.js:16146
eval @ webpack-internal:///…evelopment.js:16749
batchedUpdates$1 @ webpack-internal:///…development.js:3130
dispatchEventForPluginEventSystem @ webpack-internal:///…evelopment.js:16305
dispatchEvent @ webpack-internal:///…evelopment.js:20400
dispatchDiscreteEvent @ webpack-internal:///…evelopment.js:20368
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
await in initializeBidirectionalStream
connect @ novaSonicClient.ts:155
connectNovaSonic @ unifiedVoiceClient.ts:320
connect @ unifiedVoiceClient.ts:166
startSession @ page.tsx:764
await in startSession
processDispatchQueue @ react-dom-client.development.js:16146
eval @ react-dom-client.development.js:16749
batchedUpdates$1 @ react-dom-client.development.js:3130
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16305
dispatchEvent @ react-dom-client.development.js:20400
dispatchDiscreteEvent @ react-dom-client.development.js:20368
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "usageEvent": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "details": {
        "delta": {
          "input": {
            "speechTokens": 0,
            "textTokens": 0
          },
          "output": {
            "speechTokens": 20,
            "textTokens": 0
          }
        },
        "total": {
          "input": {
            "speechTokens": 286,
            "textTokens": 2887
          },
          "output": {
            "speechTokens": 157,
            "textTokens": 55
          }
        }
      },
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "totalInputTokens": 3173,
      "totalOutputTokens": 212,
      "totalTokens": 3385
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: usageEvent
novaSonicClient.ts:593 📊 Nova Sonic usage event: {completionId: '71cbb3b2-5eea-4083-81a6-d61635509147', details: {…}, promptName: 'prompt-1752618686975-qc0syhfex8d', sessionId: 'ffee2b77-5803-4551-a27c-4256d46cb986', totalInputTokens: 3173, …}
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 17280 bytes
 🔊 Playing Nova Sonic audio through audio element
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "f96ac530-982b-4507-8580-3a3df6a9c5a8",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "PARTIAL_TURN",
      "type": "AUDIO"
    }
  }
}
 📨 Processing event type: contentEnd
 🔇 Nova Sonic content end
 🔇 Nova Sonic: Voice activity ended
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "additionalModelFields": "{\"generationStage\":\"SPECULATIVE\"}",
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "f6cc3d5c-2c6b-4374-8495-a7670f32d9ae",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "textOutputConfiguration": {
        "mediaType": "text/plain"
      },
      "type": "TEXT"
    }
  }
}
 📨 Processing event type: contentStart
 🎤 Nova Sonic content start
 🎤 Nova Sonic: Voice activity started
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "textOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": " Just a moment while I look that up for you.",
      "contentId": "f6cc3d5c-2c6b-4374-8495-a7670f32d9ae",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: textOutput
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "f6cc3d5c-2c6b-4374-8495-a7670f32d9ae",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "PARTIAL_TURN",
      "type": "TEXT"
    }
  }
}
 📨 Processing event type: contentEnd
 🔇 Nova Sonic content end
 🔇 Nova Sonic: Voice activity ended
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "audioOutputConfiguration": {
        "channelCount": 1,
        "encoding": "base64",
        "mediaType": "audio/lpcm",
        "sampleRateHertz": 24000,
        "sampleSizeBits": 16
      },
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "type": "AUDIO"
    }
  }
}
 📨 Processing event type: contentStart
 🎤 Nova Sonic content start
 🎤 Nova Sonic: Voice activity started
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAA//8AAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAABAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAP//AAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAQAAAAAAAAABAAAA//8AAAEAAQAAAAAAAAAAAAAA//8AAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAEAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7/AAAAAAAA//8AAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAD//wAAAQABAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIA//8AAAAAAAAAAAAA//8AAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAA//8AAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAP//AAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAEAAAAAAAAAAQAAAAAAAAAAAP//AAAAAP//AAAAAAAAAAAAAP//AAAAAAAAAAAAAP//AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAD/////AAAAAP//AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAD//wAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAP//AAABAAEAAAAAAAAAAAAAAAEAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAP//AAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAD//wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAP//AAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAA//8AAAAA//8AAAAAAAAAAP//AQAAAAAAAQAAAAAAAQAAAAAAAAAAAAEAAAD//wAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAQD//wAAAAAAAAAAAAABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8BAAAAAAAAAAAAAAAAAAAAAAABAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAP//AAABAAAAAAAAAAAA//8AAAEAAAAAAAAAAAD+/wAAAAAAAAAA//8AAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAD//wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAQAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 3840 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🔊 Audio: play started, volume: 1 muted: false
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "AAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAD//wAAAAAAAP//AAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAD//wAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAIAAAABAAAAAAABAAEAAQAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQAAAAAAAAAAAAAAAAABAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAEAAAAAAAEAAQAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAQAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAD///7/AAAAAAAAAAAAAAAAAAD//wAAAAD//wAA//8AAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAAABAAAAAAABAAAAAAAAAAEAAQAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAA//8AAAAAAAABAAAAAAABAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wEAAAAAAAAAAAD//wAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAABAP////8AAAAA//8AAP///////wAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAA/////wAAAAAAAAAAAAAAAP//AAAAAAAAAAD//wAAAAD//wAAAAD//wAA/////wAAAAAAAAAAAAD///////8AAAAAAAD/////AAAAAAAAAAAAAAEA/////wAAAAAAAP//AAAAAAAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAEAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAEAAQAAAAEAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAEAAAAAAAEAAQAAAAAAAQABAAEA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "AAAAAAAAAAAAAAEAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAAAAQABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAQAAAAAAAAAAAAAAAAABAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAD//wAA//8AAAAAAAAAAAAAAAAAAP//AAAAAAAA//8AAAAA////////AAAAAAAAAAAAAP///////wAAAAD///////////////////7/////////AAAAAP///v///////v////////////7////+/wAA////////AAD+/////v8AAP///v////7//////////v8AAAAAAAD+/wAA/////////v8AAAAAAAD//wAAAAD+/wAAAAAAAP////8AAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAEAAQABAAEAAAAAAAEAAAABAAEAAgAAAAEAAQAAAAEAAgADAAEAAQABAAIAAQABAAEAAQACAAEAAwACAAIAAgABAAEAAQACAAIAAQADAAIAAwABAAMAAQACAAEAAgACAAIAAgADAAIAAgACAAIAAwACAAIAAgABAAIAAgABAAIAAgACAAEAAQABAAIAAQABAAIAAgAAAAEAAgACAAEAAQABAAIAAQABAAEAAQACAAAAAAAAAAEAAAABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAD///////8AAAAAAAAAAP////8AAP///////////////////v/+//7///8AAP///f/+///////+//7//v/+//7//v////7//v/8//7//f/+//7//v/9//3//v/9//3//v/+//3//v/+//7//v/+//3//f/+//3//f/+//z//v/9//7//f/9//3//f/8//z//v/+//3//f/9//3//f/9//3//f/9//3//v/9//3//v/9//7//f/9/////v/+//7//v/+//7//f/+/////v/+////AAD9////AAD///7/AAD//wAAAAAAAAAAAAAAAAAAAQABAAAAAAAAAAAAAAACAAEAAAADAAAAAgAAAAEAAgABAAAAAQACAAEAAgACAAMAAgABAAMAAwACAAMAAwACAAMAAwACAAMABAAEAAMAAgAEAAMABAADAAQAAwADAAQAAwAEAAQABAADAAQAAwAEAAQABAAEAAQABAAEAAUABAAEAAQABAAEAAQAAwAFAAQAAwAEAAQABAAEAAMAAwADAAMAAwAFAAQAAgACAAQAAwADAAIABAACAAQAAwAAAAIAAwADAAIAAQACAAIAAgACAAEAAQABAAIAAAABAAAAAQAAAAAAAQAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAD//////v///wAA//////7//v/+//7//v/9//7//v/+//3//v/9//3//P/9//3//v/8//z//P/9//3//P/9//z//f/9//7//f/8//7//f/8//3//f/9//3//f/8//3//v/9//z//P/9//z//P/8//z//f/8//3//P/9//z//P/9//v//f/7//z//P/8//v//P/7//z/+//9//z/+//8//v//f/8//3//P/7//z//f/7//v//f/8//z//f/+//3//v/9//7//v/9//7//v/+//3//v/9//7///////7/AAD/////AAD///////8AAAAAAAAAAAAAAAABAAAAAAAAAAEAAQABAAEAAgACAAEAAgADAAMAAQACAAMAAwAEAAMAAwACAAMABQAEAAQABAADAAQABAAEAAQABAAEAAQAAwAEAAUABAAEAAUABAAFAAUABAAEAAUABQADAAUABAAFAAUAAwAEAAUABQAFAAUABAACAAQABQAGAAQABAAEAAUABQAFAAQABAAHAAQABQAEAAUABAAFAAQABQAEAAQABAAFAAYABAAEAAQAAwAFAAQAAwAEAAQABAADAAMAAwADAAMABAAEAAIAAwACAAMAAgAFAAIAAgACAAIAAgADAAEAAQABAAEAAQABAAAAAgAAAAAAAQABAAAAAQAAAAAAAAAAAAAA////////AAD///7///////7//v/9//7//v/+//3//v/+//7//v/9//7//f/8//z//f/9//z/+//8//3/+//8//v/+//7//z/+v/7//z/+v/8//v/+//6//v/+//5//v//P/8//v/+//7//v/+//7//v/+//7//v//P/8//v/+//7//z/+v/8//r/+//8//v/+//8//v/+//8//z/+//7//z//P/8//v//P/8//3//P/8//z/+//9//7//f/9//z//f/9//7//f/9//z//v/+/////f////7//v/+//7////+//7////+/////////wAA/////wAA//8AAAAAAAAAAAAA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: play started, volume: 1 muted: false
 🔊 Audio: loadstart
 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ webpack-internal:///…console-error.js:51
Home.useMemo[sdkAudioElement] @ webpack-internal:///…rc/app/page.tsx:178
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 🔊 Audio: pause
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "AAAAAAAAAAAAAAAAAAABAAIAAgAAAAEAAgABAAIAAgADAAIAAwADAAIAAgACAAIAAwACAAMAAwAEAAQABAAEAAUAAgAFAAQABAAEAAQABAAFAAQABQAEAAQABAAFAAMABAAEAAQABAAEAAUABAAEAAMABAAEAAQABQAEAAIABQAEAAQABAAFAAQABAAEAAQABAAFAAQAAwAEAAUABAAEAAMAAwAEAAMABAAEAAQAAwAEAAQABAADAAQAAwADAAMABAACAAMAAwADAAIAAQACAAIAAgACAAIAAQABAAAAAgACAAEAAQABAAEAAQACAAAAAAABAAAAAQAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAD/////AAD///////////7//////////v/+//3//v/+//7//v/+//7//f////3//v/9//z//v/+//3//f/9//3//f////7//f/9//3//v/9//7//f/+//3//v/9//3//f/8//3//f/+//3//f/9//3//f/9//3//f/9//z//f/8//3//f/+//z//f/8//3//f/8//z//P/9//3//f/9//z/+//+//3//f/9//3//f/9//3//f/9//3//f////3//f/8//3//f/9//3//f/8//7//v/9//7//f/+//7//f/+//7//v/+///////9//7///////////8AAP//AAD//wAAAAAAAAAAAAAAAAAAAAAAAAAA//8BAAAAAQABAAAAAQACAAEAAQACAAEAAgACAAIAAgAEAAMAAQABAAMABAABAAIAAgADAAMABAACAAIABAADAAQAAgAEAAQAAwADAAQAAwADAAQAAwAEAAQAAwAEAAMABAAEAAQAAwAEAAMAAwAEAAMABAADAAQAAwADAAQABAACAAQABAAEAAMAAgADAAUAAwAEAAMAAwACAAIABAADAAMAAgADAAIAAwADAAIAAQAEAAQAAgABAAMAAwABAAIAAQACAAIAAQACAAEAAgABAAIAAQABAAEAAQAAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAP//AAD+/wAA//8AAAAA//////7//v/+///////+//7//v/9//7//v////7///////3//v/+//3//v////7//f/9//3//v/9//7//v/9//3//f/9//7//f/9//3//f/9//3//f/9//z//f/9//z//f/9//3//f/9//z//P/8//3//P/9//7/+//7//z//f/7//z//P/8//z//P/6//v//P/8//z/+//9//3//P/8//3//f/8//z//P/8//z//f/8//z//f/9//3//f/8//3//f/9//3//f/+/////v/+//7//v/8//////////7//v8AAAAAAAAAAAAAAAD//wAAAAABAAAAAQAAAAEAAAABAAEAAQACAAIAAgABAAIAAQACAAIAAQADAAMAAgACAAIAAwADAAQAAwADAAMAAwADAAMABAAEAAQAAwADAAQABAADAAQABAAFAAQABAADAAQABQAEAAQABAAEAAUABQAFAAMABAAFAAUABAAEAAUABQAEAAUABgAEAAUABQAFAAYABgAFAAUABQAFAAUABgAFAAUABAAFAAUABgAFAAYABQAFAAQABQAGAAUABAAHAAUABQAFAAUABQAGAAQABQAEAAUABAAGAAQABAADAAQABAADAAMAAwADAAMAAwABAAIAAgADAAIAAQACAAIAAgABAAEAAAAAAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////AAD//wAA///+/////v////7//v/+//3//f/+//3//f////3//f/8//3//f/9//v//P/7//z//P/8//z/+//7//v/+//7//v/+//6//v/+//6//v/+v/7//r/+//7//r/+v/6//r/+v/5//r/+v/5//n/+f/5//n/+f/5//n/+f/3//j/+P/4//j/+P/4//f/+f/3//j/+P/4//n/9//4//j/+P/4//j/+P/4//j/+P/4//j/+f/4//j/+P/4//n/+P/5//j/+f/4//n/+v/7//r/+//7//z//P/8//z//f/8//3//f/+//3//f/+/////v/+////AAD+/wAAAAAAAAAAAAAAAAIAAAABAAMAAgABAAIAAwADAAMAAgAEAAQABAAFAAQABQAFAAUABQAGAAYABgAHAAYABgAHAAcACAAIAAgACAAIAAgACAAIAAgACQAJAAkACQAKAAkACgAKAAoACgAKAAkACgAKAAoACgAMAAoACwALAAsACwALAAwACwANAA0ADAANAA0ADAAMAA0ADAAMAAwADQANAA0ADAALAAwADAANAAsADAAMAAsADAALAAsACgALAAoACwAJAAkACAAJAAgABwAIAAcABwAIAAcABgAGAAYABgAFAAQABQAEAAMAAgAFAAMAAQABAAAAAQABAAAAAAAAAAAAAAD+///////9//3//f/8//3//v/7//z/+v/5//v/+v/6//n/+f/5//n/+f/4//f/",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "9//2//f/9v/2//b/9v/1//X/9f/1//T/9P/z//T/8//z//P/8v/0//P/8v/y//P/8v/x//H/8f/w//H/8f/w/+//8f/v/+//8P/w/+//8P/u/+3/7//v/+//7//u/+//7//v//D/7//v//H/8P/w//D/8f/x//L/8v/x//L/8v/z//P/9P/z//P/9f/1//X/9v/1//j/9//3//n/+P/4//n/+v/6//v/+//7//z//f/9//3//v/////////+/wAAAAAAAAAAAQACAAIAAQADAAQABAAEAAUABgAEAAUACAAIAAgACQAJAAoACwALAAsADAANAA0ADgAOAA8ADgAPABEAEQASABIAFAATABUAFQAWABYAFgAXABcAGAAYABkAGgAZABkAGwAcABoAGwAcABsAHAAcABwAHAAfABwAHAAcABsAHAAbABoAGwAaABkAGQAcABoAGQAYABcAFgAVABUAFAATABMAEwASABEAEAAQAA8ADQAOAAwADAAKAAoACAAIAAgABQAGAAUABQAEAAMABAACAAIAAgAAAAEAAAD//wAA//////7////+//7//P/3//b/9v/5//r/+f/4//n/9//1//X/+P/1//H/8//z//H/8P/u/+v/8//y//D/7P/r/+7/7f/s/+r/6f/h/+P/5//o/+3/7f/g/93/4v/m/+n/5//k/+P/4//h/+b/5P/h/+D/4f/e/+D/4//f/+H/4v/g/9//4v/i/9//4f/i/97/4P/i/+T/5f/i/+L/4f/k/+b/6P/l/+L/5v/l/+b/6P/o/+j/6f/q/+r/7f/s/+3/7v/v//D/7v/w//H/8f/z//X/9f/1//j/+f/4//n/+//8//z//f/9////AAAAAAAAAAACAAYABQAGAAcABwAFAAkACwAMAAwADAAOAA4ADgAQABAAEQATABIAFAATABQAFgAWABcAGAAYABcAGAAcABsAGgAZABgAGQAcAB0AHAAbAB0AHQAdABwAHgAeAB8AHwAeAB8AIAAgAB8AHwAhACEAIAAgACAAHwAhACEAIQAhACEAHwAiAB4AIAAgACAAHwAfAB8AHgAfAB8AHwAhAB8AHQAdAB0AGwAbABsAGgAZABkAGAAWABUAFwAWABUAEwATABEAEQAQAA4ADQANAAwADAALAAkACQAIAAcABQAGAAQAAgACAAIAAAAAAAAA///+//3/+//8//v/+f/7//f/9//3//j/9f/2//T/8P/z//P/8//z//H/7//w/+//7v/v/+7/7f/t/+7/7P/r/+7/7f/t/+3/7f/t/+3/7P/r/+z/7P/t/+3/6//s/+3/6//r/+z/6v/r/+z/7P/s/+v/6//q/+n/6//o/+n/6v/p/+j/6f/o/+r/6P/o/+f/5//o/+n/5v/n/+f/6P/l/+b/5//o/+b/5//n/+f/5//p/+f/5//p/+n/6P/o/+r/6v/p/+r/6v/t/+v/7P/v/+7/7f/u/+//8f/v/+//8f/y//D/8v/0//T/8//z//f/9//1//b/+P/6//f/+P/5//r/+v/6//z//P/9//3/////////AAABAAEAAQACAAIAAwADAAUABQAGAAYABwAIAAgACQAJAAkACQALAAsACgAKAAsACwAMAAwADAAMAA0ADgAOAAwADQAOAA0ADgAPAA8ADAAOAA4ADgAOAA8ADwAPAA4ADwANABAAEAAQAA8ADwAPAA8ADwAPAA8ADwAOAA8AEAARAA8ADwAPABAAEAAQAA8AEAAQABAADwAPAA8ADgAPAA8ADgAQABAADgAPABAADwAOAA8AEAAPAA4ADgAPAA4ADgAOAA4ADQAOAA4ADgAOAA0ADQAOAA0ADQANAAwADAAMAAsADAALAAoACwAKAAoACQAKAAoACQAJAAgACAAHAAgABwAGAAYABgAFAAUABQAEAAQAAwADAAMAAgADAAEAAgABAAAAAAAAAAAAAAD///////8AAP///P8AAP///f/8//7//v/8//v//v/7//z/+//9//v/+//6//v//P/7//v/+//7//v/+//6//v/+v/6//n/+v/6//v/+v/4//r/+v/3//r/+v/7//r/+f/5//v/+v/5//r/+//6//v/+v/6//n/+P/7//v/+f/4//r/+//4//r/+v/6//n/+//5//r/+//6//r/+//6//v/+//7//v/+v/7//v/+v/7//r/+v/6//r/+//7//r/+v/6//r/+v/7//r/+//6//v/+f/6//n/+v/6//r/+v/6//v/+//7//v//P/7//v//P/7//v//P/8//v//P/8//z/+//8//z//v/7//3//P/9//3//f/8//7//f/9//3//f/9//3//v/9//3//v/8//3///8AAP7//f///wAA/v///wAA/////wAAAAD//wAA//8AAAAAAAAAAAAAAQAAAAEAAAABAAAAAQAAAAEAAQAAAAIAAQABAAAAAQACAAIAAQABAAEAAgACAAIAAgADAAAAAwABAAIAAwACAAEAAgABAAIAAgAEAAMAAgABAAIAAgACAAEAAgABAAIA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "AgABAAEAAgABAAMAAQACAAEAAQAAAAEAAQABAAEAAAAAAAAAAQAAAAAAAQAAAAAAAQAAAAAAAAAAAP//AAAAAAAAAAAAAAAA/v/+////AAD//wAA/v///////v8AAP7//v/+//3///////3//f////7//v/9//7//v/+/////f/9//3//P/9//3//P/8//3//f/9//v//f/8//3//v/9//v//v/7//z//v/8//3//f/8//3/+//9//7//P/8//3//f/9//3//f/9//3////+//z/AAD8//7//////wAA///+/////v///wAAAAABAP7///8AAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQABAAIAAAAAAAIAAQADAAIAAAACAAEAAQAGAAMAAwACAAIAAwACAAMABAADAAMABAAEAAQABQAFAAUABAAFAAQABQAGAAYABQAFAAcABgAIAAYABwAGAAcACAAIAAcACAAFAAYABwAIAAgABgAIAAgACAAJAAoACQAJAAoACgALAAsACgALAAwACwALAA4ADgALAA0ADAAPAA8ADwAPAA8AEAAPABIAEwAPABEAEwAUABMAEgAUABQAFAAWABQAFAAWABYAFgAXABgAGQAZABgAFgAWABkAGgAWABcAGAAYABgAGQAWABYAGQAYABcAGAAWABcAFAAXABgAGAAVABIAEQASABMAFQAVABAADwAPABEAEgATABAACQALAAkADAANAA8ADAAJAAcABAAGAAgADAAJAAgACAAFAAcADQAOAAwADwAKAAcADQAMABAAEgALAAgABAACAAkABwAIAAgACQAMAAoACAACAP3/+P/8//b/9v/4//3//v/8/+r/2P/S/9X/4/////v/5f/L/6z/q//H/+X/8v/l/8r/0//C/8H/rP+h/3P/cf+C/5X/nf+k/3T/yv8QAXUB4gBT/0b8rfU48nX5nghEE2UPVwCp8hPuF/W4AxoPLBE0By73ku8W9VIBtwn0BfL98vtz/tsA6AJWA3X+n/q6/Bv/Nv/5/5MB2ACtAU8B8P3q+//7avsi+dn6hv8bCfoQkA20/ezyVfNN95r/Mgy0DdAAZve09/z8mgJbCKcFCP0J+2n9n/1KAfYH4wgBA0n8zPPl8hX8fAfeC68N6g7NAxL3u+688pX+9wVzCSQGQfnr/KIJogZL/UX5sfhT+yEFrwnoAuf30fZuBmIRVgR+9ln2of4o+3L7nhNMGcb/lecG8wgQYwjN7kX/1RsyCn3yMflt+QP2BgUVFQAPPPSn7Ib0VP9pEncYmQuO+CjlvtrW9f4hSjCNDuHm6ebz7in2tA/JIjgRwOwG3XDx0QbWDxMbSRYY9tfeHeyTACAbWSMhDAnt1do97eIJbRkTGP8JE/KO5u7t5AVSGUcPgP7G8aTprO8dBb0WIxWkBIL0beqU78cA3Q86E84E3fUl9BP2DAGGDBkKyAWU/8Py4Oz59tMKuhTMC4sAwO9u7Zz+Cg7aDAkA5PrX9fT0DADDDQwII/53+8T5QfeB++sHxQo4CnD+x/De8G78GwqbDR8EPfiU8z33XARdCyoIqPzR9JTyqfZUB30ReAm59+rwOPl9A3UF5gO8BA//Uvac97j+UAVUCZ0FUvnR8S723QNdDJ4JqAA7+N/0Q/pAAhoFZQc1AUj7y/Tk+w8LFA0PBdf5IfeC917/TQdzB6gAEfsK/1QBZwCkBEMEsv8O/yr+S/3R/cwCigYHA0P7Sfnf/OICygYABAUBEgADAOj+Ef/F/lT/Jf4a/jIAygBpA7MB8P6yAEUAQP0M/lb/x/48AA4CEwHa/5z96P6oAP7/BQAQ/fj8HABcA4r/E/xQ/6QCSAJI/3/6AfqX//oBTgMWAnT+W/qx/K8ELAfEAbf7pf3E/uX9DAGqAVkCJwHI/OP90wE8ArABjwKtAQ0ABP8O/hX9PwAIBEkCEQDOAFcBiQEYA8oDDAKQ/1T/X/+V/3UCSQH8Ab8EoQHDANUDlANW/94A1ANiAt8AVwFfAUkC1QNcA0oC8QPcBD0BjgGzAlMDYwKNARwBxACzAcEBtQLvAcACcwOvAfL95vx3/4D/zP6C/5gBxP/X/WT+9fyU/OX9lv+I/Bf5UvlU+ub7jPz1+9z5d/kD+o364vr5+iH3J/ff+UX37/dC+WH5ofh4+XD6TPrk+Xf7O/ta+cz69vrx+s77Kf4n/vD+Af4+/dj/twCvAHH/EABWAXEBZAGjA1AGYgZ8BdsGPwanBO8D8QWaCq4JDgh1CFkLqQxLCecIng0/D/MLBgqJCrALXwwjDzkP8AsFCloJkwoxDScPQA6kC4cJDAj1CEsKhQpUCdIGjwQiARYAJf/G/Xn8l/p8+ib75fss+8H5qPha9mTyQO9f76/vZ+6i7pfuPu6m78LwZPB176zwI/J/8Xnwje5/7Ojsfu6C7VLvB/S99TH1/vV8+O75I/nL97r4nviD97v2IPhS/Jb/4QAKAZ0BXwJXAmADogSDBPcCmgEpAeQCoAWIBUgGVwcmBmcFVwaZCKAIhQbIBcQFWAUbBMkE4QdxCYUI",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 🎨 Rendering with currentView: dashboard
 🎨 Rendering with currentView: dashboard
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "uPhM+Qj6zfob+6P7Hf2f/hUATQK+BJUGCQj9CUQMMA7qD3cRKBNmFGAVCBajFpUXrxioGCQY5RjeGdgZvRkRGhgaMBl4F/gVMxTcEp8Riw/xDBwLpwn5BiEEZwLvAOz+9fyB+6L6JPr8+WP56PjM+DP5efm++d/6Bfzl/J/9H/6T/o3/fQDTAOgApQELAv0B6gEeAmoCBAK4AUMBWgCp/2j/Wf63/J37lvqB+Ez22fSj893x7e+e7iTt9+tM68fq7uni6WLqAeqn6c7qD+xx7BXtVO5l7+/vEPEZ8tjyvPPh9H/1+PU194/4Zflu+gL8Xf17/u//cgGPAuEDVAWrBsMHBgmgCv0LGg0pDicPMBASEcIRnhJ+E20UQxUUFvwW/RftGJoZDxotGiwa0hnLGFMX+xVgFDQS9w8dDlwMPAoQCC0GbARyAscAT//7/ff8UPyj+wz74vr3+t36mvqG+r/6IPtC+5n7Avxn/If8aPxq/LP8DP1z/Qn+iv7k/jf/pf/J/8D/wf/Q/03/V/5x/Xv8B/tD+Zn30fUg9JPyUPEs8GHvxe4X7lXtHu0r7QXt+uxR7a3tsO0A7qzuUO/M75DwQvHR8W7yQvPb8070FfW89Q/2ofam97T4rfnM+jz8m/3S/gwAXQGuAtsDwwSkBY4GcwddCEoJWAofC7ELggxjDVQOaQ+GEJUR0RIMFAkV2hUwF2kYnxhlGIAYPxgAF4QVZxQtE3QREBCxDjQNAgwVC8AJHwgDB4sGsgXVBMAE3QSSBOgDbgMhA7cCPAL9AbYBRQGsAC0AhP+g/uz9iP3//Fj8FPwt/B78s/ts+xD7j/r3+W75EvnS+F74nvfB9tT10/S888Py1/EQ8Vnwnu/c7nDuK+6w7ULtPe0/7S/tae3J7f/tA+4v7l/uc+6i7hXvce+27xjwePCt8NTwVfHN8UjyBPP38/P0AvY094T4x/kl+6v8G/6i/0EBzQJBBKwF/QZLCIkJ2wrvC+cMEA4kDwQQ6xD9ERUTLBQtFTYWERcOGP0YdhmUGboZqBn/GPIXMBecFq8V0xQVFGITrhLpEQwRMxBaD64O7g1FDcIMGwyNC90K2gnWCP0HBgf7BeIE2QPLApEBXgD//p39f/xh+0f6Y/nA+EX4gPfE9jz2nPXq9FH04/No89TyQ/Kp8dHwCvBS75nu5O1n7Rrtz+yW7IPsfexe7Fjsaexy7Ibsxuzi7NDsxuzI7KLsfeyL7K/s3ewe7YDtBu6S7kTvJPAC8QryOPN39Mb1BPdd+LT52/ry+yP9ff7O/ycBsQInBH0F9AZsCMMJHwu6DEwOaw9+ENURGRMKFO0UGxYtF+0XzRjEGZ0aVhv9G0IcCByjG1EbmxrGGVMZ7Rg3GH8X+xZvFooVrhQIFEUTUhKIEQwRaxCND5YOlQ1fDNwKagkoCOQGkgVTBA4DnAEeAMX+Wv3r+7j6wfnQ+Nv3Evdj9pH1rPTr8zjzj/ID8rjxYPHW8FfwyO8I703uuu1L7ersi+w17NjrjetQ6x/rDesQ6yHrQ+tl64Dri+ua66TrkuuX68/rGuxu7NLsNe2B7cTtMO607lbvM/Ax8SjyKPMs9DP1TPZ799H4Mfqi+zL9zP5oAAICjwMSBYcG7wc6CYIK4wslDTIOLg8pECwRNhI/E1oUgxW+FtgXsRh3GWoaYRvgG/Ib+hvZGyAbKhpgGcAYFBhhF7kWBxY1FXkUvxPeEvgRSxHXEDkQcw/fDkIOJQ3aC4MKAwmQB0wGKwXQA1gCJwHF/wX+afwZ+wL63PjL9/72JPZQ9Y70s/Ph8ifyjfEV8Wvw4u+I7/ruNe5m7b3sOey462frL+vh6q/qi+pM6ivqROqU6uXqKOuM6+DrDewt7DnsbOyk7OTsS+2o7fvtTO587p3ux+4a77Pvc/Bp8Y3ypPOw9J/1gPaP96T46vlP+7z8OP6n//YAOQJ3A8sEIgZaB74IJwp4C7AMug2zDq4PtBCqEasS/xNcFXMWZxdWGC0ZGRoDG8YbWxzdHBcddhxwG6oaBBo2GWIYwBdJF7UWBxYXFRwUZBPFEvgRHxGSEEgQwQ/DDp4NUgzqCkgJnActBvwEzwOOAv0AZv/X/UT8yvpf+Uz4bfeN9qv1zvQB9ETzhfLq8WDx3vCe8GrwDvCj7zPvre4U7oftMu3p7KjsZewf7N7rlutx65Drw+sQ7Ifs5Owu7W7tvu3j7QXuZ+7E7vPuMu+O793v/+8I8ETwjPDy8IXxQfIq8yb0FvUF9uz26vcd+Ur6kvvL/An+Vv9aAGcBnQLpA0kFowbtBzsJZAp5C3cMNg0PDvUO1g/BEKoRxxLuE9IUtRWmFrIXyRjQGe8aDBzbHE8dOx3CHPsb9xoKGv8Y6hdAF6QWrBW4FNcTBBMDEgoRVhCxDzIPlA7BDesMzAtzCgQJOQdzBRgExQIoAZn/Vv4k/Wv7tflj+Er3LfYc9Wn0vPMP85/yHvJ18Rjx+fDV8H/wUPBQ8Cfwte8n77ruXO7j7Vvt7Oxr7BTsuutB6wXrCutA65Pr+etk7PbsjO3K7f/tje4J70bv",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "PvIX9jX4xPqd/c3/+gG1A28ErQSoBfEERQTRBKkEUQWZBZoF1QbKBw8IpAiVCTAJuAgGCCoGDwVUA/sAcP9a/Vr7YPrd+c/4HfnY+rj6R/u//Kr9X/6+/pb/JgAIAJr/IAA3AKj/tgCJATYBsQEFA+0EcgVBBh4Iwgl6CYwI3gkdCswIigiwCMAIqgjICMIJGApZCykMAw0GDv8OgxDTEbcRXBJiEy8SvRBfEI8PEQ6rC1MJfQeVA3sA0PwM+Vf2nfRc8oLwn/FI86fyBfMT9I30kvSG8wX0SfT99JT1//RI9R732fdx+MP5qvwFAA0CqQTPBwEKYAs0C+oJzAgHB0wFywLSAO3/x/7r/Jz7CPuH+tj5Rfnw+HL4OPi998r20/Qz84rx1e7I7DTs7+t/7KvtBu9Z8SXzhfXs93T5nPvV/Q7/of/lADkCLgIEAkoCogI7AoUCPwRDBTIGtAfJCKIILQg8CJgHQgX5A6UCPgBB/vv8R/y3+mX5oPmb+ff4vvlg+2f80fzT/Yb+J/69/fj9HP43/YX9G/8v/9//TQISBDkFwAb6B3wJHwpLCscLuAv2CqAK0gltCCYHBQeGBnYG0wY3B4cIAwn4CbMK2gomC3oKfQoCCmkJTwrnCSYK0Qq6Cr8LrQwgDQkO5Q8XEGsQXhCUDisN9gngBf8A9vy6+U31UvTd8rzyUvQN83D0o/T88270PfOC8mDywPI28jzxVvJ/8rnyePOI9Gz3P/qt/LL/cgMnBYoGbQf3BVUFMwTmAcMACwAgAK//tP/Z/xkAUAAe/1n/tv63/Tr9rfvi+VL4IfZY89vwY+8i7rXtKO5/79Txh/Ov9bv3SvnW+rv7cvwk/eX9fv6D/oX/MgCeALUBYgLYA58F7AbWCGYKKAuGC3ALLgqZCIYH8AQGA8MBvf8u/5H+l/0T/kv++P2a/rf+cf4q/4X+8f2b/Vf8tPtz+ur55fk/+jr7xvuo/X7/IQGNAsoDewW6BR8GiAY0BrQGjwaiBdQF0gX0BDMFFQU6BS0GwwUMBm8G3QWzBRUFMwTIA14D0gKZAvYC7AJGAwYEcgSTBYgGtwcxCREKHgumCzsMwAw8DEAMjwzpDDoNYgzJDL4LrghWBg4Bxv3/+if2MPav9Zr1Z/ew9x/5EPmL+LH3C/Yw9MDyU/Pr8q7yn/Sc9XT1Uvan9/v4D/uD/WcAiQOTBeYHzAg+CHYHogWFAyQBOgBzADUAywG7A3YEQQWTBRkFvANzArMA0f6d/JT6vPjD9hH1J/O08QTwhO898LDwR/IH9er24Pf1+E354fhn+Hb37PYg92D3Qfjy+S78mv7/AMkCQwQvBiIHjQeCCM8IsggWCAkHogWxBIcDxwFqAe0A/QCPATICYAMLBFgEPQMGApYAKv5B/FD62PhH+Kj3NfcG+PT4iPmF+kP7dPwf/Zn9gv73/rD/uf+E/5j/HP86/2T///8MATICJQQxBecGfwgrCU8KrglFCV8JAQgHB8oGvAZjBnUGgwYUB8QHEQesBzkIPwepB5IHzAZvB98GJgadBXEEEQR5AzUCsAIYBGkEYAUuB3QIMwmRCKkHbAYgBAIC6f9u/nb99P0w/gf+uv/NALIA0ABMAA0AG/9Y/fz87/sc+/f6Hfqf+Zz5wPn9+RT6P/vP/KL9ff6+/34AXADT/8f+Xf3k+8L6v/lS+Wv5efqF+3X8Av5X/wcACgDf/1T/N/7l/LL7ifq3+c/4RvhM+Ez4wfg8+d75z/ph++X7K/xy/G78ufsN+0H6Ofl5+Lr3w/da+AT5dPrj+5T9Rv9tAJEBDAJFAmACtQEeAcQAcAAgABYAVgAJAcUBOgIcAxAEdgS7BOEEvgS+BCgEXQPVAu4B6wAQADb/6/7N/sn+Kv+4/7QAXgHiAa8C8QIOA7gCMgLpARsBtQBgACYAcQD3AL4BZwJdA6AEEgVuBewFDAbhBVgF8wSNBNYDPwP3Aq4CjQKuAsgC2gI7A40DuwPIA+sDHwTVA0MD+QJ3AoUBuwAJAKn/Qf8h/3r/5/+ZAHsB+gFuAsMC8AKRAtEBiQEcAVgA3v/R/xgAPgB+ACkBiAH3ASkCOAIfAuoB5gF6AfcAGwEaAdIAsgDIAOAAogBmAEIADwCj/2z/J//b/tD+4v7G/rj++v4j//v+5v7p/tP+i/44/hn+u/1R/e38g/wV/Kv7bPsd++f6BPsg+0P7ffu/+9b7yPul+0z71Poh+n355PhE+Ab4Bfgq+MH4hvlc+kr7OPz4/Hj92/0O/h7++/3e/cT9iv1t/X/9pP3J/SP+sv4q/83/awD3AIABwQH4AfUBuAGPATIB2ACPAGkAZQBJAH4ApgCyAPYA/AD+ACEBHQEcATABMgE6AS8BFwENAdgAswChAJkArQDcADcBbwG/ATQCYAKCArcCygLUArYCvwLNArUCxALBAtECzwLIAt4CvwKvAsECogJ+AooCcAI6AiMCBQLbAaYBgwFvAVUBSAE6ATkBNwE9AToBMgFTAW4BeAGAAZUBoAF5AVcBPwEIAeMA2gDNAL4AzADcAN0A3ADiAPgA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "DAFRANj/jP84/5P+vP2O/Wb96vyo/M/84PyS/GH8X/w+/Nb7dvtl+yz75PrM+r/6sPqC+jz6Bvr2+eT58/lg+vT6gvsf/Nr8pP1D/vz+5v/ZAMQBtgLeAwEF0QWVBk0HsQfVB+QHCAgFCNgHtwdrB70G/wUxBRwECAMcAiABIwBT/43+4P02/Y789ft4+xT7wfq2+gD7Z/vJ+0789vxz/eX9jP5U/xwA6wDJAbECkgM8BOwEuwVABpgGDAd/B+YHPAi1CCsJTAlOCUQJKAkCCeII3wjWCLUIaggnCPQHoQdWBwkH3gaRBhMG9wXQBcUFwAVrBawFnwVDBZ0FrgXxBWIGKwaNBrkGfgacBqoG5gb0BtUGDAfXBk4G1wVsBWYEbgIaAVL/tPxY+qL4YPcY9WzyLPEg71LsWOp26WnphuhV6OfpC+ua6xrtZ++e8THzXPVY+AD7J/2L/1kCgQSlBacGsQcvCNcHZwe2B0gHHgYSBdoDcQJkAIz+hP0S/Ln6zvkF+aP4D/jF98j3j/dm9zn3TPeU9x/4wvg0+dT5EPrR+af5bPmP+Y35jPkT+mv6m/rT+kL76vty/Pv8F/51/6EA/gHmA8IFDAcqCHkJNQqSCiQLwgtNDFsMUwwADPkKpQkVCGYGpgTaAjsBdv/f/Vv8zPpq+fb32vbj9RX13PQ59bT1XvaW97D4Vvl8+sr75/xI/v7/wAE4A5cE9AUMB8YHighBCa8JIAqDCscK/wogCxAL1AqACuUJMgmOCOoHWAfkBlkGtwUHBToEZgPQAlgCLQIbAgUCQwJjApsCAAN6AzsE0gRWBUgGCwe3B5oIfQlGCrMK7ApUC3sLTwuBC3ULQgveCikKkAm4CDQIwgciBzcHsgbzBYEFegTkAwUDuAEtAHT9uvpN97DzO/Ho7rfseeoh6PnltOMa4sfhaOJF5Hjmtegn7ADwOvPe9l/7RgB4Ax4G5wn6DJoOQQ+qEOkRCRBbDY4LdAkPBhMCJABF/n76uPZz9G3y3O9X7mbume7I7izvH/Ba8VbykfPT9M310vaT9yL40Phe+Sv6evo5+m36n/qW+uP6/vu6/eD+TwBNAusDcAUsBxgJ/QqJDOUN8w7VDzEQ4Q9dDyQOVAwWCpkHSQX1Ak0AIP7i+3D5Jfcm9ejz4fJM8rLyR/MC9Cr1nPZU+Nz55vvu/dX/+AHmA8oFVge6CKcJwgkJCvEJcglOCfAIgAgLCCYHPQZ4BYUEsAM9A+kChQIhAvUBrwE0AdcAigAqALL/nf+q/5j/zv8WAFcAoQD+AMUBpgKVA8wE/QU4B08IQQlPCjcLugtGDLAM+Qz/DN0MxgxeDNELRAu6CkoKnwn7CIYI2Qc7B50GewY0BsMFpQU7BQsFdwQHBIUEHwQYBEgErgO7A9sCAALXAU4AV/4Y+1v3+fOn76PsOOu66R3oheYa5SHkqeNp5Afn9+qJ7jTyx/b3+l7+rAG2BXYJNgvsDFMPQA9/DgUOwAyICrQGrwOxACv8BPlf91/1/PLx8A/wqu4D7U/tF+8J8JPwZPLq8zX0m/S/9eH2EPfp9qv3Ffj092v4dPmM+j37A/yb/TH/xABuA3IGMAmfC7cNLQ8bEKMQ9xBcEfMQBhCrDnMMxQmfBksDSQAQ/Qz6pvef9QH0yPIW8ubxJfKa8srzlPWi9wr6hPwE/ykB0QJlBIwFoQbOB5MIUQnnCfwJqwk0CZoIngfjBlQGqAVYBSoF+wSaBAEEegO7AsQBJAHJAGwA6P9p/+H+JP4x/WX8JvwV/Cn8BP0n/kD/iQDXAVIDyQRgBhwIjAkYC6EMSw3cDUwONA6CDXAMnAu5CnIJsAgUCHUH3AYEBq0FYQVRBZYF+QWiBhgHkQcKCLYHHQjaBxAHYAYeBbsEuAOAAqsC/AHBAasBsAC+AMcACgFEABj/Vf45+/D2sPJ07xzu1upp6A/o9+bq5JTiy+Nz5+LoCezL8Qf3o/sC/5YDWghSC0cNeA4cEEERNw8ZDV0L0QhvBBf/hfti+F/1ZPJt8KTwqe/s7fHtiO4s8BjxR/L39Bz20/Yk9zb3OfiC96b2G/fJ9tj2XPd0+Of57/oV/Sn/JQExBIsHygpZDbkPvhE2EkgSyhHREM0PSQ3KCi4IyQRAAZ39CPuJ+Hr17fN18yrzXfM39EL2wfeF+E76t/yx/l0AhwLIBOAFFAauBr0GZgY7BgAG3QWnBZQFeAU0BTEFSgVPBf0E3QRrBU8FDwUlBdIEDQS8Aq0BzQC+//7+af4T/qX9O/0T/SX9pv0+/hP/XwDpAU4DjAT8BSoHqQcfCLkILwkxCfsIOgkMCfUHMQcXB6cG1AXOBWYGnQatBg4HIQjVCOUImQnyCR0KPQqsCd0JWQk6COIHKgblBIoEFwOhAroBRQFvAXQAzwDZAQED/QRIBaUFnAZ7BuQEJAHy/1P86/Tj7rzqg+jX41Lf/9+33p/cQd2+35rm6Org75L4c/5CBFUJFA0ZEfsSBRWaFMUSExI9D0IKFQRtAKz9Lffj8m/xUPBz78Ds3O0Y8Arv6O/88ZP0+/ay9rD3",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
 📨 Processing event type: audioOutput
 🔊 Received audio response from Nova Sonic
 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
 🔊 Playing Nova Sonic audio through audio element
 ❌ Failed to play audio response: 
error @ webpack-internal:///…console-error.js:51
playAudioResponse @ webpack-internal:///…aSonicClient.ts:658
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 ❌ Realtime client error: 
error @ webpack-internal:///…console-error.js:51
eval @ webpack-internal:///…rc/app/page.tsx:379
eval @ webpack-internal:///…edVoiceClient.ts:40
emit @ webpack-internal:///…edVoiceClient.ts:40
eval @ webpack-internal:///…dVoiceClient.ts:202
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
playAudioResponse @ webpack-internal:///…aSonicClient.ts:659
await in playAudioResponse
eval @ webpack-internal:///…dVoiceClient.ts:186
eval @ webpack-internal:///…vaSonicClient.ts:46
emit @ webpack-internal:///…vaSonicClient.ts:46
handleNovaSonicEvent @ webpack-internal:///…aSonicClient.ts:436
processResponseStream @ webpack-internal:///…aSonicClient.ts:394
await in processResponseStream
initializeBidirectionalStream @ webpack-internal:///…aSonicClient.ts:374
 📨 Received chunk from Nova Sonic: {chunk: {…}}
 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "rgdKCSwKLQoRCjMKYgrgCYIJIwlsCEYH8wZNBwkH2gUYBXIEtwMRA5ACfgLmAQUBn//V/mX+7v3P/Or7iPsz+zz7cPsL/Gb8jPyH/O78Y/03/sL++v59/93/WgDlAE4BlQHgAUQCvAKeA8AElwVyBisHogfxB4wI4Qj1CP0IrgiSCJEIVQglCNgHYAcSB9gG7gYiB0QHTAdBBy8HMgcoB0wHbgf5BsoGjAZCBm0GSQaABpAGTQZNBoEGtgY0ByUHBwdZB24GPQYYBrwFfAVLBKMDQgNNA4QCRgEwATcA4Py2+cT5Qfmk97n1JvTg8jfyk/I08YjwlfAy8cbvDO9W8NjxcPLA8K7v5O5P8Mbw+u9c7zfwgfEJ8Y7xZ/O09Tr2ZvZs9x75Y/uJ/aX+W/7K/vT/zwDTACMB0QHEAU8BCwHxAdcC+gLFAooCbQL6AhIEmQRhBBEEYQRTBKUDUgMiA44CVwEeANX/3v+Z/8f+8P1x/VH9hP2Z/YT9uP0h/t/9hv0c/pn+Rv6m/Vv9Vf1r/dr9Rf5J/lf+zf4T/3P/eQByAdoBEAKnApwDTASwBA4FTgUaBeMEbQXwBc8FrwVTBQ8F7ASgBLEEpwRXBOcDqAOaA6kD7wOTA8kCNwI4AhcCfwFPAecAYwC0/1v/d/9h/xf/sv6f/sX+K/+X/wMAJwBOAKoAGwGxAWsC1QL9AlMDqwMYBJsEBgUuBUYFpAXdBToGEwdtB54HywcDCIsI6AhCCYAJnQnRCcMJoQnNCboJbAlpCTQJEgkSCQgJvAiDCGgInAdtBzsHzAb7BdwFcAUsBJ8DyAIpAyACKQAa/hb9wfwu+oX40veF9y/13fIp8gryF/Iy8c7v3u7O7yzwIPDJ7zrwoPDP7yzvg++08HjwIfAr8Grwp/Bl8fvyifOi8wj01/Wk98z4N/py+5f8T/1R/pH/rwCEAQECBQLZAWACcwPIAy0DxgIPA58D9AMVBHgEIQU3BfwEJgXWBTIGxwUqBawEcgRCBLsD9gIuAkgBaQDV/1b/Bf+v/jP+4/3b/fz9+P0X/hn+BP7X/eb9Pf5u/mD+8/3r/Rv+EP69/dD9Uf51/if+Wv5S/+f/JwBdAKsAJwHsAUwCXALdAkEDpwNMA+sCdgPUA60D/ALmAjYDgQOAA0cDegOTA7ADuwOGA7YD/gPnA30D6wL7AhIDxQIZApYBvQGDATsBOwFIAVcBYwFkAYoB2gE+AqEC1ALWAhQDdgPgA/gD3wMVBD4EUARHBJMEAQUuBWIFwQUrBqQGEgd9BzMIeghcCMYIVQmtCZ4JlAl9CcEJ9Qk3CeMINAl2CXgIzweZB9sHvAf9BuIFJQWqBbgEHASUAnIBMQHl/lf8i/vs+/z5T/e29S71sPQS827yIfIS8R7w6e9P8KrwT/DX7+zvku9c77fvafAl8KXvtu/v74PwMvH/8QHygfJj87v0c/Yu9274OPon+637//wS/2sAxQDLAJABrwJQA10DWwO/A9cDqQO2A2cE7wT6BNYE+gRrBdoFOAZDBjIG/QW1BYsFkgVHBVAEVAPJAkkCYAGMACEAp//M/hT+Df4n/un9m/2b/bz93/0X/kD+dv5v/gv+PP6I/jL+2v3k/QL+nf1c/WH92f03/uL90v2C/nL/uf+b//v/DgHVAXMBSgE/AusC0gIqAkwC+QLeAngCTwKEAqECsgKPAlcCtgIUA+4C6wL6AjIDJAMgAyMD9QLPAocCZQIoAvUB0AG1AYQBXwFwAYEBhAHJAQICDgIrAp4CKANeA48D6gNKBKoE8AQmBa0FCAYyBlAG4QZqB7kH8gftB4gIHwlOCXgJzQk+ClYKdQpbCqAKEAvLClEK2gkeChkKuQkrCXQIJwiKB5UGOAY0BnIEMgIuAawA2P4L/Yv8q/r7+CD30/V99Tv1X/TC8Ybxb/G48aPxU/Db8OrwKPBo7wPw3/Ce8LXvTO/q73XwpfAf8XfxhPEi8uXyc/Tm9f72/ffR+DD6Ofsp/ab+Kf8QAKcAUwEEAgoDWQM0AywDAgOkA8gD2QNjBHwEMAQKBMUEeQWfBXQFSwWVBZgFhwWDBR8FyQQPBAIDhQJJAs0BvADS/zH/rv5l/ur9q/19/ST9Ef04/W79fv2w/cj9kv2u/c390P3i/a79hP1g/Vv9Mv0e/RP91vz5/Pz8jv33/b/9Lf7t/lX/a//m/88AMAFmAYYB9AF3AlgCjgJ9Am4CgwJzAn4CYAKBAo8CaAJZAkcCiwK8ArIC3QIFAxYD/AIcAycDDgMNA9wCwQKpApkCnAKGAnQCcgJeAqACDAMHAz4DngMTBG0E3gQdBX8FWgahBtsGHwfUB20Imwh4CKAIbQmbCZkJwwnZCUUKcAplCooKrAqGClsKyQpqCigKpQrdCVgJpgmVCNEHJwhmB2AFOgQhAqsA5QBu/3H83/lq+qv5wvZ99H715PXv8hXxS/HJ8mPyA/F48OfwhfAR8JnwbvAf8BjwD/Bd787vAPHt8ITwq/DH8czylPPD9FH2WvfI9+T43frQ/KX9ev5a/1cAGgH+Ab0C7wJHA/UC",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "BvaW9tH23Pbv9/f43/nk+vD8Y/9CAREDcQULB4AIkQkmCvEKAQtLC/EK/glgCVIIBwf9BUAE2gJdAp4B4gBbAG8AZQD//3z/QP8T/8D+Nf7J/c/9a/0D/Xv8j/x//Db8qPxd/Tf++P5YAN8BygINBHwFOgbcBqUHqghGCX4JCAqsCrkKkAosC+kLfgyQDHMNHQ+WD4QPiBAYEpwSrBHnEDsSNBLxDy4PCw/oDWgM3AkGCp0KfgjcB3gIXAhWCI0GvwbJCOoG/wVdBt0FeQasBRoEYAbuA3kAMf1j+Qj4ivMl7lXt/urK54vnM+Zo5+TnsejI6b/qi+z876jxH/OB9HH0lPX79G70VvQA9ZT1NPWT9Uz4X/r+++L96f/rAbADrQWiB8EJmgorCoAJXgjZBscEgQKLABf+nvv9+fD42fdb92P2afVW9aT1q/XM9Wr2J/fN9gv2xvVq9SP1cvQO9KDzJvQL9eP1uvZJ+Bn6YPve/Mr+wADQAoIEZQWfBhoHXQdqB9AGaAYDBmUF3wSdBI0EEQSeA0UDaAMyA8kCBANzA4sDCgO5AoMCUwJJAVAAp/84/+T+gP5s/rr+2v4e/5f/8P+xAE8B/gHSAocDVAQpBZ0FNwZgBsUGjQfiB6UINgpCCx0MtwzPDZoPAxD3D+0Q1BHrEeMR3BF2EkEShBFVEFIPQQ7vDbQMFwvSCp0KqgnHCFMJTQlZCeoIrgcyCNgH6QTEBSoFtgMVAoUAFwJQAsoAif/b/s37nvdu9FLyIPBi7ULqxums6e/oUumU6vfqQerh6rrshu677zjxEvMz83vyxfKR8x30evM59AP1jvaF+NX6bv3q/mIAOwFVAqwDsAQGBnkGYgXMBJEEJgRXAogAe/94/tP8avtQ/O/8Qfx4++b6Bvvn+qL5JflO+eH4u/cB9wT3Mvdb9kT1T/Vq9cb1i/am97r49fkK+8v7WvyL/YT+nf65/pb/fwDlAGABzwE2Al4ClwLwAo8DtQSdBYIF4AXTBmIHFAekBo8GXgbrBUMFBQU2BR4FYQTCA6oDqwMuAzkDbQM7A4QDbQOYAyMEuANpA0QDIQN+A7YD0wPLBGQFxwWGBiUHSAgRCckJvgqFCysMUQ3zDeANNA5wDhIO/g2ODU8O6A5FDogOzA5RD6EOHQ7FDQYNkwzDC9gKjApBCrMJeQjkBykHPwYhBbEDxANOA6cCagEeAQ4CBwNwAeP/WP8S/aP5l/Y19PXxGu+i62rqNOru6jHrtuqD60jtlO1A7pPvBfH88Hrwz/C78GTwbfAK8THwMvBY8Y7zB/VY9vr4i/tM/Ff9dv9vAR0CZgG8AQ0CoAEkAVUB5wDS/03/C/8U/7r/8f9AAEUANABiAFgAEACF//f95/zW/D37+vnC+dr5ifgM95H3uPhm+Cn4C/mg+bf5E/qK+lr6VfoN+pX5EfmN+Rj6/fls+m37Yfzz/H3+IwD9AAACZQMzBPgEzgVWBqAGmAaaBpwGogbfBgUH9waAB6oHhwfTBz4ILAi9B2kHVAfvBqEGgwbGBYEFMAUJBSEFOQV/BQwGjQYBB7sHKQh+CJMIQAgxCAAIhAc+B1MHPAcUB4UHxAcqCGkIWQkHCgAKvApqCxULMgvVCnMKgQoGCVkIPwjkB/kG/gXnBYYGyQWFBasFTAVYBU0ElQNvA2wCiAHnAND/Tv/e/wn/a/5p/0X/UwCh/83+QP/O/dr7cvpg+Fr27PTL8pXyJ/JM8mfzDPT19BL2Cfdh94T39faP9uL1/vT+8xvzpPIN8sbxP/Ly8ujz1/QG9q330vi5+a36V/tn+1b7D/uk+k76+/mx+YX5tfmJ+g37l/vh/Bn+/f6+/4wAIAGTAV4B2ACEAEsAzf8O/3j+Qv5I/i3+MP5q/sn+E/8K/z3/o/+z/47/Nf8G/wb/kv5y/k/+bf7E/qT+N/9HALQAGgG4ARoCqwIoA74DmwOcAxwEnAMjA4wDmgMnA4EDagPDAo4EvAQqBeUE0gV7BVAFJQZSBLsFxANPBEYECATWA/kDnATqA6sElwQXBaMFTwU2BNoF5AT0BE4FXATLBFsEQQQGBGMEPQTdA/kD/QNPBKYDIwRiA/UCpgM1Ar0CmAI4Ap0CCAL5AYsCdAI2AlACFAKsAkcCwgAtAggCIwGLAZcAFwGVAbsAugAjAcMA6wCaAO0A9gAjAAABJAAqAIYAfP8SABAAR/+Y/wYAav8HANn/CQDhAKEA6ABGAR0BiAFwAaEA7gBuAKX/z/9U/3T+fv4W/uj9rv2e/Wf9Of0v/dT8sfyR/Gj8h/uW+0X7zPr4+j/6V/op+gr6Dfo1+jf6KvpF+g36k/p6+oX6kPpt+pT6pvqB+tT63/oA+wD7WvvJ+7375vtJ/Hz8ofzd/N/8Tv05/WP9Xf3p/aL92v0y/gP+g/6F/sr+8f4z/wv/ov/D/73/IQD4/10AYgBpAJoAsgCYAKgArwCVALUAngDEAK8AtACxAL8A5wC7ANkAxQDnAOEAzADrAOEA4ADbANYA2gD+APcACwEEASkBUgFcAY4BggGuAccBuQHQAeQB",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "1AHuAdcBxwHcAegB5AHYAe0B9gEKAgACCwIKAhgC8wHvAc0BzgG3AXoBfQFZAUgBLQE+AQQBGwELAQoB/wAAAQIB3QD4ALwAqwCgAJAAawBcAE8ASwBTAFsAVABlAHwAqQCrALQA6AD+AOkA8wAHAQcBBwHdAOQA9gDvANEA9gD2APAACAEEAQcBFAEeAQMB9QAPAesA4QDeAMYAxACwALUApgC3ALAAvwDJAMYA2ADRANcAzADQAL4AoQChAI8AjAB3AHoAZQBfAGMAWgBaAFsAZQBWAFYAYQBcADIAMAAlAAoA/v/q/9//0//W/8z/wP/L/8X/xf+//7j/xf+//7v/vP+6/6n/uv+7/6j/rf+w/7P/sP+t/7j/u/+l/63/rv+V/5T/lf+L/3//d/9w/2v/a/9k/2b/Wv9b/2X/W/9U/1X/UP9B/zr/Of8v/yb/KP8d/xr/Hf8l/yL/If8h/x7/Hv8d/yL/Dv8V/wz///72/vH+8f7k/t3+3P7e/tf+3P7f/t3+2/7Y/t3+3/7h/tn+2/7e/uH+5P7s/vf+Bf8F/xn/I/8y/0j/WP9q/3D/gP+P/53/o/+2/8D/zv/R/9v/8v/6//v/AwAdABEAMwA1ACkAOwA7ADkANwBJADcANAA/AEUARQA7AE0AWgBLAEgAWgBcAF4AXgBlAGYAYABnAG4AcQBsAHQAeAB6AH4AhACMAJAAkQCRAJgAnACWAJcAnACSAJMAlgCQAI8AkACSAJAAjgCPAJYAlwCQAJIAkwCWAJUAmACcAJsAlgCXAJkAmQCVAJMAlACUAJUAlwCVAJoAngCZAJ0AoACjAKYAqQCoAKwAqACqAKgAowChAJ4AnQCZAJYAlgCWAI4AjQCHAIcAgQB4AHQAcQBrAGQAXwBYAFYATgBKADwAPAA3ADUAKwAgACMAHAASAAEA/v/x/+r/3f/K/7r/tP+o/5P/hP98/3X/Zf9c/1H/Sf88/zX/KP8W/w3/Cf/8/un+5P7e/uH+1P7O/sz+0f7R/s7+zf7T/t3+4P7j/uT+7P7t/u7+8f71/vb++v4E///+Cv8O/xL/G/8g/yb/KP8v/zH/NP84/zz/Ov85/z3/Pv8//z//Rf9L/03/VP9Z/2D/Z/9u/3b/ef+A/4f/i/+S/5r/of+p/7L/tv/C/8r/0v/b/+T/7//8/wQADQAXAB4AJwAsADAAOwBAAEgAUQBYAGEAagBzAHcAfwCDAI0AkACXAJwAoACnAKsArwC3AL4AwgDJAM0A2ADdAOUA8AD1AP4ABQEHAQ0BEgEVAR0BIwElASsBNQE3AT8BPwFGAUgBSQFKAUsBTAFKAUgBQwFAAToBOAEyASoBJQEiARwBGAERAQ4BCQECAf8A9ADoAOUA2QDOAMIAuQCwAKUAlwCQAIUAgAB4AG0AZQBeAFQASwBAADcALAAiABUACgABAPj/7v/k/9//1P/P/8f/v/+5/7X/r/+m/5//m/+U/4j/hf+A/3j/c/9w/2z/av9o/2r/Z/9l/2X/Y/9d/1v/W/9Z/1f/T/9M/0n/R/9D/0P/Qf9B/0H/Qv9C/0T/Rf9K/0f/Sf9J/0n/Sv9M/0v/S/9M/0r/Tv9M/1D/U/9X/1v/Xv9k/2r/cP90/3v/ef97/37/fv9//4D/gf+D/4L/h/+K/4z/kP+U/5X/mf+b/5//pf+k/6n/q/+s/6//sP+w/7T/t/+6/7//xP/J/83/1v/a/+L/5//r//T/+P/+/wQACgAMABQAHAAeACUAKwAtADYAPQBCAEcATQBRAFgAXQBgAGcAZQBrAGwAbgBwAHEAdAB2AHgAegCBAIEAhwCFAIoAiQCIAIsAiACEAIMAggB8AIAAewB8AHkAdQB3AHUAdQByAHIAcgBxAG8AbABqAGYAYwBeAFsAVgBSAE4ATABGAEQAQgA9ADwAOQA5ADYANAAyADEALAApACYAIQAcABgAFAAQAA0ACwAJAAgABgACAAEA/v/9//v/+f/3//T/8f/u/+b/4v/g/9j/1f/U/83/yf/H/8b/w//A/7r/t/+3/7T/sP+t/6v/pf+i/57/mf+b/5v/lf+U/5X/lf+O/5H/jf+S/5D/jP+O/4z/kP+O/4//jv+N/5D/j/+R/5T/k/+Z/5r/mv+d/57/pP+i/6P/pP+k/6f/q/+p/6//sP+v/7b/t/+6/77/vv/H/8r/y//T/9P/2f/h/+L/5f/r/+z/8f/2//3///8CAAQACAAJAAkAEwATABQAGgAeAB8AIAAnADAAKgAwADIAMAA2ADMAMAA4ADMANQA5AC0ANQA3AD0APAA5AEAAQgBBAE0ARwBOAFAARgBVAE8AUQBYAFYAVwBWAFkAXgBcAFsAYwBeAGEAYwBeAGYAXwBeAGEAWwBeAFsAVQBaAFgAVABWAFMAUwBTAFQATwBTAE8ATABNAEQASABEAEQAPwA9AD4AOwA+AD0AOgA+ADwAOwA5ADkANwA2ADUALwAzAC8ALwAoACwAIQAiABgAGgAHAAYAAAD9/w4A/P8QAOH//f8IAOf/9P/1/+f/6P/3/9//4P/w/9v/",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "zf/e/9X/6//T/87/5P/n/+H/1v/a/+n/4P/I/+f/6P/h/+L/7v/m/+r/5v/v/+7/7v/4//X/9v/9/wAA8v/9/+3/6//7/+3/8f/q/wEA6f/8//v/8//1/+P/3v/G//3/4f/k/93/AwDW/+X/6v/s/97/9P8AAJj/4f8eAGL/v/5VAF4Ayf+u/y4AZQCJ//3+lP/4/5z+aP8UAJL/iv95AGIApv9s/6H/hP9w/2EA/f8DAAYAw//D/7n/g/+A/wYAvv+8/y0AHAAQADwAAADu/0oAYgAdAGsAmQBBAIsAfAANAEUAfQAAAAoAZwBEAFIAcwAvAPH/kQCcAAkA6/8rAHwAYgDr/93/LgBlABAAqP8pAH4AZgDo/+b/NwBTAD4AwP+b/+v/JAC8/2L/2v9OAH0Alv/d/zEARgDu/97/BAAXANj/tf9WAIb/OwC9/ykABAD//6n/uf9T/8f/QP83/6j+Gv8S/z3+U/80/+0AePd6+MT8Dvry/bsBZwHkAa8DSQOrAXMAeAIVABH7Iv9pAC/+YQHF/54AIwD5/isBNgHGALoA5ABZ/4YBwgH/AIIClv9WAPUASQEhAWkB9f8WAMv/LQCdAO7/VgBL/8n/3v6uAXX/vv5x+QD+QgLi/eMA8P94/uz8KP4AAGIBvwBnAcEBngDKAEYBtQCCAJP+2P48AK//vwF/AUUBiACAAO8AywAZAev/d/8p/xYAtv8tALH/w/+S/5n/kv/+/54ANv2B/ToAgAB9ARcDmAILBEgA8gJGBToAxQDB/0D+4vzG/TAAS//n/5UASwEzAR0CcQL1Ag8DNAFkA2kBvwAtAJAAhf5Z/hMA0/6v/nD+DP/f/Gz+Kf+l/uQAKQCi/4wB2wBfAIkBsQCB//AAfgATAZsAugDyAJoAWQHx//gAfAG2AMP/uwC+AGYADACFAKQAsP9mAAMAPAD//1kAOwC1/3wACADh/x8APwCl/8T/BwDt/rn/tgAJ/xv/yQCL/w/+Df5d/4AAOf/gAGkAVwBDAJD+Vf9C/7H+cf2F/8z+9/3P/rT/tf+9/t7/SgDz/1wAlv8hAJ8AdADk/0H/FgCA/77/Ef8FAKn/2/8CAJT/vv8+AGMAW/8gAIf/CADa/6b/sf+a/8z/p//Q/xMAHgCa/zMAHACM//P/IwCm/3X/bP/N/2z/b/+Z/zH/EP9D/6H/XP+c/6H/HADJ/2n/JgDS/z7/bf/H/6f/Rv/c/9H/WP/x/wQAk/9PAN7/w/8oAMv/IwCV/z4Auf/N////uP9XAP//6v8RAFcAPwAWAP3/FQAcABsATQAUACwAaQDr//L/LgBfACYATQA7ANL/OQAJABMA0v++/0gA4P8IAFsANADu/wMAJQCr/0QA7v/J/2sA1f8gAAMATgA2AMT/7/+N/8X/tv/3/x4AHwDf/+//aQAnAOb/PgAMAPH/2v+P/wQAeAAjAEUANQAgAE8AHQAyAOD/VwBK/8D/8wCy/zkAXQDc/1QAgv8PAWMAYP+XAK3/nQCf/1X/qgCH/wUA4f9WAHAAoP+k/8H/YwCz/1oABgAlACIA4P9aAAwBiQDI/0UAvP89AJX/GwAcAYf/9/+lAAcA3wDY/xIAqgDX/1UAgQANAEEAIwD9/2kAdf+pAOD/JwAdADwAKAAQ/3EA4f6uAAkAvf9NAiAAJf/9ABsAx//4AFf+qwFfALD+XwCIAO0By/2bALAC+/2qAE4C6v17AJsBIQAMAH0Ba/+M//T/mgC5AHb/SgE0AE8AQwCUADAAGAE8/44A+/9cAMwAhP+GAEMAoP/j//wAqwDk/3P/2gDF/xQA5v9tAI4AvP+z/1//+v/XALv/xP92AOj/IwBw/9f/1P8GADr/q/+IAG8Ajf9I/yYAp//a/xP/OgCg/6H/GwDP/wkAsv/W/6j/hf83/2//1v+s/wf/kP9l/8//ov8KAL7/V//O/3n/f/+M/wAAsP/E/2P/qf/E/0r/5v+a/wIAWf+V/1QAZv/F/6n/+/+G/4//+f+f/8j/3v/k/6n/6P/z/9L/r//5/+b/Sv+VAOv/6P9yAJj/3v+S/9n/jP8/AJ3/1f/o/8L/XAB4/zoAHgDu/3f/AgAiAPz/7/+0/woA6v+D/+P/JgDL/0MAm//z//j/8/8nAOP/TgDnABUAKQB+AIH/QgD5/9z/JgDX/wcA2v/K/0IAPgAzAIQA8f9TACUA4/8xAAgA/f8WAHkAzf9nAG4AXgBHANP/mwBCAAAAaQC9/wkALAA+AH8ADACJAC4AEgAuAEoAhQAIACQAewAuAEoAGgBOADwA6v8HAJAAegBbAAYACQBZAHr/UgDN/1oAWgDS/z0AJACLAM//TADn/8r/KAD1/7n/iwA8AAIA/f++/wgAOv+7/9v/0v92/xgA+//Y/yUAm/+j/0MA1//N/18A4P/Z/4D/EQDk/wb/pP/Y/+3/wf8rADYA4P/d/8D/+P/1/2YAn////ycA9v83AOr/9v/B/+f/5/8YADQA1v////H/HAAYAD0AVQDw/+v/DQDI/wAAjgDq/3oA+v8/ACEAQACRAKz/fP92/1EA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "6v/o/+X/5P/m/+f/3f/m/9z/4P/e/93/1//a/9T/1f/X/9D/1P/Q/9L/yP/T/8j/zv/K/8n/y//G/8z/y//N/8j/z//Q/8//z//T/9P/1v/X/9D/2//X/9f/3f/b/9z/4f/f/93/5P/l/+P/6f/n/+v/7f/o/+//8f/0/+z/+v/4//X/AAD9/wIAAgAHAAkACQAPABIAEwAbABUAIQAgACAAKAAnACYAKwAvACsANQAwAD4ANwBEAD0ARABKAEgAUQBRAFgAVABgAFwAZgBjAHEAbwB0AHcAegCFAHsAiQCRAJEAkQCbAJwAmQCoAKAAoQCuAKoArQCuALIAswC0AKwAtAC4AKwAswC6ALUArgC0ALYAtACuALYAsQCvAKwAtgCpAKoAsACnAKsAoACpAKIAowCcAKMAnQCYAJ0AlgCZAJEAkQCQAIwAkACFAIQAiQB/AIIAewB8AHQAeQBvAHEAbwBlAG0AYABkAF8AXwBZAFYAWgBUAE8AUABMAE4ARABFAEYAQgA+ADwAPAA4ADgAMwA4AC8ANAArACwALQAjACoAHwAhAB0AHwAVABgAEgANABAABwALAAAABAD8//r/+f/5//T/7v/6/+v/7v/n/+L/5P/g/9n/1f/d/9H/0P/V/8r/zP/H/8T/xf++/8D/u/+5/7v/tv+w/7T/r/+t/67/qv+o/6X/p/+j/6D/o/+e/57/nf+d/5f/nf+X/5j/lv+R/5n/kP+W/5P/kf+S/5P/j/+S/5L/iP+U/4//i/+U/4//jf+N/5H/iv+O/43/if+Q/4b/jv+L/4r/jf+L/43/jP+N/4z/jf+L/5D/if+M/43/if+Q/43/if+R/4v/jf+S/4z/kf+R/5D/kv+Q/5f/k/+W/5b/l/+U/5j/mP+U/5z/lv+Z/5r/nf+b/53/oP+c/6L/oP+f/6X/pP+k/6j/pf+q/6P/r/+q/63/sP+r/7T/sf+y/7T/uP+0/8H/vv+8/8L/yf/C/8n/yf/G/9H/zv/O/9D/3P/T/97/2P/Y/+j/3P/n/93/6f/m/+f/8P/n//D/7P/4/+3/9v/x//b/+//3//7/9////wAA//8EAAcAAwAFAA8ABQALABEACgATABEAEAAMABYAEAAXAB0ADwAcAB0AGgAdACIAHAAeACEAGwAnACMAGwAoACIAHgAqACIAIwArACQAJAAvACMALQAxACcAKgAxACwAKAAyACYAKwAvACkALAAyACoAJwAxACsAMAAzACwALgAzADEAMQA1AC8ANQA4ADAAOQAzADIANgAzADcAOwA0ADoAOwA6ADwAOgA/AEAAOgBGADsAQQBDADwAPgBEAEEAPgBFAD4AQABCAEoAOgBTAEAASwBOAFAASwA7AFMASAAzAF8ATQAoAEYAlABEAOv/vwB1APX/ZgCTABoAawBbACMAewBhAD4AQgCDAD4AXwBhAE0AcgBTAEYAcwBgAD8AdwBQAFQAbQBHAE4AawBIAE8AYQBDAFYAVgBFAE4AXgA3AEMAVwA7AEEAPQBHAD8AOAAwAEEALQAmAEAAIQAiACsAKQAbACUAIwAdACQAFQARAB0AEAACABMACQADAAQACAD//wAA///9//r/+P/1//f/+P/t//n/6//v/+n/6f/q/9//5P/h/9r/2f/c/9r/1//V/93/z//L/9j/z//I/8//zP/B/87/wP+5/83/vf++/8z/vf+8/8H/xf+3/8H/vP+p/8P/tP+0/7j/rv+u/7X/t/+w/6//tf+y/7L/t/+0/6j/rf+t/63/rv+q/7b/pP+q/7H/qv+s/6z/sv+x/63/uP+u/7j/uP+p/8H/uv+y/73/xf+y/8H/xP+6/8T/wf/G/8T/xf/K/8b/zP/P/87/0v/P/9X/0P/R/97/2P/X/+H/2//b/+b/4//i/+T/4//q/+j/7P/r/+7/7v/x//P/7f/3//j/9//8//r/+v///////f8BAAMA//8HAAUAAAAKAAkABwAMAAEAEwAIAAYAFAAHABQADwAVABAAEgATABMAEgAWABUAFQATABgAHgAaAB0AHgAaACEAIQAZAB8AGQAfABMAHAAfABsAEAAlABQAEQAZABUAGQASACAAFgAcABgAHgAXABcAFAAWABUAFwAVABAAHAASAAsAEwARAAUAGwAEAAQADgAHAA0ACAALAA4AAQANAAsAAgAEAAcAEAABAAMABQD///3/CAACAPn/BAACAPn/BwD9//7/BwD//wAA///+//z/AgD8/wMA+P/9/wAA+P8AAP7/+f/9//n//v////r/AAD6//7//v/3//z/AQD4/wAA+f/9/wEA9f8GAP3//v8AAP3/BAAAAP7/CAACAPz/CwD9/wAACwD8/wYA//8DAAoA/f8GAAgAAQAKAAYABQAMAAsABAAHABIA+/8SAAgACQASAAAAFgAJAAgAEgAJAAsAFQAFABYADwAPABgADQAbABEAEwAbAAwAHQATAA4AHQALABUAFwAUAAkAJgAGABMAJgADAB8ABwAUAAwAEwAeAAoAHAAOABEAFwAPABgAEQAQABkA",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
novaSonicClient.ts:823 ❌ Failed to play audio response: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: AbortError: The play() request was interrupted by a new load request. https://goo.gl/LdLk22
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 1920 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "audioOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "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
novaSonicClient.ts:544 📨 Processing event type: audioOutput
novaSonicClient.ts:562 🔊 Received audio response from Nova Sonic
unifiedVoiceClient.ts:287 🔊 UnifiedVoiceClient received audio from Nova Sonic, size: 17280 bytes
unifiedVoiceClient.ts:297 🔊 Playing Nova Sonic audio through audio element
page.tsx:159 🔊 Audio: play started, volume: 1 muted: false
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "c2fd5f57-8d57-49d7-a739-589999279cca",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "END_TURN",
      "type": "AUDIO"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentEnd
novaSonicClient.ts:583 🔇 Nova Sonic content end
unifiedVoiceClient.ts:313 🔇 Nova Sonic: Voice activity ended
page.tsx:156 🔊 Audio: loadstart
page.tsx:162 🔊 Audio error: Event {isTrusted: true, type: 'error', target: audio, currentTarget: audio, eventPhase: 2, …}
error @ intercept-console-error.js:51
Home.useMemo[sdkAudioElement] @ page.tsx:162
novaSonicClient.ts:823 ❌ Failed to play audio response: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
playAudioResponse @ novaSonicClient.ts:823
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:371 ❌ Realtime client error: NotSupportedError: Failed to load because no supported source was found.
error @ intercept-console-error.js:51
eval @ page.tsx:371
eval @ unifiedVoiceClient.ts:95
emit @ unifiedVoiceClient.ts:95
eval @ unifiedVoiceClient.ts:317
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
playAudioResponse @ novaSonicClient.ts:824
await in playAudioResponse
eval @ unifiedVoiceClient.ts:298
eval @ novaSonicClient.ts:67
emit @ novaSonicClient.ts:67
handleNovaSonicEvent @ novaSonicClient.ts:564
processResponseStream @ novaSonicClient.ts:514
await in processResponseStream
initializeBidirectionalStream @ novaSonicClient.ts:488
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:160 🔊 Audio: pause
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "additionalModelFields": "{\"generationStage\":\"FINAL\"}",
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "6ac1dcdc-a1d5-4628-b392-0236563e048e",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "textOutputConfiguration": {
        "mediaType": "text/plain"
      },
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentStart
novaSonicClient.ts:556 🎤 Nova Sonic content start
unifiedVoiceClient.ts:308 🎤 Nova Sonic: Voice activity started
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "textOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": "Absolutely, I'll check Jira for any tickets related to LinkedIn right away.",
      "contentId": "6ac1dcdc-a1d5-4628-b392-0236563e048e",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: textOutput
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "6ac1dcdc-a1d5-4628-b392-0236563e048e",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "END_TURN",
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentEnd
novaSonicClient.ts:583 🔇 Nova Sonic content end
unifiedVoiceClient.ts:313 🔇 Nova Sonic: Voice activity ended
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentStart": {
      "additionalModelFields": "{\"generationStage\":\"FINAL\"}",
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "e61437e0-7952-442f-b3b9-26cdb796e919",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "textOutputConfiguration": {
        "mediaType": "text/plain"
      },
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentStart
novaSonicClient.ts:556 🎤 Nova Sonic content start
unifiedVoiceClient.ts:308 🎤 Nova Sonic: Voice activity started
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "textOutput": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "content": " Just a moment while I look that up for you.",
      "contentId": "e61437e0-7952-442f-b3b9-26cdb796e919",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "role": "ASSISTANT",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: textOutput
novaSonicClient.ts:509 📨 Received chunk from Nova Sonic: {chunk: {…}}
novaSonicClient.ts:537 📨 Nova Sonic event received: {
  "event": {
    "contentEnd": {
      "completionId": "71cbb3b2-5eea-4083-81a6-d61635509147",
      "contentId": "e61437e0-7952-442f-b3b9-26cdb796e919",
      "promptName": "prompt-1752618686975-qc0syhfex8d",
      "sessionId": "ffee2b77-5803-4551-a27c-4256d46cb986",
      "stopReason": "PARTIAL_TURN",
      "type": "TEXT"
    }
  }
}
novaSonicClient.ts:544 📨 Processing event type: contentEnd
novaSonicClient.ts:583 🔇 Nova Sonic content end
unifiedVoiceClient.ts:313 🔇 Nova Sonic: Voice activity ended
page.tsx:906 🎨 Rendering with currentView: dashboard
page.tsx:906 🎨 Rendering with currentView: dashboard
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
novaSonicClient.ts:720 🎵 Sent PCM audio chunk to Nova Sonic: 8192 bytes
novaSonicClient.ts:450 📤 Yielding dynamic event from queue
