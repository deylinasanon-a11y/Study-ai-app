import { useState, useEffect, useRef } from "react";    

const STEPS = ["upload", "plan", "study"];

const sampleTopics = [
  { id: 1, title: "Key Concepts", done: false },
  { id: 2, title: "Visual Summary", done: false },
  { id: 3, title: "Flashcards", done: false },
  { id: 4, title: "Active Recall Quiz", done: false },
];

function UploadStep({ onAnalyze }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target.result);
    reader.readAsText(f);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
            const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 3000) }),
      });
      const data = await res.json();
      const raw = data.content.map(b => b.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      onAnalyze(parsed, text);
    } catch (err) {
      alert("Error analyzing material. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 20, padding: "40px 32px", marginBottom: 24, textAlign: "center", color: "#fff"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>StudyAI</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 15 }}>
          Paste your lecture notes or upload a file — get a full study plan instantly
        </p>
      </div>

      <div style={{
        border: "2px dashed #c4b5fd", borderRadius: 16, padding: 24,
        textAlign: "center", cursor: "pointer", background: "#faf5ff", marginBottom: 16
      }} onClick={() => fileRef.current.click()}>
        <div style={{ fontSize: 32 }}>📄</div>
        <p style={{ margin: "8px 0 0", color: "#7c3aed", fontWeight: 600 }}>
          {file ? `✅ ${file.name}` : "Click to upload a .txt file"}
        </p>
        <input ref={fileRef} type="file" accept=".txt,.md" style={{ display: "none" }} onChange={handleFile} />
      </div>

      <div style={{ textAlign: "center", color: "#9ca3af", margin: "8px 0", fontSize: 13 }}>— or paste below —</div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your lecture notes, textbook excerpt, or any study material here..."
        style={{
          width: "100%", minHeight: 160, borderRadius: 12, border: "1.5px solid #e5e7eb",
          padding: 14, fontSize: 14, resize: "vertical", fontFamily: "inherit",
          outline: "none", boxSizing: "border-box"
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || loading}
        style={{
          width: "100%", marginTop: 16, padding: "14px 0",
          background: loading ? "#c4b5fd" : "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff", border: "none", borderRadius: 12, fontSize: 16,
          fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s"
        }}
      >
        {loading ? "🔍 Analyzing your material..." : "✨ Build My Study Plan"}
      </button>
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span style={{
      background: color + "22", color, borderRadius: 20, padding: "3px 10px",
      fontSize: 12, fontWeight: 700, display: "inline-block"
    }}>{children}</span>
  );
}

function FlashcardDeck({ cards }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [review, setReview] = useState([]);

  if (known.length + review.length === cards.length) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <h3 style={{ margin: "12px 0 4px" }}>Deck Complete!</h3>
        <p style={{ color: "#6b7280" }}>
          ✅ Knew: {known.length} &nbsp; 🔁 Review: {review.length}
        </p>
        <button onClick={() => { setIdx(0); setFlipped(false); setKnown([]); setReview([]); }}
          style={{ marginTop: 12, padding: "10px 24px", background: "#667eea", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
          Restart
        </button>
      </div>
    );
  }

  const card = cards[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#6b7280" }}>
        <span>Card {idx + 1} of {cards.length}</span>
        <span>✅ {known.length} known · 🔁 {review.length} to review</span>
      </div>
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: flipped ? "linear-gradient(135deg, #667eea, #764ba2)" : "#fff",
          color: flipped ? "#fff" : "#1f2937",
          border: "2px solid #e5e7eb", borderRadius: 16, minHeight: 140,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, cursor: "pointer", transition: "all 0.3s", textAlign: "center",
          fontSize: 16, fontWeight: flipped ? 500 : 600, boxShadow: "0 4px 20px #0001"
        }}
      >
        {flipped ? card.a : card.q}
        <div style={{ position: "absolute", bottom: 8, fontSize: 11, opacity: 0.5 }}>
          {flipped ? "Answer" : "Tap to reveal"}
        </div>
      </div>
      {flipped && (
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => { setReview(r => [...r, card]); setIdx(i => i + 1); setFlipped(false); }}
            style={{ flex: 1, padding: "11px 0", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            🔁 Need Review
          </button>
          <button onClick={() => { setKnown(k => [...k, card]); setIdx(i => i + 1); setFlipped(false); }}
            style={{ flex: 1, padding: "11px 0", background: "#dcfce7", color: "#16a34a", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            ✅ Got It!
          </button>
        </div>
      )}
    </div>
  );
}

function PlanView({ plan, title }) {
  const days = [
    { label: "📅 Today", key: "today", color: "#667eea" },
    { label: "📅 Tomorrow", key: "tomorrow", color: "#f59e0b" },
    { label: "📅 Day After", key: "dayAfter", color: "#10b981" },
    { label: "🔔 Next Week", key: "nextWeek", color: "#ef4444" },
  ];
  const [checked, setChecked] = useState({});

  const toggle = (k) => setChecked(c => ({ ...c, [k]: !c[k] }));

  return (
    <div>
      <h3 style={{ margin: "0 0 16px", color: "#1f2937" }}>📋 Study Plan for: <em>{title}</em></h3>
      {days.map(d => (
        plan[d.key]?.length > 0 && (
          <div key={d.key} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: d.color, marginBottom: 8, fontSize: 14 }}>{d.label}</div>
            {plan[d.key].map((task, i) => {
              const key = `${d.key}-${i}`;
              return (
                <div key={key} onClick={() => toggle(key)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  background: checked[key] ? "#f0fdf4" : "#f9fafb", borderRadius: 10,
                  marginBottom: 6, cursor: "pointer", border: `1.5px solid ${checked[key] ? "#86efac" : "#e5e7eb"}`,
                  transition: "all 0.2s"
                }}>
                  <span style={{ fontSize: 18 }}>{checked[key] ? "✅" : "⬜"}</span>
                  <span style={{ color: checked[key] ? "#6b7280" : "#374151", textDecoration: checked[key] ? "line-through" : "none", fontSize: 14 }}>{task}</span>
                </div>
              );
            })}
          </div>
        )
      ))}
    </div>
  );
}

