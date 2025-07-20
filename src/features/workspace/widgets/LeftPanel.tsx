import React, { useState } from 'react'
import { Plus, Sparkles, Zap, Database, Import, Search } from 'lucide-react'
import NodeLibrary from '@/features/workspace/components/NodeLibrary'
import EdgeLibrary from '@/features/workspace/components/EdgeLibrary'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const LeftPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* 主要内容区域 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* 节点组件库 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-medium">节点类型</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">
            添加不同类型的区块链实体
          </p>
          <NodeLibrary />
        </div>
        
        {/* 连线组件库 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-medium">连线类型</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">
            定义实体之间的关系
          </p>
          <EdgeLibrary />
        </div>
        
        {/* 数据工具 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-medium">数据工具</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">
            快速导入和管理数据
          </p>
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
        </div>

        {/* 帮助信息 */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                开始使用
              </h4>
              <p className="text-[10px] text-blue-700 dark:text-blue-200 mb-2">
                拖拽节点到画布创建您的第一个分析图表
              </p>
              <Button size="sm" className="text-[10px] h-6">
                查看教程
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftPanel 