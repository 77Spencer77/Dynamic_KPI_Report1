import express from "express";
import fetchJiraData from "../utils/fetchJiraData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jqlQuery = `project in (DMS, ET, SSR, OPT, SS) AND issuetype in ("Customer Issue", Defect, Task, Sub-Task, Sub-Task) and resolution = Unresolved and "Defect Flags" = "Security Impact"`;
    const fields = "summary,created,labels,customfield_16500,fixVersions";
    const data = await fetchJiraData(jqlQuery, fields);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
