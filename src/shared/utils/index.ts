// 重新导出所有工具函数
export * from './addressUtils'
export * from './layoutAlgorithms'
export * from './sampleData'
export * from './classNames'
export * from './d3Renderer'

import { NodeType } from '@/shared/types'

// 获取节点图标的SVG内容 - 与Lucide React组件完全一致
export function getNodeIconSVG(nodeType: NodeType): string {
  const iconPaths: Record<NodeType, string> = {
    // Wallet图标 - 与Lucide React Wallet组件一致
    [NodeType.ADDRESS]: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
    // Building图标 - 与Lucide React Building组件一致
    [NodeType.ENTITY]: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    // Hash图标 - 与Lucide React Hash组件一致
    [NodeType.PROJECT]: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>'
  }
  
  return iconPaths[nodeType] || iconPaths[NodeType.ADDRESS]
} 