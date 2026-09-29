# Production Implementation Plan: Clippr — Native Android Link Vault

## 1. Executive Summary
Clippr is a private, local-first native Android application built with Kotlin, Jetpack Compose, Material 3, Room, Android Keystore, and BiometricPrompt. It serves as an ultra-secure, privacy-first vault for capturing, curating, and organizing web links received directly from the native Android Sharesheet (`ACTION_SEND` and `ACTION_PROCESS_TEXT`).

This implementation replaces all prototype concepts with real Android platform capabilities, enterprise-grade architecture, and cryptographic data protection while strictly adhering to the visual source of truth established in `design/CLIPPR_DESIGN_SYSTEM.md`, the 19 Figma screen mocks (`design/screens/`), and 58 vector icon assets (`design/icons/`).

---

## 2. Technical Stack & Architecture

### 2.1 Technology Stack
- **Language**: Kotlin 1.9+ / 2.0
- **UI Toolkit**: Jetpack Compose + Material 3 (`androidx.compose.material3`) with unified, shared reusable component architecture
- **Architecture**: Clean Architecture + MVI/MVVM (Presentation, Domain, Data, Workers)
- **Local Database**: Room 2.6+ with SQLite, explicit migrations, Flow reactive streams, and Room SQLite full-text search
- **Security & Cryptography**:
  - **Local App Encryption**: Android Keystore (`AndroidKeyStore`) with hardware-backed key protection where supported, and secure software-backed fallback on devices lacking hardware security.
  - **Portable Backups**: Strict user backup password &rarr; **PBKDF2-HMAC-SHA256** &rarr; Derived 256-bit encryption key &rarr; **AES-256-GCM** &rarr; `.CLIPPR` backup. Never uses device-bound Keystore keys for backups, ensuring true cross-device portability.
- **Biometrics**: BiometricPrompt configured with `BIOMETRIC_STRONG` and Android device-credential fallback (PIN, Pattern, Password). The implementation must use the device's available biometric security capabilities and must not assume hardware-backed biometric authentication on every device. No separate Clippr PIN system; Clippr never stores or verifies the user's PIN, pattern, or biometric data.
- **Background Execution**: AndroidX WorkManager for asynchronous metadata hydration and independent 30-day trash auto-purge (runs regardless of app launch).
- **Asynchronous & Reactive**: Kotlin Coroutines + StateFlow / SharedFlow
- **Image Pipeline**: Coil Compose (`io.coil-kt:coil-compose`) with persistent app-private storage (`previews/`)
- **Safe Networking (SafeNetwork)**: OkHttp with strict network-security validation specifically for metadata fetching: resolve and validate destination before connection, revalidate every redirect, and prevent DNS rebinding or resolution changes from bypassing private/internal-network protections (ensuring the final connection strictly uses the validated destination).
- **HTML/OG Parsing**: Ksoup / lightweight safe stream parser for OpenGraph, Twitter Cards, and `<title>`. Never executes JavaScript, HTML, or downloaded files.
- **Navigation**: Navigation Compose with type-safe arguments and custom animated transitions

### 2.2 System & Package Architecture

