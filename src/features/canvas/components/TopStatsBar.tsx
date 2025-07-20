import React from "react";
import { useCanvasStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Circle, ArrowRight, Database, Plus, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NodeLibrary from "@/features/workspace/components/NodeLibrary";
import EdgeLibrary from "@/features/workspace/components/EdgeLibrary";
import { NodeType } from "@/shared/types";
import { getSampleData } from "@/shared/utils/sampleData";
import { ModeToggle } from "@/components/common/mode-toggle";
import toast from "react-hot-toast";

const TopStatsBar: React.FC = () => {
  const { nodes, edges, importData, resetViewport } = useCanvasStore();

  const handleDragStart = (event: React.DragEvent, type: "node" | "edge") => {
    const dragData =
      type === "node"
        ? { type: "node", nodeType: NodeType.ADDRESS }
        : { type: "edgeType", edgeType: "TRANSACTION" };

    event.dataTransfer.setData("application/json", JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = "copy";
  };

  const loadSampleData = () => {
    try {
      const sampleData = getSampleData();
      importData(sampleData);
      resetViewport();
      toast.success("演示数据已加载！现在可以拖拽节点测试编辑功能了");
    } catch (error) {
      console.error("Failed to load sample data:", error);
      toast.error("加载演示数据失败");
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <Card className="px-4 py-2 bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
        <div className="flex items-center justify-between">
          {/* 左侧：数据操作 */}
          <div className="flex items-center gap-4">
            {/* 加载演示数据 */}
            <Button
              variant="outline"
              size="sm"
              onClick={loadSampleData}
              title="加载演示数据"
              className="h-6 px-2"
            >
              <Database className="w-3 h-3 mr-1" />
              演示数据
            </Button>

            {/* 竖线分隔符 */}
            <div className="w-px h-4 bg-border" />

            {/* 节点统计和添加 */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <div
                  className="flex items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-accent/50 rounded px-2 py-1 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "node")}
                  title="拖拽添加节点或点击选择节点类型"
                >
                  <Circle className="w-4 h-4 text-blue-500" />
                  {nodes.length}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                className="w-64 p-2"
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                <div className="text-xs font-medium mb-2 text-muted-foreground">
                  添加不同类型的区块链实体
                </div>
                <div className="space-y-1">
                  <NodeLibrary />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 竖线分隔符 */}
            <div className="w-px h-4 bg-border" />

            {/* 连线统计和添加 */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <div
                  className="flex items-center gap-2 cursor-grab active:cursor-grabbing hover:bg-accent/50 rounded px-2 py-1 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "edge")}
                  title="拖拽添加连线或点击选择连线类型"
                >
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  {edges.length}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                className="w-64 p-2"
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                <div className="text-xs font-medium mb-2 text-muted-foreground">
                  定义实体之间的关系
                </div>
                <div className="space-y-1">
                  <EdgeLibrary />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 右侧：主题切换 */}
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TopStatsBar;
