# CLIPPR — VISUAL DESIGN SYSTEM & UI SPECIFICATION

**Document type:** Production UI/UX Design Specification  
**Product:** Clippr  
**Platform:** Native Android / Jetpack Compose  
**Reference viewport:** 412 × 915 px  
**Reference source:** Supplied Clippr UI reference images  
**Design modes:** Light + Dark where supplied  
**Design priority:** Pixel-accurate reproduction of the supplied references

---

# 1. NON-NEGOTIABLE DESIGN RULE

The supplied reference images are the visual source of truth.

The implementation MUST reproduce the reference UI rather than reinterpret it.

Do not:

- redesign any screen
- "improve" spacing
- substitute Material defaults
- substitute generic icons
- invent components
- change colors
- change typography
- change margins
- change navigation
- change interaction flows
- remove subtle borders/outlines
- add shadows that are not present
- remove shadows that are present
- replace the floating bottom navigation with a stock Material NavigationBar
- make light/dark themes by simply inverting colors

If a value is explicitly available from the Figma source, use the Figma value.

If a value can only be estimated from the reference image, preserve the reference geometry and centralize the value as a design token so it can be tuned globally.

---

# 2. REFERENCE DEVICE / CANVAS

All supplied screens are:

- Width: **412 px**
- Height: **915 px**
- Aspect ratio: **9:19.98**
- Reference Android status bar: approximately **24 px**
- Primary horizontal content margin: **24 px**
- Common content width: **364 px**
- Standard bottom navigation region: approximately **79 px** high
- Main screens use edge-to-edge content with Android system insets respected.

The implementation must be density-independent in Android, but the 412×915 screenshots are the primary visual comparison target.

### Coordinate rule

Do not blindly hard-code screenshot pixel coordinates.

Translate the reference into native Compose layout using:

- `WindowInsets`
- `Scaffold`
- `Box`
- `Row`
- `Column`
- `LazyColumn`
- `LazyVerticalGrid`
- `Arrangement`
- `Alignment`
- proper `Dp` values

The resulting rendered geometry must match the 412×915 reference.

---

# 3. DESIGN LANGUAGE

Clippr's visual language is:

- calm
- private
- editorial
- tactile
- minimal
- warm
- natural
- premium
- local-first
- quiet rather than flashy

The interface uses a muted green identity rather than saturated Material green.

Cards have restrained borders and soft surfaces.

Typography is dark, warm, and highly legible.

Images are prominent and editorial.

Motion is short, deliberate, and tactile.

---

# 4. COLOR SYSTEM

The supplied images reveal the following dominant base colors.

## 4.1 Dark theme

### Dark background

```text
#101613
RGB 16, 22, 19
```

Use for:

- main application background
- large empty areas
- lock screen background
- dark splash background where applicable

### Dark surface

```text
#19221E
RGB 25, 34, 30
```

Use for:

- cards
- inputs
- navigation surface
- grouped settings surfaces
- link containers

### Dark elevated/accent surface

```text
#263E33
RGB 38, 62, 51
```

Use for:

- selected/active surfaces
- quick-access selected cards
- notification/implementation-note cards
- highlighted containers

### Dark border

```text
#304038
RGB 48, 64, 56
```

Use for:

- card outlines
- input outlines
- navigation outlines
- subtle separators

### Dark primary accent

```text
#87B69D
RGB 135, 182, 157
```

Use for:

- primary buttons
- selected navigation state
- positive actions
- active controls
- accent text where appropriate

### Dark primary text

```text
#EDF3EF
RGB 237, 243, 239
```

Use for:

- headings
- primary text
- important labels

### Dark secondary text

Use the muted gray-green range visible in the reference. Prefer the exact Figma token when available. Do not substitute pure gray.

### Dark icon / inactive treatment

Use muted green-gray values from the reference rather than default Material gray.

---

# 4.2 Light theme

### Light page background

```text
#F7F8F5
RGB 247, 248, 245
```

Use for:

- Home
- Folders
- Search
- Settings
- Link detail
- Onboarding
- Trash
- splash

