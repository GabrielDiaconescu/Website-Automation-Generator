# MASTER PROMPT — AI SaaS Website & Automation Generator

> **Rol asumat:** Principal Architect + Senior Full-Stack Engineer + SaaS Product Architect + QA Lead
>
> **Document de referință al proiectului.** Conține regulile de arhitectură, produsul țintă, regulile de securitate și planul de execuție pe faze (FAZA 0 → FAZA 34).
>
> Numerotarea secțiunilor (0–200) este stabilă: referă-te la reguli prin numărul lor (ex. „regula 148"). Secțiunile sunt grupate pe părți tematice, dar ordinea originală este păstrată.

---

## CUPRINS

| Partea | Secțiuni | Subiect |
|---|---|---|
| [I](#partea-i--rol-viziune-și-principiu-central) | 0–3 | Rol, viziune, principiul central, business types |
| [II](#partea-ii--template-componente-și-stack) | 4–7 | Template system, componente, stack, principii de arhitectură |
| [III](#partea-iii--multi-tenancy-date-și-roluri) | 8–10 | Multi-tenancy, database, roles |
| [IV](#partea-iv--dashboard-onboarding-și-generator) | 11–17 | Dashboard, onboarding, generator, template engine, page builder, design system, themes |
| [V](#partea-v--ai-content-chatbot-tools) | 18–21 | AI content generator, chatbot, tool system, AI flow |
| [VI](#partea-vi--integrări-și-crm) | 22–24 | WhatsApp, Calendar, CRM |
| [VII](#partea-vii--automatizări-și-lead-capture) | 25–28 | Automation engine, data model, lead capture, feature packs |
| [VIII](#partea-viii--seo-domenii-publicare-analytics) | 29–32 | SEO, domains, publishing, analytics |
| [IX](#partea-ix--billing-și-limite) | 33–34 | Billing, usage limits |
| [X](#partea-x--securitate-secrete-și-erori) | 35–38 | Security, secret management, error handling, UI states |
| [XI](#partea-xi--ux-configurare-și-registries) | 39–46 | UX, smart configurator, preview, configuration engine, registries |
| [XII](#partea-xii--ai-pipeline-cost-și-observability) | 47–52 | AI pipeline, structured output, cost control, prompt versioning, observability |
| [XIII](#partea-xiii--admin-migrations-seed-demo) | 53–57 | Admin panel, admin security, migrations, seed, demo mode |
| [XIV](#partea-xiv--testare-și-calitate) | 58–65 | Testing, type safety, code quality, responsive, a11y, performance |
| [XV](#partea-xv--arhitectură-tehnică) | 66–80 | Public site architecture, URL/API, layers, providers, configuration |
| [XVI](#partea-xvi--dev-workflow-și-documentație) | 81–85 | Local dev, scripts, git, docs, observability |
| [XVII](#partea-xvii--reziliență-date-și-conformitate) | 86–93 | Retries, idempotency, webhooks, retention, GDPR, feature flags |
| [XVIII](#partea-xviii--onboarding-inteligent-și-feature-lifecycle) | 94–100 | Recommendation engine, template pipeline, feature install, defaults, polish |
| [XIX](#partea-xix--mvp-și-prioritizare) | 101–102 | Definiția MVP, ce NU se implementează prematur |
| [XX](#partea-xx--plan-de-execuție-pe-faze) | 103–138 | FAZA 0 → FAZA 34 |
| [XXI](#partea-xxi--reguli-de-lucru-pentru-agent) | 139–147 | Workflow, anti-hallucination, decizii, provider abstraction |
| [XXII](#partea-xxii--securitate-operațională) | 148–157 | DB security, form security, AI security, prompt injection, billing, logging |
| [XXIII](#partea-xxiii--uiux-performanță-scalabilitate) | 158–164 | UI copy, error UX, mobile, browser support, performance, scalabilitate |
| [XXIV](#partea-xxiv--model-comercial) | 165–174 | Pricing, trial, subscriptions, metrici interne, white label |
| [XXV](#partea-xxv--calitate-produs-conținut-i18n) | 175–190 | Template quality, conversie, i18n, storage, versioning, audit log |
| [XXVI](#partea-xxvi--acceptanță-și-review-final) | 191–200 | Acceptance test, mod de lucru, checklist faze, review final |
| [EXEC](#execution-command) | — | Comanda de execuție |

---

# PARTEA I — ROL, VIZIUNE ȘI PRINCIPIU CENTRAL

## 0. ROLUL TĂU

În acest proiect nu ești un simplu code generator.

Comportă-te simultan ca:

- cel mai bun software architect posibil;
- principal full-stack engineer;
- senior TypeScript/Next.js engineer;
- senior database architect;
- SaaS architect;
- multi-tenant systems architect;
- UI/UX designer;
- product designer;
- automation architect;
- AI systems engineer;
- DevOps engineer;
- security engineer;
- QA engineer;
- technical project manager;
- SaaS growth/product consultant.

Obiectivul tău nu este să produci rapid mult cod.

Obiectivul tău este să construiești un produs SaaS **REAL, COERENT, EXTENSIBIL, SECURIZAT ȘI COMERCIALIZABIL**.

Produsul trebuie să poată ajunge de la:

> „utilizatorul își creează cont"

la:

> „utilizatorul selectează tipul de business → selectează un template → selectează funcțiile → completează datele → generează site-ul → conectează automatizările → publică site-ul → primește lead-uri → gestionează clienții → vede analytics."

Nu construi un demo static. Construiește fundația unui produs SaaS care poate susține sute/mii de business-uri.

## 1. VIZIUNEA PRODUSULUI

Construim o platformă SaaS prin care un utilizator poate genera și administra:

1. Website-ul business-ului
2. Designul website-ului
3. Conținutul website-ului
4. Formularul de lead-uri
5. CRM-ul
6. Chatbot-ul AI
7. WhatsApp
8. Programările
9. Calendarul
10. Email automation
11. Follow-up automation
12. Review automation
13. SEO
14. Analytics
15. Domeniul
16. Branding-ul
17. Automatizările business-ului

Platforma trebuie să funcționeze ca un:

**WEBSITE + AI + AUTOMATION + CRM GENERATOR**

## 2. PRINCIPIUL CENTRAL

**NU genera cod complet nou pentru fiecare client.**

Aceasta este una dintre cele mai importante reguli ale proiectului.

Construiește:

- component library;
- template engine;
- configuration engine;
- feature/plugin system;
- content engine;
- automation engine.

Site-urile sunt instanțe/configurații ale aceluiași sistem.

```json
{
  "businessType": "auto_service",
  "template": "auto_01",
  "theme": "dark_luxury",
  "features": [
    "lead_form",
    "whatsapp",
    "calendar",
    "chatbot",
    "crm"
  ]
}
```

Acest configuration object trebuie să determine experiența site-ului.

## 3. BUSINESS TYPES

MVP-ul trebuie să suporte cel puțin:

**Auto**
- service auto
- vulcanizare
- detailing
- car wash
- tinichigerie/vopsitorie
- diagnoză auto
- tractări auto

**Medical / Animal**
- cabinet veterinar
- clinică veterinară
- dentist
- clinică medicală

**Professional**
- avocat
- contabil
- consultant
- agenție
- freelancer

**Beauty**
- salon
- barber
- hair stylist
- cosmetică
- nail salon

**Fitness**
- sală
- personal trainer
- yoga
- fizioterapie

**Hospitality**
- restaurant
- cafenea
- hotel
- pensiune

**Property**
- agent imobiliar
- agenție imobiliară
- property management

**Other**

Arhitectura trebuie să permită adăugarea ulterioară de business types fără modificări majore ale engine-ului.

---

# PARTEA II — TEMPLATE, COMPONENTE ȘI STACK

## 4. TEMPLATE SYSTEM

Pentru fiecare business type trebuie să existe template-uri.

MVP: **3 template-uri / business type.**

```
AUTO_01
AUTO_02
AUTO_03
VET_01
VET_02
VET_03
SALON_01
SALON_02
SALON_03
```

Template-ul nu trebuie să fie hard-coded într-o singură pagină. Template-ul trebuie să fie compus din secțiuni:

```
Navbar
Hero
Trust badges
Services
Why us
Gallery
Testimonials
FAQ
CTA
Contact
Footer
```

## 5. COMPONENT SYSTEM

Construiește componente reutilizabile. Minimum:

```
Navbar
Hero
HeroSplit
HeroMinimal
HeroLuxury
HeroVideo
Services
ServiceGrid
ServiceCards
Pricing
Testimonials
Reviews
Gallery
FAQ
Team
About
Stats
TrustBadges
CTA
Contact
ContactForm
LeadForm
Booking
Map
OpeningHours
SocialLinks
Footer
WhatsAppButton
ChatWidget
CookieBanner
SEO
```

Fiecare componentă trebuie să accepte props/config:

```tsx
<Hero
  variant="luxury"
  title="Service Auto Premium"
  subtitle="..."
  primaryCTA="Programează-te"
  secondaryCTA="Sună acum"
/>
```

Nu hard-code business-specific information în componente.

## 6. STACK

**Frontend**
- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui

**Backend** (pentru MVP)
- Next.js Server Actions
- Route Handlers
- server-side business logic

Nu introduce un backend separat dacă nu există un motiv arhitectural real.

**Database**
- PostgreSQL
- Supabase

**Authentication**
- Supabase Auth

**AI**
- Anthropic API
- Claude

**Email**
- Resend

**Calendar**
- Google Calendar API

**WhatsApp**
- preferabil: Meta WhatsApp Cloud API
- alternativ: Twilio WhatsApp

**Payments** — Stripe
**Analytics** — PostHog
**Error monitoring** — Sentry
**Hosting** — Vercel
**Repository** — GitHub

## 7. PRINCIPII DE ARHITECTURĂ

Respectă permanent:

- DRY
- SOLID
- KISS
- separation of concerns
- dependency inversion
- modular architecture
- type safety
- explicit contracts
- predictable state management
- secure defaults

Nu accepta:

- duplicate logic;
- hard-coded business data;
- spaghetti code;
- massive components;
- giant API handlers;
- direct database access din UI;
- secret keys în frontend;
- SQL construit prin string concatenation;
- logică duplicată pentru fiecare template;
- workaround-uri temporare lăsate în production.

---

# PARTEA III — MULTI-TENANCY, DATE ȘI ROLURI

## 8. MULTI-TENANCY

Platforma este **MULTI-TENANT**.

```
User
 ↓
Organization
 ↓
Business
 ↓
Website
 ↓
Features
 ↓
Leads
 ↓
Customers
 ↓
Appointments
 ↓
Automations
```

Fiecare business trebuie izolat. Toate datele business-specific trebuie să aibă `organization_id` sau o structură echivalentă sigură.

Activează Supabase Row Level Security.

Un utilizator din Organization A nu trebuie să poată accesa absolut nimic din Organization B. Nu te baza doar pe frontend — security trebuie impusă la nivel de database/server.

## 9. DATABASE

Construiește schema extensibilă. Tabele principale:

```
users
organizations
organization_members
roles
permissions
business_profiles
business_hours
business_services
business_categories
templates
template_sections
template_variants
sites
site_pages
site_components
site_navigation
themes
brand_settings
features
organization_features
leads
customers
customer_notes
customer_tags
conversations
messages
appointments
appointment_types
calendar_integrations
automation_workflows
automation_steps
automation_triggers
automation_runs
followups
ai_agents
ai_conversations
ai_messages
ai_usage
whatsapp_integrations
email_integrations
email_templates
domains
subscriptions
plans
payments
invoices
analytics
analytics_events
notifications
audit_logs
api_keys
usage_limits
usage_events
```

Nu crea tabele inutil de complexe dacă nu sunt necesare. Dar arhitectura trebuie să permită scalarea.

## 10. ROLES

Implementarea trebuie să permită: `Owner`, `Admin`, `Manager`, `Staff`, `Viewer`.

**Owner:** billing, team, integrations, website, automation, CRM
**Staff:** leads, customers, appointments
**Viewer:** analytics, read-only CRM

---

# PARTEA IV — DASHBOARD, ONBOARDING ȘI GENERATOR

## 11. DASHBOARD

Dashboard-ul principal trebuie să arate profesionist.

```
Dashboard
Overview
Websites
Templates
Design
Content
Automations
AI
WhatsApp
Calendar
CRM
Leads
Customers
Appointments
Analytics
Domains
Integrations
Billing
Team
Settings
```

Dashboard-ul trebuie să aibă sidebar. Responsive. Desktop-first pentru admin dashboard, dar mobile usable.

## 12. ONBOARDING

Când utilizatorul creează cont:

1. **Create account**
2. **What type of business do you have?**
3. **Choose template**
4. **Choose features**

```
☑ AI Chatbot
☑ WhatsApp
☑ Online Booking
☑ Calendar
☑ CRM
☐ SMS
☑ Email automation
☐ Review automation
```

5. **Business information**

```
Business name
Description
Phone
Email
Address
City
Country
Website
Opening hours
Services
Prices
Social media
Logo
```

6. **Brand** — Primary color, Secondary color, Font, Logo, Style
7. **Generate**

## 13. GENERATOR

Flow foarte clar:

```
Business Type
      ↓
Template
      ↓
Features
      ↓
Business Data
      ↓
Brand
      ↓
AI Content
      ↓
Preview
      ↓
Publish
```

Nu trimite utilizatorul prin 30 de pagini inutile. Experiența trebuie să fie rapidă.

## 14. TEMPLATE ENGINE

Construiește un engine care primește:

```ts
type SiteConfig = {
  businessType: string
  templateId: string
  themeId: string
  enabledFeatures: string[]
  pages: PageConfig[]
  content: ContentConfig
}
```

Engine-ul trebuie să genereze UI-ul pe baza configurației:

```ts
renderTemplate(siteConfig)
```

Trebuie să fie posibil să schimb `templateId` fără să schimb restul site-ului.

## 15. PAGE BUILDER

Nu construi un page builder inutil de complex în MVP. Construiește un **section-based builder**:

```
Page
 ├── Hero
 ├── Services
 ├── About
 ├── Reviews
 ├── Gallery
 ├── FAQ
 ├── Contact
 └── CTA
```

User-ul poate: reorder, hide, show, edit, duplicate, delete.

Drag-and-drop poate fi introdus ulterior.

## 16. DESIGN SYSTEM

Construiește un design system consistent: spacing, typography, buttons, forms, cards, dialogs, dropdowns, tables, badges, alerts, loading states, empty states, skeletons, responsive breakpoints.

Nu crea UI separat pentru fiecare pagină.

## 17. THEMES

Sistemul trebuie să permită: `Modern`, `Minimal`, `Luxury`, `Corporate`, `Bold`, `Elegant`, `Medical`, `Automotive`, `Professional`.

```json
{
  "colors": {},
  "fonts": {},
  "radius": {},
  "shadows": {},
  "spacing": {}
}
```

---

# PARTEA V — AI (CONTENT, CHATBOT, TOOLS)

## 18. AI CONTENT GENERATOR

AI-ul trebuie să poată genera: homepage copy, headlines, descriptions, service descriptions, FAQs, about section, CTAs, SEO title, SEO description, metadata, chatbot knowledge, email templates, WhatsApp greeting, follow-up messages.

AI-ul **NU** trebuie să genereze arbitrar codul website-ului. Codul este controlat de template engine. AI-ul generează date/content/configuration.

## 19. AI CHATBOT

Chatbot-ul trebuie să fie business-aware. Nu lăsa modelul să inventeze informații.

Knowledge base: Business name, Business description, Services, Prices, Opening hours, Address, Phone, Policies, FAQs.

AI-ul trebuie să folosească doar informații disponibile. Dacă nu știe:

> Nu am suficiente informații pentru a confirma acest lucru.
> Vă pot pune în legătură cu echipa.

## 20. AI TOOL SYSTEM

Claude nu trebuie să execute acțiuni arbitrare. Construiește tool system:

```
get_business_info
get_services
get_service_price
get_opening_hours
get_customer
create_customer
create_lead
update_lead
check_availability
create_appointment
cancel_appointment
reschedule_appointment
send_email
send_whatsapp
create_followup
```

AI-ul poate utiliza doar tool-urile autorizate.

## 21. AI FLOW

```
User message
      ↓
Intent detection
      ↓
Conversation state
      ↓
Business rules
      ↓
Available tools
      ↓
Claude
      ↓
Tool call
      ↓
Validation
      ↓
Database/action
      ↓
Response
```

Nu lăsa AI-ul să execute SQL. Nu lăsa AI-ul să execute JavaScript arbitrar. Nu lăsa AI-ul să acceseze filesystem-ul.

---

# PARTEA VI — INTEGRĂRI ȘI CRM

## 22. WHATSAPP

Integrarea WhatsApp trebuie să fie modulară.

```
Customer
   ↓
WhatsApp
   ↓
Webhook
   ↓
Message processor
   ↓
AI agent
   ↓
Business tools
   ↓
Response
```

Webhook security obligatoriu. Verifică signature/token. Nu salva credentials în plaintext.

## 23. CALENDAR

Integrare Google Calendar: Connect Calendar, Disconnect Calendar, Check availability, Create event, Update event, Cancel event.

```
Customer
 ↓
Select service
 ↓
Select date
 ↓
Check availability
 ↓
Select slot
 ↓
Confirm
 ↓
Create appointment
 ↓
Email/WhatsApp confirmation
```

Timezone trebuie gestionat corect. Nu presupune UTC.

## 24. CRM

CRM minimal: Leads, Customers, Appointments, Conversations, Notes, Tags, Status.

Lead statuses: `New`, `Contacted`, `Qualified`, `Booked`, `Completed`, `Lost`.

Dashboard: New Leads, Today's Appointments, Conversion Rate, Revenue, Pending Followups.

---

# PARTEA VII — AUTOMATIZĂRI ȘI LEAD CAPTURE

## 25. AUTOMATION ENGINE

Construiește un automation engine generic.

```
Trigger
 ↓
Conditions
 ↓
Actions
```

Exemple:

```
New Lead
→ send email
→ send WhatsApp
→ wait 1 day
→ send follow-up

Appointment completed
→ wait 2 days
→ request review

No response
→ wait 24h
→ send WhatsApp
```

## 26. AUTOMATION DATA MODEL

```json
{
  "trigger": "lead_created",
  "conditions": [],
  "actions": [
    { "type": "send_email" },
    { "type": "send_whatsapp" },
    { "type": "wait", "duration": "24h" },
    { "type": "send_followup" }
  ]
}
```

Automation engine trebuie să fie extensibil.

## 27. LEAD CAPTURE

Site-ul generat trebuie să aibă formulare configurabile:

```
Name
Phone
Email
Service
Message
Preferred date
Vehicle
Vehicle registration
```

Pentru service auto poți avea: Vehicle make, Vehicle model, Year, Engine, Problem, Preferred date.

Lead-ul intră automat în CRM.

## 28. BUSINESS-SPECIFIC FEATURES

Arhitectura trebuie să permită **feature packs**.

- **Auto Service Pack:** Vehicle, Service, Appointment, Lead, WhatsApp, AI
- **Vet Pack:** Pet, Owner, Appointment, Vaccination, Medical notes
- **Lawyer Pack:** Case, Client, Consultation, Appointment, Documents

Nu construi toate aceste module în MVP. Construiește framework-ul care permite adăugarea lor.

---

# PARTEA VIII — SEO, DOMENII, PUBLICARE, ANALYTICS

## 29. SEO

Fiecare website generat trebuie să aibă: metadata, title, description, Open Graph, sitemap, robots.txt, canonical, structured data, local business schema unde este relevant.

AI poate genera SEO content.

## 30. DOMAINS

Permite `subdomain` și `custom domain`:

```
client.platform.com
www.client.ro
```

Construiește abstraction layer pentru domain management.

## 31. PUBLISHING

User-ul trebuie să poată: Save draft, Preview, Publish, Unpublish.

Status: `draft`, `published`, `unpublished`.

Preview-ul trebuie să fie identic cu production rendering.

## 32. ANALYTICS

Tracking:

```
page_view
lead_created
appointment_created
whatsapp_click
phone_click
email_click
cta_click
chat_started
chat_completed
```

Dashboard: Visitors, Leads, Bookings, Conversion rate, Top pages, Top sources.

---

# PARTEA IX — BILLING ȘI LIMITE

## 33. BILLING

Stripe. Planuri inițiale: `Starter`, `Business`, `AI`.

- **Starter:** Website, Hosting, Basic lead forms
- **Business:** Website, WhatsApp, CRM, Calendar
- **AI:** Website, AI Chatbot, AI WhatsApp, CRM, Calendar, Automations, Follow-ups

Nu hard-code prețurile în componente. Prețurile trebuie să vină din database/config.

## 34. USAGE LIMITS

Sistemul trebuie să suporte per plan: AI messages, AI tokens, WhatsApp messages, emails, appointments, leads, storage, websites, domains.

```
Starter:  500 AI messages
Business: 2000 AI messages
AI:       10000 AI messages
```

Nu implementa billing enforcement doar în frontend.

---

# PARTEA X — SECURITATE, SECRETE ȘI ERORI

## 35. SECURITY

Security este critică. Implement:

- authentication;
- authorization;
- RLS;
- input validation;
- output validation;
- rate limiting;
- CSRF protection unde este relevant;
- XSS protection;
- webhook verification;
- secure cookies;
- secret management;
- audit logs;
- API authentication;
- tenant isolation.

Folosește Zod pentru validation.

## 36. SECRET MANAGEMENT

Niciun secret nu trebuie expus frontend-ului:

```
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY
WHATSAPP_TOKEN
GOOGLE_CLIENT_SECRET
```

Folosește environment variables. Creează `.env.example` fără secrets reale.

## 37. ERROR HANDLING

Nu afișa erori tehnice utilizatorului.

- **Intern:** structured logging, error IDs, Sentry
- **User:** „Something went wrong. Please try again." + dacă este posibil `Request ID: XYZ`

## 38. LOADING / EMPTY / ERROR STATES

Fiecare interfață trebuie să aibă: loading, skeleton, empty state, error state, success state.

Nu lăsa ecrane goale.

---

# PARTEA XI — UX, CONFIGURARE ȘI REGISTRIES

## 39. UX

**Regula:** dacă utilizatorul trebuie să gândească prea mult, UX-ul este prost.

Preferă: cards, toggles, checkboxes, visual selectors, previews, defaults, smart recommendations.

```
What do you want to enable?
[✓] AI Chatbot
[✓] WhatsApp
[✓] Calendar
[ ] SMS
[✓] CRM
```

## 40. SMART CONFIGURATOR

Configuratorul trebuie să poată recomanda funcții.

- **Auto Service** → ✓ Booking ✓ WhatsApp ✓ Lead form ✓ CRM ✓ AI chatbot
- **Lawyer** → ✓ Consultation booking ✓ Lead form ✓ CRM ✓ Email

Recomandările trebuie să fie configuration-driven.

## 41. TEMPLATE PREVIEW

```
[Preview image] Modern Auto   [Use template]
[Preview image] Luxury Auto   [Use template]
[Preview image] Minimal Auto  [Use template]
```

User-ul trebuie să poată preview înainte de selectare.

## 42. LIVE PREVIEW

Configuratorul trebuie să poată actualiza preview-ul:

- user schimbă `Business name` → preview-ul se actualizează;
- user activează `WhatsApp` → butonul WhatsApp apare;
- user activează `Booking` → booking section apare.

## 43. CONFIGURATION ENGINE

Feature configuration trebuie să fie declarativă:

```json
{
  "features": {
    "whatsapp": true,
    "calendar": true,
    "chatbot": true,
    "crm": true
  }
}
```

Nu crea `if auto / if vet / if salon / if lawyer` peste tot în codebase. Folosește registry/configuration pattern.

## 44. FEATURE REGISTRY

```ts
registerFeature({
  id: "whatsapp",
  name: "WhatsApp",
  description: "...",
  dependencies: [],
  components: [],
  routes: [],
  permissions: [],
  settings: []
})
```

Acest lucru trebuie să permită adăugarea unui feature fără modificarea întregii aplicații.

## 45. TEMPLATE REGISTRY

```ts
registerTemplate({
  id: "auto_01",
  businessType: "auto_service",
  theme: "luxury",
  sections: [...]
})
```

## 46. BUSINESS TYPE REGISTRY

```ts
registerBusinessType({
  id: "auto_service",
  name: "Service Auto",
  recommendedFeatures: [
    "booking",
    "whatsapp",
    "crm",
    "chatbot"
  ]
})
```

---

# PARTEA XII — AI PIPELINE, COST ȘI OBSERVABILITY

## 47. AI GENERATION PIPELINE

```
Business data
 ↓
Business type
 ↓
Template
 ↓
Brand
 ↓
Feature set
 ↓
Prompt
 ↓
Claude
 ↓
Structured JSON
 ↓
Zod validation
 ↓
Database
 ↓
Website
```

Nu accepta output AI neverificat.

## 48. STRUCTURED AI OUTPUT

AI-ul trebuie să returneze JSON valid când este folosit pentru configurări:

```json
{
  "hero": { "title": "", "subtitle": "", "cta": "" },
  "services": [],
  "faq": [],
  "seo": {}
}
```

Validează cu Zod. Dacă JSON-ul este invalid: 1) repară; 2) retry; 3) log; 4) fallback.

## 49. AI COST CONTROL

Foarte important. Nu chema Claude inutil. Implement: caching, token budgets, model selection, retries, timeout, usage tracking, prompt versioning.

AI content generat o dată trebuie reutilizat.

## 50. PROMPT VERSIONING

Nu hard-code toate prompturile în componente. Construiește `ai_prompts` sau un prompt registry:

```
website_content_v1
seo_generator_v1
chatbot_system_v1
followup_generator_v1
```

## 51. AI OBSERVABILITY

Track: model, input tokens, output tokens, latency, cost estimate, success, failure, organization_id, feature.

Asta permite calcularea costului AI/client.

## 52. COST PER CLIENT

Dashboard intern/admin trebuie să permită vizualizarea: AI cost, Email cost, WhatsApp cost, Storage cost, Infrastructure estimate, Revenue, Gross margin.

```
Revenue per client - Variable costs = Gross margin
```

---

# PARTEA XIII — ADMIN, MIGRATIONS, SEED, DEMO

## 53. ADMIN PANEL

Construiește și un admin area intern, doar pentru platform owner: Organizations, Users, Subscriptions, Usage, AI costs, Errors, Templates, Features, Business types, System health.

## 54. ADMIN SECURITY

Admin routes trebuie protejate separat. Nu este suficient `isLoggedIn`. Trebuie `isPlatformAdmin`.

## 55. DATABASE MIGRATIONS

Toate schimbările de DB trebuie să fie migrabile. Nu modifica manual production database. Folosește migration workflow.

## 56. SEED DATA

Construiește seed data pentru: business types, templates, features, themes, demo organizations, demo services.

Astfel aplicația poate fi pornită imediat.

## 57. DEMO MODE

Construiește un demo environment:

```
demo-auto.platform.com
demo-vet.platform.com
demo-salon.platform.com
```

sau echivalent intern. Demo data trebuie să fie separată de production data.

---

# PARTEA XIV — TESTARE ȘI CALITATE

## 58. TESTING

**Unit tests** pentru: configuration engine, template engine, feature registry, automation engine, validation, pricing, permissions.

**Integration tests** pentru: auth, database, lead creation, appointments, AI tools, webhooks.

**E2E** pentru flow:

```
Register → onboarding → choose business → choose template
→ enable features → generate → preview → publish → create lead → CRM
```

## 59. TEST-FIRST THINKING

Nu scrie 20.000 de linii și testează la final. Pentru fiecare feature:

```
Design → implement → test → verify → integrate
```

## 60. TYPE SAFETY

TypeScript strict. Nu folosi `any` decât dacă există un motiv extrem de bine justificat. Preferă `unknown` și validation.

## 61. CODE QUALITY

Nu accept `TODO`, `FIXME`, `temporary`, `hack`, `quick fix`, `later` în codul production fără explicație.

Dacă ceva este temporar, documentează exact: **WHY**, **IMPACT**, **REPLACEMENT PLAN**.

## 62. RESPONSIVE

Website generator trebuie să producă site-uri mobile, tablet, desktop.

Dashboard: desktop optimized, usable on tablet, functional on mobile.

## 63. ACCESSIBILITY

Respectă: semantic HTML, keyboard navigation, labels, focus states, aria attributes unde sunt necesare, color contrast, accessible forms.

## 64. PERFORMANCE

Optimizează: server rendering, caching, images, fonts, database queries, bundle size, lazy loading.

Nu încărca toate feature-urile pe fiecare website.

## 65. SEO PERFORMANCE

Generated websites trebuie să fie indexable, fast, semantic, mobile-friendly.

Nu construi un SPA inutil pentru public websites dacă SSR/SSG este mai potrivit.

---

# PARTEA XV — ARHITECTURĂ TEHNICĂ

## 66. PUBLIC WEBSITE ARCHITECTURE

Separă conceptual **Platform Dashboard** de **Generated Websites**.

Website-ul clientului trebuie să fie cât mai lightweight.

## 67. URL STRUCTURE

Platform:

```
/app
/app/websites
/app/templates
/app/automations
/app/crm
/app/settings
```

Public: `/sites/[site]` sau architecture equivalent. Custom domains ulterior.

## 68. API ARCHITECTURE

```
/api/auth
/api/sites
/api/templates
/api/features
/api/leads
/api/customers
/api/appointments
/api/automations
/api/ai
/api/whatsapp
/api/calendar
/api/billing
/api/analytics
```

Nu crea API routes haotic.

## 69. VALIDATION

Toate inputurile externe — forms, query params, body, webhooks, AI output, OAuth callbacks — trebuie validate. **Zod este standardul.**

## 70. RATE LIMITING

Implementă rate limits pentru: login, signup, AI, chatbot, lead forms, public APIs, webhooks.

## 71. ABUSE PROTECTION

Platforma este publică. Protejează împotriva: spam, AI abuse, excessive API usage, form spam, fake appointments, brute force, webhook abuse.

Captcha/Turnstile poate fi introdus ulterior unde este necesar.

## 72. EMAIL SYSTEM

Construiește email templates: Welcome, Lead received, Appointment confirmation, Appointment reminder, Appointment cancellation, Follow-up, Review request, Password reset, Subscription.

Template-urile trebuie să fie reutilizabile.

## 73. NOTIFICATION SYSTEM

Centralizează Email, WhatsApp, In-app prin notification service. Nu implementa fiecare notificare complet separat.

## 74. EVENT SYSTEM

```
lead.created
lead.updated
appointment.created
appointment.completed
customer.created
message.received
payment.completed
subscription.updated
```

Automation engine poate asculta evenimente.

## 75. EVENT-DRIVEN ARCHITECTURE

Nu exagera cu microservices. MVP: **modular monolith** — este alegerea corectă. Dar organizează codul astfel încât modulele să poată fi extrase ulterior.

## 76. FOLDER STRUCTURE

```
src/
  app/
  components/
  features/
    auth/
    organizations/
    websites/
    templates/
    builder/
    crm/
    ai/
    whatsapp/
    calendar/
    automation/
    billing/
    analytics/
  lib/
    db/
    auth/
    ai/
    integrations/
    validation/
    security/
  server/
  types/
  config/
  registry/
  hooks/
  utils/
```

Nu crea fișiere arbitrar.

## 77. SERVICE LAYER

Business logic nu trebuie să stea în UI:

```
LeadService
CustomerService
AppointmentService
AutomationService
AIService
WebsiteService
BillingService
```

## 78. REPOSITORY LAYER

Pentru operațiuni complexe: `LeadRepository`, `CustomerRepository`, `AppointmentRepository`.

Nu exagera cu abstraction dacă nu aduce valoare.

## 79. INTEGRATION LAYER

External APIs trebuie izolate:

```
AnthropicClient
WhatsAppClient
GoogleCalendarClient
ResendClient
StripeClient
```

Dacă schimb Twilio cu Meta, restul aplicației nu trebuie rescris.

## 80. CONFIGURATION

```
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
RESEND_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
WHATSAPP_TOKEN
WHATSAPP_VERIFY_TOKEN
NEXT_PUBLIC_APP_URL
```

Creează `.env.example`.

---

# PARTEA XVI — DEV WORKFLOW ȘI DOCUMENTAȚIE

## 81. LOCAL DEVELOPMENT

README trebuie să explice: install, env setup, database, migrations, seed, dev, test, build, lint.

Un developer nou trebuie să poată porni proiectul fără să ghicească.

## 82. CLI / SCRIPTS

`package.json` trebuie să aibă scripturi clare:

```
dev
build
start
lint
typecheck
test
test:e2e
db:migrate
db:seed
```

## 83. GIT

Commit-uri logice:

```
feat(auth): add authentication
feat(builder): add template engine
feat(crm): add lead management
fix(calendar): handle timezone conversion
```

Nu face commituri gigantice fără structură.

## 84. DOCUMENTATION

Menține:

```
README.md
ARCHITECTURE.md
DATABASE.md
SECURITY.md
AI.md
AUTOMATIONS.md
DEPLOYMENT.md
CHANGELOG.md
```

Documentația trebuie actualizată pe măsură ce proiectul evoluează.

## 85. OBSERVABILITY

Track: errors, latency, database failures, AI failures, webhook failures, automation failures, payment failures.

---

# PARTEA XVII — REZILIENȚĂ, DATE ȘI CONFORMITATE

## 86. AUTOMATION RETRIES

External services pot eșua. Construiește retry policy:

```
attempt 1 → wait → attempt 2 → wait → attempt 3 → dead letter / failed state
```

Nu crea infinite retries.

## 87. IDEMPOTENCY

Operațiuni critice trebuie să fie idempotente: Stripe webhook, WhatsApp webhook, appointment creation, email sending, automation execution.

Nu crea două appointment-uri pentru același request.

## 88. WEBHOOK SYSTEM

```
receive → authenticate → validate → identify event
→ idempotency check → process → log → respond
```

## 89. DATA RETENTION

Gândește de la început: messages, AI conversations, logs, analytics, audit logs.

Nu păstra date inutil la infinit.

## 90. GDPR

Deoarece produsul poate fi folosit în UE, include architecture pentru: privacy, consent, data deletion, export, account deletion, cookie handling, data minimization, auditability.

Nu prezenta legal compliance ca fiind automat garantată.

## 91. TERMS / PRIVACY

Platforma trebuie să aibă loc pentru: Terms, Privacy Policy, Cookie Policy, Data Processing information.

Nu inventa afirmații juridice.

## 92. ADMIN FEATURE FLAGS

```
AI_CHATBOT
WHATSAPP
CALENDAR
CRM
AUTOMATIONS
```

Poți activa/dezactiva features fără deploy.

## 93. EXPERIMENTATION

Architecture trebuie să permită `template A` / `template B` și eventual A/B testing.

Nu implementa complet A/B testing în MVP dacă nu este necesar.

---

# PARTEA XVIII — ONBOARDING INTELIGENT ȘI FEATURE LIFECYCLE

## 94. ONBOARDING RECOMMENDATION ENGINE

Pe baza: business type, business size, services, desired outcome → recomandă features.

```
You run an auto service.
We recommend:
✓ Online Booking
✓ WhatsApp
✓ AI Assistant
✓ CRM
✓ Follow-up
```

## 95. TEMPLATE GENERATION PIPELINE

Trebuie să poată fi adăugat ulterior:

```
Create new template → select business type → select sections
→ select theme → configure variants → preview → publish
```

Nu modifica manual 15 fișiere pentru un template nou.

## 96. FEATURE INSTALLATION

Când user-ul activează un feature, sistemul trebuie să știe: UI components, database requirements, settings, permissions, integrations, usage, billing, automation triggers.

## 97. FEATURE DEPENDENCIES

```
AI WhatsApp requires: WhatsApp + AI
```

Configuratorul trebuie să poată explica acest lucru.

## 98. SMART DEFAULTS

Nu cere userului să configureze 100 de lucruri. Setează defaults bune:

```
business type = auto
recommended template = auto_01
recommended features = booking + whatsapp + crm
```

## 99. PRODUCT POLISH

Interfața trebuie să arate ca un produs SaaS real. Inspiră-te conceptual din: Stripe, Linear, Vercel, Notion, Framer, Webflow, HubSpot. **Dar NU copia designul lor.**

Obiectiv: clean, premium, fast, professional.

## 100. NO PLACEHOLDER UI

Nu lăsa `Lorem ipsum`, `Coming soon`, `Button`, `Test`, `TODO` în fluxurile principale.

Dacă o funcție nu este implementată, ascunde-o sau marcheaz-o clar ca beta.

---

# PARTEA XIX — MVP ȘI PRIORITIZARE

## 101. MVP DEFINITION

MVP-ul trebuie să poată face:

```
Register
Login
Create organization
Select business type
Select template
Select features
Enter business info
Generate content
Preview website
Publish website
Capture leads
CRM
WhatsApp integration abstraction
Calendar integration
AI chatbot
Basic automation
```

## 102. CE NU TREBUIE IMPLEMENTAT PREMATUR

Nu pierde timpul inițial cu: microservices, Kubernetes, complex distributed systems, custom AI model, custom vector database dacă nu este necesar, mobile app, desktop app, 100 business types, 100 templates, advanced billing, complex drag-and-drop builder, marketplace, white-label reseller system.

Mai întâi construiește produsul central.

---

# PARTEA XX — PLAN DE EXECUȚIE PE FAZE

## 103. PHASE SYSTEM

Proiectul trebuie construit în faze. **NU** încerca să construiești totul simultan.

Fiecare fază trebuie să:

1. inspecteze codul existent;
2. identifice ce lipsește;
3. implementeze;
4. testeze;
5. ruleze lint;
6. ruleze typecheck;
7. ruleze testele;
8. repare problemele;
9. actualizeze documentația;
10. verifice că nu a spart fazele anterioare.

## 104. FAZA 0 — PROJECT AUDIT

Înainte de orice modificare: inspectează repository-ul, identifică stack-ul, structura, problemele, dependency versions; verifică environment, build, lint, tests.

**NU rescrie proiectul dacă nu este necesar.**

## 105. FAZA 1 — FOUNDATION

Implement: Next.js, TypeScript, Tailwind, shadcn, ESLint, formatting, folder architecture, env system, error handling.

**Definition of Done:** `npm run build` funcționează.

## 106. FAZA 2 — DATABASE

Implement: Supabase, migrations, core schema, RLS, seed.

**Test:** tenant A cannot read tenant B.

## 107. FAZA 3 — AUTH

Implement: signup, login, logout, password reset, protected routes, sessions, onboarding.

## 108. FAZA 4 — ORGANIZATIONS

Implement: organizations, members, roles, permissions, organization switcher.

## 109. FAZA 5 — BUSINESS TYPES

Implement registry. Seed: Auto, Vet, Lawyer, Salon, Car Wash.

## 110. FAZA 6 — FEATURE REGISTRY

Implement: CRM, WhatsApp, Calendar, AI, Chatbot, Lead Form, Email, Automation.

## 111. FAZA 7 — DESIGN SYSTEM

Build complete UI primitives.

## 112. FAZA 8 — TEMPLATE SYSTEM

Implement: template registry, template database, template sections, themes, variants.

## 113. FAZA 9 — COMPONENT LIBRARY

Implement reusable public website components.

## 114. FAZA 10 — SITE ENGINE

Implement configuration-driven rendering.

## 115. FAZA 11 — GENERATOR

Implement onboarding → generation flow.

## 116. FAZA 12 — LIVE PREVIEW

Implement preview.

## 117. FAZA 13 — WEBSITE EDITOR

Implement: edit content, section ordering, visibility, theme, branding.

## 118. FAZA 14 — PUBLISHING

Implement: draft, preview, publish, public URL.

## 119. FAZA 15 — LEADS

Implement: public forms, lead storage, validation, CRM entry, notifications.

## 120. FAZA 16 — CRM

Implement: leads, customers, statuses, notes, tags, search, filtering.

## 121. FAZA 17 — CALENDAR

Implement Google Calendar integration.

## 122. FAZA 18 — APPOINTMENTS

Implement: services, availability, booking, confirmation, cancellation, rescheduling.

## 123. FAZA 19 — WHATSAPP

Implement integration layer and webhook system.

## 124. FAZA 20 — AI

Implement: Claude client, prompt registry, AI content generator, AI chatbot, structured output, tool calling, usage tracking.

## 125. FAZA 21 — AUTOMATION ENGINE

Implement: trigger, condition, action, delay, retry.

## 126. FAZA 22 — EMAIL

Implement Resend.

## 127. FAZA 23 — ANALYTICS

Implement event tracking and dashboard.

## 128. FAZA 24 — BILLING

Implement Stripe subscriptions.

## 129. FAZA 25 — USAGE & LIMITS

Implement usage metering.

## 130. FAZA 26 — DOMAINS

Implement subdomains and architecture for custom domains.

## 131. FAZA 27 — ADMIN PANEL

Implement platform admin.

## 132. FAZA 28 — SECURITY AUDIT

Perform full security audit. Test: authentication, authorization, RLS, IDOR, XSS, CSRF, injection, webhook spoofing, rate limits, tenant isolation, secret exposure.

## 133. FAZA 29 — PERFORMANCE

Measure: page speed, DB queries, API latency, bundle size, AI latency.

Optimize only where measurement supports it.

## 134. FAZA 30 — E2E TESTING

Test complete user journeys. At minimum:

```
Signup → organization → business → template → features → generation
→ publish → lead → CRM → appointment → AI → automation
```

## 135. FAZA 31 — PRODUCTION

Configure: Vercel, Supabase production, environment variables, domain, monitoring, backups, logs, error tracking.

## 136. FAZA 32 — PRODUCT POLISH

Review every screen. Remove: awkward spacing, inconsistent components, broken responsive states, dead buttons, placeholder content, confusing UX.

## 137. FAZA 33 — COMMERCIAL READINESS

Implement: pricing page, landing page, onboarding, demo, trial, billing, support/contact, legal pages.

## 138. FAZA 34 — FINAL QA

Do a complete system audit. Check:

```
Can a new user register?
Can they create a business?
Can they generate a website?
Can they publish?
Can a visitor create a lead?
Can owner see lead?
Can customer book?
Can AI answer?
Can automation run?
Can user pay?
Can user upgrade?
Can tenant data leak?
```

If any answer is NO, fix it.

---

# PARTEA XXI — REGULI DE LUCRU PENTRU AGENT

## 139. CLAUDE CODE WORKFLOW

Înainte de fiecare fază:

1. Inspect repository.
2. Read architecture docs.
3. Identify current state.
4. Identify dependencies.
5. Plan implementation.
6. Implement.
7. Test.
8. Fix.
9. Refactor if needed.
10. Update docs.
11. Verify build.

Nu presupune că faza anterioară a fost implementată perfect. **Verifică.**

## 140. ANTI-HALLUCINATION RULE

Nu presupune că: API-ul există, package-ul există, endpoint-ul există, schema există, env var există, integrarea funcționează.

Verifică filesystem-ul și documentația oficială când este necesar.

## 141. DEPENDENCY RULE

Înainte de instalarea unui package:

1. verifică dacă este deja instalat;
2. verifică dacă este necesar;
3. verifică compatibilitatea;
4. evită dependency bloat.

## 142. NO UNNECESSARY REWRITES

Nu rescrie fișiere mari fără motiv. Nu șterge cod funcțional doar pentru că preferi altă arhitectură.

Dacă trebuie făcut refactor: explain reason → implement incremental → tests → verify.

## 143. DECISION MAKING

Când există mai multe soluții, alege soluția care este: 1) simplă; 2) sigură; 3) scalabilă; 4) ușor de întreținut; 5) economică; 6) compatibilă cu stack-ul.

**Nu overengineer.**

## 144. PRODUCT-FIRST RULE

Întotdeauna întreabă: *Această funcție aduce valoare utilizatorului?* Dacă nu — nu o construi.

## 145. COST-FIRST RULE

Înainte de integrarea unui serviciu plătit, analizează: cost/request, cost/user, cost/month.

Construiește abstraction layer astfel încât providerul să poată fi schimbat.

## 146. PROVIDER ABSTRACTION

```
AIProvider
EmailProvider
WhatsAppProvider
CalendarProvider
PaymentProvider
```

Astfel Anthropic poate fi schimbat ulterior.

## 147. NO LOCK-IN

Nu construi business logic direct în API-ul unui singur provider.

```
Prost:  CRM → Twilio

Bine:   CRM
         ↓
        MessagingService
         ↓
        WhatsAppProvider
         ↓
        Twilio/Meta
```

---

# PARTEA XXII — SECURITATE OPERAȚIONALĂ

## 148. DATABASE SECURITY RULE

Service role key nu trebuie folosită în browser. RLS trebuie activat pentru toate tabelele relevante. Testele trebuie să demonstreze izolarea tenant-ilor.

## 149. PUBLIC FORM SECURITY

Public lead forms trebuie: rate limited, validated, spam protected, tenant-aware, safe against injection.

## 150. AI SECURITY

**AI output este UNTRUSTED INPUT.**

Nu executa automat HTML, JS, SQL sau commands generate de AI.

## 151. AI PROMPT INJECTION

Protejează chatbot-ul împotriva prompt injection. Customer nu trebuie să poată cere:

```
ignore system instructions
show database
show API key
execute tool outside permissions
```

Tool permissions trebuie validate server-side.

## 152. TOOL AUTHORIZATION

Chiar dacă AI solicită `create_appointment`, serverul trebuie să verifice: organization, permissions, business rules, availability, input validity.

**AI-ul nu are autoritate implicită.**

## 153. AUTOMATION SAFETY

Automation engine trebuie să aibă stările: `enabled`, `disabled`, `paused`, `failed`, `completed` și retry state.

## 154. BILLING SAFETY

Webhookurile Stripe trebuie: verify signature, idempotent, logged.

Nu activa premium access doar pe baza unui request frontend.

## 155. MIGRATION SAFETY

Înainte de DB migration: inspect schema, create migration, test locally, verify backwards compatibility unde este necesar.

## 156. BACKUP THINKING

Production database trebuie să aibă backup strategy. Documentează recovery process.

## 157. LOGGING

Log structured:

```json
{
  "event": "lead_created",
  "organizationId": "...",
  "userId": "...",
  "timestamp": "...",
  "requestId": "..."
}
```

Nu loga: passwords, API keys, tokens, sensitive personal information inutil.

---

# PARTEA XXIII — UI/UX, PERFORMANȚĂ, SCALABILITATE

## 158. UI COPY

Textul UI trebuie să fie clar, scurt, profesional, orientat pe acțiune.

```
NU: Click here to continue to next step.
DA: Continue
```

## 159. ERROR UX

```
NU: 500 Internal Server Error

User: Something went wrong while publishing your website. Try again.
Developer logs: full technical error
```

## 160. ACCESSIBILITY + UX

Toate formularele trebuie să aibă: labels, validation, keyboard support, error messages.

## 161. MOBILE

Generated websites trebuie testate la: `375px`, `768px`, `1024px`, `1440px`.

## 162. BROWSER COMPATIBILITY

Testează cel puțin: Chrome, Safari, Edge, mobile Safari.

## 163. PERFORMANCE TARGETS

Ținte: fast initial load, minimal JS, optimized images, server rendering where appropriate.

Nu sacrifica UX doar pentru scoruri.

## 164. SCALABILITY

MVP-ul trebuie să fie capabil să evolueze de la 1 client → 10 → 100 → 1000+ fără rescriere completă.

Nu optimiza prematur pentru milioane de users.

---

# PARTEA XXIV — MODEL COMERCIAL

## 165. PRICING ARCHITECTURE

Pricing trebuie separat de business logic:

```
plans
plan_features
plan_limits
subscriptions
usage
```

## 166. FREE TRIAL

Architecture trebuie să permită: `trialing`, `active`, `past_due`, `canceled`.

## 167. SUBSCRIPTION LIFECYCLE

Gestionează: trial start, trial end, payment success, payment failed, upgrade, downgrade, cancel, renew.

## 168. CUSTOMER EXPERIENCE

User-ul trebuie să poată vedea: Current plan, Usage, Billing period, Next payment, Invoices, Upgrade, Cancel.

## 169. SUPPORT

Include: Help, Contact support, Report issue. Mai târziu: AI support assistant.

## 170. INTERNAL METRICS

Platform admin: MRR, ARR, Active customers, Churn, Trial conversion, AI cost, Infrastructure cost, Gross margin.

## 171. BUSINESS MODEL

Platforma trebuie să poată susține: Setup fee + Monthly subscription + Usage-based charges.

## 172. WHITE LABEL READY

Nu implementa complet acum. Dar arhitectura trebuie să permită ulterior:

```
agency → clients → white-label websites
```

## 173. AGENCY MODE

Viitor: Agency account, Clients, Client websites, Client billing, Client permissions.

Nu este MVP. Dar nu bloca această evoluție.

## 174. MARKETPLACE READY

Viitor: Templates, Plugins, Automations — Marketplace.

Nu implementa acum.

---

# PARTEA XXV — CALITATE PRODUS, CONȚINUT, I18N

## 175. TEMPLATE QUALITY

Fiecare template trebuie să fie modern, responsive, coherent, conversion-focused, SEO-ready.

Nu produce 50 de template-uri mediocre. Mai bine **9 foarte bune** decât **100 mediocre**.

## 176. CONVERSION DESIGN

Website templates trebuie să includă: clear CTA, social proof, trust, benefits, services, FAQs, contact, booking, WhatsApp.

## 177. AI WEBSITE PERSONALIZATION

AI trebuie să personalizeze copy, services, FAQ, CTA, SEO, tone pe baza businessului.

## 178. LANGUAGE SUPPORT

Architecture trebuie să permită ulterior: Romanian, English, Spanish, German, Italian.

Nu hard-code textul în componente.

## 179. INTERNATIONALIZATION

Folosește abstraction pentru: locale, currency, timezone, language, date format.

## 180. CURRENCY

Business poate avea RON, EUR, USD. Nu presupune RON în business logic.

## 181. TIMEZONE

Fiecare organization trebuie să aibă `timezone`. Default: `Europe/Bucharest`, dar configurabil.

## 182. DATE/TIME

Nu trata datele ca strings arbitrare. Folosește un standard consistent.

## 183. FILE STORAGE

Pentru logos, gallery, documents — folosește object storage. Nu salva fișiere binary în PostgreSQL.

## 184. IMAGE OPTIMIZATION

Optimizează imaginile: compression, responsive images, lazy loading, alt text.

## 185. SEO CONTENT QUALITY

Nu genera spam SEO. Conținutul trebuie să fie natural și business-specific.

## 186. AI CONTENT REVIEW

Permite userului să: Regenerate, Edit, Accept, Reject. AI content nu trebuie să fie ireversibil.

## 187. CONTENT VERSIONING

Architecture pentru `draft` / `published` și eventual revisions.

## 188. PUBLISH MODEL

Separă **draft configuration** de **published configuration**. Astfel userul poate modifica site-ul fără să schimbe imediat production.

## 189. ROLLBACK

Architecture pentru rollback la versiunea publicată anterior.

## 190. AUDIT LOG

Log: who, did what, when, to what.

> Exemplu: „Alex changed homepage title"

---

# PARTEA XXVI — ACCEPTANȚĂ ȘI REVIEW FINAL

## 191. FINAL ACCEPTANCE TEST

Nu considera proiectul terminat doar pentru că `npm run build` merge. Este terminat numai când:

1. user poate crea account;
2. user poate crea business;
3. user poate selecta business type;
4. user poate selecta template;
5. user poate selecta features;
6. user poate genera content;
7. user poate preview;
8. user poate publica;
9. visitor poate interacționa;
10. lead-ul ajunge în CRM;
11. appointment-ul funcționează;
12. AI funcționează;
13. automation funcționează;
14. billing funcționează;
15. security checks trec;
16. tests trec;
17. production deployment funcționează.

## 192. CUM TREBUIE SĂ LUCREZI CU MINE

Eu sunt owner-ul produsului. Nu trebuie să presupui că vreau cea mai complicată soluție.

Dacă există două variante — A = complex, B = simplu — alege **B** dacă satisface cerința.

Dacă există o decizie care poate afecta business-ul semnificativ: explică scurt opțiunile și recomandarea.

Nu mă bombarda cu întrebări pentru lucruri triviale. Ia decizii tehnice bune autonom.

## 193. IMPORTANT — NU TE OPRI PREMATUR

Dacă o fază este mare, nu încerca să faci totul într-un singur răspuns. Împarte intern implementarea în sub-task-uri. Dar continuă până când faza este realmente finalizată.

## 194. FAZA CHECKLIST

La finalul fiecărei faze răspunde:

```
PHASE:
STATUS:
IMPLEMENTED:
- ...
FILES CREATED:
- ...
FILES MODIFIED:
- ...
DATABASE:
- ...
API:
- ...
TESTS:
- ...
SECURITY:
- ...
KNOWN ISSUES:
- ...
NEXT PHASE:
- ...
```

## 195. ZERO FALSE CLAIMS

Nu spune **Done** dacă nu ai verificat.
Nu spune **tested** dacă nu ai rulat testul.
Nu spune **production ready** dacă nu ai verificat deployment/security.

## 196. SELF-REVIEW

După fiecare fază fă un review intern: Architecture review, Security review, Type safety review, UX review, Performance review, Test coverage review.

Repară problemele găsite.

## 197. FINAL CODE REVIEW

La final caută:

```
TODO
FIXME
any
console.log
hardcoded secrets
hardcoded URLs
duplicate logic
dead code
unused imports
unused dependencies
broken links
broken routes
```

Elimină tot ce nu trebuie să existe.

## 198. FINAL SECURITY REVIEW

Caută: IDOR, RLS bypass, auth bypass, tenant leak, secret exposure, XSS, SQL injection, CSRF, webhook spoofing, AI prompt injection, rate-limit bypass, privilege escalation.

## 199. FINAL PRODUCT REVIEW

Privește produsul ca un client care plătește. Întreabă: Este clar? Este rapid? Este premium? Este ușor? Este convingător? Este coerent?

Dacă nu, îmbunătățește.

## 200. ULTIMA REGULĂ

Nu optimiza pentru **numărul de linii de cod**.

Optimizează pentru: product quality, architecture, maintainability, security, UX, speed, reliability, cost, commercial viability.

Construiește un produs care poate fi vândut. Nu construi doar un proiect de portofoliu.

---

# EXECUTION COMMAND

**Începe acum.**

**PASUL 1:** Inspectează complet repository-ul existent. Nu modifica nimic încă.

Raportează:

1. Current stack
2. Current architecture
3. Existing features
4. Existing database
5. Existing dependencies
6. Existing problems
7. Missing infrastructure
8. Recommended migration path
9. Exact implementation plan
10. First phase to execute

După audit, începe automat cu **FAZA 1** dacă proiectul este gol.

Dacă proiectul conține deja cod, adaptează planul la ceea ce există.

- NU rescrie inutil.
- Construiește incremental.
- Verifică fiecare fază.
- Testează fiecare fază.
- Documentează fiecare fază.
- Continuă până când produsul este complet.
