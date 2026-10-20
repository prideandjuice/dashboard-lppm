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
  const emptyRow = document.getElementById('emptyStateRow');
  const emptyText = document.getElementById('emptyStateText');
  if (!tabs.length || !rows.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      let visibleCount = 0;
      rows.forEach(row => {
        if (filter === 'all' || row.dataset.status === filter) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      if (emptyRow) {
        if (visibleCount === 0) {
          emptyRow.style.display = '';
          if (emptyText) {
            emptyText.textContent = `Belum ada usulan penelitian dengan status "${tab.textContent.trim()}" pada periode berjalan.`;
          }
        } else {
          emptyRow.style.display = 'none';
        }
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
          "Sistem Pendukung Keputusan Berbasis Big Data",
          "Digitalisasi Layanan Publik Pemerintah Daerah"
        ]
      }
    },
    "Ketahanan Pangan dan Pertanian": {
      temas: {
        "Teknologi Pasca Panen Berkelanjutan": [
          "Optimasi rantai pasok komoditas pangan lokal",
          "Pengolahan pangan fungsional berbasis umbi-umbian",
          "Pengawetan hasil panen ramah lingkungan"
        ],
        "Bioteknologi Tanaman Pangan & Hortikultura": [
          "Rekayasa varietas padi tahan genangan dan kekeringan",
          "Pupuk hayati mikoriza untuk lahan kritis",
          "Pengendalian hama terpadu hayati"
        ]
      }
    },
    "Kesehatan, Farmasi dan Kedokteran": {
      temas: {
        "Pengembangan Obat Bahan Alam Tropis": [
          "Standardisasi ekstrak herbal untuk antidiabetes",
          "Isolasi senyawa aktif antibakteri dari flora lokal",
          "Uji klinis fitofarmaka antiinflamasi"
        ],
        "Sistem Informasi Kesehatan Masyarakat": [
          "Surveilans digital stunting dan gizi balita",
          "Telemedicine terintegrasi untuk daerah 3T",
          "Manajemen data rekam medis elektronik terpusat"
        ]
      }
    },
    "Sosial Humaniora & Pendidikan Berkemajuan": {
      temas: {
        "Inovasi Pembelajaran Digital": [
          "Media augmented reality untuk pembelajaran sains",
          "Model asesmen kurikulum merdeka berbasis AI",
          "Pengembangan platform micro-learning adaptif"
        ],
        "Pemberdayaan Ekonomi Komunitas 'Aisyiyah": [
          "Digital marketing dan inkubasi UMKM perempuan",
          "Penguatan ketahanan keluarga sakinah dan literasi finansial",
          "Model koperasi syariah berbasis komunitas ranting"
        ]
      }
    },
    "Energi Baru Terbarukan & Lingkungan": {
      temas: {
        "Pemanfaatan Energi Surya & Biomassa": [
          "Sistem Pembangkit Listrik Tenaga Surya Atap Kampus",
          "Konversi limbah kelapa sawit menjadi biofuel",
          "Mikrohidro untuk penerangan pedesaan"
        ],
        "Pengelolaan Lingkungan & Kebencanaan": [
          "Sistem peringatan dini banjir berbasis sensor IoT",
          "Pengolahan air limbah industri ramah lingkungan",
          "Mitigasi dampak perubahan iklim pada pesisir"
        ]
      }
    }
  },
  rumpunIlmu: {
    "ILMU TEKNIK": {
      level2: {
        "TEKNIK ELEKTRO DAN INFORMATIKA": [
          "Sistem Informasi",
          "Teknik Informatika",
          "Ilmu Komputer",
          "Rekayasa Perangkat Lunak",
          "Teknik Elektro",
          "Teknik Telekomunikasi"
        ],
        "TEKNIK SIPIL DAN PERENCANAAN": [
          "Teknik Sipil",
          "Arsitektur",
          "Perencanaan Wilayah dan Kota"
        ],
        "TEKNIK MESIN DAN INDUSTRI": [
          "Teknik Mesin",
          "Teknik Industri",
          "Teknik Material"
        ]
      }
    },
    "ILMU KESEHATAN": {
      level2: {
        "KEDOKTERAN DAN KESEHATAN": [
          "Pendidikan Dokter",
          "Kesehatan Masyarakat",
          "Ilmu Keperawatan",
          "Farmasi Klinis",
          "Kebidanan"
        ]
      }
    },
    "ILMU EKONOMI": {
      level2: {
        "EKONOMI, MANAJEMEN DAN BISNIS": [
          "Manajemen",
          "Akuntansi",
          "Ekonomi Pembangunan",
          "Ekonomi Islam / Syariah",
          "Kewirausahaan"
        ]
      }
    },
    "ILMU PENDIDIKAN": {
      level2: {
        "PENDIDIKAN DAN KEGURUAN": [
          "Pendidikan Guru Sekolah Dasar (PGSD)",
          "Pendidikan Bahasa Indonesia",
          "Pendidikan Matematika",
          "Pendidikan Agama Islam (PAI)",
          "Teknologi Pendidikan"
        ]
      }
    },
    "ILMU SOSIAL & HUMANIORA": {
      level2: {
        "ILMU SOSIAL DAN POLITIK": [
          "Ilmu Komunikasi",
          "Administrasi Publik",
          "Hubungan Internasional",
          "Kesejahteraan Sosial"
        ],
        "ILMU HUKUM": [
          "Ilmu Hukum Perdata",
          "Hukum Pidana",
          "Hukum Tata Negara & Administrasi"
        ]
      }
    }
  },
  prioritasRiset: [
    "Digital Economy",
    "Green Economy & Transisi Energi",
    "Blue Economy & Kemaritiman",
    "Kemandirian Kesehatan & Farmasi",
    "Ketahanan Pangan Berkelanjutan",
    "Pariwisata & Industri Kreatif",
    "Penguatan Karakter, Moderasi & Kebangsaan"
  ]
};

