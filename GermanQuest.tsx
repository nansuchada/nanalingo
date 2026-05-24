import { useState, useEffect } from "react";

const categories = [
  {
    id: "greetings",
    name: "Greetings",
    emoji: "👋",
    color: "#f9c6d0",
    textColor: "#8b3a4a",
    unlocked: true,
    phrases: [
      { de: "Hallo!", en: "Hello!", hint: "HAH-loh" },
      { de: "Guten Morgen!", en: "Good morning!", hint: "GOO-ten MOR-gen" },
      { de: "Guten Tag!", en: "Good day!", hint: "GOO-ten TAHK" },
      { de: "Guten Abend!", en: "Good evening!", hint: "GOO-ten AH-bent" },
      { de: "Tschüss!", en: "Bye!", hint: "CHÜSS" },
      { de: "Auf Wiedersehen!", en: "Goodbye!", hint: "owf VEE-der-zayn" },
      { de: "Wie geht's?", en: "How are you?", hint: "vee GAYTS" },
      { de: "Mir geht's gut!", en: "I'm doing well!", hint: "meer GAYTS goot" },
    ],
  },
  {
    id: "introductions",
    name: "Introductions",
    emoji: "🌸",
    color: "#c6d9f9",
    textColor: "#2c4a8b",
    unlocked: true,
    phrases: [
      { de: "Ich heiße...", en: "My name is...", hint: "ich HY-seh" },
      { de: "Wie heißt du?", en: "What's your name?", hint: "vee HYSST doo" },
      { de: "Woher kommst du?", en: "Where are you from?", hint: "vo-HAIR KOHMST doo" },
      { de: "Ich komme aus...", en: "I'm from...", hint: "ich KOM-eh ows" },
      { de: "Schön dich kennenzulernen!", en: "Nice to meet you!", hint: "shern dich KEN-en-tsoo-lair-nen" },
      { de: "Ich spreche ein bisschen Deutsch.", en: "I speak a little German.", hint: "ich SHPREH-kheh yn BIS-khen DOYTSH" },
    ],
  },
  {
    id: "cafe",
    name: "At the Café",
    emoji: "☕",
    color: "#f9e6c6",
    textColor: "#7a4a10",
    unlocked: false,
    starsNeeded: 5,
    phrases: [
      { de: "Einen Kaffee, bitte.", en: "A coffee, please.", hint: "EY-nen KAH-fay BIT-teh" },
      { de: "Die Speisekarte, bitte.", en: "The menu, please.", hint: "dee SHPY-zeh-kar-teh BIT-teh" },
      { de: "Was empfehlen Sie?", en: "What do you recommend?", hint: "vas em-PFAY-len zee" },
      { de: "Das schmeckt gut!", en: "That tastes good!", hint: "das SHMECKT goot" },
      { de: "Die Rechnung, bitte.", en: "The bill, please.", hint: "dee RECH-noong BIT-teh" },
      { de: "Zahlen, bitte!", en: "I'd like to pay!", hint: "TSAH-len BIT-teh" },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    emoji: "🛍️",
    color: "#d4f9c6",
    textColor: "#2a6b1a",
    unlocked: false,
    starsNeeded: 10,
    phrases: [
      { de: "Wie viel kostet das?", en: "How much does that cost?", hint: "vee feel KOS-tet das" },
      { de: "Das ist zu teuer.", en: "That's too expensive.", hint: "das ist tsoo TOY-er" },
      { de: "Ich nehme das.", en: "I'll take it.", hint: "ich NAY-meh das" },
      { de: "Haben Sie das in einer anderen Farbe?", en: "Do you have it in another color?", hint: "HAH-ben zee das in EY-ner AN-der-en FAR-beh" },
      { de: "Nur schauen, danke.", en: "Just looking, thanks.", hint: "noor SHOW-en DAHN-keh" },
    ],
  },
  {
    id: "directions",
    name: "Getting Around",
    emoji: "🗺️",
    color: "#e6c6f9",
    textColor: "#5a2a8b",
    unlocked: false,
    starsNeeded: 16,
    phrases: [
      { de: "Wo ist...?", en: "Where is...?", hint: "vo IST" },
      { de: "Links", en: "Left", hint: "LINKS" },
      { de: "Rechts", en: "Right", hint: "REHKHTS" },
      { de: "Geradeaus", en: "Straight ahead", hint: "geh-RAH-deh-ows" },
      { de: "Wie weit ist es?", en: "How far is it?", hint: "vee VYT ist es" },
      { de: "Ich habe mich verirrt.", en: "I'm lost.", hint: "ich HAH-beh mich fer-IRT" },
    ],
  },
];

const STAR_KEY = "german_quest_stars";

function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    color: ["#f9c6d0", "#c6d9f9", "#f9e6c6", "#d4f9c6", "#e6c6f9", "#ffd6e7"][i % 6],
  }));
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 999 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: "-20px",
          width: 10, height: 10, borderRadius: "50%", background: p.color,
          animation: `fall 1.2s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0; } }`}</style>
    </div>
  );
}

