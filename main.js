let currentViewHistory = [];

// ==================== VISIBILITY & NAVIGATION ====================

function hideAllViews() {
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('yearsView').classList.add('hidden');
  document.getElementById('subjectsView').classList.add('hidden');
  document.getElementById('detailView').classList.add('hidden');
}

function showHome() {
  hideAllViews();
  currentViewHistory = ['home'];
  document.getElementById('homeView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function showYears() {
  hideAllViews();
  currentViewHistory.push('years');
  renderYearsGrid();
  document.getElementById('yearsView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function showSubjects() {
  hideAllViews();
  currentViewHistory.push('subjects');
  renderSubjectsGrid();
  document.getElementById('subjectsView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function openDetailView(title, icon, contentHtml) {
  hideAllViews();
  document.getElementById('detailIcon').innerText = icon;
  document.getElementById('detailTitle').innerText = title;
  document.getElementById('detailContent').innerHTML = contentHtml;
  document.getElementById('detailView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function goBackFromDetail() {
  if (currentViewHistory.length > 1) {
    currentViewHistory.pop();
    const lastView = currentViewHistory[currentViewHistory.length - 1];
    if (lastView === 'subjects') showSubjects();
    else if (lastView === 'years') showYears();
    else showHome();
  } else {
    showHome();
  }
}

// ==================== GRID RENDERING ====================

function renderYearsGrid() {
  const container = document.getElementById('yearsGrid');
  if (!container || !window.YEARS_LIST) return;

  container.innerHTML = YEARS_LIST.map(item => `
    <button onclick="openYearDetail('${item.id}')" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-sky-600 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
      <span class="text-4xl group-hover:scale-110 transition duration-200">${item.icon}</span>
      <span class="text-sm font-bold text-slate-800 group-hover:text-sky-700">${item.title}</span>
    </button>
  `).join('');
}

function renderSubjectsGrid() {
  const container = document.getElementById('subjectsGrid');
  if (!container || !window.SUBJECTS_TREE) return;

  container.innerHTML = SUBJECTS_TREE.map(item => `
    <button onclick="handleSubjectClick('${item.id}')" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-amber-600 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
      <span class="text-4xl group-hover:scale-110 transition duration-200">${item.icon}</span>
      <span class="text-sm font-bold text-slate-800 group-hover:text-amber-700">${item.title}</span>
    </button>
  `).join('');
}

// ==================== DÁLKA- OG HELPER FALL ====================

function getStaffProp(p, ...keys) {
  if (!p) return '';
  for (const key of keys) {
    if (p[key] !== undefined && p[key] !== null && String(p[key]).trim() !== '') {
      return String(p[key]).trim();
    }
    const foundKey = Object.keys(p).find(k => k.toLowerCase().trim() === key.toLowerCase().trim());
    if (foundKey && p[foundKey] !== undefined && p[foundKey] !== null && String(p[foundKey]).trim() !== '') {
      return String(p[foundKey]).trim();
    }
  }
  return '';
}

function isStaffInYear(p, yearId) {
  const rawGrades = getStaffProp(p, 'grades', 'argangar', 'árgangar', 'bekkir', 'bekkur', 'years').toLowerCase();
  if (!rawGrades) return false;

  const numMatch = yearId.match(/\d+/);
  const targetNum = numMatch ? parseInt(numMatch[0], 10) : null;

  if (rawGrades.includes('allir') || rawGrades.includes('1-10') || rawGrades.includes('y1-y10')) {
    return true;
  }

  if (rawGrades.includes(yearId.toLowerCase())) {
    return true;
  }

  if (targetNum !== null) {
    const rangeMatches = rawGrades.matchAll(/(\d+)\s*-\s*(\d+)/g);
    for (const match of rangeMatches) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);
      if (targetNum >= start && targetNum <= end) {
        return true;
      }
    }

    const numbers = rawGrades.split(/[^\d]+/).map(n => parseInt(n, 10)).filter(n => !isNaN(n));
    if (numbers.includes(targetNum)) {
      return true;
    }
  }

  return false;
}

// Stjórnendaröðun: 1. Skólastjóri -> 2. Aðstoðarskólastjóri -> 3. Deildarstjóri -> 4. Verkefnastjóri
function getManagerRank(p) {
  const role = getStaffProp(p, 'role', 'starf', 'stada', 'staða', 'titill').toLowerCase();
  if (role.includes('aðstoðarskólastjóri') || role.includes('adstodarskolastjori')) return 2;
  if (role.includes('skólastjóri') || role.includes('skolastjori')) return 1;
  if (role.includes('deildarstjóri') || role.includes('deildarstjori')) return 3;
  if (role.includes('verkefnastjóri') || role.includes('verkefnisstjóri') || role.includes('verkefnastjori')) return 4;
  return 5;
}

// ==================== STARFSMANNAKORT ====================

function renderStaffCardByObject(p) {
  if (!p) return '';
  const name = getStaffProp(p, 'name', 'full_name', 'nafn');
  const role = getStaffProp(p, 'role', 'starf', 'stada', 'staða', 'titill');
  const email = getStaffProp(p, 'email', 'netfang');
  const img = getStaffProp(p, 'img', 'mynd', 'image', 'photo');

  const safeName = name.replace(/'/g, "\\'");
  const safeRole = role.replace(/'/g, "\\'");
  const safeEmail = email.replace(/'/g, "\\'");
  const safeImg = img.replace(/'/g, "\\'");

  return `
    <button onclick="openTeacherModal('${safeName}', '${safeRole}', '${safeEmail}', 'images/${safeImg}')" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-100 text-left w-full transition group shadow-sm">
      <img src="images/${safeImg}" alt="${name || 'Starfsmaður'}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition" onerror="this.src='https://via.placeholder.com/150?text=${encodeURIComponent(name ? name.split(' ')[0] : 'Starfsmaður')}';">
      <div class="overflow-hidden">
        <h5 class="font-bold text-xs text-slate-900 group-hover:text-sky-700 truncate">${name}</h5>
        <p class="text-xs text-slate-500 truncate">${role}</p>
      </div>
    </button>
  `;
}

// ==================== GOOGLE DOCS TEXTAHREINSUN (ENGER IFRAME RAMMAR) ====================

async function fetchGoogleDocCleanHtml(docUrl) {
  if (!docUrl || docUrl.trim() === '') return '';

  let cleanUrl = docUrl.trim();
  if (cleanUrl.includes('/pub') && !cleanUrl.includes('embedded=true')) {
    cleanUrl += cleanUrl.includes('?') ? '&embedded=true' : '?embedded=true';
  }

  const proxies = [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  let rawHtml = '';
  for (const getProxyUrl of proxies) {
    try {
      const response = await fetch(getProxyUrl(cleanUrl));
      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 200 && !text.includes('Access Denied')) {
          rawHtml = text;
          break;
        }
      }
    } catch (e) {
      console.warn('Proxy tilraun mistókst, prófa næsta...', e);
    }
  }

  if (!rawHtml) {
    return `
      <div class="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs space-y-2">
        <p class="font-semibold">📖 Námskrá og kennsluáætlun er í vinnslu.</p>
        <p class="text-[11px] text-amber-700">Ekki náðist bein tenging við skjalið í augnablikinu. <a href="${docUrl}" target="_blank" class="underline hover:text-amber-900 font-bold">Smelltu hér til að opna námskrána í Google Docs</a>.</p>
      </div>
    `;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    const contentHolder = doc.querySelector('#contents') || doc.querySelector('.doc-content') || doc.body;

    if (!contentHolder) {
      return '<div class="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs font-semibold">📖 Námskrá og kennsluáætlun er í vinnslu.</div>';
    }

    contentHolder.querySelectorAll('style, script, head, title, meta, link').forEach(el => el.remove());
    contentHolder.querySelectorAll('*').forEach(el => {
      el.removeAttribute('style');
      el.removeAttribute('class');
      el.removeAttribute('id');
      el.removeAttribute('dir');
      el.removeAttribute('color');
      el.removeAttribute('face');
    });

    return applyTailwindStylesToDocHtml(contentHolder.innerHTML);
  } catch (err) {
    console.error('Villa við þáttun á Google Doc HTML:', err);
    return '<div class="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs font-semibold">📖 Námskrá og kennsluáætlun er í vinnslu.</div>';
  }
}

function applyTailwindStylesToDocHtml(html) {
  return `
    <div class="space-y-4 text-slate-700 text-sm leading-relaxed
      [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-sky-900 [&_h1]:pt-4 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-slate-100
      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:pt-3 [&_h2]:pb-1
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-sky-800 [&_h3]:pt-2
      [&_p]:leading-relaxed [&_p]:text-slate-600 [&_p]:mb-3
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3
      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:my-3
      [&_li]:text-slate-700
      [&_strong]:font-bold [&_strong]:text-slate-900
      [&_a]:text-sky-600 [&_a]:underline hover:[&_a]:text-sky-800
      [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
      [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_td]:text-xs
      [&_th]:border [&_th]:border-slate-200 [&_th]:p-3 [&_th]:bg-slate-50 [&_th]:font-bold [&_th]:text-xs">
      ${html}
    </div>
  `;
}

// ==================== ÁRGANGASÍÐA ====================

async function openYearDetail(yearId) {
  const data = window.YEARS_DATA ? window.YEARS_DATA[yearId] : null;
  
  if (!data) {
    openDetailView('Árgangur', '🎓', '<div class="bg-white p-6 rounded-3xl border border-slate-200/80"><p class="text-slate-600 text-sm">Upplýsingar í vinnslu.</p></div>');
    return;
  }

  let homeroomTeachers = [];
  let assistants = [];
  let supportService = [];
  let otherTeachers = [];
  let managers = [];

  const hasManualStaff = data.staff && (
    (data.staff.teachers && data.staff.teachers.length > 0) ||
    (data.staff.assistants && data.staff.assistants.length > 0) ||
    (data.staff.support && data.staff.support.length > 0) ||
    (data.staff.otherTeachers && data.staff.otherTeachers.length > 0) ||
    (data.staff.managers && data.staff.managers.length > 0)
  );

  if (hasManualStaff) {
    const getStaffObjs = (ids) => (ids || []).map(id => window.STAFF_MEMBERS ? window.STAFF_MEMBERS[id] : null).filter(Boolean);
    homeroomTeachers = getStaffObjs(data.staff.teachers);
    assistants = getStaffObjs(data.staff.assistants);
    supportService = getStaffObjs(data.staff.support);
    otherTeachers = getStaffObjs(data.staff.otherTeachers);
    managers = getStaffObjs(data.staff.managers);

    managers.sort((a, b) => getManagerRank(a) - getManagerRank(b));
  } else {
    // SÆKJUM SJÁLFKRAFA ÚR GOOGLE SHEETS (STAFF.JS)
    const rawStaff = Object.values(window.STAFF_MEMBERS || {});
    const yearStaff = rawStaff.filter(p => isStaffInYear(p, yearId));

    const assignedNames = new Set();
    function isUnassigned(p) {
      const name = getStaffProp(p, 'name', 'full_name', 'nafn').toLowerCase().trim();
      return name && !assignedNames.has(name);
    }
    function markAssigned(list) {
      list.forEach(p => {
        const name = getStaffProp(p, 'name', 'full_name', 'nafn').toLowerCase().trim();
        if (name) assignedNames.add(name);
      });
    }

    // 1. Umsjónarkennarar
    homeroomTeachers = yearStaff.filter(p => {
      const cat = getStaffProp(p, 'category', 'flokkur').toLowerCase();
      const role = getStaffProp(p, 'role', 'starf', 'stada', 'staða').toLowerCase();
      return cat.includes('umsjon') || cat.includes('umsjón') || role.includes('umsjónarkennari') || role.includes('umsjonarkennari') || role.includes('umsjón');
    });
    markAssigned(homeroomTeachers);

    // 2. Stuðningsfulltrúar
    assistants = yearStaff.filter(p => {
      if (!isUnassigned(p)) return false;
      const cat = getStaffProp(p, 'category', 'flokkur').toLowerCase();
      const role = getStaffProp(p, 'role', 'starf', 'stada', 'staða').toLowerCase();
      return cat.includes('studning') || cat.includes('stuðning') || cat.includes('skolalidi') || role.includes('stuðningsfulltrúi') || role.includes('skólaliði');
    });
    markAssigned(assistants);

    // 3. Stoðþjónusta
    supportService = yearStaff.filter(p => {
      if (!isUnassigned(p)) return false;
      const cat = getStaffProp(p, 'category', 'flokkur').toLowerCase();
      const role = getStaffProp(p, 'role', 'starf', 'stada', 'staða').toLowerCase();
      return cat.includes('stod') || cat.includes('stoð') || role.includes('sérkennari') || role.includes('þroskaþjálfi') || role.includes('námsráðgjafi') || role.includes('talmeina');
    });
    markAssigned(supportService);

    // 4. Stjórnendur (Röðun:
