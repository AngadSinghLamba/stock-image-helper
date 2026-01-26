# System Architecture

## Stock Image Helper - Technical Architecture

**Version**: 1.0  
**Date**: January 26, 2026  
**Author**: Angad Lamba

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Azure Static Web Apps                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Frontend (Next.js)                           │   │
│  │                                                                      │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │   │  Login   │  │  Search  │  │ History  │  │    Settings      │   │   │
│  │   │  Page    │  │  Page    │  │  Page    │  │    Page          │   │   │
│  │   └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      API Functions (Python)                          │   │
│  │                                                                      │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │   │
│  │   │ /api/auth/*  │  │/api/generate │  │  /api/history            │ │   │
│  │   │              │  │              │  │  /api/favorites          │ │   │
│  │   └──────────────┘  └──────────────┘  └──────────────────────────┘ │   │
│  │                            │                                        │   │
│  │                            ▼                                        │   │
│  │   ┌─────────────────────────────────────────────────────────────┐  │   │
│  │   │                      LangChain                               │  │   │
│  │   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │  │   │
│  │   │  │ Prompt  │─▶│  LLM    │─▶│ Parser  │─▶│  URL Builder    │ │  │   │
│  │   │  │Template │  │ (multi) │  │(Pydantic│  │                 │ │  │   │
│  │   │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │  │   │
│  │   │       │            │                                        │  │   │
│  │   │       │            ▼                                        │  │   │
│  │   │       │     ┌───────────┐                                   │  │   │
│  │   │       │     │  Memory   │                                   │  │   │
│  │   │       │     │ (session) │                                   │  │   │
│  │   │       │     └───────────┘                                   │  │   │
│  │   └───────┼─────────────────────────────────────────────────────┘  │   │
│  │           │                                                         │   │
│  └───────────┼─────────────────────────────────────────────────────────┘   │
│              │                                                              │
└──────────────┼──────────────────────────────────────────────────────────────┘
               │
      ┌────────┴────────┬────────────────────┐
      │                 │                    │
      ▼                 ▼                    ▼
┌───────────┐    ┌───────────┐       ┌─────────────┐
│  Azure    │    │   LLM     │       │   Azure     │
│ Cosmos DB │    │ Providers │       │   AD B2C    │
│           │    │           │       │             │
│ • users   │    │ • OpenAI  │       │ • Auth      │
│ • history │    │ • Claude  │       │ • Sessions  │
│ • favorites│   │ • Gemini  │       │ • OAuth     │
└───────────┘    └───────────┘       └─────────────┘
```

---

## 2. Component Details

### 2.1 Frontend (Next.js)

**Purpose**: User interface for the application

**Key Components**:

| Component | Description |
|-----------|-------------|
| `pages/index.tsx` | Landing/login page |
| `pages/search.tsx` | Main search interface |
| `pages/history.tsx` | Search history view |
| `pages/settings.tsx` | User preferences |
| `components/BriefInput.tsx` | Text input for briefs |
| `components/ResultCard.tsx` | Query result display |
| `components/ModelSelector.tsx` | LLM selection dropdown |
| `components/ViewToggle.tsx` | Cards/Table/JSON toggle |

**State Management**: React Context + useState (simple state)

**Styling**: Tailwind CSS with dark mode support

---

### 2.2 Backend API (Azure Functions - Python)

**Purpose**: Handle business logic, LLM calls, database operations

**Endpoints**:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate queries from brief |
| `/api/generate/stream` | POST | Generate with streaming |
| `/api/history` | GET | Get user's search history |
| `/api/history` | POST | Save search to history |
| `/api/history/{id}` | DELETE | Delete history item |
| `/api/favorites` | GET | Get user's favorites |
| `/api/favorites` | POST | Add to favorites |
| `/api/favorites/{id}` | DELETE | Remove from favorites |
| `/api/user/profile` | GET | Get user profile |
| `/api/user/settings` | PUT | Update user settings |

---

### 2.3 LangChain Layer

**Purpose**: Orchestrate LLM calls with memory, fallback, and structured output

**Components**:

```
┌─────────────────────────────────────────────────────────────────┐
│                      LangChain Architecture                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Prompt Template                       │   │
│  │                                                          │   │
│  │  System: You are a stock image search expert...         │   │
│  │  Human: {brief}                                          │   │
│  │  Context: {chat_history}                                 │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              LLM with Fallback Chain                     │   │
│  │                                                          │   │
│  │   Primary: GPT-4o ──failed?──▶ Claude ──failed?──▶ Gemini│   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Pydantic Output Parser                      │   │
│  │                                                          │   │
│  │   Validates JSON structure, retries if invalid          │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Conversation Memory                         │   │
│  │                                                          │   │
│  │   Stores last N turns for context                       │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.4 Database (Azure Cosmos DB)

**Purpose**: Store users, history, and favorites

**Database**: `stockimagehelper`

**Containers**:

#### users
```json
{
  "id": "user_abc123",
  "email": "daniel@vml.com",
  "name": "Daniel Saenz Lopez",
  "provider": "google",
  "avatar_url": "https://...",
  "settings": {
    "preferred_model": "gpt-4o",
    "theme": "dark",
    "default_platforms": ["getty", "shutterstock"]
  },
  "created_at": "2026-01-26T10:00:00Z",
  "last_login": "2026-01-26T14:00:00Z"
}
```

#### search_history
```json
{
  "id": "search_xyz789",
  "user_id": "user_abc123",
  "brief": "Ford truck in mountain setting, sunrise, cinematic...",
  "model_used": "gpt-4o",
  "brief_analysis": {
    "subject": "pickup truck",
    "setting": "mountain, outdoor",
    "lighting": "sunrise, golden hour",
    "mood": "adventure, freedom",
    "composition": "wide shot, cinematic"
  },
  "queries": [
    {
      "platform": "getty",
      "query": "pickup truck sunrise mountain landscape",
      "url": "https://www.gettyimages.com/search/...",
      "reasoning": "Combines subject with setting and lighting"
    }
  ],
  "created_at": "2026-01-26T14:05:00Z"
}
```

#### favorites
```json
{
  "id": "fav_def456",
  "user_id": "user_abc123",
  "search_id": "search_xyz789",
  "query": "pickup truck sunrise mountain landscape",
  "platform": "getty",
  "url": "https://www.gettyimages.com/search/...",
  "notes": "Great for automotive campaigns",
  "created_at": "2026-01-26T14:10:00Z"
}
```

**Partition Strategy**:
- `users`: Partition by `/id`
- `search_history`: Partition by `/user_id`
- `favorites`: Partition by `/user_id`

---

### 2.5 Authentication (Azure AD B2C)

**Purpose**: User authentication and session management

**User Flows**:

| Flow | Description |
|------|-------------|
| Sign Up | Email/password registration |
| Sign In | Email/password or social login |
| Password Reset | Email-based reset |

**Identity Providers**:
- Email/Password (built-in)
- Google
- Microsoft Account
- GitHub

**Token Flow**:

```
┌────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User clicks "Sign In with Google"                          │
│                    │                                            │
│                    ▼                                            │
│  2. Redirect to Azure AD B2C                                   │
│                    │                                            │
│                    ▼                                            │
│  3. Azure AD B2C redirects to Google                           │
│                    │                                            │
│                    ▼                                            │
│  4. User authenticates with Google                             │
│                    │                                            │
│                    ▼                                            │
│  5. Google returns token to Azure AD B2C                       │
│                    │                                            │
│                    ▼                                            │
│  6. Azure AD B2C creates/updates user, issues JWT             │
│                    │                                            │
│                    ▼                                            │
│  7. Redirect to app with JWT                                   │
│                    │                                            │
│                    ▼                                            │
│  8. Frontend stores JWT, includes in API requests              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow

### 3.1 Query Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Query Generation Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User enters brief in frontend                               │
│     "Ford truck in mountains, sunrise, cinematic"               │
│                        │                                         │
│                        ▼                                         │
│  2. Frontend sends POST /api/generate                           │
│     {                                                            │
│       "brief": "Ford truck in mountains...",                    │
│       "model": "gpt-4o",                                        │
│       "platforms": ["getty", "shutterstock"],                   │
│       "session_id": "sess_123"                                  │
│     }                                                            │
│                        │                                         │
│                        ▼                                         │
│  3. API validates request, checks auth token                    │
│                        │                                         │
│                        ▼                                         │
│  4. LangChain builds prompt with memory context                 │
│                        │                                         │
│                        ▼                                         │
│  5. LLM generates response                                      │
│                        │                                         │
│                        ▼                                         │
│  6. Pydantic parser validates JSON structure                    │
│                        │                                         │
│                        ▼                                         │
│  7. URL builder constructs platform URLs                        │
│                        │                                         │
│                        ▼                                         │
│  8. Save to search_history in Cosmos DB                         │
│                        │                                         │
│                        ▼                                         │
│  9. Return response to frontend                                 │
│     {                                                            │
│       "brief_analysis": {...},                                  │
│       "queries": [...]                                          │
│     }                                                            │
│                        │                                         │
│                        ▼                                         │
│  10. Frontend displays results                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Conversation Flow (with Memory)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Conversation Memory Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Turn 1: User: "Find Ford truck images in mountains"            │
│          AI: [Returns queries for Ford truck mountain]          │
│          Memory: Stores turn 1                                  │
│                                                                  │
│  Turn 2: User: "Make them more dramatic"                        │
│          AI: [Remembers "Ford truck mountain", adds dramatic]   │
│          Memory: Stores turn 1 + turn 2                         │
│                                                                  │
│  Turn 3: User: "Add sunset lighting"                            │
│          AI: [Remembers full context, adds sunset]              │
│          Memory: Stores turn 1 + turn 2 + turn 3                │
│                                                                  │
│  Session ends: Memory cleared                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Security Architecture

### 4.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: HTTPS (TLS 1.2+)                                      │
│  ├── All traffic encrypted in transit                           │
│  └── Managed by Azure Static Web Apps                           │
│                                                                  │
│  Layer 2: Azure AD B2C Authentication                           │
│  ├── JWT tokens for API access                                  │
│  ├── Token validation on every request                          │
│  └── Automatic token refresh                                    │
│                                                                  │
│  Layer 3: API Authorization                                     │
│  ├── User can only access own data                              │
│  └── Cosmos DB queries filtered by user_id                      │
│                                                                  │
│  Layer 4: Secrets Management                                    │
│  ├── API keys in Azure Key Vault                                │
│  ├── Connection strings in App Settings                         │
│  └── Never exposed to frontend                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `COSMOS_CONNECTION_STRING` | Azure App Settings | Database connection |
| `OPENAI_API_KEY` | Azure Key Vault | OpenAI API key |
| `ANTHROPIC_API_KEY` | Azure Key Vault | Claude API key |
| `GOOGLE_AI_API_KEY` | Azure Key Vault | Gemini API key |
| `AZURE_AD_B2C_*` | Azure App Settings | Auth configuration |

---

## 5. Deployment Architecture

### 5.1 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                      Deployment Flow                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Developer pushes to GitHub (main branch)                    │
│                        │                                         │
│                        ▼                                         │
│  2. GitHub Actions triggered                                    │
│                        │                                         │
│                        ▼                                         │
│  3. Build Next.js frontend                                      │
│     npm run build                                                │
│                        │                                         │
│                        ▼                                         │
│  4. Package Python API functions                                │
│                        │                                         │
│                        ▼                                         │
│  5. Deploy to Azure Static Web Apps                             │
│     (automatic via Azure GitHub integration)                    │
│                        │                                         │
│                        ▼                                         │
│  6. Azure runs deployment                                       │
│     - Frontend → Azure CDN                                      │
│     - API → Azure Functions                                     │
│                        │                                         │
│                        ▼                                         │
│  7. App live at custom domain                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local testing | http://localhost:3000 |
| Staging | Pre-production testing | https://staging.stockimagehelper.com |
| Production | Live application | https://stockimagehelper.com |

---

## 6. Error Handling

### 6.1 Error Types & Handling

| Error Type | Handling Strategy |
|------------|-------------------|
| LLM API failure | Fallback to secondary LLM |
| Invalid JSON output | Retry with different prompt |
| Rate limiting | Queue with exponential backoff |
| Auth failure | Redirect to login |
| Database error | Return error message, log details |

### 6.2 Fallback Chain

```
Primary LLM (GPT-4o)
        │
        ├── Success → Return result
        │
        └── Failure
               │
               ▼
        Fallback 1 (Claude)
               │
               ├── Success → Return result
               │
               └── Failure
                      │
                      ▼
               Fallback 2 (Gemini)
                      │
                      ├── Success → Return result
                      │
                      └── Failure → Return error to user
```

---

## 7. Monitoring & Logging

### 7.1 Azure Application Insights

| Metric | Description |
|--------|-------------|
| Request duration | API response times |
| Failure rate | % of failed requests |
| User sessions | Active users |
| LLM usage | Calls per model |

### 7.2 Custom Logging

```python
# Log format
{
  "timestamp": "2026-01-26T14:05:00Z",
  "level": "INFO",
  "user_id": "user_abc123",
  "action": "generate_queries",
  "model": "gpt-4o",
  "duration_ms": 2500,
  "tokens_used": 450,
  "success": true
}
```

---

## 8. Scalability Considerations

### 8.1 Current Limits (Free Tier)

| Resource | Limit | Expected Usage |
|----------|-------|----------------|
| Azure Static Web Apps | 100 GB/month | < 10 GB |
| Azure Functions | 1M executions/month | < 50K |
| Cosmos DB | 1000 RU/s | < 500 RU/s |

### 8.2 Scaling Path

1. **Vertical**: Increase Cosmos DB RU/s as needed
2. **Horizontal**: Azure Functions auto-scale
3. **Caching**: Add Azure Redis Cache if needed
4. **CDN**: Already included with Static Web Apps
