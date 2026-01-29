# Backend Implementation Guide

## Stock Image Helper - What We Built

**Version**: 1.0  
**Date**: January 28, 2026  
**Phase**: C + D (Local Development Setup + Backend Development)

---

## 1. Overview

After completing the mockups, we implemented the **Python backend API** that powers the core AI functionality. This backend takes creative briefs and generates optimized search queries for stock image platforms.

```
                    ┌─────────────────────────────┐
   User Brief  ──▶  │   /api/generate endpoint    │  ──▶  Search Queries + URLs
                    │   (Azure Functions + Python) │
                    └─────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
              ┌──────────┐               ┌──────────────┐
              │ LangChain │               │  URL Builders │
              │  + LLMs   │               │  (5 platforms)│
              └──────────┘               └──────────────┘
```

---

## 2. Project Structure

```
stock-image-helper/
├── api/                          # Backend API (Python)
│   ├── function_app.py           # Main Azure Functions app
│   ├── host.json                 # Azure Functions config
│   ├── local.settings.json       # Local dev settings (gitignored)
│   ├── local.settings.json.example
│   ├── requirements.txt          # Python dependencies
│   ├── test_generate.py          # Test script
│   └── shared/                   # Shared modules
│       ├── __init__.py
│       ├── llm_service.py        # LangChain + LLM logic
│       ├── models.py             # Pydantic data models
│       └── url_builders.py       # Platform URL generators
├── frontend/                     # Frontend (Next.js) - TO BE BUILT
├── docs/                         # Documentation
├── mockups/                      # HTML mockups
├── .env.local                    # API keys (gitignored)
└── .env.example                  # API keys template
```

---

## 3. Files We Created

### 3.1 `api/requirements.txt`

**Purpose:** Lists all Python dependencies needed for the backend.

```txt
# Azure Functions
azure-functions>=1.17.0

# LangChain Core
langchain>=0.1.0
langchain-openai>=0.0.5
langchain-anthropic>=0.1.1
langchain-google-genai>=0.0.5

# Data Validation
pydantic>=2.5.0

# Utilities
python-dotenv>=1.0.0
```

| Package | Why We Need It |
|---------|----------------|
| `azure-functions` | Framework for Azure serverless functions |
| `langchain` | Orchestrates LLM calls with memory & fallback |
| `langchain-openai` | OpenAI GPT models integration |
| `langchain-anthropic` | Claude models integration |
| `langchain-google-genai` | Google Gemini integration |
| `pydantic` | Validates request/response data structure |
| `python-dotenv` | Loads API keys from `.env.local` |

---

### 3.2 `api/host.json`

**Purpose:** Azure Functions configuration file.

```json
{
  "version": "2.0",
  "extensions": {
    "http": {
      "routePrefix": "api"
    }
  }
}
```

- Sets runtime version to 2.0
- Configures all HTTP routes to start with `/api`

---

### 3.3 `api/local.settings.json.example`

**Purpose:** Template showing required environment variables.

The actual `local.settings.json` with real API keys is gitignored for security.

---

### 3.4 `api/function_app.py`

**Purpose:** The main Azure Functions app with HTTP endpoints.

**Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Takes a creative brief, returns search queries |
| `/api/health` | GET | Health check, shows configured API keys |

**Request Example:**
```json
{
  "brief": "Ford truck in mountains, sunrise, cinematic",
  "model": "gpt-4o",
  "platforms": ["getty", "shutterstock"]
}
```

**Response Example:**
```json
{
  "brief_analysis": {
    "subject": "Ford truck",
    "setting": "Mountains",
    "lighting": "Sunrise",
    "mood": "Adventurous",
    "composition": "Wide shot, cinematic",
    "style": "Cinematic"
  },
  "queries": [
    {
      "query": "Ford truck sunrise mountain landscape",
      "platform": "getty",
      "url": "https://www.gettyimages.com/search/...",
      "reasoning": "Combines main subject with setting and lighting"
    }
  ],
  "model_used": "gemini-2.0-flash"
}
```

---

### 3.5 `api/shared/models.py`

**Purpose:** Pydantic models for type safety and validation.

**Models Defined:**

