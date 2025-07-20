import React, { useCallback, useEffect, useState } from 'react'

interface ResizableHandleProps {
  onResize: (width: number) => void
  initialWidth: number
  minWidth?: number
  maxWidth?: number
  direction?: 'left' | 'right'
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({
  onResize,
  initialWidth,
  minWidth = 200,
  maxWidth = 600,
  direction = 'left'
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(initialWidth)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.clientX)
    setStartWidth(initialWidth)
  }, [initialWidth])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = direction === 'left' ? startX - e.clientX : e.clientX - startX
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX))
    
    onResize(newWidth)
  }, [isDragging, startX, startWidth, minWidth, maxWidth, direction, onResize])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      className={`
        w-2 bg-border hover:bg-primary/70 cursor-col-resize 
        transition-colors duration-200 relative group flex-shrink-0
        ${isDragging ? 'bg-primary' : ''}
      `}
      onMouseDown={handleMouseDown}
    >
      {/* 可视化拖拽指示器 */}
      <div className="absolute inset-y-0 -left-2 -right-2 group-hover:bg-primary/10 transition-colors duration-200" />
      
      {/* 拖拽时的视觉反馈 */}
      {isDragging && (
        <div className="absolute inset-y-0 left-0 w-full bg-primary shadow-lg" />
      )}
      
      {/* 中央指示线 */}
      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border/50 group-hover:bg-primary/50 transition-colors duration-200 transform -translate-x-1/2" />
    </div>
  )
}

export default ResizableHandle 