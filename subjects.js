window.YEARS_LIST = [
  { id: 'y1', title: '1. árgangur', icon: '🌱' },
  { id: 'y2', title: '2. árgangur', icon: '🍃' },
  { id: 'y3', title: '3. árgangur', icon: '☘️' },
  { id: 'y4', title: '4. árgangur', icon: '🌿' },
  { id: 'y5', title: '5. árgangur', icon: '🌳' },
  { id: 'y6', title: '6. árgangur', icon: '🌲' },
  { id: 'y7', title: '7. árgangur', icon: '🌴' },
  { id: 'y8', title: '8. árgangur', icon: '🪵' },
  { id: 'y9', title: '9. árgangur', icon: '🍂' },
  { id: 'y10', title: '10. árgangur', icon: '🎓' },
  { id: 'stod', title: 'Stoðþjónusta', icon: '🤝' },
  { id: 'isat', title: 'ÍSAT', icon: '🌍' }
];

window.SUBJECTS_TREE = [
  { id: 'islenska', title: 'Íslenska', icon: '📖', type: 'parent', subSubjects: [
    { title: 'Lestur og ylhljóð', icon: '📚', startGrade: 1, endGrade: 10 },
    { title: 'Málfræði', icon: '✏️', startGrade: 1, endGrade: 10 },
    { title: 'Ritun', icon: '📝', startGrade: 1, endGrade: 10 }
  ]},
  { id: 'staerdfraedi', title: 'Stærðfræði', icon: '📐', type: 'grade_select', startGrade: 1, endGrade: 10 },
  { id: 'natturuvisi', title: 'Náttúrufræði', icon: '🔬', type: 'grade_select', startGrade: 1, endGrade: 10 },
  { id: 'samfélagsfræði', title: 'Samfélagsfræði', icon: '🗺️', type: 'grade_select', startGrade: 1, endGrade: 10 },
  { id: 'enska', title: 'Enska', icon: '🇬🇧', type: 'grade_select', startGrade: 4, endGrade: 10 },
  { id: 'danska', title: 'Danska', icon: '🇩🇰', type: 'grade_select', startGrade: 7, endGrade: 10 },
  { id: 'ithrottir', title: 'Skólaíþróttir', icon: '⚽', type: 'grade_select', startGrade: 1, endGrade: 10 },
  { id: 'listverk', title: 'List- og verkgreinar', icon: '🎨', type: 'grade_select', startGrade: 1, endGrade: 10 },
  { id: 'ahugasvid', title: 'Áhugasviðsval', icon: '⭐', type: 'standalone' }
];
