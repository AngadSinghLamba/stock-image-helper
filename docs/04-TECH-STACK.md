# Technology Stack Document

## Stock Image Helper - Technology Decisions

**Version**: 1.0  
**Date**: January 26, 2026  
**Author**: Angad Lamba

---

## 1. Technology Overview

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js | 14.x |
| **Styling** | Tailwind CSS | 3.x |
| **Backend** | Azure Functions (Python) | Python 3.11 |
| **LLM Framework** | LangChain | 0.1.x |
| **Database** | Azure Cosmos DB | - |
| **Authentication** | Azure AD B2C | - |
| **Hosting** | Azure Static Web Apps | - |

---

## 2. Frontend

### 2.1 Next.js

**Version**: 14.x (App Router)

**Why Next.js?**
| Reason | Benefit |
|--------|---------|
| React-based | Large ecosystem, familiar to most developers |
| App Router | Modern routing with layouts |
| API Routes | Can host simple API endpoints |
| SSR/SSG | SEO-friendly, fast initial load |
| TypeScript | Type safety built-in |
| Vercel/Azure | Easy deployment |

**Alternatives Considered**:
| Alternative | Why Not Chosen |
|-------------|----------------|
| React (CRA) | No SSR, manual routing setup |
| Vue.js | Smaller ecosystem, team more familiar with React |
| Remix | Newer, less community support |

### 2.2 Tailwind CSS

**Version**: 3.x

**Why Tailwind?**
| Reason | Benefit |
|--------|---------|
| Utility-first | Fast development, consistent styling |
| Dark mode | Built-in dark mode support |
| Responsive | Mobile-first responsive utilities |
| Customizable | Easy to match brand colors |
| Small bundle | Purges unused CSS |

**Alternatives Considered**:
| Alternative | Why Not Chosen |
|-------------|----------------|
| CSS Modules | More boilerplate |
| Styled Components | Runtime overhead |
| Material UI | Opinionated design, harder to customize |

### 2.3 Additional Frontend Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| `next-auth` | (Optional) If not using Azure AD B2C directly | 4.x |
| `@azure/msal-react` | Azure AD B2C authentication | 1.x |
| `react-hot-toast` | Toast notifications | 2.x |
| `lucide-react` | Icons | Latest |
| `clsx` | Conditional class names | Latest |
| `tailwind-merge` | Merge Tailwind classes | Latest |

---

## 3. Backend

### 3.1 Azure Functions (Python)

**Runtime**: Python 3.11

**Why Azure Functions?**
| Reason | Benefit |
|--------|---------|
| Serverless | Pay only for execution |
| Auto-scaling | Handles traffic spikes |
| Azure-native | Easy integration with Cosmos DB |
| Python support | Best for LangChain |
| Free tier | 1M executions/month free |

**Alternatives Considered**:
| Alternative | Why Not Chosen |
|-------------|----------------|
| AWS Lambda | Not Azure-native |
| Google Cloud Functions | Not Azure-native |
| Node.js Functions | LangChain better in Python |
| Azure App Service | More expensive for this use case |

### 3.2 LangChain

**Version**: 0.1.x

**Why LangChain?**
| Reason | Benefit |
|--------|---------|
| Multi-LLM support | Easy to switch between OpenAI, Claude, Gemini |
| Conversation memory | Session-based context |
| Fallback chains | Automatic retry with different LLM |
| Structured output | Pydantic validation |
| Streaming | Real-time responses |

**LangChain Components Used**:
| Component | Purpose |
|-----------|---------|
| `ChatOpenAI` | OpenAI GPT models |
| `ChatAnthropic` | Claude models |
| `ChatGoogleGenerativeAI` | Gemini models |
| `ConversationBufferMemory` | Session memory |
| `PydanticOutputParser` | JSON validation |
| `RunnableWithFallbacks` | Fallback chain |

### 3.3 Python Dependencies

```txt
# requirements.txt

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
```

---

## 4. Database

