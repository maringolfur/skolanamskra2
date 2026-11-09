if (!window.YEARS_DATA) window.YEARS_DATA = {};

window.YEARS_DATA['y8'] = {
  title: '8. árgangur',
  icon: '🌋',
  info: {
    students: 'Nemendur (skólaárið 2026–2027)',
    rooms: 'Stofur 8. árgangs (unglingastig)',
    hours: 'Hefst alla daga kl. 08:10 (30 stundir/viku)',
    recess: 'Kl. 09:30 – 09:50 alla daga',
    lunch: 'Kl. 11:30 – 12:00'
  },
  docHtml: `
    <h1 class="text-2xl font-extrabold text-sky-900 border-b pb-2">Námskrá og kennsluáætlun 8. árgangs</h1>
    <p class="text-slate-600 leading-relaxed pt-2 mb-6">Velkomin í 8. bekk Vallaskóla! Hér birtast helstu upplýsingar um starfsfólk, teymisskiptingu og námskrá árgangsins.</p>

    <!-- 1. UMSJÓNARKENNARAR -->
    <h2 class="text-lg font-bold text-slate-800 border-b pb-1 mb-3 flex items-center gap-2">
      <span class="text-xl">🏫</span> Umsjónarkennarar
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <div class="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">T</div>
        <div>
          <div class="font-bold text-sky-950 text-sm">Tómas</div>
          <div class="text-xs text-sky-700">Umsjónarkennari 8. bekkjar</div>
        </div>
      </div>
      <div class="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">M</div>
        <div>
          <div class="font-bold text-sky-950 text-sm">Matthías</div>
          <div class="text-xs text-sky-700">Umsjónarkennari 8. bekkjar</div>
        </div>
      </div>
    </div>

    <!-- 2. STUÐNINGSFULLTRÚAR -->
    <h2 class="text-lg font-bold text-slate-800 border-b pb-1 mb-3 flex items-center gap-2">
      <span class="text-xl">🤝</span> Stuðningsfulltrúar
    </h2>
    <div id="y8-support-staff" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      <p class="text-slate-500 text-sm italic col-span-full">Stuðningsfulltrúar raðast sjálfkrafa hér úr starfsmannalistanum.</p>
    </div>

    <!-- 3. KENNARATEYMI -->
    <h2 class="text-lg font-bold text-slate-800 border-b pb-1 mb-3 flex items-center gap-2">
      <span class="text-xl">👥</span> Kennarateymi 8. árgangs
    </h2>

    <!-- Ísam -->
    <h3 class="text-sm font-bold text-slate-700 mt-3 mb-2 flex items-center gap-2">
      <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-semibold">📖 Ísam</span>
      Íslenska & Samfélagsfræði
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">E</div>
        <div><div class="font-bold text-slate-800 text-sm">Elsie</div><div class="text-xs text-slate-500">Ísam kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">ÍD</div>
        <div><div class="font-bold text-slate-800 text-sm">Íris Dröfn</div><div class="text-xs text-slate-500">Ísam kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">GB</div>
        <div><div class="font-bold text-slate-800 text-sm">Guðrún Björg</div><div class="text-xs text-slate-500">Ísam kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">GS</div>
        <div><div class="font-bold text-slate-800 text-sm">Guðríður Svava</div><div class="text-xs text-slate-500">Ísam kennari</div></div>
      </div>
    </div>

    <!-- Stæ/Nát -->
    <h3 class="text-sm font-bold text-slate-700 mt-3 mb-2 flex items-center gap-2">
      <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">📐 Stæ / Nát</span>
      Stærðfræði & Náttúrufræði
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">H</div>
        <div><div class="font-bold text-slate-800 text-sm">Hólmar</div><div class="text-xs text-slate-500">Stæ/Nát kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">M</div>
        <div><div class="font-bold text-slate-800 text-sm">Magdalena</div><div class="text-xs text-slate-500">Stæ/Nát kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">SÁ</div>
        <div><div class="font-bold text-slate-800 text-sm">Stefán Ármann</div><div class="text-xs text-slate-500">Stæ/Nát kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">R</div>
        <div><div class="font-bold text-slate-800 text-sm">Ríkharður</div><div class="text-xs text-slate-500">Stæ/Nát kennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">SH</div>
        <div><div class="font-bold text-slate-800 text-sm">Sigurður Halldór</div><div class="text-xs text-slate-500">Stæ/Nát kennari</div></div>
      </div>
    </div>

    <!-- Tungumálateymi -->
    <h3 class="text-sm font-bold text-slate-700 mt-3 mb-2 flex items-center gap-2">
      <span class="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-semibold">🌍 Tungumálateymi</span>
      Enska & Danska
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">GF</div>
        <div><div class="font-bold text-slate-800 text-sm">Gísli Felix</div><div class="text-xs text-slate-500">Tungumálakennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">M</div>
        <div><div class="font-bold text-slate-800 text-sm">Matthías</div><div class="text-xs text-slate-500">Tungumálakennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">G</div>
        <div><div class="font-bold text-slate-800 text-sm">Guðbjartur</div><div class="text-xs text-slate-500">Tungumálakennari</div></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">TÓ</div>
        <div><div class="font-bold text-slate-800 text-sm">Tinna Ósk</div><div class="text-xs text-slate-500">Tungumálakennari</div></div>
      </div>
    </div>

    <!-- 4. STOÐÞJÓNUSTA -->
    <h2 class="text-lg font-bold text-slate-800 border-b pb-1 mb-3 flex items-center gap-2">
      <span class="text-xl">🧩</span> Stoðþjónusta
    </h2>
    <div id="y8-stod-staff" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      <p class="text-slate-500 text-sm italic col-span-full">Sérkennarar og þroskaþjálfar 8. bekkjar birtast hér.</p>
    </div>

    <!-- 5. AÐRIR KENNARAR -->
    <h2 class="text-lg font-bold text-slate-800 border-b pb-1 mb-3 flex items-center gap-2">
      <span class="text-xl">🎨</span> Aðrir kennarar (List- og verkgreinar / Íþróttir)
    </h2>
    <div id="y8-other-teachers" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      <p class="text-slate-500 text-sm italic col-span-full">Aðrir faggreinakennarar sem kenna 8. bekk birtast hér.</p>
    </div>

    <!-- 6. STJÓRNENDUR -->
    <h2 class="text-lg font-bold text-slate-800 border-b pb-1 mb-3 flex items-center gap-2">
      <span class="text-xl">👔</span> Stjórnendur
    </h2>
    <div id="y8-management-staff" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      <p class="text-slate-500 text-sm italic col-span-full">Stjórnendur unglingastigs og skóla birtast hér neðst.</p>
    </div>

    <!-- NÁMSKRÁ & ÁHERSLUR -->
    <h2 class="text-xl font-bold text-slate-800 pt-4 border-t">Helstu áherslur og námsmarkmið</h2>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-700">
      <li><strong>Ísam:</strong> Textagreining, rökstudd ritun, bókmenntir, samfélagsmál og saga.</li>
      <li><strong>Stæ/Nát:</strong> Algebra, jöfnur, eðlis- og efnafræði, vísindaleg vinnubrögð og tilraunir.</li>
      <li><strong>Tungumál:</strong> Dýpri skilningur og samræður í ensku og dönsku ásamt málfræði og ritun.</li>
      <li><strong>Valgreinar:</strong> Nemendur taka þátt í valgreinum unglingastigs skv. valgreinabæklingi.</li>
    </ul>
  `
};
