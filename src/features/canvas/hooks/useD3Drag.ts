import { useCallback } from 'react'
import * as d3 from 'd3'
import { D3NodeData } from '@/shared/types'
import { useCanvasStore } from '@/store'

export const useD3Drag = (onDragUpdate?: () => void) => {
  const { selectNode, setPropertyEditing, updateNode } = useCanvasStore()

  const handleDrag = useCallback((simulation: d3.Simulation<D3NodeData, any> | null) => {
    function dragStarted(event: d3.D3DragEvent<SVGGElement, D3NodeData, D3NodeData>, d: D3NodeData) {
      if (!event.active && simulation) {
        simulation.alphaTarget(0.3).restart()
      }
      
      selectNode(d.id)
      setPropertyEditing(true)
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3NodeData, D3NodeData>, d: D3NodeData) {
      // 直接使用D3提供的坐标，不需要手动转换
      // D3的drag事件已经考虑了当前的变换
      const x = event.x
      const y = event.y
      
      // 更新节点的固定位置
      d.fx = x
      d.fy = y
      
      // 同步更新 Zustand store 中的位置
      updateNode(d.id, {
        x: x,
        y: y,
        visual: {
          ...d.visual,
          // 保持其他视觉属性不变
        }
      })

      // 调用回调函数更新连线位置
      if (onDragUpdate) {
        onDragUpdate()
      }
    }

    function dragEnded(event: d3.D3DragEvent<SVGGElement, D3NodeData, D3NodeData>, d: D3NodeData) {
      if (!event.active && simulation) {
        simulation.alphaTarget(0)
      }
      // 保持节点在拖拽结束时的位置
      d.fx = d.x
      d.fy = d.y
    }

    return d3.drag<SVGGElement, D3NodeData>()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded)
  }, [selectNode, setPropertyEditing, updateNode, onDragUpdate])

  return { handleDrag }
} 