### 4.1 Azure Cosmos DB

**API**: NoSQL (Core SQL API)

**Why Cosmos DB?**
| Reason | Benefit |
|--------|---------|
| Azure-native | Same ecosystem |
| Free tier | 1000 RU/s, 25 GB free |
| Flexible schema | JSON documents, easy to evolve |
| Global distribution | Low latency (if needed later) |
| Automatic indexing | Fast queries |

**Alternatives Considered**:
| Alternative | Why Not Chosen |
|-------------|----------------|
| PostgreSQL | More setup, SQL not needed |
| MongoDB | Not Azure-native |
| Firebase | Different cloud provider |
| Supabase | Different cloud provider |

### 4.2 Database Design

**Database**: `stockimagehelper`

**Containers**:

| Container | Partition Key | Purpose |
|-----------|---------------|---------|
| `users` | `/id` | User profiles |
| `search_history` | `/user_id` | Search history |
| `favorites` | `/user_id` | Favorited queries |

**RU Budget**:
| Operation | Estimated RU |
|-----------|--------------|
| Read user | 1 RU |
| Write search | 5 RU |
| List history (10 items) | 10 RU |
| Total per query generation | ~20 RU |

---

## 5. Authentication

### 5.1 Azure AD B2C

**Why Azure AD B2C?**
| Reason | Benefit |
|--------|---------|
| Azure-native | Single ecosystem |
| Enterprise-ready | SOC 2, GDPR compliant |
| Social logins | Google, Microsoft, GitHub |
| Customizable | Custom UI possible |
| 50K MAU free | Generous free tier |

**Alternatives Considered**:
| Alternative | Why Not Chosen |
|-------------|----------------|
| Auth0 | More expensive at scale |
| Clerk | Not Azure-native |
| NextAuth.js | Less enterprise features |
| Firebase Auth | Different cloud provider |

### 5.2 Identity Providers

| Provider | Status |
|----------|--------|
| Email/Password | Enabled |
| Google | Enabled |
| Microsoft | Enabled |
| GitHub | Enabled |

### 5.3 User Flows

| Flow | Description |
|------|-------------|
| `B2C_1_signup` | Sign up with email or social |
| `B2C_1_signin` | Sign in with email or social |
| `B2C_1_password_reset` | Reset password via email |

---

## 6. LLM Providers

### 6.1 OpenAI

**Models Available**:
| Model | Use Case | Cost (input/output per 1M tokens) |
|-------|----------|-----------------------------------|
| `gpt-4o` | Best quality | $2.50 / $10.00 |
| `gpt-4o-mini` | Fast, affordable | $0.15 / $0.60 |
| `gpt-3.5-turbo` | Legacy, cheapest | $0.50 / $1.50 |

**API**: `https://api.openai.com/v1`

### 6.2 Anthropic (Claude)

**Models Available**:
| Model | Use Case | Cost (input/output per 1M tokens) |
|-------|----------|-----------------------------------|
| `claude-3-5-sonnet` | Best balance | $3.00 / $15.00 |
| `claude-3-haiku` | Fast, cheap | $0.25 / $1.25 |

**API**: `https://api.anthropic.com`

### 6.3 Google (Gemini)

**Models Available**:
| Model | Use Case | Cost (input/output per 1M tokens) |
|-------|----------|-----------------------------------|
| `gemini-1.5-pro` | Best quality | $1.25 / $5.00 |
| `gemini-1.5-flash` | Fast, cheap | $0.075 / $0.30 |

**API**: `https://generativelanguage.googleapis.com`

### 6.4 Fallback Order

```
1. User's selected model (default: GPT-4o)
         │
         └── Failed? ──▶ Claude 3.5 Sonnet
                              │
                              └── Failed? ──▶ Gemini 1.5 Pro
                                                   │
                                                   └── Failed? ──▶ Error
```

---

## 7. Hosting

### 7.1 Azure Static Web Apps

