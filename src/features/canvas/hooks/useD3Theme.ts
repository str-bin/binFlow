import { useMemo } from 'react'
import { NodeType, EdgeType } from '@/shared/types'
import { getNodeIconSVG } from '@/shared/utils'

export const useD3Theme = (isDark: boolean) => {
  const theme = useMemo(() => {
    return {
      // 获取节点颜色
      getNodeColor: (nodeType: NodeType): string => {
        switch (nodeType) {
          case NodeType.ADDRESS:
            return 'hsl(217 91% 60%)' // blue-500
          case NodeType.ENTITY:
            return 'hsl(262 83% 58%)' // purple-500
          case NodeType.PROJECT:
            return 'hsl(32 95% 44%)' // orange-600
          default:
            return 'hsl(var(--muted-foreground))'
        }
      },

      // 获取边颜色
      getEdgeColor: (edgeType: EdgeType) => {
        switch (edgeType) {
          case EdgeType.TRANSACTION:
            return 'hsl(142 71% 45%)' // green-600
          case EdgeType.OWNERSHIP:
            return 'hsl(217 91% 60%)' // blue-500
          case EdgeType.RELATION:
            return 'hsl(262 83% 58%)' // purple-500
          case EdgeType.FLOW:
            return 'hsl(32 95% 44%)' // orange-600
          default:
            return 'hsl(var(--muted-foreground))'
        }
      },

      // 获取节点图标 - 返回完整的SVG字符串
      getNodeIcon: (nodeType: NodeType): string => {
        return getNodeIconSVG(nodeType)
      },

      // 主题相关颜色
      colors: {
        background: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)',
        text: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)',
        grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        stroke: isDark ? '#374151' : '#e5e7eb',
        arrow: isDark ? '#ffffff' : '#000000'
      }
    }
  }, [isDark])

  return theme
} 