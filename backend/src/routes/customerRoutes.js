import express from "express";
import fetchJiraData from "../utils/fetchJiraData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jqlQuery = `project in (DMS, ET, SSR, OPT, SS) AND issuetype = "Customer Issue" AND resolution = Unresolved`;
    const fields = "summary,customfield_18011,labels,customfield_16500,customfield_10300,fixVersions";
    const data = await fetchJiraData(jqlQuery, fields);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
