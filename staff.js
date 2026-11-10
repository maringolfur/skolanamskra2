window.STAFF_MEMBERS = window.STAFF_MEMBERS || {};

// Slóð á CSV skrána (Google Sheets export eða staðbundin .csv skrá)
const CSV_URL = 'staff.csv'; 

function parseStaffCSV(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return {};

  // Greinum yfirskriftir (headers) úr fyrstu línu
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
  const staffMap = {};

  for (let i = 1; i < lines.length; i++) {
    // Skiptum línu í dálka (tekur tillit til kommu innan gæsalappa)
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const cleanRow = row.map(cell => cell ? cell.replace(/^"|"$/g, '').trim() : '');

    const rowData = {};
    headers.forEach((header, idx) => {
      rowData[header] = cleanRow[idx] || '';
    });

    const name = rowData['nafn'] || rowData['name'] || rowData['full_name'] || '';
    if (!name) continue;

    // Búum til lykil fyrir starfsmann
    const id = name.toLowerCase()
      .replace(/á/g, 'a').replace(/ð/g, 'd').replace(/é/g, 'e')
      .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
      .replace(/ý/g, 'y').replace(/þ/g, 'th').replace(/æ/g, 'ae').replace(/ö/g, 'o')
      .replace(/[^a-z0-9]/g, '_');

    // Lesum gildin úr CSV dálkunum
    const rawTeam = (rowData['teymi'] || rowData['team'] || rowData['flokkur'] || '').toLowerCase();
    
    // Staðling á teymum fyrir 8.–10. bekk: stae, isam, tungumal
    let teamNormalized = '';
    if (rawTeam.includes('stae') || rawTeam.includes('stæ') || rawTeam.includes('nat') || rawTeam.includes('nát')) {
      teamNormalized = 'stae';
    } else if (rawTeam.includes('isam') || rawTeam.includes('ísam')) {
      teamNormalized = 'isam';
    } else if (rawTeam.includes('tungumal') || rawTeam.includes('mál') || rawTeam.includes('tungumál')) {
      teamNormalized = 'tungumal';
    } else {
      teamNormalized = rawTeam;
    }

    staffMap[id] = {
      name: name,
      role: rowData['starf'] || rowData['role'] || rowData['staða'] || rowData['titill'] || '',
      email: rowData['netfang'] || rowData['email'] || '',
      img: rowData['mynd'] || rowData['img'] || rowData['photo'] || '',
      grades: rowData['árgangar'] || rowData['argangar'] || rowData['grades'] || rowData['bekkir'] || '',
      team: teamNormalized,
      category: rowData['flokkur'] || rowData['category'] || ''
    };
  }

  return staffMap;
}

// Sækir og vinnur CSV skrána
async function loadStaffData() {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    window.STAFF_MEMBERS = parseStaffCSV(csvText);
    console.log('Starfsmannalisti hlaðinn úr CSV:', window.STAFF_MEMBERS);
  } catch (err) {
    console.error('Tókst ekki að hlaða staff.csv:', err);
  }
}

loadStaffData();
