# Vault Unlock Debugging Guide

## Issue Summary

You're seeing the error "Failed to unlock vault. Please check your password." in the frontend, but **there are NO backend logs** because the vault unlock process is **entirely client-side**.

## How Vault Unlock Works

### Current Architecture

1. **User enters master password** in the vault unlock form
2. **Frontend calls `unlockVault(password)`** in `AuthContext.tsx`
3. **Key derivation happens client-side**:
   - `keyManager.initialize(password, user.salt)` is called
   - This derives a cryptographic key using PBKDF2
   - The key is stored in browser memory
4. **No backend API call is made** during unlock
5. **Password verification** only happens when you try to decrypt vault items

### Why No Backend Logs?

The backend is **never contacted** during the vault unlock process. The unlock is purely:
- Password → PBKDF2 key derivation → Store key in memory

The backend only gets involved when:
- Login/Register (to get the salt)
- Fetching vault items
- Creating/updating/deleting vault items

## Enhanced Logging Added

I've added comprehensive logging to help debug the issue:

### Frontend Console Logs

When you attempt to unlock the vault, you'll now see detailed logs:

```
[Vault Unlock] ========== UNLOCK ATTEMPT START ==========
[Vault Unlock] User Info: { userId, userEmail, hasSalt, saltLength, saltPreview }
[Vault Unlock] Password Info: { passwordLength, passwordPreview, isEmpty }
[Vault Unlock] Calling keyManager.initialize()...
[Key Derivation] Starting key derivation { passwordLength, saltLength, iterations, algorithm, keyLength }
[Key Derivation] Step 1: Converting password to buffer
[Key Derivation] Password buffer size: X bytes
[Key Derivation] Step 2: Importing key material
[Key Derivation] ✅ Key material imported successfully
[Key Derivation] Step 3: Converting salt from base64
[Key Derivation] Salt buffer size: X bytes
[Key Derivation] Step 4: Deriving master key with PBKDF2
[Key Derivation] ✅ Master key derived successfully in X ms
[Vault Unlock] ✅ Vault unlocked successfully
[Vault Unlock] ========== UNLOCK ATTEMPT SUCCESS ==========
```

If it fails, you'll see:
```
[Key Derivation] ❌ Key derivation failed
[Key Derivation] Error type: ...
[Key Derivation] Error message: ...
[Vault Unlock] ========== UNLOCK ATTEMPT FAILED ==========
[Vault Unlock] ❌ Error details: { errorType, errorMessage, errorStack }
```

## How to Debug

### Step 1: Open Browser Console

1. Open the vault page
2. Open browser DevTools (F12)
3. Go to the Console tab
4. Try to unlock the vault with your master password

### Step 2: Check the Logs

Look for the detailed logs above. They will tell you:
- ✅ **If the user has a salt** (required for key derivation)
- ✅ **Password length** (to verify it's not empty)
- ✅ **Which step of key derivation failed** (if any)
- ✅ **The exact error message** from the crypto API

### Step 3: Common Issues

#### Issue 1: No Salt Found
```
[Vault Unlock] ❌ No salt found for user
```
**Solution**: The user account is corrupted. You may need to re-register.

#### Issue 2: Empty Password
```
[Vault Unlock] ❌ Empty password provided
```
**Solution**: Make sure you're entering a password.

#### Issue 3: Key Derivation Failed
```
[Key Derivation] ❌ Key derivation failed
```
**Possible causes**:
- Invalid base64 salt in database
- Browser crypto API not available
- Corrupted user data

#### Issue 4: Wrong Password
**Important**: The system **cannot detect a wrong password** during unlock!
- Key derivation will succeed with any password
- You'll only know the password is wrong when you try to **decrypt vault items**
- If decryption fails, you'll see errors when loading vault items

## Testing the Fix

1. **Clear browser cache and cookies**
2. **Register a new test account**
3. **Note the password you use**
4. **Add a test vault item**
5. **Logout and login again**
6. **Try to unlock with the CORRECT password**
7. **Check console logs** - should see success messages
8. **Verify vault items load** - this confirms the password is correct
9. **Try to unlock with WRONG password**
10. **Check what happens** - key derivation will succeed, but item decryption will fail

## Understanding Password Verification

The current system has a **security limitation**:

### During Unlock
- ❌ Cannot verify if password is correct
- ✅ Can only verify password format is valid
- ✅ Can derive a key (even with wrong password)

### During Item Decryption
- ✅ Wrong password = decryption fails
- ✅ This is when you know the password is wrong

### Why This Design?

This is actually a **security feature**:
- The server never stores the master password
- The server never stores the derived key
- Only encrypted data is stored
- Password verification happens through successful decryption

## Next Steps

1. **Check the browser console logs** when unlocking
2. **Share the console output** so we can see exactly what's failing
3. **Try with a fresh account** to rule out data corruption
4. **Verify the password** you're using is the same one from registration/login

## Files Modified

- `apps/web/src/contexts/AuthContext.tsx` - Enhanced unlock logging
- `apps/web/src/lib/crypto/key-derivation.ts` - Enhanced derivation logging

## Questions to Answer

Based on the console logs, we can determine:

1. ✅ Does the user have a salt?
2. ✅ Is the password being passed correctly?
3. ✅ Which step of key derivation is failing?
4. ✅ What is the exact error from the crypto API?
5. ✅ Is this a wrong password or a system error?
