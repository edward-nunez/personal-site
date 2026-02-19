# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by emailing the maintainer. Do not create public GitHub issues for security vulnerabilities.

## Known Security Issues (Accepted Risks)

This section documents security findings that have been reviewed and accepted as low-risk based on their context and exploitability.

### ajv <8.18.0 ReDoS Vulnerability (GHSA-2g4f-4pwh-qvx6)

**Status:** Accepted Risk - Low Impact  
**Severity:** Moderate (per npm audit)  
**Actual Risk:** Negligible  
**Identified:** February 2026  
**Next Review:** March 2026

#### Vulnerability Details
- **Package:** ajv (v6.12.6)
- **CVE:** GHSA-2g4f-4pwh-qvx6
- **Issue:** Regular Expression Denial of Service (ReDoS) when using the `$data` option in JSON schema validation
- **Affected Versions:** ajv < 8.18.0
- **Fixed In:** ajv >= 8.18.0

#### Why This Risk Is Accepted

1. **Development Dependency Only**
   - ajv is only used by ESLint (linting toolchain)
   - Not present in production builds or runtime
   - Only executes during `npm run lint` and pre-commit hooks
   - Never exposed to end-users or production traffic

2. **Low Exploitability**
   - Attack requires controlling ESLint plugin configurations
   - Would need repository write access or compromised npm packages
   - ESLint's use of ajv doesn't leverage the vulnerable `$data` feature
   - Worst-case impact: DoS of local linting process (easily recoverable)

3. **No Fix Available Yet**
   - ESLint 10.0.0 has hardcoded imports for ajv 6.x file paths
   - ajv 8.x has breaking changes (moved/removed `ajv/lib/refs/json-schema-draft-04.json`)
   - npm override to force ajv 8.18.0+ breaks ESLint with module resolution errors
   - Waiting for ESLint team to migrate to ajv 8.x upstream

4. **Risk Context**
   - False positive in traditional security scanning context
   - npm audit reports "moderate" without considering dev-only scope
   - Real-world attack surface is effectively zero for this use case

#### Mitigation Strategy

- **Current State:** Continue using ajv 6.12.6 via ESLint 10.0.0
- **Monitoring:** Track ESLint releases for ajv 8.x support
  - Watch: https://github.com/eslint/eslint/issues
  - Subscribe to GHSA-2g4f-4pwh-qvx6 updates
- **Future Action:** Apply fix when ESLint updates to support ajv 8.x
- **Review Cadence:** Monthly security audit reviews

#### Attack Scenario (Theoretical)

```javascript
// Malicious ESLint plugin with crafted schema (requires repo access)
{
  "properties": {
    "pattern": {
      "$data": "1/pattern",  // Triggers vulnerable $data feature
      "pattern": "(a+)+$"     // ReDoS regex pattern
    }
  }
}
```

**Note:** This scenario requires:
- Attacker has write access to install malicious ESLint plugins
- Plugin uses `$data` keyword (uncommon in ESLint ecosystem)
- Developer runs `npm run lint` with malicious config
- Impact limited to local development environment DoS

#### Decision Log

- **2026-02-18:** Attempted npm override (`"ajv": ">=8.18.0"`) - **Failed**
  - Caused ESLint to crash with `Cannot find module 'ajv/lib/refs/json-schema-draft-04.json'`
  - ajv 8.x restructured module exports, breaking ESLint's hardcoded imports
  - Reverted override, documented accepted risk instead

---

## Security Best Practices

### Dependencies
- Run `npm audit` monthly and review findings
- Keep production dependencies updated with security patches
- Separate dev dependencies from production (already implemented)
- Use npm lock files to ensure reproducible builds

### Development
- Enable Husky pre-commit hooks for linting and formatting
- Review ESLint warnings during development
- Never commit `.env` files (enforced via `.gitignore`)
- Use environment variables for secrets (never hardcode)

### Production
- JWT secrets rotated regularly
- CORS configured with explicit origins (no wildcards)
- Rate limiting enabled on all API routes
- Helmet.js security headers enforced
- PostgreSQL uses parameterized queries via Drizzle ORM (SQL injection protection)

#### Generating Production Secrets

**JWT Secret Generation:**

Always generate cryptographically secure secrets for production deployments:

```bash
# OpenSSL (Recommended - 64 bytes base64 encoded)
openssl rand -base64 64

# Node.js (Cross-platform)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# PowerShell (Windows)
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Secret Management Requirements:**
- Minimum 32 bytes (256 bits) for JWT secrets
- Store in password managers or secret management systems (never commit to Git)
- Rotate secrets on a regular schedule (recommended: quarterly)
- Use Kubernetes secrets at runtime (encrypted at rest when using etcd encryption)
- Consider external secret operators (e.g., Sealed Secrets, External Secrets Operator) for GitOps workflows

**Deployment with Secrets:**

```bash
# Generate and export secrets
export JWT_SECRET=$(openssl rand -base64 64)
export DB_PASSWORD=$(openssl rand -base64 32)

# Deploy with secrets (never commit these values)
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret="${JWT_SECRET}" \
  --set postgresql.auth.password="${DB_PASSWORD}"
```

---

**Last Updated:** February 18, 2026  
**Next Security Review:** March 18, 2026
