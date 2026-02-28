# MedRoute Platform

## Overview
MedRoute is a platform designed to optimize the redistribution of unused medicines to areas and users in need. This repository contains the project requirements, non-functional specifications, external integration details, constraints, assumptions, and design references.

## Repository Contents
- `designs.md` – Contains system architecture diagrams, flowcharts, and UI mockups.
- `requirements/` – Detailed functional and non-functional requirements, success criteria, and external integration specifications.

## Key Features
- Medicine matching and redistribution system
- Integration with geolocation, SMS/email services, and government databases
- Support for offline and low-bandwidth scenarios
- Scalable, secure, and maintainable architecture

## Usage
This repository serves as the reference for project planning, design, and implementation. It provides a complete overview of the system’s specifications and proposed architecture.

##  Current Status:
- ~70% frontend complete  
- Geolocation layer fully operational  
- Backend, AI integration, and authentication modules in progress  

---

## Development Status

| Component | Status |
|------------|----------|
| Frontend (React) | 70% Complete |
| Google Maps Integration | ✅ Implemented |
| Backend APIs | In Progress |
| AWS Multilingual AI | Pending |
| Delivery Dashboard | Partially Implemented |
| Ayushmaan Authentication | Design Phase |
| Government Dashboard | UI Ready, Logic Pending |

---

## System Architecture

MedRoute follows a modular, service-oriented architecture for scalability, interoperability, and compliance.

### 1. Geospatial Intelligence
- Route optimization & live ETA
- Healthcare facility mapping
- Delivery clustering & rerouting
- Real-time spatial analytics

### 2. Multilingual AI Layer (AWS – Planned)
- Amazon Lex (Conversational interface)
- Amazon Comprehend (Language detection)
- Amazon Translate (Cross-lingual support)
- Amazon SageMaker (Custom healthcare models)

**Objective:** Eliminate linguistic barriers in rural and semi-urban healthcare access.

### 3. Delivery Intelligence Dashboard
- Real-time tracking
- Inventory allocation
- Route efficiency analytics
- Delay prediction
- Demand heatmaps

### 4. Ayushmaan Bharat Integration
- Health ID validation
- Beneficiary eligibility verification
- Secure claims processing
- OAuth 2.0 + RBAC + encrypted transmission

### 5. Government Dashboard
- District-level delivery metrics
- Scheme coverage analytics
- Fraud detection indicators
- Policy benchmarking tools

---

## Technical Stack

**Frontend**
- React.js
- TailwindCSS / Material UI
- Redux / Context API
- Google Maps SDK

**Backend**
- Node.js / Express
- REST APIs
- PostgreSQL / DynamoDB
- JWT Authentication

**Cloud & AI**
- AWS EC2 / Lambda
- AWS Lex, SageMaker
- AWS Comprehend
- AWS Translate

---

## Roadmap

**Phase 1:** Backend completion & API integration  
**Phase 2:** Multilingual AI deployment  
**Phase 3:** Ayushmaan authentication & Government rollout  
**Phase 4:** Predictive logistics & advanced analytics  

---

## Completion Summary

- UI/UX – 70% Complete  
- Geospatial Layer – Live  
- Backend Services – Ongoing  
- Delivery Analytics – In Progress  
- AI & Authentication – Pending  

---

## Vision

To establish MedRoute as a national digital health routing backbone enabling:

- Equitable healthcare access  
- Transparent medicine redistribution  
- Real-time governance intelligence  
- Multilingual public health communication  

---
