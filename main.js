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

// ==================== STARFSMANNAKORT ====================

function renderStaffCardByObject(p) {
  if (!p) return '';
  const safeName = (p.name || '').replace(/'/g, "\\'");
  const safeRole = (p.role || '').replace(/'/g, "\\'");
  const safeEmail = (p.email || '').replace(/'/g, "\\'");
  const safeImg = (p.img || '').replace(/'/g, "\\'");

  return `
    <button onclick="openTeacherModal('${safeName}', '${safeRole}', '${safeEmail}', 'images/${safeImg}')" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-100 text-left w-full transition group shadow-sm">
      <img src="images/${safeImg}" alt="${p.name || 'Starfsmaður'}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition" onerror="this.src='https://via.placeholder.com/150?text=${encodeURIComponent(p.name ? p.name.split(' ')[0] : 'Starfsmaður')}';">
      <div class="overflow-hidden">
        <h5 class="font-bold text-xs text-slate-900 group-hover:text-sky-700 truncate">${p.name || ''}</h5>
        <p class="text-xs text-slate-500 truncate">${p.role || ''}</p>
      </div>
    </button>
  `;
}

// ==================== GOOGLE DOCS SÆKIR ====================

async function fetchGoogleDocContent(docUrl) {
  if (!docUrl) return '';

  let cleanUrl = docUrl.trim();
  if (!cleanUrl.includes('embedded=true')) {
    cleanUrl += cleanUrl.includes('?') ? '&embedded=true' : '?embedded=true';
  }

  const proxies = [
    url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];

  let htmlText = '';
  
  for (const getProxyUrl of proxies) {
    try {
      const response = await fetch(getProxyUrl(cleanUrl));
      if (response.ok) {
        const text = await response.text();
        if (text && text.length > 100) {
          htmlText = text;
          break;
        }
      }
    } catch (e) {
      console.warn('Proxy tilraun mistókst, prófa næsta...', e);
    }
  }

  if (!htmlText) {
    return '<p class="text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs">Ekki náðist samband við Google Docs. Athugaðu hvort skjalið sé örugglega gefið út á vefnum (Skrá ➔ Deila ➔ Gefa út á vefnum).</p>';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const content = doc.querySelector('#contents') || doc.querySelector('.doc-content') || doc.body;

    if (!content) return '<p class="text-slate-500 italic">Enginn texti fannst í skjalinu.</p>';

    const badElements = content.querySelectorAll('style, script, head, title, meta');
    badElements.forEach(el => el.remove());

    const allElements = content.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('style');
      el.removeAttribute('class');
      el.removeAttribute('id');
    });

    return content.innerHTML;
  } catch (err) {
    console.error('Villa við að lesa Google Doc HTML:', err);
    return '<p class="text-slate-500 italic">Tókst ekki að umbreyta texta úr Google Docs.</p>';
  }
}

// ==================== ÁRGANGASÍÐA (NÁKVÆM RÖÐUN & DE-DUPLICATION) ====================

async function openYearDetail(yearId) {
  const data = window.YEARS_DATA ? window.YEARS_DATA[yearId] : null;
  
  if (!data) {
    openDetailView('Árgangur', '🎓', '<div class="bg-white p-6 rounded-3xl border border-slate-200/80"><p class="text-slate-600 text-sm">Upplýsingar í vinnslu.</p></div>');
    return;
  }

  // 1. Sækjum starfsmenn þessa árgangs
  const rawStaff = Object.values(window.STAFF_MEMBERS || {});
  const yearStaff = rawStaff.filter(p => {
    if (!p.grades) return false;
    return p.grades.toLowerCase().split(',').map(g => g.trim()).includes(yearId.toLowerCase());
  });

  // Einangrum einstaka starfsmenn miðað við nafn til að koma í veg fyrir tvítekningu
  const uniqueYearStaff = [];
  const seenNames = new Set();
  for (const p of yearStaff) {
    const key = (p.name || '').toLowerCase().trim();
    if (key && !seenNames.has(key)) {
      seenNames.add(key);
      uniqueYearStaff.push(p);
    }
  }

  const assignedNames = new Set();

  function isUnassigned(p) {
    const key = (p.name || '').toLowerCase().trim();
    return !assignedNames.has(key);
  }

  function markAssigned(list) {
    list.forEach(p => {
      const key = (p.name || '').toLowerCase().trim();
      if (key) assignedNames.add(key);
    });
  }

  // FLOKKUR 1: UMSJÓNARKENNARAR
  const homeroomTeachers = uniqueYearStaff.filter(p => {
    if (!isUnassigned(p)) return false;
    const cat = (p.category || '').toLowerCase();
    const role = (p.role || '').toLowerCase();
    return cat === 'umsjonarkennari' || role.includes('umsjónarkennari') || role.includes('umsjón');
  });
  markAssigned(homeroomTeachers);

  // FLOKKUR 2: STUÐNINGSFULLTRÚAR
  const assistants = uniqueYearStaff.filter(p => {
    if (!isUnassigned(p)) return false;
    const cat = (p.category || '').toLowerCase();
    const role = (p.role || '').toLowerCase();
    return cat === 'studningsfulltrui' || role.includes('stuðningsfulltrúi') || role.includes('skólaliði');
  });
  markAssigned(assistants);

  // FLOKKUR 3: STOÐÞJÓNUSTA (Sérkennarar, þroskaþjálfar, námsráðgjafar o.fl.)
  const supportService = uniqueYearStaff.filter(p => {
    if (!isUnassigned(p)) return false;
    const cat = (p.category || '').toLowerCase();
    const role = (p.role || '').toLowerCase();
    return cat === 'stodthjonusta' || role.includes('sérkennari') || role.includes('þroskaþjálfi') || role.includes('námsráðgjafi') || role.includes('talmeina') || role.includes('stoðþjónusta');
  });
  markAssigned(supportService);

  // FLOKKUR 4: AÐRIR KENNARAR Í ÁRGANGI (Íþrótta-, list- og faggreinakennarar)
  const otherTeachers = uniqueYearStaff.filter(p => {
    if (!isUnassigned(p)) return false;
    const cat = (p.category || '').toLowerCase();
    const role = (p.role || '').toLowerCase();
    return cat === 'kennari' || role.includes('kennari') || role.includes('þjálfari');
  });
  markAssigned(otherTeachers);

  // FLOKKUR 5: STJÓRNENDUR (Neðst)
  const managers = uniqueYearStaff.filter(p => {
    if (!isUnassigned(p)) return false;
    const cat = (p.category || '').toLowerCase();
    const role = (p.role || '').toLowerCase();
    return cat === 'stjornandi' || role.includes('skólastjóri') || role.includes('deildarstjóri') || role.includes('aðstoðarskólastjóri');
  });
  markAssigned(managers);

  // Teiknum upp HTML fyrir hvern flokk
  const homeroomHtml = homeroomTeachers.map(p => renderStaffCardByObject(p)).join('');
  const assistantsHtml = assistants.map(p => renderStaffCardByObject(p)).join('');
  const supportHtml = supportService.map(p => renderStaffCardByObject(p)).join('');
  const otherTeachersHtml = otherTeachers.map(p => renderStaffCardByObject(p)).join('');
  const managersHtml = managers.map(p => renderStaffCardByObject(p)).join('');

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

      <!-- STARFSFÓLK ÁRGANGSINS -->
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-bold text-sky-900 text-xl">👥 Starfsfólk árgangsins</h3>
          <span class="text-xs text-slate-400 italic">Smelltu til að opna samskiptaupplýsingar</span>
        </div>

        <!-- 1. UMSJÓNARKENNARAR -->
        ${homeroomHtml ? `<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">👩‍🏫 Umsjónarkennarar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${homeroomHtml}</div></div>` : ''}

        <!-- 2. STUÐNINGSFULLTRÚAR -->
        ${assistantsHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🌱 Stuðningsfulltrúar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${assistantsHtml}</div></div>` : ''}

        <!-- 3. STOÐÞJÓNUSTA -->
        ${supportHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🤝 Stoðþjónusta</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${supportHtml}</div></div>` : ''}

        <!-- 4. AÐRIR KENNARAR -->
        ${otherTeachersHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🎨 Aðrir kennarar í árgangi</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${otherTeachersHtml}</div></div>` : ''}

        <!-- 5. STJÓRNENDUR (NEÐST) -->
        ${managersHtml ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🏫 Stjórnendur</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">${managersHtml}</div></div>` : ''}
        
        ${(!homeroomHtml && !assistantsHtml && !supportHtml && !otherTeachersHtml && !managersHtml) ? '<p class="text-xs text-slate-400 italic">Engir starfsmenn finnast skráðir á þennan árgang í Google Sheets.</p>' : ''}
      </div>

      <!-- GOOGLE DOCS NÁMSKRÁRTEXTI -->
      <div id="docContainer" class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 class="font-bold text-sky-900 text-xl border-b pb-2">📖 Námskrá og Kennsluáætlun</h3>
        <div id="docTextHolder" class="text-slate-700 text-sm leading-relaxed space-y-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-sky-900 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_a]:text-sky-600 [&_a]:underline">
          <p class="text-slate-400 animate-pulse text-xs">Sæki námskrá úr Google Docs...</p>
        </div>
      </div>
    </div>
  `;

  openDetailView(data.title, data.icon, baseHtml);

  if (data.docUrl) {
    const docHtml = await fetchGoogleDocContent(data.docUrl);
    const holder = document.getElementById('docTextHolder');
    if (holder) {
      holder.innerHTML = docHtml || '<p class="text-slate-500 italic">Enginn texti fannst í skjalinu.</p>';
    }
  } else {
    const docContainer = document.getElementById('docContainer');
    if (docContainer) docContainer.remove();
  }
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
