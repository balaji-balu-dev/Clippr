# Clippr — Native Android Production Task Checklist

## Phase 1: Native Android Project & Compose Design System
- [x] **Task 1.1**: Initialize Gradle project with Kotlin DSL (`build.gradle.kts`), configure compile/target SDK 34/36, Jetpack Compose Material 3 BOM, Room, Biometric, Coil, WorkManager, and Navigation Compose.
- [x] **Task 1.2**: Implement Material 3 Theme (`Color.kt`, `Type.kt`, `Shape.kt`, `Theme.kt`) with exact tokens from Figma: Dark OLED (`#101613`, `#19221E`, `#263E33`, `#87B69D`) & Light Emerald (`#F8FAF9`, `#FFFFFF`, `#EDF4F0`, `#26573F`), `DM Sans` + `Inter` typography, and convert 58 SVG icons to Vector Drawables.
- [x] **Task 1.3**: Build centralized reusable shared components (`ClipprIcon`, `ClipprCard`, `ClipprButton`, `ClipprSearchBar`, `ClipprPill`, `ClipprBottomNavBar`, `ClipprTopBar`, `ClipprToast`, `ClipprDialog`) so token and theme updates propagate universally without ad-hoc duplicates.
- [x] **Checkpoint 1**: Verify `gradlew assembleDebug` and `gradlew assembleRelease` compile cleanly; theme preview renders accurately in dark and light modes.

## Phase 2: Room Database, Migrations & Persistent Preview Storage
- [x] **Task 2.1**: Define Room database schema: `LinkEntity` (with `normalizedUrl`), `FolderEntity`, and `LinkFtsEntity` (Room SQLite full-text search table). Implement `LinkDao` and `FolderDao` with Flow queries.
- [x] **Task 2.2**: Implement `PreviewStorageManager`: store permanent preview images in persistent app-private `previews/` directory (not cache); delete associated image file when a link is permanently deleted.
- [x] **Task 2.3**: Implement explicit Room versioning and migration framework (no destructive fallback in production) + persistence unit tests with `MigrationTestHelper`.
- [x] **Checkpoint 2**: Verify Room unit tests and migration tests pass cleanly via `gradlew testDebugUnitTest`.

## Phase 3: Android Security, Keystore & Biometric Authentication
- [x] **Task 3.1**: Implement `KeystoreManager` for local keys: hardware-backed protection where supported, with secure software-backed fallback on devices lacking hardware Keystore.
- [x] **Task 3.2**: Implement `BiometricHelper` utilizing `BiometricPrompt` configured with `BIOMETRIC_STRONG` and Android device-credential fallback (PIN, Pattern, Password). Use device's available biometric capabilities without assuming hardware-backed biometric authentication on every device. Do not create or store separate Clippr PINs, patterns, or biometric data.
- [x] **Task 3.3**: Implement `VaultLockManager` for lifecycle-aware auto-locking, background timeouts, and window `FLAG_SECURE` protection for recent apps switcher.
- [x] **Checkpoint 3**: Verify Keystore encryption roundtrip on both hardware and software fallback, and BiometricPrompt flow with device credential fallback.

## Phase 4: Core Browsing Screens (Home, Folders, Favorites, Search)
- [x] **Task 4.1**: Build edge-to-edge system bar integration and custom Material 3 `BottomNavBar` with active pill indicators and badge counts using shared UI components.
- [x] **Task 4.2**: Implement `HomeScreen` matching Figma: search bar, quick access chips (Inbox, Favorites), Folders carousel, and rich `LinkCard` feed with actions.
- [x] **Task 4.3**: Implement `FoldersScreen` (grid/list toggle), `NewFolderDialog` (color & icon picker), and `FolderDetailScreen` (sorting & tag filters).
- [x] **Task 4.4**: Implement `FavoritesScreen` (pinned links) and real-time offline `SearchScreen` powered by Room SQLite full-text search.
- [x] **Checkpoint 4**: Verify complete local browsing workflow and tab navigation across all 4 main screens.

