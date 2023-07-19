import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const token = process.env.TOKEN;

router.get('/', async (req, res) => {
  try {
    const jqlQuery = `project in (DMS, ET, SSR, OPT, SS) AND issuetype in ("Customer Issue", Defect, Task, Sub-Task, Sub-Task) and resolution = Unresolved and "Defect Flags" = "Security Impact"`;
    const jqlQueryEncoded = encodeURIComponent(jqlQuery);

    const response = await fetch(
      `https://product-jira.ariba.com/rest/api/2/search?jql=${jqlQueryEncoded}&fields=total`,
      {
        headers: {
          Authorization:`${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const { total } = await response.json();

    const responseFinal = await fetch(
      `https://product-jira.ariba.com/rest/api/2/search?jql=${jqlQueryEncoded}&startAt=0&maxResults=${total}&fields=summary,created,labels,customfield_16500,fixVersions`,
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
