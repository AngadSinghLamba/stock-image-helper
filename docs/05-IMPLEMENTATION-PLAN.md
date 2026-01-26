# Implementation Plan

## Stock Image Helper - Step-by-Step Build Guide

**Version**: 1.0  
**Date**: January 26, 2026  
**Author**: Angad Lamba

---

## Table of Contents

1. [Phase A: Account Setup](#phase-a-account-setup)
2. [Phase B: Azure Resources](#phase-b-azure-resources)
3. [Phase C: Local Development Setup](#phase-c-local-development-setup)
4. [Phase D: Backend Development](#phase-d-backend-development)
5. [Phase E: Frontend Development](#phase-e-frontend-development)
6. [Phase F: Integration](#phase-f-integration)
7. [Phase G: Deployment](#phase-g-deployment)
8. [Phase H: Testing & Launch](#phase-h-testing--launch)

---

## Phase A: Account Setup

### Step A1: Create GitHub Account (if needed)

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Follow the registration process
4. Verify your email

### Step A2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `stock-image-helper`
3. Description: "AI-powered stock image search assistant"
4. Visibility: Private (or Public)
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"
7. Copy the repository URL

```
✅ CHECKPOINT A2
Save this: https://github.com/YOUR_USERNAME/stock-image-helper.git
```

### Step A3: Create Azure Account

1. Go to [azure.microsoft.com/free](https://azure.microsoft.com/free)
2. Click "Start free"
3. Sign in with Microsoft account (or create one)
4. Complete verification (phone + credit card for verification only)
5. You get $200 free credit for 30 days

```
✅ CHECKPOINT A3
You should now have access to Azure Portal: portal.azure.com
```

### Step A4: Create OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Click "Sign up"
3. Create account with email or Google
4. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
5. Click "Create new secret key"
6. Name: `stock-image-helper`
7. Copy the key immediately (you won't see it again!)

```
💰 COST NOTE: OpenAI requires adding payment method
   • Minimum: $5 to start
   • Set spending limit in Settings → Limits
   • Estimated usage: $0.01-0.02 per query
```

```
✅ CHECKPOINT A4
Save securely: OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step A5: Create Anthropic Account

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Click "Sign up"
3. Create account with email
4. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
5. Click "Create Key"
6. Name: `stock-image-helper`
7. Copy the key

```
💰 COST NOTE: Anthropic requires adding payment method
   • Similar pricing to OpenAI
   • Used as fallback, so lower usage expected
```

```
✅ CHECKPOINT A5
Save securely: ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

### Step A6: Create Google AI Account

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google account
3. Click "Get API key" in the left sidebar
4. Click "Create API key"
5. Select "Create API key in new project"
6. Copy the key

```
💰 COST NOTE: Google AI has a generous free tier
   • Used as secondary fallback
```

```
✅ CHECKPOINT A6
Save securely: GOOGLE_AI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxx
```

### Step A7: Summary - All API Keys

```
┌─────────────────────────────────────────────────────────────┐
│  You should now have these saved securely:                  │
│                                                             │
│  □ GitHub Repository URL                                    │
│  □ Azure Account (portal.azure.com access)                  │
│  □ OPENAI_API_KEY=sk-xxxxxxxx                              │
│  □ ANTHROPIC_API_KEY=sk-ant-xxxxxxxx                       │
│  □ GOOGLE_AI_API_KEY=AIzaxxxxxxxx                          │
│                                                             │
│  ⚠️  Store these in a password manager!                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase B: Azure Resources

### Step B1: Create Resource Group

1. Go to [portal.azure.com](https://portal.azure.com)
2. Search for "Resource groups" in the top search bar
3. Click "Create"
4. Subscription: Your subscription
5. Resource group name: `stock-image-helper-rg`
6. Region: `East US` (or closest to your users)
7. Click "Review + create" → "Create"

```
✅ CHECKPOINT B1
Resource group created: stock-image-helper-rg
```

### Step B2: Create Azure Cosmos DB

1. In Azure Portal, search for "Azure Cosmos DB"
2. Click "Create"
3. Select "Azure Cosmos DB for NoSQL"
4. Click "Create"
5. Fill in:
   - Subscription: Your subscription
   - Resource Group: `stock-image-helper-rg`
   - Account Name: `stockimagehelper-db` (must be globally unique, add random numbers if taken)
   - Location: Same as resource group
   - Capacity mode: **Serverless** (important for free tier!)
6. Click "Review + create" → "Create"
7. Wait for deployment (2-3 minutes)

**After creation:**
1. Go to the Cosmos DB resource
2. Click "Keys" in left sidebar
3. Copy "PRIMARY CONNECTION STRING"

```
✅ CHECKPOINT B2
Save: COSMOS_CONNECTION_STRING=AccountEndpoint=https://...
```

### Step B3: Create Cosmos DB Database and Containers

1. In your Cosmos DB resource, click "Data Explorer"
2. Click "New Database"
   - Database id: `stockimagehelper`
   - Click "OK"
3. Click "New Container" (under the database)
   - Database id: `stockimagehelper` (existing)
   - Container id: `users`
   - Partition key: `/id`
   - Click "OK"
4. Repeat for `search_history`:
   - Container id: `search_history`
   - Partition key: `/user_id`
5. Repeat for `favorites`:
   - Container id: `favorites`
   - Partition key: `/user_id`

```
✅ CHECKPOINT B3
Database: stockimagehelper
Containers: users, search_history, favorites
```

### Step B4: Create Azure AD B2C Tenant

1. In Azure Portal, search for "Azure AD B2C"
2. Click "Create a new Azure AD B2C Tenant"
3. Select "Create a new Azure AD B2C Tenant"
4. Fill in:
   - Organization name: `Stock Image Helper`
   - Initial domain name: `stockimagehelperauth` (must be unique)
   - Country/Region: United States
   - Subscription: Your subscription
   - Resource group: `stock-image-helper-rg`
5. Click "Review + create" → "Create"
6. Wait for deployment (3-5 minutes)

```
✅ CHECKPOINT B4
B2C Tenant: stockimagehelperauth.onmicrosoft.com
```

### Step B5: Configure Azure AD B2C

**Switch to B2C Tenant:**
1. Click your profile icon (top right)
2. Click "Switch directory"
3. Select `stockimagehelperauth.onmicrosoft.com`

**Register Application:**
1. In B2C, go to "App registrations"
2. Click "New registration"
3. Name: `Stock Image Helper App`
4. Supported account types: "Accounts in any identity provider..."
5. Redirect URI:
   - Platform: Web
   - URL: `http://localhost:3000/api/auth/callback/azure-ad-b2c` (for dev)
6. Click "Register"
7. Copy "Application (client) ID"

**Create Client Secret:**
1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Description: `app-secret`
4. Expires: 24 months
5. Click "Add"
6. Copy the "Value" immediately!

```
✅ CHECKPOINT B5
Save:
AZURE_AD_B2C_TENANT_NAME=stockimagehelperauth
AZURE_AD_B2C_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_B2C_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step B6: Create User Flows

1. In B2C, go to "User flows"
2. Click "New user flow"

**Sign up and sign in flow:**
1. Select "Sign up and sign in"
2. Version: Recommended
3. Name: `susi` (will become `B2C_1_susi`)
4. Identity providers: Select "Email signup"
5. User attributes: Select "Display Name", "Email Address"
6. Click "Create"

**Password reset flow:**
1. Click "New user flow"
2. Select "Password reset"
3. Version: Recommended
4. Name: `password_reset`
5. Click "Create"

```
✅ CHECKPOINT B6
User flows created:
- B2C_1_susi (sign up/sign in)
- B2C_1_password_reset
```

### Step B7: Configure Social Identity Providers (Optional)

**Google:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project or select existing
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Authorized redirect URI: `https://stockimagehelperauth.b2clogin.com/stockimagehelperauth.onmicrosoft.com/oauth2/authresp`
6. Copy Client ID and Secret
7. In Azure AD B2C → Identity providers → Add Google
8. Paste Client ID and Secret

**Microsoft:**
1. Follow similar process with Microsoft identity

**GitHub:**
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Create new OAuth App
3. Authorization callback URL: Same as Google
4. In Azure AD B2C → Identity providers → Add GitHub

```
✅ CHECKPOINT B7 (Optional)
Social providers configured: Google, Microsoft, GitHub
```

---

## Phase C: Local Development Setup

### Step C1: Install Prerequisites

**Node.js:**
```bash
# Check if installed
node --version  # Should be 18.x or 20.x

# If not installed, download from nodejs.org
# Or use nvm:
nvm install 20
nvm use 20
```

**Python:**
```bash
# Check if installed
python3 --version  # Should be 3.11.x

# If not installed, download from python.org
# Or use pyenv:
pyenv install 3.11
pyenv local 3.11
```

**Azure Functions Core Tools:**
```bash
# macOS
brew tap azure/functions
brew install azure-functions-core-tools@4

# Windows
npm install -g azure-functions-core-tools@4

# Verify
func --version
```

**Azure CLI:**
```bash
# macOS
brew install azure-cli

# Windows
# Download from https://aka.ms/installazurecliwindows

# Verify
az --version

# Login
az login
```

```
✅ CHECKPOINT C1
Installed:
□ Node.js 20.x
□ Python 3.11
□ Azure Functions Core Tools 4.x
□ Azure CLI
```

### Step C2: Clone Repository

```bash
# Navigate to your projects folder
cd ~/Documents

# Clone the repository (if you pushed docs)
git clone https://github.com/YOUR_USERNAME/stock-image-helper.git

# Or initialize new repo with existing docs
cd stock-image-helper
git init
git remote add origin https://github.com/YOUR_USERNAME/stock-image-helper.git
```

### Step C3: Create Environment File

Create `.env.local` in the project root:

```bash
# .env.local

# ===========================================
# Azure Cosmos DB
# ===========================================
COSMOS_CONNECTION_STRING=AccountEndpoint=https://stockimagehelper-db.documents.azure.com:443/;AccountKey=xxxxx

# ===========================================
# Azure AD B2C
# ===========================================
AZURE_AD_B2C_TENANT_NAME=stockimagehelperauth
AZURE_AD_B2C_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_B2C_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AZURE_AD_B2C_PRIMARY_USER_FLOW=B2C_1_susi

# ===========================================
# LLM Providers
# ===========================================
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_AI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===========================================
# App Configuration
# ===========================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-32-char-string-here

# ===========================================
# Feature Flags
# ===========================================
ENABLE_STREAMING=true
DEFAULT_MODEL=gpt-4o
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

```
✅ CHECKPOINT C3
.env.local created with all variables filled in
```

### Step C4: Project Structure Setup

```bash
# Create project structure
mkdir -p frontend/src/{components,pages,styles,lib,hooks}
mkdir -p frontend/public
mkdir -p api/{generate_queries,get_history,save_favorite}

# The structure should look like:
stock-image-helper/
├── docs/
│   ├── 01-PRD.md
│   ├── 02-ARCHITECTURE.md
│   ├── 03-DESIGN.md
│   ├── 04-TECH-STACK.md
│   └── 05-IMPLEMENTATION-PLAN.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── lib/
│   │   └── hooks/
│   └── public/
├── api/
│   ├── generate_queries/
│   ├── get_history/
│   └── save_favorite/
├── .env.local
├── .gitignore
└── README.md
```

---

## Phase D: Backend Development

### Step D1: Initialize Python Environment

```bash
cd api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Create requirements.txt
cat > requirements.txt << 'EOF'
# Azure Functions
azure-functions==1.17.0

# LangChain
langchain==0.1.0
langchain-openai==0.0.5
langchain-anthropic==0.0.1
langchain-google-genai==0.0.5

# Azure
azure-cosmos==4.5.1
azure-identity==1.15.0

# Utilities
pydantic==2.5.0
python-dotenv==1.0.0
EOF

# Install dependencies
pip install -r requirements.txt
```

### Step D2: Create Azure Functions Configuration

```bash
# api/host.json
cat > host.json << 'EOF'
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
EOF

# api/local.settings.json (for local dev - DO NOT COMMIT)
cat > local.settings.json << 'EOF'
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "COSMOS_CONNECTION_STRING": "your-connection-string",
    "OPENAI_API_KEY": "your-key",
    "ANTHROPIC_API_KEY": "your-key",
    "GOOGLE_AI_API_KEY": "your-key"
  }
}
EOF
```

### Step D3: Create Query Generation Function

```bash
# api/generate_queries/__init__.py
cat > generate_queries/__init__.py << 'EOF'
import azure.functions as func
import json
import os
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.runnables import RunnableWithFallbacks

# Pydantic models for structured output
class SearchQuery(BaseModel):
    query: str = Field(description="The search query string")
    platform: str = Field(description="Platform: getty, shutterstock, adobe, unsplash, or pexels")
    url: str = Field(description="Full search URL for the platform")
    reasoning: str = Field(description="Why this query is effective")

class BriefAnalysis(BaseModel):
    subject: str = Field(description="Main subject of the image")
    setting: str = Field(description="Environment or location")
    lighting: str = Field(description="Lighting conditions")
    mood: str = Field(description="Emotional tone or mood")
    composition: str = Field(description="Framing and composition style")
    style: str = Field(description="Visual style")

class GenerateResponse(BaseModel):
    brief_analysis: BriefAnalysis
    queries: List[SearchQuery]

# Platform URL builders
def build_getty_url(query: str) -> str:
    encoded = query.replace(" ", "+")
    return f"https://www.gettyimages.com/search/2/image?phrase={encoded}"

def build_shutterstock_url(query: str) -> str:
    encoded = query.replace(" ", "-")
    return f"https://www.shutterstock.com/search/{encoded}"

def build_adobe_url(query: str) -> str:
    encoded = query.replace(" ", "+")
    return f"https://stock.adobe.com/search?k={encoded}"

def build_unsplash_url(query: str) -> str:
    encoded = query.replace(" ", "-")
    return f"https://unsplash.com/s/photos/{encoded}"

def build_pexels_url(query: str) -> str:
    encoded = query.replace(" ", "-")
    return f"https://www.pexels.com/search/{encoded}"

URL_BUILDERS = {
    "getty": build_getty_url,
    "shutterstock": build_shutterstock_url,
    "adobe": build_adobe_url,
    "unsplash": build_unsplash_url,
    "pexels": build_pexels_url
}

# Initialize LLMs
def get_llm(model: str):
    if model.startswith("gpt"):
        return ChatOpenAI(model=model, api_key=os.getenv("OPENAI_API_KEY"))
    elif model.startswith("claude"):
        return ChatAnthropic(model=model, api_key=os.getenv("ANTHROPIC_API_KEY"))
    elif model.startswith("gemini"):
        return ChatGoogleGenerativeAI(model=model, api_key=os.getenv("GOOGLE_AI_API_KEY"))
    else:
        return ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

def get_llm_with_fallback(primary_model: str):
    primary = get_llm(primary_model)
    fallback1 = ChatAnthropic(model="claude-3-5-sonnet-20241022", api_key=os.getenv("ANTHROPIC_API_KEY"))
    fallback2 = ChatGoogleGenerativeAI(model="gemini-1.5-pro", api_key=os.getenv("GOOGLE_AI_API_KEY"))
    return primary.with_fallbacks([fallback1, fallback2])

# System prompt
SYSTEM_PROMPT = """You are an expert at finding stock images. Given a creative brief, you:
1. Analyze the brief to extract key visual elements
2. Generate optimized search queries for stock image platforms

For each platform, generate 2-3 queries that use platform-specific best practices:
- Getty Images: Use descriptive terms, "editorial" for real-world shots
- Shutterstock: Shorter, focused queries work better
- Adobe Stock: Similar to Getty, supports detailed queries
- Unsplash: Simple, mood-based queries
- Pexels: Similar to Unsplash

Always respond in the exact JSON format specified."""

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Parse request
        req_body = req.get_json()
        brief = req_body.get("brief", "")
        model = req_body.get("model", "gpt-4o")
        platforms = req_body.get("platforms", ["getty", "shutterstock"])
        
        if not brief:
            return func.HttpResponse(
                json.dumps({"error": "Brief is required"}),
                status_code=400,
                mimetype="application/json"
            )
        
        # Setup parser
        parser = PydanticOutputParser(pydantic_object=GenerateResponse)
        
        # Setup prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", """Creative Brief: {brief}

Platforms to generate queries for: {platforms}

{format_instructions}""")
        ])
        
        # Get LLM with fallback
        llm = get_llm_with_fallback(model)
        
        # Create chain
        chain = prompt | llm | parser
        
        # Execute
        result = chain.invoke({
            "brief": brief,
            "platforms": ", ".join(platforms),
            "format_instructions": parser.get_format_instructions()
        })
        
        # Add URLs to queries
        for query in result.queries:
            if query.platform in URL_BUILDERS:
                query.url = URL_BUILDERS[query.platform](query.query)
        
        return func.HttpResponse(
            result.model_dump_json(),
            mimetype="application/json"
        )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
EOF

# api/generate_queries/function.json
cat > generate_queries/function.json << 'EOF'
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "generate"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
EOF
```

### Step D4: Test Backend Locally

```bash
cd api
source venv/bin/activate

# Start Azure Functions locally
func start

# In another terminal, test the endpoint:
curl -X POST http://localhost:7071/api/generate \
  -H "Content-Type: application/json" \
  -d '{"brief": "Ford truck in mountains, sunrise, cinematic", "platforms": ["getty", "shutterstock"]}'
```

```
✅ CHECKPOINT D4
Backend returns JSON with brief_analysis and queries
```

---

## Phase E: Frontend Development

### Step E1: Initialize Next.js Project

```bash
cd frontend

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install @azure/msal-browser @azure/msal-react
npm install lucide-react clsx tailwind-merge
npm install react-hot-toast
```

### Step E2: Configure Tailwind

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        getty: "#FF0000",
        shutterstock: "#EE2B24",
        adobe: "#FF0000",
        unsplash: "#000000",
        pexels: "#05A081",
      },
    },
  },
  plugins: [],
}
export default config
```

### Step E3: Create Core Components

(See 03-DESIGN.md for detailed component specifications)

Key components to build:
1. `BriefInput.tsx` - Text area for entering briefs
2. `ModelSelector.tsx` - LLM selection dropdown
3. `ResultCard.tsx` - Individual query result
4. `ResultsList.tsx` - List of results grouped by platform
5. `ViewToggle.tsx` - Cards/Table/JSON toggle
6. `ThemeToggle.tsx` - Light/dark mode switch

### Step E4: Create Pages

1. `app/page.tsx` - Login page
2. `app/search/page.tsx` - Main search interface
3. `app/history/page.tsx` - Search history
4. `app/settings/page.tsx` - User settings

---

## Phase F: Integration

### Step F1: Configure Azure Static Web Apps

Create `staticwebapp.config.json` in project root:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "platform": {
    "apiRuntime": "python:3.11"
  }
}
```

### Step F2: Connect Frontend to Backend

Create API client in `frontend/src/lib/api.ts`:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function generateQueries(
  brief: string,
  model: string,
  platforms: string[]
) {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ brief, model, platforms }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate queries');
  }
  
  return response.json();
}
```

---

## Phase G: Deployment

### Step G1: Create Azure Static Web App

1. Go to Azure Portal
2. Search "Static Web Apps"
3. Click "Create"
4. Fill in:
   - Subscription: Your subscription
   - Resource group: `stock-image-helper-rg`
   - Name: `stock-image-helper-app`
   - Plan type: Free
   - Region: Close to your users
   - Source: GitHub
   - Sign in to GitHub and authorize
   - Organization: Your username
   - Repository: `stock-image-helper`
   - Branch: `main`
   - Build Presets: Custom
   - App location: `/frontend`
   - API location: `/api`
   - Output location: `.next`
5. Click "Review + create" → "Create"

Azure will automatically:
- Create a GitHub Action in your repo
- Deploy on every push to main

### Step G2: Configure Environment Variables

1. In Azure Static Web App resource
2. Go to "Configuration"
3. Add all environment variables from `.env.local`:
   - `COSMOS_CONNECTION_STRING`
   - `AZURE_AD_B2C_TENANT_NAME`
   - `AZURE_AD_B2C_CLIENT_ID`
   - `AZURE_AD_B2C_CLIENT_SECRET`
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_AI_API_KEY`
   - etc.

### Step G3: Configure Custom Domain (Optional)

1. In Static Web App → "Custom domains"
2. Click "Add"
3. Enter your domain (e.g., `stockimagehelper.com`)
4. Add CNAME record to your DNS
5. Azure provides free SSL certificate

---

## Phase H: Testing & Launch

### Step H1: Test Checklist

```
□ Authentication
  □ Can sign up with email
  □ Can sign up with Google
  □ Can sign in
  □ Can sign out
  □ Password reset works

□ Query Generation
  □ Brief input accepts text
  □ Model selector works
  □ Generate button triggers API
  □ Results display correctly
  □ Copy button works
  □ Open in platform works
  □ Favorites button works

□ History
  □ Searches are saved
  □ History page loads
  □ Can view past search
  □ Can delete history item

□ Settings
  □ Theme toggle works
  □ Default model saves
  □ Default platforms save

□ Responsive
  □ Works on mobile
  □ Works on tablet
  □ Works on desktop

□ Dark Mode
  □ Toggle works
  □ All components styled correctly
```

### Step H2: User Acceptance Testing

1. Share staging URL with Daniel Saenz Lopez
2. Provide test account credentials
3. Gather feedback on:
   - Query quality
   - UI/UX
   - Missing features
   - Bugs

### Step H3: Launch

1. Merge final changes to `main`
2. Verify deployment succeeds
3. Test production URL
4. Share with initial users
5. Monitor Azure Application Insights

---

## Appendix A: Troubleshooting

### Common Issues

**"CORS error when calling API"**
- Check `staticwebapp.config.json` has correct routes
- Verify API is deployed correctly

**"Authentication redirect fails"**
- Verify redirect URIs in Azure AD B2C
- Check NEXTAUTH_URL matches deployment URL

**"LLM returns error"**
- Check API keys are set in Azure configuration
- Verify billing is set up on LLM provider accounts

**"Cosmos DB connection fails"**
- Verify connection string is correct
- Check firewall rules allow Azure services

---

## Appendix B: Useful Commands

```bash
# Run frontend locally
cd frontend && npm run dev

# Run backend locally
cd api && func start

# Deploy manually (usually automatic via GitHub)
az staticwebapp deploy

# View logs
az staticwebapp show --name stock-image-helper-app

# Test API endpoint
curl -X POST https://your-app.azurestaticapps.net/api/generate \
  -H "Content-Type: application/json" \
  -d '{"brief": "test", "platforms": ["getty"]}'
```

---

## Appendix C: Cost Monitoring

Set up budget alerts in Azure:
1. Go to Cost Management + Billing
2. Click "Budgets"
3. Create budget: $10/month alert
4. Get email when 80% reached

Monitor LLM costs:
- OpenAI: platform.openai.com/usage
- Anthropic: console.anthropic.com/settings/usage
- Google: console.cloud.google.com/billing
