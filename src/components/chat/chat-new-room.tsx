import { Button } from '@/components/ui/button';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatNewRoomProps {
  messagesCount: number;
}

export function ChatNewRoom({ messagesCount }: ChatNewRoomProps) {
  const navigate = useNavigate();

  const handleCreateNewChat = () => {
    // 这里可以添加创建新聊天的逻辑
    // 然后导航到联系人选择页面或者直接创建聊天
    navigate('/chat/contacts');
  };

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
          您有 {messagesCount} 个聊天会话，选择一个联系人开始聊天，或创建一个新的对话。
        </p>
        <Button className="gap-2" onClick={handleCreateNewChat}>
          <PlusCircle className="h-4 w-4" />
          新建聊天
        </Button>
      </div>
    </div>
  );
}
