window.STAFF_MEMBERS = window.STAFF_MEMBERS || {};

// Búum til biðvísun svo main.js viti hvenær gögnin eru tilbúin
let resolveStaffLoaded;
window.STAFF_LOADED_PROMISE = new Promise((resolve) => {
  resolveStaffLoaded = resolve;
});

const CSV_URL = 'staff.csv'; 

// Fall sem greinir og skiptir línum óháð því hvort notað er komma, semíkomma eða tab
function parseCSVLine(line, delimiter = ',') {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === delimiter && !inQuotes) {
      result.push(cur.replace(/^"|"$/g, '').trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.replace(/^"|"$/g, '').trim());
  return result;
}

function parseStaffCSV(csvText) {
  // Skiptum línunum og hreinsum
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return {};

  // Sjálfvirk greining á aðskilnaðartákni (semíkomma, komma eða tab)
  let delimiter = ',';
  if (lines[0].includes(';')) delimiter = ';';
  else if (lines[0].includes('\t')) delimiter = '\t';

  const headers = parseCSVLine(lines[0], delimiter).map(h => h.toLowerCase().replace(/^\uFEFF/, ''));
  const staffMap = {};

  for (let i = 1; i < lines.length; i++) {
    const cleanRow = parseCSVLine(lines[i], delimiter);
    const rowData = {};
    headers.forEach((header, idx) => {
      rowData[header] = cleanRow[idx] || '';
    });

    const getVal = (...keys) => {
      for (const k of keys) {
        if (rowData[k] !== undefined && rowData[k] !== null && String(rowData[k]).trim() !== '') {
          return String(rowData[k]).trim();
        }
      }
      return '';
    };

    const name = getVal('full_name', 'nafn', 'name');
    if (!name) continue;

    const id = name.toLowerCase()
      .replace(/á/g, 'a').replace(/ð/g, 'd').replace(/é/g, 'e')
      .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
      .replace(/ý/g, 'y').replace(/þ/g, 'th').replace(/æ/g, 'ae').replace(/ö/g, 'o')
      .replace(/[^a-z0-9]/g, '_');

    const rawTeam = getVal('teymi', 'team', 'flokkur', 'category').toLowerCase();
    
    // Staðling á teymum (taka við öllum afbrigðum eins og 'sport', 'sports', 'stae', 'isam' o.s.frv.)
    let teamNormalized = '';
    if (rawTeam.includes('sport') || rawTeam.includes('íþrótt') || rawTeam.includes('ithrott')) {
      teamNormalized = 'sports';
    } else if (rawTeam.includes('logv') || rawTeam.includes('list') || rawTeam.includes('verk')) {
      teamNormalized = 'logv';
    } else if (rawTeam.includes('stae') || rawTeam.includes('stæ') || rawTeam.includes('nat') || rawTeam.includes('nát')) {
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
      role: getVal('role', 'starf', 'staða', 'stada', 'titill'),
      email: getVal('email', 'netfang'),
      img: getVal('img', 'mynd', 'photo', 'image'),
      grades: getVal('grades', 'árgangar', 'argangar', 'árgangur', 'argangur', 'bekkir', 'bekkur', 'years'),
      team: teamNormalized,
      category: getVal('category', 'flokkur')
    };
  }

  return staffMap;
}

async function loadStaffData() {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error(`HTTP villa: ${response.status}`);
    const csvText = await response.text();
    window.STAFF_MEMBERS = parseStaffCSV(csvText);
    console.log('Starfsmannalisti hlaðinn úr CSV:', window.STAFF_MEMBERS);
  } catch (err) {
    console.error('Tókst ekki að hlaða staff.csv:', err);
  } finally {
    if (resolveStaffLoaded) resolveStaffLoaded(window.STAFF_MEMBERS);
  }
}

loadStaffData();
