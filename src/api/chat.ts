import { alovaInstance } from './instance';
import { ResponseData } from './types';

// 注册响应类型
interface ChatRegisterResponse {
  username: string;
  uid: string;
}

// 注册方法
export const chatRegister = (username: string) =>
  alovaInstance.Post<ResponseData<ChatRegisterResponse>>(
    '/chat/register',
    { username },
    { cacheFor: 0 }
  );
