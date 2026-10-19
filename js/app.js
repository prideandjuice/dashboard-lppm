// LPPM UMSU & RisetMu Dynamic Engine

document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  initMonthlyChart();
  initTableFilters();
  initAccordions();
  initStepper();
  initDynamicResearchFields();
});

// Toast notification helper
function showToast(message, type = 'success') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-popup';
    document.body.appendChild(toast);
  }
  toast.className = `toast-popup show ${type}`;
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Dropdowns logic
function initDropdowns() {
  const yearBtn = document.getElementById('btnYearDropdown');
  const yearMenu = document.getElementById('menuYearDropdown');
  if (yearBtn && yearMenu) {
    yearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      yearMenu.classList.toggle('show');
    });

    yearMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('currentYearText').textContent = btn.dataset.year;
        yearMenu.classList.remove('show');
        showToast(`Tahun Akademik: ${btn.dataset.year}`);
      });
    });
  }

  const roleBtn = document.getElementById('btnRoleDropdown');
  const roleMenu = document.getElementById('menuRoleDropdown');
  if (roleBtn && roleMenu) {
    roleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      roleMenu.classList.toggle('show');
    });

    roleMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const newRole = btn.dataset.role;
        document.getElementById('currentRoleText').textContent = newRole;
        roleMenu.classList.remove('show');
        showToast(`Beralih peran ke: ${newRole}`);
      });
    });
  }

  const userBtn = document.getElementById('btnUserDropdown');
  const userMenu = document.getElementById('menuUserDropdown');
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('show');
    });
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu-list').forEach(m => m.classList.remove('show'));
    closeAllTagDropdowns();
  });
}

// Monthly Trend Canvas Chart
function initMonthlyChart() {
  const canvas = document.getElementById('penelitianMonthlyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const usulanData = [0.2, 0.6, 0.5, 0.9, 0.7, 1.1, 1.5, 1.9, 1.3, 1.4, 1.5, 1.7];
  const didanaiData = [0.2, 0.4, 0.3, 0.6, 0.5, 0.6, 0.8, 0.9, 0.7, 0.7, 0.8, 0.9];

  function draw() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const padLeft = 35;
    const padRight = 25;
    const padTop = 15;
    const padBottom = 25;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const maxY = 2.5;

    ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';

    for (let i = 0; i <= 2; i++) {
      const yPos = padTop + plotH - (i / maxY) * plotH;
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, yPos);
      ctx.lineTo(w - padRight, yPos);
      ctx.stroke();
    }

    const stepX = plotW / (months.length - 1);
    months.forEach((m, i) => {
      const xPos = padLeft + i * stepX;
      ctx.fillText(m, xPos, h - 6);
    });

    function renderCurve(data, strokeColor) {
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColor;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      data.forEach((val, i) => {
        const xPos = padLeft + i * stepX;
        const yPos = padTop + plotH - (val / maxY) * plotH;
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      });
      ctx.stroke();
    }

    renderCurve(didanaiData, '#ec4899');
    renderCurve(usulanData, '#2563eb');
  }

  window.addEventListener('resize', draw);
  draw();
}

// Table Filter on penelitian.html
function initTableFilters() {
  const tabs = document.querySelectorAll('.filter-tab-pill');
  const rows = document.querySelectorAll('.proposal-data-row');

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
      showToast(`Filter: ${tab.textContent}`);
    });
  });
}

// Accordion Collapsible Logic
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const panel = header.closest('.accordion-panel');
      panel.classList.toggle('collapsed');
    });
  });
}

// Stepper Progress
function initStepper() {
  const steps = document.querySelectorAll('.step-item');
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
      showToast(`Tahap: ${step.querySelector('.step-label').textContent}`);
    });
  });

  const nextBtn = document.getElementById('btnNextWizard');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showToast('Data Identitas Usulan tersimpan. Beralih ke Substansi Usulan...', 'success');
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
