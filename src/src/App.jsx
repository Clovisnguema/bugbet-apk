import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "2005";
const STORAGE_KEY_ACCESS = "bugbet_access";
const STORAGE_KEY_DATA = "bugbet_data";

const defaultData = {
  weeklyCode: "BUGBET2024",
  codeExpiry: null,
  combines: [],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData;
  } catch { return defaultData; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
}

function getAccessInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCESS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setAccessInfo(info) {
  localStorage.setItem(STORAGE_KEY_ACCESS, JSON.stringify(info));
}

function isAccessValid(data) {
  const access = getAccessInfo();
  if (!access) return false;
  if (access.code !== data.weeklyCode) return false;
  if (data.codeExpiry && Date.now() > data.codeExpiry) return false;
  return true;
}

const CAPITAL_RANGES = [
  { label: "Petit capital (< 20€)", value: "small" },
  { label: "Moyen capital (20€ - 100€)", value: "medium" },
  { label: "Grand capital (> 100€)", value: "large" },
];

// ─── Access Screen ───────────────────────────────────────────────────────────

function AccessScreen({ onAccess, data }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (code === data.weeklyCode) {
      setAccessInfo({ code, timestamp: Date.now() });
      onAccess("member");
    } else if (code === ADMIN_PASSWORD) {
      onAccess("admin");
    } else {
      setError("Code incorrect. Contacte l'administrateur.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0A0F1E 0%, #0D1628 50%, #071020 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Rajdhani', sans-serif",
      padding: "24px",
      position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(0,255,136,0.3)} 50%{box-shadow:0 0 40px rgba(0,255,136,0.6)} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0F1E; }
        ::-webkit-scrollbar-thumb { background: #00FF88; border-radius: 2px; }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Glow orb */}
      <div style={{
        position: "absolute", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)",
        borderRadius: "50%", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", pointerEvents: "none"
      }} />

      <div style={{ animation: "fadeUp 0.6s ease", width: "100%", maxWidth: "380px", position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "80px", height: "80px", borderRadius: "20px",
            background: "linear-gradient(135deg, #00FF88, #00CC6A)",
            marginBottom: "16px", animation: "glow 3s ease-in-out infinite"
          }}>
            <span style={{ fontSize: "36px" }}>⚽</span>
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', monospace", fontSize: "32px",
            fontWeight: 900, color: "#00FF88", letterSpacing: "4px",
            textShadow: "0 0 30px rgba(0,255,136,0.5)"
          }}>BUGBET</h1>
          <p style={{ color: "#4A6A5A", fontSize: "13px", letterSpacing: "3px", marginTop: "6px" }}>
            ACCÈS PRIVÉ
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,255,136,0.15)",
          borderRadius: "20px", padding: "32px",
          backdropFilter: "blur(10px)"
        }}>
          <p style={{ color: "#8AAFA0", fontSize: "15px", marginBottom: "24px", textAlign: "center", lineHeight: 1.6 }}>
            Entre le code de la semaine pour accéder aux combinés
          </p>

          <div style={{
            animation: shake ? "shake 0.5s ease" : "none",
            marginBottom: "16px"
          }}>
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="CODE HEBDOMADAIRE"
              style={{
                width: "100%", padding: "16px 20px",
                background: "rgba(0,255,136,0.05)",
                border: `1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(0,255,136,0.2)"}`,
                borderRadius: "12px",
                color: "#00FF88", fontSize: "16px",
                fontFamily: "'Orbitron', monospace",
                letterSpacing: "3px", textAlign: "center",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#FF5050", fontSize: "13px", textAlign: "center", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button onClick={handleSubmit} style={{
            width: "100%", padding: "16px",
            background: "linear-gradient(135deg, #00FF88, #00CC6A)",
            border: "none", borderRadius: "12px",
            color: "#0A0F1E", fontSize: "16px", fontWeight: 700,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: "2px",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            ACCÉDER →
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#2A3A30", fontSize: "12px", marginTop: "24px", letterSpacing: "1px" }}>
          Code valable 7 jours · Bugbet © 2024
        </p>
      </div>
    </div>
  );
}

// ─── Member Screen ───────────────────────────────────────────────────────────

