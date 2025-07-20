import React, { useRef, useEffect, useCallback, useState } from 'react'
import * as d3 from 'd3'
import { useCanvasStore } from '@/store'
import { 
  D3NodeData, 
  D3LinkData, 
  createForceLayout,
  createZoomBehavior
} from '@/shared/types'
import { useTheme } from '@/providers/theme-provider'
import { useD3Layout } from '@/shared/hooks'
import { useD3Drag, useD3Drop, useD3Keyboard, useD3Theme } from '../hooks'
import { prepareD3Data, createBackgroundGrid, createArrowMarkers, formatNodeLabel, processLinkData, getLinkSource, getLinkTarget } from '@/shared/utils'
import D3LayoutPanel from './D3LayoutPanel'
import LeftToolbar from '@/features/workspace/widgets/LeftToolbar'
import ConnectionPreview from './ConnectionPreview'
import { NodeType, EdgeType } from '@/shared/types'

const D3Canvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<D3NodeData, D3LinkData> | null>(null)
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [showLayoutPanel, setShowLayoutPanel] = useState(false)
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(true)
  const [currentZoom, setCurrentZoom] = useState(1)
  
  const { theme } = useTheme()
  const { settings, updateSetting, createSimulation } = useD3Layout()
  
  const { 
    nodes, 
    edges, 
    selectedNodes,
    selectedEdges,
    connectionState,
    startConnection,
    updateConnectionMousePosition,
    finishConnection,
    cancelConnection,
    selectNode,
    selectEdge,
    clearSelection
  } = useCanvasStore()

  // 获取当前实际主题
  const getActualTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }
  
  const isDark = getActualTheme() === "dark"

  // 使用自定义 hooks
  const { handleDrag } = useD3Drag(() => {
    // 拖拽时立即更新连线位置，不等待仿真
    const mainGroup = d3.select(svgRef.current).select('.main-group')
    if (mainGroup.node()) {
      const links = mainGroup.select('.links').selectAll<SVGGElement, D3LinkData>('.link')
      
      links.select('line')
        .attr('x1', (d: D3LinkData) => getLinkSource(d, nodes)?.x || 0)
        .attr('y1', (d: D3LinkData) => getLinkSource(d, nodes)?.y || 0)
        .attr('x2', (d: D3LinkData) => getLinkTarget(d, nodes)?.x || 0)
        .attr('y2', (d: D3LinkData) => getLinkTarget(d, nodes)?.y || 0)

      links.select('text')
        .attr('x', (d: D3LinkData) => {
          const source = getLinkSource(d, nodes)
          const target = getLinkTarget(d, nodes)
          return ((source?.x || 0) + (target?.x || 0)) / 2
        })
        .attr('y', (d: D3LinkData) => {
          const source = getLinkSource(d, nodes)
          const target = getLinkTarget(d, nodes)
          return ((source?.y || 0) + (target?.y || 0)) / 2
        })
    }
  })
  const { handleDrop } = useD3Drop(isDark)
  const themeUtils = useD3Theme(isDark)

  // 使用键盘快捷键
  useD3Keyboard(svgRef, zoomBehaviorRef)

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (connectionState.isCreating) {
      const svgElement = svgRef.current
      if (svgElement) {
        const point = d3.pointer(event, svgElement)
        const transform = d3.zoomTransform(svgElement)
        const [x, y] = transform.invert(point)
        updateConnectionMousePosition({ x, y })
      }
    }
  }, [connectionState.isCreating, updateConnectionMousePosition])

  // 处理画布点击事件
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (connectionState.isCreating) {
      cancelConnection()
    }
  }, [connectionState.isCreating, cancelConnection])

  // 初始化和更新 D3 可视化
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const container = containerRef.current
    
    if (!svg.node() || !container) return

    // 清除之前的内容
    svg.selectAll('*').remove()

    // 创建背景网格和箭头标记
    createBackgroundGrid(svg, isDark)
    createArrowMarkers(svg, isDark)

    // 创建主要的容器组
    const mainGroup = svg.append('g').attr('class', 'main-group')

    // 获取数据
    const d3Graph = prepareD3Data(nodes, edges)

    // 确保连线的 source 和 target 是节点对象
    const processedLinks = processLinkData(d3Graph.links, d3Graph.nodes)

    // 创建或更新力仿真
    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    simulationRef.current = createForceLayout(d3Graph.nodes, processedLinks)

    // 创建边
    const linkGroup = mainGroup.append('g').attr('class', 'links')
    const link = linkGroup.selectAll('.link')
      .data(processedLinks)
      .enter().append('g')
      .attr('class', 'link')

    link.append('line')
      .attr('stroke', (d: D3LinkData) => d.visual.color)
      .attr('stroke-width', (d: D3LinkData) => d.visual.width)
      .attr('stroke-opacity', (d: D3LinkData) => d.visual.opacity)
      .attr('marker-end', 'url(#arrowhead)')
      .style('cursor', 'pointer')
      .on('click', (event, d: D3LinkData) => {
        event.stopPropagation()
        selectEdge(d.id)
      })

    // 添加边标签
    link.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', themeUtils.colors.text)
      .style('pointer-events', 'none')
      .text((d: D3LinkData) => d.value || '')

    // 创建节点
    const nodeGroup = mainGroup.append('g').attr('class', 'nodes')
    const node = nodeGroup.selectAll('.node')
      .data(d3Graph.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')

    // 添加选中状态外圈
    node.append('circle')
      .attr('class', 'selection-ring')
      .attr('r', (d: D3NodeData) => d.visual.size / 2 + 4)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .style('opacity', (d: D3NodeData) => selectedNodes.includes(d.id) ? 1 : 0)

    // 添加主节点圆圈
    node.append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d: D3NodeData) => d.visual.size / 2)
      .attr('fill', (d: D3NodeData) => d.visual.color)
      .attr('stroke', themeUtils.colors.stroke)
      .attr('stroke-width', 2)
      .attr('opacity', (d: D3NodeData) => d.visual.opacity)

    // 添加节点图标
    node.append('g')
      .attr('class', 'node-icon')
      .style('pointer-events', 'none')
      .each(function(d: D3NodeData) {
        const iconGroup = d3.select(this)
        // 使用节点的icon属性，如果没有则使用themeUtils
        const iconSvg = d.visual.icon || themeUtils.getNodeIcon(d.nodeType)
        iconGroup.html(iconSvg)
        
        // 设置图标样式
        iconGroup.select('svg')
          .attr('width', '16')
          .attr('height', '16')
          .attr('fill', 'none')
          .attr('stroke', '#ffffff')
          .style('display', 'block')
      })
      // 设置图标居中定位
      .attr('transform', 'translate(-8, -8)')

    // 添加节点标签
    node.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: D3NodeData) => d.visual.size / 2 + 20)
      .attr('font-size', '12px')
      .attr('fill', themeUtils.colors.text)
      .style('pointer-events', 'none')
      .text((d: D3NodeData) => formatNodeLabel(d))

    // 应用拖拽行为到节点
    node.call(handleDrag(simulationRef.current) as any)

    // 添加节点拖拽事件处理
    node.on('drop', (event: any, d: D3NodeData) => {
      event.preventDefault()
      event.stopPropagation()
      
      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        
        if (data.type === 'edgeType') {
          // 开始连线创建
          startConnection(d.id, data.edgeType)
        }
      } catch (error) {
        console.error('Error handling node drop:', error)
      }
    })

    // 添加节点拖拽悬停事件
    node.on('dragover', (event: any) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    })

    // 添加节点点击事件处理
    node.on('click', (event: any, d: D3NodeData) => {
      event.stopPropagation()
      event.preventDefault()
      
      console.log('Node clicked:', d.id)
      
      // 直接从 store 获取最新状态
      const currentState = useCanvasStore.getState()
      console.log('Current connection state:', currentState.connectionState)
      
      if (currentState.connectionState.isCreating && currentState.connectionState.sourceNodeId !== d.id) {
        console.log('Finishing connection from', currentState.connectionState.sourceNodeId, 'to', d.id)
        // 完成连线创建
        finishConnection(d.id)
      } else {
        console.log('Selecting node:', d.id)
        // 正常选择节点
        selectNode(d.id)
      }
    })

    // 更新仿真
    simulationRef.current.on('tick', () => {
      // 重新选择连线元素，确保获取到最新的连线
      const links = mainGroup.select('.links').selectAll<SVGGElement, D3LinkData>('.link')
      
      links.select('line')
        .attr('x1', (d: D3LinkData) => getLinkSource(d, d3Graph.nodes)?.x || 0)
        .attr('y1', (d: D3LinkData) => getLinkSource(d, d3Graph.nodes)?.y || 0)
        .attr('x2', (d: D3LinkData) => getLinkTarget(d, d3Graph.nodes)?.x || 0)
        .attr('y2', (d: D3LinkData) => getLinkTarget(d, d3Graph.nodes)?.y || 0)

      links.select('text')
        .attr('x', (d: D3LinkData) => {
          const source = getLinkSource(d, d3Graph.nodes)
          const target = getLinkTarget(d, d3Graph.nodes)
          return ((source?.x || 0) + (target?.x || 0)) / 2
        })
        .attr('y', (d: D3LinkData) => {
          const source = getLinkSource(d, d3Graph.nodes)
          const target = getLinkTarget(d, d3Graph.nodes)
          return ((source?.y || 0) + (target?.y || 0)) / 2
        })

      node.attr('transform', (d: D3NodeData) => `translate(${d.x},${d.y})`)
    })

    // 设置缩放和拖拽
    const zoomBehavior = createZoomBehavior(svg as d3.Selection<SVGSVGElement, unknown, null, undefined>, (transform) => {
      setCurrentZoom(transform.k)
    })
    zoomBehaviorRef.current = zoomBehavior
    svg.call(zoomBehavior as any)

    // 应用初始变换
    const initialTransform = d3.zoomIdentity
      .translate(0, 0)
      .scale(1)
    
    svg.call(zoomBehavior.transform as any, initialTransform)

    // 处理画布点击清除选择
    svg.on('click', (event) => {
      if (event.target === svg.node()) {
        if (connectionState.isCreating) {
          cancelConnection()
        } else {
          clearSelection()
        }
      }
    })

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [nodes, edges, selectedNodes, selectedEdges, isDark, handleDrag, selectEdge, clearSelection, themeUtils, startConnection, finishConnection, cancelConnection, selectNode])

  return (
    <div className="relative w-full h-full bg-background">
      {/* 顶部工具栏 */}
      <div className="absolute top-4 left-4 z-10">
        <LeftToolbar />
      </div>
      
      {/* 布局面板 */}
      {showLayoutPanel && (
        <div className="absolute top-4 right-4 z-10">
          <D3LayoutPanel
            settings={settings}
            onSettingChange={updateSetting}
            onRestart={() => {
              if (simulationRef.current) {
                simulationRef.current.alpha(1).restart()
              }
            }}
            onPause={() => {
              if (simulationRef.current) {
                simulationRef.current.stop()
                setIsSimulationPlaying(false)
              }
            }}
            onPlay={() => {
              if (simulationRef.current) {
                simulationRef.current.alpha(1).restart()
                setIsSimulationPlaying(true)
              }
            }}
            isPlaying={isSimulationPlaying}
          />
        </div>
      )}
      
      {/* 画布容器 */}
      <div 
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
        onDrop={(e) => handleDrop(e, svgRef)}
        onDragOver={(e) => e.preventDefault()}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ 
            background: isDark ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)'
          }}
        />
        
        {/* 连线预览 */}
        <ConnectionPreview
          sourceNode={connectionState.sourceNodeId ? nodes.find(n => n.id === connectionState.sourceNodeId) || null : null}
          mousePosition={connectionState.mousePosition}
          edgeType={connectionState.edgeType}
          isVisible={connectionState.isCreating}
        />
      </div>
      
      {/* 布局面板切换按钮 */}
      <button
        onClick={() => setShowLayoutPanel(!showLayoutPanel)}
        className="absolute bottom-4 right-4 z-10 p-2 bg-background border border-border rounded-md shadow-sm hover:bg-accent transition-colors"
        title="布局设置"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  )
}

export default D3Canvas 