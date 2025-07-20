import React from 'react'
import RightPanel from './widgets/RightPanel'
import ResizableHandle from '@/components/common/ResizableHandle'
import { useCanvasStore } from '@/store'

interface WorkspaceProps {
  children: React.ReactNode
}

const Workspace: React.FC<WorkspaceProps> = ({ children }) => {
  const rightPanelWidth = useCanvasStore(state => state.rightPanelWidth)
  const setRightPanelWidth = useCanvasStore(state => state.setRightPanelWidth)

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="flex h-full">
        {/* 中央内容区域 - 占据更多空间 */}
        <div className="flex-1 relative bg-muted/5">
          {children}
        </div>
        
        {/* 右侧调整手柄 */}
        <ResizableHandle
          onResize={setRightPanelWidth}
          initialWidth={rightPanelWidth}
          minWidth={200}
          maxWidth={600}
          direction="left"
        />
        
        {/* 右侧面板 */}
        <div style={{ width: rightPanelWidth }} className="flex-shrink-0">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}

export default Workspace 