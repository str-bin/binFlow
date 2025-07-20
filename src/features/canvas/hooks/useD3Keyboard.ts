import { useEffect } from 'react'
import * as d3 from 'd3'

export const useD3Keyboard = (
  svgRef: React.RefObject<SVGSVGElement>,
  zoomBehaviorRef: React.MutableRefObject<d3.ZoomBehavior<SVGSVGElement, unknown> | null>
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        const svg = d3.select(svgRef.current)
        if (!svg.node() || !zoomBehaviorRef.current) return
        
        switch (event.key) {
          case '=':
          case '+':
            event.preventDefault()
            svg.transition().call(zoomBehaviorRef.current.scaleBy as any, 1.2)
            break
          case '-':
            event.preventDefault()
            svg.transition().call(zoomBehaviorRef.current.scaleBy as any, 0.8)
            break
          case '0':
            event.preventDefault()
            svg.transition().call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [svgRef, zoomBehaviorRef])
} 