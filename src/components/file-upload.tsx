import type React from 'react';

import { useRef, useState, useEffect } from 'react';
import { Paperclip, ImageIcon, FileText, Video, Music, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export function FileUpload({ onFileSelected }: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const allFilesInputRef = useRef<HTMLInputElement>(null);

  // 处理点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
      setIsOpen(false);
    }
  };

  const handleItemClick = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted"
        onClick={toggleMenu}
        type="button"
      >
        <Paperclip className="h-5 w-5" />
        <span className="sr-only">附件</span>
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full mb-2 left-0 w-56 py-1 rounded-md bg-[#1A1A1D] shadow-md z-50"
        >
          <button
            type="button"
            onClick={() => handleItemClick(imageInputRef)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 focus:bg-muted/20 focus:outline-none"
          >
            <ImageIcon className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm">图片</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, GIF等格式</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleItemClick(documentInputRef)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 focus:bg-muted/20 focus:outline-none"
          >
            <FileText className="h-4 w-4 text-green-500" />
            <div className="flex flex-col">
              <span className="text-sm">文档</span>
              <span className="text-xs text-muted-foreground">PDF, DOC, TXT等格式</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleItemClick(audioInputRef)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 focus:bg-muted/20 focus:outline-none"
          >
            <Music className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-sm">音频</span>
              <span className="text-xs text-muted-foreground">MP3, WAV等格式</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleItemClick(videoInputRef)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 focus:bg-muted/20 focus:outline-none"
          >
            <Video className="h-4 w-4 text-rose-500" />
            <div className="flex flex-col">
              <span className="text-sm">视频</span>
              <span className="text-xs text-muted-foreground">MP4, MOV等格式</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleItemClick(allFilesInputRef)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 focus:bg-muted/20 focus:outline-none"
          >
            <File className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm">全部文件类型</span>
              <span className="text-xs text-muted-foreground">选择任意类型文件</span>
            </div>
          </button>
        </div>
      )}

      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
      />
      <input
        type="file"
        ref={audioInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
      <input type="file" ref={allFilesInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
}
