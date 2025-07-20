import { createTRPCReact } from '@trpc/react-query';
// import type { AppRouter } from '../../../bin-flow-trpc/server';

// 暂时使用any类型，等待trpc服务器配置
export const trpcClient = createTRPCReact<any>(); 

