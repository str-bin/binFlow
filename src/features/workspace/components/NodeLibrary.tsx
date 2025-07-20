import React from 'react'
import { Wallet, Building, Hash } from 'lucide-react'
import { NodeType } from '@/shared/types'
import { Badge } from '@/components/ui/badge'
import { useD3Theme } from '@/features/canvas/hooks/useD3Theme'
import { useTheme } from '@/providers/theme-provider'
import { getNodeIconSVG } from '@/shared/utils'

interface NodeTypeInfo {
  type: NodeType
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline"
  description: string
  gradient: string
}

const nodeTypes: NodeTypeInfo[] = [
  {
    type: NodeType.ADDRESS,
    label: '地址',
    icon: Wallet,
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    gradient: 'from-blue-500 to-blue-600',
    badgeVariant: 'default',
    description: '区块链钱包地址'
  },
  {
    type: NodeType.ENTITY,
    label: '实体',
    icon: Building,
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    gradient: 'from-purple-500 to-purple-600',
    badgeVariant: 'outline',
    description: '企业或机构实体'
  },
  {
    type: NodeType.PROJECT,
    label: '项目',
    icon: Hash,
    color: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    gradient: 'from-yellow-500 to-yellow-600',
    badgeVariant: 'outline',
    description: '区块链项目或协议'
  }
]

// 获取节点颜色
function getNodeColor(nodeType: NodeType): string {
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
}

// 创建拖拽预览图像
function createDragPreview(nodeType: NodeType): HTMLElement {
  const nodeInfo = nodeTypes.find(n => n.type === nodeType)
  const IconComponent = nodeInfo?.icon || Wallet
  
  // 创建容器
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.top = '-1000px'
  container.style.left = '-1000px'
  container.style.opacity = '0.8'
  container.style.width = '60px'
  container.style.height = '80px'
  
  // 创建节点圆形
  const nodeCircle = document.createElement('div')
  nodeCircle.style.width = '40px'
  nodeCircle.style.height = '40px'
  nodeCircle.style.borderRadius = '50%'
  nodeCircle.style.backgroundColor = getNodeColor(nodeType)
  nodeCircle.style.border = '2px solid #ffffff'
  nodeCircle.style.display = 'flex'
  nodeCircle.style.alignItems = 'center'
  nodeCircle.style.justifyContent = 'center'
  nodeCircle.style.margin = '0 auto'
  nodeCircle.style.position = 'relative'
  
  // 创建图标容器
  const iconContainer = document.createElement('div')
  iconContainer.style.color = 'white'
  iconContainer.style.width = '16px'
  iconContainer.style.height = '16px'
  iconContainer.style.display = 'flex'
  iconContainer.style.alignItems = 'center'
  iconContainer.style.justifyContent = 'center'
  
  // 创建临时的图标元素来获取SVG内容
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.top = '-2000px'
  tempDiv.style.left = '-2000px'
  document.body.appendChild(tempDiv)
  
  // 使用React渲染图标到临时元素
  const iconElement = document.createElement('div')
  iconElement.innerHTML = getNodeIconSVG(nodeType)
  iconContainer.appendChild(iconElement)
  
  document.body.removeChild(tempDiv)
  
  nodeCircle.appendChild(iconContainer)
  
  // 创建标签
  const label = document.createElement('div')
  label.textContent = nodeInfo?.label || '节点'
  label.style.textAlign = 'center'
  label.style.fontSize = '10px'
  label.style.fontFamily = 'system-ui'
  label.style.color = '#374151'
  label.style.marginTop = '8px'
  
  container.appendChild(nodeCircle)
  container.appendChild(label)
  
  document.body.appendChild(container)
  
  return container
}



export default function NodeLibrary() {
  const { theme } = useTheme()
  const themeUtils = useD3Theme(theme === 'dark')
  
  // 添加全局拖拽监听器
  React.useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const handleGlobalDrop = (e: DragEvent) => {
      console.log('=== GLOBAL DROP EVENT ===')
      console.log('Global drop event triggered')
      console.log('Event target:', e.target)
      console.log('DataTransfer types:', e.dataTransfer?.types)
    }
    
    document.addEventListener('dragover', handleGlobalDragOver)
    document.addEventListener('drop', handleGlobalDrop)
    
    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver)
      document.removeEventListener('drop', handleGlobalDrop)
    }
  }, [])

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    const dragData = {
      type: 'node',
      nodeType
    }
    
    console.log('=== DRAG START ===')
    console.log('Drag start for node type:', nodeType)
    console.log('Setting drag data:', dragData)
    console.log('Event target:', event.target)
    console.log('Event currentTarget:', event.currentTarget)
    
    event.dataTransfer.setData('application/json', JSON.stringify(dragData))
    
    // 创建自定义拖拽预览
    const dragPreview = createDragPreview(nodeType)
    event.dataTransfer.setDragImage(dragPreview, 30, 40)
    
    // 清理预览元素
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview)
      }
    }, 0)
  }

  const handleDragEnd = (event: React.DragEvent, nodeType: NodeType) => {
    console.log('=== DRAG END ===')
    console.log('Drag end for node type:', nodeType)
    console.log('Event target:', event.target)
  }

  return (
    <div className="space-y-1">
      {nodeTypes.map((nodeType) => {
        const IconComponent = nodeType.icon
        
        return (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.type)}
            onDragEnd={(e) => handleDragEnd(e, nodeType.type)}
            className="group relative p-2 rounded-md hover:bg-accent/5 transition-all duration-200 cursor-move"
          >
            <div className="flex items-center gap-2">
              {/* 图标容器 */}
              <div className={`relative p-1.5 rounded ${nodeType.bgColor}`}>
                <IconComponent className={`w-3 h-3 ${nodeType.color}`} />
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-medium text-xs text-foreground">
                    {nodeType.label}
                  </h4>
                  <Badge variant={nodeType.badgeVariant} className="text-[9px] px-1 py-0">
                    {nodeType.type}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {nodeType.description}
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