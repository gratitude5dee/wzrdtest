export interface UserPreferencesTable {
  Row: {
    created_at: string | null
    font_family: string | null
    font_size: number | null
    id: string
    text_color: string | null
    theme: string | null
    updated_at: string | null
    app_font_family: string | null
    background_color: string | null
  }
  Insert: {
    created_at?: string | null
    font_family?: string | null
    font_size?: number | null
    id: string
    text_color?: string | null
    theme?: string | null
    updated_at?: string | null
    app_font_family?: string | null
    background_color?: string | null
  }
  Update: {
    created_at?: string | null
    font_family?: string | null
    font_size?: number | null
    id?: string
    text_color?: string | null
    theme?: string | null
    updated_at?: string | null
    app_font_family?: string | null
    background_color?: string | null
  }
}