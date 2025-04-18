import { MessageSquare, PlusCircle, Eye, EyeOff } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateRoom } from '@/hooks/useChat';
import { useUserStore } from '@/stores/userStore';
import imageToast from '@/components/ui/toaster';

interface ChatNewRoomProps {
  messagesCount: number;
}

export function ChatNewRoom({ messagesCount }: ChatNewRoomProps) {
  const [open, setOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { handleCreateRoom } = useCreateRoom();
  const { user } = useUserStore();

  let uuid = '';
  if (user) {
    uuid = user.id;
  } else {
    imageToast.error('当前设备账号信息为空');
  }

  const formSchema = z.object({
    roomName: z.string().min(2, {
      message: '房间名称至少 2 个字符',
    }),
    password: z.string().refine((val) => val === '' || val.length === 6, {
      message: '密码只能是 6 位字符',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { roomName: '', password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleCreateRoom(uuid, values.roomName, values.password).then((res) => {
      if (res.status === 0) {
        imageToast.success('创建房间成功');

        setOpen(false);
        form.reset();
      } else {
        imageToast.error('创建房间失败');
      }
    });
  }

  // const navigate = useNavigate();

  // const handleCreateNewChat = () => {
  //   // 这里可以添加创建新聊天的逻辑
  //   // 然后导航到联系人选择页面或者直接创建聊天
  //   navigate('/chat/contacts');
  // };

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
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              新建聊天
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>新建聊天房间</DialogTitle>
              <DialogDescription>创建一个房间然后分享你的房间链接既可开始聊天</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="roomName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>房间名称</FormLabel>
                        <FormControl>
                          <Input placeholder="设置合适的房间名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>房间密码</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="密码只能是 6 位字符"
                              type={passwordVisible ? 'text' : 'password'}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                              {passwordVisible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          密码可选，如果不设置任何人都可以加入当前房间
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">创建房间</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
