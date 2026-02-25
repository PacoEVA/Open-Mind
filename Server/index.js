import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pool from "./dbconfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/api/aprendizaje", async (req, res) => {
  const query = "SELECT * FROM aprendizaje";
  const resultado = await pool.query(query);
  return res.json(resultado.rows);
});

app.post("/api/aprendizaje", async (req, res) => {
  const { titulo, descripcion } = req.body;
  const query =
    "INSERT INTO aprendizaje (titulo, descripcion, fecha) VALUES ($1, $2, $3) RETURNING *";
  const values = [titulo, descripcion, new Date()];
  const resultado = await pool.query(query, values);
  return res.json(resultado.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
