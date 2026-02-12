# GoDash - Analytics & Metrics Document
## Measurement Framework & Data Strategy

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Equipo:** Product & Data  
**Stack:** Posthog, PostgreSQL, Metabase

---

# TABLA DE CONTENIDOS

1. [Framework de Métricas](#1-framework-de-métricas)
2. [Métricas de Producto](#2-métricas-de-producto)
3. [Métricas de Negocio](#3-métricas-de-negocio)
4. [Eventos a Trackear](#4-eventos-a-trackear)
5. [Dashboards](#5-dashboards)
6. [Data Warehouse](#6-data-warehouse)
7. [Implementación Técnica](#7-implementación-técnica)

---

# 1. FRAMEWORK DE MÉTRICAS

## 1.1 Pirámide de Métricas

```
          ┌─────────────────┐
          │  North Star     │  Simulaciones completadas/semana
          │  Metric         │  (proxy de aprendizaje activo)
          └─────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
    ┌───▼────┐         ┌────▼───┐
    │ Input  │         │ Output │
    │Metrics │         │Metrics │
    └────────┘         └────────┘
        │                   │
    ┌───▼────────────┐ ┌───▼──────────┐
    │ - Signups      │ │ - Retention  │
    │ - Onboarding   │ │ - Conversión │
    │ - Engagement   │ │ - Revenue    │
    └────────────────┘ └──────────────┘
```

## 1.2 North Star Metric

**Métrica:** Simulaciones completadas por usuario activo por semana (WAU)

**Por qué:**
- Proxy directo de aprendizaje activo (core value)
- Predice retención y conversión
- Balanceable: no incentiva cantidad sin calidad

**Target:**
- MVP: 2-3 simulaciones/semana
- Product-Market Fit: 5-8 simulaciones/semana
- Scale: 8-12 simulaciones/semana

## 1.3 Métricas Secundarias

**Activación:** % usuarios que completan ≥3 simulaciones en D7  
**Retención:** D7, D30 retention  
**Monetización:** Free → Pro conversion rate  
**Satisfacción:** NPS score

---

# 2. MÉTRICAS DE PRODUCTO

## 2.1 Acquisition (Adquisición)

### Signups
```sql
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as signups,
  COUNT(*) FILTER (WHERE source = 'organic') as organic,
  COUNT(*) FILTER (WHERE source = 'paid') as paid
FROM profiles
GROUP BY date
ORDER BY date DESC;
```

**Targets:**
- MVP: 50 signups/semana
- PMF: 200 signups/semana
- Scale: 1000+ signups/semana

**Dimensiones a trackear:**
- Source (organic, paid, referral, direct)
- Medium (google, linkedin, twitter, facebook)
- Campaign (si es paid)
- Landing page visitada

---

### Onboarding Completion

**Funnel:**
```
Sign Up (100%)
    ↓ -20%
Email Verification (80%)
    ↓ -15%
Onboarding Q1 (65%)
    ↓ -10%
Onboarding Q2 (55%)
    ↓ -5%
Onboarding Q3 (50%)
    ↓ -10%
Track Selected (40%)
```

**Métricas:**
- % completó onboarding completo (target: >60%)
- Tiempo promedio para completar (target: <5 min)
- Dropout por step (identificar dónde abandonan)

**Query:**
```sql
SELECT 
  COUNT(*) as total_signups,
  COUNT(*) FILTER (WHERE email_verified) as verified,
  COUNT(*) FILTER (WHERE onboarding_completed) as completed_onboarding,
  COUNT(*) FILTER (WHERE first_track_id IS NOT NULL) as selected_track
FROM profiles
WHERE created_at >= NOW() - INTERVAL '7 days';
```

---

## 2.2 Activation (Activación)

### Definición de Usuario Activado

Usuario que completó ≥3 simulaciones en los primeros 7 días.

**Rationale:**
- 1 simulación: Puede ser curiosidad
- 2 simulaciones: Está probando
- 3+ simulaciones: Vio valor, está enganchado

**Metrics:**
```sql
SELECT 
  COUNT(DISTINCT user_id) as activated_users
FROM (
  SELECT 
    user_id,
    COUNT(*) as sims_in_d7
  FROM simulations
  WHERE created_at <= (
    SELECT created_at + INTERVAL '7 days' 
    FROM profiles 
    WHERE profiles.id = simulations.user_id
  )
  GROUP BY user_id
  HAVING COUNT(*) >= 3
) as subquery;
```

**Target Activation Rate:**
- MVP: 30% (bajo, esperado)
- PMF: 50%
- Scale: 65%+

---

### Time to First Value (TTFV)

Tiempo desde signup hasta primera simulación completada.

**Targets:**
- P50: <30 minutos
- P90: <2 horas

**Métricas de velocidad:**
- % usuarios que completan primera sim en <30 min
- % usuarios que completan primera sim en D0 (mismo día de registro)

---

## 2.3 Engagement (Compromiso)

### Weekly Active Users (WAU)

Usuario activo = completó ≥1 simulación en los últimos 7 días.

```sql
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(DISTINCT user_id) as wau
FROM simulations
WHERE created_at >= NOW() - INTERVAL '8 weeks'
GROUP BY week
ORDER BY week DESC;
```

**Target Growth:**
- WoW (Week over Week): +10-15%
- MoM (Month over Month): +40-60%

---

### Simulaciones por Usuario

**Distribución esperada (PMF):**
```
Power Users (20%):  12+ sims/semana
Core Users (30%):   5-11 sims/semana
Casual Users (30%): 2-4 sims/semana
At Risk (20%):      0-1 sims/semana
```

**Metrics:**
```sql
SELECT 
  user_id,
  COUNT(*) as sims_last_7d,
  CASE 
    WHEN COUNT(*) >= 12 THEN 'power'
    WHEN COUNT(*) >= 5 THEN 'core'
    WHEN COUNT(*) >= 2 THEN 'casual'
    ELSE 'at_risk'
  END as user_segment
FROM simulations
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY user_id;
```

---

### Session Duration

Tiempo promedio por sesión de simulación.

**Targets:**
- LEARN módulos: 5-7 min
- TRAIN (Reflex Gym): 5-10 min
- EXECUTE (Deal Room): 10-20 min

**Alert si:**
- Avg session <5 min (usuarios abandonando rápido)
- Avg session >30 min (posible fricción/confusión)

---

### Feature Usage

% de usuarios que usan cada motor:

```sql
SELECT 
  COUNT(DISTINCT user_id) FILTER (WHERE module_type = 'learn') as learn_users,
  COUNT(DISTINCT user_id) FILTER (WHERE module_type = 'train') as train_users,
  COUNT(DISTINCT user_id) FILTER (WHERE module_type = 'execute') as execute_users,
  COUNT(DISTINCT user_id) as total_users
FROM (
  SELECT user_id, 'learn' as module_type FROM learning_sessions
  UNION ALL
  SELECT user_id, 'train' FROM objection_drills
  UNION ALL
  SELECT user_id, 'execute' FROM simulations
) as all_activity;
```

**Targets:**
- LEARN: 70% de usuarios usan al menos 1 vez
- TRAIN: 60% de usuarios usan regularmente (2+ veces/semana)
- EXECUTE: 90% de usuarios (core value prop)

---

### Tracks Completados

% de tracks iniciados que se completan.

```sql
SELECT 
  AVG(CASE WHEN completed = true THEN 1 ELSE 0 END) as completion_rate,
  AVG(current_module_index::float / 
      (syllabus_data->'modules'->0->>'total_count')::float) as avg_progress
FROM learning_paths
WHERE created_at >= NOW() - INTERVAL '30 days';
```

**Target Completion Rate:**
- MVP: 20% (muchos abandonan explorando)
- PMF: 35%
- Scale: 45%+

---

## 2.4 Retention (Retención)

### Cohort Retention

```sql
WITH cohorts AS (
  SELECT 
    user_id,
    DATE_TRUNC('week', created_at) as cohort_week
  FROM profiles
),
activity AS (
  SELECT 
    user_id,
    DATE_TRUNC('week', created_at) as activity_week
  FROM simulations
)
SELECT 
  c.cohort_week,
  COUNT(DISTINCT c.user_id) as cohort_size,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week THEN a.user_id END) as week_0,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '1 week' THEN a.user_id END) as week_1,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '2 weeks' THEN a.user_id END) as week_2,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '4 weeks' THEN a.user_id END) as week_4
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.cohort_week
ORDER BY c.cohort_week DESC;
```

**Target Retention Rates:**
```
D1:  70%
D7:  45%
D14: 40%
D30: 35%
D90: 25%
```

---

### Churn Rate

```sql
SELECT 
  DATE_TRUNC('month', month) as month,
  churned_users,
  active_users_start_of_month,
  (churned_users::float / active_users_start_of_month) * 100 as churn_rate_pct
FROM (
  SELECT 
    month,
    COUNT(DISTINCT user_id) FILTER (
      WHERE last_activity < month AND last_activity >= month - INTERVAL '1 month'
    ) as churned_users,
    COUNT(DISTINCT user_id) FILTER (
      WHERE last_activity >= month - INTERVAL '1 month'
    ) as active_users_start_of_month
  FROM (
    SELECT 
      user_id,
      MAX(created_at) as last_activity,
      generate_series(
        DATE_TRUNC('month', MIN(created_at)),
        DATE_TRUNC('month', NOW()),
        '1 month'
      ) as month
    FROM simulations
    GROUP BY user_id
  ) as user_activity
  GROUP BY month
) as churn_data
ORDER BY month DESC;
```

**Target Monthly Churn:**
- Free users: <15%
- Pro users: <8%
- Expert users: <5%

---

### Resurrection Rate

% de usuarios churneados que vuelven.

```sql
SELECT 
  COUNT(DISTINCT user_id) FILTER (
    WHERE last_sim_before_gap < NOW() - INTERVAL '30 days'
    AND last_sim_after_gap >= NOW() - INTERVAL '7 days'
  ) as resurrected_users,
  COUNT(DISTINCT user_id) FILTER (
    WHERE last_sim_before_gap < NOW() - INTERVAL '30 days'
  ) as total_churned
FROM user_activity_gaps;
```

**Target Resurrection Rate:** 10-15%

---

## 2.5 Quality Metrics (Calidad del Producto)

### Average Simulation Score

```sql
SELECT 
  DATE_TRUNC('week', created_at) as week,
  AVG(overall_score) as avg_score,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY overall_score) as median_score,
  STDDEV(overall_score) as score_stddev
FROM simulations
WHERE created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY week
ORDER BY week DESC;
```

**Targets:**
- Avg score aumenta con el tiempo (aprendizaje)
- New users: 50-60 (esperado, están aprendiendo)
- Experienced users (30+ sims): 70-80

---

### Score Improvement Rate

Mejora de score en últimos 30 días vs. primeros 30 días.

```sql
WITH user_scores AS (
  SELECT 
    user_id,
    AVG(overall_score) FILTER (
      WHERE created_at <= (SELECT created_at + INTERVAL '30 days' FROM profiles WHERE id = user_id)
    ) as first_30d_score,
    AVG(overall_score) FILTER (
      WHERE created_at >= NOW() - INTERVAL '30 days'
    ) as last_30d_score
  FROM simulations
  GROUP BY user_id
)
SELECT 
  AVG(last_30d_score - first_30d_score) as avg_improvement,
  COUNT(*) FILTER (WHERE last_30d_score > first_30d_score) as users_improved,
  COUNT(*) as total_users
FROM user_scores
WHERE first_30d_score IS NOT NULL AND last_30d_score IS NOT NULL;
```

**Target:** 80%+ de usuarios mejoran su score en 30 días

---

### Feedback Quality (NPS por Agente)

```sql
SELECT 
  feedback_type, -- 'architect', 'producer', 'actor', 'analyst'
  AVG(rating) as avg_rating,
  COUNT(*) as total_ratings
FROM ai_feedback_ratings
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY feedback_type;
```

**Target:** Avg rating >4.0/5 para cada agente

---

### Bug & Error Rate

```sql
SELECT 
  error_type,
  COUNT(*) as occurrences,
  COUNT(DISTINCT user_id) as affected_users
FROM error_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY error_type
ORDER BY occurrences DESC;
```

**Alert si:**
- Cualquier error afecta >5% de usuarios activos
- Error crítico (simulación no carga, pago falla) ocurre >1 vez/día

---

## 2.6 Behavioral Metrics (Comportamiento del Usuario)

### Channel Preference

```sql
SELECT 
  channel,
  COUNT(*) as simulations,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(overall_score) as avg_score
FROM simulations
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY channel
ORDER BY simulations DESC;
```

**Insights esperados:**
- WhatsApp: Mayor volumen (más fácil, rápido)
- Phone: Menor volumen pero mayor score (práctica más valiosa)
- F2F: Usado por seniors principalmente

---

### Drill Performance (Reflex Gym)

```sql
SELECT 
  objection_type,
  COUNT(*) as times_practiced,
  AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) as success_rate,
  AVG(response_time_seconds) as avg_response_time
FROM objection_drills
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY objection_type
ORDER BY times_practiced DESC;
```

**Insights:**
- Objeciones con success rate <50% necesitan mejor contenido educativo
- Response time >5 seg indica que no está automatizado

---

### Feature Discovery

Tiempo hasta que usuario descubre cada feature.

```sql
SELECT 
  AVG(first_learn - signup) as time_to_discover_learn,
  AVG(first_train - signup) as time_to_discover_train,
  AVG(first_execute - signup) as time_to_discover_execute
FROM (
  SELECT 
    p.id as user_id,
    p.created_at as signup,
    MIN(ls.created_at) as first_learn,
    MIN(od.created_at) as first_train,
    MIN(s.created_at) as first_execute
  FROM profiles p
  LEFT JOIN learning_sessions ls ON p.id = ls.user_id
  LEFT JOIN objection_drills od ON p.id = od.user_id
  LEFT JOIN simulations s ON p.id = s.user_id
  GROUP BY p.id, p.created_at
) as discovery;
```

**Target:** <1 hora para descubrir EXECUTE (core feature)

---

# 3. MÉTRICAS DE NEGOCIO

## 3.1 Revenue Metrics

### MRR (Monthly Recurring Revenue)

```sql
SELECT 
  DATE_TRUNC('month', subscription_start) as month,
  SUM(monthly_amount) as mrr
FROM subscriptions
WHERE status = 'active'
GROUP BY month
ORDER BY month DESC;
```

**Breakdown por plan:**
```sql
SELECT 
  plan_type,
  COUNT(*) as subscribers,
  SUM(monthly_amount) as mrr
FROM subscriptions
WHERE status = 'active'
GROUP BY plan_type;
```

---

### ARR (Annual Recurring Revenue)

```
ARR = MRR × 12
```

**Target Growth:**
- Año 1: $50-100k ARR
- Año 2: $500k-1M ARR
- Año 3: $3-5M ARR

---

### ARPU (Average Revenue Per User)

```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(total_revenue) / COUNT(DISTINCT user_id) as arpu
FROM payments
GROUP BY month
ORDER BY month DESC;
```

**Target ARPU (mensual):**
- Mix Free/Pro/Expert: $8-12

---

## 3.2 Conversion Metrics

### Free → Pro Conversion

```sql
SELECT 
  COUNT(*) FILTER (WHERE plan = 'pro' OR plan = 'expert') as paid_users,
  COUNT(*) as total_users,
  (COUNT(*) FILTER (WHERE plan = 'pro' OR plan = 'expert')::float / COUNT(*)) * 100 as conversion_rate
FROM profiles
WHERE created_at >= NOW() - INTERVAL '90 days';
```

**Target:** 8-12% conversion en primeros 30 días

**Funnel de conversión:**
```
Free User (100%)
    ↓
Hit paywall (simulación #6) (60%)
    ↓
Click "Upgrade" (25%)
    ↓
Enter payment info (15%)
    ↓
Complete payment (12%)
```

---

### Trial → Paid (si aplicable)

Si se implementa trial de 7 días:

```sql
SELECT 
  COUNT(*) FILTER (WHERE converted_to_paid = true) as converted,
  COUNT(*) as total_trials,
  (COUNT(*) FILTER (WHERE converted_to_paid = true)::float / COUNT(*)) * 100 as trial_conversion_rate
FROM trial_users
WHERE trial_end_date >= NOW() - INTERVAL '30 days';
```

**Target:** 40-60% trial conversion

---

### Upsell (Pro → Expert)

```sql
SELECT 
  COUNT(*) FILTER (WHERE current_plan = 'expert' AND previous_plan = 'pro') as upsells,
  COUNT(*) FILTER (WHERE current_plan = 'pro') as eligible_users,
  (COUNT(*) FILTER (WHERE current_plan = 'expert' AND previous_plan = 'pro')::float / 
   COUNT(*) FILTER (WHERE current_plan = 'pro')) * 100 as upsell_rate
FROM plan_changes
WHERE created_at >= NOW() - INTERVAL '30 days';
```

**Target:** 15-20% upsell rate de Pro a Expert

---

## 3.3 Unit Economics

### CAC (Customer Acquisition Cost)

```
CAC = Total Marketing + Sales Spend / New Customers Acquired
```

**Breakdown por canal:**
```sql
SELECT 
  acquisition_source,
  SUM(ad_spend) / COUNT(DISTINCT user_id) as cac
FROM user_acquisition
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY acquisition_source;
```

**Target CAC:** <$40

---

### LTV (Lifetime Value)

```
LTV = ARPU × Avg Customer Lifetime (months)
```

**Calculation:**
```sql
WITH user_lifetimes AS (
  SELECT 
    user_id,
    EXTRACT(EPOCH FROM (MAX(subscription_end) - MIN(subscription_start))) / 2592000 as lifetime_months,
    SUM(amount_paid) as total_revenue
  FROM subscriptions
  GROUP BY user_id
)
SELECT 
  AVG(lifetime_months) as avg_lifetime_months,
  AVG(total_revenue) as avg_ltv
FROM user_lifetimes;
```

**Target LTV:** >$180 (12 meses)

---

### LTV:CAC Ratio

```
LTV:CAC = LTV / CAC
```

**Target:** >3:1 (saludable), >5:1 (excelente)

---

### Payback Period

```
Payback Period = CAC / Monthly Revenue per Customer
```

**Target:** <6 meses

---

## 3.4 Churn & Retention (Revenue)

### Revenue Churn Rate

```sql
SELECT 
  DATE_TRUNC('month', churned_at) as month,
  SUM(monthly_amount) as churned_mrr,
  (SELECT SUM(monthly_amount) FROM subscriptions WHERE status = 'active' 
   AND created_at < month) as mrr_start_of_month,
  (SUM(monthly_amount)::float / 
   (SELECT SUM(monthly_amount) FROM subscriptions WHERE status = 'active' AND created_at < month)) * 100 
   as revenue_churn_rate
FROM subscriptions
WHERE status = 'cancelled'
GROUP BY month
ORDER BY month DESC;
```

**Target Revenue Churn:** <5% mensual

---

### Net Revenue Retention (NRR)

```
NRR = (Starting MRR + Expansion - Downgrades - Churn) / Starting MRR
```

**Target NRR:** >100% (expansion > churn)

---

# 4. EVENTOS A TRACKEAR

## 4.1 User Events

### Authentication

```javascript
// Sign Up
posthog.capture('user_signed_up', {
  source: 'organic' | 'paid' | 'referral',
  medium: 'google' | 'linkedin' | 'twitter',
  campaign: 'campaign_name' // if applicable
});

// Login
posthog.capture('user_logged_in', {
  method: 'email' | 'google' | 'linkedin'
});
```

---

### Onboarding

```javascript
// Onboarding Started
posthog.capture('onboarding_started', {
  timestamp: Date.now()
});

// Each Step
posthog.capture('onboarding_step_completed', {
  step: 1 | 2 | 3,
  experience_level: 'junior' | 'mid' | 'senior',
  training_goal: 'new_product' | 'objections' | 'channel' | 'pitch',
  time_commitment: '10-15min' | '30-60min' | '1-2hours'
});

// Onboarding Completed
posthog.capture('onboarding_completed', {
  duration_seconds: 240,
  experience_level: 'mid',
  training_goal: 'objections'
});
```

---

### Track Selection

```javascript
// Track Browsed
posthog.capture('track_browsed', {
  track_type: 'standard' | 'custom',
  track_id: 'uuid'
});

// Track Started
posthog.capture('track_started', {
  track_type: 'standard' | 'custom',
  track_id: 'uuid',
  track_title: 'Venta SaaS B2B',
  estimated_duration_weeks: 4
});

// AI Track Generated (custom)
posthog.capture('ai_track_generated', {
  user_prompt: 'Vender maquinaria agrícola...',
  generation_time_seconds: 45,
  modules_count: 10
});
```

---

### Module Progression

```javascript
// Module Started
posthog.capture('module_started', {
  track_id: 'uuid',
  module_id: 'm3',
  module_type: 'learn' | 'train' | 'execute',
  module_title: 'Discovery con SPIN'
});

// Module Completed
posthog.capture('module_completed', {
  track_id: 'uuid',
  module_id: 'm3',
  module_type: 'execute',
  duration_seconds: 840,
  score: 72
});
```

---

### Simulations (Deal Room)

```javascript
// Simulation Started
posthog.capture('simulation_started', {
  track_id: 'uuid',
  module_id: 'm5',
  channel: 'whatsapp' | 'email' | 'phone' | 'f2f',
  difficulty: 1 | 2 | 3 | 4,
  client_persona: {
    role: 'CFO',
    personality: 'analytical'
  }
});

// Message Sent (during simulation)
posthog.capture('simulation_message_sent', {
  simulation_id: 'uuid',
  message_index: 5,
  character_count: 87,
  time_since_last_message_seconds: 12
});

// Simulation Ended
posthog.capture('simulation_ended', {
  simulation_id: 'uuid',
  duration_seconds: 720,
  messages_count: 18,
  outcome: 'won' | 'lost' | 'followup',
  overall_score: 72,
  discovery_score: 85,
  qualification_score: 60,
  objection_handling_score: 75,
  closing_score: 55
});

// Feedback Viewed
posthog.capture('simulation_feedback_viewed', {
  simulation_id: 'uuid',
  time_to_view_seconds: 5
});

// Retry Simulation
posthog.capture('simulation_retried', {
  simulation_id: 'uuid',
  previous_score: 72
});
```

---

### Reflex Gym (Drills)

```javascript
// Drill Session Started
posthog.capture('drill_session_started', {
  objections_count: 10
});

// Objection Answered
posthog.capture('objection_answered', {
  objection_id: 'uuid',
  objection_type: 'price' | 'timing' | 'authority' | 'competition',
  is_correct: true | false,
  response_time_seconds: 2.3,
  attempt_number: 1
});

// Drill Session Completed
posthog.capture('drill_session_completed', {
  objections_count: 10,
  correct_count: 8,
  avg_response_time_seconds: 2.5,
  duration_seconds: 180
});
```

---

### Analytics & Dashboard

```javascript
// Dashboard Viewed
posthog.capture('dashboard_viewed', {
  view_type: 'overview' | 'by_channel' | 'by_skill' | 'history'
});

// Skill Clicked (for detail)
posthog.capture('skill_detail_viewed', {
  skill: 'discovery' | 'qualification' | 'objections' | 'closing',
  current_score: 85
});

// Export Data
posthog.capture('data_exported', {
  export_type: 'csv' | 'pdf',
  date_range: '30days'
});
```

---

### Payments & Subscriptions

```javascript
// Paywall Hit
posthog.capture('paywall_hit', {
  trigger: 'simulation_limit' | 'feature_locked',
  current_plan: 'free',
  simulations_completed: 5
});

// Upgrade Flow Started
posthog.capture('upgrade_flow_started', {
  from_plan: 'free',
  to_plan: 'pro' | 'expert'
});

// Payment Info Entered
posthog.capture('payment_info_entered', {
  to_plan: 'pro'
});

// Subscription Created
posthog.capture('subscription_created', {
  plan: 'pro' | 'expert',
  billing_cycle: 'monthly' | 'annual',
  amount: 29
});

// Subscription Cancelled
posthog.capture('subscription_cancelled', {
  plan: 'pro',
  reason: 'too_expensive' | 'not_using' | 'switched_competitor' | 'other',
  months_active: 3
});
```

---

### Errors & Issues

```javascript
// Error Encountered
posthog.capture('error_encountered', {
  error_type: 'api_error' | 'ui_error' | 'network_error',
  error_message: 'Failed to load simulation',
  page: '/deal-room',
  severity: 'critical' | 'high' | 'medium' | 'low'
});

// Bug Report Submitted
posthog.capture('bug_reported', {
  description: 'Simulation freezes at message 5',
  category: 'simulation' | 'ui' | 'performance' | 'other'
});
```

---

## 4.2 Properties on All Events

Incluir en cada evento:

```javascript
{
  // User Properties
  user_id: 'uuid',
  email: 'user@example.com',
  experience_level: 'junior' | 'mid' | 'senior',
  plan: 'free' | 'pro' | 'expert',
  signup_date: '2026-01-15',
  
  // Session Properties
  session_id: 'uuid',
  platform: 'web' | 'mobile',
  browser: 'chrome' | 'safari' | 'firefox',
  device_type: 'desktop' | 'tablet' | 'mobile',
  
  // Feature Flags (if A/B testing)
  feature_flags: {
    new_onboarding: true,
    ai_tracks_enabled: false
  }
}
```

---

# 5. DASHBOARDS

## 5.1 Executive Dashboard

**Audience:** Founders, stakeholders  
**Update Frequency:** Daily  
**Metrics:**

```
┌──────────────────────────────────────────────┐
│  Key Metrics (Last 30 Days)                  │
├──────────────────────────────────────────────┤
│  MRR: $12,450 (+23% MoM)                     │
│  Active Users: 347 (+15% WoW)                │
│  Simulations/Week: 2,184 (+18% WoW)          │
│  Free → Pro Conversion: 9.2% (↑ 1.2pp)      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Growth Trajectory                            │
│  [Line Chart: MRR, Users, Sims over 12 weeks]│
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Cohort Retention                             │
│  [Heatmap: Week 0-12 retention by cohort]    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Unit Economics                               │
│  CAC: $38 | LTV: $186 | Ratio: 4.9:1        │
│  Payback: 5.2 months                         │
└──────────────────────────────────────────────┘
```

---

## 5.2 Product Dashboard

**Audience:** Product team  
**Update Frequency:** Real-time  
**Metrics:**

```
┌──────────────────────────────────────────────┐
│  Activation Funnel (Last 7 Days)             │
├──────────────────────────────────────────────┤
│  Signups:             120 (100%)             │
│  Email Verified:       96 (80%)  ↓ -20%     │
│  Onboarding Complete:  72 (60%)  ↓ -25%     │
│  First Simulation:     54 (45%)  ↓ -25%     │
│  3+ Simulations (D7):  36 (30%)  ↓ -33%     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Feature Usage (WAU %)                       │
│  EXECUTE (Deal Room):  87%  ████████░        │
│  TRAIN (Reflex Gym):   62%  ██████░░░        │
│  LEARN (Academia):     71%  ███████░░        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Quality Metrics                              │
│  Avg Simulation Score: 68/100 (↑ 3 pts)     │
│  % Users Improving: 78%                      │
│  AI Feedback Rating: 4.2/5                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Top Dropoff Points                          │
│  1. Onboarding Step 2 (15% dropout)         │
│  2. First simulation setup (10% dropout)    │
│  3. Module 5 of tracks (8% dropout)         │
└──────────────────────────────────────────────┘
```

---

## 5.3 Growth Dashboard

**Audience:** Growth/Marketing team  
**Update Frequency:** Daily  
**Metrics:**

```
┌──────────────────────────────────────────────┐
│  Acquisition (Last 30 Days)                  │
├──────────────────────────────────────────────┤
│  Signups: 520                                │
│  By Source:                                  │
│    Organic:  312 (60%)                       │
│    Paid:     156 (30%)                       │
│    Referral:  52 (10%)                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  CAC by Channel                               │
│  Google Ads:   $42                           │
│  LinkedIn:     $58                           │
│  Twitter:      $31                           │
│  Organic:      $0                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Conversion Funnel                            │
│  Landing Page Views: 2,450                   │
│  Sign Up Started:      520 (21%)             │
│  Email Verified:       416 (80%)             │
│  Activated (3+ sims):  156 (30%)             │
│  Converted to Paid:     48 (9%)              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Best Performing Campaigns                   │
│  1. "Practice Sales with AI" (Google) - CAC $28│
│  2. "Sales Training Reimagined" (LinkedIn) - $35│
│  3. Referral Program - $0                    │
└──────────────────────────────────────────────┘
```

---

## 5.4 Engineering Dashboard

**Audience:** Engineering team  
**Update Frequency:** Real-time  
**Metrics:**

```
┌──────────────────────────────────────────────┐
│  System Health (Last 24 Hours)               │
├──────────────────────────────────────────────┤
│  Uptime: 99.8%                               │
│  API Latency (P95): 240ms                    │
│  Error Rate: 0.03%                           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  AI Performance                               │
│  Architect Generation Time: 18s              │
│  Producer Generation Time: 45s               │
│  Actor Response Time (P95): 2.1s             │
│  Whisper Transcription: 1.8s                 │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Cost Metrics (Last 30 Days)                 │
│  Total OpenAI API Cost: $1,248               │
│  Cost per Active User: $3.60                 │
│  Cost per Simulation: $0.57                  │
│  Cache Hit Rate: 68%                         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  Top Errors (Last 7 Days)                    │
│  1. Simulation timeout (12 occurrences)     │
│  2. Whisper API rate limit (8 occurrences)  │
│  3. Track generation failed (5 occurrences) │
└──────────────────────────────────────────────┘
```

---

# 6. DATA WAREHOUSE

## 6.1 Dimensional Model

### Fact Tables

**fact_simulations**
```
simulation_id (PK)
user_id (FK)
track_id (FK)
date_id (FK)
channel_id (FK)
client_persona_id (FK)
duration_seconds
messages_count
user_talk_percentage
outcome
overall_score
discovery_score
qualification_score
objection_handling_score
closing_score
```

**fact_user_activity**
```
activity_id (PK)
user_id (FK)
date_id (FK)
event_type (FK)
properties_json
```

### Dimension Tables

**dim_users**
```
user_id (PK)
email
experience_level
training_goal
signup_date
current_plan
plan_start_date
```

**dim_tracks**
```
track_id (PK)
track_type
title
industry
estimated_duration_weeks
modules_count
```

**dim_dates**
```
date_id (PK)
date
year
quarter
month
week
day_of_week
is_weekend
```

---

## 6.2 ETL Process

**Tools:** dbt (data build tool) + Airbyte

**Flow:**
```
Supabase (source)
    ↓
Airbyte (extraction)
    ↓
Data Warehouse (Postgres/BigQuery)
    ↓
dbt (transformation)
    ↓
Metabase (visualization)
```

**Update Frequency:**
- Raw data: Real-time (via Supabase replication)
- Aggregated tables: Every 1 hour
- Executive dashboards: Every 24 hours

---

# 7. IMPLEMENTACIÓN TÉCNICA

## 7.1 Posthog Setup

```javascript
// _app.tsx (Next.js)
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    }
  });
}

export default function App({ Component, pageProps }) {
  return (
    <PostHogProvider client={posthog}>
      <Component {...pageProps} />
    </PostHogProvider>
  );
}
```

---

## 7.2 Tracking Helper

```typescript
// utils/analytics.ts
import posthog from 'posthog-js';

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.capture(event, properties);
    }
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, traits);
    }
  },
  
  page: (name: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.capture('$pageview', { page: name, ...properties });
    }
  }
};
```

---

## 7.3 Usage Examples

```typescript
// components/DealRoom.tsx
import { analytics } from '@/utils/analytics';

export function DealRoom() {
  const startSimulation = () => {
    analytics.track('simulation_started', {
      track_id: track.id,
      channel: selectedChannel,
      difficulty: difficultyLevel,
      client_persona: clientConfig
    });
    
    // ... start simulation logic
  };
  
  const endSimulation = (result: SimulationResult) => {
    analytics.track('simulation_ended', {
      simulation_id: result.id,
      duration_seconds: result.duration,
      outcome: result.outcome,
      overall_score: result.score,
      discovery_score: result.skillScores.discovery,
      qualification_score: result.skillScores.qualification,
      objection_handling_score: result.skillScores.objectionHandling,
      closing_score: result.skillScores.closing
    });
  };
}
```

---

## 7.4 A/B Testing Setup

```typescript
// utils/experiments.ts
export const experiments = {
  getVariant: (experimentKey: string): string => {
    if (typeof window !== 'undefined') {
      return posthog.getFeatureFlag(experimentKey) as string || 'control';
    }
    return 'control';
  },
  
  isEnabled: (featureFlag: string): boolean => {
    if (typeof window !== 'undefined') {
      return posthog.isFeatureEnabled(featureFlag) || false;
    }
    return false;
  }
};

// Usage
const onboardingVariant = experiments.getVariant('onboarding_v2');
// Returns: 'control' | 'variant_a' | 'variant_b'
```

---

## 7.5 Alerts & Monitoring

**Setup in Posthog:**

```javascript
// Critical Alerts (Slack/Email)
- Error rate > 1% (5-minute window)
- API latency P95 > 3s (5-minute window)
- Signup → First simulation conversion < 30% (24-hour window)
- MRR drops > 10% WoW

// Warning Alerts
- D7 retention < 40% (weekly)
- Churn rate > 10% (monthly)
- AI cost per user > $5 (weekly)
```

---

**Documento preparado para equipos de Product, Growth y Engineering.**  
**Versión 1.0 - Febrero 2026**
