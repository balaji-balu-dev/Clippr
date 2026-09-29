# Clippr — Official Design System & UI Specification

Extracted from Figma File: **`Clippr`** (`YJoh8ibOWNYcqcINyvdUKs`)  
Target Device: **Android Flagship (412 x 915 dp)**  
Design Paradigm: **Privacy-First Local Link Vault with Organic Forest OLED Dark & Crisp Emerald Light Themes**

---

## 1. Design Token Architecture

### 1.1 Color Palettes

#### Dark Theme (Primary OLED Aesthetic)
- **Background Root**: `#101613` (Deep OLED Moss Black)
- **Surface / Card Level 1**: `#19221E` (Subtle Forest Surface)
- **Surface / Card Level 2**: `#263E33` (Elevated Emerald Card)
- **Surface Muted**: `#304038` (Secondary Containers / Pill Backgrounds)
- **Card Border / Stroke**: `#33BB5C` at 30–50% opacity or `#304038`
- **Accent Primary**: `#87B69D` (Sage Mint)
- **Accent Deep**: `#315846` (Forest Green)
- **Accent Brand**: `#263E33`
- **Text Primary**: `#EDF3EF` (Crisp Off-White)
- **Text Secondary**: `#AAB6AF` (Soft Sage Gray)
- **Text Muted**: `#68776F`
- **Status / Success**: `#87B69D`
- **Status / Warning / Badge**: `#E7EFEA`
- **Danger / Destructive**: `#FF5C5C`
- **Pure White**: `#FFFFFF`

#### Light Theme (Secondary Ambient Aesthetic)
- **Background Root**: `#F8FAF9` (Crisp Soft Alabaster)
- **Surface Level 1**: `#FFFFFF` (Clean Card Base)
- **Surface Level 2**: `#EDF4F0` (Soft Mint Container)
- **Border / Divider**: `#E2EBE5`
- **Accent Primary**: `#26573F` (Deep Emerald)
- **Text Primary**: `#16211B` (Dark Obsidian Forest)
- **Text Secondary**: `#607268` (Muted Leaf Slate)
- **Text Muted**: `#8D9F95`

---

### 1.2 Typography System

- **Display & Headings**: `DM Sans` (Weights: Bold 700, Regular 400)
  - Splash & Hero Branding: 24–32px Bold
  - Screen Titles / Top Bar: 20px Bold / Regular
  - Card Titles / Modal Headers: 18–20px Bold
- **UI Elements, Badges & Body**: `Inter` (Weights: Bold 700, Medium 500, Regular 400)
  - Primary Body / Action Labels: 14–15px (Bold / Medium)
  - Secondary Body / Inputs: 13px Regular
  - Caption / Metadata / Timestamp: 11–12px Regular
  - Tags / Micro-badges / Category Chips: 10px Bold

---

### 1.3 Radii & Elevation Tokens

- **Hero & Large Containers**: `30px`
- **Standard Cards & Modals**: `24px`
- **Inner Vault Containers**: `18px`
- **Action Buttons & Chips**: `24px` (Pill style) or `16px`
- **Action Icons & Thumbnails**: `12px` – `15px`

---

## 2. Screen Inventory & Flow Architecture

All 19 high-resolution screens have been fetched from Figma and saved into [`design/screens/`](file:///c:/Users/balaj/Antigravity%20Projects/Clippr/design/screens).

| Screen Name | File Reference | Primary Highlights & Components |
|:---|:---|:---|
| **Splash · Subtle Scale** | `Splash · subtle scale.png` | Opening state with Clippr vault monogram scaling into place. |
| **Splash · Settle** | `Splash · settle.png` | Centered logo settling onto background with brand glow. |
| **Splash · Fade** | `Splash · fade.png` | Smooth fade transition into app entry. |
| **Onboarding** | `Onboarding.png` | Value proposition: offline, encrypted, zero tracking, self-hosted backup. |
| **Biometric Lock · Dark** | `Biometric lock · dark.png` | Security gate with fingerprint scanner prompt, PIN fallback, instant unlock. |
| **Home · Dark** | `Home · dark.png` | Main vault dashboard: quick search bar, category chips, link cards with rich previews, floating quick-add button, bottom navigation. |
| **Home · Light** | `Home · light.png` | Light mode variant of the core dashboard with clean white cards. |
| **Folders** | `Folders.png` | Folder grid & list views (Design, Tech, Reads, Cooking, Finance) with badge counters. |
| **Folder Detail · Design** | `Folder detail · Design.png` | Granular view inside a selected folder with filtered tags and sorting. |
| **Favorites · Dark** | `Favorites · dark.png` | Pinned links and bookmarks with quick copy and share actions. |
| **Search** | `Search.png` | Fast client-side fuzzy search, recent queries, search filter pills. |
| **Link Detail** | `Link detail.png` | Full reader view/metadata sheet: full title, OG image, domain, summary, notes, tags, and open in browser. |
| **Edit Link · Dark** | `Edit link · dark.png` | Link metadata editor: change title, assign folders, add custom tags, notes. |
| **Trash** | `Trash.png` | Soft-deleted links with 30-day auto-purge countdown, restore and permanent delete actions. |
| **Android Share Sheet · Dark** | `Android Share Sheet · Save Link · dark.png` | Native Android share intent bottom sheet to intercept links from any browser or app. |
| **Android Share Sheet · Light** | `Android Share Sheet · Save Link · light.png` | Light mode native Android intent sheet. |
| **Backup & Restore · Dark** | `Backup & restore · dark.png` | Full offline `.CLIPPR` backup generator, encrypted local export, restore from file. |
| **Settings · Dark** | `Settings · dark.png` | Vault stats (161 links), Biometric App Lock toggles, theme switcher, privacy options. |
| **Settings · Light** | `Settings · light.png` | Light mode variant of settings interface. |

---

## 3. Extracted Icon Assets (58 Production SVGs)

Located in [`design/icons/`](file:///c:/Users/balaj/Antigravity%20Projects/Clippr/design/icons):

- **Navigation & Core**: `house.svg`, `folder.svg`, `heart.svg`, `settings.svg`, `search.svg`, `plus.svg`
- **Actions & Tools**: `share-2.svg`, `copy.svg`, `pencil.svg`, `external-link.svg`, `trash-2.svg`, `archive.svg`, `file-up.svg`, `file-archive.svg`, `rotate-ccw.svg`
- **Status & System**: `signal.svg`, `wifi.svg`, `battery-full.svg`, `check.svg`, `check-circle-2.svg`, `shield-check.svg`, `fingerprint.svg`, `lock-keyhole.svg`, `lock.svg`, `eye-off.svg`, `moon-star.svg`
- **Controls & Arrows**: `arrow-left.svg`, `arrow-right.svg`, `arrow-down-up.svg`, `chevron-right.svg`, `chevron-down.svg`, `sliders-horizontal.svg`, `toggle-right.svg`, `more-horizontal.svg`, `ellipsis-vertical.svg`, `x.svg`, `x-circle.svg`
- **Categories & Content**: `chrome.svg`, `youtube.svg`, `message-circle.svg`, `sparkles.svg`, `folder-lock.svg`, `folder-heart.svg`, `folder-plus.svg`, `folder-input.svg`, `layout-grid.svg`, `grid-2x2.svg`, `list.svg`, `palette.svg`, `utensils.svg`, `plane.svg`, `book-open.svg`, `briefcase.svg`, `inbox.svg`, `clock-3.svg`, `image.svg`, `link.svg`, `link-2.svg`