function MemberScreen({ data, onLogout }) {
  const [capital, setCapital] = useState("medium");
  const [selectedTab, setSelectedTab] = useState("today");

  const today = new Date().toDateString();
  const todayCombine = data.combines.find(c => new Date(c.date).toDateString() === today);
  const pastCombines = data.combines
    .filter(c => new Date(c.date).toDateString() !== today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getInstruction = (combine) => {
    if (!combine?.instructions) return null;
    return combine.instructions[capital] || combine.instructions.medium;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0A0F1E 0%, #0D1628 100%)",
      fontFamily: "'Rajdhani', sans-serif",
      color: "#E0F0E8",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(0,255,136,0.2)} 50%{box-shadow:0 0 40px rgba(0,255,136,0.4)} }
        input,textarea { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #00FF88; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(0,255,136,0.1)",
        padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)"
      }}>
        <h1 style={{
          fontFamily: "'Orbitron', monospace", fontSize: "20px",
          color: "#00FF88", letterSpacing: "3px",
          textShadow: "0 0 20px rgba(0,255,136,0.4)"
        }}>BUGBET</h1>
        <button onClick={onLogout} style={{
          background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)",
          borderRadius: "8px", color: "#FF5050", padding: "8px 16px",
          fontSize: "13px", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif"
        }}>
          Déconnexion
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>

        {/* Capital selector */}
        <div style={{
          background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)",
          borderRadius: "14px", padding: "16px", marginBottom: "20px"
        }}>
          <p style={{ fontSize: "12px", letterSpacing: "2px", color: "#4A7A5A", marginBottom: "10px" }}>
            TON CAPITAL
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CAPITAL_RANGES.map(r => (
              <button key={r.value} onClick={() => setCapital(r.value)} style={{
                padding: "8px 14px", borderRadius: "8px", fontSize: "13px",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                background: capital === r.value ? "linear-gradient(135deg, #00FF88, #00CC6A)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${capital === r.value ? "transparent" : "rgba(0,255,136,0.15)"}`,
                color: capital === r.value ? "#0A0F1E" : "#6A9A7A",
              }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "4px" }}>
          {[{ key: "today", label: "Combiné du jour" }, { key: "history", label: "Historique" }].map(t => (
            <button key={t.key} onClick={() => setSelectedTab(t.key)} style={{
              flex: 1, padding: "10px", borderRadius: "8px", border: "none",
              background: selectedTab === t.key ? "rgba(0,255,136,0.15)" : "transparent",
              color: selectedTab === t.key ? "#00FF88" : "#4A6A5A",
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: "1px",
              borderBottom: selectedTab === t.key ? "2px solid #00FF88" : "2px solid transparent"
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Today's combine */}
        {selectedTab === "today" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            {todayCombine ? (
              <div>
                {/* Combine card */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,200,100,0.04))",
                  border: "1px solid rgba(0,255,136,0.25)", borderRadius: "16px",
                  padding: "24px", marginBottom: "16px", animation: "glow 4s ease-in-out infinite"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#00FF88" }}>
                      COMBINÉ DU JOUR
                    </span>
                    <span style={{
                      background: todayCombine.result === "win" ? "rgba(0,255,136,0.2)" :
                        todayCombine.result === "loss" ? "rgba(255,80,80,0.2)" : "rgba(255,200,0,0.2)",
                      color: todayCombine.result === "win" ? "#00FF88" :
                        todayCombine.result === "loss" ? "#FF5050" : "#FFB800",
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700
                    }}>
                      {todayCombine.result === "win" ? "✅ GAGNÉ" :
                        todayCombine.result === "loss" ? "❌ PERDU" : "⏳ EN COURS"}
                    </span>
                  </div>

                  {/* Matches */}
                  {todayCombine.matches?.map((match, i) => (
                    <div key={i} style={{
                      background: "rgba(0,0,0,0.3)", borderRadius: "10px",
                      padding: "12px 16px", marginBottom: "8px",
                      borderLeft: "3px solid rgba(0,255,136,0.4)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: "#E0F0E8" }}>{match.teams}</span>
                        <span style={{
                          background: "rgba(0,255,136,0.15)", color: "#00FF88",
                          padding: "4px 10px", borderRadius: "6px",
                          fontFamily: "'Orbitron', monospace", fontSize: "14px", fontWeight: 700
                        }}>{match.cote}</span>
                      </div>
                      <span style={{ fontSize: "13px", color: "#4A7A5A", marginTop: "4px", display: "block" }}>
                        🎯 {match.pronostic}
                      </span>
                    </div>
                  ))}

                  {/* Total cote */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    background: "rgba(0,255,136,0.1)", borderRadius: "10px",
                    padding: "12px 16px", marginTop: "12px"
                  }}>
                    <span style={{ color: "#8AAFA0", fontSize: "14px", letterSpacing: "1px" }}>COTE TOTALE</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", color: "#00FF88", fontSize: "18px", fontWeight: 700 }}>
                      {todayCombine.matches?.reduce((acc, m) => (acc * parseFloat(m.cote || 1)).toFixed(2), 1)}
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div style={{
                  background: "rgba(255,200,0,0.05)", border: "1px solid rgba(255,200,0,0.2)",
                  borderRadius: "16px", padding: "20px"
                }}>
                  <p style={{ fontSize: "11px", letterSpacing: "3px", color: "#FFB800", marginBottom: "12px" }}>
                    💡 INSTRUCTIONS POUR TON CAPITAL
                  </p>
                  <p style={{ fontSize: "16px", color: "#E0D0A0", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                    {getInstruction(todayCombine) || "Aucune instruction disponible."}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                background: "rgba(255,255,255,0.02)", borderRadius: "16px",
                border: "1px dashed rgba(0,255,136,0.1)"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#4A6A5A", fontSize: "16px" }}>
                  Le combiné du jour n'est pas encore publié.
                </p>
                <p style={{ color: "#2A3A30", fontSize: "13px", marginTop: "8px" }}>
                  Reviens plus tard !
                </p>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {selectedTab === "history" && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            {pastCombines.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ color: "#4A6A5A" }}>Aucun historique disponible.</p>
              </div>
            ) : (
              pastCombines.map((c, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,136,0.1)",
                  borderRadius: "12px", padding: "16px", marginBottom: "12px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#4A7A5A", fontSize: "13px" }}>
                      {new Date(c.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                    <span style={{
                      background: c.result === "win" ? "rgba(0,255,136,0.15)" : c.result === "loss" ? "rgba(255,80,80,0.15)" : "rgba(255,200,0,0.15)",
                      color: c.result === "win" ? "#00FF88" : c.result === "loss" ? "#FF5050" : "#FFB800",
                      padding: "2px 10px", borderRadius: "20px", fontSize: "12px"
                    }}>
                      {c.result === "win" ? "✅ GAGNÉ" : c.result === "loss" ? "❌ PERDU" : "⏳"}
                    </span>
                  </div>
                  {c.matches?.map((m, j) => (
                    <p key={j} style={{ fontSize: "14px", color: "#8AAFA0", marginBottom: "4px" }}>
                      • {m.teams} — <span style={{ color: "#00FF88" }}>{m.cote}</span> — {m.pronostic}
                    </p>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Screen ────────────────────────────────────────────────────────────

function AdminScreen({ data, onSave, onLogout }) {
  const [weeklyCode, setWeeklyCode] = useState(data.weeklyCode);
  const [combines, setCombines] = useState(data.combines);
  const [tab, setTab] = useState("publish");
  const [saved, setSaved] = useState(false);

  // New combine form
  const [matches, setMatches] = useState([{ teams: "", cote: "", pronostic: "" }]);
  const [instrSmall, setInstrSmall] = useState("");
  const [instrMedium, setInstrMedium] = useState("");
  const [instrLarge, setInstrLarge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const addMatch = () => setMatches([...matches, { teams: "", cote: "", pronostic: "" }]);
  const removeMatch = (i) => setMatches(matches.filter((_, idx) => idx !== i));
  const updateMatch = (i, field, val) => {
    const updated = [...matches];
    updated[i][field] = val;
    setMatches(updated);
  };

  const publishCombine = () => {
    const newCombine = {
      id: Date.now(),
      date: new Date().toISOString(),
      matches: matches.filter(m => m.teams),
      instructions: { small: instrSmall, medium: instrMedium, large: instrLarge },
      result: "pending"
    };
    const updated = [...combines.filter(c => new Date(c.date).toDateString() !== new Date().toDateString()), newCombine];
    setCombines(updated);
    onSave({ ...data, weeklyCode, combines: updated });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setMatches([{ teams: "", cote: "", pronostic: "" }]);
    setInstrSmall(""); setInstrMedium(""); setIn
