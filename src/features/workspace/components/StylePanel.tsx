import React from 'react'
import { useCanvasStore } from '@/store'
import { NodeType, EdgeType } from '@/shared/types'
import { Palette, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

import { Separator } from '@/components/ui/separator'

const StylePanel: React.FC = () => {
  const { 
    nodes, 
    edges, 
    selectedNodes, 
    selectedEdges, 
    updateNode, 
    updateEdge 
  } = useCanvasStore()
  
  // 获取选中的项目
  const selectedNode = selectedNodes.length === 1 
    ? nodes.find(node => node.id === selectedNodes[0])
    : null
    
  const selectedEdge = selectedEdges.length === 1
    ? edges.find(edge => edge.id === selectedEdges[0])
    : null

  // 预定义颜色
  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#6b7280', '#1f2937', '#fbbf24', '#f97316'
  ]

  const updateNodeStyle = (property: string, value: any) => {
    if (selectedNode) {
      updateNode(selectedNode.id, {
        visual: {
          ...selectedNode.visual,
          [property]: value
        }
      })
    }
  }

  const updateEdgeStyle = (property: string, value: any) => {
    if (selectedEdge) {
      updateEdge(selectedEdge.id, {
        visual: {
          ...selectedEdge.visual,
          [property]: value
        }
      })
    }
  }

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">选择节点或连线查看样式设置</p>
      </div>
    )
  }

  const renderNodeStyleEditor = () => {
    if (!selectedNode) return null

    const { visual } = selectedNode
    
    return (
      <div className="space-y-6">
        {/* 标题 */}
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Palette className="w-4 h-4" />
          <h3 className="text-sm font-medium">节点样式</h3>
        </div>

        {/* 颜色设置 */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">颜色</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                style={{ backgroundColor: visual.color || '#6b7280' }}
              />
              <Input
                type="text"
                value={visual.color || '#6b7280'}
                onChange={(e) => updateNodeStyle('color', e.target.value)}
                className="flex-1 text-xs font-mono"
                placeholder="#6b7280"
              />
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="icon"
                  className="w-6 h-6 p-0 border-2"
                  style={{ backgroundColor: color }}
                  onClick={() => updateNodeStyle('color', color)}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* 大小设置 */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">大小</Label>
          <div className="space-y-2">
            <Slider
              value={[visual.size || 40]}
              onValueChange={(value) => updateNodeStyle('size', value[0])}
              max={100}
              min={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>20px</span>
              <span className="font-medium">{visual.size || 40}px</span>
              <span>100px</span>
            </div>
          </div>
        </div>



        {/* 透明度设置 */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">透明度</Label>
          <div className="space-y-2">
            <Slider
              value={[(visual.opacity || 1) * 100]}
              onValueChange={(value) => updateNodeStyle('opacity', value[0] / 100)}
              max={100}
              min={10}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span className="font-medium">{Math.round((visual.opacity || 1) * 100)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* 样式重置 */}
        <Button
          variant="outline"
          onClick={() => {
            const defaultColor = getDefaultNodeColor(selectedNode.nodeType)
            updateNodeStyle('color', defaultColor)
            updateNodeStyle('size', 40)
            updateNodeStyle('opacity', 1)
          }}
          className="w-full"
        >
          <RotateCcw className="w-3 h-3 mr-2" />
          重置样式
        </Button>
      </div>
    )
  }

  const renderEdgeStyleEditor = () => {
    if (!selectedEdge) return null

    const { visual } = selectedEdge
    
    return (
      <div className="space-y-6">
        {/* 标题 */}
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Palette className="w-4 h-4" />
          <h3 className="text-sm font-medium">连线样式</h3>
        </div>

        {/* 颜色设置 */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">颜色</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                style={{ backgroundColor: visual.color || '#6b7280' }}
              />
              <Input
                type="text"
                value={visual.color || '#6b7280'}
                onChange={(e) => updateEdgeStyle('color', e.target.value)}
                className="flex-1 text-xs font-mono"
                placeholder="#6b7280"
              />
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="icon"
                  className="w-6 h-6 p-0 border-2"
                  style={{ backgroundColor: color }}
                  onClick={() => updateEdgeStyle('strokeColor', color)}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* 线宽设置 */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">线条宽度</Label>
          <div className="space-y-2">
            <Slider
              value={[visual.width || 2]}
              onValueChange={(value) => updateEdgeStyle('width', value[0])}
              max={8}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1px</span>
              <span className="font-medium">{visual.width || 2}px</span>
              <span>8px</span>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          variant="outline"
          onClick={() => {
            updateEdgeStyle('strokeColor', '#6b7280')
            updateEdgeStyle('strokeWidth', 2)
          }}
          className="w-full"
        >
          <RotateCcw className="w-3 h-3 mr-2" />
          重置样式
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-4">
      {selectedNode && renderNodeStyleEditor()}
      {selectedEdge && renderEdgeStyleEditor()}
    </div>
  )
}

// 获取节点默认颜色
function getDefaultNodeColor(nodeType: NodeType): string {
  switch (nodeType) {
    case NodeType.ADDRESS:
      return 'hsl(217 91% 60%)' // blue-500
    case NodeType.TRANSACTION:
      return 'hsl(142 71% 45%)' // green-600
    case NodeType.ENTITY:
      return 'hsl(262 83% 58%)' // purple-500
    case NodeType.PROJECT:
      return 'hsl(32 95% 44%)' // orange-600
    case NodeType.TAG:
      return 'hsl(322 66% 68%)' // pink-400
    default:
      return 'hsl(var(--muted-foreground))'
  }
}

export default StylePanel 