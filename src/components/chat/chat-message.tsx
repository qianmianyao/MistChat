import type { Message } from './chat-interface';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/ui/loading';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <Card
        className={cn(
          'max-w-[80%] px-3 py-2 border-0 shadow-none',
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground rounded-tr-[4px]'
            : 'bg-secondary text-secondary-foreground rounded-tl-[4px]'
        )}
      >
        <div className="flex flex-col space-y-0">
          <p className="text-[14px]">{message.content}</p>
          {isTyping && message.sender !== 'user' && (
            <div className="mt-1">
              <Loading variant="typing" size="sm" />
            </div>
          )}
          <div
            className={`flex items-center gap-1 mt-0 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <span className="text-[10px] opacity-70">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {message.sender === 'user' && message.status && (
              <span className="opacity-70">
                {message.status === 'sending' && <Clock className="h-3 w-3" />}
                {message.status === 'sent' && <Check className="h-3 w-3" />}
                {message.status === 'delivered' && <Check className="h-3 w-3" />}
                {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
