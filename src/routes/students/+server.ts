import { json, error, type RequestHandler } from '@sveltejs/kit';
import { writeToSheet, readSheet } from '$lib/googleSheets';

export const GET = (async ({ url }) => {
	const code = url.searchParams.get('code');
	const sheetFrom = url.searchParams.get('sheetFrom');
	const sheetTo = url.searchParams.get('sheetTo');
	if (!code) return error(400, 'Insert code');
	if (!sheetFrom) return error(400, 'Insert sheetFrom');
	if (!sheetTo) return error(400, 'Insert sheetTo');

	let found = false;
	let inOriginalSheet = false;

	// Check if the code in the original sheet
	const studentsDataSheetFrom = await readSheet(sheetFrom);
	if (!studentsDataSheetFrom) return error(500, 'Found no students');
	for (const student of studentsDataSheetFrom) {
		if (code === student[0]) {
			inOriginalSheet = true;
		}
	}

	// Check if code is already in the to-sheet
	let studentsDataSheetTo = await readSheet(sheetTo);
	if (!studentsDataSheetTo) studentsDataSheetTo = [];

	for (const student of studentsDataSheetTo) {
		if (code == student[0]) {
			found = true;
		}
	}
	return json({ found, inOriginalSheet }, { status: 200 });
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	// Store code
	const { code, sheetTo, sheetFrom } = await request.json();

	// else added to the sheet
	let studentData: any[] = [];

	const studentsData = await readSheet(sheetFrom);
	if (!studentsData) return error(500, 'Found no students');

	for (const student of studentsData) {
		if (code === student[2]) {
			studentData = student;
		}
	}

	if (!studentData) return error(500, 'Found no students');
	await writeToSheet(sheetTo, [studentData]);

	return json({ message: 'Success', statusCode: 201 }, { status: 201 });
}) satisfies RequestHandler;
