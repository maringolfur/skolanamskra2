var currentViewHistory = currentViewHistory || [];

// ==================== VARAVALKOSTIR (FALLBACKS) ====================

const DEFAULT_YEARS_LIST = [
  { id: 'y1', title: '1. bekkur', icon: '🌱' },
  { id: 'y2', title: '2. bekkur', icon: '🎨' },
  { id: 'y3', title: '3. bekkur', icon: '📚' },
  { id: 'y4', title: '4. bekkur', icon: '✏️' },
  { id: 'y5', title: '5. bekkur', icon: '🔍' },
  { id: 'y6', title: '6. bekkur', icon: '💡' },
  { id: 'y7', title: '7. bekkur', icon: '🚀' },
  { id: 'y8', title: '8. bekkur', icon: '🔬' },
  { id: 'y9', title: '9. bekkur', icon: '💻' },
  { id: 'y10', title: '10. bekkur', icon: '🎓' },
  { id: 'stod', title: 'Stoðþjónusta', icon: '🤝' },
  { id: 'isat', title: 'ÍSAT', icon: '💬' }
];

const DEFAULT_SUBJECTS_TREE = [
  {
    id: 'islenska',
    title: 'Íslenska',
    icon: '📖',
    type: 'grades',
    startGrade: 1,
    endGrade: 10,
    description: `Megintilgangur náms og kennslu í íslensku er að nemendur fái tækifæri til að efla málnotkun, tjáningu og sköpun í töluðu og rituðu máli, nota málið og kynnast mætti þess og fjölbreytileika í daglegu lífi, leik og starfi.<br><br>
Með tungumálinu hugsar fólk, talar, miðlar og lærir, þróar sjálfsmynd sína, tjáir tilfinningar og hugsanir og skilur líðan og hugsun annarra.<br><br>
Skólinn er frá upphafi skólagöngu virkur þátttakandi í máluppeldi barns, ásamt heimili þess, og er það réttur hvers barns að öðlast hæfni í tungumáli. Traust kunnátta í móðurmáli er ein meginforsenda samskipta, miðlunar og menntunar. Lestur er mikilvægur þáttur í að afla sér þekkingar og tjáning í ræðu og riti er ein af nauðsynlegum forsendum þátttöku í samfélaginu. Þetta á einnig við um nemendur með fjölbreyttan tungumála- og menningarbakgrunn.<br><br>
Miklu skiptir að börn með fjölbreyttan tungumála- og menningarbakgrunn eigi þess kost að bæta íslensku við tungumálaforða sinn og læra íslensku svo vel að þau geti tekið fullan þátt í samfélaginu, notið menningar og átt þátt í því að móta hana. Sama gildir um þann sem er heyrnarskertur eða heyrnarlaus. Íslenskt táknmál er ekki síður en íslenska lykill að samfélaginu og virkri þátttöku í því.`
  },
  { id: 'staerdfraedi', title: 'Stærðfræði', icon: '📐', type: 'grades', startGrade: 1, endGrade: 10 },
  { id: 'natturufraedi', title: 'Náttúrufræði', icon: '🌿', type: 'grades', startGrade: 1, endGrade: 10 },
  { id: 'samfelagsfraedi', title: 'Samfélagsfræði', icon: '🌍', type: 'grades', startGrade: 1, endGrade: 10 },
  { id: 'enska', title: 'Enska', icon: '🇬🇧', type: 'grades', startGrade: 1, endGrade: 10 },
  { id: 'danska', title: 'Danska', icon: '🇩🇰', type: 'grades', startGrade: 5, endGrade: 10 },
  { id: 'skolaithrottir', title: 'Skólaíþróttir', icon: '🏀', type: 'grades', startGrade: 1, endGrade: 10 },
  { id: 'logv', title: 'List- og verkgreinar', icon: '🎨', type: 'grades', startGrade: 1, endGrade: 10 },
  { id: 'ahugasvidsval', title: 'Áhugasviðsval', icon: '🌟', type: 'grades', startGrade: 8, endGrade: 10 }
];

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
  const list = (window.YEARS_LIST && window.YEARS_LIST.length > 0) ? window.YEARS_LIST : DEFAULT_YEARS_LIST;
  if (!container) return;

  container.innerHTML = list.map(item => `
    <button onclick="openYearDetail('${item.id}')" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-sky-600 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
      <span class="text-4xl group-hover:scale-110 transition duration-200">${item.icon}</span>
      <span class="text-sm font-bold text-slate-800 group-hover:text-sky-700">${item.title}</span>
    </button>
  `).join('');
}

