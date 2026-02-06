# GoDash - Sales Training Platform
## Resumen Ejecutivo del Proyecto

**Versión:** 6.0  
**Fecha:** Febrero 2026  
**Tipo:** Plataforma B2B/B2C AI-Native para entrenamiento comercial

---

## 1. VISIÓN

GoDash es un gimnasio digital de ventas que transforma la capacitación comercial mediante simulaciones hiperrealistas impulsadas por IA. Los vendedores practican ilimitadamente sin consecuencias, reciben feedback inmediato y mejoran su tasa de cierre en 15-25% dentro de 90 días.

**Misión:** Reducir el tiempo de desarrollo de habilidades comerciales en 1/3 vs. métodos tradicionales mediante práctica deliberada y feedback accionable.

---

## 2. EL PROBLEMA

### Capacitación Tradicional No Funciona

**Síntoma 1: Contenido Genérico**  
Los cursos anuales enseñan teoría descontextualizada que no se adapta al canal de venta real (presencial, teléfono, WhatsApp, email). El vendedor no sabe cómo aplicar SPIN Selling en una llamada fría vs. una reunión ejecutiva.

**Síntoma 2: Práctica Insuficiente**  
El roleplay con colegas genera ansiedad social, no proporciona feedback objetivo y se hace 1-2 veces al año. Los vendedores no practican hasta dominar, solo hasta "completar el ejercicio".

**Síntoma 3: Aprendizaje Costoso**  
Los vendedores aprenden perdiendo deals reales. No existe espacio seguro para experimentar técnicas nuevas, cometer errores y recibir feedback sin que el costo sea perder la venta.

### Impacto Medible

- **Ramping lento:** Nuevos vendedores tardan 3-6 meses en ser productivos
- **Alta rotación:** 35% de vendedores se van en el primer año por falta de confianza/resultados
- **Resultados inconsistentes:** Solo 20% del equipo logra quota consistentemente
- **Oportunidad perdida:** Miles de horas de práctica necesarias nunca ocurren

---

## 3. LA SOLUCIÓN

### Gimnasio Digital de Ventas 24/7

GoDash es una plataforma donde los vendedores practican con clientes IA en simulaciones hiperrealistas, reciben feedback inmediato cuantificado y automatizan respuestas a objeciones mediante repetición espaciada.

### Propuesta de Valor por Segmento

**Para Empresas (B2B):**
- Reducir ramping de nuevos vendedores en 40% (de 12 semanas a 6-7)
- Mejorar tasa de cierre del equipo en 15-25% en 90 días
- Escalabilidad: entrenar a 100 vendedores sin contratar más trainers
- Visibilidad: dashboard de manager muestra performance del equipo

**Para Individuales (B2C):**
- Práctica ilimitada sin costo de coach/mentor
- Preparación para deals importantes sin riesgo
- Aprender a vender en industrias nuevas rápidamente
- Certificación de skills demostrable

---

## 4. DIFERENCIADORES CLAVE

### 1. Simulador Polimórfico (Core Innovation)

**La interfaz cambia radicalmente según el canal de venta:**

**WhatsApp/Chat:**
- Burbujas verdes/grises, estados "escribiendo...", límite de 200 caracteres
- Cliente puede dejar en "visto" si el mensaje no aporta valor
- Delays realistas (10-30 segundos o minutos según personalidad)

**Email/LinkedIn:**
- Cliente de correo completo con asunto, firma, CC/BCC
- Delays de horas/días (simulados)
- Cliente no abre email si el asunto es malo

**Teléfono (Audio):**
- Conversación por voz en tiempo real (WebRTC + Whisper)
- Cliente puede interrumpir si hablas >90 segundos sin parar
- Cliente puede colgar si detecta inseguridad o pitch malo

**Presencial (F2F):**
- Conversación por voz + descripción de lenguaje corporal
- IA describe: "cruza los brazos", "mira el reloj", "toma notas"
- Ambiente influye (café informal vs. sala ejecutiva formal)