**Why Azure Static Web Apps?**
| Reason | Benefit |
|--------|---------|
| All-in-one | Frontend + API in one service |
| Free tier | 100 GB bandwidth, unlimited builds |
| GitHub integration | Auto-deploy on push |
| Custom domains | Free SSL certificates |
| Global CDN | Fast delivery worldwide |

### 7.2 Resource Configuration

| Resource | Tier | Monthly Cost |
|----------|------|--------------|
| Static Web Apps | Free | $0 |
| Azure Functions | Consumption | $0 (within free tier) |
| Cosmos DB | Serverless | $0 (within free tier) |
| Azure AD B2C | Free | $0 (first 50K MAU) |
| **Total** | | **$0** (for MVP) |

---

## 8. Development Tools

### 8.1 Local Development

| Tool | Purpose |
|------|---------|
| VS Code / Cursor | IDE |
| Node.js 20.x | Frontend runtime |
| Python 3.11 | Backend runtime |
| Azure Functions Core Tools | Local function testing |
| Azure Cosmos DB Emulator | Local database |

### 8.2 Code Quality

| Tool | Purpose |
|------|---------|
| ESLint | JavaScript linting |
| Prettier | Code formatting |
| Black | Python formatting |
| Ruff | Python linting |
| TypeScript | Type checking |

### 8.3 Testing

| Tool | Purpose |
|------|---------|
| Jest | Frontend unit tests |
| React Testing Library | Component tests |
| pytest | Python unit tests |
| Playwright | E2E tests (optional) |

---

## 9. CI/CD

### 9.1 GitHub Actions

**Workflow**:
```yaml
# .github/workflows/azure-static-web-apps.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Build and Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          app_location: "/"
          api_location: "api"
          output_location: ".next"
```

---

## 10. Security

### 10.1 Secrets Management

| Secret | Storage |
|--------|---------|
| OpenAI API Key | Azure Key Vault |
| Anthropic API Key | Azure Key Vault |
| Google AI API Key | Azure Key Vault |
| Cosmos DB Connection | Azure App Settings |
| Azure AD B2C Config | Azure App Settings |

### 10.2 Security Checklist

| Item | Status |
|------|--------|
| HTTPS enforced | ✅ (Azure default) |
| API authentication | ✅ (Azure AD B2C) |
| Input validation | ✅ (Pydantic) |
| SQL injection protection | ✅ (Cosmos DB parameterized) |
| Rate limiting | ⏳ (To implement) |
| Secrets in Key Vault | ✅ |

---

## 11. Monitoring

### 11.1 Azure Application Insights

**Metrics to Track**:
| Metric | Purpose |
|--------|---------|
| Request duration | API performance |
| Failure rate | Reliability |
| User sessions | Engagement |
| Custom events | LLM usage, model selection |

### 11.2 Alerts

| Alert | Threshold |
|-------|-----------|
| High error rate | > 5% in 5 min |
| Slow response | > 10s average |
| LLM failures | > 10 in 1 hour |

---

## 12. Cost Estimation

### 12.1 Free Tier (MVP)

| Service | Monthly Limit | Cost |
|---------|---------------|------|
| Azure Static Web Apps | 100 GB bandwidth | $0 |
| Azure Functions | 1M executions | $0 |
| Cosmos DB | 1000 RU/s, 25 GB | $0 |
| Azure AD B2C | 50K MAU | $0 |
| **Total Azure** | | **$0** |
| OpenAI API | ~100 queries | ~$1-2 |
| **Total** | | **~$1-2/month** |

### 12.2 Growth Tier (1000 users)

| Service | Usage | Cost |
|---------|-------|------|
| Azure Static Web Apps | Standard | $9/month |
| Azure Functions | 100K executions | $0 |
| Cosmos DB | 2000 RU/s | ~$25/month |
| Azure AD B2C | 1000 MAU | $0 |
| **Total Azure** | | **~$34/month** |
| OpenAI API | ~5000 queries | ~$50-100 |
| **Total** | | **~$84-134/month** |
