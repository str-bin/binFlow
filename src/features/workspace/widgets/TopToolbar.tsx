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
  Search,
  ChevronDown
} from 'lucide-react'
import { useCanvasStore } from '@/store'
import { getSampleData } from '@/shared/utils/sampleData'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/common/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import NodeLibrary from '@/features/workspace/components/NodeLibrary'
import EdgeLibrary from '@/features/workspace/components/EdgeLibrary'
import toast from 'react-hot-toast'

const TopToolbar: React.FC = () => {
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
    <div className="border-b border-border bg-background">
      {/* 顶部工具栏 */}
      <div className="h-12 flex items-center justify-between px-4">
        {/* 左侧 - 文件操作 */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" title="新建">
            <FolderOpen className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="保存">
            <Save className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Button variant="ghost" size="icon" title="导入">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="导出">
            <Download className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={loadSampleData}
            title="加载演示数据"
          >
            <Database className="w-4 h-4" />
          </Button>
        </div>


        {/* 右侧 - 工具操作 */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" title="撤销">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="重做">
            <Redo className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleZoomIn}
            title={`放大 (当前: ${Math.round(viewport.zoom * 100)}%)`}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleZoomOut}
            title={`缩小 (当前: ${Math.round(viewport.zoom * 100)}%)`}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleResetView}
            title="重置视图"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Button variant="ghost" size="icon" title="开始分析">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="设置">
            <Settings className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <ModeToggle />
        </div>
      </div>

      {/* 菜单栏 */}
      <div className="h-16 border-t border-border/50 flex items-center px-4 space-x-4">
        {/* 节点类型 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="w-3 h-3 mr-1" />
              节点类型
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            <div className="text-xs font-medium mb-2 text-muted-foreground">添加不同类型的区块链实体</div>
            <div className="space-y-1">
              <NodeLibrary />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 连线类型 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Zap className="w-3 h-3 mr-1" />
              连线类型
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            <div className="text-xs font-medium mb-2 text-muted-foreground">定义实体之间的关系</div>
            <div className="space-y-1">
              <EdgeLibrary />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 数据工具 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Database className="w-3 h-3 mr-1" />
              数据工具
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
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

        <Separator orientation="vertical" className="h-6" />

        {/* 帮助信息 */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xs">
            <span className="font-medium text-blue-900 dark:text-blue-100">拖拽节点到画布创建您的第一个分析图表</span>
          </div>
          <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2">
            查看教程
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TopToolbar 