## Phase 5: Android Sharesheet Integration, SafeNetwork & Physical Device Verification
- [x] **Task 5.1**: Register `ShareSaveActivity` with `ACTION_SEND` (handling `text/plain` & `text/uri-list`) and `ACTION_PROCESS_TEXT` intent filters.
- [x] **Task 5.2**: Implement `ShareIntentParser`: extract valid HTTP/HTTPS URLs from surrounding copy (e.g. `Check this out: https://example.com/article`), handle `ACTION_PROCESS_TEXT` (reject non-URL text without creating a record), allow all LAN/localhost URLs on save, and deterministic duplicate detection via `normalizedUrl` (warn: Cancel, Save Anyway, Open Existing).
- [x] **Task 5.3**: Build `SaveLinkScreen` bottom sheet: instant local database write to selected folder, editable title, URL preview, and "+ New Folder" modal.
- [x] **Task 5.4**: Implement background metadata engine with `WorkManager`, `OkHttp`, and `SafeNetwork`: resolve and validate destination before connection, revalidate every redirect, and prevent DNS rebinding or resolution changes from bypassing private/internal-network protections (ensuring the final connection strictly uses the validated destination); block localhost/private/LAN destinations for metadata fetching; enforce timeouts & 2MB response caps; parse only needed metadata without executing JavaScript/HTML. Store permanent previews in persistent `previews/`.
- [ ] **Task 5.5**: Mandatory Physical Device Testing: verify Chrome, YouTube, X/Twitter, messaging apps, plain text with URLs, query parameters, LAN URLs (`http://localhost:3000`, `http://192.168.1.100:3000`), `ACTION_PROCESS_TEXT`, and complete end-to-end journey on a physical Android device.
- [ ] **Checkpoint 5**: Physical Android device verification: test Chrome, YouTube/X, a messaging app, and plain-text sharing using `ACTION_SEND` and `ACTION_PROCESS_TEXT`; verify `text/plain`, `text/uri-list`, embedded URLs, localhost/LAN URLs, and text containing no URL.

## Phase 6: Link Actions, 30-Day Trash Purge & Portable Encrypted Backup
- [x] **Task 6.1**: Implement link action suite: Open in external browser / Custom Tab, Copy URL, Re-share via Android Sharesheet, Edit Link sheet, Move Link dialog, Favorite toggle, and Delete with undo toast.
- [x] **Task 6.2**: Implement `TrashScreen` and `TrashPurgeWorker` (WorkManager periodic job running independently of app launches) to permanently delete links whose `deletedAt` timestamp is older than 30 days relative to the current time. Safely coordinate preview file deletion only after database deletion to prevent orphaned files.
- [x] **Task 6.3**: Implement Portable Encrypted `.CLIPPR` Backup & Restore:
  - User backup password &rarr; **PBKDF2-HMAC-SHA256** &rarr; Derived 256-bit key &rarr; **AES-256-GCM**
  - **PBKDF2 Iteration Count Selection & Benchmarking**:
    - Baseline default of **210,000 iterations** (OWASP/NIST recommendation for PBKDF2-HMAC-SHA256).
    - Benchmarked to target **~250ms–500ms** derivation duration on mid-range Android devices on `Dispatchers.Default` (avoids UI freeze/ANR while maximizing brute-force cost).
    - Header stores exact `iterationCount` alongside salt, KDF ID, and AES-GCM nonce for deterministic cross-device restore.
  - Never store password; restorable on Device B with password; fail safely on bad password/corruption without partial import.
  - **Defined Restore Mode (Import/Merge with Collision Rules)**:
    - Existing vault data is never deleted on restore.
    - When `normalizedUrl` matches an existing link:
      - **Enrichable Fields** (only enriched if local field is `null`/empty and backup contains data): `description`, `notes`, `previewImagePath` (unpacks asset to `previews/`), `faviconPath`, and `title` (only if local title is currently the raw URL).
      - **Protected Fields** (NEVER overwritten): `id`, `folderId`, `isFavorite`, `isTrash`, `trashedAt`, `createdAt`, `updatedAt`, `lastOpenedAt`.
  - Secondary formats: JSON and HTML Bookmarks
- [x] **Checkpoint 6**: Verify all link lifecycle actions, independent 30-day trash worker cleanup of files and records, and cross-device portable encrypted backup/restore cycle merging safely into populated vaults.

## Phase 7: Motion, Splash, Responsive Layouts & Performance
- [x] **Task 7.1**: Implement 1-second animated splash screen (monogram fade &rarr; subtle spring scale &rarr; settle &rarr; crossfade to Home / Auth).
- [x] **Task 7.2**: Implement fluid Compose animations: folder shared transitions, bottom sheet springs, favorite star micro-bounce, and tactile haptic visual feedback.
- [x] **Task 7.3**: Implement adaptive layouts supporting portrait, landscape, small phones, and tablets (`WindowWidthSizeClass`).
- [x] **Checkpoint 7**: Verify 60fps animations, 1s splash timing, and tablet responsiveness.

## Phase 8: Full QA, Security Audit & Production Release Build
- [x] **Task 8.1**: Build automated unit and instrumentation test suite covering URL extraction (embedded text, LAN, PROCESS_TEXT), Room migrations, portable backup crypto (PBKDF2-HMAC-SHA256 + AES-GCM), and user journeys.
- [x] **Task 8.2**: Perform security audit (private app directories, ProGuard/R8 minification rules, sensitive data zero-leak verification).
- [x] **Task 8.3**: Generate production-ready signed APK (`assembleRelease`) and verify against the complete Definition of Done on a physical device.
- [ ] **Checkpoint 8**: Final production APK built and validated on physical Android device.
