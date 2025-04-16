import type { User } from './chat-interface';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu, MessageSquare, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  user: User;
  onMenuClick: () => void;
}

export function ChatHeader({ user, onMenuClick }: ChatHeaderProps) {
  return (
    <div className="h-16 px-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">菜单</span>
        </Button>

        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {user.status === 'online' && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-chat"></span>
          )}
          {user.status === 'away' && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-chat"></span>
          )}
        </div>

        <div>
          <h2 className="text-foreground/90 text-[15px] font-medium">{user.name}</h2>
          <p className="text-muted-foreground text-[12px]">
            {user.status === 'online'
              ? '在线'
              : user.status === 'away'
                ? '离开'
                : user.lastSeen
                  ? `最后在线 ${new Date(user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : '离线'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">消息</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">更多</span>
        </Button>
      </div>
    </div>
  );
}
