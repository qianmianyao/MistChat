'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Smile, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileUpload } from '@/components/file-upload';
import { Badge } from '@/components/ui/badge';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (content: string) => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || selectedFile) {
        onSend(value.trim());
        setSelectedFile(null);
      }
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // 这里可以添加文件预览或上传逻辑
    console.log('Selected file:', file.name, file.type, file.size);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎬';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('doc')) return '📝';
    return '📎';
  };

  return (
    <div className="p-3 border-t border-border">
      {selectedFile && (
        <div className="mb-2">
          <Badge variant="secondary" className="gap-1 py-1 pl-2 pr-1">
            <span className="flex items-center gap-1.5">
              <span>{getFileIcon(selectedFile.type)}</span>
              <span className="max-w-[200px] truncate">{selectedFile.name}</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full ml-1"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted"
        >
          <Smile className="h-5 w-5" />
          <span className="sr-only">表情</span>
        </Button>

        <FileUpload onFileSelected={handleFileSelected} />

        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-1 h-9 bg-muted border-none text-foreground/80 text-[14px] placeholder:text-muted-foreground"
        />

        <Button
          onClick={() => {
            if (value.trim() || selectedFile) {
              onSend(value.trim());
              setSelectedFile(null);
            }
          }}
          size="icon"
          variant={value.trim() || selectedFile ? 'default' : 'ghost'}
          className={cn(
            'h-9 w-9 rounded-full flex items-center justify-center',
            !(value.trim() || selectedFile) && 'bg-muted hover:bg-muted/80 text-foreground/80'
          )}
        >
          <ChevronUp className="h-4 w-4" />
          <span className="sr-only">发送</span>
        </Button>
      </div>
    </div>
  );
}
