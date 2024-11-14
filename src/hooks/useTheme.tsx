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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: preferences, error } = await supabase
          .from('user_preferences')
          .select('theme, text_color')
          .eq('id', user.id)
          .single();
        
        if (!error && preferences?.theme) {
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
    
    // Pre-load the next theme's gradient colors
    const nextGradientStart = newTheme === 'dark' ? '#1a1625' : '#ffffff';
    const nextGradientEnd = newTheme === 'dark' ? '#2D2B55' : '#f0f0f0';
    const nextTextColor = newTheme === 'dark' 
      ? (textColor || '#F8FAFC')
      : (textColor || '#1F2937');

    // Apply transitions
    root.style.setProperty('--theme-transition', '0.8s');
    
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      if (newTheme === 'dark') {
        root.classList.add('dark');
        root.style.setProperty('--gradient-start', nextGradientStart);
        root.style.setProperty('--gradient-end', nextGradientEnd);
        root.style.setProperty('--text-primary', nextTextColor);
      } else {
        root.classList.remove('dark');
        root.style.setProperty('--gradient-start', nextGradientStart);
        root.style.setProperty('--gradient-end', nextGradientEnd);
        root.style.setProperty('--text-primary', nextTextColor);
      }
    });
  };

  const updateTheme = async (newTheme: Theme) => {
    setIsTransitioning(true);
    
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
    
    // Add animation classes with smooth transition
    document.body.classList.add('animate-theme-switch');
    document.body.classList.add('theme-transition');
    
    // Remove animation classes after transition
    setTimeout(() => {
      document.body.classList.remove('animate-theme-switch');
      document.body.classList.remove('theme-transition');
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      <div 
        className={`
          transition-all duration-800 ease-in-out 
          ${isTransitioning ? 'animate-theme-switch' : ''}
        `}
        style={{ 
          willChange: 'transform, opacity, background-color',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
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