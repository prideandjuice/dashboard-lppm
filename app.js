/**
 * RisetMu Dashboard - Application Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initChart();
  initDropdowns();
  setupKeyboardShortcuts();
});

// Chart Instance reference
let chartInstance = null;

// Initialize Chart.js with exact data from screenshot
function initChart() {
  const ctx = document.getElementById('penelitianChart');
  if (!ctx) return;

  const labels = [
    '2012', '2013', '2014', '2015', '2016', 
    '2017', '2018', '2019', '2020', '2021', 
    '2022', '2023', '2024', '2025', '2026'
  ];

  // Data from screenshot:
  // Usulan jumps to 1 at 2024, stays 1 at 2025, rises to 2 at 2026
  const dataUsulan = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2];
  // Didanai stays 0 across all years
  const dataDidanai = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Usulan',
          data: dataUsulan,
          borderColor: '#7c3aed', // Purple line
          backgroundColor: 'rgba(124, 58, 237, 0.08)',
          borderWidth: 2.5,
          tension: 0.35, // Smooth bezier curve matching screenshot
          fill: false,
          pointBackgroundColor: '#7c3aed',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4.5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#6d28d9',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2.5
        },
        {
          label: 'Didanai',
          data: dataDidanai,
          borderColor: '#e83e8c', // Pink / Magenta line
          backgroundColor: 'rgba(232, 62, 140, 0.08)',
          borderWidth: 2.5,
          tension: 0.35,
          fill: false,
          pointBackgroundColor: '#e83e8c',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4.5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#d63384',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // We use our custom header legend buttons
        },
        tooltip: {
          backgroundColor: '#1e295f',
          titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '700' },
          bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
          padding: 10,
          cornerRadius: 8,
          boxPadding: 4,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.parsed.y} judul`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
            color: '#64748b'
          }
        },
        y: {
          min: 0,
          max: 2,
          ticks: {
            stepSize: 1,
            precision: 0,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
            color: '#64748b'
          },
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

// Toggle datasets visibility from legend pills
function toggleDataset(index) {
  if (!chartInstance) return;
  const isVisible = chartInstance.isDatasetVisible(index);
  chartInstance.setDatasetVisibility(index, !isVisible);
  chartInstance.update();

  const buttonId = index === 0 ? 'toggleUsulan' : 'toggleDidanai';
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.style.opacity = isVisible ? '0.4' : '1';
    btn.style.textDecoration = isVisible ? 'line-through' : 'none';
  }
}

// Filter or highlight stats when clicking stat cards
function filterChart(type) {
  if (!chartInstance) return;
  
  if (type === 'penelitian') {
    showToast('Fokus: Riwayat Penelitian (4 Usulan Didanai)');
    chartInstance.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2];
    chartInstance.data.datasets[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    document.querySelector('.chart-title').textContent = 'Penelitian';
    document.querySelector('.chart-subtitle').textContent = 'Data riwayat usulan yang sudah Diterima dan pengumuman periode sudah berlalu.';
  } else if (type === 'pengabdian') {
    showToast('Fokus: Riwayat Pengabdian kepada Masyarakat (4 Didanai)');
    chartInstance.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0];
    chartInstance.data.datasets[1].data = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0];
    document.querySelector('.chart-title').textContent = 'Pengabdian kepada Masyarakat';
    document.querySelector('.chart-subtitle').textContent = 'Data riwayat pengabdian yang telah selesai dan didanai RisetMu.';
  } else if (type === 'artikel') {
    showToast('Fokus: Pendampingan Artikel Ilmiah');
    chartInstance.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    chartInstance.data.datasets[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    document.querySelector('.chart-title').textContent = 'Pendampingan Artikel';
    document.querySelector('.chart-subtitle').textContent = 'Belum ada usulan pendampingan artikel pada periode ini.';
  } else if (type === 'proposal') {
    showToast('Fokus: Pendampingan Proposal');
    chartInstance.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    chartInstance.data.datasets[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    document.querySelector('.chart-title').textContent = 'Pendampingan Proposal';
    document.querySelector('.chart-subtitle').textContent = 'Belum ada usulan pendampingan proposal pada periode ini.';
  }
  chartInstance.update();
}

// Dropdown Menus Controller
function initDropdowns() {
  const configs = [
    { btn: 'yearDropdownBtn', menu: 'yearDropdownMenu' },
    { btn: 'roleDropdownBtn', menu: 'roleDropdownMenu' },
    { btn: 'notifBtn', menu: 'notifMenu' },
    { btn: 'userProfileBtn', menu: 'userMenu' }
  ];

  configs.forEach(({ btn, menu }) => {
    const buttonEl = document.getElementById(btn);
    const menuEl = document.getElementById(menu);
    if (!buttonEl || !menuEl) return;

    buttonEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShown = menuEl.classList.contains('show');
      closeAllDropdowns();
      if (!isShown) {
        menuEl.classList.add('show');
        buttonEl.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Handle Year selection
  const yearItems = document.querySelectorAll('#yearDropdownMenu .dropdown-item');
  yearItems.forEach(item => {
    item.addEventListener('click', () => {
      const selected = item.getAttribute('data-year');
      document.getElementById('selectedYear').textContent = selected;
      yearItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      closeAllDropdowns();
      showToast(`Tahun Akademik dialihkan ke ${selected}`);
    });
  });

  // Handle Role selection
  const roleItems = document.querySelectorAll('#roleDropdownMenu .dropdown-item');
  roleItems.forEach(item => {
    item.addEventListener('click', () => {
      const selected = item.getAttribute('data-role');
      document.getElementById('selectedRole').textContent = selected;
      roleItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      closeAllDropdowns();
      showToast(`Peran pengguna beralih menjadi ${selected}`);
    });
  });

  // Handle sub-nav dropdowns (Penelitian, Pengabdian, Pendampingan, Reviewer)
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    const link = item.querySelector('.nav-link');
    if (!link) return;

    link.addEventListener('click', (e) => {
      const isAlreadyOpen = item.classList.contains('show');
      
      // Tutup dropdown lain yang sedang terbuka
      document.querySelectorAll('.nav-item.has-dropdown').forEach(other => {
        if (other !== item) other.classList.remove('show');
      });

      if (!isAlreadyOpen) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.add('show');
      }
      // Jika sudah terbuka, klik kembali pada judul link akan mengarahkan ke halaman default (penelitian.html)
    });
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    item.classList.remove('show');
  });
  document.querySelectorAll('.nav-dropdown-btn, .user-profile-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

// Sync Data with SINTA & Kemdikbudristek
function syncData() {
  const syncBtn = document.getElementById('syncBtn');
  const icon = syncBtn.querySelector('.sync-icon');
  
  if (icon.classList.contains('rotating')) return;
  
  icon.classList.add('rotating');
  syncBtn.style.opacity = '0.7';
  
  showToast('Memulai sinkronisasi data dengan SINTA & PDDikti...');

  setTimeout(() => {
    icon.classList.remove('rotating');
    syncBtn.style.opacity = '1';
    
    // Simulate updating score
    const sintaEl = document.getElementById('sintaScore');
    if (sintaEl) {
      sintaEl.textContent = '612';
      sintaEl.style.color = '#10b981';
      setTimeout(() => { sintaEl.style.color = 'var(--accent-blue)'; }, 2000);
    }
    
    showToast('Sinkronisasi Berhasil! Data SINTA Score terupdate: 612', 'success');
  }, 1400);
}

// Modal Controllers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

function handleBackdropClick(event, id) {
  if (event.target.id === id) {
    closeModal(id);
  }
}

function openProfileModal() {
  closeAllDropdowns();
  openModal('profileModal');
}

function saveProfile(event) {
  event.preventDefault();
  const name = document.getElementById('editName').value;
  const dept = document.getElementById('editDept').value;
  const univ = document.getElementById('editUniv').value;
  const sinta = document.getElementById('editSinta').value;

  document.querySelector('.lecturer-name').textContent = name.split(',')[0];
  document.querySelector('.lecturer-dept').textContent = dept;
  document.querySelector('.lecturer-univ').textContent = univ;
  document.getElementById('sintaScore').textContent = sinta;

  closeModal('profileModal');
  showToast('Perubahan profil berhasil disimpan!', 'success');
}

// Detail Proposal Data & Modal Handler
const proposalDatabase = {
  1: {
    title: 'PEMBERDAYAAN EKONOMI PEREMPUAN MELALUI DIGITAL MARKETING PADA ANGGOTA RANTING AISYIYAH CABANG HELVETIA',
    skema: 'Pemberdayaan Kemitraan Masyarakat (PKM)',
    tahun: '2026/2027',
    ketua: 'Yoshida Sary, M.Kom. (NIDN: 0123456789)',
    anggota: '1. Dr. Nurul Hidayah, M.Si.\n2. Rahmat Hidayat, S.Kom., M.Kom.\n3. Salsa Bila (Mahasiswa NIM: 22018001)',
    mitra: 'Pimpinan Ranting Aisyiyah Cabang Helvetia, Medan',
    dana: 'Rp 24.500.000,- (Didanai RisetMu)',
    status: 'Didanai (Kontrak Berjalan)',
    tahapan: 'Laporan Kemajuan Sedang Diproses'
  },
  2: {
    title: 'Pemberdayaan Ekonomi Perempuan Melalui Digital Marketing Pada Anggota Ranting Aisyiyah Cabang Helvetia (Tahap Lanjutan)',
    skema: 'Program Kemitraan Masyarakat Lanjutan (PKM-L)',
    tahun: '2025/2026',
    ketua: 'Yoshida Sary, M.Kom.',
    anggota: '1. Dr. Nurul Hidayah, M.Si.\n2. Muhammad Ihsan, M.Kom.',
    mitra: 'Pimpinan Ranting Aisyiyah Cabang Helvetia',
    dana: 'Rp 22.000.000,- (Didanai RisetMu)',
    status: 'Selesai (Laporan Akhir Terverifikasi)',
    tahapan: 'Telah Selesai 100%'
  }
};

function openProposalDetailModal(id) {
  const p = proposalDatabase[id];
  if (!p) return;

  const bodyEl = document.getElementById('modalProposalBody');
  bodyEl.innerHTML = `
    <table class="detail-table">
      <tr>
        <th>Judul Kegiatan</th>
        <td><strong>${p.title}</strong></td>
      </tr>
      <tr>
        <th>Skema Usulan</th>
        <td><span class="status-pill-success">${p.skema}</span></td>
      </tr>
      <tr>
        <th>Tahun Pelaksanaan</th>
        <td>${p.tahun}</td>
      </tr>
      <tr>
        <th>Ketua Pelaksana</th>
        <td>${p.ketua}</td>
      </tr>
      <tr>
        <th>Anggota Pelaksana</th>
        <td style="white-space: pre-line;">${p.anggota}</td>
      </tr>
      <tr>
        <th>Mitra Sasaran</th>
        <td>${p.mitra}</td>
      </tr>
      <tr>
        <th>Persetujuan Pendanaan</th>
        <td><strong style="color: #059669;">${p.dana}</strong></td>
      </tr>
      <tr>
        <th>Status Usulan</th>
        <td><span class="status-pill-success"><i class="fa-solid fa-check"></i> ${p.status}</span></td>
      </tr>
      <tr>
        <th>Tahapan Saat Ini</th>
        <td>${p.tahapan}</td>
      </tr>
    </table>
  `;

  openModal('proposalModal');
}

// Toast Notifications System
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  
  const icon = type === 'success' ? 'fa-circle-check text-green' : 'fa-circle-info text-blue';
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3200);
}

// Keyboard shortcuts (e.g. Esc to close modal)
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('proposalModal');
      closeModal('profileModal');
      closeAllDropdowns();
    }
  });
}
