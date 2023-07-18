import express from "express";
import fetchJiraData from "../utils/fetchJiraData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jqlQuery = `issuetype = Incident and "CIRS Responsible Team" in (Sourcing, "Direct Materials", "Industry Sourcing", E-Tendering)`;
    const fields = "summary,labels,customfield_17842,customfield_14907,customfield_14910,customfield_21602,status";
    const data = await fetchJiraData(jqlQuery, fields);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
