import { google } from 'googleapis';
import creds from '../../sheets-creds.json';

// Initializes the Google APIs client library and sets up the authentication using service account credentials.
const auth = new google.auth.GoogleAuth({
	credentials: {
		project_id: creds.project_id,
		private_key_id: creds.private_key_id,
		private_key: creds.private_key,
		client_email: creds.client_email,
		client_id: creds.client_id,
		type: creds.type,
		universe_domain: creds.universe_domain
	},
	scopes: ['https://www.googleapis.com/auth/spreadsheets'] // Scope for Google Sheets API.
});

// Asynchronous function to write data to a Google Sheet.
export async function writeToSheet(spreadsheetId: string, values: string[][]) {
	const sheets = google.sheets({ version: 'v4', auth }); // Creates a Sheets API client instance.
	// const spreadsheetId = '1XAlXxIBHaP7fS0QQX5EJQlQTmj2NFkQkevHgnL2vfa0'; // The ID of the spreadsheet.
	const range = 'Sheet1!A1'; // The range in the sheet where data will be written.
	const valueInputOption = 'USER_ENTERED'; // How input data should be interpreted.

	try {
		const res = await sheets.spreadsheets.values.append({
			spreadsheetId,
			range,
			valueInputOption,
			requestBody: { values }
		});
		return res; // Returns the response from the Sheets API.
	} catch (error) {
		console.error('error', error); // Logs errors.
	}
}

// Asynchronous function to read data from a Google Sheet.
export async function readSheet(spreadsheetId: string) {
	const sheets = google.sheets({ version: 'v4', auth });
	const range = 'Sheet1!A:G'; // Specifies the range to read.

	try {
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range
		});
		// const rows = response.data.values; // Extracts the rows from the response.
		return response.data.values; // Returns the rows.
	} catch (error) {
		console.error('error', error); // Logs errors.
	}
}
