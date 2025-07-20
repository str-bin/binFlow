import React from 'react'
import { useCanvasStore } from '@/store'
import { useUIStore } from '@/store'
import { Copy, Download, Eye, EyeOff } from 'lucide-react'

const JsonDataPanel: React.FC = () => {
  const { nodes, edges, viewport, selectedNodes, selectedEdges, mode } = useCanvasStore()
  
  const showPretty = useUIStore(state => state.jsonPanel.showPretty)
  const copiedField = useUIStore(state => state.jsonPanel.copiedField)
  const setShowPretty = useUIStore(state => state.setJsonShowPretty)
  const setCopiedField = useUIStore(state => state.setJsonCopiedField)

  // 构建完整的画布数据
  const canvasData = {
    metadata: {
      version: '1.0',
      createdAt: new Date().toISOString(),
      totalNodes: nodes.length,
      totalEdges: edges.length,
      selectedItems: {
        nodes: selectedNodes.length,
        edges: selectedEdges.length
      },
      viewport,
      mode
    },
    nodes,
    edges,
    selections: {
      selectedNodes,
      selectedEdges
    }
  }

  const jsonString = showPretty 
    ? JSON.stringify(canvasData, null, 2)
    : JSON.stringify(canvasData)

  const copyToClipboard = async (data: any, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `canvas-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部工具栏 */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">JSON 数据</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPretty(!showPretty)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title={showPretty ? "紧凑显示" : "格式化显示"}
            >
              {showPretty ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(canvasData, 'all')}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="复制全部数据"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={downloadJson}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="下载JSON文件"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* 数据统计 */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>节点: {nodes.length}</div>
          <div>连线: {edges.length}</div>
          <div>已选节点: {selectedNodes.length}</div>
          <div>已选连线: {selectedEdges.length}</div>
        </div>
        
        {copiedField && (
          <div className="mt-2 text-xs text-green-600">
            已复制到剪贴板!
          </div>
        )}
      </div>

      {/* JSON内容区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <pre className="p-3 text-xs font-mono leading-relaxed text-foreground bg-background">
            {jsonString}
          </pre>
        </div>
      </div>

      {/* 快速操作区域 */}
      <div className="p-3 border-t border-border">
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">快速操作</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => copyToClipboard(nodes, 'nodes')}
              className="px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded transition-colors"
            >
              复制节点
            </button>
            <button
              onClick={() => copyToClipboard(edges, 'edges')}
              className="px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded transition-colors"
            >
              复制连线
            </button>
            <button
              onClick={() => copyToClipboard({ selectedNodes, selectedEdges }, 'selections')}
              className="px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded transition-colors"
            >
              复制选择
            </button>
            <button
              onClick={() => copyToClipboard(viewport, 'viewport')}
              className="px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded transition-colors"
            >
              复制视图
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonDataPanel 