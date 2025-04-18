import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import Test from '@/pages/Test';
import React, { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import RequireAuth from './requireAuth';

// 路由懒加载
const SecureAccess = React.lazy(() => import('@/pages/SecureAccess'));
const Share = React.lazy(() => import('@/pages/Share'));
const Chat = React.lazy(() => import('@/pages/Chat'));

// 加载中组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loading variant="dots" size="lg" text="加载中..." textPosition="right" />
  </div>
);

const routers = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/test',
        element: <Test defaultAge={21} />,
      },
    ],
  },
  {
    path: '/chat',
    element: (
      <RequireAuth>
        <Suspense fallback={<LoadingFallback />}>
          <Chat />
        </Suspense>
      </RequireAuth>
    ),
    children: [
      {
        path: '', // 默认路由，显示聊天列表
        element: null, // 使用父级的 renderContent 处理
      },
      {
        path: 'new', // 新建聊天页面
        element: null, // 使用父级的 renderContent 处理
      },
      {
        path: ':chatId', // 聊天详情页
        element: null, // 使用父级的 renderContent 处理
      },
      {
        path: 'contacts', // 联系人页面
        element: null, // 使用父级的 renderContent 处理
      },
      {
        path: 'settings', // 设置页面
        element: null, // 使用父级的 renderContent 处理
      },
    ],
  },
  {
    path: '/secure-access',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SecureAccess />
      </Suspense>
    ),
  },
  {
    path: '/share',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Share />
      </Suspense>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={routers} />;
};

export default AppRouter;