**Por qué importa:**  
Esta característica es única en el mercado. No existe otra plataforma que replique las reglas, ritmo y formato de cada canal. La transferencia al mundo real es directa: el vendedor practica exactamente como venderá.

### 2. Sistema de 4 Agentes IA

**Architect (Diseñador de Rutas):**
- Input: Nivel del usuario + objetivo + industria
- Output: Syllabus de 8-12 módulos personalizados con objetivos específicos

**Producer (Creador de Contenido):**
- Input: Syllabus del Architect
- Output: Scripts de teoría + 40-60 tarjetas de objeciones + 5 escenarios de simulación

**Actor (Cliente IA):**
- Input: Configuración de cliente (rol, personalidad, objeciones, pain level)
- Output: Conversación en tiempo real coherente con memoria (recuerda todo lo dicho, castiga incoherencias)

**Analyst (Coach):**
- Input: Transcripción + metadata (timing, pausas, interrupciones)
- Output: Score cuantitativo + 3 consejos tácticos específicos

**Ventaja:** Separación de responsabilidades permite optimizar cada agente independientemente y garantizar calidad consistente.

### 3. Contenido Infinito (Standard + AI Tracks)

**Standard Tracks (Catálogo):**
- 6 rutas pre-generadas para industrias principales (SaaS B2B, Seguros, Inmobiliaria, Cold Calling, Consultoría, Retail)
- Validadas por expertos de ventas
- Mejora continua basada en datos de uso

**AI Tracks (Personalizados):**
- Usuario describe su caso: "Vendo maquinaria agrícola a cooperativas en Argentina"
- Architect genera track completo en <2 minutos
- Atiende long tail: miles de industrias nicho

**Ventaja:** Flexibilidad total. Sirve tanto a segmentos masivos como a casos hiper-específicos.

### 4. Feedback Accionable (No Solo Score)

Cada simulación produce:

**Score Cuantitativo (0-100):**
- Overall score
- Scores granulares: Discovery (85), Qualification (60), Objection Handling (75), Closing (55)

**Análisis Cualitativo:**
- ✅ Fortalezas (2-3): "Usaste preguntas SPIN efectivas", "Tono profesional"
- ⚠️ Debilidades (2-3): "Hablaste 75% del tiempo (ideal: 40%)", "No confirmaste presupuesto antes de pricing"
- 🎯 Próximos pasos (3): "Módulo: Active Listening", "Drill: 10 objeciones de presupuesto", "Revisar: Doble Alternativa para cierre"

**Ventaja:** El usuario sabe exactamente qué mejorar, no solo que "le fue mal".

---

## 5. ARQUITECTURA DEL PRODUCTO

### 3 Motores de Entrenamiento

**LEARN (Aprender) - 30% del tiempo**
- Micro-lecciones de 5-7 minutos
- Frameworks tácticos (SPIN, BANT, LAER, Challenger Sale)
- Estructura: Concepto (2 min) + Caso real (3 min) + Checkpoint (2 min)

**TRAIN (Asimilar) - 20% del tiempo**
- Reflex Gym: drill de objeciones tipo Tinder (swipe)
- Objetivo: Automatizar respuestas en <3 segundos
- Sistema de repetición espaciada (algoritmo Leitner)
- Biblioteca de 50 objeciones universales + 30 específicas por industria

**EXECUTE (Ejecutar) - 50% del tiempo**
- Deal Room: simulaciones en tiempo real con cliente IA
- 4 canales (WhatsApp, Email, Phone, F2F)
- Cliente IA con memoria, personalidad y adaptación dinámica
- 4 niveles de dificultad auto-ajustables

### Modelo de Usuario (Perfilado Dinámico)

