import express from "express";
import fetchJiraData from "../utils/fetchJiraData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jqlQuery = `((cf[16206] ~ "Strategic Sourcing" OR cf[16206] ~ "Direct Materials Sourcing" OR cf[16206] ~ "Optimization Micro Service" OR cf[16206] ~ eTendering) OR (issuetype = Incident and project in (SS, SSR, DMS, OPT, eTendering)))`;
    const fields = "summary,labels,created,customfield_16500,fixVersions,priority,status";
    const data = await fetchJiraData(jqlQuery, fields);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
