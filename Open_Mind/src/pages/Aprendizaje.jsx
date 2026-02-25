import { useState, useEffect, useRef } from "react";
import { postData, getData } from "../../Api";

// ─── Formulario ──────────────────────────────────────────────────────────────
function FormAprendizaje() {
  const [form, setForm] = useState({ titulo: "", descripcion: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.descripcion.trim()) return;

    setStatus("loading");
    try {
      await postData(form);
      setStatus("success");
      setMensaje("¡Aprendizaje guardado con éxito! 🎉");
      setForm({ titulo: "", descripcion: "" });
    } catch {
      setStatus("error");
      setMensaje("Ocurrió un error al guardar. Intenta de nuevo.");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setMensaje("");
      }, 3500);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">¿Qué aprendiste hoy?</h2>
        <p className="form-subtitle">Registra tu aprendizaje del día</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            className="field-input"
            placeholder="Ej: Hooks en React"
            value={form.titulo}
            onChange={handleChange}
            maxLength={35}
            required
          />
          <span className="field-counter">{form.titulo.length}/35</span>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="field-textarea"
            placeholder="Describe lo que aprendiste con detalle..."
            value={form.descripcion}
            onChange={handleChange}
            maxLength={250}
            rows={5}
            required
          />
          <span className="field-counter">{form.descripcion.length}/250</span>
        </div>

        <button
          type="submit"
          className={`submit-btn ${status === "loading" ? "loading" : ""}`}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <span className="btn-spinner" />
          ) : (
            "Guardar Aprendizaje"
          )}
        </button>

        {mensaje && (
          <div className={`toast ${status === "success" ? "toast-success" : "toast-error"}`}>
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
}

// ─── Carousel ────────────────────────────────────────────────────────────────
function Carrusel() {
  const [entradas, setEntradas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [animDir, setAnimDir] = useState(""); // "left" | "right"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Touch / drag
  const touchStartX = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getData();
        // Ordenar del más reciente al más antiguo
        const ordenados = [...data].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setEntradas(ordenados);
        setIndice(0);
      } catch {
        setError("No se pudieron cargar los aprendizajes.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const navegar = (direccion) => {
    if (direccion === "prev" && indice > 0) {
      setAnimDir("right");
      setTimeout(() => {
        setIndice((i) => i - 1);
        setAnimDir("");
      }, 220);
    } else if (direccion === "next" && indice < entradas.length - 1) {
      setAnimDir("left");
      setTimeout(() => {
        setIndice((i) => i + 1);
        setAnimDir("");
      }, 220);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navegar(diff > 0 ? "next" : "prev");
    touchStartX.current = null;
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="carousel-state">
        <div className="loader" />
        <p>Cargando aprendizajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel-state">
        <span className="state-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (entradas.length === 0) {
    return (
      <div className="carousel-state">
        <span className="state-icon">📭</span>
        <p>Aún no tienes aprendizajes registrados.</p>
        <p className="state-hint">¡Empieza hoy con el primero!</p>
      </div>
    );
  }

  const entrada = entradas[indice];

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">Mis Aprendizajes</h2>
        <p className="carousel-subtitle">
          {indice + 1} de {entradas.length}
        </p>
      </div>

      <div className="carousel-stage">
        {/* Botón anterior */}
        <button
          className={`carousel-arrow arrow-left ${indice === 0 ? "disabled" : ""}`}
          onClick={() => navegar("prev")}
          disabled={indice === 0}
          aria-label="Anterior"
        >
          ‹
        </button>

        {/* Tarjeta */}
        <div
          className={`carousel-card ${animDir ? `slide-${animDir}` : ""}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card-date">
            <span className="date-dot" />
            {formatFecha(entrada.fecha)}
          </div>
          <h3 className="card-titulo">{entrada.titulo}</h3>
          <p className="card-descripcion">{entrada.descripcion}</p>
        </div>

        {/* Botón siguiente */}
        <button
          className={`carousel-arrow arrow-right ${
            indice === entradas.length - 1 ? "disabled" : ""
          }`}
          onClick={() => navegar("next")}
          disabled={indice === entradas.length - 1}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {entradas.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === indice ? "dot-active" : ""}`}
            onClick={() => {
              setAnimDir(i > indice ? "left" : "right");
              setTimeout(() => {
                setIndice(i);
                setAnimDir("");
              }, 220);
            }}
            aria-label={`Ir al aprendizaje ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Aprendizaje({ vista }) {
  return vista === "nuevo" ? <FormAprendizaje /> : <Carrusel />;
}
