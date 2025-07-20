import * as d3 from 'd3'
import { D3NodeData, D3LinkData, D3GraphData } from '@/shared/types'
import { NodeType } from '@/shared/types'
import { formatAddress } from './addressUtils'

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 准备 D3 数据
export function prepareD3Data(
  nodes: D3NodeData[], 
  edges: D3LinkData[]
): D3GraphData {
  // 保持节点的当前位置
  const preparedNodes = nodes.map(node => ({
    ...node,
    fx: node.x && node.y ? node.x : null,
    fy: node.x && node.y ? node.y : null
  }))
  
  return { nodes: preparedNodes, links: edges }
}

// 处理连线数据，确保 source 和 target 是节点对象
export function processLinkData(links: D3LinkData[], nodes: D3NodeData[]): D3LinkData[] {
  return links.map(link => ({
    ...link,
    source: typeof link.source === 'string' 
      ? nodes.find(n => n.id === link.source) || link.source
      : link.source,
    target: typeof link.target === 'string' 
      ? nodes.find(n => n.id === link.target) || link.target
      : link.target
  }))
}

// 获取连线的源节点
export function getLinkSource(link: D3LinkData, nodes: D3NodeData[]): D3NodeData | undefined {
  return typeof link.source === 'string' 
    ? nodes.find(n => n.id === link.source) 
    : link.source
}

// 获取连线的目标节点
export function getLinkTarget(link: D3LinkData, nodes: D3NodeData[]): D3NodeData | undefined {
  return typeof link.target === 'string' 
    ? nodes.find(n => n.id === link.target) 
    : link.target
}

// 创建背景网格
export function createBackgroundGrid(svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>, isDark: boolean) {
  const defs = svg.append('defs')
  
  // 创建背景网格
  const gridPattern = defs.append('pattern')
    .attr('id', 'grid')
    .attr('width', 20)
    .attr('height', 20)
    .attr('patternUnits', 'userSpaceOnUse')

  gridPattern.append('path')
    .attr('d', 'M 20 0 L 0 0 0 20')
    .attr('fill', 'none')
    .attr('stroke', isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
    .attr('stroke-width', 0.5)

  svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'url(#grid)')
    .style('pointer-events', 'none')
}

// 创建箭头标记
export function createArrowMarkers(svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>, isDark: boolean) {
  const defs = svg.append('defs')
  
  // 添加箭头标记
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 9)
    .attr('refY', 3)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,0 L0,6 L9,3 z')
    .attr('fill', isDark ? '#ffffff' : '#000000')
}

// 格式化节点标签
export function formatNodeLabel(node: D3NodeData): string {
  const value = node.value
  if (node.nodeType === NodeType.ADDRESS) {
    return value.startsWith('0x') && value.length === 42
      ? formatAddress(value)
      : value.length > 15 
        ? `${value.substring(0, 15)}...`
        : value
  }
  return value.length > 15 
    ? `${value.substring(0, 15)}...`
    : value
} 