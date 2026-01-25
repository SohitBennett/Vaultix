# Dark/Light Mode Implementation Plan

## 🎯 Overview
Add dark/light mode support to Vaultix while maintaining the current Claude-inspired UI design. The implementation will use Tailwind CSS's dark mode feature with a context-based theme provider.

---

## 📋 Implementation Strategy

### **Approach: Tailwind Dark Mode with Context API**
- Use Tailwind's `class` strategy for dark mode
- Create a ThemeContext to manage theme state
- Store theme preference in localStorage
- Respect system preferences on first visit
- Add a theme toggle button in the header

---

## 📁 Files That Need Changes

### **1. Core Configuration Files** (2 files)

#### `tailwind.config.ts`
**Changes:**
- Enable dark mode with `class` strategy
- Ensure all color utilities support dark mode

**Complexity:** Low
**Lines Changed:** ~5 lines

---

#### `apps/web/src/app/globals.css`
**Changes:**
- Add dark mode color variables
- Update base styles with dark mode variants
- Add dark mode styles for all components

**Complexity:** Medium
**Lines Changed:** ~100-150 lines (adding dark: variants)

---

### **2. New Files to Create** (2 files)

#### `apps/web/src/contexts/ThemeContext.tsx` ✨ NEW
**Purpose:** Theme state management
**Features:**
- Theme state (light/dark/system)
- Toggle function
- localStorage persistence
- System preference detection
- SSR-safe implementation

**Complexity:** Medium
**Lines:** ~80-100 lines

---

#### `apps/web/src/components/ui/ThemeToggle.tsx` ✨ NEW
**Purpose:** Theme toggle button component
**Features:**
- Sun/Moon icon toggle
- Smooth transitions
- Accessible (keyboard navigation)
- Tooltip support
- Claude-inspired design

**Complexity:** Low
**Lines:** ~50-60 lines

---

### **3. Layout & Provider Files** (1 file)

#### `apps/web/src/app/layout.tsx`
**Changes:**
- Wrap app with ThemeProvider
- Add theme class to html element
- Import ThemeProvider

**Complexity:** Low
**Lines Changed:** ~10 lines

---

### **4. Page Components** (5 files)

#### `apps/web/src/app/page.tsx` (Landing Page)
**Changes:**
- Add dark mode color classes
- Update backgrounds: `bg-white` → `bg-white dark:bg-gray-900`
- Update text colors: `text-gray-900` → `text-gray-900 dark:text-gray-100`
- Update borders: `border-gray-200` → `border-gray-200 dark:border-gray-700`
- Add ThemeToggle to header

**Complexity:** Medium
**Lines Changed:** ~30-40 lines

---

#### `apps/web/src/app/login/page.tsx`
**Changes:**
- Add dark mode variants to all color classes
- Update card backgrounds
- Update input fields
- Update button styles
- Add ThemeToggle to header

**Complexity:** Medium
**Lines Changed:** ~25-35 lines

---

#### `apps/web/src/app/register/page.tsx`
**Changes:**
- Same as login page
- Add dark mode variants
- Update all color utilities

**Complexity:** Medium
**Lines Changed:** ~25-35 lines

---

#### `apps/web/src/app/vault/page.tsx`
**Changes:**
- Add dark mode to header
- Update main background
- Update card backgrounds
- Update input fields and dropdowns
- Update filter buttons
- Add ThemeToggle to header

**Complexity:** Medium-High
**Lines Changed:** ~40-50 lines

---

#### `apps/web/src/app/generator/page.tsx`
**Changes:**
- Add dark mode variants
- Update card backgrounds
- Update input fields
- Add ThemeToggle to header

**Complexity:** Medium
**Lines Changed:** ~30-40 lines

---

### **5. Component Files** (8 files)

#### `apps/web/src/components/vault/VaultItemCard.tsx`
**Changes:**
- Card background: `bg-white` → `bg-white dark:bg-gray-800`
- Borders: `border-gray-200` → `border-gray-200 dark:border-gray-700`
- Text colors: `text-gray-900` → `text-gray-900 dark:text-gray-100`
- Input backgrounds: `bg-gray-50` → `bg-gray-50 dark:bg-gray-700`
- Button hover states

**Complexity:** Medium
**Lines Changed:** ~20-30 lines

---

#### `apps/web/src/components/vault/VaultItemModal.tsx`
**Changes:**
- Modal backdrop: Add dark mode overlay
- Modal background: `bg-white` → `bg-white dark:bg-gray-800`
- All form inputs with dark variants
- Button styles
- Border colors

**Complexity:** Medium
**Lines Changed:** ~30-40 lines

---

#### `apps/web/src/components/vault/DeleteConfirmModal.tsx`
**Changes:**
- Modal background
- Text colors
- Button styles
- Icon colors

**Complexity:** Low
**Lines Changed:** ~15-20 lines

---

#### `apps/web/src/components/vault/ExportConfirmModal.tsx`
**Changes:**
- Modal background
- Warning box colors
- Text colors
- Button styles

