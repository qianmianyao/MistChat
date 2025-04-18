import { alovaInstance } from './instance';
import { ResponseData } from './types';

// 注册响应类型
interface ChatRegisterResponse {
  username: string;
  uuid: string;
}

// 注册方法
export const chatRegister = (username: string) =>
  alovaInstance.Post<ResponseData<ChatRegisterResponse>>(
    '/chat/register',
    { username },
    { cacheFor: 0 }
  );

// 创建房间
export const chatCreateRoom = (userUUID: string, roomName: string, password?: string) =>
  alovaInstance.Post<ResponseData<{ roomUUID: string }>>(
    '/chat/create_room',
    { user_uuid: userUUID, room_name: roomName, password },
    { cacheFor: 0 }
  );