```text
com.clippr.app/
├── ClipprApplication.kt             # Application entry, Keystore init, WorkManager setup
├── presentation/
│   ├── theme/                       # Color.kt (Forest OLED / Emerald Light), Type.kt, Shape.kt, Theme.kt
│   ├── navigation/                  # ClipprNavHost, Screen destinations, Transitions
│   ├── components/                  # Global shared UI components: ClipprCard, ClipprButton, ClipprPill,
│   │                                # ClipprBottomNavBar, ClipprTopBar, ClipprIcon, ClipprToast, ClipprDialog
│   ├── auth/                        # BiometricLockScreen, DeviceCredentialPrompt, AuthViewModel
│   ├── splash/                      # AnimatedSplashScreen (1-second sequence: fade -> scale -> settle)
│   ├── home/                        # HomeScreen, HomeViewModel, HomeUiState
│   ├── folders/                     # FoldersScreen, FolderDetailScreen, NewFolderDialog, FolderViewModel
│   ├── links/                       # LinkDetailBottomSheet, EditLinkSheet, MoveLinkDialog
│   ├── search/                      # SearchScreen, SearchViewModel
│   ├── favorites/                   # FavoritesScreen
│   ├── trash/                       # TrashScreen, TrashViewModel
│   ├── settings/                    # SettingsScreen, SecuritySettingsScreen, ThemeDialog
│   ├── backup/                      # BackupRestoreScreen, BackupViewModel
│   └── share/                       # ShareSaveActivity (Native Share target), ShareSaveBottomSheet
├── domain/
│   ├── model/                       # Link, Folder, VaultSettings, LinkMetadata, BackupPayload, BackupHeader
│   ├── repository/                  # LinkRepository, FolderRepository, SettingsRepository
│   └── usecase/                     # SaveLinkUseCase, ExtractUrlUseCase, SearchLinksUseCase, BackupCryptoUseCase
├── data/
│   ├── local/
│   │   ├── ClipprDatabase.kt        # Room database with explicit versioning and migration strategies
│   │   ├── migration/               # Schema migration scripts (e.g. Migration_1_2)
│   │   ├── dao/                     # LinkDao, FolderDao
│   │   └── entity/                  # LinkEntity, FolderEntity, LinkFtsEntity
│   ├── security/
│   │   ├── KeystoreManager.kt       # Local key protection (hardware-backed with software fallback)
│   │   ├── BackupCryptoManager.kt   # Password-derived PBKDF2-HMAC-SHA256 + AES-GCM for portable .CLIPPR backups
│   │   └── VaultLockManager.kt      # Lifecycle observer, timeout tracking, FLAG_SECURE
│   ├── metadata/
│   │   ├── MetadataFetcher.kt       # OpenGraph/Twitter card/HTML title extractor
│   │   └── SafeNetworkClient.kt     # SafeNetwork: SSRF filter, redirect re-validator, response caps, timeouts
│   └── repository/                  # LinkRepositoryImpl, FolderRepositoryImpl, SettingsRepositoryImpl
├── worker/
│   ├── MetadataSyncWorker.kt        # Background metadata fetcher (SafeNetwork-guarded)
│   └── TrashPurgeWorker.kt          # Scheduled 30-day auto-delete (runs independently)
└── util/
    ├── ShareIntentParser.kt         # Extraction of URL from EXTRA_TEXT (embedded), EXTRA_TITLE, PROCESS_TEXT
    ├── UrlNormalizer.kt             # Deterministic URL normalization for duplicate detection
    ├── DateFormatter.kt             # Relative time formatting
    └── PreviewStorageManager.kt     # Manages persistent app-private previews/ directory & cleanup
```

---

## 3. Database Schema & Migration Strategy

```kotlin
@Entity(tableName = "links")
data class LinkEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val url: String,
    val normalizedUrl: String,       // Deterministic normalized URL for duplicate detection
    val title: String,
    val description: String?,
    val domain: String,
    val previewImagePath: String?,   // Path inside persistent app-private previews/ directory
    val faviconPath: String?,
    val folderId: String,            // "inbox" or folder UUID
    val isFavorite: Boolean = false,
    val isTrash: Boolean = false,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val lastOpenedAt: Long? = null,
    val trashedAt: Long? = null,
    val notes: String? = null
)

@Entity(tableName = "folders")
data class FolderEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val name: String,
    val icon: String,                // SVG icon identifier
    val colorHex: String,
    val isSystem: Boolean = false,   // true for "Inbox"
    val sortOrder: Int = 0,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "links_fts")
// Room SQLite full-text search
@Fts4(contentEntity = LinkEntity::class)
data class LinkFtsEntity(
    val title: String,
    val url: String,
    val domain: String,
    val description: String?,
    val notes: String?
)
```

### Migration Policy:
- Explicit version tracking (`version = 1`, `version = 2`, etc.).
- Never use destructive database recreation (`fallbackToDestructiveMigration()`) in production.
- Every schema change must have a corresponding `Migration(from, to)` accompanied by automated Room migration tests.

---

## 4. Production Phased Implementation Plan

### Phase 1: Native Android Project & Compose Design System
**Objective:** Initialize native Android Gradle project with Kotlin DSL, configure compile/target SDK 34/36, integrate Jetpack Compose Material 3, and establish the exact color, typography, shape, and vector icon tokens from Figma.

