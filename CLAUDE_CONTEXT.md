# CLAUDE_CONTEXT.md

## Project: Password Manager SaaS

**Last Updated**: [Insert Date]  
**Status**: Design Phase Complete, Development in Progress  
**Version**: 1.0.0

---

## Quick Summary
A production-grade, security-first password manager SaaS with client-side encryption, secure vault storage, password generation, and CSV export capabilities.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router) |
| Backend | Node.js + Express |
| Database | MongoDB |
| Authentication | Email/Password + JWT (access + refresh tokens) |
| Encryption | Client-side AES-256-GCM |
| Repository | Monorepo (pnpm workspaces) |

---

## Core Security Principles

1. **Zero-Knowledge Architecture**: Backend NEVER sees plaintext passwords
2. **Client-Side Encryption**: All encryption/decryption happens in browser
3. **Cryptographically Secure**: Uses Web Crypto API, not Math.random()
4. **Encrypted at Rest**: Only encrypted blobs stored in database
5. **Defense in Depth**: Multiple security layers (auth, encryption, validation)

---

## Project Structure

```
password-manager-saas/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared types/constants
└── docs/             # All documentation
```

---

## Core Features

### Implemented
- [ ] User registration & login (JWT-based)
- [ ] Password vault (CRUD operations)
- [ ] Client-side AES-256-GCM encryption
- [ ] Password generator (client-side)
- [ ] CSV vault export
- [ ] Refresh token rotation

### Planned (Not Yet Implemented)
- [ ] Browser extension (future phase)
- [ ] 2FA/MFA
- [ ] Password sharing
- [ ] Breach monitoring

---

## Key Architectural Decisions

### 1. Hybrid Encryption Model
- **Master Key**: Derived from user password using PBKDF2 (never stored)
- **Encryption**: AES-256-GCM with per-item random IVs
- **Storage**: Only encrypted data + metadata sent to backend

### 2. Authentication Flow
- **Access Token**: Short-lived (15 min), stored in memory
- **Refresh Token**: Long-lived (7 days), httpOnly cookie
- **Rotation**: Refresh tokens rotate on use

### 3. Data Flow
```
User Action → Client Encryption → API Request → MongoDB
                     ↓
              (Master Key stays in memory, never transmitted)
```

---

## API Surface

### Auth Endpoints
- `POST /auth/register` - Create new account
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Invalidate refresh token

### Vault Endpoints
- `GET /vault/items` - List all vault items (encrypted)
- `POST /vault/items` - Create vault item
- `PUT /vault/items/:id` - Update vault item
- `DELETE /vault/items/:id` - Delete vault item

### Export Endpoints
- `GET /export/csv` - Export vault as CSV (encrypted data)

---

## Security Boundaries

| Component | Sees Plaintext | Sees Encrypted | Has Master Key |
|-----------|----------------|----------------|----------------|
| Frontend | ✓ | ✓ | ✓ (in memory) |
| Backend API | ✗ | ✓ | ✗ |
| Database | ✗ | ✓ | ✗ |
| Browser Extension (future) | ✓ | ✓ | ✓ (in memory) |

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-manager
JWT_ACCESS_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Development Phases

### Phase 1: Core Infrastructure ✓
- [x] Design system architecture
- [x] Define API contracts
- [x] Document security model
- [x] Create folder structure

### Phase 2: Backend Foundation (Current)
- [ ] Set up Express + MongoDB
- [ ] Implement auth endpoints
- [ ] Implement vault endpoints
- [ ] Add rate limiting & validation

### Phase 3: Frontend Foundation
- [ ] Set up Next.js app
- [ ] Implement client-side crypto
- [ ] Build auth UI
- [ ] Build vault UI

### Phase 4: Password Generator
- [ ] Create generator logic (client-side)
- [ ] Build generator UI
- [ ] Add preset templates

### Phase 5: Export & Polish
- [ ] CSV export functionality
- [ ] Error handling
- [ ] Loading states
- [ ] Testing

### Phase 6: Future Enhancements
- [ ] Browser extension (design only)
- [ ] 2FA
- [ ] Password strength analysis

---

## Key Files Reference

- **Architecture**: `docs/architecture.md`
- **API Contracts**: `docs/api-contract.md`
- **Security Model**: `docs/security.md`
- **Folder Structure**: See root README.md

---

## Critical Reminders for Future Development

1. **Never log sensitive data** (passwords, keys, tokens)
2. **Always validate input** on both client and server
3. **Use rate limiting** on all auth endpoints
4. **Rotate refresh tokens** on every use
5. **Clear master key** from memory on logout
6. **Test crypto operations** with known test vectors
7. **Use HTTPS only** in production

---

## Threat Model Summary

### Protected Against
- Database breach (data is encrypted)
- Network interception (HTTPS + encrypted payloads)
- CSRF (SameSite cookies)
- XSS (httpOnly cookies, CSP headers)
- Brute force (rate limiting)

### Known Limitations
- Vulnerable if client device is compromised
- Relies on user's master password strength
- No protection against keyloggers on client
- Extension (when built) requires secure message passing

---

## How to Use This Document

**Starting a new chat?** Paste this entire file to give Claude full context.  
**Adding features?** Update the "Core Features" section.  
**Changing architecture?** Update relevant docs/ files and this summary.  
**Deployment?** Reference environment variables and security model.

---

## Contact & Resources

- **Documentation**: See `docs/` folder
- **Issues**: Track in GitHub Issues
- **Architecture Decisions**: Log in `docs/architecture.md`