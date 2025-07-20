import { useState, useCallback } from 'react'
import * as d3 from 'd3'

export interface D3LayoutSettings {
  forceStrength: number
  linkDistance: number
  collisionRadius: number
  centerStrength: number
  chargeStrength: number
}

export const useD3Layout = () => {
  const [settings, setSettings] = useState<D3LayoutSettings>({
    forceStrength: 1,
    linkDistance: 100,
    collisionRadius: 30,
    centerStrength: 0.1,
    chargeStrength: -300
  })

  const updateSetting = useCallback(<K extends keyof D3LayoutSettings>(
    key: K,
    value: D3LayoutSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const createSimulation = useCallback(<T extends d3.SimulationNodeDatum>(
    nodes: T[],
    links: any[],
    width: number = 800,
    height: number = 600
  ) => {
    return d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(settings.linkDistance)
      )
      .force('charge', d3.forceManyBody().strength(settings.chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(settings.centerStrength))
      .force('collision', d3.forceCollide().radius(settings.collisionRadius))
  }, [settings])

  const resetToDefaults = useCallback(() => {
    setSettings({
      forceStrength: 1,
      linkDistance: 100,
      collisionRadius: 30,
      centerStrength: 0.1,
      chargeStrength: -300
    })
  }, [])

  return {
    settings,
    updateSetting,
    createSimulation,
    resetToDefaults
  }
} 