- **Task 1.1: Gradle Project & Dependencies Scaffolding**
  - Configure root `build.gradle.kts`, `settings.gradle.kts`, and `app/build.gradle.kts`.
  - Dependencies: Jetpack Compose BOM, Material 3, Room, Navigation Compose, Coil, Biometric, WorkManager, OkHttp, Coroutines.
  - Verification: `gradlew.bat assembleDebug` succeeds cleanly with zero errors.
- **Task 1.2: Design Tokens & Material 3 Theme**
  - Implement `Color.kt` matching Figma tokens: Dark OLED (`#101613`, `#19221E`, `#263E33`, `#87B69D`) and Light Emerald (`#F8FAF9`, `#FFFFFF`, `#EDF4F0`, `#26573F`).
  - Implement `Type.kt` using `DM Sans` (Headings) and `Inter` (Body/UI) downloadable/bundled fonts.
  - Implement `Shape.kt` with exact container radii: `30.dp` (hero), `24.dp` (cards), `18.dp` (vault modules), `16.dp` (chips).
  - Convert 58 Figma SVG icons into Android Vector Drawables (`res/drawable/`).
- **Task 1.3: Centralized Shared UI Components**
  - Build reusable, shared components: `ClipprIcon`, `ClipprCard`, `ClipprButton`, `ClipprSearchBar`, `ClipprPill`, `ClipprBottomNavBar`, `ClipprTopBar`, and `ClipprToast`.
  - Enforce global consistency: all screens consume these shared primitives so token/theme changes automatically propagate everywhere.
- **Checkpoint 1 Verification:**
  - [ ] `gradlew assembleDebug` and `gradlew assembleRelease` compile successfully.
  - [ ] Component catalog / Theme preview renders in dark and light modes.

---

### Phase 2: Room Database & Local Persistence Engine
**Objective:** Build the local database layer with Room, SQLite full-text search, explicit versioning and migration support, persistent preview image management, and seed folders.

- **Task 2.1: Entities & Room DAOs**
  - Define `LinkEntity`, `FolderEntity`, `LinkFtsEntity` with Room SQLite full-text search.
  - Implement `LinkDao` (insert, update, soft-delete to trash, restore, permanent delete, favorite toggle, move, search queries, pagination, duplicate check via `normalizedUrl`).
  - Implement `FolderDao` (get folders with link count, insert, rename, delete with link relocation strategy).
- **Task 2.2: Persistent Preview Storage Manager**
  - Implement `PreviewStorageManager`: store permanent preview images in app-private `previews/` directory (`context.filesDir/previews/`), NOT the volatile Android cache directory.
  - Temporary download/network files may use cache, but permanent preview assets live in `previews/`.
  - When links are permanently wiped (individually or via 30-day purge), delete their associated preview image files.
- **Task 2.3: Repositories, Migrations & Persistence Tests**
  - Implement `LinkRepository` and `FolderRepository` backed by Kotlin Flow.
  - Implement Room migration scaffolding with test verification (`MigrationTestHelper`).
  - Database initializer seeding system folders ("Inbox" with system protection).
- **Checkpoint 2 Verification:**
  - [ ] `gradlew testDebugUnitTest` passes.
  - [ ] Database correctly creates, reads, updates, trashes, and restores links, and manages preview files in `previews/`.

---

### Phase 3: Android Security, Keystore & Biometric Authentication
**Objective:** Implement hardware-backed encryption with software fallback using Android Keystore, real `BiometricPrompt` authentication using `BIOMETRIC_STRONG` with device-credential fallback, lifecycle auto-lock, and `FLAG_SECURE` window protection.

- **Task 3.1: Android Keystore Local Key Protection**
  - Implement `KeystoreManager` generating an AES-256-GCM master key in the Android Keystore with hardware-backed protection where available, and secure software-backed fallback on devices lacking hardware security.
  - Encrypt sensitive local data (private notes, local session state).
- **Task 3.2: BiometricPrompt with Device Credential Fallback**
  - Implement `BiometricHelper` utilizing `androidx.biometric.BiometricPrompt`.
  - Configuration: **BiometricPrompt configured with `BIOMETRIC_STRONG` and Android device-credential fallback**. The implementation must use the device's available biometric security capabilities and must not assume hardware-backed biometric authentication on every device.
  - No separate Clippr PIN system. Clippr must never store or verify the user's device PIN, pattern, or biometric data.
  - Implement user-facing Biometric Lock screen with visual fingerprint ring animation matching Figma `Biometric lock · dark`.
