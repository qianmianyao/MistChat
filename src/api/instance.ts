import reactHook from 'alova/react';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { ResponseData } from './types';

// 创建 alova 实例
export const alovaInstance = createAlova({
  baseURL: '/api/v1', // 把基础路径提取出来
  requestAdapter: adapterFetch(),
  statesHook: reactHook,
  responded: <T>(response: Response) => response.json() as Promise<ResponseData<T>>,
});
