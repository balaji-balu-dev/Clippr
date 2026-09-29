<p align="center">
  <img src="docs/images/feature_graphic.png" alt="Clippr Feature Graphic" width="100%" />
</p>

<p align="center">
  <img src="docs/images/app_icon.png" alt="Clippr App Icon" width="96" height="96" style="border-radius: 22px;" />
</p>

<h1 align="center">Clippr — Smart Link Vault</h1>

<p align="center">
  <strong>Your Private, 100% Offline & Biometrically Secured Bookmark Vault for Android</strong>
</p>

<p align="center">
  <a href="https://android.com"><img src="https://img.shields.io/badge/Platform-Android%20(API%2026%2B)-3DDC84?logo=android&logoColor=white" alt="Platform" /></a>
  <a href="https://kotlinlang.org"><img src="https://img.shields.io/badge/Kotlin-2.0.0-7F52FF?logo=kotlin&logoColor=white" alt="Kotlin" /></a>
  <a href="https://developer.android.com/jetpack/compose"><img src="https://img.shields.io/badge/Jetpack%20Compose-Material%203-4285F4?logo=jetpackcompose&logoColor=white" alt="Jetpack Compose" /></a>
  <a href="https://clipprvault.web.app"><img src="https://img.shields.io/badge/Privacy-100%25%20Local--First-00E5FF" alt="Local-First" /></a>
  <a href="https://clipprvault.web.app"><img src="https://img.shields.io/badge/Hosted%20Policy-Live-10B981" alt="Privacy Policy" /></a>
  <img src="https://img.shields.io/badge/Security-AES--256--GCM-7C4DFF" alt="Security" />
</p>

---

## 📖 Overview

**Clippr** (`com.clipprvault.app`) is a privacy-first, local-first link vault and bookmark manager for Android. Built entirely with Kotlin, Jetpack Compose, and Material 3, Clippr provides a fast and secure repository for links captured directly from the native Android Sharesheet (`ACTION_SEND` and `ACTION_PROCESS_TEXT`).

Unlike traditional bookmarking tools, **Clippr operates 100% on-device**:
- **Zero Cloud Accounts:** No sign-up, email, or passwords required.
- **Zero Telemetry or Ads:** No analytics, trackers, or commercial SDKs.
- **Hardware-Backed Encryption:** Your vault backups are sealed using AES-256-GCM via the Android Keystore.

---

## 📸 Snapshots & Interface

<div align="center">

| Home & Vault Feed | Folders & Collections | Link Reader & Preview |
|:---:|:---:|:---:|
| <img src="docs/images/screen_home.png" width="260" /> | <img src="docs/images/screen_folders.png" width="260" /> | <img src="docs/images/screen_link_detail.png" width="260" /> |

| Instant Native Sharesheet | Biometric App Lock | Encrypted Backup & Restore |
|:---:|:---:|:---:|
| <img src="docs/images/screen_share_save.png" width="260" /> | <img src="docs/images/screen_biometric_lock.png" width="260" /> | <img src="docs/images/screen_backup_restore.png" width="260" /> |

</div>

---

## ✨ Key Features

- **⚡ Instant Sharesheet Integration:** Share links from Chrome, Twitter/X, Reddit, or YouTube directly to Clippr without interrupting your browsing flow.
- **🔒 Biometric Security (AppLock):** Protect your vault with fingerprint, face unlock, or device PIN using Android's hardware `BiometricPrompt`.
- **🏷️ Flexible Organization:** Organize links with custom folders, folder colors, icons, smart tags, favorites, and full-text search.
- **📑 Offline Metadata Caching:** Automatically extracts OpenGraph title, description, and preview imagery for offline viewing.
- **📦 Encrypted Vault Backup (.clippr):** Export and restore your complete vault with password-protected AES-256-GCM encryption.
- **🎨 Modern Dark & Light Aesthetics:** Clean glassmorphism, fluid micro-animations, and dynamic theme switching.

---

## 🛠️ Technology Stack & Architecture

- **UI Framework:** [Jetpack Compose](https://developer.android.com/jetpack/compose) with Material 3 Design System
- **Local Persistence:** [Room Database](https://developer.android.com/training/data-storage/room) (SQLite) with KSP
- **Security:** Android Keystore Provider, `androidx.biometric:biometric`, AES-256-GCM
- **Networking & Metadata:** OkHttp, Jsoup (HTML/OpenGraph parser), Coil (Image loading)
- **Architecture:** Clean Architecture + MVI/MVVM pattern with Kotlin Coroutines & StateFlow

---

## 🚀 Building & Running

### Prerequisites
- Android Studio Ladybug / Meerkat or later
- JDK 17
- Android SDK 36 (Android 16) / minSdk 26

### Debug Build
```bash
./gradlew assembleDebug
```

### Production Release Bundle (AAB)
```bash
./gradlew bundleRelease
```
The signed `.aab` file will be generated at:
`app/build/outputs/bundle/release/app-release.aab`

---

## 🔒 Privacy & Compliance

Clippr is built strictly around zero-knowledge principles. For full details, review our published Privacy Policy:
- **Hosted Privacy Policy:** [https://clipprvault.web.app](https://clipprvault.web.app)
- **Direct Privacy Path:** [https://clipprvault.web.app/privacy](https://clipprvault.web.app/privacy)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