### Light surface

```text
#FFFFFF
RGB 255, 255, 255
```

Use for:

- cards
- inputs
- navigation
- dialogs
- white surfaces

### Light selected/elevated surface

```text
#DDECE3
RGB 221, 236, 227
```

Use for:

- selected cards
- selected quick-access item
- informational containers
- selected navigation backgrounds

### Light border

```text
#DDE4DE
RGB 221, 228, 222
```

Use for:

- card borders
- input borders
- navigation borders
- subtle separators

### Light primary accent

```text
#49745F
RGB 73, 116, 95
```

Use for:

- primary buttons
- selected navigation
- active controls
- green accent text

### Light primary text

```text
#18201D
RGB 24, 32, 29
```

Use for:

- headings
- primary labels
- important text

### Light secondary text

Use the muted gray-green text values shown in the reference. Exact Figma tokens override screenshot estimation.

---

# 4.3 Semantic colors

Use semantic tokens rather than hard-coded colors throughout the application.

```text
Primary
PrimaryContainer
OnPrimary
Background
Surface
SurfaceVariant
OnBackground
OnSurface
SecondaryText
Outline
Divider
Success
Warning
Error
Favorite
```

### Delete/error

Delete controls use a restrained red/pink treatment rather than saturated red.

In light mode the delete button is a pale red surface with red text/icon and a red outline.

In dark mode the delete area uses a dark red-tinted surface with red text/icon and red outline.

Do not use Material default error colors unless they match the reference.

---

# 5. TYPOGRAPHY

## 5.1 Font source of truth

The exact font family MUST be taken from the Figma design.

The supplied screenshots alone cannot prove the font file/name with certainty.

Do not silently substitute a system font.

If the Figma source specifies a font, install/use that exact font.

The visual appearance suggests a modern sans-serif family in the Inter/DM Sans class, but this is NOT a substitute for the exact Figma font.

---

## 5.2 Typography hierarchy

### Screen titles

Examples:

- Save link
- Favorites
- Folders
- Settings
- Search

Characteristics:

- bold/semi-bold
- large
- tight line height
- dark primary text
- approximately 28–30 px visual size

### Section headings

Examples:

- Quick access
- Folders
- Recently saved
- Privacy & Security
- Your Data
- Preferences

Characteristics:

- semi-bold/bold
- approximately 19–20 px
- strong contrast

### Card titles

Characteristics:

- semi-bold/bold
- approximately 15–17 px
- 1–2 lines
- tight line height

### Body

Characteristics:

- approximately 14–16 px
- comfortable line height
- muted secondary text where appropriate

### Labels / metadata

Examples:

- domain
- folder
- date
- "Saved today"
- "31 links"

Characteristics:

- approximately 11–13 px
- muted
- uppercase for domain/category labels where shown

### Button text

Characteristics:

- approximately 15–16 px
- medium/semi-bold
- centered

---

# 6. GLOBAL LAYOUT

## Horizontal margin

Primary page content:

```text
24 dp left
24 dp right
```

Use this as the default screen content margin.

## Card internal padding

Default card content padding:

```text
12–16 dp
```

Exact values must follow the corresponding reference component.

## Section spacing

Use approximately:

```text
24 dp
```

between major sections unless the reference clearly specifies another value.

## Small spacing

Use the reference-defined values for:

- icon → label
- label → metadata
- card → card
- section title → content

Do not normalize every value to an arbitrary 8 dp grid.

---

# 7. CORNER RADII

Clippr uses visibly rounded components.

Approximate reference system:

```text
Small controls:       10–12 dp
Inputs:               14–16 dp
Cards:                20–24 dp
Large hero cards:     28–32 dp
Floating navigation:  22–24 dp
Buttons:              22–28 dp / pill
Large containers:     28–32 dp
```

Exact Figma values override these reference estimates.

Never use one global radius for every component.

---

# 8. BORDERS / OUTLINES

The UI uses subtle one-pixel-style outlines.

Default reference:

```text
Width: approximately 1 dp
Dark:  #304038
Light: #DDE4DE
```

