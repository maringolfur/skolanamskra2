const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vToQpJVXb0TnK2HUYyF1tFjFhBuyuLuMRaRWIwe54pfn395eafLrCp1X_paHR_qSOPxItlGB1apm8bF/pub?output=csv';

window.STAFF_MEMBERS = {};

async function loadStaffFromGoogleSheets() {
  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL);
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return;

    // Sækjum dálkaheiti úr efstu línu og hreinsum gæsalappir
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    window.STAFF_MEMBERS = {};

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      if (row.id) {
        window.STAFF_MEMBERS[row.id] = {
          name: row.full_name,
          role: row.role,
          category: row.category,
          email: row.email,
          img: row.img || 'placeholder.jpg',
          grades: row.grades
        };
      }
    }
    console.log('Starfsmannalisti uppfærður úr Google Sheets!', window.STAFF_MEMBERS);
  } catch (error) {
    console.error('Tókst ekki að sækja starfsmannalista úr Google Sheets:', error);
  }
}

// Sækjum gögnin strax þegar skráin hleðst
loadStaffFromGoogleSheets();