function StarDisplay({ count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff9e6", border: "1.5px solid #f9c94a", borderRadius: 20, padding: "4px 14px" }}>
      <span style={{ fontSize: 18 }}>⭐</span>
      <span style={{ fontWeight: 700, fontSize: 16, color: "#b07d00" }}>{count}</span>
    </div>
  );
}

function CategoryCard({ cat, stars, onSelect }) {
  const unlocked = cat.unlocked || stars >= (cat.starsNeeded || 0);
  return (
    <div onClick={() => unlocked && onSelect(cat)} style={{
      background: unlocked ? cat.color : "#f0f0f0",
      borderRadius: 20, padding: "20px 16px", cursor: unlocked ? "pointer" : "not-allowed",
      textAlign: "center", border: "2px solid transparent",
      transition: "transform 0.15s, box-shadow 0.15s",
      position: "relative", overflow: "hidden",
      boxShadow: unlocked ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
      opacity: unlocked ? 1 : 0.7,
    }}
    onMouseEnter={e => unlocked && (e.currentTarget.style.transform = "translateY(-3px)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "none")}
    >
      <div style={{ fontSize: 36, marginBottom: 8 }}>{unlocked ? cat.emoji : "🔒"}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: unlocked ? cat.textColor : "#999" }}>{cat.name}</div>
      {!unlocked && <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>⭐ {cat.starsNeeded} stars to unlock</div>}
      {unlocked && <div style={{ fontSize: 12, color: cat.textColor, opacity: 0.7, marginTop: 4 }}>{cat.phrases.length} phrases</div>}
    </div>
  );
}

function PhraseCard({ phrase, onCorrect, onNext }) {
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      <div onClick={() => setFlipped(!flipped)} style={{
        background: flipped ? "#e8f9ef" : "#fff",
        border: `2px solid ${flipped ? "#7bc99a" : "#f0d6e8"}`,
        borderRadius: 24, padding: "40px 30px", cursor: "pointer",
        minHeight: 160, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "background 0.3s, border 0.3s",
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
      }}>
        <div style={{ fontSize: 13, color: "#bbb", marginBottom: 12, letterSpacing: 1 }}>
          {flipped ? "ENGLISH" : "GERMAN"}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: flipped ? "#2a6b44" : "#8b3a6a", lineHeight: 1.3 }}>
          {flipped ? phrase.en : phrase.de}
        </div>
        {!flipped && showHint && (
          <div style={{ marginTop: 12, fontSize: 13, color: "#999", fontStyle: "italic" }}>
            🔊 {phrase.hint}
          </div>
        )}
        {!flipped && (
          <div style={{ marginTop: 16, fontSize: 13, color: "#ccc" }}>tap to reveal</div>
        )}
      </div>

      {!flipped && (
        <button onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }} style={{
          marginTop: 12, background: "none", border: "1.5px solid #f0d6e8", borderRadius: 20,
          padding: "6px 18px", cursor: "pointer", fontSize: 13, color: "#c47a9a",
        }}>
          {showHint ? "hide hint" : "🔊 pronunciation hint"}
        </button>
      )}

      {flipped && (
        <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onNext} style={{
            background: "#f9c6d0", border: "none", borderRadius: 20,
            padding: "10px 24px", cursor: "pointer", fontSize: 15, color: "#8b3a4a", fontWeight: 600,
          }}>skip</button>
          <button onClick={onCorrect} style={{
            background: "#7bc99a", border: "none", borderRadius: 20,
            padding: "10px 24px", cursor: "pointer", fontSize: 15, color: "#fff", fontWeight: 600,
          }}>⭐ got it!</button>
        </div>
      )}
    </div>
  );
}