- **Task 3.3: App Lock Lifecycle & Privacy Controls**
  - Implement `VaultLockManager` (tracks app backgrounding timestamp, enforces configurable timeout e.g. 1 min / 5 min / immediate).
  - Implement "Hide Content in Recents" using `Window.setFlags(FLAG_SECURE, FLAG_SECURE)`.
- **Checkpoint 3 Verification:**
  - [ ] Keystore key creation succeeds on both hardware and software fallback devices.
  - [ ] App prompts for real biometric / device credential on launch and auto-locks after timeout.
  - [ ] App preview is hidden in Android recent apps switcher when `FLAG_SECURE` is active.

---

### Phase 4: Core Browsing Screens (Home, Folders, Favorites, Search)
**Objective:** Recreate the core browsing experience in Jetpack Compose: Home dashboard, Folders overview, Folder Detail, Favorites tab, and offline full-text Search using shared UI components.

- **Task 4.1: Top Bar & Dynamic Bottom Navigation**
  - Status bar integration using Compose `WindowInsets` & `edge-to-edge`.
  - Top app bar with dynamic title and context actions.
  - Custom Material 3 Navigation Bar with pill indicator and inbox badge counter.
- **Task 4.2: Home Screen (`Home · dark` and `Home · light`)**
  - Search trigger bar ("Search your links...").
  - Quick access row: Inbox, Favorites.
  - Horizontal Folders carousel with custom badge counts and icon styles.
  - Recently saved links feed with rich `LinkCard` (OG preview thumbnail, domain favicon, title, tags, date, overflow menu).
- **Task 4.3: Folders & Folder Detail Screen**
  - Folders screen: Grid and list layout toggle.
  - `NewFolderDialog` with color and icon picker.
  - `FolderDetailScreen` with folder header, item count, sort by (date, title, domain), and tag filtering.
- **Task 4.4: Favorites & Search Screens**
  - `FavoritesScreen` reactively displaying all pinned items.
  - `SearchScreen` with real-time Room SQLite full-text search filtering across titles, URLs, domains, and notes with query history chips.
- **Checkpoint 4 Verification:**
  - [ ] Navigation between Home, Folders, Favorites, and Settings transitions smoothly.
  - [ ] Instant search returns matches from Room full-text search without stutter.

---

### Phase 5: Android Sharesheet Integration, SafeNetwork & Physical Device Verification
**Objective:** Enable Clippr as a native Android share target (`ACTION_SEND` and `ACTION_PROCESS_TEXT`), implement robust URL extraction, preserve LAN/localhost saving, enforce SafeNetwork metadata security, and verify on physical Android devices.

- **Task 5.1: Android Share Target Activity & Intent Filters**
  - Register `ShareSaveActivity` in `AndroidManifest.xml` with:
    - `android.intent.action.SEND` for MIME types `text/plain` and `text/uri-list` (`Intent.EXTRA_TEXT` and `Intent.EXTRA_TITLE`)
    - `android.intent.action.PROCESS_TEXT` for text selection sharing
  - Transparent theme bottom sheet overlay directly over the sending app.
- **Task 5.2: Robust URL Extractor & Duplicate Detection**
  - `ShareIntentParser`: extract valid HTTP/HTTPS URLs from surrounding copy (e.g. `Check this out: https://example.com/article` -> `https://example.com/article`). Original shared text must never be silently stored as URL when a valid URL is extractable.
  - Handle `ACTION_PROCESS_TEXT`: attempt extraction. If valid URL found, proceed to save flow. If ordinary text without URL, display a clear "No link detected" notice and create NO link record.
  - **Saving vs Metadata Fetching Rule**:
    - **SAVING**: All valid HTTP/HTTPS URLs (including `https://example.com`, `http://localhost:3000`, `http://127.0.0.1:8080`, `http://192.168.1.100:3000`, `http://10.0.0.5`) MUST be saved to Room immediately. Never reject LAN/localhost URLs on save.
    - **METADATA FETCHING**: Subject to SafeNetwork validation below. If unsafe or failed, skip metadata enrichment; the link remains safely saved.
  - **Deterministic Duplicate Detection**: Compute `normalizedUrl`. For v1, detect duplicates only when normalized URLs are identical. Allow user to: **Cancel Save**, **Save Anyway**, or **Open Existing Link**.
