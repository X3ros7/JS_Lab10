import { config } from "dotenv";
import app from "./app.js";

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server's running at http://localhost:${PORT}`);
});