function renderSubjectsGrid() {
  const container = document.getElementById('subjectsGrid');
  const list = (window.SUBJECTS_TREE && window.SUBJECTS_TREE.length > 0) ? window.SUBJECTS_TREE : DEFAULT_SUBJECTS_TREE;
  if (!container) return;

  container.innerHTML = list.map(item => `
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
  const rawCat = getStaffProp(p, 'category', 'flokkur', 'teymi', 'team', 'teams').toLowerCase();
  const rawRole = getStaffProp(p, 'role', 'starf', 'stada', 'staða', 'titill').toLowerCase();
  const rawName = getStaffProp(p, 'name', 'full_name', 'nafn').toLowerCase();

  // Sérstaklega fyrir Stoðþjónustu og ÍSAT
  if (yearId === 'stod' || yearId === 'isat') {
    if (rawName.includes('páll') || rawName.includes('pall') || 
        rawName.includes('þorvaldur') || rawName.includes('thorvaldur') || 
        rawName.includes('sigurborg')) {
      return true;
    }
    if (yearId === 'stod') {
      return rawCat.includes('stod') || rawCat.includes('stoð') || 
             rawRole.includes('stoð') || rawRole.includes('sérkenn') || 
             rawRole.includes('þroskaþjálf') || rawRole.includes('námsráðgjaf') || 
             rawRole.includes('talmeina') || rawRole.includes('sálfræð') ||
             rawGrades.includes('stod') || rawGrades.includes('stoð');
    } else if (yearId === 'isat') {
      return rawCat.includes('isat') || rawCat.includes('ísat') || 
             rawRole.includes('isat') || rawRole.includes('ísat') || 
             rawGrades.includes('isat') || rawGrades.includes('ísat');
    }
  }

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

  const imgSrc = safeImg ? (safeImg.startsWith('http') || safeImg.startsWith('images/') ? safeImg : `images/${safeImg}`) : '';

  return `
    <button onclick="openTeacherModal('${safeName}', '${safeRole}', '${safeEmail}', '${imgSrc}')" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-100 text-left w-full transition group shadow-sm cursor-pointer">
      <img src="${imgSrc}" alt="${name || 'Starfsmaður'}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition" onerror="this.src='https://via.placeholder.com/150?text=${encodeURIComponent(name ? name.split(' ')[0] : 'Starfsmaður')}';">
      <div class="overflow-hidden">
        <h5 class="font-bold text-xs text-slate-900 group-hover:text-sky-700 truncate">${name}</h5>
        <p class="text-xs text-slate-500 truncate">${role}</p>
      </div>
    </button>
  `;
}

// ==================== ÁRGANGASÍÐA / STOÐÞJÓNUSTA / ÍSAT ====================

async function openYearDetail(yearId) {
  if (window.STAFF_LOADED_PROMISE) {
    await window.STAFF_LOADED_PROMISE;
  }

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

    if (yearId === 'stod' || yearId === 'isat') {
      // Stoðþjónusta og ÍSAT: Stjórnendur (Páll, Þorvaldur, Sigurborg) neðst
      managers = yearStaff.filter(p => {
        const name = getStaffProp(p, 'name', 'full_name', 'nafn').toLowerCase();
        return name.includes('páll') || name.includes('pall') ||
               name.includes('þorvaldur') || name.includes('thorvaldur') ||
               name.includes('sigurborg');
      });
      managers.sort((a, b) => getManagerRank(a) - getManagerRank(b));
      markAssigned(managers);

      // Starfsfólk stoðþjónustu eða ÍSAT efst
      supportService = yearStaff.filter(p => isUnassigned(p));
      markAssigned(supportService);
    } else {
      // Almennir árgangar: Upprunaleg flokkun óbreytt
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

      // 4. Stjórnendur (Röðun: Skólastjóri -> Aðstoðarskólastjóri -> Deildarstjóri -> Verkefnastjóri)
      managers = yearStaff.filter(p => {
        if (!isUnassigned(p)) return false;
        const cat = getStaffProp(p, 'category', 'flokkur').toLowerCase();
        const role = getStaffProp(p, 'role', 'starf', 'stada', 'staða').toLowerCase();
        return cat.includes('stjorn') || cat.includes('stjórn') || 
               role.includes('skólastjóri') || role.includes('skolastjori') ||
               role.includes('deildarstjóri') || role.includes('deildarstjori') ||
               role.includes('verkefnastjóri') || role.includes('verkefnisstjóri');
      });
      managers.sort((a, b) => getManagerRank(a) - getManagerRank(b));
      markAssigned(managers);

      // 5. Aðrir kennarar í árgangi
      otherTeachers = yearStaff.filter(p => isUnassigned(p));
    }
  }

  const homeroomHtml = homeroomTeachers.map(p => renderStaffCardByObject(p)).join('');
  const assistantsHtml = assistants.map(p => renderStaffCardByObject(p)).join('');
  const supportHtml = supportService.map(p => renderStaffCardByObject(p)).join('');
  const otherTeachersHtml = otherTeachers.map(p => renderStaffCardByObject(p)).join('');
  const managersHtml = managers.map(p => renderStaffCardByObject(p)).join('');

  // BIRTING RÖÐUNAR EINANGRUÐ FRÁ EINUM ÁRGANGI TIL ANNARS
  let renderedStaffContent = '';

  if (yearId === 'stod' || yearId === 'isat') {
    // Fyrir stoðþjónustu og ÍSAT: Starfsfólk efst, Stjórnendur neðst
    const customSections = [];
    const sectionTitle = yearId === 'isat' ? '💬 Starfsfólk ÍSAT' : '🤝 Starfsfólk stoðþjónustu';

    if (supportHtml) {
      customSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">${sectionTitle}</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${supportHtml}</div></div>`);
    }
    if (managersHtml) {
      customSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🏫 Stjórnendur</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">${managersHtml}</div></div>`);
    }
    renderedStaffContent = customSections.map((group, idx) => idx === 0 ? group : `<div class="pt-3 border-t border-slate-100">${group}</div>`).join('');
  } else {
    // Fyrir alla almenna árganga (1.-10. bekk): Umsjónarkennarar ➔ Stuðningsfulltrúar ➔ Stoðþjónusta ➔ Aðrir ➔ Stjórnendur
    const stdSections = [];
    if (homeroomHtml) {
      stdSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">👩‍🏫 Umsjónarkennarar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${homeroomHtml}</div></div>`);
    }
    if (assistantsHtml) {
      stdSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🌱 Stuðningsfulltrúar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${assistantsHtml}</div></div>`);
    }
    if (supportHtml) {
      stdSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🤝 Stoðþjónusta</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${supportHtml}</div></div>`);
    }
    if (otherTeachersHtml) {
      stdSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🎨 Aðrir kennarar í árgangi</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${otherTeachersHtml}</div></div>`);
    }
    if (managersHtml) {
      stdSections.push(`<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🏫 Stjórnendur</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">${managersHtml}</div></div>`);
    }
    renderedStaffContent = stdSections.map((group, idx) => idx === 0 ? group : `<div class="pt-3 border-t border-slate-100">${group}</div>`).join('');
  }

  if (!renderedStaffContent) {
    renderedStaffContent = '<p class="text-xs text-slate-400 italic">Engir starfsmenn finnast skráðir á þennan árgang í Google Sheets.</p>';
  }

  const docContent = (data.docHtml && data.docHtml.trim() !== '') 
    ? data.docHtml 
    : '<div class="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs font-semibold">📖 Námskrá og kennsluáætlun er í vinnslu fyrir þennan árgang.</div>';

  const staffHeaderTitle = yearId === 'stod' ? 'stoðþjónustu' : (yearId === 'isat' ? 'ÍSAT' : 'árgangsins');

  const baseHtml = `
    <div class="space-y-6">
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <h3 class="font-bold text-sky-900 text-xl border-b pb-2">🏫 Almennt um ${data.title}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-slate-600 pt-1">
          <p><strong>Fjöldi nemenda:</strong> ${data.info && data.info.students ? data.info.students : '-'}</p>
          <p><strong>Heimastofur:</strong> ${data.info && data.info.rooms ? data.info.rooms : '-'}</p>
          <p><strong>Kennslutími:</strong> ${data.info && data.info.hours ? data.info.hours : '-'}</p>
          <p><strong>Frímínútur:</strong> ${data.info && data.info.recess ? data.info.recess : '-'}</p>
          ${data.info && data.info.lunch ? `<p><strong>Hádegishlé:</strong> ${data.info.lunch}</p>` : ''}
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-bold text-sky-900 text-xl">👥 Starfsfólk ${staffHeaderTitle}</h3>
          <span class="text-xs text-slate-400 italic">Smelltu til að opna samskiptaupplýsingar</span>
        </div>

        ${renderedStaffContent}
      </div>

      <div id="docContainer" class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 class="font-bold text-sky-900 text-xl border-b pb-2">📖 Námskrá og Kennsluáætlun</h3>
        <div id="docTextHolder" class="space-y-4 text-slate-700 text-sm leading-relaxed
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
          ${docContent}
        </div>
      </div>
    </div>
  `;

  openDetailView(data.title, data.icon, baseHtml);
}

