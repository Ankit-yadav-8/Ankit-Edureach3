import { useState, useEffect, useRef } from "react";
import "../styles/ai-tutor.css";
import { API_BASE } from "../auth/api.js";



async function getAnswer(question) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    
    if (!res.ok) throw new Error("API Request Failed");
    const data = await res.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (err) {
    console.error("AI API Error:", err);
    return {
      speech: "I am having trouble connecting to my brain right now.",
      steps: [
        { step: 1, text: "Check your internet connection", math: "" },
        { step: 2, text: "Verify the provided API key is valid", math: "" }
      ],
      closing: "Try again in a moment."
    };
  }
}
// ---------------------------------------------------------------------------

export default function AiTutor() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Tap the mic and ask a question");
  const [transcript, setTranscript] = useState("");
  const [qLabel, setQLabel] = useState("");
  const [voiceOn, setVoiceOn] = useState(true);
  const [answerData, setAnswerData] = useState(null);
  const [inputText, setInputText] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [callMuted, setCallMuted] = useState(false);
  const [callTime, setCallTime] = useState(0);

  const recognitionRef = useRef(null);

  useEffect(() => {
    let timer;
    if (callActive) {
      timer = setInterval(() => setCallTime(prev => prev + 1), 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    // Inject the Kalam font if not already present
    if (!document.getElementById("kalam-font")) {
      const link = document.createElement("link");
      link.id = "kalam-font";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap";
      document.head.appendChild(link);
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInputText(text);
        // Automatically submit the question when they finish speaking
        handleQuestion(text);
      };
      recognition.onerror = () => {
        setListening(false);
        setStatusText("Didn't catch that — tap and try again");
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognitionRef.current = recognition;
    }

    // Warm up voices
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (listening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setListening(false);
      setStatusText("Tap the mic and ask a question");
      return;
    }
    
    if (recognitionRef.current) {
      setListening(true);
      setStatusText("Listening…");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback for browsers without SpeechRecognition
      simulateListening();
    }
  };

  const simulateListening = () => {
    setListening(true);
    setStatusText("Listening…");
    const sample = [
      "Solve 2x plus 5 equals 15",
      "Explain photosynthesis",
      "How do I solve this equation",
    ];
    const q = sample[Math.floor(Math.random() * sample.length)];
    setTimeout(() => {
      setListening(false);
      handleQuestion(q);
    }, 500);
  };

  const handleQuestion = async (question) => {
    setTranscript(question);
    setQLabel('"' + question + '"');
    setStatusText("Thinking…");
    setAnswerData(null); // Clear previous answer to re-trigger animations

    const answer = await getAnswer(question);
    setAnswerData(answer);
    speak(answer);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const q = inputText.trim();
    setInputText("");
    handleQuestion(q);
  };

  const speak = (answer) => {
    setStatusText("Ready");
    if (!voiceOn || !("speechSynthesis" in window)) return;

    const fullText = answer.speech + " " + answer.steps.map((s) => s.text).join(". ") + ". " + answer.closing;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /Google US English|Samantha|Female/i.test(v.name));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setSpeaking(true);
      setStatusText("Speaking…");
    };
    utterance.onend = () => {
      setSpeaking(false);
      setStatusText("Tap the mic and ask a question");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    setVoiceOn((prev) => {
      const next = !prev;
      if (!next && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  const handleReplay = () => {
    if (answerData) speak(answerData);
  };

  const handleCallStart = () => {
    setCallActive(true);
    setCallMuted(false);
    
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hi, I'm College Parichay, your voice tutor. How can I help you today?");
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => /Google US English|Samantha|Female/i.test(v.name));
      if (preferred) utterance.voice = preferred;
      
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        if (!callMuted && recognitionRef.current) {
          setListening(true);
          try { recognitionRef.current.start(); } catch(e) {}
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCallEnd = () => {
    setCallActive(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setSpeaking(false);
    setListening(false);
  };

  return (
    <div className="ai-tutor-wrapper">
      <div className="ai-tutor-app">
        {/* LEFT: Voice control */}
        <div className="neo-panel neo-voice-panel">
          <div className="neo-brand">
            <div className="neo-brand-dot"></div>
            <div>
              <div className="neo-brand-name">CollegeParichay</div>
              <div className="neo-brand-sub">your voice tutor</div>
            </div>
          </div>

          <div className="neo-mic-stage">
            <div
              className={`neo-ring ${listening ? "active" : ""}`}
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className={`neo-ring ${listening ? "active" : ""}`}
              style={{ animationDelay: "0.4s" }}
            ></div>
            <button
              className={`neo-mic-btn ${listening ? "listening" : ""} ${speaking ? "speaking" : ""}`}
              onClick={handleMicClick}
              aria-label="Tap to speak"
            >
              <svg viewBox="0 0 24 24">
                <path
                  className="mic-body"
                  d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z"
                />
              </svg>
            </button>
          </div>

          <div className={`neo-status-text ${listening ? "on" : ""}`}>{statusText}</div>

          <form className="neo-combined-box" onSubmit={handleTextSubmit}>
            <div className="neo-combined-top">
              <textarea
                className="neo-combined-input"
                placeholder="Type or speak your question..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={2}
              />
              <button type="submit" className="neo-chat-send" aria-label="Send">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="neo-controls-row">
              <button
                type="button"
                className={`neo-pill-btn ${voiceOn ? "active" : ""}`}
                onClick={toggleVoice}
              >
                {voiceOn ? "🔊 Voice on" : "🔇 Voice off"}
              </button>
              <button type="button" className="neo-pill-btn" onClick={handleReplay}>
                ↻ Replay
              </button>
            </div>
          </form>

          <button className="neo-call-btn" onClick={handleCallStart}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
            </svg>
            Call CollegeParichay — talk live
          </button>
        </div>

        {/* RIGHT: Handwritten solution */}
        <div className="neo-panel neo-solution-panel">
          <div className="neo-solution-header">
            <div>
              <div className="neo-solution-title">Solution</div>
              <div className="neo-solution-sub">written out step by step</div>
            </div>
            <div className="neo-solution-sub">{qLabel}</div>
          </div>
          <div className="neo-paper">
            <div className="neo-paper-inner">
              {!answerData ? (
                <div className="neo-empty-state">Ask something — I'll work it out here ✎</div>
              ) : (
                <>
                  {answerData.steps.map((s, i) => (
                    <div
                      key={i}
                      className="neo-step-card"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    >
                      <span className="neo-step-num">{s.step}</span>
                      <span className="neo-step-text">{s.text}</span>
                      {s.math && <div className="neo-step-math">{s.math}</div>}
                    </div>
                  ))}
                  <div
                    className="neo-final-line"
                    style={{
                      animationDelay: `${answerData.steps.length * 0.35 + 0.2}s`,
                    }}
                  >
                    ✓ {answerData.closing}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {callActive && (
        <div className="aria-call-overlay">
          <div className="aria-call-timer">{formatTime(callTime)}</div>
          <div className="aria-call-center">
            <div className={`aria-call-avatar ${speaking ? "speaking" : ""}`}>CP</div>
            <div className="aria-call-name">CollegeParichay — your mentor</div>
            <div className="aria-call-status">
              {speaking ? "Speaking..." : listening ? "Listening..." : "Connected"}
            </div>
          </div>
          <div className="aria-call-controls">
            <button 
              className={`aria-call-btn-circle aria-call-mute ${callMuted ? "muted" : ""}`}
              onClick={() => {
                const nextMuted = !callMuted;
                setCallMuted(nextMuted);
                if (nextMuted) {
                  if (recognitionRef.current) recognitionRef.current.stop();
                  setListening(false);
                } else {
                  if (recognitionRef.current) {
                    setListening(true);
                    try { recognitionRef.current.start(); } catch(e) {}
                  }
                }
              }}
            >
              {callMuted ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z" opacity="0.3"/>
                  <path d="M21 21l-18-18-1-1 2-2 18 18z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z" />
                </svg>
              )}
            </button>
            <button className="aria-call-btn-circle aria-call-end" onClick={handleCallEnd}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