Borders must follow the component shape.

Do not add borders to elements that have none in the reference.

Do not remove borders from elements that have them.

---

# 9. SHADOWS

Shadows are soft and restrained.

Avoid:

- heavy Material elevation
- strong black drop shadows
- excessive blur
- floating-card effects where the reference is flat

Light theme cards use subtle ambient shadows where visible.

Dark theme primarily relies on surface contrast and outlines.

---

# 10. ICONOGRAPHY

Use the exact icons from Figma/reference assets.

Do not replace custom icons with generic Material icons unless they are visually identical.

Icon characteristics:

- thin/medium stroke
- rounded geometry
- muted green/gray
- consistent optical sizing
- consistent stroke weight

Common icons:

- Home
- Folder
- Heart
- Settings
- Search
- More
- Back
- Plus
- Link
- Copy
- Share
- Edit
- Move
- Delete
- Restore
- Lock
- Fingerprint
- Eye / hidden preview
- Backup
- Download
- Upload
- Chevron
- Grid
- List
- Palette
- Food
- Travel
- Work
- Inspiration

---

# 11. BOTTOM NAVIGATION

Used on:

- Home
- Folders
- Favorites
- Settings
- relevant primary vault screens

### Structure

Four destinations:

```text
Home
Folders
Favorites
Settings
```

### Visual behavior

Dark:

- dark surface
- subtle border
- selected destination uses green-toned filled pill/container
- selected icon/text uses accent treatment

Light:

- white surface
- subtle border/shadow
- selected destination uses pale green selected container
- selected icon/text uses green accent

### Geometry

Reference:

- horizontal margin approximately 16 dp
- floating above bottom system area
- rounded container
- approximately 78–80 dp total height
- four equal navigation regions

### Critical rule

The navigation MUST NOT produce:

- gaps between icon and selected background
- gaps between navigation sections
- uneven item widths
- clipping
- overlap with gesture/navigation bars

Use a single reusable component.

---

# 12. PRIMARY BUTTON

Reference button characteristics:

- full available content width
- approximately 52–54 dp height
- pill/large rounded corners
- centered icon + label
- green accent
- white/light text
- subtle press feedback

Dark primary:

```text
#87B69D
```

Light primary:

```text
#49745F
```

Buttons must not use default Material button padding/radius if it differs from the reference.

---

# 13. TEXT FIELD / INPUT

Reference:

- full content width
- rounded rectangle
- subtle border
- transparent/white/dark surface depending on theme
- 14–16 dp internal padding
- leading icon when shown
- clear readable text
- multiline wrapping where shown

Input height is approximately:

```text
52–66 dp
```

depending on content.

Do not use default TextField styling without overriding it to match the design.

---

# 14. HOME SCREEN

## Dark / Light

Header:

```text
Clippr logo
Clippr
LOCAL pill
```

Search:

```text
Search your links...
```

Quick access:

```text
Inbox
Favorites
```

Folders:

Three compact folder cards:

```text
Design
Recipes
Travel
```

Recently saved:

Large horizontal cards with:

- preview image
- domain
- title
- folder/date metadata
- favorite heart

Bottom navigation:

```text
Home
Folders
Favorites
Settings
```

### Layout

Primary horizontal margin:

```text
24 dp
```

Major vertical hierarchy:

```text
Header
↓
Search
↓
Quick access
↓
Folders
↓
Recently saved
↓
Bottom navigation
```

Do not compress these sections simply to fit more content.

---

# 15. FOLDERS SCREEN

Header:

```text
Folders
+
```

Search:

```text
Search folders
```

Metadata:

```text
7 folders · 161 links
```

View toggle:

```text
Grid
List
```

Folder grid:

Two-column layout.

Folders shown:

- Design
- Recipes
- Travel
- Read later
- Work
- Inspiration

Each card contains:

- icon container
- folder name
- link count

Inbox appears below the grid as a wide card.

Bottom navigation remains fixed.

---

# 16. FOLDER DETAIL — DESIGN

Header:

```text
Back
Design
More
```

Folder header:

