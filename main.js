// ==========================================
// main.js - Skólanámskrá Vallaskóla (1.–7. árgangur)
// ==========================================

// 1. Frumstilling á víðværum breytum
if (!window.YEARS_DATA) window.YEARS_DATA = {};
if (!window.STAFF_DATA) window.STAFF_DATA = [];
var currentViewHistory = currentViewHistory || [];

// 2. Birta yfirlit yfir alla árganga (Forsíða)
window.showYears = function() {
  const container = document.getElementById('content-area') || document.getElementById('app') || document.body;

  const yearsList = window.YEARS_LIST || [
    { id: 'y1', title: '1. árgangur', icon: '🌱' },
    { id: 'y2', title: '2. árgangur', icon: '🍃' },
    { id: 'y3', title: '3. árgangur', icon: '☘️' },
    { id: 'y4', title: '4. árgangur', icon: '🌿' },
    { id: 'y5', title: '5. árgangur', icon: '🌳' },
    { id: 'y6', title: '6. árgangur', icon: '🌲' },
    { id: 'y7', title: '7. árgangur', icon: '🌴' },
    { id: 'y8', title: '8. árgangur', icon: '🌋' },
    { id: 'y9', title: '9. árgangur', icon: '🏔️' },
    { id: 'y10', title: '10. árgangur', icon: '🎓' },
    { id: 'stod', title: 'Stoðþjónusta', icon: '🧩' },
    { id: 'isat', title: 'ÍSAT', icon: '💬' }
  ];

  const cardsHtml = yearsList.map(item => `
    <button onclick="loadYearView('${item.id}')" class="bg-white border border-slate-200 hover:border-sky-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-36 group cursor-pointer">
      <div class="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">${item.icon || '📚'}</div>
      <div>
        <div class="font-extrabold text-slate-900 text-lg group-hover:text-sky-600 transition-colors">${item.title}</div>
        <div class="text-xs text-slate-500">Skoða námskrá</div>
      </div>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="max-w-5xl mx-auto p-4 md:p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-extrabold text-sky-950">Skólanámskrá Vallaskóla</h1>
        <p class="text-sm text-slate-500 mt-1">Veldu árgang eða þjónustu til að skoða námskrá og starfsfólk</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        ${cardsHtml}
      </div>
    </div>
  `;
};

// 3. Hjálparfall til að búa til starfsmannakort
function createStaffCardsHtml(staffList) {
  if (!staffList || staffList.length === 0) return '';

  return staffList.map(person => {
    const initials = person.name
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return `
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0">
          ${initials}
        </div>
        <div class="min-w-0">
          <div class="font-bold text-slate-800 text-sm truncate">${person.name}</div>
          <div class="text-xs text-slate-500 truncate
