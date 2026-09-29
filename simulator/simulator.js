/**
 * CLIPPR VIRTUAL DEVICE & LIVE UI SIMULATOR
 * Interactive logic for multi-mode feeds, reader view, vault actions,
 * folders, search, and instant screenshot capturing via HTML2Canvas.
 */

// Initial Seed Data (Curated modern links & folders)
const INITIAL_LINKS = [
  {
    id: 'link-1',
    title: 'The Art of Building a Calmer Digital Vault',
    url: 'https://linear.app/principles/calm',
    domain: 'linear.app',
    folder: 'Design',
    folderColor: '#87B69D',
    readTime: '5 min read',
    savedDate: '12 min ago',
    isFavorite: true,
    description: 'Intentional principles behind distraction-free bookmarking. An encrypted local sanctuary for curated reading material alters your relationship with the internet.',
    bodyText: 'Discovering intentional principles behind private, distraction-free bookmarking. In a world saturated with ephemeral feeds and algorithmically generated engagement traps, having an encrypted local sanctuary for your curated reading material alters your relationship with the internet. When your data never touches third-party telemetry servers, peace of mind becomes the default state.',
    notes: 'Essential reference for the new typography rhythm and color system tokens.',
    bannerBg: 'linear-gradient(135deg, #1C2D24 0%, #0F1813 100%)',
    iconText: '🌿'
  },
  {
    id: 'link-2',
    title: 'Designing Fluid Haptics and Micro-gestures for Handhelds',
    url: 'https://raindrop.io/blog/fluid-gestures',
    domain: 'raindrop.io',
    folder: 'Design',
    folderColor: '#87B69D',
    readTime: '8 min read',
    savedDate: '1 hr ago',
    isFavorite: true,
    description: 'Why tactile physical feedback transforms standard list scanning into an organic sensory ritual.',
    bodyText: 'Physicality matters. When mobile applications leverage sub-perceptual tick haptics and spring physics during scroll decelerations, users perceive the interface as responsive and alive.',
    notes: 'Implement spring bounce interpolation on the bottom dock tabs.',
    bannerBg: 'linear-gradient(135deg, #1E2836 0%, #111822 100%)',
    iconText: '⚡'
  },
  {
    id: 'link-3',
    title: 'Zero-Knowledge Cryptography: Local Keystore & AES-256',
    url: 'https://signal.org/docs/local-vault',
    domain: 'signal.org',
    folder: 'Tech',
    folderColor: '#38BDF8',
    readTime: '12 min read',
    savedDate: '3 hrs ago',
    isFavorite: false,
    description: 'Hardware-backed Android Keystore enclave implementation for client-side encrypted room databases.',
    bodyText: 'True privacy begins on device. By generating a hardware-backed master key inside the Android KeyStore Secure Enclave, encryption keys never leave physical silicon even under root privilege execution.',
    notes: 'Verify SQLCipher database cipher configuration.',
    bannerBg: 'linear-gradient(135deg, #2A2234 0%, #15111B 100%)',
    iconText: '🛡️'
  },
  {
    id: 'link-4',
    title: 'Minimalist Architecture in Kyoto: Timber & Light Sanctuary',
    url: 'https://architecturaldigest.com/kyoto-minimalism',
    domain: 'architecturaldigest.com',
    folder: 'Architecture',
    folderColor: '#F59E0B',
    readTime: '6 min read',
    savedDate: 'Yesterday',
    isFavorite: true,
    description: 'Sugi cedar pavilions exploring the interplay between moss gardens and floor-to-ceiling unvarnished paper shoji screens.',
    bodyText: 'Traditional Japanese spatial design emphasizes the continuum between internal tatami spaces and exterior moss gardens. Shadows are not treated as absence of light, but as rich tonal texture.',
    notes: 'Inspiration for our OLED deep dark background levels.',
    bannerBg: 'linear-gradient(135deg, #2D2319 0%, #17110C 100%)',
    iconText: '🏛️'
  },
  {
    id: 'link-5',
    title: 'Type Scales and Optical Kerning for OLED Screens',
    url: 'https://fonts.google.com/knowledge/oled-typography',
    domain: 'fonts.google.com',
    folder: 'Design',
    folderColor: '#87B69D',
    readTime: '4 min read',
    savedDate: '2 days ago',
    isFavorite: false,
    description: 'Balancing contrast ratios and negative kerning for ultra-high resolution AMOLED displays without haloing.',
    bodyText: 'Pure white (#FFFFFF) on pure pitch black (#000000) causes sub-pixel bleeding and eye fatigue during prolonged night reading. Clippr adopts a calibrated soft ivory on organic moss dark surface palette.',
    notes: 'Adopt #F2FBF6 text on #101613 base.',
    bannerBg: 'linear-gradient(135deg, #182A24 0%, #0D1613 100%)',
    iconText: '✒️'
  },
  {
    id: 'link-6',
    title: 'Fast-Fermented Sourdough: Wild Yeast Hydration Ratios',
    url: 'https://kingarthurbaking.com/sourdough-guide',
    domain: 'kingarthurbaking.com',
    folder: 'Recipes',
    folderColor: '#EC4899',
    readTime: '10 min read',
    savedDate: '3 days ago',
    isFavorite: false,
    description: 'Mastering 78% hydration country loaves with blistered crusts and tender open crumb structures.',
    bodyText: 'Temperature control of the autolyse phase determines enzymatic breakdown and gluten web extensibility. Bulk fermentation at 26°C yields the ideal lactic acid profile without excessive sourness.',
    notes: 'Weekend baking test.',
    bannerBg: 'linear-gradient(135deg, #2D1A22 0%, #180D12 100%)',
    iconText: '🍲'
  }
];

