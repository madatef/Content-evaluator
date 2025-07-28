import google from 'googleapis';
import { getUserTokens, updateLastRow } from './your-db-utils'; // change this as needed

// On Spreadsheet new row




// Main polling function
async function pollUserSheets(userId, spreadsheetId, SHEET_NAME) {
  // 1. Fetch stored OAuth tokens and last processed row
  {  const { access_token, lastProcessedRow } = await getUserTokens(userId); //change this to use the db

    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token});


    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: SHEET_NAME
      });

      const rows = res.data.values;
      if (!rows || rows.length <= lastProcessedRow) {
        console.log(`[User ${userId}] No new rows.`);
        return;
      }
      const newRows = rows.slice(lastProcessedRow); {
        const newRows2 = []
        newRows.forEach((row, index) => {
          console.log(`New row ${lastProcessedRow + index + 1}:`, row);
          newRows.push(`row number ${index}: ${row}`)
        });
        "The spreadsheet new rows are: " + JSON.stringify(newRows2)
        // call user agent route or workflow
      }

      // 3. Update the DB with new lastProcessedRow
      await updateLastRow(userId, spreadsheetId, rows.length);
    } catch (err) {
      console.error(`[User ${userId}] Error polling sheet:`, err.message);
    }
  }}