**Eje 1: Nivel de Experiencia**
- Junior (0-2 años): 60% academia / 40% simulación, cliente fácil, feedback empático
- Mid (2-5 años): 30% academia / 70% simulación, cliente medio-difícil, feedback táctico
- Senior (5+ años): 10% academia / 90% simulación, cliente extremo, feedback financiero

**Eje 2: Objetivo**
- Aprender producto/industria nueva
- Mejorar skill específico (discovery, objection handling, closing)
- Dominar canal específico (phone, f2f, digital)
- Preparar pitch complejo

**Adaptación Continua:**
El sistema ajusta nivel automáticamente. Si Junior cierra 9/10 simulaciones → sube dificultad. Si Senior falla discovery → refuerza con teoría.

### Sistema de Progreso (Sin Gamificación Vacía)

**Dashboard Personal:**
- Skill Radar: Discovery 80%, Qualification 60%, Objections 90%, Closing 40%
- Win Rate por canal: WhatsApp 90%, Phone 60%, F2F 53%
- Histórico de mejora: Gráfico de score últimos 30 días
- Debilidades detectadas: "Cierras sin confirmar presupuesto (8 veces este mes)"

**Achievements Significativos:**
- 🎯 Qualifier: 20 simulaciones con 90%+ en discovery
- 🛡️ Objection Master: 50 objeciones dominadas
- 📞 Cold Call Pro: 15 llamadas frías con 70%+ score
- 🤝 Executive Ready: 5 deals cerrados con C-level

**No incluye:** Divisas ficticias, ligas competitivas, rachas diarias (generan ansiedad sin valor)

---

## 6. STACK TECNOLÓGICO

### Frontend
- **Next.js 15** - Framework React con SSG/SSR
- **Tailwind CSS** - Styling utility-first
- **Framer Motion** - Animaciones fluidas
- **Zustand** - State management ligero

### Backend
- **Supabase** - PostgreSQL + Auth + Edge Functions + Realtime
- **pgvector** - Embeddings para búsqueda semántica de tracks
- **Row Level Security** - Multi-tenancy seguro

### IA
- **Vercel AI SDK** - Orquestación de agentes
- **OpenAI GPT-4** - Actor (simulaciones), Analyst avanzado
- **OpenAI GPT-3.5 Turbo** - Producer, Analyst básico (optimización de costos)
- **Whisper** - Transcripción de voz para Phone y F2F

### Infraestructura
- **Vercel** - Hosting, edge functions, CDN global
- **Posthog** - Product analytics
- **Stripe** - Payments y gestión de suscripciones

### Optimización de Costos IA

**Cache Strategy:**
- Standard Tracks: 100% cacheados (contenido inmutable)
- AI Tracks: Cacheados por 7 días si se usa >2 veces
- Prompts comunes del Producer: Cache en memoria
- Respuestas del Actor a objeciones universales: Cache

**Model Selection:**
- Producer: GPT-3.5 Turbo (contenido simple)
- Actor: GPT-4 solo para usuarios Expert y simulaciones difíciles; GPT-3.5 Turbo para el resto
- Analyst: GPT-3.5 Turbo para feedback básico; GPT-4 para análisis profundo (solo usuarios pagos)

**Rate Limits:**
- Free tier: 5 simulaciones/mes (hard limit)
- Pro tier: Ilimitadas pero throttling a 20/día
- Expert tier: Ilimitadas sin throttling

---

## 7. BASE DE DATOS (SUPABASE)

### Esquema Core

```sql
-- Usuarios
profiles (
  id, email, company_id,
  experience_level, training_goal,
  total_simulations, avg_simulation_score
)

-- Empresas (B2B)
companies (
  id, name, industry, seats_purchased, crm_integration_type
)

-- Rutas de Aprendizaje
learning_paths (
  id, user_id, title, track_type,
  syllabus_data (JSONB),
  current_module_index, completed,
  embeddings (VECTOR)
)

-- Simulaciones
simulations (
  id, user_id, path_id,
  channel, difficulty, client_persona (JSONB),
  transcript (JSONB), duration_seconds,
  user_talk_percentage, pauses_count,
  overall_score, discovery_score, qualification_score,
  objection_handling_score, closing_score,
  ai_feedback (JSONB)
)

-- Drills de Objeciones
objection_drills (
  id, user_id, objection_text, objection_type,
  times_seen, times_correct, next_review_date, mastered
)
```

