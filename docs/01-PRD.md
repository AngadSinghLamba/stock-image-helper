# Product Requirements Document (PRD)

## Stock Image Helper - Phase 1

**Version**: 1.0  
**Date**: January 26, 2026  
**Author**: Angad Lamba  
**Status**: Approved for Development

---

## 1. Executive Summary

### 1.1 Problem Statement

Creative teams across WPP agencies spend 45-90 minutes per asset search manually trying different keyword combinations on stock image platforms. Interviews with creative teams across approximately 12 accounts revealed this task is exceptionally time-consuming, taking away from core creative responsibilities.

### 1.2 Solution

Stock Image Helper is an AI-powered tool that converts creative briefs into optimized search queries for multiple stock platforms, reducing search time from 45-90 minutes to 5-10 minutes (80-90% time savings).

### 1.3 Business Value

| Metric | Current | With Tool | Savings |
|--------|---------|-----------|---------|
| Time per search | 45-90 min | 5-10 min | 80-90% |
| Searches per day | 3-5 | 3-5 | - |
| Daily time saved | - | - | 2-4 hours |
| Annual value (at $50/hr) | - | - | $25,000-50,000/creative |

---

## 2. Goals & Objectives

### 2.1 Primary Goals

1. **Reduce search time** by 80% or more
2. **Improve search quality** by generating platform-optimized queries
3. **Support multiple platforms** (Getty, Shutterstock, Adobe Stock, Unsplash, Pexels)

### 2.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first relevant result | < 5 minutes | User feedback |
| User satisfaction | > 4.0/5.0 | Survey |
| Weekly active users | 50+ within 3 months | Analytics |
| Query quality rating | > 80% useful | User ratings |

---

## 3. Target Users

### 3.1 Primary Users

| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| Creative Directors | Oversee visual direction | Quick concept exploration |
| Art Directors | Design layouts and visuals | Find specific image types |
| Graphic Designers | Create marketing materials | Efficient asset sourcing |
| Social Media Managers | Create social content | High-volume image needs |

### 3.2 User Personas

**Persona 1: Daniel (Art Director at VML)**
- Searches for stock images 3-5 times daily
- Works on automotive accounts (Ford)
- Frustrated by trial-and-error keyword searches
- Needs: Fast, reliable image discovery

**Persona 2: Maria (Graphic Designer)**
- Junior designer, less experienced with stock platforms
- Doesn't know platform-specific tagging conventions
- Needs: Guidance on effective search terms

---

## 4. User Stories

### 4.1 Core User Stories (Must Have)

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Creative | Paste a brief and get search queries | I don't waste time guessing keywords |
| US-02 | Creative | Click to open platform search results | I can immediately browse relevant images |
| US-03 | Creative | Copy queries to clipboard | I can paste them manually if needed |
| US-04 | Creative | See queries for multiple platforms | I can compare results across Getty/Shutterstock |
| US-05 | User | Create an account | My history is saved |
| US-06 | User | View my search history | I can revisit past searches |
| US-07 | User | Mark queries as favorites | I can quickly find useful queries |

### 4.2 Enhanced User Stories (Should Have)

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-08 | Creative | Refine queries in conversation | I can iterate without restarting |
| US-09 | Creative | Choose which LLM to use | I can pick based on speed/quality |
| US-10 | User | Toggle dark mode | I can work comfortably at night |
| US-11 | User | View results in different formats | I can choose cards, table, or JSON |

### 4.3 Future User Stories (Phase 2)

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-12 | Creative | See image thumbnails in the app | I don't need to leave the tool |
| US-13 | Creative | Filter by license type | I find commercially usable images |
| US-14 | Creative | See pricing information | I can compare costs |

---

## 5. Functional Requirements

### 5.1 Brief Analysis

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-01 | System shall accept free-form text briefs up to 2000 characters | Must |
| FR-02 | System shall extract key concepts: subject, setting, lighting, mood, composition, style | Must |
| FR-03 | System shall display extracted concepts to user | Should |

### 5.2 Query Generation

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-04 | System shall generate minimum 3 queries per platform | Must |
| FR-05 | System shall support Getty Images query format | Must |
| FR-06 | System shall support Shutterstock query format | Must |
| FR-07 | System shall support Adobe Stock query format | Must |
| FR-08 | System shall support Unsplash query format | Should |
| FR-09 | System shall support Pexels query format | Should |
| FR-10 | System shall provide reasoning for each query | Should |

