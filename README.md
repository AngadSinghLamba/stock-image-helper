# Stock Image Helper

An AI-powered tool that helps creative teams find stock images faster by converting creative briefs into optimized search queries for multiple stock platforms.

## Overview

Creative teams spend 45-90 minutes per asset search manually trying different keywords on Getty Images, Shutterstock, and other platforms. Stock Image Helper reduces this to 5-10 minutes by:

1. **Analyzing creative briefs** - Extracting subject, mood, lighting, composition, and style
2. **Generating optimized queries** - Platform-specific search terms that work
3. **Providing direct links** - One-click access to pre-filtered search results

## Features

- **Multi-platform support**: Getty Images, Shutterstock, Adobe Stock, Unsplash, Pexels
- **Multiple LLM providers**: Choose between OpenAI GPT-4, Claude, or Gemini
- **Conversation memory**: Refine queries in natural conversation
- **Search history**: Save and revisit past searches
- **Favorites**: Bookmark useful queries for reuse
- **Multiple output views**: Cards, table, or raw JSON
- **Dark mode**: Toggle between light and dark themes
- **Responsive design**: Works on desktop and mobile

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Azure Functions (Python) |
| Database | Azure Cosmos DB |
| Auth | Azure AD B2C |
| LLM Framework | LangChain |
| Hosting | Azure Static Web Apps |

## Documentation

- [01-PRD.md](docs/01-PRD.md) - Product Requirements Document
- [02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md) - System Architecture
- [03-DESIGN.md](docs/03-DESIGN.md) - UI/UX Design
- [04-TECH-STACK.md](docs/04-TECH-STACK.md) - Technology Decisions
- [05-IMPLEMENTATION-PLAN.md](docs/05-IMPLEMENTATION-PLAN.md) - Step-by-Step Build Guide

## Quick Start

See [05-IMPLEMENTATION-PLAN.md](docs/05-IMPLEMENTATION-PLAN.md) for detailed setup instructions.

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/stock-image-helper.git
cd stock-image-helper

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run locally
npm run dev
```

## Project Status

**Phase 1** - Lightweight Search Assistant (Current)
- Brief interpretation and query generation
- Direct links to stock platform search pages
- User authentication and history

**Phase 2** - API Integration (Future)
- Direct API access to stock platforms
- Image thumbnails in the app
- Advanced filtering and ranking

## License

Proprietary - WPP Internal Tool

## Contact

- **Project Owner**: Bharat Rama
- **Developer**: Angad Lamba
- **Requestor**: Daniel Saenz Lopez (VML)
