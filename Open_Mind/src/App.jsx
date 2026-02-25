import { useState } from "react";
import Aprendizaje from "./pages/Aprendizaje";
import "./styles/App.css";

export default function App() {
  const [vista, setVista] = useState("nuevo");

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-icon">🧠</span>
          <h1 className="logo-title">OpenMind</h1>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${vista === "nuevo" ? "active" : ""}`}
            onClick={() => setVista("nuevo")}
          >
            <span className="nav-icon">✏️</span>
            Nuevo Aprendizaje
          </button>
          <button
            className={`nav-btn ${vista === "historial" ? "active" : ""}`}
            onClick={() => setVista("historial")}
          >
            <span className="nav-icon">📚</span>
            Mis Aprendizajes
          </button>
        </nav>
      </header>

      <main className="app-main">
        <Aprendizaje vista={vista} />
      </main>

      <footer className="app-footer">
        <p>Cada día aprendes algo nuevo 💡</p>
      </footer>
    </div>
  );
}
