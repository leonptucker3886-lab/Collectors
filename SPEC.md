# CollectVault - Collector Portfolio Manager

## Project Overview

**Project Name:** CollectVault  
**Type:** Mobile-first Web Application (PWA-ready)  
**Core Functionality:** A unified platform for collectors to catalog, track, and manage their collections across multiple categories with photo-first interface, value tracking, and portfolio analytics.  
**Target Users:** Hobbyist collectors, serious enthusiasts, estate planners, and families managing inherited collections.

---

## UI/UX Specification

### Layout Structure

**Mobile-First Design (Primary: 375px+, Secondary: 768px+, Desktop: 1024px+)**

#### Page Structure:
- **Bottom Navigation** (Mobile): Home, Collections, Add Item, Wishlist, Profile
- **Top Bar**: App title, search, notifications, settings
- **Content Area**: Scrollable main content with pull-to-refresh
- **FAB**: Floating action button for quick add on mobile

#### Responsive Breakpoints:
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (two columns, sidebar nav)
- Desktop: > 1024px (three columns, full sidebar)

### Visual Design

#### Color Palette:
- **Background Primary:** #0F0F0F (Rich Black)
- **Background Secondary:** #1A1A1A (Dark Gray)
- **Background Card:** #242424 (Elevated Surface)
- **Accent Primary:** #FF6B35 (Vibrant Orange - for CTAs, highlights)
- **Accent Secondary:** #4ECDC4 (Teal - for positive values, success)
- **Accent Tertiary:** #FFE66D (Gold - for premium, value indicators)
- **Text Primary:** #FFFFFF
- **Text Secondary:** #A0A0A0
- **Text Muted:** #666666
- **Border:** #333333
- **Danger:** #FF4757
- **Gradient Hero:** linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)

#### Typography:
- **Font Family:** "Outfit" (Google Fonts) - Modern, geometric, highly legible
- **Headings:** 
  - H1: 32px/700
  - H2: 24px/600
  - H3: 20px/600
  - H4: 16px/600
- **Body:** 14px/400, 16px for important text
- **Caption:** 12px/400
- **Monospace (values):** "JetBrains Mono"

#### Spacing System (8pt grid):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

#### Visual Effects:
- Card shadows: 0 4px 20px rgba(0,0,0,0.4)
- Hover lift: translateY(-2px) with 0.2s ease
- Glassmorphism on modals: backdrop-blur(12px)
- Border radius: 12px (cards), 8px (buttons), 24px (pills)
- Smooth transitions: 200ms ease-out

### Components

#### Navigation:
- Bottom nav bar with 5 icons + labels
- Active state: Accent color + filled icon
- Inactive: Muted gray

#### Collection Cards:
- Square aspect ratio (1:1) thumbnail
- Overlay gradient at bottom
- Collection name + item count
- Total value badge (top right)

#### Item Cards:
- 3:4 aspect ratio image
- Item name, category badge
- Value indicator (green if gained, red if lost)
- Quick action buttons (edit, share)

#### Form Elements:
- Rounded input fields with border
- Focus state: Orange border glow
- Error state: Red border + message
- Custom select dropdowns with icons

#### Buttons:
- Primary: Orange gradient, white text
- Secondary: Transparent with orange border
- Ghost: Text only with hover background
- Icon buttons: 44px touch target

#### Modals:
- Slide-up from bottom (mobile)
- Centered with backdrop blur (desktop)
- Close button top-right

---

## Functionality Specification

### Core Features (MVP)

#### 1. Collection Management
- **Pre-built Templates:**
  - Trading Cards (Pokemon, Sports, TCG)
  - Vinyl Records
  - Coins
  - Funko Pops
  - Books/Comics
  - Video Games
  - Stamps
  - Jewelry/Watches
- **Custom Collections:** Create from scratch with custom fields
- **Collection Details:** Cover photo, description, privacy settings
- **Item Count & Total Value display**

#### 2. Item Management
- **Photo Capture/Upload:**
  - Camera integration (via Web API)
  - Gallery upload
  - Multiple photos per item (up to 5)
- **Auto-tagging (simulated):** 
  - Category suggestion based on collection
  - Condition suggestions (Mint, Near Mint, Good, Fair, Poor)
- **Custom Fields per Collection:**
  - Trading Cards: Card Set, Card Number, Grade, PSA/BGS Rating, Player, Year
  - Vinyl: Artist, Album, Pressing Year, Condition (Sleeve/Media), Matrix Number
  - Coins: Year, Mint Mark, Condition, Grade, Country
  - Funko Pop!: Series, Number, Variant, Box Type
  - Books: ISBN, Author, Edition, Publisher, Year
  - Video Games: Platform, Region, Condition, Complete