### Features Clave

**Row Level Security (RLS):**
- Políticas por tenant: usuarios solo ven sus datos + datos de su company
- Admins de empresa ven datos agregados del equipo

**Materialized Views:**
- `user_performance_summary`: Métricas agregadas por usuario (refresh cada hora)
- Soporta dashboard de manager sin queries lentas

**pgvector:**
- Embeddings de learning_paths para búsqueda semántica
- Usuarios pueden buscar tracks por descripción natural: "quiero mejorar discovery en llamadas frías"

---

## 8. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: MVP Core (8-12 semanas)

**Semanas 1-3: Fundación**
- Setup Next.js + Supabase + Auth
- Onboarding: 3 preguntas → clasificación junior/mid/senior
- Base de datos completa implementada
- RLS policies básicas

**Semanas 4-6: Contenido y Agentes Básicos**
- 2 Standard Tracks manuales (SaaS B2B + Cold Calling)
- Agente Architect: genera syllabus a partir de track_id
- Agente Producer: usa templates pre-escritos, personaliza ejemplos
- Deal Room: SOLO WhatsApp (modo texto)

**Semanas 7-9: Simulación y Feedback**
- Agente Actor: cliente IA básico (coherencia en conversación)
- Agente Analyst: scoring heurístico + LLM para feedback
- Dashboard básico: win rate, score promedio

**Semanas 10-12: Reflex Gym y Pulido**
- Modo TRAIN: drill de objeciones con repetición espaciada
- 50 objeciones universales cargadas
- Onboarding refinado
- Testing con 20 beta users
- Payments (Stripe)

**Entregable MVP:**
- 2 Standard Tracks funcionales
- Deal Room (WhatsApp texto)
- Reflex Gym operativo
- Feedback básico post-simulación
- Dashboard de progreso v1

**KPIs de Éxito MVP:**
- ¿Usuarios completan >3 simulaciones en D7?
- ¿Retention D7 > 40%?
- ¿NPS > 30?

---

### Fase 2: Expansión de Contenido (4-6 semanas)

**Semanas 13-15:**
- 4 Standard Tracks adicionales (Seguros, Inmobiliaria, Retail, Consultoría)
- Canal Email funcional
- Producer mejorado: mayor variedad de contenido

**Semanas 16-18:**
- AI Tracks: usuarios crean tracks custom con prompt
- Architect genera syllabus dinámico
- Cache de tracks generados

**Entregable Fase 2:**
- 6 Standard Tracks totales
- AI Tracks funcionales
- 2 canales (WhatsApp + Email)
- Analytics mejorado (skill radar, debilidades detectadas)

**KPIs de Éxito Fase 2:**
- ¿Conversión Free → Pro > 8%?
- ¿Retention D30 > 50%?
- ¿AI Tracks tienen engagement similar a Standard?

---

### Fase 3: Voz y F2F (6-8 semanas)

**Semanas 19-22:**
- Integración Whisper para transcripción
- Canal Phone funcional (audio bidireccional)
- Optimización de latencia (<3 segundos)

**Semanas 23-26:**
- Canal F2F: audio + descripción textual de ambiente/lenguaje corporal
- Actor IA describe gestos ("cruza brazos", "mira reloj")
- Testing intensivo de calidad de audio

**Entregable Fase 3:**
- 4 canales completos (WhatsApp, Email, Phone, F2F)
- Experiencia voz optimizada
- Plan Expert activado

