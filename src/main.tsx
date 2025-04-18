import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import AppRouter from '@/router/router.tsx';
import { ImageToaster } from '@/components/ui/toaster';
import WebSocketProvider from '@/components/WebSocketProvider.tsx';

const rootElement = document.getElementById('root')!;

// 创建一个 React 根，但还不渲染
const root = createRoot(rootElement);

// 定义渲染函数
const renderApp = () => {
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="system">
        <ImageToaster position="top-center" reverseOrder={false} />
        {/* WebSocketProvider 只在这里使用一次 */}
        <WebSocketProvider>
          {/* 其他组件 */}
          <AppRouter />
        </WebSocketProvider>
      </ThemeProvider>
    </StrictMode>
  );

  // 使用 requestAnimationFrame 确保 DOM 完全更新后再添加 loaded 类
  requestAnimationFrame(() => {
    // 再使用一个 setTimeout 确保样式已应用
    setTimeout(() => {
      rootElement.classList.add('loaded');
    }, 100); // 增加一点延迟确保过渡更平滑
  });
};

// 开始渲染
renderApp();
