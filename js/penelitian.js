/**
 * Modul Penelitian & Usulan Baru Logic - LPPM UMSU & RisetMu
 * Standardized single-source JS
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

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  renderRiwayatPenelitian();
  initTableFilters();
  initAccordions();
  initStepper();
  initDynamicResearchFields();
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

// Accordion Collapsible Logic
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const panel = header.closest('.accordion-panel');
      if (panel) {
        panel.classList.toggle('collapsed');
      }
    });
  });
}

// Stepper Progress on usulan-baru.html
function initStepper() {
  const steps = document.querySelectorAll('.step-item');
  if (!steps.length) return;

  steps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      steps.forEach((s, i) => {
        if (i < idx) {
          s.classList.add('completed');
          s.classList.remove('active');
        } else if (i === idx) {
          s.classList.add('active');
          s.classList.remove('completed');
        } else {
          s.classList.remove('active', 'completed');
        }
      });
      const label = step.querySelector('.step-label')?.textContent || '';
      if (typeof showToast === 'function') {
        showToast('Tahap: ' + label);
      }
    });
  });

  const nextBtn = document.getElementById('btnNextWizard');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Data Identitas Usulan tersimpan. Beralih ke Substansi Usulan...', 'success');
      }
      const stepItems = document.querySelectorAll('.step-item');
      if (stepItems.length >= 2) {
        stepItems[0].classList.add('completed');
        stepItems[0].classList.remove('active');
        stepItems[1].classList.add('active');
      }
    });
  }
}

// =========================================================
// DYNAMIC & EDITABLE RESEARCH TAXONOMY & SCHEME (RISETMU)
// =========================================================
const researchTaxonomy = {
  bidangFokus: {
    "Teknologi Informasi dan Komunikasi": {
      temas: {
        "Pengembangan sistem berbasis kecerdasan buatan": [
          "Pengembangan aplikasi sistem cerdas",
          "Machine Learning untuk klasifikasi dan prediksi",
          "Computer Vision untuk inspeksi dan analisis citra",
          "Natural Language Processing untuk teks bahasa Indonesia"
        ],
        "Sistem cerdas Internet of Things (IoT)": [
          "Monitoring sensor cerdas berbasis LoRa/WiFi",
          "Smart Agriculture & Precision Farming System",
          "Smart Campus and Energy Management System"
        ],
        "Keamanan Siber dan Cloud Computing": [
          "Deteksi anomali jaringan berbasis deep learning",
          "Enkripsi dan tata kelola privasi data rekam medis",
          "Audit forensik digital pada infrastruktur cloud"
        ],
        "Sistem Informasi & Tata Kelola Digital": [
          "Arsitektur Enterprise Sistem Informasi Kampus",
          "Sistem Informasi Desa & Tata Kelola Smart Governance",
          "E-Learning Adaptif Berbasis Rekomendasi Algoritmik"
        ]
      }
    },
    "Kesehatan, Obat dan Farmasi": {
      temas: {
        "Teknologi Farmasi dan Formulasi Bahan Alam": [
          "Uji efikasi ekstrak herbal lokal",
          "Formulasi sediaan nano-partikel obat tradisional"
        ],
        "Sistem Informasi Medis dan Kesehatan Masyarakat": [
          "Deteksi dini stunting pada balita berbasis tele-health",
          "Sistem triase darurat klinik pintar"
        ]
      }
    },
    "Pangan, Pertanian dan Perkebunan": {
      temas: {
        "Ketahanan Pangan dan Budidaya Presisi": [
          "Varietas bibit padi tahan kekeringan",
          "Manajemen rantai pasok komoditas kopi Sumatera"
        ]
      }
    },
    "Sosial Humaniora dan Pendidikan": {
      temas: {
        "Inovasi Pembelajaran Digital dan Karakter": [
          "Pengembangan model gamifikasi media ajar",
          "Integrasi nilai Al-Islam dan Kemuhammadiyahan dalam kurikulum digital"
        ]
      }
    }
  }
};

let selectedBidang = "Teknologi Informasi dan Komunikasi";
let selectedTema = "Pengembangan sistem berbasis kecerdasan buatan";
let selectedTopik = "Machine Learning untuk klasifikasi dan prediksi";

function initDynamicResearchFields() {
  const triggerBidang = document.getElementById('triggerBidangFokus');
  const triggerTema = document.getElementById('triggerTema');
  const triggerTopik = document.getElementById('triggerTopik');

  if (!triggerBidang || !triggerTema || !triggerTopik) return;

  setupTagDropdown('triggerBidangFokus', 'dropdownBidangFokus', 'holderBidangFokus', () => {
    return Object.keys(researchTaxonomy.bidangFokus);
  }, (selectedVal) => {
    selectedBidang = selectedVal;
    const temas = Object.keys(researchTaxonomy.bidangFokus[selectedBidang]?.temas || {});
    selectedTema = temas[0] || '';
    renderTagBadge('holderTema', selectedTema, () => triggerTema.click());

    const topiks = researchTaxonomy.bidangFokus[selectedBidang]?.temas[selectedTema] || [];
    selectedTopik = topiks[0] || '';
    renderTagBadge('holderTopik', selectedTopik, () => triggerTopik.click());
  });

  setupTagDropdown('triggerTema', 'dropdownTema', 'holderTema', () => {
    return Object.keys(researchTaxonomy.bidangFokus[selectedBidang]?.temas || {});
  }, (selectedVal) => {
    selectedTema = selectedVal;
    const topiks = researchTaxonomy.bidangFokus[selectedBidang]?.temas[selectedTema] || [];
    selectedTopik = topiks[0] || '';
    renderTagBadge('holderTopik', selectedTopik, () => triggerTopik.click());
  });

  setupTagDropdown('triggerTopik', 'dropdownTopik', 'holderTopik', () => {
    return researchTaxonomy.bidangFokus[selectedBidang]?.temas[selectedTema] || [];
  }, (selectedVal) => {
    selectedTopik = selectedVal;
  });

  renderTagBadge('holderBidangFokus', selectedBidang, () => triggerBidang.click());
  renderTagBadge('holderTema', selectedTema, () => triggerTema.click());
  renderTagBadge('holderTopik', selectedTopik, () => triggerTopik.click());
}

function renderTagBadge(holderId, textVal, onRemove) {
  const holder = document.getElementById(holderId);
  if (!holder) return;
  holder.innerHTML = '';

  if (!textVal) {
    const ph = document.createElement('span');
    ph.className = 'tag-placeholder';
    ph.textContent = '-- Pilih Salah Satu --';
    holder.appendChild(ph);
    return;
  }

  const badge = document.createElement('span');
  badge.className = 'tag-badge';
  badge.innerHTML = `
    <span>${textVal}</span>
    <span class="remove-tag" title="Ganti pilihan">&times;</span>
  `;

  badge.querySelector('.remove-tag').addEventListener('click', (e) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  });

  holder.appendChild(badge);
}

function setupTagDropdown(triggerId, dropdownId, holderId, getOptionsFn, onSelectFn) {
  const trigger = document.getElementById(triggerId);
  const dropdown = document.getElementById(dropdownId);
  const box = trigger ? trigger.closest('.dynamic-select-tag-box') : null;

  if (!trigger || !dropdown || !box) return;

  function renderOptions() {
    dropdown.innerHTML = '';
    const options = getOptionsFn();
    options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'dynamic-option-item';
      item.textContent = opt;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        renderTagBadge(holderId, opt, () => trigger.click());
        onSelectFn(opt);
        closeAllTagDropdowns();
      });

      dropdown.appendChild(item);
    });
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    closeAllTagDropdowns();
    if (!isOpen) {
      renderOptions();
      dropdown.classList.add('open');
      trigger.classList.add('open');
      box.classList.add('open');
    }
  });
}

function closeAllTagDropdowns() {
  document.querySelectorAll('.dynamic-options-dropdown').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.select-tag-trigger').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.dynamic-select-tag-box').forEach(b => b.classList.remove('open'));
}

document.addEventListener('click', () => {
  closeAllTagDropdowns();
});
