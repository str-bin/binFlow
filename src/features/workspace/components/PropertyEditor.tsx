import React from 'react'
import { useCanvasStore } from '@/store'
import { NodeType } from '@/shared/types'
import { Edit3, Save, X } from 'lucide-react'
import AddressPropertyEditor from './AddressPropertyEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PropertyEditor: React.FC = () => {
  const { 
    nodes, 
    edges, 
    selectedNodes, 
    selectedEdges, 
    updateNode, 
    updateEdge,
    isPropertyEditing,
    setPropertyEditing
  } = useCanvasStore()
  
  // 获取选中的项目
  const selectedNode = selectedNodes.length === 1 
    ? nodes.find(node => node.id === selectedNodes[0])
    : null
    
  const selectedEdge = selectedEdges.length === 1
    ? edges.find(edge => edge.id === selectedEdges[0])
    : null
  
  if (!selectedNode && !selectedEdge) {
    return null
  }
  
  const handleSaveProperty = (key: string, value: any) => {
    if (selectedNode) {
      updateNode(selectedNode.id, {
        [key]: value
      })
    } else if (selectedEdge) {
      updateEdge(selectedEdge.id, {
        [key]: value
      })
    }
    setPropertyEditing(false)
  }
  
  const renderPropertyEditor = () => {
    if (selectedNode) {
      // 地址节点使用专门的编辑器
      if (selectedNode.nodeType === NodeType.ADDRESS) {
        return <AddressPropertyEditor node={selectedNode} />
      }
      
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">节点数据</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPropertyEditing(!isPropertyEditing)}
            >
              {isPropertyEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* 基本信息 */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">ID</Label>
              <div className="p-2 bg-muted rounded text-xs font-mono">
                {selectedNode.id}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">类型</Label>
              <div className="p-2 bg-muted rounded text-xs">
                {selectedNode.nodeType}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">值</Label>
              {isPropertyEditing ? (
                <Input
                  defaultValue={selectedNode.value}
                  className="text-xs"
                  onBlur={(e) => handleSaveProperty('value', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-muted rounded text-xs">
                  {selectedNode.value}
                </div>
              )}
            </div>
            
            {/* 标签 */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">标签</Label>
              <div className="flex flex-wrap gap-1">
                {selectedNode.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              {isPropertyEditing && (
                <Input
                  placeholder="添加标签 (逗号分隔)"
                  className="text-xs"
                  onBlur={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    handleSaveProperty('tags', tags)
                    e.target.value = ''
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )
    }
    
    if (selectedEdge) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">连线数据</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPropertyEditing(!isPropertyEditing)}
            >
              {isPropertyEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">ID</Label>
              <div className="p-2 bg-muted rounded text-xs font-mono">
                {selectedEdge.id}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">类型</Label>
              <div className="p-2 bg-muted rounded text-xs">
                {selectedEdge.edgeType}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">值</Label>
              {isPropertyEditing ? (
                <Input
                  defaultValue={selectedEdge.value || ''}
                  className="text-xs"
                  onBlur={(e) => handleSaveProperty('value', e.target.value)}
                />
              ) : (
                <div className="p-2 bg-muted rounded text-xs">
                  {selectedEdge.value || '无'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">方向</Label>
              <Select 
                value={selectedEdge.direction || 'outgoing'} 
                onValueChange={(value) => handleSaveProperty('direction', value)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="选择方向" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outgoing">流出</SelectItem>
                  <SelectItem value="incoming">流入</SelectItem>
                  <SelectItem value="bidirectional">双向</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">线宽</Label>
              <Slider
                value={[selectedEdge.visual.width || 2]}
                onValueChange={(value) => {
                  updateEdge(selectedEdge.id, {
                    visual: {
                      ...selectedEdge.visual,
                      width: value[0]
                    }
                  })
                }}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                {selectedEdge.visual.width || 2}px
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">颜色</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={selectedEdge.visual.color || '#6b7280'}
                  onChange={(e) => {
                    updateEdge(selectedEdge.id, {
                      visual: {
                        ...selectedEdge.visual,
                        color: e.target.value
                      }
                    })
                  }}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={selectedEdge.visual.color || '#6b7280'}
                  onChange={(e) => {
                    updateEdge(selectedEdge.id, {
                      visual: {
                        ...selectedEdge.visual,
                        color: e.target.value
                      }
                    })
                  }}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="p-4 space-y-4">
      {renderPropertyEditor()}
    </div>
  )
}

export default PropertyEditor 