**KPIs de Éxito Fase 3:**
- ¿Usuarios que prueban voz tienen retention +20% vs. solo texto?
- ¿Latencia promedio Phone <3seg?

---

### Fase 4: Enterprise Features (4-6 semanas)

**Semanas 27-30:**
- Multi-tenancy para empresas
- Admin dashboard (performance de equipo)
- Benchmarking interno
- Tracks personalizados empresa

**Semanas 31-32:**
- Integración CRM básica (export de métricas a Salesforce/HubSpot)
- SSO (SAML)
- Certificaciones (badges verificables)

**Entregable Fase 4:**
- Plan Enterprise operativo
- Primeros 3 clientes corporativos piloto

---

## 9. MÉTRICAS Y KPIS

### Métricas de Activación

- % usuarios que completan onboarding
- % usuarios que completan primera simulación
- % usuarios que completan >3 simulaciones en D7

### Métricas de Engagement

- Simulaciones por usuario por semana (target: 5-8)
- Avg session length (target: 20-30 min)
- % usuarios activos semanales - WAU (target: 60%+)
- Objeciones dominadas promedio por usuario (target: 15 en 30 días)

### Métricas de Retención

- D1 / D7 / D30 retention (targets: 70% / 45% / 55%)
- Churn rate mensual (target: <10%)

### Métricas de Conversión

- Free → Pro conversion rate (target: 8-12%)
- Pro → Expert upgrade rate (target: 15-20%)

### Métricas de Calidad

- NPS (target: >40)
- % usuarios que reportan feedback útil (target: >80%)
- Mejora de score promedio en 30 días (target: >15 puntos)
- % usuarios que dominan >20 objeciones en 60 días (target: >60%)

### Métricas de Negocio

- MRR (Monthly Recurring Revenue)
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- LTV:CAC ratio (target: >3:1)
- Costo IA por usuario activo/mes
- Gross Margin (target: >70%)

---

## 10. GESTIÓN DE RIESGOS

### Riesgo 1: Calidad de Contenido IA

**Descripción:** AI Tracks generan contenido genérico o con hallucinations

**Probabilidad:** Media-Alta  
**Impacto:** Alto (afecta credibilidad del producto)

**Mitigación:**
- Templates de frameworks validados como base
- System prompt estricto: "No inventes estadísticas"
- Validation layer post-generación
- Rating del usuario (1-5 estrellas) → Re-generación si <3
- Revisión humana de primeros 50 tracks generados

---

### Riesgo 2: Latencia en Voz

**Descripción:** Latencia >3 segundos mata la experiencia conversacional

**Probabilidad:** Media  
**Impacto:** Alto (canal Phone/F2F inutilizable)

**Mitigación:**
- Optimización de prompts del Actor (más concisos)
- Pre-generación de respuestas a objeciones comunes (cache)
- Fallback a modo texto si latencia excede threshold
- Testing intensivo con usuarios reales antes de launch

---

### Riesgo 3: Costos de IA Insostenibles

**Descripción:** Costo por simulación >$1 hace el modelo económico inviable

**Probabilidad:** Media  
**Impacto:** Crítico (quiebra el negocio)

**Mitigación:**
- Cache agresivo (Standard Tracks, prompts comunes, respuestas frecuentes)
- Model selection: GPT-3.5 Turbo para Producer/Analyst básico
- Rate limits claros por tier (Free: 5/mes, Pro: 20/día)
- Monitoreo constante de costo por usuario activo

---

### Riesgo 4: Usuarios No Ven ROI Real

**Descripción:** Usuarios practican pero no mejoran resultados de ventas reales

**Probabilidad:** Media  
**Impacto:** Crítico (churn alto, WOM negativo)

**Mitigación:**
- Tracking de mejora objetiva (score en el tiempo)
- Integración CRM para correlacionar entrenamiento con tasa de cierre real
- Casos de estudio documentados con datos reales
- Dashboard de manager muestra impacto en resultados del equipo
- Encuestas post-60 días: "¿Cerraste un deal que antes hubieras perdido?"