// Current active state
let activeResearchState = {
  bidang: "Teknologi Informasi dan Komunikasi",
  tema: "Pengembangan sistem berbasis kecerdasan buatan",
  topik: "Pengembangan aplikasi sistem cerdas",
  rumpun1: "ILMU TEKNIK",
  rumpun2: "TEKNIK ELEKTRO DAN INFORMATIKA",
  rumpun3: "Sistem Informasi",
  prioritas: "Digital Economy"
};

function closeAllTagDropdowns() {
  document.querySelectorAll('.dynamic-options-dropdown').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.select-tag-trigger').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.dynamic-select-tag-box').forEach(b => b.classList.remove('open'));
}

function initDynamicResearchFields() {
  // Global click listener to close dropdowns when clicking outside
  document.addEventListener('click', closeAllTagDropdowns);

  // Setup Skim Penelitian selector
  const selectSkim = document.getElementById('selectSkimPenelitian');
  if (selectSkim) {
    selectSkim.addEventListener('change', (e) => {
      showToast(`Skim terpilih: ${e.target.value} (Plafon hingga Rp 35.000.000)`);
    });
  }

  // 1. Setup Bidang Fokus Penelitian
  setupCustomSelect('selectBidangFokus', 
    () => Object.keys(researchTaxonomy.bidangFokus), 
    (val) => {
      if (!val) {
        activeResearchState.bidang = '';
        activeResearchState.tema = '';
        activeResearchState.topik = '';
        renderAllDynamicFields();
        showToast('Bidang Fokus dikosongkan', 'info');
        return;
      }
      activeResearchState.bidang = val;
      const availableTemas = Object.keys(researchTaxonomy.bidangFokus[val]?.temas || {});
      activeResearchState.tema = availableTemas[0] || '';
      const availableTopiks = researchTaxonomy.bidangFokus[val]?.temas[activeResearchState.tema] || [];
      activeResearchState.topik = availableTopiks[0] || '';
      renderAllDynamicFields();
      showToast(`Bidang Fokus: ${val}`);
    },
    () => activeResearchState.bidang
  );

  // 2. Setup Tema Penelitian
  setupCustomSelect('selectTemaPenelitian', 
    () => {
      if (activeResearchState.bidang && researchTaxonomy.bidangFokus[activeResearchState.bidang]) {
        return Object.keys(researchTaxonomy.bidangFokus[activeResearchState.bidang].temas);
      }
      const allTemas = [];
      Object.values(researchTaxonomy.bidangFokus).forEach(b => {
        allTemas.push(...Object.keys(b.temas));
      });
      return allTemas;
    }, 
    (val) => {
      if (!val) {
        activeResearchState.tema = '';
        activeResearchState.topik = '';
        renderAllDynamicFields();
        showToast('Tema Penelitian dikosongkan', 'info');
        return;
      }
      if (!activeResearchState.bidang) {
        for (const [bName, bData] of Object.entries(researchTaxonomy.bidangFokus)) {
          if (bData.temas[val]) {
            activeResearchState.bidang = bName;
            break;
          }
        }
      }
      activeResearchState.tema = val;
      const availableTopiks = researchTaxonomy.bidangFokus[activeResearchState.bidang]?.temas[val] || [];
      activeResearchState.topik = availableTopiks[0] || '';
      renderAllDynamicFields();
      showToast(`Tema: ${val}`);
    },
    () => activeResearchState.tema
  );

  // 3. Setup Topik Penelitian
  setupCustomSelect('selectTopikPenelitian', 
    () => {
      if (activeResearchState.bidang && activeResearchState.tema) {
        return researchTaxonomy.bidangFokus[activeResearchState.bidang]?.temas[activeResearchState.tema] || [];
      }
      const allTopiks = [];
      Object.values(researchTaxonomy.bidangFokus).forEach(b => {
        Object.values(b.temas).forEach(list => allTopiks.push(...list));
      });
      return allTopiks;
    }, 
    (val) => {
      if (!val) {
        activeResearchState.topik = '';
        renderAllDynamicFields();
        showToast('Topik Penelitian dikosongkan', 'info');
        return;
      }
      if (!activeResearchState.tema) {
        outer: for (const [bName, bData] of Object.entries(researchTaxonomy.bidangFokus)) {
          for (const [tName, list] of Object.entries(bData.temas)) {
            if (list.includes(val)) {
              activeResearchState.bidang = bName;
              activeResearchState.tema = tName;
              break outer;
            }
          }
        }
      }
      activeResearchState.topik = val;
      renderAllDynamicFields();
      showToast(`Topik: ${val}`);
    },
    () => activeResearchState.topik
  );

  // 4. Setup Rumpun Ilmu Level 1
  setupCustomSelect('selectRumpun1', 
    () => Object.keys(researchTaxonomy.rumpunIlmu), 
    (val) => {
      if (!val) {
        activeResearchState.rumpun1 = '';
        activeResearchState.rumpun2 = '';
        activeResearchState.rumpun3 = '';
        renderAllDynamicFields();
        showToast('Rumpun Level 1 dikosongkan', 'info');
        return;
      }
      activeResearchState.rumpun1 = val;
      const availableL2 = Object.keys(researchTaxonomy.rumpunIlmu[val]?.level2 || {});
      activeResearchState.rumpun2 = availableL2[0] || '';
      const availableL3 = researchTaxonomy.rumpunIlmu[val]?.level2[activeResearchState.rumpun2] || [];
      activeResearchState.rumpun3 = availableL3[0] || '';
      renderAllDynamicFields();
      showToast(`Rumpun Level 1: ${val}`);
    },
    () => activeResearchState.rumpun1
  );

  // 5. Setup Rumpun Ilmu Level 2
  setupCustomSelect('selectRumpun2', 
    () => {
      if (activeResearchState.rumpun1 && researchTaxonomy.rumpunIlmu[activeResearchState.rumpun1]) {
        return Object.keys(researchTaxonomy.rumpunIlmu[activeResearchState.rumpun1].level2 || {});
      }
      const allL2 = [];
      Object.values(researchTaxonomy.rumpunIlmu).forEach(r => {
        allL2.push(...Object.keys(r.level2 || {}));
      });
      return allL2;
    }, 
    (val) => {
      if (!val) {
        activeResearchState.rumpun2 = '';
        activeResearchState.rumpun3 = '';
        renderAllDynamicFields();
        showToast('Rumpun Level 2 dikosongkan', 'info');
        return;
      }
      if (!activeResearchState.rumpun1) {
        for (const [rName, rData] of Object.entries(researchTaxonomy.rumpunIlmu)) {
          if (rData.level2[val]) {
            activeResearchState.rumpun1 = rName;
            break;
          }
        }
      }
      activeResearchState.rumpun2 = val;
      const availableL3 = researchTaxonomy.rumpunIlmu[activeResearchState.rumpun1]?.level2[val] || [];
      activeResearchState.rumpun3 = availableL3[0] || '';
      renderAllDynamicFields();
      showToast(`Rumpun Level 2: ${val}`);
    },
    () => activeResearchState.rumpun2
  );

  // 6. Setup Rumpun Ilmu Level 3
  setupCustomSelect('selectRumpun3', 
    () => {
      if (activeResearchState.rumpun1 && activeResearchState.rumpun2) {
        return researchTaxonomy.rumpunIlmu[activeResearchState.rumpun1]?.level2[activeResearchState.rumpun2] || [];
      }
      const allL3 = [];
      Object.values(researchTaxonomy.rumpunIlmu).forEach(r => {
        Object.values(r.level2 || {}).forEach(list => allL3.push(...list));
      });
      return allL3;
    }, 
    (val) => {
      if (!val) {
        activeResearchState.rumpun3 = '';
        renderAllDynamicFields();
        showToast('Rumpun Level 3 dikosongkan', 'info');
        return;
      }
      if (!activeResearchState.rumpun2) {
        outerR: for (const [rName, rData] of Object.entries(researchTaxonomy.rumpunIlmu)) {
          for (const [l2Name, list] of Object.entries(rData.level2 || {})) {
            if (list.includes(val)) {
              activeResearchState.rumpun1 = rName;
              activeResearchState.rumpun2 = l2Name;
              break outerR;
            }
          }
        }
      }
      activeResearchState.rumpun3 = val;
      renderAllDynamicFields();
      showToast(`Rumpun Level 3: ${val}`);
    },
    () => activeResearchState.rumpun3
  );

  // 7. Setup Prioritas Riset
  setupCustomSelect('selectPrioritasRiset', 
    () => researchTaxonomy.prioritasRiset, 
    (val) => {
      if (!val) {
        activeResearchState.prioritas = '';
        renderAllDynamicFields();
        showToast('Prioritas Riset dikosongkan', 'info');
        return;
      }
      activeResearchState.prioritas = val;
      renderAllDynamicFields();
      showToast(`Prioritas Riset: ${val}`);
    },
    () => activeResearchState.prioritas
  );

  renderAllDynamicFields();
}

