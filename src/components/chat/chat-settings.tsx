import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Menu, Settings, Bell, Lock, Database } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function ChatSettings() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="h-16 px-4 border-b border-border flex items-center justify-between">
        <h1 className="text-foreground/90 text-[18px] font-semibold">设置</h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 rounded-full"
          onClick={() => {}}
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
                    <span className="text-xs text-muted-foreground">收到消息时播放提示音</span>
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
                    <span className="text-xs text-muted-foreground">让他人知道您已读取消息</span>
                  </div>
                  <Switch id="read-receipts" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-md border border-border/50">
                  <div className="flex flex-col">
                    <Label htmlFor="typing-indicator" className="mb-1">
                      输入指示器
                    </Label>
                    <span className="text-xs text-muted-foreground">显示您正在输入的状态</span>
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
                      <span className="text-xs text-muted-foreground">已使用 1.2GB / 5GB</span>
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
}
