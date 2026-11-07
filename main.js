let currentViewHistory = [];

// ==================== NAVIGATION & VIEWS ====================

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

function renderStaffCard(staffKey) {
  const p = window.STAFF_MEMBERS ? window.STAFF_MEMBERS[staffKey] : null;
  if (!p) return '';
  return `
    <button onclick="openTeacherModal('${p.name}', '${p.role}', '${p.email}', 'images/${p.img}')" class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-100 text-left w-full transition group shadow-sm">
      <img src="images/${p.img}" alt="${p.name}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0 group-hover:scale-105 transition" onerror="this.src='https://via.placeholder.com/150?text=${encodeURIComponent(p.name ? p.name.split(' ')[0] : 'Starfsmaður')}';">
      <div class="overflow-hidden">
        <h5 class="font-bold text-xs text-slate-900 group-hover:text-sky-700 truncate">${p.name}</h5>
        <p class="text-xs text-slate-500 truncate">${p.role}</p>
      </div>
    </button>
  `;
}

// ==================== GOOGLE DOCS SÆKIR ====================

async function fetchGoogleDocContent(docUrl) {
  if (!docUrl) return '';
  
  try {
    // CORS proxy til að vafrinn leyfi að sækja opinbera skjalið
    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(docUrl);
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Netvilla við að sækja skjal');

    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Náum í meginmál Google Doc skjalsins
    const content = doc.querySelector('#contents') || doc.body;
    if (!content) return '';

    // Fjarlægjum innbyggða stíla og skriftur úr Google
    const stylesAndScripts = content.querySelectorAll('style, script');
    stylesAndScripts.forEach(el => el.remove());

    // Hreinsum öll inline-style og class eigindi svo Tailwind liti og stýri öllu
    const allElements = content.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('style');
      el.removeAttribute('class');
    });

    return content.innerHTML;
  } catch (error) {
    console.error('Tókst ekki að sækja Google Doc:', error);
    return '<p class="text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-200/60">Tókst ekki að hlaða texta úr Google Docs. Athugaðu hvort skjalið sé örugglega gefið út á vefnum.</p>';
  }
}

// ==================== ÁRGANGASÍÐA ====================

async function openYearDetail(yearId) {
  const data = window.YEARS_DATA ? window.YEARS_DATA[yearId] : null;
  
  if (!data) {
    openDetailView('Árgangur', '🎓', '<div class="bg-white p-6 rounded-3xl border border-slate-200/80"><p class="text-slate-600 text-sm">Upplýsingar í vinnslu.</p></div>');
    return;
  }

  // Teiknum upp starfsfólk
  const teachers = (data.staff && data.staff.teachers || []).map(renderStaffCard).join('');
  const support = (data.staff && data.staff.support || []).map(renderStaffCard).join('');
  const assistants = (data.staff && data.staff.assistants || []).map(renderStaffCard).join('');
  const managers = (data.staff && data.staff.managers || []).map(renderStaffCard).join('');

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

      <!-- KENNARAR OG STARFSFÓLK -->
      <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b pb-2">
          <h3 class="font-bold text-sky-900 text-xl">👥 Starfsfólk árgangsins</h3>
          <span class="text-xs text-slate-400 italic">Smelltu til að opna samskiptaupplýsingar</span>
        </div>

        ${teachers ? `<div><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">👩‍🏫 Umsjónarkennarar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${teachers}</div></div>` : ''}
        ${support ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🤝 Stoðþjónusta & Þroskaþjálfar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${support}</div></div>` : ''}
        ${assistants ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🌱 Stuðningsfulltrúar</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">${assistants}</div></div>` : ''}
        ${managers ? `<div class="pt-3 border-t border-slate-100"><h4 class="font-semibold text-xs text-sky-800 uppercase tracking-wider mb-2">🏫 Stjórnendur</h4><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">${managers}</div></div>` : ''}
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

  // Sækjum megintextann úr Google Doc ef slóð er skráð
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
