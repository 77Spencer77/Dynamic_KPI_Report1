import express from "express";
import cors from "cors";
import path from "path";
import customerRoutes from "./routes/customerRoutes.js";
import defectRoutes from "./routes/defectRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import cirsRoutes from "./routes/cirsRoutes.js";
import regressionRoutes from "./routes/regressionRoutes.js";

const app = express();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use("/getProjectsCustomerData", customerRoutes);
app.use("/getProjectsDefectData", defectRoutes);
app.use("/getProjectsSecurityData", securityRoutes);
app.use("/getProjectCIRSdata", cirsRoutes);
app.use("/getProjectsRegressionData", regressionRoutes);

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