**Complexity:** Low
**Lines Changed:** ~15-20 lines

---

#### `apps/web/src/components/ui/ErrorAlert.tsx`
**Changes:**
- Alert backgrounds with dark variants
- Border colors
- Text colors for each type (error/warning/info)

**Complexity:** Low
**Lines Changed:** ~10-15 lines

---

#### `apps/web/src/components/generator/PasswordGenerator.tsx`
**Changes:**
- Card backgrounds
- Input fields
- Preset buttons
- Strength meter colors

**Complexity:** Medium
**Lines Changed:** ~25-30 lines

---

#### `apps/web/src/components/auth/ProtectedRoute.tsx`
**Changes:**
- Loading state background
- Text colors

**Complexity:** Low
**Lines Changed:** ~5-10 lines

---

#### `apps/web/src/components/ui/LoadingSpinner.tsx`
**Changes:**
- Spinner colors for dark mode

**Complexity:** Low
**Lines Changed:** ~3-5 lines

---

## 📊 Summary Statistics

### **Files to Modify:**
- **Configuration:** 2 files
- **New Files:** 2 files
- **Layout:** 1 file
- **Pages:** 5 files
- **Components:** 8 files
- **Total:** 18 files

### **Estimated Changes:**
- **New Code:** ~130-160 lines (new files)
- **Modified Code:** ~350-450 lines (dark mode variants)
- **Total:** ~480-610 lines

### **Complexity Breakdown:**
- **Low:** 6 files
- **Medium:** 10 files
- **Medium-High:** 1 file
- **High:** 0 files

---

## 🎨 Color Palette Strategy

### **Light Mode (Current)**
- Background: `bg-white`, `bg-gray-50`
- Text: `text-gray-900`, `text-gray-600`
- Borders: `border-gray-200`, `border-gray-300`
- Cards: `bg-white`
- Inputs: `bg-white`, `bg-gray-50`

### **Dark Mode (New)**
- Background: `bg-gray-900`, `bg-gray-950`
- Text: `text-gray-100`, `text-gray-300`
- Borders: `border-gray-700`, `border-gray-600`
- Cards: `bg-gray-800`
- Inputs: `bg-gray-800`, `bg-gray-700`

### **Accent Colors (Same in Both)**
- Primary: `bg-gray-900` (light) / `bg-gray-100` (dark)
- Blue: `bg-blue-600`
- Green: `bg-green-600`
- Red: `bg-red-600`
- Yellow: `bg-yellow-500`

---

## 🔄 Implementation Steps

### **Phase 1: Setup (30 minutes)**
1. Update `tailwind.config.ts`
2. Create `ThemeContext.tsx`
3. Create `ThemeToggle.tsx`
4. Update `layout.tsx`

### **Phase 2: Core Pages (45 minutes)**
5. Update `globals.css` with dark mode base styles
6. Update landing page (`page.tsx`)
7. Update login page
8. Update register page
9. Update vault page

### **Phase 3: Components (45 minutes)**
10. Update VaultItemCard
11. Update VaultItemModal
12. Update DeleteConfirmModal
13. Update ExportConfirmModal
14. Update ErrorAlert
15. Update PasswordGenerator

### **Phase 4: Polish (30 minutes)**
16. Update remaining components
17. Test all pages in both modes
18. Fix any visual inconsistencies
19. Add smooth transitions

**Total Estimated Time:** ~2.5 hours

---

## ✅ Testing Checklist

- [ ] Theme toggle works on all pages
- [ ] Theme persists on page reload
- [ ] System preference is respected on first visit
- [ ] All text is readable in both modes
- [ ] All buttons have proper contrast
- [ ] All modals look good in both modes
- [ ] All form inputs are visible in both modes
- [ ] All icons are visible in both modes
- [ ] Smooth transitions between themes
- [ ] No flash of unstyled content (FOUC)
- [ ] Works on mobile and desktop
- [ ] Keyboard navigation works

---

## 🎯 Key Principles

1. **Maintain Current Design:** Only add color variants, don't change layout
2. **Accessibility:** Ensure WCAG contrast ratios in both modes
3. **Performance:** No layout shifts when toggling
4. **Consistency:** Use same spacing, typography, and components
5. **User Preference:** Respect system preferences and save user choice
6. **Smooth Transitions:** Add subtle transitions for theme changes

---

## 🚀 Benefits

- ✅ **Better UX:** Users can choose their preferred theme
- ✅ **Eye Comfort:** Dark mode reduces eye strain in low light
- ✅ **Modern:** Follows current web design trends
- ✅ **Accessibility:** Better for users with light sensitivity
- ✅ **Professional:** Shows attention to detail
- ✅ **No Breaking Changes:** Existing UI remains intact

---

## 📝 Notes

- All changes are additive (adding `dark:` variants)
- No existing functionality will be affected
- Theme toggle will be in the header of all pages
- Default theme will be system preference
- Theme choice persists across sessions
- SSR-safe implementation (no hydration errors)
