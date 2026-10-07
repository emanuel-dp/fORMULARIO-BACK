const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuario.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
