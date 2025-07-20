import React from 'react'
import { useCanvasStore } from '@/store'
import { Palette, BarChart3, Settings, Code } from 'lucide-react'
import PropertyEditor from '../components/PropertyEditor'
import StructureOverview from '@/features/workspace/components/StructureOverview'
import StylePanel from '../components/StylePanel'
import JsonDataPanel from '../components/JsonDataPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabTriggerClass = "flex items-center gap-1 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent hover:bg-accent/50 px-3 py-2"

const RightPanel: React.FC = () => {
  const { selectedNodes, selectedEdges } = useCanvasStore()
  
  const hasSelection = selectedNodes.length > 0 || selectedEdges.length > 0

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="properties" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-border p-0 h-auto rounded-none">
          <TabsTrigger value="properties" className={tabTriggerClass}>
            <Settings className="w-3 h-3" />
            数据
          </TabsTrigger>
          <TabsTrigger value="overview" className={tabTriggerClass}>
            <BarChart3 className="w-3 h-3" />
            概览
          </TabsTrigger>
          <TabsTrigger value="style" className={tabTriggerClass}>
            <Palette className="w-3 h-3" />
            样式
          </TabsTrigger>
          <TabsTrigger value="json" className={tabTriggerClass}>
            <Code className="w-3 h-3" />
            JSON
          </TabsTrigger>
        </TabsList>

        
        <TabsContent value="properties" className="flex-1 overflow-hidden mt-0">
          <div className="h-full">
            {hasSelection ? (
              <PropertyEditor />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">选择节点或连线查看数据</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="flex-1 overflow-hidden mt-0">
          <div className="h-full">
            <StructureOverview />
          </div>
        </TabsContent>

        <TabsContent value="style" className="flex-1 overflow-hidden mt-0">
          <div className="h-full">
            <StylePanel />
          </div>
        </TabsContent>

        <TabsContent value="json" className="flex-1 overflow-hidden mt-0">
          <div className="h-full">
            <JsonDataPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RightPanel 