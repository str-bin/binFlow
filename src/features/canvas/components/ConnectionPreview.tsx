import React from 'react'
import { EdgeType } from '@/shared/types'
import { D3NodeData } from '@/shared/types'

interface ConnectionPreviewProps {
  sourceNode: D3NodeData | null
  mousePosition: { x: number; y: number } | null
  edgeType: EdgeType | null
  isVisible: boolean
}

const ConnectionPreview: React.FC<ConnectionPreviewProps> = ({
  sourceNode,
  mousePosition,
  edgeType,
  isVisible
}) => {
  if (!isVisible || !sourceNode || !mousePosition || !edgeType) {
    return null
  }

  // 获取连线颜色
  const getEdgeColor = (edgeType: EdgeType): string => {
    switch (edgeType) {
      case EdgeType.TRANSACTION:
        return '#10b981'
      case EdgeType.OWNERSHIP:
        return '#3b82f6'
      case EdgeType.RELATION:
        return '#8b5cf6'
      case EdgeType.FLOW:
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  const color = getEdgeColor(edgeType)
  const sourceX = sourceNode.x || 0
  const sourceY = sourceNode.y || 0

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      <defs>
        <marker
          id="preview-arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={color}
          />
        </marker>
      </defs>
      
      <line
        x1={sourceX}
        y1={sourceY}
        x2={mousePosition.x}
        y2={mousePosition.y}
        stroke={color}
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#preview-arrowhead)"
        opacity="0.8"
      />
    </svg>
  )
}

export default ConnectionPreview 