import React from 'react'
import { useCanvasStore } from '@/store'
import { NodeType, EdgeType } from '@/shared/types'
import { BarChart3, Network, Users, GitBranch } from 'lucide-react'

const StructureOverview: React.FC = () => {
  const { nodes, edges } = useCanvasStore()
  
  // 统计各类型节点数量
  const nodeStats = Object.values(NodeType).map(type => ({
    type,
    count: nodes.filter(node => node.nodeType === type).length,
    label: getNodeTypeLabel(type)
  }))
  
  // 统计各类型边数量
  const edgeStats = Object.values(EdgeType).map(type => ({
    type,
    count: edges.filter(edge => edge.edgeType === type).length,
    label: getEdgeTypeLabel(type)
  }))
  
  // 计算网络密度
  const maxEdges = nodes.length * (nodes.length - 1) / 2
  const density = maxEdges > 0 ? (edges.length / maxEdges * 100).toFixed(1) : '0'
  
  // 计算连通组件数（简化版本）
  const getConnectedComponents = () => {
    if (nodes.length === 0) return 0
    
    const visited = new Set<string>()
    const adjacency = new Map<string, string[]>()
    
    // 构建邻接表
    nodes.forEach(node => adjacency.set(node.id, []))
    edges.forEach(edge => {
      const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id
      const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id
      const sourceNeighbors = adjacency.get(sourceId) || []
      const targetNeighbors = adjacency.get(targetId) || []
      sourceNeighbors.push(targetId)
      targetNeighbors.push(sourceId)
    })
    
    let componentCount = 0
    
    const dfs = (nodeId: string) => {
      visited.add(nodeId)
      const neighbors = adjacency.get(nodeId) || []
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfs(neighbor)
        }
      })
    }
    
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id)
        componentCount++
      }
    })
    
    return componentCount
  }
  
  const connectedComponents = getConnectedComponents()
  
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-medium mb-4 flex items-center space-x-2">
        <BarChart3 className="w-4 h-4" />
        <span>网络概览</span>
      </h3>
      
      {/* 基本统计 */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600">节点总数</span>
            </div>
            <div className="text-lg font-semibold text-blue-800 mt-1">
              {nodes.length}
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">连线总数</span>
            </div>
            <div className="text-lg font-semibold text-green-800 mt-1">
              {edges.length}
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-purple-600">网络密度</span>
            </div>
            <div className="text-lg font-semibold text-purple-800 mt-1">
              {density}%
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600">连通组件</span>
            </div>
            <div className="text-lg font-semibold text-orange-800 mt-1">
              {connectedComponents}
            </div>
          </div>
        </div>
        
        {/* 节点类型分布 */}
        <div>
          <h4 className="text-sm font-medium mb-2">节点类型分布</h4>
          <div className="space-y-2">
            {nodeStats.map(stat => (
              <div key={stat.type} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ 
                        width: nodes.length > 0 ? `${(stat.count / nodes.length) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 连线类型分布 */}
        <div>
          <h4 className="text-sm font-medium mb-2">连线类型分布</h4>
          <div className="space-y-2">
            {edgeStats.map(stat => (
              <div key={stat.type} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: edges.length > 0 ? `${(stat.count / edges.length) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{stat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 快速操作 */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">快速操作</h4>
          <div className="space-y-2">
            <button className="w-full p-2 text-xs text-left border border-border rounded hover:bg-accent transition-colors">
              应用力导向布局
            </button>
            <button className="w-full p-2 text-xs text-left border border-border rounded hover:bg-accent transition-colors">
              检测社区结构
            </button>
            <button className="w-full p-2 text-xs text-left border border-border rounded hover:bg-accent transition-colors">
              查找关键节点
            </button>
            <button className="w-full p-2 text-xs text-left border border-border rounded hover:bg-accent transition-colors">
              导出网络数据
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 辅助函数
function getNodeTypeLabel(type: NodeType): string {
  switch (type) {
    case NodeType.ADDRESS:
      return '地址'
    case NodeType.TRANSACTION:
      return '交易'
    case NodeType.ENTITY:
      return '实体'
    case NodeType.PROJECT:
      return '项目'
    case NodeType.TAG:
      return '标签'
    default:
      return type
  }
}

function getEdgeTypeLabel(type: EdgeType): string {
  switch (type) {
    case EdgeType.TRANSACTION:
      return '交易'
    case EdgeType.OWNERSHIP:
      return '所有权'
    case EdgeType.RELATION:
      return '关系'
    case EdgeType.FLOW:
      return '流动'
    default:
      return type
  }
}

export default StructureOverview 