const INITIAL_FOLDERS = [
  { id: 'f-1', name: 'Design', icon: '🎨', color: '#87B69D', count: 31 },
  { id: 'f-2', name: 'Tech', icon: '⚡', color: '#38BDF8', count: 18 },
  { id: 'f-3', name: 'Architecture', icon: '🏛️', color: '#F59E0B', count: 14 },
  { id: 'f-4', name: 'Recipes', icon: '🍲', color: '#EC4899', count: 9 },
  { id: 'f-5', name: 'Inbox', icon: '📥', color: '#A855F7', count: 8 }
];

// App State
let state = {
  links: [...INITIAL_LINKS],
  folders: [...INITIAL_FOLDERS],
  feedLayoutMode: 'editorial', // 'editorial' | 'grid' | 'list'
  foldersLayoutMode: 'grid',   // 'grid' | 'list'
  currentScreen: 'home',
  activeLinkId: 'link-1',
  selectedFolderId: 'f-1',
  searchQuery: ''
};

// DOM Elements
const screensContainer = document.getElementById('screens-container');
const screens = {
  'home': document.getElementById('screen-home'),
  'detail': document.getElementById('screen-detail'),
  'folders': document.getElementById('screen-folders'),
  'folder-detail': document.getElementById('screen-folder-detail'),
  'favorites': document.getElementById('screen-favorites'),
  'search': document.getElementById('screen-search'),
  'settings': document.getElementById('screen-settings')
};

// Feeds
const homeLinksFeed = document.getElementById('home-links-feed');
const favoritesLinksFeed = document.getElementById('favorites-links-feed');
const folderLinksFeed = document.getElementById('folder-links-feed');
const searchResultsFeed = document.getElementById('search-results-feed');
const foldersDisplayContainer = document.getElementById('folders-display-container');
const foldersCarousel = document.getElementById('folders-carousel');

// Nav & Modals
const bottomNav = document.getElementById('bottom-nav');
const shareSheetModal = document.getElementById('share-sheet-modal');
const createFolderModal = document.getElementById('create-folder-modal');
const appToast = document.getElementById('app-toast');

