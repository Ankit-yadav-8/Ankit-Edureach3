import { useState, useEffect, useRef } from "react";
import "../styles/ai-tutor.css";

// ---------------- Config: swap this for your real API call ----------------
async function getAnswer(question) {
  // Simulated "LLM" responses for demo purposes.
  const q = question.toLowerCase();

  if (q.includes("2x") || q.includes("solve") || q.includes("equation")) {
    return {
      speech: "Sure! Let's solve two x plus five equals fifteen, step by step.",
      steps: [
        { step: 1, text: "Subtract 5 from both sides", math: "2x = 10" },
        { step: 2, text: "Divide both sides by 2", math: "x = 5" },
      ],
      closing: "Nice — you've got it!",
    };
  }
  if (q.includes("photosynthesis")) {
    return {
      speech: "Great question. Photosynthesis is how plants make their own food using sunlight.",
      steps: [
        { step: 1, text: "Plant takes in sunlight, water, and CO₂", math: "" },
        { step: 2, text: "Chlorophyll converts this into glucose", math: "" },
        { step: 3, text: "Oxygen is released as a byproduct", math: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂" },
      ],
      closing: "That's the whole cycle — nicely done!",
    };
  }
  return {
    speech: "Here's a general step by step approach to your question.",
    steps: [
      { step: 1, text: "Identify what the question is really asking", math: "" },
      { step: 2, text: "Break it into smaller, familiar parts", math: "" },
      { step: 3, text: "Solve each part, then combine the results", math: "" },
    ],
    closing: "Try asking me a specific math or science question next!",
  };
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
          <div className="neo-footer-note">
            Demo runs on sample questions locally — wire in your LLM API call inside{" "}
            <code>getAnswer()</code> for real answers.
          </div>
        </div>
      </div>
    </div>
  );
}
