import { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function SecureAccess() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setError('');
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // This is where you would validate the access code
    // For now, let's simulate a validation
    setTimeout(() => {
      if (value === '123456') {
        // replace with your actual validation
        navigate('/'); // redirect to home or protected content
      } else {
        setError('密码不正确，请重试');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center gap-2 mb-10">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">ParchmentChat</h1>
      </div>
      <Card className="border-border bg-card/50 backdrop-blur max-w-md w-full mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-2xl font-bold">房间需要密码访问</h1>
            <p className="text-muted-foreground">请输入 6 位数密码来访问此内容</p>
          </div>

          <div className="w-full">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={handleValueChange}
              containerClassName="justify-center gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={value.length !== 6 || isLoading}
          >
            {isLoading ? '验证中...' : '访问内容'}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, 3, -3, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                repeatDelay: 1,
              }}
            >
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.div>
          </Button>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <p>如果您没有密码，请联系分享者获取</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