function QuizMode({ cat, onBack, onEarnStar }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * cat.phrases.length));
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mode, setMode] = useState("learn"); // learn or quiz

  const phrase = cat.phrases[idx];

  const makeChoices = (currentIdx) => {
    const correct = cat.phrases[currentIdx];
    const others = cat.phrases.filter((_, i) => i !== currentIdx);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, correct].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setChoices(makeChoices(idx));
    setSelected(null);
  }, [idx]);

  const nextPhrase = () => {
    const next = (idx + 1) % cat.phrases.length;
    setIdx(next);
    setSelected(null);
    setShowConfetti(false);
  };

  const handleChoice = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice.de === phrase.de) {
      setShowConfetti(true);
      onEarnStar();
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  return (
    <div>
      <Confetti show={showConfetti} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "none", border: "1.5px solid #f0d6e8", borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontSize: 14, color: "#c47a9a" }}>
          ← back
        </button>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#8b3a6a" }}>{cat.emoji} {cat.name}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setMode("learn")} style={{ background: mode === "learn" ? "#f9c6d0" : "none", border: "1.5px solid #f0d6e8", borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontSize: 13, color: "#8b3a4a" }}>flashcard</button>
          <button onClick={() => setMode("quiz")} style={{ background: mode === "quiz" ? "#c6d9f9" : "none", border: "1.5px solid #c6d9f9", borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontSize: 13, color: "#2c4a8b" }}>quiz</button>
        </div>
      </div>

      {mode === "learn" ? (
        <PhraseCard phrase={phrase} onCorrect={() => { onEarnStar(); setShowConfetti(true); setTimeout(() => { setShowConfetti(false); nextPhrase(); }, 800); }} onNext={nextPhrase} />
      ) : (
        <div>
          <div style={{ background: "#fff", border: "2px solid #f0d6e8", borderRadius: 24, padding: "36px 24px", textAlign: "center", marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 13, color: "#bbb", marginBottom: 10, letterSpacing: 1 }}>WHAT IS THIS IN GERMAN?</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#8b3a6a" }}>{phrase.en}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {choices.map((c, i) => {
              let bg = "#fff", border = "1.5px solid #f0d6e8", color = "#5a3a4a";
              if (selected) {
                if (c.de === phrase.de) { bg = "#e8f9ef"; border = "2px solid #7bc99a"; color = "#2a6b44"; }
                else if (c.de === selected.de) { bg = "#fce8e8"; border = "2px solid #e57373"; color = "#8b2a2a"; }
              }
              return (
                <button key={i} onClick={() => handleChoice(c)} style={{
                  background: bg, border, borderRadius: 16, padding: "14px 12px",
                  cursor: selected ? "default" : "pointer", fontSize: 15, color, fontWeight: 600,
                  transition: "all 0.2s", textAlign: "center",
                }}>
                  {c.de}
                </button>
              );
            })}
          </div>
          {selected && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              {selected.de === phrase.de
                ? <div style={{ color: "#2a6b44", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Wunderbar! ⭐</div>
                : <div style={{ color: "#8b2a2a", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Fast da! 💪 Keep going~</div>
              }
              <button onClick={nextPhrase} style={{ background: "#f9c6d0", border: "none", borderRadius: 20, padding: "10px 28px", cursor: "pointer", fontSize: 15, color: "#8b3a4a", fontWeight: 600 }}>
                next phrase →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [stars, setStars] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const earnStar = () => {
    setStars(s => s + 1);
  };

  const totalUnlocked = categories.filter(c => c.unlocked || stars >= (c.starsNeeded || 0)).length;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <Confetti show={showConfetti} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#8b3a6a", letterSpacing: -0.5 }}>German Quest 🌸</div>
          <div style={{ fontSize: 13, color: "#c47a9a", marginTop: 2 }}>{totalUnlocked} of {categories.length} topics unlocked</div>
        </div>
        <StarDisplay count={stars} />
      </div>

      {!selected ? (
        <>
          <div style={{ fontSize: 14, color: "#bbb", marginBottom: 14, letterSpacing: 0.5 }}>CHOOSE A TOPIC</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {categories.map(cat => (
              <CategoryCard key={cat.id} cat={cat} stars={stars} onSelect={setSelected} />
            ))}
          </div>
          <div style={{ marginTop: 28, background: "#fff9e6", border: "1.5px solid #f9c94a", borderRadius: 16, padding: "14px 18px", fontSize: 13, color: "#7a5a00" }}>
            ⭐ Earn stars by learning phrases — unlock new topics as you grow!
          </div>
        </>
      ) : (
        <QuizMode
          cat={{ ...selected, phrases: selected.phrases }}
          onBack={() => setSelected(null)}
          onEarnStar={earnStar}
        />
      )}
    </div>
  );
}
