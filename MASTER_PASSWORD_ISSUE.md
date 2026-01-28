# Master Password Issue & Logging Implementation

## 🔍 IMPORTANT DISCOVERY: Why No Backend Logs?

**The vault unlock process is ENTIRELY CLIENT-SIDE!**

When you enter your master password to unlock the vault:
- ❌ **NO backend API call is made**
- ❌ **NO server logs are generated**
- ✅ **Only frontend JavaScript executes**
- ✅ **Password is used to derive encryption key locally**

This is why you see the error in the frontend but no logs on the server!

## How Vault Unlocking Actually Works

### The Password System:
1. **Account Password**: The password you use to register/login to your account
2. **Vault Encryption**: The same account password is used to derive the encryption key for your vault

### The Flow:

#### During Login/Registration:
1. **Backend** verifies password (bcrypt hash comparison)
2. **Backend** returns user data including salt
3. **Frontend** derives encryption key using PBKDF2(password, salt)
4. **Frontend** stores key in memory
5. Vault is unlocked automatically

#### During Vault Unlock (after page refresh):
1. **Frontend** asks for password
2. **Frontend** derives encryption key using PBKDF2(password, salt)
3. **Frontend** stores key in memory
4. **NO backend communication happens!**

### Why It Might Fail:
- **Wrong Password**: You're entering a different password than your account password
- **No Server Verification**: The unlock doesn't contact the server at all
- **Silent Failure**: Key derivation succeeds with any password, but produces wrong key
- **Decryption Fails**: You only know password is wrong when trying to decrypt vault items

## Solution

**To unlock your vault, use your account password** - the same password you use to login.

If you've forgotten your account password, you'll need to:
1. Logout
2. Login again with the correct password
3. The vault will unlock automatically

## Enhanced Logging Implementation

I've added **comprehensive logging** to help debug this issue:

### Frontend (Browser Console) Logging:

**Added detailed logging to:**
- ✅ Vault unlock attempts (with password length, salt info, timing)
- ✅ Key derivation process (step-by-step PBKDF2 execution)
- ✅ Error details (error type, message, stack trace)
- ✅ Login flow

**What You'll See Now:**

```
[Vault Unlock] ========== UNLOCK ATTEMPT START ==========
[Vault Unlock] User Info: { userId, userEmail, hasSalt: true, saltLength: 44, saltPreview: '...' }
[Vault Unlock] Password Info: { passwordLength: 12, passwordPreview: 'abc***', isEmpty: false }
[Vault Unlock] Calling keyManager.initialize()...
[Key Derivation] Starting key derivation { passwordLength: 12, saltLength: 44, iterations: 100000, ... }
[Key Derivation] Step 1: Converting password to buffer
[Key Derivation] Password buffer size: 12 bytes
[Key Derivation] Step 2: Importing key material
[Key Derivation] ✅ Key material imported successfully
[Key Derivation] Step 3: Converting salt from base64
[Key Derivation] Salt buffer size: 32 bytes
[Key Derivation] Step 4: Deriving master key with PBKDF2
[Key Derivation] ✅ Master key derived successfully in 245.50 ms
[Vault Unlock] ✅ Vault unlocked successfully
[Vault Unlock] ========== UNLOCK ATTEMPT SUCCESS ==========
```

**On Error:**
```
[Key Derivation] ❌ Key derivation failed
[Key Derivation] Error type: DOMException
[Key Derivation] Error message: Invalid base64 string
[Vault Unlock] ========== UNLOCK ATTEMPT FAILED ==========
[Vault Unlock] ❌ Error details: { errorType, errorMessage, errorStack }
```

### Backend (Server Console) Logging:

**Note:** Backend logs will NOT appear during vault unlock, but they will appear during:
- Login/Register
- Fetching vault items
- Creating/updating/deleting vault items

**Server logs include:**
```
[2026-01-27T11:05:10.000Z] [INFO] POST /api/v1/auth/login
[2026-01-27T11:05:10.000Z] [INFO] Login attempt | {"email":"user@example.com"}
[2026-01-27T11:05:10.000Z] [DEBUG] User found, verifying password | {"userId":"..."}
[2026-01-27T11:05:10.000Z] [SUCCESS] Password verified successfully
```

## How to Debug

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Try to unlock the vault**
4. **Read the detailed logs** - they will tell you:
   - ✅ If user has a salt
   - ✅ Password length (verify it's not empty)
   - ✅ Which step of key derivation failed
   - ✅ Exact error from crypto API

## Common Issues & Solutions

### Issue 1: "Failed to unlock vault. Please check your password."
**Possible Causes:**
- Wrong password (most common)
- Invalid salt in database
- Browser crypto API error

**Debug Steps:**
1. Check browser console for detailed error
2. Verify password is the same as login password
3. Try logging out and logging in again
4. Try with a fresh test account

### Issue 2: Unlock succeeds but items won't decrypt
**Cause:** Wrong password was used
- Key derivation succeeds with any password
- But wrong key can't decrypt items

**Solution:** Use correct account password

### Issue 3: No salt found
**Cause:** User account data is corrupted

**Solution:** Re-register or contact support

## Testing the Fix

1. **Open browser console** (F12)
2. **Navigate to vault page**
3. **Try to unlock with your account password**
4. **Watch the console logs** - you'll see exactly what's happening
5. **If it fails, share the console output** for debugging

## Files Modified

### Frontend:
- `apps/web/src/contexts/AuthContext.tsx` - Enhanced unlock logging with detailed error tracking
- `apps/web/src/lib/crypto/key-derivation.ts` - Step-by-step key derivation logging

### Documentation:
- `VAULT_UNLOCK_DEBUGGING.md` - Comprehensive debugging guide (NEW)
- `MASTER_PASSWORD_ISSUE.md` - This file (UPDATED)

### Backend (from previous session):
- `apps/api/src/utils/logger.ts` - Logger utility
- `apps/api/src/services/auth.service.ts` - Auth service logging
- `apps/api/src/controllers/auth.controller.ts` - Request logging
- `apps/api/src/index.ts` - Request middleware

## Next Steps

1. **Check browser console** when unlocking the vault
2. **Share the console output** if you're still seeing errors
3. **Verify you're using the correct account password**
4. **Try with a fresh account** to rule out data corruption

## Additional Resources

See `VAULT_UNLOCK_DEBUGGING.md` for a comprehensive debugging guide with more details about:
- The vault unlock architecture
- Step-by-step debugging process
- Common error patterns
- Security implications

