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

  const recognitionRef = useRef(null);

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

  return (
    <div className="ai-tutor-wrapper">
      <div className="ai-tutor-app">
        {/* LEFT: Voice control */}
        <div className="neo-panel neo-voice-panel">
          <div className="neo-brand">
            <div className="neo-brand-dot"></div>
            <div>
              <div className="neo-brand-name">ARIA</div>
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

          <div className="neo-inset neo-transcript">
            {transcript ? (
              <span>{transcript}</span>
            ) : (
              <span className="placeholder">Your question will appear here…</span>
            )}
          </div>

          <div className="neo-controls-row">
            <button
              className={`neo-pill-btn ${voiceOn ? "active" : ""}`}
              onClick={toggleVoice}
            >
              {voiceOn ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
            <button className="neo-pill-btn" onClick={handleReplay}>
              ↻ Replay
            </button>
          </div>

          <form className="neo-chat-form" onSubmit={handleTextSubmit}>
            <input 
              type="text" 
              className="neo-chat-input" 
              placeholder="Or type your question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="neo-chat-send" aria-label="Send">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
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
    </div>
  );
}