- large icon container
- Design
- link count
- updated time
- plus button

Filter chips:

```text
All links
Unread · 8
```

Sort:

```text
Newest
```

Link cards:

- thumbnail
- domain
- title
- metadata

Bottom navigation remains fixed.

### Folder transition

When opening a folder:

- selected folder card expands into the folder header
- duration: **260 ms**
- list content begins fading/appearing approximately **30 ms later**
- preserve spatial continuity

---

# 17. FAVORITES SCREEN

Header:

```text
Favorites
Search
```

Subtitle:

```text
24 links you love
```

Filter:

```text
All folders
```

List cards contain:

- thumbnail
- domain
- title
- folder/date
- heart icon

Cards use approximately 20–24 dp corner radius.

### Favorite animation

On favorite:

```text
Heart draws/fills
Duration: 140 ms
Soft haptic
```

On removal:

```text
Wait approximately 220 ms
Then reflow list
```

Do not immediately snap the entire list.

---

# 18. SEARCH SCREEN

Header:

```text
Back
Search
```

Search input:

```text
design systems
Clear
```

Filter chips:

```text
All 12
Design 8
Work 3
Favorites 4
```

Result metadata:

```text
12 results
Most relevant
```

Result cards contain:

- thumbnail
- domain
- title
- folder/date
- favorite where applicable

### Search animation

Results:

```text
Crossfade: approximately 120 ms
```

Query highlighting must settle without shifting the layout.

Clear:

```text
Reverse immediately
```

---

# 19. LINK DETAIL SCREEN

Header:

```text
Back
Link
More
```

Hero:

- large preview image
- category/domain badge
- favorite button
- dark translucent text overlay

Title:

Large, prominent, multi-line.

Metadata:

```text
By Mara Ellis · 8 min read
```

Folder chip:

```text
Design
```

Saved metadata appears opposite it.

Description below.

Primary action:

```text
Open link
```

Action grid:

```text
Copy
Share
Edit
Move
Favorite
Delete
```

Delete uses semantic error styling.

---

# 20. SAVE LINK SCREEN / SHARE FLOW

This screen is launched by the Android Sharesheet.

Header:

```text
Save link
Cancel
```

Source row:

```text
Chrome icon
Shared from Chrome · preview ready
```

Hero preview:

- image
- title-detected badge
- domain/category
- title
- dark translucent overlay

Fields:

```text
Link name
URL
Folder
```

Folder selector:

```text
Design
Chevron
```

Additional actions:

```text
+ New Folder
Add to favorites
```

Status:

```text
Saved on device
```

Primary action:

```text
Save Link
```

Bottom implementation/status note is a design-development annotation and must not become accidental production UI unless explicitly required by the final product design.

### Save animation

Reference note:

```text
Check morph: 180 ms
Light haptic
Sheet collapses into selected folder
```

The animation should feel immediate and tactile.

---

# 21. EDIT LINK SCREEN

Header:

```text
Back
Edit link
Done
```

Top preview/editor card:

- image
- domain
- title
- Change preview

Fields:

```text
Link name
URL
Folder
Notes
```

Favorite:

Toggle row.

Primary:

```text
Save changes
```

Secondary destructive action:

```text
Delete link
```

Delete uses red semantic styling.

---

# 22. BACKUP & RESTORE

Header:

```text
Back
Backup & restore
```

Hero card:

```text
Portable, encrypted, yours.
Export one encrypted file to storage you choose.
Clippr never uploads it.
```

Status card:

```text
Backup is up to date
Sep 24, 2026 · 161 links · 48.2 MB
```

Primary:

```text
Create backup
```

Secondary:

```text
Restore from file
```

Options:

```text
Include preview images
Encryption
```

Recent backups list.

### Motion

Bottom sheets:

```text
220 ms emphasized easing
```

Restore:

- progress remains determinate
- success settles with one soft haptic

---

# 23. SETTINGS

Header:

```text
Settings
```

Vault status card:

```text
Private vault
161 links · stored only on this device
```

Sections:

## PRIVACY & SECURITY

```text
App lock
Hide previews in recents
```

