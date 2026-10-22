/**
 * Modul Penelitian & Usulan Baru Logic - LPPM UMSU & RisetMu
 * File: js/penelitian.js (Khusus Daftar & Riwayat Penelitian)
 */

// Database dummy riwayat penelitian
const penelitianDatabase = {
  101: {
    title: 'PENGEMBANGAN SISTEM DETEKSI DINI STUNTING MENGGUNAKAN ALGORITMA CONVOLUTIONAL NEURAL NETWORK BERBASIS EDGE COMPUTING',
    skema: 'Penelitian Terapan Unggulan (PTU)',
    tahun: '2025/2026',
    ketua: 'Yoshida Sary, M.Kom. (NIDN: 0123456789)',
    anggota: '1. Dr. Hendra Cipta, M.Si.\n2. Faisal Rahman (Mahasiswa NIM: 22018045)',
    mitra: 'Dinas Kesehatan Kota Medan',
    dana: 'Rp 45.000.000,- (Didanai RisetMu)',
    status: 'Didanai (Tahap Verifikasi Laporan Akhir)',
    tahapan: 'Laporan Akhir 100% Selesai'
  },
  102: {
    title: 'MODEL TATA KELOLA DATA SMART CITY BERBASIS OPEN GOVERNMENT DATA PADA PEMERINTAH DAERAH',
    skema: 'Penelitian Dasar Pengembangan (PDP)',
    tahun: '2024/2025',
    ketua: 'Yoshida Sary, M.Kom.',
    anggota: '1. Ir. Bambang Hermanto, M.T.\n2. Rina Lestari, S.Kom.',
    mitra: 'Diskominfo Pemprov Sumatera Utara',
    dana: 'Rp 30.000.000,- (Didanai RisetMu)',
    status: 'Selesai & Terpublikasi di Jurnal Sinta 2',
    tahapan: 'Publikasi Selesai'
  }
};

// Inisialisasi saat DOM siap di penelitian.html
document.addEventListener('DOMContentLoaded', () => {
  renderRiwayatPenelitian();
  initTableFilters();
});

// Render daftar riwayat penelitian di panel samping
function renderRiwayatPenelitian() {
  const container = document.getElementById('penelitianHistoryList');
  if (!container) return;

  const keys = Object.keys(penelitianDatabase);
  if (keys.length === 0) {
    container.innerHTML = `
      <li class="empty-item">
        <span class="bullet-circle"></span>
        <span>Belum ada penelitian yang didanai.</span>
      </li>
    `;
    return;
  }

  container.innerHTML = keys.map(id => {
    const item = penelitianDatabase[id];
    return `
      <li class="history-item">
        <span class="bullet-circle bullet-coral"></span>
        <a href="javascript:void(0)" class="proposal-title-link" onclick="openDetailPenelitianModal(${id})">
          ${item.title}
        </a>
      </li>
    `;
  }).join('');
}

// Buka Modal Usulan Penelitian Baru
function openUsulanPenelitianModal() {
  if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
  const modal = document.getElementById('usulanPenelitianModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

// Tutup Modal Usulan Penelitian Baru
function closeUsulanPenelitianModal() {
  const modal = document.getElementById('usulanPenelitianModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

// Submit Form Usulan Baru Penelitian
function submitUsulanPenelitian(event) {
  event.preventDefault();

  const judul = document.getElementById('usulanJudul').value.trim();
  const skema = document.getElementById('usulanSkema').value;
  const dana = document.getElementById('usulanDana').value;
  const anggota = document.getElementById('usulanAnggota').value.trim();
  const mitra = document.getElementById('usulanMitra').value.trim();

  if (!judul) {
    if (typeof showToast === 'function') showToast('Judul penelitian wajib diisi!', 'info');
    return;
  }

  // Generate ID baru
  const newId = Date.now();
  penelitianDatabase[newId] = {
    title: judul.toUpperCase(),
    skema: skema,
    tahun: '2026/2027',
    ketua: 'Yoshida Sary, M.Kom. (NIDN: 0123456789)',
    anggota: anggota || 'Belum ditambahkan',
    mitra: mitra || 'Mitra Akademik Internal',
    dana: 'Rp ' + Number(dana).toLocaleString('id-ID') + ',- (Usulan)',
    status: 'Diajukan (Menunggu Reviewer LPPM)',
    tahapan: 'Tahap Seleksi Administrasi'
  };

  // Re-render daftar riwayat
  renderRiwayatPenelitian();

  // Update angka statistik di Card Penelitian
  const statCard = document.querySelector('.stat-card-coral .stat-number');
  if (statCard) {
    const currentCount = parseInt(statCard.textContent) || 4;
    statCard.textContent = currentCount + 1;
    statCard.style.transform = 'scale(1.2)';
    setTimeout(() => { statCard.style.transform = 'scale(1)'; }, 300);
  }

  // Tutup Modal & Bersihkan form
  document.getElementById('formUsulanPenelitian').reset();
  closeUsulanPenelitianModal();

  if (typeof showToast === 'function') {
    showToast('Usulan Penelitian "' + judul.substring(0, 35) + '..." berhasil diajukan!', 'success');
  }
}

// Buka Modal Detail Usulan Penelitian
function openDetailPenelitianModal(id) {
  const item = penelitianDatabase[id];
  if (!item) return;

  const titleEl = document.getElementById('modalProposalTitle');
  if (titleEl) titleEl.textContent = 'Detail Usulan Penelitian Dosen';

  const bodyEl = document.getElementById('modalProposalBody');
  if (bodyEl) {
    bodyEl.innerHTML = `
      <table class="detail-table">
        <tr>
          <th>Judul Penelitian</th>
          <td><strong>${item.title}</strong></td>
        </tr>
        <tr>
          <th>Skema Usulan</th>
          <td><span class="status-pill-success">${item.skema}</span></td>
        </tr>
        <tr>
          <th>Tahun Pelaksanaan</th>
          <td>${item.tahun}</td>
        </tr>
        <tr>
          <th>Ketua Peneliti</th>
          <td>${item.ketua}</td>
        </tr>
        <tr>
          <th>Anggota Peneliti</th>
          <td style="white-space: pre-line;">${item.anggota}</td>
        </tr>
        <tr>
          <th>Mitra Sasaran / Lokasi</th>
          <td>${item.mitra}</td>
        </tr>
        <tr>
          <th>Usulan Pendanaan</th>
          <td><strong style="color: #059669;">${item.dana}</strong></td>
        </tr>
        <tr>
          <th>Status Usulan</th>
          <td><span class="status-pill-success"><i class="fa-solid fa-clock-rotate-left"></i> ${item.status}</span></td>
        </tr>
        <tr>
          <th>Tahapan Saat Ini</th>
          <td>${item.tahapan}</td>
        </tr>
      </table>
    `;
  }

  if (typeof openModal === 'function') {
    openModal('proposalModal');
  }
}

// Table Filter on penelitian.html
function initTableFilters() {
  const tabs = document.querySelectorAll('.filter-tab-pill');
  const rows = document.querySelectorAll('.proposal-data-row');
  if (!tabs.length || !rows.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all' || row.dataset.status === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
      if (typeof showToast === 'function') {
        showToast('Filter: ' + tab.textContent);
      }
    });
  });
}
