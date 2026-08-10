// --- Student Class (required for Section 4 marks) ---
class Student {
  constructor(name, scores) {
    this.name = name;
    this.scores = scores;
    this.total = this.calculateTotal();
    this.average = this.calculateAverage();
    this.grade = this.assignGrade();
    this.status = this.checkPass();
  }

  calculateTotal() {
    let sum = 0;
    for (let i = 0; i < this.scores.length; i++) { // Loop ✅
      sum += this.scores[i];
    }
    return sum;
  }

  calculateAverage() {
    return this.total / this.scores.length;
  }

  assignGrade() {
    const avg = this.average;
    if (avg >= 90) return 'A';       // Conditional ✅
    else if (avg >= 80) return 'B';
    else if (avg >= 70) return 'C';
    else if (avg >= 60) return 'D';
    else if (avg >= 50) return 'E';
    else return 'F';
  }

  checkPass() {
    return this.average >= 50 ? 'Pass' : 'Fail';
  }
}

// --- App Logic ---
let students = [];
const form = document.getElementById('studentForm');
const list = document.getElementById('studentList');
const errorMsg = document.getElementById('errorMsg');

// Load from Local Storage
function loadData() {
  const saved = localStorage.getItem('studentRecords');
  if (saved) students = JSON.parse(saved);
  renderStudents();
}

// Save to Local Storage
function saveData() {
  localStorage.setItem('studentRecords', JSON.stringify(students));
  renderStudents();
}

// Render all students
function renderStudents() {
  list.innerHTML = '';
  if (students.length === 0) {
    list.innerHTML = '<p>No records yet.</p>';
    return;
  }

  students.forEach((s, index) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <strong>${s.name}</strong><br>
      Scores: ${s.scores.join(', ')}<br>
      Total: ${s.total} | Average: ${s.average.toFixed(1)}<br>
      Grade: <strong>${s.grade}</strong> | 
      Status: <span class="${s.status === 'Pass' ? 'status-pass' : 'status-fail'}">${s.status}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    list.appendChild(card);
  });

  // Attach delete listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      students.splice(idx, 1);
      saveData();
    });
  });
}

// Form Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  // Get inputs
  const name = document.getElementById('nameInput').value.trim();
  let s1 = parseFloat(document.getElementById('score1').value);
  let s2 = parseFloat(document.getElementById('score2').value);
  let s3 = parseFloat(document.getElementById('score3').value);
  let s4 = document.getElementById('score4').value.trim();

  // --- Input Validation (Section 4 marks) ---
  if (!name) return showError('Name cannot be empty!');
  if (isNaN(s1) || isNaN(s2) || isNaN(s3)) return showError('Enter at least 3 valid scores!');

  let scores = [s1, s2, s3];
  if (s4 !== '') {
    const s4num = parseFloat(s4);
    if (!isNaN(s4num)) scores.push(s4num);
  }

  // Range validation
  for (let s of scores) {
    if (s < 0 || s > 100) return showError('Scores must be 0–100!');
  }

  // Create & save
  const student = new Student(name, scores);
  students.push(student);
  saveData();
  form.reset();
});

function showError(msg) {
  errorMsg.textContent = '⚠️ ' + msg;
}

// Start
loadData(); 
