/**
 * Modul Penelitian & Usulan Baru Logic
 * Dibuat khusus untuk Branch: arya
 */

document.addEventListener('DOMContentLoaded', () => {
  initTableFilters();
  initAccordions();
  initStepper();
  initDynamicResearchFields();
});

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
        showToast(`Filter: ${tab.textContent}`);
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
        showToast(`Tahap: ${label}`);
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
