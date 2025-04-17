import { useState } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface ChatLayoutProps {
  onChatSelect?: (chatId: string) => void;
}

export function ChatLayout({ onChatSelect = () => {} }: ChatLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();

  // 获取当前活动路由
  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path.includes('/chat/contacts')) return 'contacts';
    if (path.includes('/chat/settings')) return 'settings';
    return 'chats';
  };

  const currentRoute = getCurrentRoute();

  // 处理侧边栏选择
  const handleSidebarItemSelect = (id: string) => {
    if (id === 'chats') {
      navigate('/chat');
    } else if (id === 'contacts') {
      navigate('/chat/contacts');
    } else if (id === 'settings') {
      navigate('/chat/settings');
    } else if (/^\d+$/.test(id)) {
      // 如果是聊天ID，导航到对应的聊天
      navigate(`/chat/${id}`);
      onChatSelect(id);
    }

    // 在移动端关闭侧边栏
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="w-full h-screen flex overflow-hidden border border-border">
      {/* 移动端侧边栏 */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-80 bg-sidebar border-r border-border [&_.sheet-close-button]:hidden"
        >
          <ChatSidebar
            onSelectItem={handleSidebarItemSelect}
            activeItem={currentRoute === 'chats' && chatId ? chatId : currentRoute}
          />
        </SheetContent>
      </Sheet>

      {/* 桌面端侧边栏 */}
      <div className="w-72 bg-sidebar border-r border-border flex-shrink-0 hidden md:block">
        <ChatSidebar
          onSelectItem={handleSidebarItemSelect}
          activeItem={currentRoute === 'chats' && chatId ? chatId : currentRoute}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col bg-chat">
        <Outlet />
      </div>
    </div>
  );
}