// ==================== FAGGREINAR LOGIC ====================

function handleSubjectClick(subjectId) {
  const list = (window.SUBJECTS_TREE && window.SUBJECTS_TREE.length > 0) ? window.SUBJECTS_TREE : DEFAULT_SUBJECTS_TREE;
  const subject = list.find(s => s.id === subjectId);
  if (!subject) return;

  if (subject.type === 'parent') {
    renderSubSubjects(subject);
  } else if (subject.type === 'standalone') {
    openDetailView(subject.title, subject.icon, `<div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm"><p class="text-slate-600 text-sm">Upplýsingar um ${subject.title}.</p></div>`);
  } else {
    renderGradeSelection(subject);
  }
}

function renderSubSubjects(parentSubject) {
  hideAllViews();
  currentViewHistory.push('sub_subjects');
  document.getElementById('detailIcon').innerText = parentSubject.icon;
  document.getElementById('detailTitle').innerText = parentSubject.title;

  const tilesHtml = parentSubject.subSubjects.map(sub => `
    <button onclick="renderGradeSelection(${JSON.stringify(sub).replace(/"/g, '&quot;')})" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
      <span class="text-3xl group-hover:scale-110 transition duration-200">${sub.icon}</span>
      <span class="text-sm font-bold text-slate-800 group-hover:text-amber-700">${sub.title}</span>
    </button>
  `).join('');

  document.getElementById('detailContent').innerHTML = `
    <div class="space-y-4">
      <p class="text-xs md:text-sm text-slate-500 font-medium">Veldu undirgrein innan ${parentSubject.title}:</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        ${tilesHtml}
      </div>
    </div>
  `;

  document.getElementById('backNavBtn').innerText = '← Til baka í Faggreinar';
  document.getElementById('detailView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function renderGradeSelection(subject, icon, startGrade, endGrade, description) {
  hideAllViews();
  currentViewHistory.push('grade_selection');

  let sTitle = '';
  let sIcon = '📘';
  let sStart = 1;
  let sEnd = 10;
  let sDesc = '';

  if (typeof subject === 'object' && subject !== null) {
    sTitle = subject.title || '';
    sIcon = subject.icon || '📘';
    sStart = subject.startGrade || 1;
    sEnd = subject.endGrade || 10;
    sDesc = subject.description || '';
  } else {
    sTitle = subject || '';
    sIcon = icon || '📘';
    sStart = startGrade || 1;
    sEnd = endGrade || 10;
    sDesc = description || '';
  }

  document.getElementById('detailIcon').innerText = sIcon;
  document.getElementById('detailTitle').innerText = sTitle;

  let introBoxHtml = '';
  if (sDesc) {
    introBoxHtml = `
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 mb-6">
        <h3 class="font-bold text-amber-900 text-lg border-b pb-2 flex items-center gap-2">
          📜 Um ${sTitle} í Aðalnámskrá
        </h3>
        <p class="text-xs md:text-sm text-slate-700 leading-relaxed">${sDesc}</p>
      </div>
    `;
  }

  let tilesHtml = '';
  for (let i = sStart; i <= sEnd; i++) {
    const safeTitle = sTitle.replace(/'/g, "\\'");
    tilesHtml += `
      <button onclick="openSubjectGradeDetail('${safeTitle}', ${i})" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
        <span class="text-3xl group-hover:scale-110 transition duration-200">📘</span>
        <span class="text-sm font-bold text-slate-800 group-hover:text-amber-700">${i}. árgangur</span>
      </button>
    `;
  }

  document.getElementById('detailContent').innerHTML = `
    <div class="space-y-6">
      ${introBoxHtml}
      <div>
        <p class="text-xs md:text-sm text-slate-500 font-medium mb-3">Veldu árgang til að skoða námskrá og kennsluáætlun:</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          ${tilesHtml}
        </div>
      </div>
    </div>
  `;

  document.getElementById('backNavBtn').innerText = '← Til baka';
  document.getElementById('detailView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function openSubjectGradeDetail(subjectTitle, gradeNum) {
  const cleanSubjectId = subjectTitle.split('—')[0].trim().toLowerCase()
    .replace(/í/g, 'i').replace(/á/g, 'a').replace(/ð/g, 'd')
    .replace(/é/g, 'e').replace(/ó/g, 'o').replace(/ú/g, 'u')
    .replace(/ý/g, 'y').replace(/þ/g, 'th').replace(/æ/g, 'ae')
    .replace(/ö/g, 'o').replace(/[^a-z0-9]/g, '');

  const dataKey = `${cleanSubjectId}_${gradeNum}`;
  const data = (window.SUBJECT_GRADE_DATA && window.SUBJECT_GRADE_DATA[dataKey]) ? window.SUBJECT_GRADE_DATA[dataKey] : null;

  if (data) {
    const sectionsHtml = data.sections.map(sec => `
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <h4 class="font-bold text-sky-900 text-lg border-b pb-2 flex items-center gap-2">
          <span>${sec.icon}</span> ${sec.title}
        </h4>
        <ul class="list-disc pl-5 space-y-2 text-xs md:text-sm text-slate-700 leading-relaxed">
          ${sec.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const fullHtml = `
      <div class="space-y-6">
        <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 class="font-bold text-amber-900 text-xl border-b pb-2 flex items-center gap-2">
            📘 Yfirlit — ${gradeNum}. bekkur
          </h3>
          <p class="text-xs md:text-sm text-slate-700 leading-relaxed">${data.description}</p>
        </div>
        ${sectionsHtml}
      </div>
    `;

    openDetailView(`${subjectTitle} — ${gradeNum}. árgangur`, data.icon || '📚', fullHtml);
  } else {
    openDetailView(`${subjectTitle} — ${gradeNum}. árgangur`, '📚', `
      <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <h3 class="font-bold text-sky-900 text-lg border-b pb-2">Námskrá og kennsluáætlun</h3>
        <p class="text-xs md:text-sm text-slate-600">Hér birtast námsmarkmið, námsefni og námsmat fyrir ${gradeNum}. bekk í ${subjectTitle} (í vinnslu).</p>
      </div>
    `);
  }
}

// ==================== STARFSMANNA SPRETTIGLUGGI (MODAL) ====================

function openTeacherModal(name, role, email, imgSrc) {
  document.getElementById('teacherModalName').innerText = name || '';
  document.getElementById('teacherModalRole').innerText = role || '';
  document.getElementById('teacherModalEmailText').innerText = email || '';
  document.getElementById('teacherModalEmail').href = "mailto:" + (email || '');
  
  const imgElem = document.getElementById('teacherModalImg');
  imgElem.src = imgSrc;
  imgElem.onerror = function() {
    this.src = 'https://via.placeholder.com/150?text=' + encodeURIComponent((name || 'Starfsmaður').split(' ')[0]);
  };

  document.getElementById('teacherModal').style.display = 'flex';
}

function closeTeacherModal() {
  document.getElementById('teacherModal').style.display = 'none';
}

function closeTeacherModalOnBg(e) {
  if (e.target.id === 'teacherModal') closeTeacherModal();
}

// ==================== FRUMSTILLING ====================

window.addEventListener('DOMContentLoaded', () => {
  showHome();
});