- **Manual Fields:** Name, Description, Purchase Price, Purchase Date, Current Value, Notes

#### 3. Value Tracker
- **Manual Entry:** Update current value anytime
- **Value History:** Track value changes over time
- **Portfolio Summary:**
  - Total collection value
  - Value change (daily, weekly, monthly, yearly)
  - Top performing items
  - Category breakdown (pie chart)
- **Insurance Reports:**
  - Export to PDF (basic template)
  - Export to CSV
  - Include photos, descriptions, values

#### 4. Dashboard
- **Portfolio Overview:**
  - Total value (large display)
  - Items count
  - Collections count
  - Recent activity
- **Value Chart:** Line chart showing portfolio value over time
- **Quick Stats:** Most valuable item, Recently added, Value alerts

#### 5. Reminders
- **Re-grading reminders:** Set date for re-evaluation
- **Cleaning reminders:** For coins, cards, vinyl
- **Insurance renewal reminders**
- **Custom reminders**

#### 6. Sharing & Privacy
- **Private Mode:** Collections only visible to owner
- **Family View:** Share with family members (read-only or edit)
- **Estate Planning:** Designate heir, lock collection
- **Shareable Links:** Generate read-only link

#### 7. Wishlist
- **Add items wanted**
- **Target price**
- **Priority level**
- **Auto-match:** Notify when similar item available in trade/sell

#### 8. Trade/Sell Matcher (Local)
- **List items for trade/sell**
- **Browse others' listings (simulated with mock data initially)**
- **In-app messaging (basic)**
- **Trade calculator**

### User Interactions

1. **Onboarding:** 3 screens explaining features, then collection setup
2. **First Collection:** Guided creation with template selection
3. **Add Item Flow:** Photo → Details → Custom Fields → Value → Save
4. **Dashboard:** Pull-to-refresh, tap item for details
5. **Search:** Real-time filtering across all collections

### Data Handling
- **Local Storage:** IndexedDB via localForage for offline-first
- **Image Storage:** Base64 in local storage (with compression)
- **Export/Import:** JSON backup and restore

### Edge Cases
- No collections: Show empty state with CTA
- No items in collection: Show empty collection with add button
- Image upload failure: Show retry option, allow text-only
- Value not set: Show "Not valued" with add value prompt
- Offline: Queue changes, sync when online (simulated)

---

## Page Structure

### 1. Dashboard (Home)
- Portfolio value hero card
- Quick stats row
- Recent items carousel
- Value chart
- Activity feed

### 2. Collections List
- Grid of collection cards (2 columns)
- Filter/sort options
- Add collection FAB

### 3. Collection Detail
- Header with cover photo
- Collection stats
- Items grid (2 columns)
- Sort/filter toolbar
- Add item FAB

### 4. Item Detail
- Image gallery (swipeable)
- Item info card
- Custom fields list
- Value history
- Action buttons (Edit, Share, Trade, Delete)

### 5. Add/Edit Item
- Photo section (camera/gallery)
- Basic info form
- Custom fields (dynamic based on collection)
- Value input
- Save/Cancel buttons

### 6. Add/Edit Collection
- Template selection (grid of icons)
- Collection name
- Description
- Cover photo
- Custom fields builder

### 7. Wishlist
- List of wanted items
- Priority badges
- Add wishlist item

### 8. Profile/Settings
- User info
- App settings (theme, notifications)
- Export data
- Import data
- Privacy settings
- About

### 9. Reports
- Generate insurance report
- Select collections
- Choose format (PDF/CSV)
- Download

---

## Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme applied throughout
- [ ] Orange accent color prominent on CTAs
- [ ] Cards have proper shadows and hover effects
- [ ] Mobile bottom navigation visible on small screens
- [ ] Smooth transitions between pages
- [ ] Images load with proper aspect ratios

### Functional Checkpoints
- [ ] Can create a new collection with template
- [ ] Can add item with photo upload
- [ ] Custom fields display based on collection type
- [ ] Dashboard shows portfolio value
- [ ] Can export collection to CSV
- [ ] Wishlist items can be added
- [ ] Search filters items correctly
- [ ] Data persists in local storage

### Technical Checkpoints
- [ ] No console errors on load
- [ ] Build completes successfully
- [ ] Responsive at all breakpoints
- [ ] Images optimized (proper sizing)
- [ ] Forms validate properly