### 5.3 URL Generation

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-11 | System shall generate valid search URLs for each platform | Must |
| FR-12 | System shall include relevant filters in URLs (orientation, type) | Should |
| FR-13 | System shall validate URLs before displaying | Should |

### 5.4 User Interface

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-14 | System shall provide text input for briefs | Must |
| FR-15 | System shall display results in card format | Must |
| FR-16 | System shall provide copy-to-clipboard functionality | Must |
| FR-17 | System shall provide "Open in Platform" buttons | Must |
| FR-18 | System shall support table view for results | Should |
| FR-19 | System shall support JSON view for results | Should |
| FR-20 | System shall be responsive (mobile-friendly) | Must |
| FR-21 | System shall support dark mode | Should |

### 5.5 Authentication & User Management

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-22 | System shall support email/password registration | Must |
| FR-23 | System shall support Google OAuth login | Must |
| FR-24 | System shall support Microsoft OAuth login | Must |
| FR-25 | System shall support GitHub OAuth login | Should |
| FR-26 | System shall maintain user sessions | Must |

### 5.6 History & Favorites

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-27 | System shall save all searches to user history | Must |
| FR-28 | System shall display search history with timestamps | Must |
| FR-29 | System shall allow marking queries as favorites | Should |
| FR-30 | System shall allow filtering history by date | Should |

### 5.7 LLM Features

| Req ID | Requirement | Priority |
|--------|-------------|----------|
| FR-31 | System shall support multiple LLM providers (OpenAI, Claude, Gemini) | Must |
| FR-32 | System shall allow user to select preferred LLM | Must |
| FR-33 | System shall maintain conversation context within session | Must |
| FR-34 | System shall auto-fallback to backup LLM on failure | Should |
| FR-35 | System shall stream responses in real-time | Should |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-01 | Query generation response time | < 10 seconds |
| NFR-02 | Page load time | < 3 seconds |
| NFR-03 | UI responsiveness | < 100ms for interactions |

### 6.2 Scalability

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-04 | Concurrent users | 100+ |
| NFR-05 | Queries per day | 10,000+ |

### 6.3 Availability

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-06 | Uptime | 99.5% |
| NFR-07 | Planned maintenance window | < 4 hours/month |

### 6.4 Security

| Req ID | Requirement | Target |
|--------|-------------|--------|
| NFR-08 | Authentication | Azure AD B2C |
| NFR-09 | Data encryption | TLS 1.2+ in transit |
| NFR-10 | API key storage | Azure Key Vault |

---

## 7. Constraints & Assumptions

### 7.1 Constraints

1. **No image analysis** - Phase 1 does not analyze actual images
2. **No direct asset URLs** - Returns search page URLs only
3. **No downloads** - Users download from stock platforms directly
4. **Platform URL dependency** - Tool depends on stable platform URL structures

### 7.2 Assumptions

1. Users have existing stock platform subscriptions
2. Stock platforms maintain current URL structures
3. LLM API services remain available and affordable
4. Users have modern web browsers

---

## 8. Out of Scope (Phase 1)

| Feature | Reason | Phase |
|---------|--------|-------|
| Image thumbnails | Requires API access | Phase 2 |
| Price comparison | Requires API access | Phase 2 |
| Direct downloads | Requires API access | Phase 2 |
| Image analysis/ranking | Requires vision models + API | Phase 2 |
| Team collaboration | Additional complexity | Phase 2 |
| API access for developers | Additional infrastructure | Phase 2 |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Platform URL changes | Medium | High | Offer "queries only" fallback mode |
| LLM API outages | Low | High | Multi-provider fallback chain |
| Query quality issues | Medium | Medium | Multi-step refinement chain |
| User adoption | Medium | Medium | Focus on UX, gather feedback early |
| Cost overruns (LLM) | Low | Medium | Use cost-effective models, set limits |

---

## 10. Timeline

| Milestone | Target |
|-----------|--------|
| Documentation complete | Week 1 |
| Development environment setup | Week 1 |
| Core backend (LangChain + API) | Week 2-3 |
| Frontend UI | Week 3-4 |
| Authentication | Week 4 |
| Testing & refinement | Week 5 |
| Deployment | Week 5-6 |
| User acceptance testing | Week 6 |

---

## 11. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Owner | Bharat Rama | | |
| Developer | Angad Lamba | | |
| Requestor | Daniel Saenz Lopez | | |