| Model | Purpose |
|-------|---------|
| `GenerateRequest` | Validates incoming API requests |
| `GenerateResponse` | Structures the API response |
| `BriefAnalysis` | Breakdown of visual elements (subject, setting, lighting, mood, composition, style) |
| `SearchQuery` | Individual query with platform, URL, and reasoning |

---

### 3.6 `api/shared/url_builders.py`

**Purpose:** Constructs valid search URLs for each stock platform.

**Platforms Supported:**

| Platform | URL Pattern | Example |
|----------|-------------|---------|
| Getty Images | `gettyimages.com/search/2/image?phrase=...` | `?phrase=Ford+truck+sunrise` |
| Shutterstock | `shutterstock.com/search/...` | `/search/ford-truck-sunrise` |
| Adobe Stock | `stock.adobe.com/search?k=...` | `?k=Ford+truck+sunrise` |
| Unsplash | `unsplash.com/s/photos/...` | `/s/photos/ford-truck-sunrise` |
| Pexels | `pexels.com/search/...` | `/search/ford-truck-sunrise/` |

---

### 3.7 `api/shared/llm_service.py`

**Purpose:** The core AI logic using LangChain. This is the brain of the application.

**Key Features:**

1. **Multi-LLM Support**
   - OpenAI (GPT-4o, GPT-4o-mini)
   - Anthropic (Claude 3.5 Sonnet)
   - Google (Gemini 2.0 Flash)

2. **Automatic Fallback Chain**
   ```
   Primary (GPT-4o)
        │
        └── Failed? ──▶ Claude 3.5 Sonnet
                              │
                              └── Failed? ──▶ Gemini 2.0 Flash
                                                    │
                                                    └── Failed? ──▶ GPT-4o-mini
   ```

3. **Structured Output**
   - Uses Pydantic to ensure valid JSON
   - Retries if output parsing fails

4. **System Prompt**
   - Instructs the LLM to act as a stock image search expert
   - Includes platform-specific tips for better queries

---

### 3.8 `api/test_generate.py`

**Purpose:** Test script to verify the LLM integration works.

**What It Tests:**
1. Loads environment variables from `.env.local`
2. Checks which API keys are configured
3. Sends a sample brief to the LLM
4. Displays the generated queries and URLs

**How to Run:**
```bash
cd api
source venv/bin/activate
python test_generate.py
```

---

## 4. Data Flow

When the API receives a request:

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: User Input                                             │
│  "Ford truck in mountains, sunrise, cinematic adventure feel"   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: API Receives Request                                   │
│  POST /api/generate with brief, model, platforms                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: LangChain Builds Prompt                                │
│  System prompt + user brief + format instructions               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: LLM Generates Response                                 │
│  Tries primary model, falls back if needed                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Pydantic Validates Output                              │
│  Ensures JSON matches expected structure                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 6: URL Builders Add Links                                 │
│  Constructs clickable URLs for each platform                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 7: Return Response                                        │
│  Brief analysis + 6 queries with URLs                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Environment Setup

### Required API Keys

Create `.env.local` in the project root:

```bash
# LLM Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
DEFAULT_MODEL=gpt-4o
```

### Running Locally

```bash
# 1. Navigate to API folder
cd api

# 2. Activate virtual environment
source venv/bin/activate

# 3. Test the LLM integration
python test_generate.py

# 4. Start the Azure Functions server
func start
```

The API will be available at `http://localhost:7071/api/generate`

---

## 6. What's Next

**Phase E: Frontend Development**

- Initialize Next.js with Tailwind CSS
- Build UI components from mockups
- Connect to `/api/generate` endpoint
- Add user authentication
- Implement search history

---

## 7. Key Learnings

1. **LangChain Import Changes**: The newer LangChain versions moved modules to `langchain_core` (e.g., `langchain_core.prompts` instead of `langchain.prompts`)

2. **Google AI Model Names**: Google Gemini models use names like `gemini-2.0-flash`, not `gemini-pro` or `gemini-1.5-pro`

3. **API Key Validation**: Each provider has different key formats:
   - OpenAI: `sk-...`
   - Anthropic: `sk-ant-...`
   - Google AI: `AIza...`

4. **Fallback Strategy**: Having multiple LLM providers ensures the app works even if one provider has issues
