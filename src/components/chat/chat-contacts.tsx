import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu } from 'lucide-react';
import { User } from '@/components/chat/chat-interface';
import { useNavigate } from 'react-router-dom';

interface ContactsProps {
  contacts: User[];
}

export function ChatContacts({ contacts }: ContactsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        <h1 className="text-foreground/90 text-[18px] font-semibold">联系人</h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 rounded-full"
          onClick={() => {}}
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
              navigate(`/chat/${contact.id}`);
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
}
