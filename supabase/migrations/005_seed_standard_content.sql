
-- Update Standard Tracks with Rich Content (Theory & Simulations)
-- This embeds the "Fixed" content directly into the syllabus_template JSONB.

-- 1. Retail Track Content
UPDATE standard_tracks
SET syllabus_template = '[
  {
    "title": "Fundamentos de Atención",
    "description": "Aprende a iniciar una interacción de venta de manera efectiva y no invasiva.",
    "objectives": ["Romper el hielo", "Evitar preguntas cerradas", "Generar confianza inicial"],
    "duration_minutes": 5,
    "content_type": "theory",
    "completed": false,
    "content": {
        "title": "La Importancia del Primer Contacto",
        "concept_explanation": "El primer contacto en retail define el 80% de la probabilidad de venta. No se trata solo de saludar, sino de romper la barrera de defensa del cliente (''Solo estoy mirando''). La clave es el saludo no invasivo y la pregunta de situación.",
        "real_world_example": "En lugar de ''¿Le puedo ayudar en algo?'', que invita a un ''No, gracias'', prueba con: ''¡Hola! Veo que estás mirando las chaquetas de cuero, hoy llegaron esos modelos nuevos. Mi nombre es Javier, si necesitas tallas estoy por aquí''.",
        "key_takeaways": [
            "Evita preguntas cerradas al inicio.",
            "Ofrece valor o información en el primer saludo.",
            "Rompe el hielo antes de vender."
        ]
    }
  },
  {
    "title": "Simulación Básica: Cliente Casual",
    "description": "Practica tu saludo y descubrimiento con un cliente relajado.",
    "objectives": ["Identificar necesidades", "Ofrecer producto relevante"],
    "duration_minutes": 10,
    "content_type": "simulation",
    "completed": false,
    "content": {
        "client_persona": {
            "name": "Laura",
            "role": "Compradora Casual",
            "company": "N/A",
            "personality": "amiable",
            "pain_level": "low",
            "objections": ["Solo estoy mirando", "Es un poco caro para lo que buscaba"],
            "decision_maker": true
        },
        "context_brief": "Una clienta entra a la tienda mirando camisetas básicas. Parece relajada pero evasiva.",
        "first_message": "Hola, permiso... solo estoy dando una vuelta viendo qué hay.",
        "goals": ["Romper el hielo", "Identificar si busca algo específico", "Lograr que se pruebe una prenda"]
    }
  },
  {
    "title": "Manejo de Objeciones (Precio)",
    "description": "Domina las técnicas para defender el valor de tu producto.",
    "objectives": ["Aislar la objeción", "Reframe de valor"],
    "duration_minutes": 8,
    "content_type": "theory",
    "completed": false,
    "content": {
        "title": "Desarmando la Objeción de Precio",
        "concept_explanation": "Cuando un cliente dice ''es caro'', rara vez es sobre el dinero. Generalmente es sobre el VALOR percibido. Tu trabajo no es bajar el precio, sino subir el valor. Usa la técnica ''Sentir, Sintieron, Encontraron'' o el aislamiento de la objeción.",
        "real_world_example": "Cliente: ''Es muy caro''. Tú: ''Entiendo que el precio es importante. Muchos clientes pensaban lo mismo al principio, pero descubrieron que la durabilidad de este material les ahorraba comprar dos veces al año. ¿Lo buscas para uso diario?''",
        "key_takeaways": [
            "No te defiendas ni justifiques inmediatamente.",
            "Valida la preocupación del cliente (Empatía).",
            "Re-enfoca la conversación en el beneficio a largo plazo."
        ]
    }
  },
  {
    "title": "Simulación Avanzada: Cierre",
    "description": "Enfréntate a un cliente difícil y cierra la venta.",
    "objectives": ["Manejar presión", "Cierre por alternativa"],
    "duration_minutes": 15,
    "content_type": "simulation",
    "completed": false,
    "content": {
        "client_persona": {
            "name": "Carlos",
            "role": "Cliente Apurado",
            "company": "N/A",
            "personality": "driver",
            "pain_level": "medium",
            "objections": ["No tengo tiempo ahora", "¿Me puedes hacer un descuento?"],
            "decision_maker": true
        },
        "context_brief": "Carlos tiene prisa. Le gustó una chaqueta pero duda por el precio y el tiempo.",
        "first_message": "Mira, me gusta la chaqueta, pero cuesta 20% más de lo que quería gastar y tengo prisa.",
        "goals": ["Validar la prisa", "Justificar el valor", "Cerrar la venta rápidamente"]
    }
  }
]'::jsonb
WHERE title LIKE 'Venta Retail%';

-- 2. Restaurant Track Content
UPDATE standard_tracks
SET syllabus_template = '[
  {
    "title": "Protocolo de Bienvenida",
    "description": "La primera impresión cuenta. Aprende el saludo perfecto.",
    "objectives": ["Sonrisa y contacto visual", "Personalización"],
    "duration_minutes": 5,
    "content_type": "theory",
    "completed": false,
    "content": {
        "title": "Protocolo de Bienvenida",
        "concept_explanation": "La bienvenida en un restaurante establece el tono de toda la experiencia. Debe ser cálida, eficiente y personalizada. Evita el ''¿Tienen reserva?'' como primera frase si el restaurante está vacío.",
        "real_world_example": "Mala: ''¿Cuántos son?''. Buena: ''¡Buenas noches! Bienvenidos a La Estancia. ¿Vienen a celebrar algo especial o es una cena casual?''",
        "key_takeaways": [
            "Sonríe siempre antes de hablar.",
            "Pregunta el motivo de la visita para personalizar.",
            "Guía a la mesa activamente."
        ]
    }
  },
  {
    "title": "Simulación: Cliente Exigente",
    "description": "Maneja una situación tensa con un comensal crítico.",
    "objectives": ["Escucha activa", "Resolución de conflictos"],
    "duration_minutes": 12,
    "content_type": "simulation",
    "completed": false,
    "content": {
        "client_persona": {
            "name": "Marta",
            "role": "Comensal Exigente",
            "company": "N/A",
            "personality": "analytical",
            "pain_level": "medium",
            "objections": ["Esta mesa está muy cerca de la cocina", "¿Tienen opciones sin gluten reales?"],
            "decision_maker": true
        },
        "context_brief": "Marta llega con una amiga. Parece examinar todo con ojo crítico.",
        "first_message": "Buenas noches. Teníamos reserva a las 8. Espero que no nos den la mesa del fondo como la otra vez.",
        "goals": ["Validar la reserva con amabilidad", "Ofrecer una buena mesa o alternativa", "Manejar la queja pasada"]
    }
  }
]'::jsonb
WHERE title LIKE 'Atención Restaurante%';
