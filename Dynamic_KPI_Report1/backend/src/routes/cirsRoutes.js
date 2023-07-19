import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const token = process.env.TOKEN;

router.get('/', async (req, res) => {
  try {
    const jqlQuery = `issuetype = Incident and "CIRS Responsible Team" in (Sourcing, "Direct Materials", "Industry Sourcing", E-Tendering)`;
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
      `https://product-jira.ariba.com/rest/api/2/search?jql=${jqlQueryEncoded}&startAt=0&maxResults=${total}&fields=summary,labels,customfield_17842,customfield_14907,customfield_14910,customfield_21602,status,customfield_10604`,
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
