# Active Context: CollectVault - Collector Portfolio App

## Current State

**App Status**: Complete - Deployed

CollectVault is a mobile-first collector portfolio manager built with Next.js 16, TypeScript, and Tailwind CSS. It features a dark theme with orange accents, offline-first architecture using localForage, and PWA-ready structure.

## Recently Completed

- [x] Project setup with Next.js 16 App Router
- [x] Type definitions for collections, items, wishlists, trade listings
- [x] Collection templates (Trading Cards, Vinyl, Coins, Funko Pops, Books, Video Games, Stamps, Jewelry)
- [x] Custom fields per collection type
- [x] Image upload with compression
- [x] Value tracking with purchase/current values
- [x] Dashboard with portfolio overview
- [x] Collection management (create, view, delete)
- [x] Item management (add, edit, delete with photos)
- [x] Wishlist functionality
- [x] Export to PDF/CSV/JSON
- [x] Import/backup functionality
- [x] Dark theme UI with mobile-first design
- [x] Firebase authentication (email + Google)
- [x] 8 collection categories: Cards, Records, Stamps, Toys, Sports, NFT, Custom
- [x] Camera support for item photos (capture="environment")
- [x] Marketplace with 5% commission
- [x] Community forum
- [x] Bottom navigation with center FAB button
- [x] Build verification passed
- [x] Pushed to remote repository
- [x] Login added to bottom navigation
- [x] Help Center with FAQs and guides
- [x] Help link in Profile page

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Dashboard | ✅ |
| `src/app/collections/` | Collections list & create | ✅ |
| `src/app/collections/[id]/` | Collection detail | ✅ |
| `src/app/add/` | Add new item | ✅ |
| `src/app/item/[id]/` | Item detail & edit | ✅ |
| `src/app/wishlist/` | Wishlist | ✅ |
| `src/app/profile/` | Settings & export | ✅ |
| `src/context/AppContext.tsx` | State management | ✅ |
| `src/lib/storage.ts` | LocalForage persistence | ✅ |
| `src/data/templates.ts` | Collection templates | ✅ |
| `src/components/ui/` | Button, Input, Card, Modal | ✅ |
| `src/components/collection/` | CollectionCard | ✅ |
| `src/components/item/` | ItemCard | ✅ |

## Current Focus

The MVP is complete. Next steps for enhancement:

1. Cloud sync (Firebase/Supabase)
2. Trade/Sell marketplace (local listings)
3. AI auto-tagging integration
4. Dark mode shelf view gallery
5. Family sharing / estate mode

## Build Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun build` | Build production app |
| `bun lint` | Check code quality |
| `bun typecheck` | Type checking |
| `bun dev` | Development server |

## Session History

| Date | Changes |
|------|---------|
| Initial | Built CollectVault MVP - collector portfolio app with collections, items, photos, value tracking, wishlist, PDF/CSV export |
| Latest | Added login/auth, marketplace with 5% commission, community forum, camera support, updated categories, verified build, pushed to remote |
