import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu, MessageSquare, PlusCircle, Settings, Bell, Lock, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/mode-toggle';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Chat {
  id: string;
  user: User;
  unreadCount: number;
  lastMessage: {
    content: string;
    timestamp: Date;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const generateAvatar = (seed: string) => {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`;
};

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

const initialChats: Chat[] = contacts.map((contact) => ({
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

export function ChatInterface() {
  const [activeChat, setActiveChat] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('chats');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const handleSendMessage = (content: string) => {
    if (content.trim() === '' || !activeChat) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newUserMessage],
    }));

    // Update chat list
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
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

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: prev[activeChat].map((msg) =>
          msg.id === newUserMessage.id ? { ...msg, status: 'sent' } : msg
        ),
      }));
    }, 500);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeChat]: prev[activeChat].map((msg) =>
          msg.id === newUserMessage.id ? { ...msg, status: 'delivered' } : msg
        ),
      }));
    }, 1000);

    // 模拟联系人回复，在实际应用中应该替换为真实的消息接收逻辑
    setTimeout(() => {
      const contactResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `收到了你的消息："${content}"。稍后回复你。`,
        sender: 'contact',
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeChat]: [...prev[activeChat], contactResponse],
      }));

      // Update chat list
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
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

  const handleSidebarItemSelect = (id: string) => {
    if (id === 'new-chat') {
      // 显示新建聊天界面
      setActiveSidebarItem('chats');
      setActiveChat('');
    } else if (/^\d+$/.test(id)) {
      // 如果是聊天ID，设置为活动聊天
      setActiveChat(id);
      setActiveSidebarItem('chats');

      // 清除未读消息计数
      setChats((prev) => prev.map((chat) => (chat.id === id ? { ...chat, unreadCount: 0 } : chat)));
    } else {
      // 否则是导航项ID
      setActiveSidebarItem(id);
    }
  };

  const activeUser = contacts.find((contact) => contact.id === activeChat);

  // 根据当前选择的侧边栏项目渲染不同的内容
  const renderContent = () => {
    switch (activeSidebarItem) {
      case 'chats':
        if (!activeChat) {
          // 显示新建聊天界面
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">开始新的对话</h2>
                <p className="text-muted-foreground mb-6">
                  您有 {chats.length} 个聊天会话，选择一个联系人开始聊天，或创建一个新的对话。
                </p>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  新建聊天
                </Button>
              </div>
            </div>
          );
        }

        return (
          <>
            {/* Chat header */}
            <ChatHeader
              user={activeUser || contacts[0]}
              onMenuClick={() => setIsMobileSidebarOpen(true)}
            />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {(messages[activeChat] || []).map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input area */}
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={(content) => {
                handleSendMessage(content);
                setInputValue('');
              }}
            />
          </>
        );
      case 'contacts':
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-16 px-4 border-b border-border flex items-center justify-between">
              <h1 className="text-foreground/90 text-[18px] font-semibold">联系人</h1>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 rounded-full"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => {
                    setActiveChat(contact.id);
                    setActiveSidebarItem('chats');

                    // 清除未读消息计数
                    setChats((prev) =>
                      prev.map((chat) =>
                        chat.id === contact.id ? { ...chat, unreadCount: 0 } : chat
                      )
                    );
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar || '/placeholder.svg'} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                    {contact.status === 'away' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {contact.status === 'online'
                        ? '在线'
                        : contact.status === 'away'
                          ? '离开'
                          : contact.lastSeen
                            ? `最后在线 ${new Date(contact.lastSeen).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`
                            : '离线'}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex flex-col h-full">
            <div className="h-16 px-4 border-b border-border flex items-center justify-between">
              <h1 className="text-foreground/90 text-[18px] font-semibold">设置</h1>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 rounded-full"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-6 max-w-2xl mx-auto">
                <div className="grid gap-8 pb-10">
                  {/* 外观设置 */}
                  <div className="bg-card/50 rounded-lg p-5 border border-border/50">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">外观</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="theme" className="mb-1">
                            主题
                          </Label>
                          <span className="text-xs text-muted-foreground">选择明亮或暗黑主题</span>
                        </div>
                        <ModeToggle />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="font-size" className="mb-1">
                            字体大小
                          </Label>
                          <span className="text-xs text-muted-foreground">调整界面文字大小</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            小
                          </Button>
                          <Button variant="default" size="sm" className="h-8 w-8 p-0">
                            中
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            大
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 通知设置 */}
                  <div className="bg-card/50 rounded-lg p-5 border border-border/50">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">通知</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="notifications" className="mb-1">
                            启用通知
                          </Label>
                          <span className="text-xs text-muted-foreground">接收新消息通知</span>
                        </div>
                        <Switch id="notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="sound" className="mb-1">
                            声音提醒
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            收到消息时播放提示音
                          </span>
                        </div>
                        <Switch id="sound" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="desktop" className="mb-1">
                            桌面通知
                          </Label>
                          <span className="text-xs text-muted-foreground">在桌面显示通知弹窗</span>
                        </div>
                        <Switch id="desktop" defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* 隐私设置 */}
                  <div className="bg-card/50 rounded-lg p-5 border border-border/50">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">隐私</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="read-receipts" className="mb-1">
                            已读回执
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            让他人知道您已读取消息
                          </span>
                        </div>
                        <Switch id="read-receipts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="typing-indicator" className="mb-1">
                            输入指示器
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            显示您正在输入的状态
                          </span>
                        </div>
                        <Switch id="typing-indicator" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="online-status" className="mb-1">
                            在线状态
                          </Label>
                          <span className="text-xs text-muted-foreground">显示您的在线状态</span>
                        </div>
                        <Switch id="online-status" defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* 数据与存储 */}
                  <div className="bg-card/50 rounded-lg p-5 border border-border/50">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">数据与存储</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                        <div className="flex flex-col">
                          <Label htmlFor="auto-download" className="mb-1">
                            自动下载媒体
                          </Label>
                          <span className="text-xs text-muted-foreground">自动下载图片和视频</span>
                        </div>
                        <Switch id="auto-download" defaultChecked />
                      </div>
                      <div className="p-3 rounded-md border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <Label className="mb-1">存储使用</Label>
                            <span className="text-xs text-muted-foreground">
                              已使用 1.2GB / 5GB
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            清理缓存
                          </Button>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">选择一个选项开始</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden border border-border">
      {/* Mobile sidebar using Sheet component */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-80 bg-sidebar border-r border-border [&_.sheet-close-button]:hidden"
        >
          <ChatSidebar
            onSelectItem={(id) => {
              handleSidebarItemSelect(id);
              setIsMobileSidebarOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="w-72 bg-sidebar border-r border-border flex-shrink-0 hidden md:block">
        <ChatSidebar onSelectItem={handleSidebarItemSelect} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-chat">{renderContent()}</div>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">设置</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              自定义您的聊天界面设置
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-foreground">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-foreground">
                主题
              </Label>
              <ModeToggle />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-foreground">
                通知
              </Label>
              <div className="flex h-5 items-center space-x-2">
                <Switch id="notifications" defaultChecked />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="text-foreground">
                声音
              </Label>
              <div className="flex h-5 items-center space-x-2">
                <Switch id="sound" defaultChecked />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
