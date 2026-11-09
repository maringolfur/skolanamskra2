var currentViewHistory = currentViewHistory || [];

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
  const rawCat = getStaffProp(p, 'category', 'flokkur', 'teymi', 'team', 'teams').toLowerCase();
  const rawRole = getStaffProp(p, 'role', 'starf', 'stada', 'staða', 'titill').toLowerCase();
  const rawName = getStaffProp(p, 'name', 'full_name', 'nafn').toLowerCase();

  // Sérstaklega fyrir Stoðþjónustu
  if (yearId === 'stod') {
    if (rawName.includes('páll') || rawName.includes('pall') || 
        rawName.includes('þorvaldur') || rawName.includes('thorvaldur') || 
        rawName.includes('sigurborg')) {
      return true;
    }
    return rawCat.includes('stod') || rawCat.includes('stoð') || 
           rawRole.includes('stoð') || rawRole.includes('sérkenn') || 
           rawRole.includes('þroskaþjálf') || rawRole.includes('námsráðgjaf') || 
           rawRole.includes('talmeina') || rawRole.includes('sálfræð') ||
           rawGrades.includes('stod') || rawGrades.includes('stoð');
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

// ==================== ÁRGANGASÍÐA / STOÐÞJÓNUSTA ====================

function openYearDetail(yearId) {
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

    if (yearId === 'stod') {
      // 1. Stjórnendur í Stoðþjónustu: Páll, Þorvaldur, Sigurborg
      managers = yearStaff.filter(p => {
        const name = getStaffProp(p, 'name', 'full_name', 'nafn').toLowerCase();
        return name.includes('páll') || name.includes('pall') ||
               name.includes('þorvaldur') || name.includes('thorvaldur') ||
               name.includes('sigurborg');
      });
      managers.sort((a, b) => getManagerRank(a) - getManagerRank(b));
      markAssigned(managers);

      // 2. Starfsfólk í Stoðþjónustu
      supportService = yearStaff.filter(p => isUnassigned(p));
      markAssigned(supportService);
    } else {
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

  // BIRTA HARÐKÓÐAÐA TEXTANN EÐA TÓM SKILABOÐ
  const docContent = (data.docHtml && data.docHtml.trim() !== '') 
    ? data.docHtml 
    : '<div class="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs font-semibold">📖 Námskrá og kennsluáætlun er í vinnslu fyrir þennan árgang.</div>';

  const baseHtml = `
    <div class="space-y-6">
      <!-- ALMENNAR UPPLÝSINGAR -->
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

      <!-- STARFSFÓLK ÁRGANGSINS / STOÐÞJÓNUSTU -->
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-bold text-sky-900 text-xl">👥 Starfsfólk ${yearId === 'stod' ? 'stoðþjónustu' : 'árgangsins'}</h3>
          <span class="text-xs text-slate-400 italic">Smelltu til að opna samskiptaupplýsingar</span>
        </div>

        ${managersHtml ? `<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🏫 Stjórnendur</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${managersHtml}</div></div>` : ''}
        ${supportHtml ? `<div class="${managersHtml ? 'pt-3 border-t border-slate-100' : ''}"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🤝 Stoðþjónusta</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${supportHtml}</div></div>` : ''}
        ${homeroomHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">👩‍🏫 Umsjónarkennarar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${homeroomHtml}</div></div>` : ''}
        ${assistantsHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🌱 Stuðningsfulltrúar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${assistantsHtml}</div></div>` : ''}
        ${otherTeachersHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🎨 Aðrir kennarar í árgangi</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${otherTeachersHtml}</div></div>` : ''}
        
        ${(!homeroomHtml && !assistantsHtml && !supportHtml && !otherTeachersHtml && !managersHtml) ? '<p class="text-xs text-slate-400 italic">Engir starfsmenn finnast skráðir á þennan árgang í Google Sheets.</p>' : ''}
      </div>

      <!-- HARÐKÓÐAÐUR NÁMSKRÁRTEXTI -->
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
  const subject = window.SUBJECTS_TREE ? window.SUBJECTS_TREE.find(s => s.id === subjectId) : null;
  if (!subject) return;

  if (subject.type === 'parent') {
    renderSubSubjects(subject);
  } else if (subject.type === 'standalone') {
    openDetailView(subject.title, subject.icon, `<div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm"><p class="text-slate-600 text-sm">Upplýsingar um ${subject.title}.</p></div>`);
  } else {
    renderGradeSelection(subject.title, subject.icon, subject.startGrade, subject.endGrade);
  }
}

function renderSubSubjects(parentSubject) {
  hideAllViews();
  currentViewHistory.push('sub_subjects');
  document.getElementById('detailIcon').innerText = parentSubject.icon;
  document.getElementById('detailTitle').innerText = parentSubject.title;

  const tilesHtml = parentSubject.subSubjects.map(sub => `
    <button onclick="renderGradeSelection('${sub.title}', '${sub.icon}', ${sub.startGrade}, ${sub.endGrade})" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
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

function renderGradeSelection(title, icon, startGrade, endGrade) {
  hideAllViews();
  currentViewHistory.push('grade_selection');
  document.getElementById('detailIcon').innerText = icon;
  document.getElementById('detailTitle').innerText = title;

  let tilesHtml = '';
  for (let i = startGrade; i <= endGrade; i++) {
    tilesHtml += `
      <button onclick="openSubjectGradeDetail('${title}', ${i})" class="p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 transition duration-200 text-center group flex flex-col items-center justify-center space-y-3">
        <span class="text-3xl group-hover:scale-110 transition duration-200">📘</span>
        <span class="text-sm font-bold text-slate-800 group-hover:text-amber-700">${i}. árgangur</span>
      </button>
    `;
  }

  document.getElementById('detailContent').innerHTML = `
    <div class="space-y-4">
      <p class="text-xs md:text-sm text-slate-500 font-medium">Veldu árgang til að skoða námskrá í ${title}:</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        ${tilesHtml}
      </div>
    </div>
  `;

  document.getElementById('backNavBtn').innerText = '← Til baka';
  document.getElementById('detailView').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function openSubjectGradeDetail(subjectTitle, gradeNum) {
  openDetailView(`${subjectTitle} — ${gradeNum}. árgangur`, '📚', `
    <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
      <h3 class="font-bold text-sky-900 text-lg border-b pb-2">Námskrá og kennsluáætlun</h3>
      <p class="text-xs md:text-sm text-slate-600">Hér birtast námsmarkmið, námsefni og námsmat fyrir ${gradeNum}. bekk í ${subjectTitle}.</p>
    </div>
  `);
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
