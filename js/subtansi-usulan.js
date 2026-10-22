/**
 * Modul Pengajuan Usulan Baru Penelitian - LPPM UMSU & RisetMu
 * Tahap 2: Substansi Usulan
 * File: js/subtansi-usulan.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initSubtansiModals();
  restoreSavedDraftTahap2();
});

// =============================================================================
// 1. MODAL CONTAINER
// =============================================================================
function initSubtansiModals() {
  let modalContainer = document.getElementById('subtansiModalContainer');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'subtansiModalContainer';
    modalContainer.className = 'portal-modal-backdrop';
    modalContainer.style.display = 'none';
    document.body.appendChild(modalContainer);

    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeSubtansiModal();
      }
    });
  }
}

function openSubtansiModal(title, bodyHtml, footerButtonsHtml = '') {
  const container = document.getElementById('subtansiModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="portal-modal-card">
      <div class="portal-modal-header">
        <h4 class="portal-modal-title">${title}</h4>
        <button type="button" class="portal-modal-close" onclick="closeSubtansiModal()">&times;</button>
      </div>
      <div class="portal-modal-body">
        ${bodyHtml}
      </div>
      ${footerButtonsHtml ? `<div class="portal-modal-footer">${footerButtonsHtml}</div>` : ''}
    </div>
  `;

  container.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSubtansiModal() {
  const container = document.getElementById('subtansiModalContainer');
  if (container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }
  document.body.style.overflow = '';
}

// =============================================================================
// 2. FILE UPLOAD HANDLING (2.1)
// =============================================================================
function handleFileSubstansi(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 5) {
      showToast('Ukuran berkas melebihi batas 5MB! Silakan pilih berkas PDF yang lebih kecil.', 'warning');
      input.value = '';
      return;
    }
    showToast(`Berkas proposal berhasil dipilih: ${file.name} (${sizeMb.toFixed(2)} MB)`, 'success');
  }
}

// =============================================================================
// 3. LUARAN TARGET CAPAIAN (2.2)
// =============================================================================
function showModalTambahLuaran() {
  const html = `
    <div style="font-size: 0.82rem; line-height: 1.5; color: #1e293b;">
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-weight: 600; margin-bottom: 4px;">Urutan Tahun Kegiatan <span style="color:red">*</span></label>
        <select id="modalTahunLuaran" class="portal-select">
          <option value="Tahun ke-1">Tahun ke-1</option>
          <option value="Tahun ke-2">Tahun ke-2</option>
          <option value="Tahun ke-3">Tahun ke-3</option>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-weight: 600; margin-bottom: 4px;">Kategori Luaran <span style="color:red">*</span></label>
        <select id="modalKategoriLuaran" class="portal-select">
          <option value="Publikasi Ilmiah Jurnal Internasional">Publikasi Ilmiah Jurnal Internasional (Scopus/WoS)</option>
          <option value="Publikasi Ilmiah Jurnal Nasional Terakreditasi">Publikasi Ilmiah Jurnal Nasional Terakreditasi (SINTA 1-2)</option>
          <option value="Publikasi Ilmiah Jurnal Nasional Terakreditasi">Publikasi Ilmiah Jurnal Nasional Terakreditasi (SINTA 3-6)</option>
          <option value="Hak Kekayaan Intelektual (HKI)">Hak Kekayaan Intelektual (Paten / Hak Cipta)</option>
          <option value="Buku Ber-ISBN">Buku Ber-ISBN / Monograf Hasil Penelitian</option>
          <option value="Prosiding Seminar Internasional">Prosiding Seminar Internasional Bereputasi</option>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-weight: 600; margin-bottom: 4px;">Uraian Luaran Spesifik <span style="color:red">*</span></label>
        <textarea id="modalDeskripsiLuaran" class="portal-input" style="height: 65px; resize: none; padding: 8px;" placeholder="Contoh: Publikasi artikel pada IEEE Access / Q2 Journal of Applied Computer Science"></textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 4px;">Status Target <span style="color:red">*</span></label>
          <select id="modalStatusLuaran" class="portal-select">
            <option value="Accepted/Published">Accepted / Published</option>
            <option value="Submitted">Submitted / Under Review</option>
            <option value="Granted/Registered">Granted / Registered</option>
            <option value="Terbit">Terbit Ber-ISBN</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 4px;">Keterangan</label>
          <input type="text" id="modalKetLuaran" class="portal-input" placeholder="Contoh: Target Capaian Tahun 1" value="Target Wajib">
        </div>
      </div>
    </div>
  `;

  openSubtansiModal(
    '<i class="fa-solid fa-trophy" style="color: #1e40af; margin-right: 8px;"></i> Tambah Luaran Target Capaian',
    html,
    `
      <button type="button" class="btn-portal-save" onclick="closeSubtansiModal()">Batal</button>
      <button type="button" class="btn-portal-next" onclick="submitTambahLuaran()">Simpan Luaran</button>
    `
  );
}

function submitTambahLuaran() {
  const tahun = document.getElementById('modalTahunLuaran')?.value || 'Tahun ke-1';
  const kategori = document.getElementById('modalKategoriLuaran')?.value || '';
  const luaran = document.getElementById('modalDeskripsiLuaran')?.value.trim();
  const status = document.getElementById('modalStatusLuaran')?.value || 'Accepted/Published';
  const ket = document.getElementById('modalKetLuaran')?.value.trim() || 'Target Wajib';

  if (!luaran) {
    showToast('Harap tuliskan deskripsi luaran spesifik!', 'warning');
    return;
  }

  const tableBody = document.querySelector('#tabelLuaranWajib tbody');
  if (tableBody) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center;">${tahun}</td>
      <td>${kategori}</td>
      <td style="font-weight: 600;">${luaran}</td>
      <td style="text-align: center;">
        <span class="badge-portal-status status-menyetujui">${status}</span>
      </td>
      <td>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${ket}</span>
          <button type="button" class="btn-portal-edit" title="Hapus Luaran" style="border-color: #ef4444; color: #ef4444; margin-left: 8px;" onclick="hapusRowLuaran(this)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
    closeSubtansiModal();
    showToast('Luaran target capaian berhasil ditambahkan', 'success');
  }
}

function hapusRowLuaran(btn) {
  const tr = btn.closest('tr');
  if (tr) tr.remove();
  showToast('Luaran target capaian dihapus', 'info');
}

// =============================================================================
// 4. 8 BIDANG STRATEGIS (2.3)
// =============================================================================
function showModalInfoRumusanMasalah() {
  const html = `
    <div style="font-size: 0.82rem; line-height: 1.6; color: #1e293b;">
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px;">
        <strong style="color: #1e40af;"><i class="fa-solid fa-circle-info" style="margin-right: 6px;"></i>Panduan 8 Bidang Strategis Nasional (BIMA & RisetMu)</strong>
        <p style="margin: 4px 0 0 0;">Usulan penelitian wajib menyelaraskan rumusan masalah dan uraian kegiatan dengan prioritas bidang strategis nasional untuk meningkatkan dampak riset perguruan tinggi.</p>
      </div>

      <ol style="padding-left: 18px; margin: 0; display: flex; flex-direction: column; gap: 6px;">
        <li><strong>Pangan & Pertanian:</strong> Ketahanan pangan, kedaulatan benih, diversifikasi pangan lokal.</li>
        <li><strong>Energi Baru & Terbarukan:</strong> Efisiensi daya, surya/biomassa, baterai dan smart grid.</li>
        <li><strong>Kesehatan & Obat:</strong> Kemandirian bahan baku obat herbal, stunting, penyakit menular.</li>
        <li><strong>Transportasi:</strong> Transportasi cerdas, keselamatan moda, kendaraan listrik ramah lingkungan.</li>
        <li><strong>Teknologi Informasi & Komunikasi (TIK):</strong> AI, keamanan siber, transformasi digital, IoT.</li>
        <li><strong>Pertahanan & Keamanan:</strong> Keamanan siber strategis, teknologi pendukung pertahanan maritim.</li>
        <li><strong>Material Maju:</strong> Nanomaterial, material komposit, pengolahan limbah mineral bernilai tinggi.</li>
        <li><strong>Kemaritiman & Sosial Humaniora:</strong> Ekonomi pesisir, kebencanaan, kearifan lokal & moderasi beragama.</li>
      </ol>
    </div>
  `;

  openSubtansiModal(
    '<i class="fa-solid fa-circle-info" style="color: #0284c7; margin-right: 8px;"></i> Informasi Detail Rumusan Masalah 8 Bidang Strategis',
    html,
    `<button type="button" class="btn-portal-next" style="padding: 6px 18px;" onclick="closeSubtansiModal()">Mengerti</button>`
  );
}

function showModalTambahBidangStrategis() {
  const html = `
    <div style="font-size: 0.82rem; line-height: 1.5; color: #1e293b;">
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-weight: 600; margin-bottom: 4px;">8 Bidang Strategis <span style="color:red">*</span></label>
        <select id="modalBidangStrategisSelect" class="portal-select" style="width: 100%;">
          <option value="Teknologi Informasi dan Komunikasi">Teknologi Informasi dan Komunikasi</option>
          <option value="Pangan dan Pertanian">Pangan dan Pertanian</option>
          <option value="Energi Baru dan Terbarukan">Energi Baru dan Terbarukan</option>
          <option value="Kesehatan dan Obat">Kesehatan dan Obat</option>
          <option value="Transportasi">Transportasi</option>
          <option value="Pertahanan dan Keamanan">Pertahanan dan Keamanan</option>
          <option value="Material Maju">Material Maju</option>
          <option value="Kemaritiman dan Sosial Humaniora">Kemaritiman dan Sosial Humaniora</option>
        </select>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-weight: 600; margin-bottom: 4px;">Rumusan Masalah Strategis <span style="color:red">*</span></label>
        <select id="modalRumusanMasalah" class="portal-select" style="width: 100%;">
          <option value="">Select...</option>
          <option value="6.1 Ketiadaan Rantai Pasok Semikonduktor Nasional yang Terintegrasi">6.1 Ketiadaan Rantai Pasok Semikonduktor Nasional yang Terintegrasi</option>
          <option value="6.2 Terbatasnya Kapasitas Desain, Manufaktur, dan Pengujian Semikonduktor">6.2 Terbatasnya Kapasitas Desain, Manufaktur, dan Pengujian Semikonduktor</option>
          <option value="6.3 Minimnya Kepemilikan dan Perlindungan IP di Sektor Semikonduktor">6.3 Minimnya Kepemilikan dan Perlindungan IP di Sektor Semikonduktor</option>
          <option value="6.4 Lemahnya Strategi Keberlanjutan Perusahaan Semikonduktor dan AI">6.4 Lemahnya Strategi Keberlanjutan Perusahaan Semikonduktor dan AI</option>
          <option value="6.5 Ketiadaan Pilot Project Semikonduktor dalam Sistem Pengadaan Pemerintah">6.5 Ketiadaan Pilot Project Semikonduktor dalam Sistem Pengadaan Pemerintah</option>
          <option value="6.6 Terbatasnya Skema Pendanaan untuk Ekosistem Semikonduktor dan AI">6.6 Terbatasnya Skema Pendanaan untuk Ekosistem Semikonduktor dan AI</option>
          <option value="6.7 Ketiadaan Pusat Riset Semikonduktor Berkelas Dunia">6.7 Ketiadaan Pusat Riset Semikonduktor Berkelas Dunia</option>
          <option value="6.8 Kurangnya Talenta AI dan Semikonduktor dengan Reputasi Global">6.8 Kurangnya Talenta AI dan Semikonduktor dengan Reputasi Global</option>
        </select>
      </div>

      <div style="margin-bottom: 8px;">
        <label style="display: block; font-weight: 600; margin-bottom: 4px;">Uraian Kegiatan Penelitian <span style="color:red">*</span></label>
        <textarea id="modalUraianKegiatan" class="portal-input" style="height: 70px; resize: none; padding: 8px;" placeholder="Tuliskan uraian tahapan kegiatan atau metode yang akan dilakukan..."></textarea>
      </div>
    </div>
  `;

  openSubtansiModal(
    '<i class="fa-solid fa-plus-circle" style="color: #2563eb; margin-right: 8px;"></i> Tambah 8 Bidang Strategis',
    html,
    `
      <button type="button" class="btn-portal-save" onclick="closeSubtansiModal()">Batal</button>
      <button type="button" class="btn-portal-next" onclick="submitTambahBidangStrategis()">Simpan Bidang</button>
    `
  );
}

function submitTambahBidangStrategis() {
  const bidang = document.getElementById('modalBidangStrategisSelect')?.value;
  const rumusan = document.getElementById('modalRumusanMasalah')?.value.trim();
  const uraian = document.getElementById('modalUraianKegiatan')?.value.trim();

  if (!rumusan || !uraian) {
    showToast('Harap lengkapi Rumusan Masalah dan Uraian Kegiatan!', 'warning');
    return;
  }

  const tableBody = document.querySelector('#tabelBidangStrategis tbody');
  if (tableBody) {
    const emptyRow = tableBody.querySelector('.portal-table-empty');
    if (emptyRow) {
      emptyRow.closest('tr').remove();
    }

    const rowCount = tableBody.querySelectorAll('tr').length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align: center;">${rowCount}</td>
      <td style="font-weight: 600; color: #1e40af;">${bidang}</td>
      <td>${rumusan}</td>
      <td>${uraian}</td>
      <td style="text-align: center;">
        <button type="button" class="btn-portal-edit" title="Hapus" style="border-color: #ef4444; color: #ef4444;" onclick="hapusRowBidangStrategis(this)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
    closeSubtansiModal();
    showToast(`Bidang Strategis ${bidang} berhasil ditambahkan ke Bagian 2.3`, 'success');
  }
}

function hapusRowBidangStrategis(btn) {
  const tr = btn.closest('tr');
  const tableBody = document.querySelector('#tabelBidangStrategis tbody');
  if (tr) tr.remove();
  if (tableBody && tableBody.querySelectorAll('tr').length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="portal-table-empty">
          Data tidak tersedia!
        </td>
      </tr>
    `;
  }
  showToast('Bidang strategis dihapus', 'info');
}

// =============================================================================
// 5. DRAF & ACTIONS TAHAP 2
// =============================================================================
function simpanDrafTahap2() {
  const makro = document.getElementById('selectMakroRiset')?.value || '';
  const fileInput = document.getElementById('fileSubstansi');
  const fileName = fileInput?.files[0]?.name || '';

  const drafTahap2 = {
    makroRiset: makro,
    fileName: fileName,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem('risetmu_tahap2_draf', JSON.stringify(drafTahap2));
    showToast('Draft Substansi Usulan (Tahap 2) berhasil disimpan di browser', 'success');
  } catch (e) {
    showToast('Draft berhasil disimpan sementara', 'info');
  }
}

function lanjutTahap3() {
  const makro = document.getElementById('selectMakroRiset')?.value;
  if (!makro) {
    showToast('Harap pilih Kelompok Makro Riset terlebih dahulu!', 'warning');
    document.getElementById('selectMakroRiset')?.focus();
    return;
  }

  simpanDrafTahap2();
  showToast('Data Substansi Usulan tersimpan. Menuju Tahap 3: Rancangan Anggaran Biaya (RAB)...', 'success');
}

function kembaliKeTahap1() {
  window.location.href = 'usulan-baru.html';
}

function tutupFormulir() {
  if (confirm('Tutup formulir usulan baru? Draf yang telah diisi tersimpan dengan aman.')) {
    window.location.href = 'penelitian.html';
  }
}

function restoreSavedDraftTahap2() {
  try {
    const raw = localStorage.getItem('risetmu_tahap2_draf');
    if (!raw) return;
    const draf = JSON.parse(raw);
    if (draf.makroRiset && document.getElementById('selectMakroRiset')) {
      document.getElementById('selectMakroRiset').value = draf.makroRiset;
    }
  } catch (e) {
    // silent
  }
}
