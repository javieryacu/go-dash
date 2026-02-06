// Database types for GoDash
// Auto-generated from schema, update when schema changes

export type ExperienceLevel = 'junior' | 'mid' | 'senior'
export type TrainingGoal = 'learn_product' | 'improve_skill' | 'master_channel' | 'prepare_pitch'
export type TrackType = 'standard' | 'ai_generated'
export type SimulationChannel = 'whatsapp' | 'email' | 'phone' | 'f2f'
export type SimulationDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'
export type ObjectionType = 'price' | 'timing' | 'authority' | 'need' | 'trust' | 'competition'

export interface Company {
    id: string
    name: string
    industry: string | null
    seats_purchased: number
    crm_integration_type: string | null
    created_at: string
    updated_at: string
}

export interface Profile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    company_id: string | null
    experience_level: ExperienceLevel
    training_goal: TrainingGoal | null
    total_simulations: number
    avg_simulation_score: number
    is_company_admin: boolean
    onboarding_completed: boolean
    created_at: string
    updated_at: string
}

export interface LearningPath {
    id: string
    user_id: string
    title: string
    description: string | null
    track_type: TrackType
    industry: string | null
    syllabus_data: SyllabusModule[]
    current_module_index: number
    total_modules: number
    completed: boolean
    created_at: string
    updated_at: string
}

export interface SyllabusModule {
    title: string
    description: string
    objectives: string[]
    duration_minutes: number
    content_type: 'theory' | 'drill' | 'simulation'
    completed: boolean
}

export interface Simulation {
    id: string
    user_id: string
    path_id: string | null
    channel: SimulationChannel
    difficulty: SimulationDifficulty
    client_persona: ClientPersona
    transcript: TranscriptMessage[]
    duration_seconds: number
    user_talk_percentage: number
    pauses_count: number
    overall_score: number
    discovery_score: number
    qualification_score: number
    objection_handling_score: number
    closing_score: number
    ai_feedback: AIFeedback
    completed: boolean
    created_at: string
    updated_at: string
}

export interface ClientPersona {
    name: string
    role: string
    company: string
    personality: 'analytical' | 'driver' | 'amiable' | 'expressive'
    pain_level: 'low' | 'medium' | 'high'
    objections: string[]
    decision_maker: boolean
}

export interface TranscriptMessage {
    role: 'user' | 'client'
    content: string
    timestamp: number
    metadata?: {
        typing_duration?: number
        pause_before?: number
    }
}

export interface AIFeedback {
    overall_summary: string
    strengths: string[]
    weaknesses: string[]
    next_steps: string[]
    detailed_scores: {
        rapport_building: number
        question_quality: number
        active_listening: number
        objection_handling: number
        closing_technique: number
    }
}

export interface ObjectionDrill {
    id: string
    user_id: string
    objection_text: string
    objection_type: ObjectionType
    ideal_response: string | null
    times_seen: number
    times_correct: number
    next_review_date: string
    mastered: boolean
    created_at: string
    updated_at: string
}

export interface StandardTrack {
    id: string
    title: string
    description: string | null
    industry: string
    difficulty: SimulationDifficulty
    syllabus_template: SyllabusModule[]
    is_active: boolean
    created_at: string
    updated_at: string
}

// User Performance Summary (Materialized View)
export interface UserPerformanceSummary {
    user_id: string
    email: string
    full_name: string | null
    experience_level: ExperienceLevel
    company_id: string | null
    total_simulations: number
    avg_overall_score: number
    avg_discovery_score: number
    avg_qualification_score: number
    avg_objection_score: number
    avg_closing_score: number
    whatsapp_count: number
    email_count: number
    phone_count: number
    f2f_count: number
    objections_mastered: number
}
