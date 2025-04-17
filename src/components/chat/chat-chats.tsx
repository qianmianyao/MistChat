import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, User } from '@/components/chat/chat-interface';
import { useParams } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface ChatsProps {
  contacts: User[];
  messages: Record<string, Message[]>;
  handleSendMessage: (content: string, chatId: string) => void;
}

export function ChatChats({ contacts, messages, handleSendMessage }: ChatsProps) {
  const { chatId } = useParams();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatId]);

  const activeUser = contacts.find((contact) => contact.id === chatId);

  if (!chatId) {
    // 显示空状态页面
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="mb-6">
            <Shield className="h-20 w-20 text-primary opacity-70" />
          </div>
          <h2 className="text-2xl font-bold mb-4">安全对话</h2>
          <p className="text-muted-foreground">
            选择一个联系人开始聊天，或者创建一个新的对话。您的消息都受到端到端加密保护。
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat header */}
      <ChatHeader
        user={activeUser || contacts[0]}
        onMenuClick={() => {}} // 这里需要实现移动端菜单展开功能
      />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {(messages[chatId] || []).map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input area */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={(content) => {
          handleSendMessage(content, chatId);
          setInputValue('');
        }}
      />
    </>
  );
}
