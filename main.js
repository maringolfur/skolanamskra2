// ==========================================
// main.js - Skólanámskrá Vallaskóla
// ==========================================

if (!window.YEARS_DATA) window.YEARS_DATA = {};
if (!window.STAFF_DATA) window.STAFF_DATA = [];
var currentViewHistory = currentViewHistory || [];

// 1. Sækja starfsmannalista hvort sem hann er Array eða Object
function getStaffList() {
  if (!window.STAFF_DATA) return [];
  if (Array.isArray(window.STAFF_DATA)) return window.STAFF_DATA;
  if (typeof window.STAFF_DATA === 'object') return Object.values(window.STAFF_DATA);
  return [];
}

// 2. Staðla dálkaheiti starfsmanna
function normalizePerson(person) {
  if (!person) return { name: '', role: '', team: '' };
  return {
    name: person.Name || person.name || person.Nafn || person.nafn || '',
    role: person.Role || person.role || person.Hlutverk || person.hlutverk || person.Starf || person.starf || 'Starfsmaður',
    team: person.Team || person.team || person.Teams || person.teams || person.Teymi || person.teymi || ''
  };
}

// 3. Athuga hvort starfsmaður tilheyri árgangi
function isPersonInGrade(person, gradeId) {
  if (!person) return false;
  const cleanGrade = gradeId.replace('y', '').trim();
  const rawGrades = person.Grades || person.grades || person.grade || person.Bekkir || person.bekkir || person.Árgangar || person.árgangar;

  if (!rawGrades) return false;

  let gradeList = [];
  if (Array.isArray(rawGrades)) {
    gradeList = rawGrades.map(g => g.toString().trim());
  } else {
    gradeList = rawGrades.toString().split(/[\s,]+/).map(g => g.trim());
  }

  return gradeList.some(g => {
    const num = g.replace(/\D/g, '');
    return num === cleanGrade || g.toLowerCase() === gradeId.toLowerCase();
  });
}

// 4. Teikna starfsmenn sem hreinan lista (án kassa)
function createStaffListHtml(staffList) {
  if (!staffList || staffList.length === 0) return '';

  return staffList.map(p => {
    const person = normalizePerson(p);
    const teamText = person.team ? ` (${person.team})` : '';

    return `
      <li class="py-1 flex items-center justify-between text-slate-800 text-sm border-b border-slate-100 last:border-none">
        <span class="font-bold">${person.name}</span>
        <span class="text-slate-500 text-xs">${person.role}${teamText}</span>
      </li>
    `;
  }).join('');
}

// 5. Flokka og birta starfsfólk árgangsins (Kemur á undan námskrá)
function generateStaffSectionHtml(gradeId) {
  const allStaff = getStaffList();
  if (allStaff.length === 0) return '';

  const gradeStaff = allStaff.filter(person => isPersonInGrade(person, gradeId));
  if (gradeStaff.length === 0) return '';

  const supervisors = gradeStaff.filter(s => normalizePerson(s).role.toLowerCase().includes('umsjón'));
  const support = gradeStaff.filter(s => normalizePerson(s).role.toLowerCase().includes('stuðning'));
  
  const isamTeam = gradeStaff.filter(s => normalizePerson(s).team.toLowerCase().includes('ísam'));
  const staeNatTeam = gradeStaff.filter(s => {
    const t = normalizePerson(s).team.toLowerCase();
    return t.includes('stæ') || t.includes('nát');
  });
  const langTeam = gradeStaff.filter(s => normalizePerson(s).team.toLowerCase().includes('tungumál'));

  const stod = gradeStaff.filter(s => {
    const r = normalizePerson(s).role.toLowerCase();
    return r.includes('sérkenn') || r.includes('þroskaþjálf') || r.includes('ísa');
  });

  const management = gradeStaff.filter(s => {
    const r = normalizePerson(s).role.toLowerCase();
    return r.includes('stjórn') || r.includes('skólastj') || r.includes('deildarstj');
  });

  const excludeSet = new Set([...supervisors, ...support, ...isamTeam, ...staeNatTeam, ...langTeam, ...stod, ...management]);
  const otherTeachers = gradeStaff.filter(s => !excludeSet.has(s));

  const renderGroup = (title, icon, list) => {
    if (!list || list.length === 0) return '';
    return `
      <div class="mb-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>${icon}</span>${title
