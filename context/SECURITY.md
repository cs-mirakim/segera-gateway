# SECURITY.md - JANGAN PUSH .env

Threats for public no-login:
- Overpass SSRF - validate bbox not internal IP
- ORS key leak - call from server only, never client
- Spam - Upstash rate limit 10/min/IP

Checklist before git push (all 4 members):
1. git status - ensure .env not listed
2. If .env listed, check .gitignore has .env*
3. Never hardcode GEMINI_API_KEY in client component - use server action.

Audit command: Run prompt security yang Amir Hakim bagi di Cursor/Antigravity after each API route done.
