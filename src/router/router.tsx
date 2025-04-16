import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Home from '@/pages/Home';
import Test from '@/pages/Test';
import React, { Suspense } from 'react';
import { Loading } from '@/components/ui/loading';
import Chat from '@/pages/Chat';

// 路由懒加载
// const Chat = React.lazy(() => import('@/pages/chat'));
const SecureAccess = React.lazy(() => import('@/pages/SecureAccess'));
const Share = React.lazy(() => import('@/pages/Share'));

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
    element: <Chat />,
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

