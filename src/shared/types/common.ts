// 节点类型枚举
export enum NodeType {
  ADDRESS = 'address',
  ENTITY = 'entity',
  PROJECT = 'project'
}

// 边类型枚举
export enum EdgeType {
  TRANSACTION = 'transaction',
  OWNERSHIP = 'ownership',
  RELATION = 'relation',
  FLOW = 'flow'
}

// 可视化属性接口
export interface VisualProperties {
  color?: string
  size?: number
  shape?: string
  opacity?: number
  strokeColor?: string
  strokeWidth?: number
  x?: number
  y?: number
  fixed?: boolean
}

// 基础属性接口
export interface BaseAttributes {
  [key: string]: any
}

// 元数据接口
export interface Metadata {
  createdAt?: string
  updatedAt?: string
  source?: string
  confidence?: number
  [key: string]: any
}

// 节点数据接口
export interface NodeData {
  value: string
  attributes: BaseAttributes
  tags: string[]
  metadata: Metadata
  visualProperties: VisualProperties
  // 地址节点的详细信息
  addressDetails?: import('./address').AddressDetails
}

// 节点接口
export interface CryptoNode {
  nodeId: string
  nodeType: NodeType
  data: NodeData
}

// 边数据接口
export interface EdgeData {
  value?: string
  timestamp?: string
  direction?: 'incoming' | 'outgoing' | 'bidirectional'
  attributes: BaseAttributes
  metadata: Metadata
  visualProperties: VisualProperties
}

// 边接口
export interface CryptoEdge {
  edgeId: string
  sourceNodeId: string
  targetNodeId: string
  edgeType: EdgeType
  data: EdgeData
}

// 画布状态接口
export interface CanvasState {
  nodes: any[] // 将在 d3.ts 中重新定义
  edges: any[] // 将在 d3.ts 中重新定义
  selectedNodes: string[]
  selectedEdges: string[]
  viewport: {
    x: number
    y: number
    zoom: number
  }
  mode: 'select' | 'pan' | 'connect' | 'drag'
}

// 布局算法类型
export enum LayoutType {
  FORCE = 'force',
  HIERARCHICAL = 'hierarchical',
  CIRCULAR = 'circular',
  GRID = 'grid',
  MANUAL = 'manual'
}

// 分析结果接口
export interface AnalysisResult {
  id: string
  type: 'path' | 'cluster' | 'centrality' | 'flow'
  data: any
  timestamp: string
  description: string
}

// 过滤器接口
export interface Filter {
  nodeTypes?: NodeType[]
  edgeTypes?: EdgeType[]
  tags?: string[]
  timeRange?: {
    start: string
    end: string
  }
  valueRange?: {
    min: number
    max: number
  }
}

// 搜索结果接口
export interface SearchResult {
  nodeId?: string
  edgeId?: string
  type: 'node' | 'edge'
  match: string
  score: number
} 