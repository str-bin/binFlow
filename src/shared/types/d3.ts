import * as d3 from 'd3'
import { NodeType, EdgeType, VisualProperties, BaseAttributes, Metadata } from './common'
import { AddressDetails } from './address'

// D3.js 节点数据接口 - 符合 D3.js 标准
export interface D3NodeData extends d3.SimulationNodeDatum {
  // D3.js 必需属性
  id: string
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  
  // 业务数据
  nodeType: NodeType
  value: string
  attributes: BaseAttributes
  tags: string[]
  metadata: Metadata
  addressDetails?: AddressDetails
  
  // 可视化属性
  visual: {
    color: string
    size: number
    opacity: number
    strokeColor: string
    strokeWidth: number
    icon: string
    label: string
  }
  
  // 状态属性
  selected: boolean
  hovered: boolean
  fixed: boolean
}

// D3.js 边数据接口 - 符合 D3.js 标准
export interface D3LinkData extends d3.SimulationLinkDatum<D3NodeData> {
  // D3.js 必需属性
  id: string
  source: D3NodeData | string
  target: D3NodeData | string
  
  // 业务数据
  edgeType: EdgeType
  value?: string
  timestamp?: string
  direction: 'incoming' | 'outgoing' | 'bidirectional'
  attributes: BaseAttributes
  metadata: Metadata
  
  // 可视化属性
  visual: {
    color: string
    width: number
    opacity: number
    strokeDasharray?: string
    arrowSize: number
  }
  
  // 状态属性
  selected: boolean
  hovered: boolean
}

// D3.js 图数据接口
export interface D3GraphData {
  nodes: D3NodeData[]
  links: D3LinkData[]
}

// 重新定义画布状态接口，使用 D3.js 数据格式
export interface D3CanvasState {
  nodes: D3NodeData[]
  edges: D3LinkData[]
  selectedNodes: string[]
  selectedEdges: string[]
  viewport: {
    x: number
    y: number
    zoom: number
  }
  mode: 'select' | 'pan' | 'connect' | 'drag'
}

// 布局配置接口
export interface D3LayoutConfig {
  type: 'force' | 'hierarchical' | 'circular' | 'grid'
  force: {
    charge: number
    linkDistance: number
    collisionRadius: number
    centerStrength: number
  }
  hierarchical: {
    direction: 'TB' | 'BT' | 'LR' | 'RL'
    nodeSeparation: number
    levelSeparation: number
  }
  circular: {
    radius: number
    startAngle: number
    endAngle: number
  }
  grid: {
    rows: number
    cols: number
    spacing: number
  }
}

// 视图状态接口
export interface D3ViewState {
  transform: d3.ZoomTransform
  center: [number, number]
  zoom: number
  bounds: [[number, number], [number, number]]
}

// 交互状态接口
export interface D3InteractionState {
  selectedNodes: string[]
  selectedLinks: string[]
  hoveredNode?: string
  hoveredLink?: string
  dragNode?: string
  panning: boolean
  zooming: boolean
}

// 动画配置接口
export interface D3AnimationConfig {
  duration: number
  easing: (t: number) => number
  delay?: number
}

// 主题配置接口
export interface D3ThemeConfig {
  dark: {
    background: string
    nodeColors: Record<NodeType, string>
    linkColors: Record<EdgeType, string>
    textColor: string
    gridColor: string
  }
  light: {
    background: string
    nodeColors: Record<NodeType, string>
    linkColors: Record<EdgeType, string>
    textColor: string
    gridColor: string
  }
}

// 默认主题配置
export const defaultD3Theme: D3ThemeConfig = {
  dark: {
    background: 'hsl(240 10% 3.9%)',
    nodeColors: {
      [NodeType.ADDRESS]: 'hsl(217 91% 60%)',
      [NodeType.ENTITY]: 'hsl(262 83% 58%)',
      [NodeType.PROJECT]: 'hsl(32 95% 44%)'
    },
    linkColors: {
      [EdgeType.TRANSACTION]: 'hsl(142 71% 45%)',
      [EdgeType.OWNERSHIP]: 'hsl(217 91% 60%)',
      [EdgeType.RELATION]: 'hsl(262 83% 58%)',
      [EdgeType.FLOW]: 'hsl(32 95% 44%)'
    },
    textColor: 'hsl(0 0% 98%)',
    gridColor: 'rgba(255,255,255,0.1)'
  },
  light: {
    background: 'hsl(0 0% 100%)',
    nodeColors: {
      [NodeType.ADDRESS]: 'hsl(217 91% 60%)',
      [NodeType.ENTITY]: 'hsl(262 83% 58%)',
      [NodeType.PROJECT]: 'hsl(32 95% 44%)'
    },
    linkColors: {
      [EdgeType.TRANSACTION]: 'hsl(142 71% 45%)',
      [EdgeType.OWNERSHIP]: 'hsl(217 91% 60%)',
      [EdgeType.RELATION]: 'hsl(262 83% 58%)',
      [EdgeType.FLOW]: 'hsl(32 95% 44%)'
    },
    textColor: 'hsl(240 10% 3.9%)',
    gridColor: 'rgba(0,0,0,0.1)'
  }
}

