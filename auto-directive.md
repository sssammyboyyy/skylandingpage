# Auto-Directive: GitHub-to-Vercel CI/CD Pipeline

## Core Architecture
For all agency client applications, specifically those utilizing the `ui-master` package within the `agency-master-monorepo` structure, all deployments to Vercel MUST be executed exclusively via GitHub synchronization. Direct Vercel CLI deployments (`npx vercel`) are STRICTLY FORBIDDEN to ensure source-of-truth alignment.

## Execution Flow
1. **Develop Locally:** All frontend changes (Audit & Proposal React Apps) are built and validated locally (`npm run build`).
2. **Push to GitHub:** Code is staged, committed, and pushed to the `main` branch of the designated repository.
3. **Auto-Deploy:** Vercel's automated GitHub integration detects the push and initiates the build pipeline using the environment configuration defined in the Vercel dashboard.

## NotebookLM Integration
Before finalizing any architecture or executing massive refactors, agents must consult the active NotebookLM research context. 
- Use `notebooklm source add-research` to fill any structural gaps.
- Spawning a background subagent to monitor the `prompt-enhancer` notebook and auto-extract architectural updates is highly recommended.

## Constraints
- **Pricing Strategy:** MRR structures and upfront website costs are directly encoded into the specific client's `client-context.json`. No external database (Neo4j) sync is required unless explicitly approved.
- **Client Handoff:** Client presentations are conducted via live video share; no automated WhatsApp or email template generation is required for the final proposal handoff.