- **Task 5.3: Save Link UI (`Save Link Screen`)**
  - Instant local database write to selected folder (defaults to last-used or "Inbox").
  - Auto-generated or editable title, URL preview, folder selector with "+ New Folder".
  - Fast dismiss and tactile feedback (<300ms).
- **Task 5.4: SafeNetwork Metadata Engine (`WorkManager` + `OkHttp`)**
  - Immediate local save first; spawn `MetadataSyncWorker` in background.
  - **SafeNetwork Requirements**:
    - Validate destination before every request (scheme must be `http` or `https`; reject `file`, `content`, `javascript`, `data`, `ftp`).
    - **Block private/internal destinations for metadata fetching**: `localhost`, `127.0.0.1`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, link-local, private IPv6.
    - **DNS Rebinding & Redirect Protection**: Resolve and validate the destination before connection, revalidate every redirect, and prevent DNS rebinding or resolution changes from bypassing private/internal-network protections (ensuring the final socket connection uses the validated IP). Reject redirect if pointing to internal/private destination.
    - **Timeouts & Limits**: Explicit connection, read, and request timeouts. Enforce 2MB maximum response size.
    - **Content handling**: Parse only required metadata. Never execute returned JavaScript, HTML, or downloaded files. Never install or launch downloaded content.
    - **Failure handling**: Metadata failure leaves link saved, metadata empty/partial, UI fully usable.
    - Store permanent preview images in persistent `previews/` directory.
- **Task 5.5: Mandatory Physical Device Sharesheet Testing Suite**
  - **Physical Device Required**: Sharesheet integration must not be deemed complete based only on emulator or unit tests.
  - **Test Applications**: Chrome, YouTube, X/Twitter (or app sharing web URLs), at least one messaging app, at least one app sharing plain text with a URL.
  - **Test Payload Formats**: `text/plain`, `text/uri-list`, `Intent.EXTRA_TEXT`, `Intent.EXTRA_TITLE`.
  - **Test URL Forms**:
    - `https://example.com`
    - `Check this out: https://example.com/article`
    - `https://example.com/article?id=123`
    - `http://localhost:3000`
    - `http://192.168.1.100:3000`
  - **Test `ACTION_PROCESS_TEXT`**:
    - Select URL text &rarr; Text menu &rarr; Clippr &rarr; Save works.
    - Select non-URL text &rarr; Clippr &rarr; "No link detected" &rarr; No link created.
  - **Mandatory End-to-End Journey on Physical Device**:
    Chrome &rarr; Share &rarr; Clippr &rarr; Save Link &rarr; Room persistence &rarr; Close Clippr &rarr; Reopen &rarr; Authenticate &rarr; Search &rarr; Link present &rarr; Open link.
- **Checkpoint 5 Verification:**
  - [ ] **Physical Android device verification: test Chrome, YouTube/X, a messaging app, and plain-text sharing using `ACTION_SEND` and `ACTION_PROCESS_TEXT`; verify `text/plain`, `text/uri-list`, embedded URLs, localhost/LAN URLs, and text containing no URL.**
  - [ ] Mandatory end-to-end flow passes on physical Android device.
  - [ ] SafeNetwork blocks metadata fetching to LAN/localhost while saving link successfully.

---

### Phase 6: Link Actions, 30-Day Trash Purge & Portable Encrypted Backup/Restore
**Objective:** Implement full link lifecycle operations, automatic 30-day Trash purge via WorkManager, and portable encrypted `.CLIPPR` backup/restore with strict PBKDF2-HMAC-SHA256 and AES-256-GCM.

- **Task 6.1: Comprehensive Link Actions**
  - **Open**: Launch external browser using `Intent(ACTION_VIEW, Uri.parse(url))` with Custom Tabs where supported.
  - **Copy**: Copy URL to `ClipboardManager` with animated toast feedback.
  - **Share**: Re-share link to system Android Sharesheet via `Intent.createChooser()`.
  - **Edit**: `EditLinkSheet` to modify title, URL, tags, folder, and private notes.
  - **Move**: `MoveLinkDialog` to shift links between folders.
  - **Favorite**: One-tap toggle with micro-bounce animation.
  - **Delete**: Soft-delete moving link to Trash with an "Undo" snackbar.
