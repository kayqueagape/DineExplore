import e from "express";
import dbfiles from "./db/database.js";

const app = e();

// Middleware para JSON (comum em APIs)
app.use(e.json());

// Função para iniciar o servidor após conectar ao banco
const startServer = async () => {
  await dbfiles(); 
  
};

startServer();

export default app;