---

### Riesgo 5: Complejidad Técnica Retrasa MVP

**Descripción:** 4 agentes + 4 canales + voz = desarrollo de 12+ meses

**Probabilidad:** Alta  
**Impacto:** Alto (ventana de oportunidad se cierra)

**Mitigación:**
- MVP ultra-enfocado: 2 tracks, 1 canal (WhatsApp), agentes simplificados
- Lanzar voz/F2F en Fase 3, no en MVP
- Usar templates pre-escritos en Producer (no generación 100% IA)
- Contratar equipo senior con experiencia en IA

---

## 11. PRÓXIMOS PASOS INMEDIATOS

### Semana 1-2: Validación Pre-Desarrollo

**1. Landing Page + Waitlist**
- Copy claro del problema/solución
- Demo video (screencast de Figma prototype)
- CTA: "Únete a la beta privada"
- Meta: 100 signups en 2 semanas

**2. Entrevistas con Usuarios Potenciales (15)**
- Target: Vendedores mid-level en SaaS/seguros/inmobiliaria
- Preguntas clave:
  - ¿Qué canal usas más? (phone/whatsapp/email/f2f)
  - ¿Qué objeción te cuesta más manejar?
  - ¿Cuánto pagarías por práctica ilimitada con feedback IA?
  - ¿Usarías voz o preferís texto?
- Objetivo: Validar willingness to pay + priorizar canales

**3. Competitive Analysis Profundo**
- Mapear: Gong, Chorus, MindTickle, roleplay startups
- Identificar: ¿Por qué NO existe esto ya?
- Posicionamiento: ¿Cómo nos diferenciamos claramente?

---

### Semana 3-4: Definición Técnica

**4. JSON Schema del Architect**
- Definir contrato estricto de input/output
- Validación con JSON Schema library
- Documentar con ejemplos

**5. Diseño de Base de Datos**
- Implementar schema completo en Supabase
- RLS policies por tenant
- Triggers para actualizar materialized views
- Testing de performance con datos sintéticos

**6. Arquitectura de Agentes**
- Endpoint orquestador: `/api/generate-track`
- Rate limiting y circuit breakers
- Estrategia de cache

---

### Semana 5-12: Desarrollo MVP

**7. Standard Tracks Manuales (2)**
- Contratar experto de ventas para validar contenido
- SaaS B2B: 10 módulos completos
- Cold Calling: 8 módulos completos

**8. Deal Room WhatsApp**
- UI polimórfica funcional
- Actor IA básico (sin memoria avanzada, solo coherencia)
- Analyst con scoring simple + feedback LLM

**9. Reflex Gym**
- UI tipo Tinder (swipe)
- 50 objeciones universales cargadas
- Sistema Leitner implementado

**10. Beta Cerrada**
- Invitar 20 usuarios del waitlist
- Onboarding guiado (1-1 por videollamada)
- Recolectar feedback cualitativo semanal
- Medir: D7 retention, NPS, simulaciones completadas

---

## 12. FACTORES CRÍTICOS DE ÉXITO

### 1. Calidad del Cliente IA (Actor)

**Por qué es crítico:**  
Si el cliente IA responde de forma incoherente, genérica o predecible, la simulación pierde valor. El usuario detecta que "es un bot" y deja de tomarlo en serio.

**Cómo asegurarla:**
- Memory across conversation (recuerda todo lo dicho)
- Adaptación dinámica (responde según calidad de preguntas del usuario)
- Personalidad consistente (analítico no se vuelve impulsivo a mitad de conversación)
- Testing exhaustivo con vendedores reales

---

### 2. Feedback Accionable (Analyst)

**Por qué es crítico:**  
Feedback genérico ("Mejorar tu pitch") no sirve. El usuario necesita saber EXACTAMENTE qué hacer diferente.

