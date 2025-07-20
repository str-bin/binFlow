import { CryptoNode, CryptoEdge, LayoutType } from '@/shared/types'

export interface LayoutResult {
  nodes: CryptoNode[]
}

// 力导向布局算法（简化版本）
export const forceDirectedLayout = (
  nodes: CryptoNode[], 
  edges: CryptoEdge[],
  width: number = 800,
  height: number = 600,
  iterations: number = 100
): LayoutResult => {
  const positions = new Map<string, { x: number, y: number }>()
  const forces = new Map<string, { fx: number, fy: number }>()
  
  // 初始化位置
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI
    const radius = Math.min(width, height) * 0.3
    positions.set(node.nodeId, {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius
    })
    forces.set(node.nodeId, { fx: 0, fy: 0 })
  })
  
  // 构建邻接表
  const adjacency = new Map<string, string[]>()
  nodes.forEach(node => adjacency.set(node.nodeId, []))
  edges.forEach(edge => {
    const sourceNeighbors = adjacency.get(edge.sourceNodeId) || []
    const targetNeighbors = adjacency.get(edge.targetNodeId) || []
    sourceNeighbors.push(edge.targetNodeId)
    targetNeighbors.push(edge.sourceNodeId)
  })
  
  // 力导向算法迭代
  for (let iter = 0; iter < iterations; iter++) {
    // 重置力
    forces.forEach(force => {
      force.fx = 0
      force.fy = 0
    })
    
    // 计算排斥力
    nodes.forEach(nodeA => {
      nodes.forEach(nodeB => {
        if (nodeA.nodeId === nodeB.nodeId) return
        
        const posA = positions.get(nodeA.nodeId)!
        const posB = positions.get(nodeB.nodeId)!
        const dx = posA.x - posB.x
        const dy = posA.y - posB.y
        const distance = Math.sqrt(dx * dx + dy * dy) || 1
        
        const repulsionForce = 1000 / (distance * distance)
        const forceA = forces.get(nodeA.nodeId)!
        forceA.fx += (dx / distance) * repulsionForce
        forceA.fy += (dy / distance) * repulsionForce
      })
    })
    
    // 计算吸引力（连边）
    edges.forEach(edge => {
      const posSource = positions.get(edge.sourceNodeId)!
      const posTarget = positions.get(edge.targetNodeId)!
      const dx = posTarget.x - posSource.x
      const dy = posTarget.y - posSource.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1
      
      const springForce = distance * 0.01
      
      const forceSource = forces.get(edge.sourceNodeId)!
      const forceTarget = forces.get(edge.targetNodeId)!
      
      forceSource.fx += (dx / distance) * springForce
      forceSource.fy += (dy / distance) * springForce
      forceTarget.fx -= (dx / distance) * springForce
      forceTarget.fy -= (dy / distance) * springForce
    })
    
    // 应用力并更新位置
    const damping = 0.9
    nodes.forEach(node => {
      const pos = positions.get(node.nodeId)!
      const force = forces.get(node.nodeId)!
      
      pos.x += force.fx * damping
      pos.y += force.fy * damping
      
      // 边界约束
      pos.x = Math.max(50, Math.min(width - 50, pos.x))
      pos.y = Math.max(50, Math.min(height - 50, pos.y))
    })
  }
  
  // 更新节点位置
  const updatedNodes = nodes.map(node => {
    const pos = positions.get(node.nodeId)!
    return {
      ...node,
      data: {
        ...node.data,
        visualProperties: {
          ...node.data.visualProperties,
          x: pos.x,
          y: pos.y
        }
      }
    }
  })
  
  return { nodes: updatedNodes }
}

