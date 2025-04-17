import { useState } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Chat as ChatType, Message, User } from '@/components/chat/chat-interface';
import { ChatChats } from '@/components/chat/chat-chats';
import { ChatContacts } from '@/components/chat/chat-contacts';
import { ChatSettings } from '@/components/chat/chat-settings';
import { ChatNewRoom } from '@/components/chat/chat-new-room';

// 生成头像的辅助函数
const generateAvatar = (seed: string) => {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`;
};

// 联系人数据
const contacts: User[] = [
  {
    id: '1',
    name: '张三',
    avatar: generateAvatar('张三'),
    status: 'online',
  },
  {
    id: '2',
    name: '李四',
    avatar: generateAvatar('李四'),
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    name: '王五',
    avatar: generateAvatar('王五'),
    status: 'away',
  },
  {
    id: '4',
    name: '赵六',
    avatar: generateAvatar('赵六'),
    status: 'online',
  },
];

// 初始聊天数据
const initialChats: ChatType[] = contacts.map((contact) => ({
  id: contact.id,
  user: contact,
  unreadCount: Math.floor(Math.random() * 5),
  lastMessage: {
    content: ['你好！', '最近怎么样？', '我们来讨论一下项目进度', '周末有空吗？'][
      Math.floor(Math.random() * 4)
    ],
    timestamp: new Date(Date.now() - Math.random() * 86400000),
  },
}));

// 初始消息数据
const initialMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'a1',
      content: '你好！有什么我可以帮助你的？',
      sender: 'contact',
      timestamp: new Date(Date.now() - 3600000),
    },
  ],
  '2': [
    {
      id: 'b1',
      content: '嘿，最近在忙什么？',
      sender: 'user',
      timestamp: new Date(Date.now() - 86400000),
      status: 'read',
    },
    {
      id: 'b2',
      content: '我在准备下周的演讲，你呢？',
      sender: 'contact',
      timestamp: new Date(Date.now() - 86300000),
    },
  ],
  '3': [
    {
      id: 'c1',
      content: '项目进度如何？',
      sender: 'contact',
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: 'c2',
      content: '我们已经完成了大部分功能，还剩下一些测试工作。',
      sender: 'user',
      timestamp: new Date(Date.now() - 172700000),
      status: 'read',
    },
  ],
  '4': [
    {
      id: 'd1',
      content: '周末有空一起吃饭吗？',
      sender: 'contact',
      timestamp: new Date(Date.now() - 259200000),
    },
    {
      id: 'd2',
      content: '当然，周六晚上怎么样？',
      sender: 'user',
      timestamp: new Date(Date.now() - 259100000),
      status: 'read',
    },
    {
      id: 'd3',
      content: '周六晚上7点，老地方见。',
      sender: 'contact',
      timestamp: new Date(Date.now() - 259000000),
    },
  ],
};

export default function Chat() {
  const [, setChats] = useState<ChatType[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();

  // 获取当前活动路由
  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path.includes('/chat/new')) return 'new-chat';
    if (path.includes('/chat/contacts')) return 'contacts';
    if (path.includes('/chat/settings')) return 'settings';
    if (path.includes('/chat/') && !isNaN(Number(path.split('/').pop()))) return 'chats';
    return 'chats';
  };

  const currentRoute = getCurrentRoute();

  // 处理发送消息
  const handleSendMessage = (content: string, activeChatId: string) => {
    if (content.trim() === '' || !activeChatId) return;

    // 添加用户消息
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newUserMessage],
    }));

    // 更新聊天列表
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              lastMessage: {
                content,
                timestamp: new Date(),
              },
              unreadCount: 0, // 清除未读消息计数
            }
          : chat
      )
    );

    // 模拟消息状态更新
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: prev[activeChatId].map((msg) =>
          msg.id === newUserMessage.id ? { ...msg, status: 'sent' } : msg
        ),
      }));
    }, 500);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: prev[activeChatId].map((msg) =>
          msg.id === newUserMessage.id ? { ...msg, status: 'delivered' } : msg
        ),
      }));
    }, 1000);

    // 模拟联系人回复
    setTimeout(() => {
      const contactResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `收到了你的消息："${content}"。稍后回复你。`,
        sender: 'contact',
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...prev[activeChatId], contactResponse],
      }));

      // 更新聊天列表
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                lastMessage: {
                  content: contactResponse.content,
                  timestamp: new Date(),
                },
              }
            : chat
        )
      );
    }, 1500);
  };

  // 处理侧边栏选择
  const handleSidebarItemSelect = (id: string) => {
    if (id === 'chats') {
      navigate('/chat');
    } else if (id === 'new-chat') {
      navigate('/chat/new');
    } else if (id === 'contacts') {
      navigate('/chat/contacts');
    } else if (id === 'settings') {
      navigate('/chat/settings');
    } else if (/^\d+$/.test(id)) {
      // 如果是聊天ID，导航到对应的聊天
      navigate(`/chat/${id}`);

      // 清除未读消息计数
      setChats((prev) => prev.map((chat) => (chat.id === id ? { ...chat, unreadCount: 0 } : chat)));
    }

    // 在移动端关闭侧边栏
    setIsMobileSidebarOpen(false);
  };

  // 渲染当前内容
  const renderContent = () => {
    switch (currentRoute) {
      case 'new-chat':
        return <ChatNewRoom messagesCount={Object.keys(messages).length} />;
      case 'chats':
        return (
          <ChatChats
            contacts={contacts}
            messages={messages}
            handleSendMessage={handleSendMessage}
          />
        );
      case 'contacts':
        return <ChatContacts contacts={contacts} />;
      case 'settings':
        return <ChatSettings />;
      default:
        return null;
    }
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
        {renderContent()}
        <Outlet />
      </div>
    </div>
  );
}
