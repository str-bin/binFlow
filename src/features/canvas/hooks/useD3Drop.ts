import { useCallback } from 'react'
import * as d3 from 'd3'
import { v4 as uuidv4 } from 'uuid'
import { NodeType, D3NodeData, EdgeType } from '@/shared/types'
import { ChainType, AddressLabelType } from '@/shared/types/address'
import { useCanvasStore } from '@/store'
import { getNodeIconSVG } from '@/shared/utils'

export const useD3Drop = (isDark: boolean) => {
  const { addNode, selectNode, setPropertyEditing, startConnection } = useCanvasStore()

  const handleDrop = useCallback((event: React.DragEvent, svgRef: React.RefObject<SVGSVGElement>) => {
    event.preventDefault()
    
    console.log('=== DROP EVENT ===')
    console.log('Drop event triggered')
    console.log('Event target:', event.target)
    console.log('Event currentTarget:', event.currentTarget)
    console.log('DataTransfer types:', event.dataTransfer.types)
    
    // 获取节点颜色
    const getNodeColor = (nodeType: NodeType): string => {
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

    // 获取节点图标 - 使用共享的SVG图标
    const getNodeIcon = (nodeType: NodeType) => {
      return getNodeIconSVG(nodeType)
    }
    
    try {
      const data = JSON.parse(event.dataTransfer.getData('application/json'))
      console.log('Parsed drop data:', data)
      
      const svgElement = svgRef.current
      
      if (!svgElement) {
        console.error('SVG element not found')
        return
      }
      
      const point = d3.pointer(event, svgElement)
      console.log('Drop point:', point)
      
      // 转换屏幕坐标到 SVG 坐标
      const transform = d3.zoomTransform(svgElement)
      const [x, y] = transform.invert(point)
      console.log('Transformed coordinates:', { x, y })
      
      if (data.type === 'node') {
        console.log('Creating node of type:', data.nodeType)
        
        if (data.nodeType === NodeType.ADDRESS) {
          const newNode: D3NodeData = {
            id: uuidv4(),
            nodeType: NodeType.ADDRESS,
            value: '新地址',
            attributes: {
              chain: ChainType.ETHEREUM,
              labelType: AddressLabelType.UNKNOWN,
              isContract: false
            },
            tags: [],
            metadata: {
              createdAt: new Date().toISOString(),
              source: 'manual'
            },
            addressDetails: {
              address: '',
              chain: ChainType.ETHEREUM,
              labelType: AddressLabelType.UNKNOWN,
              isContract: false,
              tokens: [],
              customTags: [],
              dataSource: 'manual'
            },
            visual: {
              color: getNodeColor(NodeType.ADDRESS),
              size: 50,
              opacity: 1,
              strokeColor: isDark ? '#374151' : '#e5e7eb',
              strokeWidth: 2,
              icon: getNodeIcon(NodeType.ADDRESS),
              label: '新地址'
            },
            selected: false,
            hovered: false,
            fixed: false,
            x,
            y
          }
          console.log('Adding address node:', newNode)
          addNode(newNode)
          setTimeout(() => {
            selectNode(newNode.id)
            setPropertyEditing(true)
          }, 100)
        } else {
          const newNode: D3NodeData = {
            id: uuidv4(),
            nodeType: data.nodeType as NodeType,
            value: `New ${data.nodeType}`,
            attributes: {},
            tags: [],
            metadata: {
              createdAt: new Date().toISOString()
            },
            visual: {
              color: getNodeColor(data.nodeType),
              size: 40,
              opacity: 1,
              strokeColor: isDark ? '#374151' : '#e5e7eb',
              strokeWidth: 2,
              icon: getNodeIcon(data.nodeType),
              label: `New ${data.nodeType}`
            },
            selected: false,
            hovered: false,
            fixed: false,
            x,
            y
          }
          console.log('Adding node:', newNode)
          addNode(newNode)
          setTimeout(() => {
            selectNode(newNode.id)
            setPropertyEditing(true)
          }, 100)
        }
      } else if (data.type === 'edgeType') {
        console.log('Edge type dropped, but should be handled by node drop events')
        // 连线类型的拖拽应该由节点的事件处理，这里只是防止错误
      }
    } catch (error) {
      console.error('Error handling drop:', error)
    }
  }, [addNode, selectNode, setPropertyEditing, startConnection, isDark])

  return { handleDrop }
} 