# Phase 5: Complete File Checklist

This document lists **every file** that needs to be created or updated for Phase 5, with exact file paths and clear instructions.

---

## 🆕 NEW FILES TO CREATE (7 files)

### Backend Files (2 new files)

#### 1. Export Controller
**Path:** `apps/api/src/controllers/export.controller.ts`
**Action:** CREATE NEW FILE
**Purpose:** Handles CSV export logic with rate limiting
**Status:** ✅ Complete code provided above

#### 2. Export Routes
**Path:** `apps/api/src/routes/export.routes.ts`
**Action:** CREATE NEW FILE
**Purpose:** Defines export API endpoints
**Status:** ✅ Complete code provided above

---

### Frontend Files (5 new files)

#### 3. CSV Export Utility
**Path:** `apps/web/src/lib/utils/csv-export.ts`
**Action:** CREATE NEW FILE (need to create `utils` folder first)
**Purpose:** CSV generation, download, and filename utilities
**Status:** ✅ Complete code provided above

**Note:** If the `utils` folder doesn't exist, create it:
```bash
mkdir -p apps/web/src/lib/utils
```

#### 4. Export Confirmation Modal
**Path:** `apps/web/src/components/vault/ExportConfirmModal.tsx`
**Action:** CREATE NEW FILE
**Purpose:** Security warning modal for CSV export
**Status:** ✅ Complete code provided above

#### 5. Loading Spinner Component
**Path:** `apps/web/src/components/ui/LoadingSpinner.tsx`
**Action:** CREATE NEW FILE (need to create `ui` folder first)
**Purpose:** Reusable loading indicator
**Status:** ✅ Complete code provided above

**Note:** If the `ui` folder doesn't exist, create it:
```bash
mkdir -p apps/web/src/components/ui
```

#### 6. Error Alert Component
**Path:** `apps/web/src/components/ui/ErrorAlert.tsx`
**Action:** CREATE NEW FILE
**Purpose:** Consistent error display component
**Status:** ✅ Complete code provided above

---

## 🔄 EXISTING FILES TO UPDATE (4 files)

### Backend Files (2 updates)

#### 7. Express Server
**Path:** `apps/api/src/index.ts`
**Action:** UPDATE EXISTING FILE
**Changes:**
- Add import: `import exportRoutes from './routes/export.routes';`
- Add route: `app.use('/api/v1/export', exportRoutes);`
**Status:** ✅ Complete updated code provided above

#### 8. Backend Package JSON
**Path:** `apps/api/package.json`
**Action:** UPDATE EXISTING FILE
**Changes:**
- Add to dependencies: `"json2csv": "^6.0.0"`
**Status:** ✅ Complete updated code provided above

**Installation Command:**
```bash
cd apps/api
npm install json2csv
cd ../..
```

---

### Frontend Files (2 updates)

#### 9. Vault Context
**Path:** `apps/web/src/contexts/VaultContext.tsx`
**Action:** UPDATE EXISTING FILE
**Changes:**
- Add import: CSV export utilities
- Add function: `exportToCSV()`
- Add to context value: `exportToCSV`
**Status:** ✅ Complete updated code provided above

#### 10. Vault Item Modal
**Path:** `apps/web/src/components/vault/VaultItemModal.tsx`
**Action:** UPDATE EXISTING FILE
**Changes:**
- Add validation state: `validationErrors`
- Add function: `validateForm()`
- Update form fields with validation errors
- Add error message display
**Status:** ✅ Complete updated code provided above

#### 11. Vault Page (SPLIT INTO 2 PARTS)
**Path:** `apps/web/src/app/vault/page.tsx`
**Action:** UPDATE EXISTING FILE
**Changes:**
- Add import: `ExportConfirmModal`
- Add state: `isExportModalOpen`
- Add function: `handleExport()`
- Add export button in header
- Add ExportConfirmModal component
**Status:** ✅ Complete updated code provided above (see Part 1/2 and Part 2/2)

**Note:** The vault page is split into 2 parts due to length. Copy Part 1 first, then continue with Part 2 to complete the file.

---

## 📁 Complete File Structure

After Phase 5, your structure should look like this:

```
password-manager-saas/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts (existing)
│   │   │   │   ├── vault.controller.ts (existing)
│   │   │   │   └── export.controller.ts ✨ NEW
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts (existing)
│   │   │   │   ├── vault.routes.ts (existing)
│   │   │   │   └── export.routes.ts ✨ NEW
│   │   │   └── index.ts 🔄 UPDATED
│   │   └── package.json 🔄 UPDATED
│   │
│   └── web/
│       └── src/
│           ├── components/
│           │   ├── ui/ ✨ NEW FOLDER
│           │   │   ├── LoadingSpinner.tsx ✨ NEW
│           │   │   └── ErrorAlert.tsx ✨ NEW
│           │   └── vault/
│           │       ├── VaultItemCard.tsx (existing)
│           │       ├── VaultItemModal.tsx 🔄 UPDATED
│           │       ├── DeleteConfirmModal.tsx (existing)
│           │       └── ExportConfirmModal.tsx ✨ NEW
│           ├── contexts/
│           │   └── VaultContext.tsx 🔄 UPDATED
│           ├── lib/
│           │   └── utils/ ✨ NEW FOLDER
│           │       └── csv-export.ts ✨ NEW
│           └── app/
│               └── vault/
│                   └── page.tsx 🔄 UPDATED

Legend:
✨ NEW - Create this file/folder
🔄 UPDATED - Modify existing file
```