// -----------------------------------------------------------------------------
// CLOCK
// -----------------------------------------------------------------------------
function initClock() {
  const clockEl = document.getElementById('status-clock');
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// -----------------------------------------------------------------------------
// TOAST NOTIFICATIONS
// -----------------------------------------------------------------------------
function showToast(message) {
  if (!appToast) return;
  appToast.textContent = message;
  appToast.classList.add('visible');
  setTimeout(() => {
    appToast.classList.remove('visible');
  }, 2200);
}

// -----------------------------------------------------------------------------
// SCREEN NAVIGATION
// -----------------------------------------------------------------------------
function navigateToScreen(screenId) {
  state.currentScreen = screenId;

  // Toggle active screen
  Object.keys(screens).forEach(key => {
    if (screens[key]) {
      if (key === screenId) {
        screens[key].classList.add('active');
        const scrollable = screens[key].querySelector('.screen-scrollable');
        if (scrollable) scrollable.scrollTop = 0;
      } else {
        screens[key].classList.remove('active');
      }
    }
  });

  // Update Left Panel Nav Pills
  document.querySelectorAll('.nav-pill').forEach(pill => {
    if (pill.dataset.screen === screenId) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Update In-App Bottom Nav Tabs
  document.querySelectorAll('.dock-tab').forEach(tab => {
    if (tab.dataset.tab === screenId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Render context if needed
  if (screenId === 'home') renderHomeFeed();
  if (screenId === 'favorites') renderFavoritesFeed();
  if (screenId === 'folders') renderFoldersScreen();
  if (screenId === 'folder-detail') renderFolderDetailScreen();
  if (screenId === 'search') renderSearchFeed();
  if (screenId === 'detail') renderDetailScreen();
}

// -----------------------------------------------------------------------------
// CARD RENDERING HELPERS (Editorial, Grid, List)
// -----------------------------------------------------------------------------
function createLinkCardHtml(link, mode = 'editorial') {
  const isFavClass = link.isFavorite ? 'active-fav' : '';
  const favIconColor = link.isFavorite ? '#EF5350' : 'currentColor';
  const favFill = link.isFavorite ? '#EF5350' : 'none';

  return `
    <div class="link-card" data-link-id="${link.id}">
      <div class="link-preview-box" style="background: ${link.bannerBg}">
        <span style="font-size: 2.2rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));">${link.iconText || '🔖'}</span>
        <span class="link-card-badge">${link.folder}</span>
        <span class="link-read-chip">${link.readTime}</span>
      </div>

      <div class="link-card-content">
        <div class="link-card-meta">
          <span>${link.domain}</span>
          <span>·</span>
          <span>${link.savedDate}</span>
        </div>

        <h3 class="link-card-title">${link.title}</h3>
        <p class="link-card-description">${link.description}</p>

        <div class="link-card-actions">
          <button class="card-action-btn btn-action-fav ${isFavClass}" data-fav-id="${link.id}" title="Favorite">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="${favFill}" stroke="${favIconColor}" stroke-width="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
          <button class="card-action-btn btn-action-share" data-share-id="${link.id}" title="Share">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <button class="card-action-btn btn-action-delete" data-del-id="${link.id}" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function bindCardEvents(container) {
  if (!container) return;

  // Card click -> View detail
  container.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-action-btn')) return; // Ignore if clicked action button
      const linkId = card.dataset.linkId;
      state.activeLinkId = linkId;
      navigateToScreen('detail');
    });
  });

  // Favorite toggle
  container.querySelectorAll('.btn-action-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.favId;
      const link = state.links.find(l => l.id === id);
      if (link) {
        link.isFavorite = !link.isFavorite;
        showToast(link.isFavorite ? 'Pinned to Favorites ❤️' : 'Removed from Favorites');
        refreshCurrentView();
      }
    });
  });

  // Share action
  container.querySelectorAll('.btn-action-share').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.shareId;
      const link = state.links.find(l => l.id === id);
      if (link && navigator.clipboard) {
        navigator.clipboard.writeText(link.url);
        showToast(`Copied URL: ${link.url}`);
      } else {
        showToast('Link ready to share');
      }
    });
  });

  // Delete action
  container.querySelectorAll('.btn-action-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.delId;
      state.links = state.links.filter(l => l.id !== id);
      showToast('Link removed from vault');
      refreshCurrentView();
    });
  });
}

function refreshCurrentView() {
  updateCounts();
  if (state.currentScreen === 'home') renderHomeFeed();
  if (state.currentScreen === 'favorites') renderFavoritesFeed();
  if (state.currentScreen === 'folders') renderFoldersScreen();
  if (state.currentScreen === 'folder-detail') renderFolderDetailScreen();
  if (state.currentScreen === 'search') renderSearchFeed();
  if (state.currentScreen === 'detail') renderDetailScreen();
}

function updateCounts() {
  const favCount = state.links.filter(l => l.isFavorite).length;
  const favCountEl = document.getElementById('fav-count-text');
  if (favCountEl) favCountEl.textContent = `${favCount} links`;

  const favSub = document.getElementById('fav-screen-subtitle');
  if (favSub) favSub.textContent = `${favCount} pinned links`;

  const feedCount = document.getElementById('feed-count-caption');
  if (feedCount) feedCount.textContent = `${state.links.length} links`;
}

// -----------------------------------------------------------------------------
// HOME SCREEN RENDERING
// -----------------------------------------------------------------------------
function renderHomeFeed() {
  if (!homeLinksFeed) return;
  homeLinksFeed.className = `links-feed mode-${state.feedLayoutMode}`;
  homeLinksFeed.innerHTML = state.links.map(l => createLinkCardHtml(l, state.feedLayoutMode)).join('');
  bindCardEvents(homeLinksFeed);

  // Folders Carousel
  if (foldersCarousel) {
    foldersCarousel.innerHTML = state.folders.map(f => `
      <div class="folder-chip-card" data-fid="${f.id}">
        <span class="folder-chip-dot" style="background: ${f.color};"></span>
        <span class="folder-chip-name">${f.name}</span>
        <span class="folder-chip-count">${f.count}</span>
      </div>
    `).join('');

    foldersCarousel.querySelectorAll('.folder-chip-card').forEach(chip => {
      chip.addEventListener('click', () => {
        state.selectedFolderId = chip.dataset.fid;
        navigateToScreen('folder-detail');
      });
    });
  }
}

// -----------------------------------------------------------------------------
// FAVORITES SCREEN RENDERING
// -----------------------------------------------------------------------------
function renderFavoritesFeed() {
  if (!favoritesLinksFeed) return;
  const favLinks = state.links.filter(l => l.isFavorite);
  favoritesLinksFeed.className = `links-feed mode-${state.feedLayoutMode}`;

  if (favLinks.length === 0) {
    favoritesLinksFeed.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 8px;">🤍</p>
        <h4>No favorites yet</h4>
        <p style="font-size: 0.8rem; margin-top: 4px;">Tap the heart icon on any card to pin it here.</p>
      </div>
    `;
    return;
  }

  favoritesLinksFeed.innerHTML = favLinks.map(l => createLinkCardHtml(l, state.feedLayoutMode)).join('');
  bindCardEvents(favoritesLinksFeed);
}

// -----------------------------------------------------------------------------
// FOLDERS SCREEN RENDERING
// -----------------------------------------------------------------------------
function renderFoldersScreen() {
  if (!foldersDisplayContainer) return;
  foldersDisplayContainer.className = `folders-grid mode-${state.foldersLayoutMode}`;
  
  foldersDisplayContainer.innerHTML = state.folders.map(f => `
    <div class="folder-box" data-fid="${f.id}">
      <div class="folder-box-icon" style="color: ${f.color}; border: 1px solid ${f.color}33;">
        ${f.icon}
      </div>
      <div>
        <div class="folder-box-title">${f.name}</div>
        <div class="folder-box-count">${f.count} links</div>
      </div>
    </div>
  `).join('');

  foldersDisplayContainer.querySelectorAll('.folder-box').forEach(box => {
    box.addEventListener('click', () => {
      state.selectedFolderId = box.dataset.fid;
      navigateToScreen('folder-detail');
    });
  });

  const countCaption = document.getElementById('folders-count-caption');
  if (countCaption) {
    const total = state.folders.reduce((acc, f) => acc + f.count, 0);
    countCaption.textContent = `${state.folders.length} folders · ${total} links`;
  }
}

// -----------------------------------------------------------------------------
// FOLDER DETAIL SCREEN RENDERING
// -----------------------------------------------------------------------------
function renderFolderDetailScreen() {
  const folder = state.folders.find(f => f.id === state.selectedFolderId) || state.folders[0];
  if (!folder) return;

  const headerTitle = document.getElementById('folder-detail-header-title');
  const heroTitle = document.getElementById('folder-hero-title');
  const heroIcon = document.getElementById('folder-hero-icon');
  const heroCount = document.getElementById('folder-hero-count');

  if (headerTitle) headerTitle.textContent = folder.name;
  if (heroTitle) heroTitle.textContent = folder.name;
  if (heroIcon) {
    heroIcon.textContent = folder.icon;
    heroIcon.style.color = folder.color;
  }
  if (heroCount) heroCount.textContent = `${folder.count} links · updated today`;

  // Links matching folder
  if (folderLinksFeed) {
    const matching = state.links.filter(l => l.folder.toLowerCase() === folder.name.toLowerCase());
    folderLinksFeed.className = `links-feed mode-${state.feedLayoutMode}`;
    
    if (matching.length === 0) {
      folderLinksFeed.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <p style="font-size: 2rem; margin-bottom: 8px;">📂</p>
          <h4>Folder is empty</h4>
          <p style="font-size: 0.8rem; margin-top: 4px;">Save links or move items into this folder.</p>
        </div>
      `;
    } else {
      folderLinksFeed.innerHTML = matching.map(l => createLinkCardHtml(l, state.feedLayoutMode)).join('');
      bindCardEvents(folderLinksFeed);
    }
  }
}

// -----------------------------------------------------------------------------
// DETAIL / READER MODE SCREEN RENDERING
// -----------------------------------------------------------------------------
function renderDetailScreen() {
  const link = state.links.find(l => l.id === state.activeLinkId) || state.links[0];
  if (!link) return;

  const domainHeader = document.getElementById('detail-header-domain');
  const heroBanner = document.getElementById('detail-hero-banner');
  const fullTitle = document.getElementById('detail-full-title');
  const folderBadge = document.getElementById('detail-folder-badge');
  const readTime = document.getElementById('detail-read-time');
  const savedDate = document.getElementById('detail-saved-date');
  const bodyText = document.getElementById('detail-body-text');
  const notesText = document.getElementById('detail-notes-text');
  const favBtn = document.getElementById('detail-btn-fav');

  if (domainHeader) domainHeader.textContent = link.domain.toUpperCase();
  if (fullTitle) fullTitle.textContent = link.title;
  if (folderBadge) {
    folderBadge.textContent = link.folder;
    folderBadge.style.color = link.folderColor || '#87B69D';
  }
  if (readTime) readTime.textContent = link.readTime;
  if (savedDate) savedDate.textContent = `Saved ${link.savedDate}`;
  if (bodyText) bodyText.textContent = link.bodyText;
  if (notesText) notesText.textContent = link.notes;

  if (heroBanner) {
    heroBanner.style.background = link.bannerBg;
    heroBanner.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">
        ${link.iconText || '🔖'}
      </div>
    `;
  }

  if (favBtn) {
    const isFav = link.isFavorite;
    favBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#EF5350' : 'none'}" stroke="${isFav ? '#EF5350' : 'currentColor'}" stroke-width="2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    `;
    favBtn.onclick = () => {
      link.isFavorite = !link.isFavorite;
      showToast(link.isFavorite ? 'Pinned to Favorites ❤️' : 'Removed from Favorites');
      renderDetailScreen();
      updateCounts();
    };
  }

  // Floating dock actions
  const dockShare = document.getElementById('dock-btn-share');
  if (dockShare) {
    dockShare.onclick = () => {
      if (navigator.clipboard) navigator.clipboard.writeText(link.url);
      showToast(`Copied URL: ${link.url}`);
    };
  }

  const dockCopy = document.getElementById('dock-btn-copy');
  if (dockCopy) {
    dockCopy.onclick = () => {
      if (navigator.clipboard) navigator.clipboard.writeText(link.url);
      showToast('Link copied to clipboard');
    };
  }

  const dockTrash = document.getElementById('dock-btn-trash');
  if (dockTrash) {
    dockTrash.onclick = () => {
      state.links = state.links.filter(l => l.id !== link.id);
      showToast('Deleted link');
      navigateToScreen('home');
    };
  }

  const btnOpenBrowser = document.getElementById('detail-btn-open-browser');
  if (btnOpenBrowser) {
    btnOpenBrowser.onclick = () => {
      window.open(link.url, '_blank');
    };
  }

  // Scroll reading progress listener
  const scrollContainer = document.getElementById('detail-scrollable');
  const progressFill = document.getElementById('reader-progress-fill');
  if (scrollContainer && progressFill) {
    scrollContainer.onscroll = () => {
      const scrollTotal = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const progress = scrollTotal > 0 ? (scrollContainer.scrollTop / scrollTotal) * 100 : 0;
      progressFill.style.width = `${Math.min(100, Math.max(10, progress))}%`;
    };
  }
}

// -----------------------------------------------------------------------------
// SEARCH SCREEN RENDERING
// -----------------------------------------------------------------------------
function renderSearchFeed() {
  if (!searchResultsFeed) return;
  const q = state.searchQuery.toLowerCase().trim();
  const results = q ? state.links.filter(l => 
    l.title.toLowerCase().includes(q) ||
    l.domain.toLowerCase().includes(q) ||
    l.folder.toLowerCase().includes(q) ||
    l.description.toLowerCase().includes(q)
  ) : state.links;

  searchResultsFeed.className = `links-feed mode-${state.feedLayoutMode}`;
  if (results.length === 0) {
    searchResultsFeed.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 8px;">🔍</p>
        <h4>No matching links found</h4>
        <p style="font-size: 0.8rem; margin-top: 4px;">Try searching for "design", "crypto", or "linear".</p>
      </div>
    `;
  } else {
    searchResultsFeed.innerHTML = results.map(l => createLinkCardHtml(l, state.feedLayoutMode)).join('');
    bindCardEvents(searchResultsFeed);
  }
}

// -----------------------------------------------------------------------------
// SCREENSHOT CAPTURE (Immediate PNG Download)
// -----------------------------------------------------------------------------
function initScreenshotCapture() {
  const btnScreenshot = document.getElementById('btn-screenshot');
  if (!btnScreenshot) return;

  btnScreenshot.addEventListener('click', async () => {
    btnScreenshot.disabled = true;
    btnScreenshot.innerHTML = 'Capturing...';

    try {
      const deviceElement = document.getElementById('device-screen');
      if (!deviceElement) throw new Error('Device screen not found');

      // html2canvas capture
      const canvas = await html2canvas(deviceElement, {
        backgroundColor: '#101613',
        scale: 2, // High-res retina capture
        useCORS: true,
        logging: false
      });

      // Create download link
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `clippr_screenshot_${state.currentScreen}_${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('📸 Screenshot saved successfully!');
    } catch (err) {
      console.error('Screenshot error:', err);
      showToast('⚠️ Screenshot failed. Check console.');
    } finally {
      btnScreenshot.disabled = false;
      btnScreenshot.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Capture Screenshot
      `;
    }
  });
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS & SETUP
// -----------------------------------------------------------------------------
function initEventListeners() {
  // Left Panel Screen Navigator Pills
  document.querySelectorAll('.nav-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const target = pill.dataset.screen;
      navigateToScreen(target);
    });
  });

  // Bottom Navigation Dock Tabs
  document.querySelectorAll('.dock-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      navigateToScreen(target);
    });
  });

  // Back buttons
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToScreen('home');
    });
  });

  // Home search trigger
  const homeSearchTrigger = document.getElementById('home-search-trigger');
  if (homeSearchTrigger) {
    homeSearchTrigger.addEventListener('click', () => {
      navigateToScreen('search');
    });
  }

  // View All Folders action
  const actionViewFolders = document.getElementById('action-view-folders');
  if (actionViewFolders) {
    actionViewFolders.addEventListener('click', () => {
      navigateToScreen('folders');
    });
  }

  // Quick access cards
  const quickFav = document.getElementById('card-quick-fav');
  if (quickFav) {
    quickFav.addEventListener('click', () => navigateToScreen('favorites'));
  }

  // Feed Layout Mode Toggle (Editorial / Grid / List)
  const feedToggles = [
    document.getElementById('feed-layout-toggle'),
    document.getElementById('fav-layout-toggle')
  ];

  feedToggles.forEach(toggle => {
    if (!toggle) return;
    toggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        state.feedLayoutMode = mode;

        // Sync toggle pill active state across views
        feedToggles.forEach(t => {
          if (t) {
            t.querySelectorAll('.toggle-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.mode === mode);
            });
          }
        });

        refreshCurrentView();
        showToast(`Layout switched to ${mode.toUpperCase()}`);
      });
    });
  });

  // Folders layout toggle (Grid / List)
  const foldersLayoutToggle = document.getElementById('folders-layout-toggle');
  if (foldersLayoutToggle) {
    foldersLayoutToggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fmode = btn.dataset.fmode;
        state.foldersLayoutMode = fmode;
        foldersLayoutToggle.querySelectorAll('.toggle-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.fmode === fmode);
        });
        renderFoldersScreen();
      });
    });
  }

  // Live Search Input
  const liveSearchInput = document.getElementById('live-search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  if (liveSearchInput) {
    liveSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (btnClearSearch) btnClearSearch.style.display = state.searchQuery ? 'flex' : 'none';
      renderSearchFeed();
    });
  }
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      state.searchQuery = '';
      if (liveSearchInput) liveSearchInput.value = '';
      btnClearSearch.style.display = 'none';
      renderSearchFeed();
    });
  }

  // Topic search chips
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic;
      state.searchQuery = topic;
      if (liveSearchInput) liveSearchInput.value = topic;
      if (btnClearSearch) btnClearSearch.style.display = 'flex';
      renderSearchFeed();
    });
  });

  // Left sidebar add link form
  const formAddLink = document.getElementById('form-add-link');
  if (formAddLink) {
    formAddLink.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('input-title').value.trim();
      const url = document.getElementById('input-url').value.trim();
      const folderVal = document.getElementById('select-folder').value;

      let domain = 'web.dev';
      try { domain = new URL(url).hostname; } catch(err){}

      const newLink = {
        id: `link-${Date.now()}`,
        title,
        url,
        domain,
        folder: folderVal.charAt(0).toUpperCase() + folderVal.slice(1),
        folderColor: '#87B69D',
        readTime: '3 min read',
        savedDate: 'Just now',
        isFavorite: false,
        description: `Imported resource from ${domain}. Ready for offline encrypted reading.`,
        bodyText: `Saved live bookmark: ${title}. Clippr isolates external track scripts and guarantees privacy.`,
        notes: 'Added from simulator control panel.',
        bannerBg: 'linear-gradient(135deg, #1C2D24 0%, #0F1813 100%)',
        iconText: '🔗'
      };

      state.links.unshift(newLink);
      formAddLink.reset();
      showToast('Link added to Clippr vault! ✨');
      refreshCurrentView();
    });
  }

  // Theme toggle
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      showToast('Theme toggled');
    });
  }

  // Android Share Sheet Simulation
  const btnTriggerShare = document.getElementById('btn-trigger-share');
  const btnCloseShare = document.getElementById('btn-close-share');
  const btnConfirmSaveSheet = document.getElementById('btn-confirm-save-sheet');
  const sheetFolderChips = document.getElementById('sheet-folder-chips');

  if (btnTriggerShare && shareSheetModal) {
    btnTriggerShare.addEventListener('click', () => {
      // populate sheet folders
      if (sheetFolderChips) {
        sheetFolderChips.innerHTML = state.folders.map((f, i) => `
          <button class="sheet-f-chip ${i === 0 ? 'active' : ''}">${f.icon} ${f.name}</button>
        `).join('');

        sheetFolderChips.querySelectorAll('.sheet-f-chip').forEach(c => {
          c.addEventListener('click', () => {
            sheetFolderChips.querySelectorAll('.sheet-f-chip').forEach(x => x.classList.remove('active'));
            c.classList.add('active');
          });
        });
      }
      shareSheetModal.classList.add('active');
    });
  }

  if (btnCloseShare && shareSheetModal) {
    btnCloseShare.addEventListener('click', () => {
      shareSheetModal.classList.remove('active');
    });
  }

  if (btnConfirmSaveSheet && shareSheetModal) {
    btnConfirmSaveSheet.addEventListener('click', () => {
      shareSheetModal.classList.remove('active');
      showToast('Saved from Share Sheet to Vault! 🚀');
    });
  }

  // Create Folder Modal
  const btnOpenCreateFolder = document.getElementById('btn-open-create-folder');
  const btnCloseFolderModal = document.getElementById('btn-close-folder-modal');
  const btnConfirmCreateFolder = document.getElementById('btn-confirm-create-folder');
  const modalFolderName = document.getElementById('modal-folder-name');

  if (btnOpenCreateFolder && createFolderModal) {
    btnOpenCreateFolder.addEventListener('click', () => {
      createFolderModal.classList.add('active');
    });
  }

  if (btnCloseFolderModal && createFolderModal) {
    btnCloseFolderModal.addEventListener('click', () => {
      createFolderModal.classList.remove('active');
    });
  }

  // Color Swatch Selection
  let selectedColor = '#87B69D';
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
    });
  });

  if (btnConfirmCreateFolder && createFolderModal) {
    btnConfirmCreateFolder.addEventListener('click', () => {
      const name = modalFolderName ? modalFolderName.value.trim() : '';
      if (!name) {
        showToast('Please enter a folder name');
        return;
      }
      const newFolder = {
        id: `f-${Date.now()}`,
        name: name,
        icon: '📁',
        color: selectedColor,
        count: 0
      };
      state.folders.push(newFolder);
      if (modalFolderName) modalFolderName.value = '';
      createFolderModal.classList.remove('active');
      showToast(`Created folder "${name}"!`);
      renderFoldersScreen();
    });
  }
}

// -----------------------------------------------------------------------------
// INIT
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initEventListeners();
  initScreenshotCapture();
  updateCounts();
  renderHomeFeed();
});