## YOUR DATA

```text
Backup & restore
Trash
```

## PREFERENCES

```text
Appearance
Default folder
Link layout
```

Footer:

```text
Clippr 1.0.0
Built for your pocket, not the cloud.
```

Bottom navigation remains visible.

Light and dark layouts must match their supplied references independently.

---

# 24. BIOMETRIC LOCK

Dark reference.

Header/logo:

```text
Clippr
```

Central fingerprint area:

- rounded square
- subtle green glow
- fingerprint line icon

Main title:

```text
Unlock your vault
```

Description:

```text
Your links stay on this device.
Confirm it’s you to open Clippr.
```

Security reassurance pill:

```text
Biometrics never leave Android
```

Primary:

```text
Use fingerprint
```

Secondary:

```text
Use device PIN instead
```

### Motion

Fingerprint interaction:

```text
Ripple: approximately 180 ms
Successful authentication:
check morph
then vault reveal: approximately 260 ms
```

---

# 25. ONBOARDING

Reference contains:

- Clippr logo
- editorial illustration/card composition
- "FROM ANYWHERE, IN A TAP"
- large headline
- supporting paragraph
- primary CTA
- page indicator

Headline:

```text
Keep the internet you
care about.
```

Supporting copy:

```text
Use Android Share to save articles, recipes, videos,
and ideas. No account. No cloud by default.
```

Primary CTA:

```text
Set up my vault
```

Visual hierarchy is intentionally spacious.

Do not compress the hero area.

---

# 26. SPLASH SCREEN

Supplied states:

- fade
- subtle scale
- settle

Elements:

- Clippr icon
- Clippr wordmark
- tagline
- progress indicators at bottom

Background:

Light reference uses:

```text
#F7F8F5
```

Logo container uses the Clippr green family.

Tagline:

```text
Yours. Local. Always.
```

### Animation sequence

```text
1. Fade in
2. Subtle scale
3. Settle
4. Progress indicators advance
5. Transition into next screen
```

Animation must be subtle, premium, and short.

Do not use a generic Android splash animation.

---

# 27. TRASH

Header:

```text
Back
Trash
Empty
```

Information banner:

```text
Deleted links stay here for 30 days.
Restore anything with one tap.
```

Metadata:

```text
4 deleted links
Recently deleted
```

Each card:

- thumbnail
- domain
- title
- countdown
- restore action
- permanent delete action

Bottom:

```text
Empty trash
```

### Motion

Delete:

```text
Slide into Trash: approximately 180 ms
```

Restore:

- return to previous folder
- briefly highlight destination

---

# 28. NAVIGATION MAP

Primary navigation:

```text
                 ┌─────────────┐
                 │    Home     │
                 └──────┬──────┘
                        │
       ┌────────────────┼────────────────┐
       ↓                ↓                ↓
    Folders          Favorites        Settings
       │
       ↓
 Folder Detail
       │
       ↓
   Link Detail
       │
       ↓
    Edit Link
```

Additional flows:

```text
Android Share
      ↓
Save Link
      ↓
Select Folder
      ↓
Save
      ↓
Home / Selected Folder
```

```text
Settings
   ↓
Backup & Restore
```

```text
Settings
   ↓
Trash
```

```text
App launch
   ↓
Splash
   ↓
Onboarding (first launch)
   ↓
Biometric lock
   ↓
Home
```

---

# 29. BACK NAVIGATION

Use standard Android back behavior while preserving the designed hierarchy.

Examples:

```text
Link Detail → previous screen
Edit Link → Link Detail
Folder Detail → Folders
Backup & Restore → Settings
Trash → Settings
Search → previous/root context
Save Link → invoking application/share flow
```

Do not unexpectedly return to Home when a closer parent screen exists.

---

# 30. ANDROID SHARESHEET FLOW

Supported entry:

```text
Any Android App
       ↓
Share
       ↓
Clippr
       ↓
Save Link
```

Accepted URL sources include:

- `ACTION_SEND`
- `ACTION_PROCESS_TEXT`
- `text/plain`
- `text/uri-list`
- `Intent.EXTRA_TEXT`
- `Intent.EXTRA_TITLE`

