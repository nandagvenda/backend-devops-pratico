import "dotenv/config";
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes";
import authRoute from "./routes/authRoute";
import { connectDatabase } from "./config/database";

import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./config/swagger";

const app = express();
const PORT = 3002;

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoute);
app.use("/api/usuarios", usuarioRoutes);

const startServer = async ()=> {
    await connectDatabase()
    app.listen(PORT, () => { console.log("servidor rodando") });
};

startServer();
