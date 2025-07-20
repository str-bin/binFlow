import React, { useState } from 'react'
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Play,
  Settings,
  Database,
  Plus,
  Sparkles,
  Zap,
  Import,
  ChevronDown
} from 'lucide-react'
import { useCanvasStore } from '@/store'
import { getSampleData } from '@/shared/utils/sampleData'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/common/mode-toggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import NodeLibrary from '@/features/workspace/components/NodeLibrary'
import EdgeLibrary from '@/features/workspace/components/EdgeLibrary'
import toast from 'react-hot-toast'

const LeftToolbar: React.FC = () => {
  const { importData, resetViewport, viewport, updateViewport } = useCanvasStore()
  
  const loadSampleData = () => {
    try {
      const sampleData = getSampleData()
      importData(sampleData)
      resetViewport()
      toast.success('演示数据已加载！现在可以拖拽节点测试编辑功能了')
    } catch (error) {
      console.error('Failed to load sample data:', error)
      toast.error('加载演示数据失败')
    }
  }
  
  const handleZoomIn = () => {
    const newZoom = Math.min(3, viewport.zoom * 1.2)
    updateViewport({
      ...viewport,
      zoom: newZoom
    })
  }
  
  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, viewport.zoom * 0.8)
    updateViewport({
      ...viewport,
      zoom: newZoom
    })
  }
  
  const handleResetView = () => {
    resetViewport()
    toast.success('视图已重置')
  }
  
  return (
    <div className="absolute left-4 top-4 bottom-20 z-50">
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-2 flex flex-col gap-2 h-full w-12">

        {/* 文件操作 */}
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="icon" title="新建" className="h-7 w-7">
            <FolderOpen className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" title="保存" className="h-7 w-7">
            <Save className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" title="导入" className="h-7 w-7">
            <Upload className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" title="导出" className="h-7 w-7">
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={loadSampleData}
            title="加载演示数据"
            className="h-7 w-7"
          >
            <Database className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Separator orientation="horizontal" className="my-1" />

        {/* 节点和连线类型 */}
        <div className="flex flex-col gap-1">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" title="节点类型">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-64 p-2" onPointerDownOutside={(e) => e.preventDefault()}>
              <div className="text-xs font-medium mb-2 text-muted-foreground">添加不同类型的区块链实体</div>
              <div className="space-y-1">
                <NodeLibrary />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" title="连线类型">
                <Zap className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-64 p-2" onPointerDownOutside={(e) => e.preventDefault()}>
              <div className="text-xs font-medium mb-2 text-muted-foreground">定义实体之间的关系</div>
              <div className="space-y-1">
                <EdgeLibrary />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" title="数据工具">
                <Database className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-64 p-2" onPointerDownOutside={(e) => e.preventDefault()}>
              <div className="text-xs font-medium mb-2 text-muted-foreground">快速导入和管理数据</div>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start h-auto p-2" size="sm">
                  <Database className="w-3 h-3 mr-2 text-blue-500" />
                  <div className="text-left">
                    <div className="text-xs font-medium">批量导入</div>
                    <div className="text-[10px] text-muted-foreground">从文件导入数据</div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start h-auto p-2" size="sm">
                  <Import className="w-3 h-3 mr-2 text-green-500" />
                  <div className="text-left">
                    <div className="text-xs font-medium">区块浏览器</div>
                    <div className="text-[10px] text-muted-foreground">从链上获取数据</div>
                  </div>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="horizontal" className="my-1" />

        {/* 视图控制 */}
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="icon" title="撤销" className="h-7 w-7">
            <Undo className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" title="重做" className="h-7 w-7">
            <Redo className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleZoomIn}
            title={`放大 (当前: ${Math.round(viewport.zoom * 100)}%)`}
            className="h-7 w-7"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleZoomOut}
            title={`缩小 (当前: ${Math.round(viewport.zoom * 100)}%)`}
            className="h-7 w-7"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleResetView}
            title="重置视图"
            className="h-7 w-7"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Separator orientation="horizontal" className="my-1" />

        {/* 其他工具 */}
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="icon" title="开始分析" className="h-7 w-7">
            <Play className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" title="设置" className="h-7 w-7">
            <Settings className="w-3.5 h-3.5" />
          </Button>
          <ModeToggle />
        </div>

      </div>
    </div>
  )
}

export default LeftToolbar 