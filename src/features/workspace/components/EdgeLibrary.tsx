import React from 'react'
import { ArrowRight, Link, GitBranch, TrendingUp } from 'lucide-react'
import { EdgeType } from '@/shared/types'
import { Badge } from '@/components/ui/badge'

interface EdgeTypeItem {
  type: EdgeType
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description: string
  gradient: string
}

const edgeTypes: EdgeTypeItem[] = [
  {
    type: EdgeType.TRANSACTION,
    label: '交易连线',
    icon: ArrowRight,
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    gradient: 'from-green-500 to-emerald-500',
    description: '表示资金转账流向'
  },
  {
    type: EdgeType.OWNERSHIP,
    label: '所有权',
    icon: Link,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    gradient: 'from-blue-500 to-cyan-500',
    description: '表示实体所有关系'
  },
  {
    type: EdgeType.RELATION,
    label: '关联关系',
    icon: GitBranch,
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    gradient: 'from-purple-500 to-violet-500',
    description: '表示逻辑关联'
  },
  {
    type: EdgeType.FLOW,
    label: '资金流',
    icon: TrendingUp,
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    gradient: 'from-orange-500 to-amber-500',
    description: '表示资金流动方向'
  }
]

// 获取连线颜色
function getEdgeColor(edgeType: EdgeType): string {
  switch (edgeType) {
    case EdgeType.TRANSACTION:
      return '#10b981'
    case EdgeType.OWNERSHIP:
      return '#3b82f6'
    case EdgeType.RELATION:
      return '#8b5cf6'
    case EdgeType.FLOW:
      return '#f59e0b'
    default:
      return '#6b7280'
  }
}

// 创建连线拖拽预览图像
function createEdgeDragPreview(edgeType: EdgeType): HTMLElement {
  const edgeInfo = edgeTypes.find(e => e.type === edgeType)
  
  // 创建容器
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.top = '-1000px'
  container.style.left = '-1000px'
  container.style.opacity = '0.8'
  container.style.width = '100px'
  container.style.height = '60px'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'
  
  // 创建连线容器
  const lineContainer = document.createElement('div')
  lineContainer.style.display = 'flex'
  lineContainer.style.alignItems = 'center'
  lineContainer.style.justifyContent = 'space-between'
  lineContainer.style.width = '80px'
  lineContainer.style.height = '30px'
  lineContainer.style.position = 'relative'
  
  // 创建起始节点
  const startNode = document.createElement('div')
  startNode.style.width = '16px'
  startNode.style.height = '16px'
  startNode.style.borderRadius = '50%'
  startNode.style.backgroundColor = '#d1d5db'
  startNode.style.border = '2px solid #ffffff'
  
  // 创建结束节点
  const endNode = document.createElement('div')
  endNode.style.width = '16px'
  endNode.style.height = '16px'
  endNode.style.borderRadius = '50%'
  endNode.style.backgroundColor = '#d1d5db'
  endNode.style.border = '2px solid #ffffff'
  
  // 创建连线
  const line = document.createElement('div')
  line.style.position = 'absolute'
  line.style.left = '18px'
  line.style.right = '18px'
  line.style.height = '3px'
  line.style.backgroundColor = getEdgeColor(edgeType)
  line.style.top = '50%'
  line.style.transform = 'translateY(-50%)'
  
  // 创建箭头
  const arrow = document.createElement('div')
  arrow.style.position = 'absolute'
  arrow.style.right = '12px'
  arrow.style.top = '50%'
  arrow.style.transform = 'translateY(-50%)'
  arrow.style.width = '0'
  arrow.style.height = '0'
  arrow.style.borderLeft = `6px solid ${getEdgeColor(edgeType)}`
  arrow.style.borderTop = '4px solid transparent'
  arrow.style.borderBottom = '4px solid transparent'
  
  lineContainer.appendChild(startNode)
  lineContainer.appendChild(line)
  lineContainer.appendChild(arrow)
  lineContainer.appendChild(endNode)
  
  // 创建标签
  const label = document.createElement('div')
  label.textContent = edgeInfo?.label || '连线'
  label.style.textAlign = 'center'
  label.style.fontSize = '10px'
  label.style.fontFamily = 'system-ui'
  label.style.color = '#374151'
  label.style.marginTop = '5px'
  
  container.appendChild(lineContainer)
  container.appendChild(label)
  
  document.body.appendChild(container)
  
  return container
}

const EdgeLibrary: React.FC = () => {
  const handleDragStart = (event: React.DragEvent, edgeType: EdgeType) => {
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: 'edgeType',
      edgeType
    }))
    
    // 创建自定义拖拽预览
    const dragPreview = createEdgeDragPreview(edgeType)
    event.dataTransfer.setDragImage(dragPreview, 50, 30)
    
    // 清理预览元素
    setTimeout(() => {
      document.body.removeChild(dragPreview)
    }, 0)
  }

  return (
    <div className="space-y-1">
      {edgeTypes.map((edgeType) => {
        const IconComponent = edgeType.icon
        
        return (
          <div
            key={edgeType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, edgeType.type)}
            className="group relative p-2 rounded-md hover:bg-accent/5 transition-all duration-200 cursor-move"
          >
            <div className="flex items-center gap-2">
              {/* 图标容器 */}
              <div className={`relative p-1.5 rounded ${edgeType.bgColor}`}>
                <IconComponent className={`w-3 h-3 ${edgeType.color}`} />
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-medium text-xs text-foreground">
                    {edgeType.label}
                  </h4>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {edgeType.type}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {edgeType.description}
                </p>
              </div>
              
              {/* 拖拽指示器 */}
              <div className="flex flex-col gap-0.5 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full"></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EdgeLibrary 