export interface ProfilesTable {
  Row: {
    created_at: string
    email: string | null
    first_name: string | null
    id: string
    last_name: string | null
  }
  Insert: {
    created_at?: string
    email?: string | null
    first_name?: string | null
    id: string
    last_name?: string | null
  }
  Update: {
    created_at?: string
    email?: string | null
    first_name?: string | null
    id?: string
    last_name?: string | null
  }
}

export interface ScriptsTable {
  Row: {
    category: string | null
    content: string
    created_at: string
    id: string
    is_public: boolean
    last_read_at: string | null
    title: string
    updated_at: string
    user_id: string | null
  }
  Insert: {
    category?: string | null
    content: string
    created_at?: string
    id?: string
    is_public?: boolean
    last_read_at?: string | null
    title: string
    updated_at?: string
    user_id?: string | null
  }
  Update: {
    category?: string | null
    content?: string
    created_at?: string
    id?: string
    is_public?: boolean
    last_read_at?: string | null
    title?: string
    updated_at?: string
    user_id?: string | null
  }
}

export interface ScriptAnalyticsTable {
  Row: {
    completion_percentage: number | null
    created_at: string | null
    duration_seconds: number | null
    id: string
    reading_speed: number | null
    script_id: string | null
    user_id: string | null
  }
  Insert: {
    completion_percentage?: number | null
    created_at?: string | null
    duration_seconds?: number | null
    id?: string
    reading_speed?: number | null
    script_id?: string | null
    user_id?: string | null
  }
  Update: {
    completion_percentage?: number | null
    created_at?: string | null
    duration_seconds?: number | null
    id?: string
    reading_speed?: number | null
    script_id?: string | null
    user_id?: string | null
  }
}

export interface ScriptSharesTable {
  Row: {
    created_at: string | null
    id: string
    owner_id: string | null
    permissions: string | null
    script_id: string | null
    shared_with_id: string | null
  }
  Insert: {
    created_at?: string | null
    id?: string
    owner_id?: string | null
    permissions?: string | null
    script_id?: string | null
    shared_with_id?: string | null
  }
  Update: {
    created_at?: string | null
    id?: string
    owner_id?: string | null
    permissions?: string | null
    script_id?: string | null
    shared_with_id?: string | null
  }
}

export { type UserPreferencesTable } from './preferences';