**Cómo asegurarlo:**
- 3 consejos tácticos específicos (no más, no menos)
- Referencias a módulos/drills para practicar la debilidad
- Ejemplos concretos de la simulación ("En minuto 4:30 dijiste X, deberías haber dicho Y")

---

### 3. Realismo de los Canales

**Por qué es crítico:**  
Si el canal WhatsApp no se siente como WhatsApp real, el usuario no transfiere el aprendizaje.

**Cómo asegurarlo:**
- Replicar timing realista (delays, "escribiendo...")
- Replicar limitaciones (200 caracteres en WhatsApp)
- Replicar consecuencias (cliente cuelga en Phone si pierdes su interés)

---

### 4. Velocidad de Generación (AI Tracks)

**Por qué es crítico:**  
Si el usuario ingresa prompt y espera 5 minutos, abandona. La promesa es "track listo en <2 minutos".

**Cómo asegurarla:**
- Architect + Producer corren en paralelo donde sea posible
- Cache de tracks similares
- Indicador de progreso visual (no dejar al usuario en "loading...")

---

### 5. ROI Demostrable

**Por qué es crítico:**  
Si las empresas no ven mejora en tasa de cierre real, no renuevan subscripción.

**Cómo demostrarlo:**
- Integración CRM: correlacionar uso de GoDash con resultados de ventas
- Casos de estudio: "Empresa X mejoró win rate de 18% a 24% en Q1"
- Testimoniales cuantitativos: "Cerré 3 deals que antes hubiera perdido"

---

## 13. VISIÓN A 3 AÑOS

### Año 1: Product-Market Fit
- 1,500 usuarios activos
- 6 Standard Tracks + AI Tracks
- 4 canales completos
- D30 retention >55%
- NPS >40
- 1 caso de estudio publicado con datos reales

### Año 2: Escala
- 15,000 usuarios activos
- 50 clientes Enterprise
- 12 Standard Tracks
- Integración CRM completa (Salesforce, HubSpot)
- Expansión internacional (LATAM, Europa)
- Certificaciones reconocidas por la industria

### Año 3: Plataforma
- 100,000 usuarios activos
- API abierta para integraciones de terceros
- Marketplace de tracks creados por expertos
- IA que aprende de top performers y replica sus técnicas
- "University of Sales" - programa de certificación completo

---

## 14. CONCLUSIÓN

GoDash resuelve un problema masivo (capacitación comercial ineficiente) con una solución tecnológicamente única (simulador polimórfico + agentes IA).

**Diferenciadores defendibles:**
1. Simulador polimórfico (propiedad intelectual, difícil de replicar)
2. Arquitectura de 4 agentes (know-how técnico, 6-12 meses de ventaja)
3. Biblioteca de Standard Tracks validados (efecto red: más datos → mejor contenido)

**Timing:**
- Tecnología: GPT-4 + Whisper hacen posible cliente IA realista + voz de baja latencia
- Mercado: WFH normalizó venta digital, pero vendedores no fueron entrenados para este cambio
- Competencia: Gong/Chorus analizan llamadas, pero no dejan practicar sin riesgo

**Tracción temprana necesaria:**
- 100 signups en waitlist (2 semanas)
- 15 entrevistas validando willingness to pay
- MVP con 20 beta users logrando D7 retention >40%

**Si se ejecuta bien:** GoDash se convierte en el estándar de entrenamiento comercial para la era de IA, del mismo modo que Duolingo lo es para aprendizaje de idiomas.

---

**Stack:** Next.js 15, Supabase, Vercel AI SDK, OpenAI  
**Timeline:** MVP en 8-12 semanas, Product-Market Fit en 6-9 meses  
**Team inicial:** 1 Fullstack Engineer Senior, 1 Product Designer, 1 Sales Expert (part-time)

---

*Documento preparado para stakeholders, inversores y equipo técnico.*  
*Versión 6.0 - Febrero 2026*