---

## ✅ Implementation Steps

### Step 1: Create New Folders
```bash
# From project root
mkdir -p apps/web/src/lib/utils
mkdir -p apps/web/src/components/ui
```

### Step 2: Install Dependencies
```bash
cd apps/api
npm install json2csv
cd ../..
```

### Step 3: Create Backend Files
1. Create `apps/api/src/controllers/export.controller.ts`
2. Create `apps/api/src/routes/export.routes.ts`
3. Update `apps/api/src/index.ts`
4. Update `apps/api/package.json`

### Step 4: Create Frontend Files
5. Create `apps/web/src/lib/utils/csv-export.ts`
6. Create `apps/web/src/components/vault/ExportConfirmModal.tsx`
7. Create `apps/web/src/components/ui/LoadingSpinner.tsx`
8. Create `apps/web/src/components/ui/ErrorAlert.tsx`

### Step 5: Update Frontend Files
9. Update `apps/web/src/contexts/VaultContext.tsx`
10. Update `apps/web/src/components/vault/VaultItemModal.tsx`
11. Update `apps/web/src/app/vault/page.tsx` (combine Part 1 & 2)

### Step 6: Test Everything
```bash
npm run dev
```

---

## 🔍 Verification Checklist

After creating/updating all files, verify:

### Backend
- [ ] `apps/api/src/controllers/export.controller.ts` exists
- [ ] `apps/api/src/routes/export.routes.ts` exists
- [ ] `apps/api/src/index.ts` imports and uses export routes
- [ ] `apps/api/package.json` includes `json2csv` dependency
- [ ] `npm install` runs without errors
- [ ] Backend starts without errors (`npm run dev:api`)

### Frontend
- [ ] `apps/web/src/lib/utils/` folder exists
- [ ] `apps/web/src/lib/utils/csv-export.ts` exists
- [ ] `apps/web/src/components/ui/` folder exists
- [ ] `apps/web/src/components/ui/LoadingSpinner.tsx` exists
- [ ] `apps/web/src/components/ui/ErrorAlert.tsx` exists
- [ ] `apps/web/src/components/vault/ExportConfirmModal.tsx` exists
- [ ] `apps/web/src/contexts/VaultContext.tsx` includes `exportToCSV()`
- [ ] `apps/web/src/components/vault/VaultItemModal.tsx` has validation
- [ ] `apps/web/src/app/vault/page.tsx` has export button
- [ ] Frontend starts without errors (`npm run dev:web`)

### Functionality
- [ ] Export button appears in vault
- [ ] Export button is disabled when vault is empty
- [ ] Export modal opens with security warning
- [ ] CSV downloads successfully
- [ ] CSV contains plaintext passwords
- [ ] Form validation works on add/edit
- [ ] Validation errors appear and disappear correctly
- [ ] Loading spinners appear during operations

---

## 🚨 Common Issues

### Issue: "Cannot find module 'json2csv'"
**Solution:** 
```bash
cd apps/api && npm install json2csv && cd ../..
```

### Issue: "Cannot find module '../utils/csv-export'"
**Solution:** Verify file path is exactly: `apps/web/src/lib/utils/csv-export.ts`

### Issue: "Cannot find module '../ui/LoadingSpinner'"
**Solution:** Verify folder exists: `apps/web/src/components/ui/`

### Issue: Export button not showing
**Solution:** 
1. Check vault page imports `ExportConfirmModal`
2. Verify `exportToCSV` is in VaultContext
3. Check console for errors

### Issue: Validation not working
**Solution:**
1. Verify VaultItemModal has `validateForm()` function
2. Check `validationErrors` state exists
3. Verify form submission calls `validateForm()`

---

## 📊 File Count Summary

- **New Files:** 7 (2 backend, 5 frontend)
- **Updated Files:** 4 (2 backend, 2 frontend)
- **New Folders:** 2 (`utils`, `ui`)
- **Total Changes:** 13 files + 2 folders

---

## 🎯 Final Check

Before marking Phase 5 complete, ensure:

1. ✅ All 7 new files created
2. ✅ All 4 existing files updated
3. ✅ Backend runs without errors
4. ✅ Frontend runs without errors
5. ✅ Export functionality works
6. ✅ Validation works on forms
7. ✅ Loading spinners appear
8. ✅ No console errors

**When all checked → Phase 5 is complete!** 🎉