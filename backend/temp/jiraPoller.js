const axios = require('axios');
require('dotenv').config();

// const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL;
// const OAUTH_CODE = process.env.OAUTH_CODE;
// const PROJECT_KEY = process.env.PROJECT_KEY;
// const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL_SECONDS) * 1000;

let accessToken = null;
let cloudId = null;
let lastPolledTime = new Date(Date.now() - 5 * 60 * 1000); // Start 5 min ago

async function authenticate() {
  const url = `${FASTAPI_BASE_URL}/auth/callback?code=${OAUTH_CODE}`;
  const { data } = await axios.get(url);
  accessToken = data.access_token;
  cloudId = data.cloud_id;
  console.log('✅ Authenticated. Cloud ID:', cloudId);
}

async function pollJira(cloudId, projectKey, lastPolledTime, accessToken) {
  const baseUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;
  const jql = `project = ${projectKey} AND updated >= "${formatDate(lastPolledTime)}"`;

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      params: {
        jql,
        fields: 'summary,status,updated',
        maxResults: 50,
      },
    });

    const issues = response.data.issues;
    console.log(`🔍 Found ${issues.length} updated issues`);
    issues.forEach(issue => {
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
    });

    lastPolledTime = new Date(); // Update for next poll
  } catch (err) {
    console.error('❌ Polling error:', err.response?.data || err.message);
  }
}

function formatDate(date) {
  return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

async function startPolling(pollInterval) { //arg: polling interval in minutes
  await authenticate();
  setInterval(pollJira(cloudId, prjectKey, lastPolledTime, accessToken), pollInterval * 1000 * 60);
}

startPolling(5); // 5 minutes or change as per user's choice in the frontend