// 层次布局算法
export const hierarchicalLayout = (
  nodes: CryptoNode[], 
  edges: CryptoEdge[],
  width: number = 800,
  height: number = 600
): LayoutResult => {
  // 构建有向图并计算层级
  const adjacency = new Map<string, string[]>()
  const inDegree = new Map<string, number>()
  
  nodes.forEach(node => {
    adjacency.set(node.nodeId, [])
    inDegree.set(node.nodeId, 0)
  })
  
  edges.forEach(edge => {
    const neighbors = adjacency.get(edge.sourceNodeId) || []
    neighbors.push(edge.targetNodeId)
    inDegree.set(edge.targetNodeId, (inDegree.get(edge.targetNodeId) || 0) + 1)
  })
  
  // 拓扑排序确定层级
  const levels: string[][] = []
  const queue: string[] = []
  const tempInDegree = new Map(inDegree)
  
  // 找到入度为0的节点作为第一层
  nodes.forEach(node => {
    if (tempInDegree.get(node.nodeId) === 0) {
      queue.push(node.nodeId)
    }
  })
  
  while (queue.length > 0) {
    const currentLevel: string[] = []
    const levelSize = queue.length
    
    for (let i = 0; i < levelSize; i++) {
      const nodeId = queue.shift()!
      currentLevel.push(nodeId)
      
      const neighbors = adjacency.get(nodeId) || []
      neighbors.forEach(neighbor => {
        const newInDegree = (tempInDegree.get(neighbor) || 0) - 1
        tempInDegree.set(neighbor, newInDegree)
        if (newInDegree === 0) {
          queue.push(neighbor)
        }
      })
    }
    
    if (currentLevel.length > 0) {
      levels.push(currentLevel)
    }
  }
  
  // 如果有环，将剩余节点放在最后一层
  const processedNodes = new Set(levels.flat())
  const remainingNodes = nodes.filter(node => !processedNodes.has(node.nodeId))
  if (remainingNodes.length > 0) {
    levels.push(remainingNodes.map(node => node.nodeId))
  }
  
  // 计算位置
  const levelHeight = height / Math.max(levels.length, 1)
  const updatedNodes = nodes.map(node => {
    const levelIndex = levels.findIndex(level => level.includes(node.nodeId))
    const positionInLevel = levels[levelIndex].indexOf(node.nodeId)
    const levelWidth = width / Math.max(levels[levelIndex].length, 1)
    
    return {
      ...node,
      data: {
        ...node.data,
        visualProperties: {
          ...node.data.visualProperties,
          x: levelWidth * (positionInLevel + 0.5),
          y: levelHeight * (levelIndex + 0.5)
        }
      }
    }
  })
  
  return { nodes: updatedNodes }
}

// 环形布局算法
export const circularLayout = (
  nodes: CryptoNode[],
  edges: CryptoEdge[],
  width: number = 800,
  height: number = 600
): LayoutResult => {
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.4
  
  const updatedNodes = nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    return {
      ...node,
      data: {
        ...node.data,
        visualProperties: {
          ...node.data.visualProperties,
          x,
          y
        }
      }
    }
  })
  
  return { nodes: updatedNodes }
}

// 网格布局算法
export const gridLayout = (
  nodes: CryptoNode[],
  edges: CryptoEdge[],
  width: number = 800,
  height: number = 600
): LayoutResult => {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  const rows = Math.ceil(nodes.length / cols)
  const cellWidth = width / cols
  const cellHeight = height / rows
  
  const updatedNodes = nodes.map((node, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const x = cellWidth * (col + 0.5)
    const y = cellHeight * (row + 0.5)
    
    return {
      ...node,
      data: {
        ...node.data,
        visualProperties: {
          ...node.data.visualProperties,
          x,
          y
        }
      }
    }
  })
  
  return { nodes: updatedNodes }
}

// 布局算法调度器
export const applyLayout = (
  layoutType: LayoutType,
  nodes: CryptoNode[],
  edges: CryptoEdge[],
  width?: number,
  height?: number
): LayoutResult => {
  switch (layoutType) {
    case LayoutType.FORCE:
      return forceDirectedLayout(nodes, edges, width, height)
    case LayoutType.HIERARCHICAL:
      return hierarchicalLayout(nodes, edges, width, height)
    case LayoutType.CIRCULAR:
      return circularLayout(nodes, edges, width, height)
    case LayoutType.GRID:
      return gridLayout(nodes, edges, width, height)
    default:
      return { nodes }
  }
} 