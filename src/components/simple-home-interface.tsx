import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, ArrowRight, RefreshCw, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRegister } from '@/hooks/useChat';
import { imageToast } from '@/components/ui/toaster';
import { useNavigate } from 'react-router-dom';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: Feature[] = [
  {
    id: '1',
    title: '端到端加密',
    description: '所有消息均采用端到端加密技术，确保只有您和接收者能够读取内容。',
    icon: <Lock className="h-5 w-5" />,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: '2',
    title: '匿名聊天',
    description: '无需注册或提供个人信息，保护您的隐私和身份安全。',
    icon: <Eye className="h-5 w-5" />,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: '3',
    title: '自动销毁',
    description: '消息可设置自动销毁时间，确保敏感信息不会永久存储。',
    icon: <RefreshCw className="h-5 w-5" />,
    color: 'bg-amber-500/10 text-amber-500',
  },
];

// 主页
export function SimpleHomeInterface() {
  const [username, setUsername] = useState('');
  const { handleRegister } = useRegister();
  const navigate = useNavigate();

  const register = async () => {
    if (!username) {
      return;
    }
    handleRegister(username)
      .then(() => {
        imageToast.success('注册成功');
        navigate('/chat');
      })
      .catch(() => {
        imageToast.error('注册失败,请重试');
      });
  };

  // 生成随机用户名
  const generateRandomCode = () => {
    const username = Math.random().toString(36).substring(2, 8).toUpperCase();
    setUsername(username);
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden py-20 md:py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="absolute -top-16 right-0"></div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-bold">Mist Chat</h2>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">迷雾笼罩，隐私无缺</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            也许，有些时候，我们需要一点隐私
            <br /> 无需注册，端到端加密，保护您的隐私和通信安全。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="选择生成或者输入你的用户名"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={generateRandomCode}
              >
                <Fingerprint className="h-4 w-4 mr-1" />
                生成
              </Button>
            </div>
            <Button onClick={register} size="lg" className="gap-2 w-full sm:w-auto">
              开始聊天 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            点击"开始聊天"即表示您同意我们的
            <a href="#" className="underline hover:text-primary p-1">
              服务条款
            </a>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">安全至上，隐私优先</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <Card key={feature.id} className="border-border bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center mb-4',
                    feature.color
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">如何使用</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: '创建匿名账号',
                description: '生成一个随机用户名或者指定用户获取匿名密钥',
              },
              {
                step: '2',
                title: '创建房间密钥',
                description: '创建一个需要或者不需要密码的房间，并且分享你的房间密钥',
              },
              {
                step: '3',
                title: '开始安全聊天',
                description: '所有消息都经过加密，聊天结束后可以自动销毁',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-6 px-4 md:px-6 text-center text-muted-foreground">
        <p className="mb-2">© 2025 Mist Chat. 保护您的隐私是我们的使命</p>
        <div className="flex justify-center gap-4 text-sm">
          <a href="#" className="hover:text-primary">
            隐私政策
          </a>
          <a href="#" className="hover:text-primary">
            服务条款
          </a>
          <a href="#" className="hover:text-primary">
            关于我们
          </a>
        </div>
      </footer>
    </div>
  );
}