function setupCustomSelect(containerId, getOptionsFn, onSelectFn, getCurrentValFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const trigger = container.querySelector('.select-tag-trigger');
  const dropdown = container.querySelector('.dynamic-options-dropdown');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // If clicked on remove tag button, clear it
    if (e.target.classList.contains('remove-tag')) {
      onSelectFn('');
      return;
    }

    const wasOpen = dropdown.classList.contains('open');
    closeAllTagDropdowns();

    if (!wasOpen) {
      const curVal = getCurrentValFn ? getCurrentValFn() : '';
      populateDropdown(dropdown, getOptionsFn(), onSelectFn, curVal);
      dropdown.classList.add('open');
      trigger.classList.add('open');
      container.classList.add('open');
    }
  });
}

function populateDropdown(dropdown, options, onSelectFn, currentValue = '') {
  dropdown.innerHTML = '';
  if (!options || options.length === 0) {
    dropdown.innerHTML = '<div class="dynamic-option-item" style="color:#94a3b8; font-style:italic;">Tidak ada opsi tersedia</div>';
    return;
  }

  options.forEach(opt => {
    const item = document.createElement('div');
    const isSelected = (opt === currentValue);
    item.className = `dynamic-option-item ${isSelected ? 'selected' : ''}`;
    item.innerHTML = `
      <span>${opt}</span>
      ${isSelected ? '<span style="color:#2563eb; font-weight:800; font-size: 0.85rem;">✓</span>' : ''}
    `;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelectFn(opt);
      closeAllTagDropdowns();
    });
    dropdown.appendChild(item);
  });
}