The visual Save Link screen must match the supplied dark/light references.

---

# 31. COMPONENT STATES

Every reusable component must define:

```text
Default
Pressed
Focused
Selected
Disabled
Loading
Error
Empty
Success
```

Only implement states that are visible or required by the product, but when a state is shown in Figma it must match Figma exactly.

---

# 32. DESIGN ANIMATION PRINCIPLES

Clippr motion is:

- short
- soft
- tactile
- purposeful
- never bouncy unless explicitly designed
- never excessive

Use the reference-specific timings where supplied.

Known timings:

```text
Favorite:                 140 ms
Save check morph:         180 ms
Trash delete:             180 ms
Fingerprint ripple:       180 ms
Search results:           120 ms
Folder expansion:         260 ms
Vault reveal:             260 ms
Bottom sheet:             220 ms
```

Where an animation duration is not specified by the reference/Figma source, use a restrained motion token and do not invent elaborate animations.

---

# 33. HAPTICS

Use subtle haptic feedback only where the design calls for it.

Known reference behaviors:

- Save: light haptic
- Favorite: soft haptic
- Successful biometric authentication: soft confirmation
- Restore: soft haptic

Do not add haptic feedback to every button.

---

# 34. ACCESSIBILITY

Accessibility must preserve the visual design.

Provide:

- content descriptions for meaningful icons
- minimum usable touch targets
- semantic labels
- readable contrast
- proper focus behavior
- screen-reader labels

Do not visually enlarge controls solely to satisfy accessibility if the design already provides adequate touch area through the parent container.

---

# 35. RESPONSIVE RULES

The 412×915 screenshots are the visual reference.

For other Android sizes:

- preserve hierarchy
- preserve spacing relationships
- preserve component proportions
- allow text to wrap naturally
- never overlap system UI
- keep bottom navigation stable
- keep cards usable

Do not distort images.

Do not stretch logos/icons.

Do not arbitrarily change the design at other sizes.

---

# 36. DESIGN TOKEN ARCHITECTURE

Create centralized tokens:

```text
ClipprColors
ClipprTypography
ClipprSpacing
ClipprRadii
ClipprDimensions
ClipprElevation
ClipprMotion
ClipprIcons
```

No screen should contain duplicated design constants that belong in the design system.

---

# 37. IMPLEMENTATION VERIFICATION

Every screen must be compared against its reference screenshot.

Verify:

### Geometry

- exact width
- exact height
- alignment
- margins
- padding
- gaps

### Typography

- font
- weight
- size
- line height
- letter spacing
- wrapping

### Visual

- colors
- borders
- outlines
- radius
- shadows
- opacity

### Assets

- correct image
- correct icon
- correct crop
- correct scale

### System UI

- status bar
- navigation/gesture area
- edge-to-edge
- safe areas

### Motion

- duration
- easing
- sequence
- haptic

---

# 38. FINAL ACCEPTANCE CRITERIA

The UI is complete only when:

- Every supplied screen has been implemented.
- Light references match.
- Dark references match.
- Typography matches the Figma/source specification.
- Colors match the reference/Figma tokens.
- Margins match.
- Padding matches.
- Card geometry matches.
- Borders match.
- Outlines match.
- Icons match.
- Images match.
- Bottom navigation matches.
- Navigation flow matches.
- Animations match the specified timings.
- Haptics match the specified interactions.
- No generic Material component visibly replaces a custom Figma component.
- No placeholder asset remains.
- No screen contains invented UI.
- Shared components are truly shared.
- A shared-component correction propagates to all screens.
- The implementation has been rendered and visually compared at 412×915.
- All visible discrepancies that can be corrected have been corrected.

---

# 39. FINAL DESIGN PRINCIPLE

**Clippr should look as though the supplied Figma design was directly turned into a real native Android application.**

Do not make the Figma design conform to Android.

Make the Android implementation conform to the Figma design.

**Design source → exact tokens → exact components → exact screens → exact flows → verified Android rendering.**
