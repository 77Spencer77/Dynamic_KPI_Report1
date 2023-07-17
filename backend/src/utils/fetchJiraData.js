import fetch from "node-fetch";
import NodeCache from "node-cache";

const cache = new NodeCache();

async function fetchJiraData(jqlQuery, fields) {
  const cacheKey = `${jqlQuery}-${fields}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Data fetched from cache");
    return cachedData;
  }

  const jqlEncoded = encodeURIComponent(jqlQuery);
  const response = await fetch(
    `https://product-jira.ariba.com/rest/api/2/search?jql=${jqlEncoded}&fields=${fields}`,
    {
      headers: {
        Authorization: `Basic STU4ODE3MzpTeWhiZ3Zmamlsb0A2ODQy`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  cache.set(cacheKey, data, 60); // Cache data for 60 seconds
  console.log("Data fetched from Jira");
  return data;
}

export default fetchJiraData;