- **Task 6.2: 30-Day Trash Auto-Purge Worker**
  - `TrashScreen` showing deleted items, days-until-purge counter.
  - Individual "Restore" and "Delete Permanently" actions.
  - "Empty Trash" bulk wipe with confirmation dialog.
  - `TrashPurgeWorker` scheduled periodically via WorkManager: permanently deletes links whose `deletedAt` timestamp is older than 30 days relative to the current time.
  - The worker must delete the associated preview files and assets only after the database/file deletion operation has been safely coordinated, so orphaned files don't accumulate. Runs completely independent of user opening the app.
- **Task 6.3: Portable Encrypted `.CLIPPR` Backup / Restore Engine**
  - **Strict Backup Encryption Architecture**:
    - Input: User-provided backup password (never stored in backup).
    - KDF: **PBKDF2-HMAC-SHA256** (strictly PBKDF2-HMAC-SHA256; no substitution).
    - Salt: Cryptographically secure random salt (16+ bytes) unique for every backup.
    - **Iteration Count Selection & Benchmarking**:
      - Default baseline: **210,000 iterations** (aligned with OWASP/NIST guidelines for PBKDF2-HMAC-SHA256).
      - Calibration target: **~250ms–500ms** derivation duration on mid-range Android devices, balancing high brute-force resistance with responsive UX on `Dispatchers.Default` without ANRs.
      - The calibrated count ($\ge 210,000$) is stored in the `.CLIPPR` header, ensuring deterministic decryption on any target device.
    - Cipher: **AES-256-GCM** with a unique cryptographically secure nonce (12 bytes) for every backup.
    - Header Metadata: Backup format version (`v1`), KDF identifier (`PBKDF2-HMAC-SHA256`), iteration count, salt, encryption algorithm (`AES-256-GCM`), AES-GCM nonce.
    - Portability: Backup created on Device A MUST be restorable on Device B with password. Never use device-bound Keystore keys for portable backups.
  - **Restore & Import Behavior**:
    - File validation &rarr; Read version & KDF parameters &rarr; Prompt for backup password &rarr; PBKDF2-HMAC-SHA256 key derivation &rarr; AES-256-GCM decrypt &rarr; Integrity validation &rarr; Import data.
    - **Defined Restore Mode (Import/Merge)**: For V1, use import/merge with deterministic duplicate handling, rather than silently replacing existing vault data. Existing data must never be deleted merely because a backup is restored.
    - **Deterministic Duplicate Collision Rules**:
      - If an identical `normalizedUrl` exists in both current vault and incoming backup:
      - **Enrichable Fields** (only updated if local field is currently `null`/empty and backup contains non-empty data):
        1. `description` (enriched if local is null/blank).
        2. `notes` (enriched if local is null/blank).
        3. `previewImagePath` (enriched if local has no preview or file is missing, unpacking backup asset to `previews/`).
        4. `faviconPath` (enriched if local is null).
        5. `title` (enriched ONLY if local title is currently the raw URL and backup has an extracted webpage title).
      - **Protected Fields** (NEVER overwritten by incoming duplicate):
        `id` (local primary key), `folderId` (user's current folder structure), `isFavorite` (local favorite state), `isTrash` / `trashedAt` (local trash state), and `createdAt` / `updatedAt` / `lastOpenedAt` (local access timestamps).
    - Incorrect passwords or corrupted backups fail safely without partially importing corrupted data.
    - Backward-compatible migration capability for future format versions.
  - **Secondary Export Formats**: Standard JSON and Netscape HTML Bookmarks.
- **Checkpoint 6 Verification:**
  - [ ] All 7 link actions function properly on real device.
  - [ ] 30-day trash worker deletes expired records (>30 days relative to current time) and safely coordinates preview file deletion.
  - [ ] Encrypted `.CLIPPR` backup created on one device restores cleanly on another device using the backup password, safely merging into populated vaults without data loss.

---

### Phase 7: Motion, Splash, Responsive Layouts & Performance
**Objective:** Deliver 60fps animations matching Figma specifications, 1-second splash sequence, adaptive layout support, and accessibility standards.

- **Task 7.1: Modern 1-Second Splash Animation**
  - Implement `AnimatedSplashScreen`:
    - 0–300ms: Alpha fade-in of Clippr monogram.
    - 300–700ms: Subtle spring scale (0.92 &rarr; 1.0) with subtle glow.
    - 700–1000ms: Settle and smooth crossfade to Home / Authentication.
- **Task 7.2: Fluid Compose Micro-Interactions**
  - Folder card open/close transitions using Compose Shared Element / animated bounds.
  - Bottom sheet sliding transitions with spring damping.
  - Favorite star toggle micro-bounce.
  - Card press scaling feedback mimicking tactile Android haptics (`LocalHapticFeedback`).
- **Task 7.3: Responsive & Adaptive Compose Layouts**
  - Support portrait and landscape orientations.
  - Adaptive grids for Folders and Link Cards: 1 column on compact phones, 2 columns on medium/large devices and tablets (`WindowWidthSizeClass`).
- **Checkpoint 7 Verification:**
  - [ ] Splash finishes in exactly ~1 second without jank.
  - [ ] App transitions smoothly across phone and tablet window sizes.

---

### Phase 8: Full QA, Security Audit & Production Release Build
**Objective:** Comprehensive testing, security verification, ProGuard/R8 optimization, and production-ready signed APK creation.

- **Task 8.1: Automated Unit & Instrumentation Test Suite**
  - Unit tests: URL parser (embedded text, LAN, PROCESS_TEXT), duplicate detector, crypto engine (PBKDF2-HMAC-SHA256 + AES-GCM), Room migrations, trash retention.
  - Android UI tests: Launch, biometric gate, create folder, save link, delete, search, backup/restore.
- **Task 8.2: Security & Hardening Audit**
  - Verify zero plaintext leaks of credentials or private notes.
  - Verify app-private directory permissions (`Context.MODE_PRIVATE`).
  - ProGuard/R8 rules: preserve Room, Kotlin serialization, and Compose runtime while stripping logs and minifying code.
- **Task 8.3: Release Build & Verification**
  - Build release bundle/APK with `gradlew assembleRelease`.
  - Verify APK installation and end-to-end user journey on physical Android device/emulator.
- **Checkpoint 8 Verification:**
  - [ ] `gradlew test` passes 100%.
  - [ ] `gradlew assembleRelease` outputs verified production APK.
  - [ ] Full end-to-end definition-of-done checklist verified on physical device.

---

## 5. Definition of Done Checklist

```text
[ ] Install Clippr APK on physical Android device
[ ] Open Clippr → 1-second animated splash displays smoothly
[ ] Setup BiometricPrompt using BIOMETRIC_STRONG with device credential fallback (no separate Clippr PIN)
[ ] Open Chrome / YouTube / X / messaging app → Share any webpage (including text containing URL)
[ ] Select Clippr in native Android Sharesheet
[ ] Clean URL extracted (surrounding text ignored)
[ ] Save Link bottom sheet displays preview, title, URL, folder picker
[ ] Tap "Save Link" → Link saved instantly in local database (even for LAN/localhost)
[ ] SafeNetwork validates metadata requests (blocks LAN/localhost for metadata, re-validates redirects)
[ ] Duplicate detection triggers if same normalized URL shared again (Cancel, Save Anyway, Open Existing)
[ ] Background worker extracts OpenGraph preview & favicon into persistent previews/ directory
[ ] Close app → Lock triggers on background
[ ] Reopen app → BiometricPrompt unlocks vault
[ ] Link appears in Home and Folder views
[ ] Actions: Open in browser, Copy URL, Re-share, Favorite, Edit, Move
[ ] Delete link → Moved to Trash with 30-day counter → Undo toast works
[ ] WorkManager automatically purges links >30 days old + cleans up preview files independently
[ ] Full-text search finds links offline instantly
[ ] Export password-protected .CLIPPR backup (PBKDF2-HMAC-SHA256 + AES-256-GCM) with version header
[ ] Restore .CLIPPR backup on second Android device using password cleanly
```
