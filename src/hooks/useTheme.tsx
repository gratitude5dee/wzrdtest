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
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('theme, text_color')
          .eq('id', user.id)
          .single();
        
        if (preferences?.theme) {
          const userTheme = preferences.theme as Theme;
          setTheme(userTheme);
          applyTheme(userTheme, preferences.text_color);
        }
      }
    };
    
    loadTheme();
  }, []);

  const applyTheme = (newTheme: Theme, textColor?: string) => {
    const root = document.documentElement;
    
    document.body.classList.add('theme-transition');
    
    requestAnimationFrame(() => {
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      root.style.setProperty('--text-primary', newTheme === 'dark' ? '#F8FAFC' : '#1F2937');
      
      if (textColor) {
        root.style.setProperty('--user-text-color', textColor);
      }
    });

    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 800);
  };

  const updateTheme = async (newTheme: Theme) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('text_color')
        .eq('id', user.id)
        .single();

      await supabase
        .from('user_preferences')
        .upsert({ 
          id: user.id,
          theme: newTheme,
        });

      setTheme(newTheme);
      applyTheme(newTheme, preferences?.text_color);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      <div className="theme-transition gradient-animate">
        {children}
      </div>
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