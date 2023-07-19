import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const token = process.env.TOKEN;

router.get('/', async (req, res) => {
  try {
    const jqlQuery = `((cf[16206] ~ "Strategic Sourcing" OR cf[16206] ~ "Direct Materials Sourcing" OR cf[16206] ~ "Optimization Micro Service" OR cf[16206] ~ eTendering) OR (issuetype = Incident and project in (SS, SSR, DMS, OPT, eTendering)))`;
    const jqlQueryEncoded = encodeURIComponent(jqlQuery);

    const response = await fetch(
      `https://product-jira.ariba.com/rest/api/2/search?jql=${jqlQueryEncoded}&fields=total`,
      {
        headers: {
          Authorization: `${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const { total } = await response.json();

    const responseFinal = await fetch(
      `https://product-jira.ariba.com/rest/api/2/search?jql=${jqlQueryEncoded}&startAt=0&maxResults=${total}&fields=summary,labels,created,customfield_16500,fixVersions,priority,status`,
      {
        headers: {
          Authorization: `${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await responseFinal.json();

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
