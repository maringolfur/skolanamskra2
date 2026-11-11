// ==========================================
// main.js — Vefur Námskrár Vallaskóla
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

let state = {
  currentSubjectId: null,
  currentGrade: null
};

function initApp() {
  renderSubjectMenu();
  
  // Sjálfgefið val á fyrstu námsgreinina í trénu
  if (window.SUBJECTS_TREE && window.SUBJECTS_TREE.length > 0) {
    selectSubject(window.SUBJECTS_TREE[0].id);
  }
}

// Teikna matseðil fyrir námsgreinar
function renderSubjectMenu() {
  const menuContainer = document.getElementById('subject-nav') || document.getElementById('subject-menu');
  if (!menuContainer) return;

  menuContainer.innerHTML = '';

  window.SUBJECTS_TREE.forEach(subject => {
    const btn = document.createElement('button');
    btn.className = 'subject-nav-btn';
    btn.dataset.id = subject.id;
    btn.innerHTML = `<span class="nav-icon">${subject.icon}</span> <span class="nav-title">${subject.title}</span>`;
    btn.onclick = () => selectSubject(subject.id);
    menuContainer.appendChild(btn);
  });
}

// Velja námsgrein
function selectSubject(subjectId) {
  const subject = window.SUBJECTS_TREE.find(s => s.id === subjectId);
  if (!subject) return;

  state.currentSubjectId = subjectId;

  // Uppfæra virkan hnapp í valmynd
  document.querySelectorAll('.subject-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === subjectId);
  });

  if (subject.type === 'grades') {
    // Grein með árgangaskiptingu (1.–10. bekkur)
    state.currentGrade = subject.startGrade || 1;
    renderGradeSelector(subject);
  } else {
    // Stök síða án árgangastiku (t.d. Áhugasviðsval)
    state.currentGrade = null;
    hideGradeSelector();
  }

  renderContent();
}

// Teikna árgangastiku (1. bekkur – 10. bekkur)
function renderGradeSelector(subject) {
  const gradeNav = document.getElementById('grade-nav') || document.getElementById('grade-selector');
  if (!gradeNav) return;

  gradeNav.style.display = 'flex';
  gradeNav.innerHTML = '';

  const start = subject.startGrade || 1;
  const end = subject.endGrade || 10;

  for (let g = start; g <= end; g++) {
    const btn = document.createElement('button');
    btn.className = `grade-btn ${g === state.currentGrade ? 'active' : ''}`;
    btn.innerText = `${g}. bekkur`;
    btn.onclick = () => selectGrade(g);
    gradeNav.appendChild(btn);
  }
}

// Fela árgangastiku þegar sérsíða er valin
function hideGradeSelector() {
  const gradeNav = document.getElementById('grade-nav') || document.getElementById('grade-selector');
  if (gradeNav) {
    gradeNav.style.display = 'none';
  }
}

// Velja árgang
function selectGrade(grade) {
  state.currentGrade = grade;
  
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText.startsWith(`${grade}.`));
  });

  renderContent();
}

// Teikna megin-efni á síðunni
function renderContent() {
  const contentArea = document.getElementById('content-area') || document.getElementById('main-content');
  if (!contentArea) return;

  const subject = window.SUBJECTS_TREE.find(s => s.id === state.currentSubjectId);
  if (!subject) return;

  // 1. SÉRSTÖK SÍÐA (Áhugasviðsval o.fl.)
  if (subject.type === 'page') {
    const pageData = window.SUBJECT_GRADE_DATA[subject.id];
    
    if (!pageData) {
      contentArea.innerHTML = `<div class="error-msg">Gögn fundust ekki fyrir ${subject.title}.</div>`;
      return;
    }

    let html = `
      <div class="subject-header">
        <h1>${pageData.icon || subject.icon} ${pageData.title || subject.title}</h1>
        <p class="subject-intro">${pageData.description || subject.description || ''}</p>
      </div>
    `;

    // Sections (Upplýsingakassar / Um verkefnið)
    if (pageData.sections && pageData.sections.length > 0) {
      html += `<div class="sections-container">`;
      pageData.sections.forEach(sec => {
        html += `
          <div class="info-card">
            <h2>${sec.icon || ''} ${sec.title}</h2>
            <ul class="info-list">
              ${sec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      });
      html += `</div>`;
    }

    // Flísar (Sýnidæmi, Íþróttir, Tónlist o.s.frv.)
    if (pageData.tiles && pageData.tiles.length > 0) {
      html += `
        <div class="tiles-wrapper">
          <h2 class="tiles-heading">💡 Dæmi um verkefnaflokka</h2>
          <div class="tiles-grid">
            ${pageData.tiles.map(tile => `
              <div class="tile-card" onclick="openTileModal('${tile.id}', '${escapeQuotes(tile.title)}')">
                <div class="tile-icon">${tile.icon}</div>
                <h3>${tile.title}</h3>
                <p>${tile.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    contentArea.innerHTML = html;
    return;
  }

  // 2. ÁRGANGA-GREINAR (Íslenska, Stærðfræði, Enska o.fl.)
  const dataKey = `${subject.id}_${state.currentGrade}`;
  const gradeData = window.SUBJECT_GRADE_DATA ? window.SUBJECT_GRADE_DATA[dataKey] : null;

  let html = `
    <div class="subject-header">
      <h1>${subject.icon} ${subject.title} — ${state.currentGrade}. árgangur</h1>
      ${subject.description ? `<p class="subject-intro">${subject.description}</p>` : ''}
    </div>
  `;

  if (!gradeData) {
    html += `
      <div class="info-card placeholder-card">
        <h3>ℹ️ Efni í vinnslu</h3>
        <p>Kennsluáætlun og hæfniviðmið fyrir ${state.currentGrade}. bekk í ${subject.title} eru í mótun.</p>
      </div>
    `;
  } else {
    if (gradeData.description && gradeData.description !== subject.description) {
      html += `<div class="grade-intro">${gradeData.description}</div>`;
    }

    if (gradeData.sections) {
      html += `<div class="sections-container">`;
      gradeData.sections.forEach(sec => {
        html += `
          <div class="info-card">
            <h2>${sec.icon || ''} ${sec.title}</h2>
            <ul class="info-list">
              ${sec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      });
      html += `</div>`;
    }
  }

  contentArea.innerHTML = html;
}

// Hjálparfall fyrir strin-escapes í onclick
function escapeQuotes(str) {
  return (str || '').replace(/'/g, "\\'");
}

// Glugga-fall (Modal) þegar smellt er á flísar
function openTileModal(tileId, tileTitle) {
  const modal = document.getElementById('tile-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (modal && modalTitle && modalBody) {
    modalTitle.innerText = tileTitle || 'Verkefnaflokkur';
    modalBody.innerHTML = `
      <p>Hér getur kennari eða nemandi skoðað upplýsingar, viðmið og dæmi um verkefni í flokknum <strong>${tileTitle}</strong>.</p>
      <ul>
        <li>Dæmi um framkvæmd og lokaafurð nemenda.</li>
        <li>Gátlisti fyrir verkáætlun og frumkvæði.</li>
        <li>Hlekkir á hugmyndabanka og kennsluleiðbeiningar.</li>
      </ul>
    `;
    modal.style.display = 'flex';
  } else {
    alert(`Flokkur valinn: ${tileTitle}`);
  }
}

function closeModal() {
  const modal = document.getElementById('tile-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}
