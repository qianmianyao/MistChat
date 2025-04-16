import { createContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
export { ThemeProviderContext };

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // 立即应用初始主题，防止闪烁
  useEffect(() => {
    const initialTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    const html = window.document.documentElement;

    if (initialTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      html.classList.add(systemTheme);
    } else {
      html.classList.add(initialTheme);
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 当系统主题变化时更新主题
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.add(newTheme);
      }
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);

    // 组件卸载时移除监听器
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
