import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MessageSquare, Users, Settings, Search, LogOut, HelpCircle, Bell } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

interface ChatSidebarProps {
  onSelectItem?: (id: string) => void;
  activeItem?: string;
}

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  variant?: 'default' | 'ghost';
}

export function ChatSidebar({
  onSelectItem = () => {},
  activeItem: externalActiveItem,
}: ChatSidebarProps) {
  const [internalActiveItem, setInternalActiveItem] = useState('chats');

  // 如果外部提供了 activeItem，则使用它；否则使用内部状态
  const activeItem = externalActiveItem || internalActiveItem;

  const mainItems: SidebarItem[] = [
    { id: 'new-chat', icon: <MessageSquare className="h-5 w-5" />, label: '新建聊天' },
    { id: 'contacts', icon: <Users className="h-5 w-5" />, label: '联系人' },
  ];

  const bottomItems: SidebarItem[] = [
    { id: 'settings', icon: <Settings className="h-5 w-5" />, label: '设置', variant: 'ghost' },
    { id: 'help', icon: <HelpCircle className="h-5 w-5" />, label: '帮助', variant: 'ghost' },
  ];

  const handleItemClick = (id: string, isChatItem = false) => {
    if (isChatItem) {
      // 如果是点击聊天项，设置activeItem为"chats"并传递聊天ID
      setInternalActiveItem('chats');
      onSelectItem(id);
    } else if (id === 'new-chat') {
      // 如果点击的是新建聊天按钮，设置对应的状态并传递特殊标识
      setInternalActiveItem(id);
      onSelectItem(id);
    } else {
      // 如果是点击其他导航项，正常处理
      setInternalActiveItem(id);
      onSelectItem(id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://api.dicebear.com/9.x/thumbs/svg?seed=test_user"
                alt="用户头像"
              />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-sidebar"></span>
          </div>
          <h2 className="text-foreground/90 text-[15px] font-medium">SecureChat</h2>
        </div>
        <ModeToggle />
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Main navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {mainItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-11',
                activeItem === item.id ? 'bg-secondary text-secondary-foreground' : ''
              )}
              onClick={() => handleItemClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'ml-auto',
                    typeof item.badge === 'number'
                      ? 'h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1.5'
                      : 'text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-md'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-medium text-muted-foreground px-3 mb-2">房间列表</h3>
          <div className="space-y-2">
            {[
              {
                id: '1',
                name: '张三',
                status: 'online',
                time: '刚刚',
                message: '项目进展如何？',
                unread: 3,
              },
              {
                id: '2',
                name: '李四',
                status: 'away',
                time: '昨天',
                message: '下周会议安排',
                unread: 0,
              },
              {
                id: '3',
                name: '王五',
                status: 'offline',
                time: '周一',
                message: '已收到文件，谢谢',
                unread: 1,
              },
              {
                id: '4',
                name: '赵六',
                status: 'online',
                time: '周二',
                message: '需要讨论一下新功能',
                unread: 0,
              },
            ].map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start px-3 py-2 h-auto"
                onClick={() => handleItemClick(chat.id, true)}
              >
                <div className="relative mr-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${chat.name}`}
                      alt={chat.name}
                    />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-sidebar"></span>
                  )}
                  {chat.status === 'away' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-yellow-500 border-2 border-sidebar"></span>
                  )}
                </div>
                <div className="flex-1 flex flex-col min-w-0 items-start">
                  <div className="flex w-full justify-between items-center">
                    <span className="font-medium text-sm">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="flex w-full justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground truncate max-w-[80%]">
                      {chat.message}
                    </span>
                    {chat.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-3 h-11">
          <Bell className="h-5 w-5" />
          <span>通知</span>
        </Button>
        {bottomItems.map((item) => (
          <Button
            key={item.id}
            variant={item.variant || 'default'}
            className="w-full justify-start gap-3 h-11"
            onClick={() => handleItemClick(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>退出登录</span>
        </Button>
      </div>
    </div>
  );
}
