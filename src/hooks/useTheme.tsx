import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: preferences, error } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('id', user.id)
          .single();
        
        if (!error && preferences?.theme) {
          const userTheme = preferences.theme as Theme;
          setTheme(userTheme);
          document.documentElement.classList.toggle('dark', userTheme === 'dark');
        }
      }
    };
    
    loadTheme();
  }, []);

  const updateTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({ 
          id: user.id,
          theme: newTheme,
        });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};