
const startScreen     = document.getElementById('start-screen');
const startBtn        = document.getElementById('start-btn');
const startExitBtn    = document.getElementById('start-exit-btn');
const exitOverlayBtn  = document.getElementById('exit-btn-overlay');

const popup           = document.getElementById('popup');
const popupContent    = document.getElementById('popup-content');
const closeBtn        = document.getElementById('close-btn');

const aScene          = document.querySelector('a-scene');


// ----------------------------
// RUMUS BANGUN RUANG (STATIC)
// ----------------------------
const rumus = {
    kubus: `
        <div class="rbox">
            <h3>Kubus</h3>
            <p><strong>Volume:</strong> V = s<sup>3</sup></p>
            <p><strong>Luas Permukaan:</strong> L = 6 × s<sup>2</sup></p>
        </div>
    `,

    balok: `
        <div class="rbox">
            <h3>Balok</h3>
            <p><strong>Volume:</strong> V = p × l × t</p>
            <p><strong>Luas Permukaan:</strong> L = 2 × (pl + pt + lt)</p>
        </div>
    `,

    prisma: `
        <div class="rbox">
            <h3>Prisma Segitiga</h3>
            <p><strong>Volume:</strong> V = Luas Alas × t</p>
            <p><strong>Luas Permukaan:</strong> L = (Keliling Alas × t) + (2 × Luas Alas)</p>
        </div>
    `,

    limas: `
        <div class="rbox">
            <h3>Limas</h3>
            <p><strong>Volume:</strong> V = (1/3) × Luas Alas × t</p>
            <p><strong>Luas Permukaan:</strong> L = Luas Alas + Luas Selimut</p>
        </div>
    `,

    tabung: `
        <div class="rbox">
            <h3>Tabung</h3>
            <p><strong>Volume:</strong> V = π r<sup>2</sup> t</p>
            <p><strong>Luas Permukaan:</strong> L = 2πr (r + t)</p>
        </div>
    `,

    bola: `
        <div class="rbox">
            <h3>Bola</h3>
            <p><strong>Volume:</strong> V = (4/3) π r<sup>3</sup></p>
            <p><strong>Luas Permukaan:</strong> L = 4 π r<sup>2</sup></p>
        </div>
    `,

    kerucut: `
        <div class="rbox">
            <h3>Kerucut</h3>
            <p><strong>Volume:</strong> V = (1/3) π r<sup>2</sup> t</p>
            <p><strong>Luas Permukaan:</strong> L = π r (r + s)</p>
        </div>
    `
};


// -----------------------------
// POPUP CONTROL (SHOW / HIDE)
// -----------------------------
function openPopup(html) {
    popupContent.innerHTML = html;
    popup.classList.add('visible');
    popup.classList.remove('hidden');
    document.body.classList.add('popup-open');
}

function closePopup() {
    popup.classList.remove('visible');
    popup.classList.add('hidden');
    document.body.classList.remove('popup-open');
}

if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
}


// ----------------------------------
// START / EXIT AR CAMERA OPERATIONS
// ----------------------------------

function showAR() {

    // 1. Hilangkan start screen
    if (startScreen) startScreen.style.display = 'none';

    // 2. Tampilkan AR Scene
    if (aScene) {
        aScene.style.display = 'block';
        aScene.play();      // WAJIB → Mengaktifkan AR.js & kamera
    }

    // 3. Tampilkan tombol Exit overlay
    if (exitOverlayBtn) exitOverlayBtn.classList.remove('hidden-overlay');
}


function stopAR() {

    // 1. Pause AR.js & kamera
    if (aScene) {
        aScene.pause();
        aScene.style.display = 'none';
    }

    // 2. Tampilkan kembali start screen
    if (startScreen) startScreen.style.display = 'flex';

    // 3. Sembunyikan tombol exit overlay
    if (exitOverlayBtn) exitOverlayBtn.classList.add('hidden-overlay');

    // 4. Tutup popup jika terbuka
    closePopup();
}


// ---------------------------
// START SCREEN BUTTON EVENTS
// ---------------------------
if (startBtn) {
    startBtn.addEventListener('click', showAR);
}

if (startExitBtn) {
    startExitBtn.addEventListener('click', () => {
        if (confirm('Keluar dari GeoView?')) {
            try { window.close(); }
            catch (e) { window.location.href = 'about:blank'; }
        }
    });
}


// ---------------------------
// EXIT OVERLAY (SAAT AR AKTIF)
// ---------------------------
if (exitOverlayBtn) {
    exitOverlayBtn.addEventListener('click', () => {
        if (confirm('Kembali ke menu utama dan mematikan kamera?')) {
            stopAR();
        }
    });
}


// -----------------------------
// MARKER → MEMUNCULKAN POPUP
// -----------------------------
const markerMap = {
    'marker-kubus':   'kubus',
    'marker-balok':   'balok',
    'marker-prisma':  'prisma',
    'marker-limas':   'limas',
    'marker-tabung':  'tabung',
    'marker-bola':    'bola',
    'marker-kerucut': 'kerucut'
};

Object.keys(markerMap).forEach(markerId => {
    const el = document.getElementById(markerId);
    if (!el) return;

    el.addEventListener('markerFound', () => {
        const k = markerMap[markerId];
        if (rumus[k]) openPopup(rumus[k]);
    });

    // Jika ingin popup hilang saat marker hilang, aktifkan ini:
    // el.addEventListener('markerLost', closePopup);
});


// -----------------------
// INITIAL STATE ON LOAD
// -----------------------
document.addEventListener('DOMContentLoaded', () => {
    if (exitOverlayBtn) exitOverlayBtn.classList.add('hidden-overlay');
    if (popup) popup.classList.add('hidden');
});
