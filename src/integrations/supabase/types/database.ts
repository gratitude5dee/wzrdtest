import type { 
  ProfilesTable,
  ScriptsTable,
  ScriptAnalyticsTable,
  ScriptSharesTable,
  UserPreferencesTable 
} from './tables';

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable
      scripts: ScriptsTable
      script_analytics: ScriptAnalyticsTable
      script_shares: ScriptSharesTable
      user_preferences: UserPreferencesTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      share_permission: "read" | "edit"
    }
  }
}