// 默认布局配置
export const defaultD3Layout: D3LayoutConfig = {
  type: 'force',
  force: {
    charge: -300,
    linkDistance: 100,
    collisionRadius: 30,
    centerStrength: 0.1
  },
  hierarchical: {
    direction: 'TB',
    nodeSeparation: 50,
    levelSeparation: 100
  },
  circular: {
    radius: 200,
    startAngle: 0,
    endAngle: 2 * Math.PI
  },
  grid: {
    rows: 10,
    cols: 10,
    spacing: 100
  }
}

// 默认动画配置
export const defaultD3Animation: D3AnimationConfig = {
  duration: 750,
  easing: d3.easeCubicInOut
}

// 工具函数：转换旧格式到 D3 格式
export function convertToD3Format(
  nodes: any[],
  edges: any[],
  theme: 'dark' | 'light' = 'light'
): D3GraphData {
  const themeConfig = defaultD3Theme[theme]
  
  const d3Nodes: D3NodeData[] = nodes.map(node => ({
    // D3.js 必需属性
    id: node.nodeId,
    x: node.data.visualProperties.x || Math.random() * 800,
    y: node.data.visualProperties.y || Math.random() * 600,
    fx: null,
    fy: null,
    
    // 业务数据
    nodeType: node.nodeType,
    value: node.data.value,
    attributes: node.data.attributes,
    tags: node.data.tags,
    metadata: node.data.metadata,
    addressDetails: node.data.addressDetails,
    
         // 可视化属性
     visual: {
       color: node.data.visualProperties.color || themeConfig.nodeColors[node.nodeType as NodeType],
       size: node.data.visualProperties.size || 40,
       opacity: node.data.visualProperties.opacity || 1,
       strokeColor: node.data.visualProperties.strokeColor || themeConfig.textColor,
       strokeWidth: node.data.visualProperties.strokeWidth || 2,
       icon: getNodeIcon(node.nodeType),
       label: node.data.value
     },
    
    // 状态属性
    selected: false,
    hovered: false,
    fixed: node.data.visualProperties.fixed || false
  }))
  
  const d3Links: D3LinkData[] = edges.map(edge => ({
    // D3.js 必需属性
    id: edge.edgeId,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    
    // 业务数据
    edgeType: edge.edgeType,
    value: edge.data.value,
    timestamp: edge.data.timestamp,
    direction: edge.data.direction || 'bidirectional',
    attributes: edge.data.attributes,
    metadata: edge.data.metadata,
    
         // 可视化属性
     visual: {
       color: edge.data.visualProperties.strokeColor || themeConfig.linkColors[edge.edgeType as EdgeType],
       width: edge.data.visualProperties.strokeWidth || 2,
       opacity: edge.data.visualProperties.opacity || 1,
       strokeDasharray: edge.data.visualProperties.strokeDasharray,
       arrowSize: 6
     },
    
    // 状态属性
    selected: false,
    hovered: false
  }))
  
  return { nodes: d3Nodes, links: d3Links }
}

// 工具函数：获取节点图标 - 现在使用SVG，所以返回空字符串
function getNodeIcon(nodeType: NodeType): string {
  return '' // SVG图标由D3Canvas组件处理
}

// 工具函数：创建 D3 力导向布局
export function createForceLayout(
  nodes: D3NodeData[],
  links: D3LinkData[],
  config: D3LayoutConfig = defaultD3Layout
): d3.Simulation<D3NodeData, D3LinkData> {
  return d3.forceSimulation<D3NodeData>(nodes)
    .force('link', d3.forceLink<D3NodeData, D3LinkData>(links)
      .id(d => d.id)
      .distance(config.force.linkDistance)
    )
    .force('charge', d3.forceManyBody().strength(config.force.charge))
    .force('center', d3.forceCenter(400, 300).strength(config.force.centerStrength))
    .force('collision', d3.forceCollide().radius(config.force.collisionRadius))
}

// 工具函数：创建 D3 缩放行为
export function createZoomBehavior(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  onZoom?: (transform: d3.ZoomTransform) => void
): d3.ZoomBehavior<SVGSVGElement, unknown> {
  return d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 3])
    .on('zoom', (event) => {
      const { transform } = event
      svg.select('.main-group').attr('transform', transform.toString())
      onZoom?.(transform)
    })
}

 