function StudyView({ data }) {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "📚 Overview" },
    { id: "plan", label: "🗓 Plan" },
    { id: "flashcards", label: "🃏 Flashcards" },
    { id: "videos", label: "🎥 Videos" },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 20, color: "#fff"
      }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{data.title}</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.85, fontSize: 14 }}>{data.summary}</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: 20, border: "none", whiteSpace: "nowrap",
            background: tab === t.id ? "#667eea" : "#f3f4f6",
            color: tab === t.id ? "#fff" : "#374151",
            fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "all 0.2s"
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <h3 style={{ margin: "0 0 12px", color: "#1f2937" }}>🎯 Key Points</h3>
          {data.keyPoints.map((p, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "12px 16px",
              background: "#fff", borderRadius: 12, marginBottom: 8,
              border: "1.5px solid #e5e7eb", alignItems: "flex-start"
            }}>
              <span style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff",
                borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0
              }}>{i + 1}</span>
              <span style={{ color: "#374151", fontSize: 14, lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "plan" && <PlanView plan={data.studyPlan} title={data.title} />}

      {tab === "flashcards" && (
        <div>
          <h3 style={{ margin: "0 0 16px", color: "#1f2937" }}>🃏 Flashcards</h3>
          <FlashcardDeck cards={data.flashcards} />
        </div>
      )}

      {tab === "videos" && (
        <div>
          <h3 style={{ margin: "0 0 12px", color: "#1f2937" }}>🎥 Search for Videos</h3>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
            Use this search query to find great videos on YouTube about this topic:
          </p>
          <div style={{
            background: "#f3f4f6", borderRadius: 12, padding: 16, marginBottom: 16,
            fontFamily: "monospace", fontSize: 14, color: "#374151", wordBreak: "break-all"
          }}>
            🔍 {data.videoQuery}
          </div>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(data.videoQuery)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", padding: "13px 0",
              background: "#ff0000", color: "#fff", borderRadius: 12,
              fontWeight: 700, textDecoration: "none", fontSize: 15, marginBottom: 12
            }}
          >
            ▶ Search on YouTube
          </a>
          <p style={{ color: "#6b7280", fontSize: 13, marginTop: 16 }}>
            💡 <strong>Tip:</strong> Also try Khan Academy, Coursera, or 3Blue1Brown for visual explanations!
          </p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f7ff",
      padding: "32px 16px", fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {!data
        ? <UploadStep onAnalyze={(d) => setData(d)} />
        : (
          <div>
            <button onClick={() => setData(null)} style={{
              marginBottom: 20, background: "none", border: "1.5px solid #e5e7eb",
              borderRadius: 10, padding: "7px 16px", cursor: "pointer",
              color: "#6b7280", fontSize: 13, fontWeight: 600, display: "block", margin: "0 auto 20px"
            }}>← Study New Material</button>
            <StudyView data={data} />
          </div>
        )
      }
    </div>
  );
}
