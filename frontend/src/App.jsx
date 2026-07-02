import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    `http://localhost:8000/screenshot?${Date.now()}`
  );

  const [messages, setMessages] = useState([]);

  const ask = async (prompt) => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/analyse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: prompt,
          }),
        }
      );

      const data = await response.json();
      const cleanAnswer = data.result
                      .replace(/^User:.*$/gm, "")
                      .replace(/^Assistant:\s*/gm, "")
                      .trim();

      setMessages((prev) => [
        ...prev,
        {
          question: prompt,
          answer:cleanAnswer,
        },
      ]);

      setImageUrl(
        `http://localhost:8000/screenshot?${Date.now()}`
      );

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          question: prompt,
          answer: "Failed to connect to backend.",
        },
      ]);
    }

    setLoading(false);
  };

  const analyzeScreen = () => {
    ask(question);
    setQuestion("");
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Talk To Any Software</h1>

      <img
        src={imageUrl}
        alt="Current Screenshot"
        width="100%"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <button onClick={() => ask("Explain this screen")}>
          Explain Screen
        </button>

        <button onClick={() => ask("Find bug")}>
          Find Bug
        </button>

        <button onClick={() => ask("What should I do next?")}>
          Next Step
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about the current screen..."
          style={{
            flex: 1,
            padding: "10px",
          }}
        />

        <button onClick={analyzeScreen}>
          Analyze
        </button>
      </div>

      {loading && <p>Analyzing screen...</p>}

      <div>
        {messages
          .slice()
          .reverse()
          .map((msg, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <h4>User</h4>
              <p>{msg.question}</p>

              <h4>Assistant</h4>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.answer}
              </pre>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;