function renderAllDynamicFields() {
  updateFieldView('selectBidangFokus', activeResearchState.bidang, 'Pilih Bidang Fokus...');
  updateFieldView('selectTemaPenelitian', activeResearchState.tema, 'Pilih Tema Penelitian...');
  updateFieldView('selectTopikPenelitian', activeResearchState.topik, 'Pilih Topik Penelitian...');
  updateFieldView('selectRumpun1', activeResearchState.rumpun1, 'Pilih Rumpun Level 1...');
  updateFieldView('selectRumpun2', activeResearchState.rumpun2, 'Pilih Rumpun Level 2...');
  updateFieldView('selectRumpun3', activeResearchState.rumpun3, 'Pilih Rumpun Level 3...');
  updateFieldView('selectPrioritasRiset', activeResearchState.prioritas, 'Pilih Prioritas Riset...');
}

function updateFieldView(containerId, value, placeholder) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tagHolder = container.querySelector('.tag-holder');
  if (!tagHolder) return;

  if (value && value.trim() !== '') {
    tagHolder.innerHTML = `
      <span class="tag-badge">
        ${value}
        <span class="remove-tag" title="Hapus kriteria">✕</span>
      </span>
    `;
  } else {
    tagHolder.innerHTML = `<span class="tag-placeholder">${placeholder}</span>`;
  }
}
