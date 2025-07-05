const cases = [
  { caseNumber: "001", officerName: "John Doe", status: "Open", category: "Misconduct", summary: "Unprofessional behavior", isSensitive: false, isBlackReport: false },
  { caseNumber: "002", officerName: "Jane Smith", status: "Under Review", category: "Abuse of Power", summary: "Unauthorized search", isSensitive: true, isBlackReport: true },
];

const ctxCat = document.getElementById('categoryChart').getContext('2d');
const ctxStatus = document.getElementById('statusChart').getContext('2d');
let categoryChart, statusChart;

function generateCharts(casesArr) {
  const catCounts = {};
  const statusCounts = {};
  casesArr.forEach(c => { catCounts[c.category] = (catCounts[c.category]||0)+1; statusCounts[c.status] = (statusCounts[c.status]||0)+1; });
  const catLabels = Object.keys(catCounts); const catData = catLabels.map(k=>catCounts[k]);
  const statusLabels = Object.keys(statusCounts); const statusData = statusLabels.map(k=>statusCounts[k]);
  if(categoryChart) categoryChart.destroy(); if(statusChart) statusChart.destroy();
  categoryChart = new Chart(ctxCat, { type: 'pie', data: { labels:catLabels, datasets:[{data:catData, backgroundColor: ['#4f46e5','#6366f1','#a78bfa','#818cf8'] }] } });
  statusChart = new Chart(ctxStatus, { type: 'doughnut', data: { labels:statusLabels, datasets:[{data:statusData, backgroundColor: ['#e53e3e','#dd6b20','#38a169','#718096'] }] } });
}

function updateDisplay(casesArr) {
  document.getElementById('totalCount').textContent = casesArr.length;
  document.getElementById('blackCount').textContent = casesArr.filter(c=>c.isBlackReport).length;
  generateCharts(casesArr);
  const list = document.getElementById('caseList');
  list.innerHTML = '';
  casesArr.forEach(c => {
    const div = document.createElement('div'); div.className = 'case-card';
    div.innerHTML = `
      <h4>Case ${c.caseNumber} ${c.isBlackReport ? '<span class="black-report">BLACK</span>' : ''}</h4>
      <p><strong>Officer:</strong> ${c.officerName}</p>
      <p><strong>Category:</strong> ${c.category}</p>
      <p>${c.summary}</p>
      <span class="status-badge badge-${c.status.replace(/\s/g,'\\ ')}">${c.status}</span>
      ${c.isSensitive ? `<p style="color:#e53e3e; font-style:italic;">🔒 Sensitive</p>` : ''}
    `;
    list.append(div);
  });
}

function applyFilters() {
  const cat = document.getElementById('categoryFilter').value;
  const stat = document.getElementById('statusFilter').value;
  const txt = document.getElementById('searchInput').value.toLowerCase();
  let filtered = cases.filter(c =>
    (cat==='All Categories'||c.category===cat) &&
    (stat==='All Statuses'||c.status===stat) &&
    (
      c.caseNumber.toLowerCase().includes(txt) ||
      c.officerName.toLowerCase().includes(txt)
    )
  );
  updateDisplay(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  ['categoryFilter','statusFilter'].forEach(id => document.getElementById(id).addEventListener('change', applyFilters));
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.getElementById('themeToggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });
  document.getElementById('exportBtn').addEventListener('click', () =>
    alert('📄 PDF export will be implemented via server or JS library.')
  );
  applyFilters();
});
