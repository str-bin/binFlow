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
import { NodeType } from '@/shared/types'

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
        clearSelection()
      }
    })

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [nodes, edges, selectedNodes, selectedEdges, isDark, handleDrag, selectEdge, clearSelection, themeUtils])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-muted/20"
      onDrop={(e) => {
        console.log('Container drop event triggered')
        handleDrop(e, svgRef)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor: 'grab' }}
        onDrop={(e) => {
          console.log('SVG drop event triggered')
          e.preventDefault()
          e.stopPropagation()
          handleDrop(e, svgRef)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      />
      
      {/* 左侧工具栏 */}
      <LeftToolbar />
      
      {/* 画布控制面板 */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 space-y-2 z-40">
        <button
          onClick={() => {
            if (simulationRef.current) {
              simulationRef.current.alpha(1).restart()
            }
          }}
          className="w-full text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90"
        >
          重新布局
        </button>
        <button
          onClick={() => setShowLayoutPanel(!showLayoutPanel)}
          className="w-full text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/90"
        >
          布局设置
        </button>
      </div>

      {/* 布局控制面板 */}
      {showLayoutPanel && (
        <div className="absolute top-4 left-20">
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

      {/* 画布信息显示 */}
      <div className="absolute bottom-4 left-20 bg-background/80 backdrop-blur-sm rounded-lg p-2 text-xs text-muted-foreground z-40">
        缩放: {Math.round(currentZoom * 100)}% | 节点: {nodes.length} | 连线: {edges.length}
      </div>
    </div>
  )
}

export default D3Canvas 