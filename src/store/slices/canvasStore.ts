import { create } from 'zustand'
import { D3NodeData, D3LinkData, D3CanvasState } from '@/shared/types'

interface CanvasStore extends D3CanvasState {
  // 面板宽度
  rightPanelWidth: number
  setRightPanelWidth: (width: number) => void
  
  // 属性编辑模式
  isPropertyEditing: boolean
  setPropertyEditing: (editing: boolean) => void
  
  // 节点操作
  addNode: (node: D3NodeData) => void
  updateNode: (nodeId: string, updates: Partial<D3NodeData>) => void
  removeNode: (nodeId: string) => void
  removeNodes: (nodeIds: string[]) => void
  
  // 边操作
  addEdge: (edge: D3LinkData) => void
  updateEdge: (edgeId: string, updates: Partial<D3LinkData>) => void
  removeEdge: (edgeId: string) => void
  removeEdges: (edgeIds: string[]) => void
  
  // 视图操作
  updateViewport: (viewport: D3CanvasState['viewport']) => void
  resetViewport: () => void
  
  // 选择操作
  selectNode: (nodeId: string, multi?: boolean) => void
  selectEdge: (edgeId: string, multi?: boolean) => void
  selectNodes: (nodeIds: string[]) => void
  selectEdges: (edgeIds: string[]) => void
  clearSelection: () => void
  
  // 模式操作
  setMode: (mode: D3CanvasState['mode']) => void
  
  // 批量操作
  importData: (data: { nodes: D3NodeData[], edges: D3LinkData[] }) => void
  exportData: () => { nodes: D3NodeData[], edges: D3LinkData[] }
  clearCanvas: () => void
}

const initialState: D3CanvasState = {
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  },
  mode: 'select'
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  ...initialState,
  
  // 面板宽度
  rightPanelWidth: 320, // 默认320px (w-80)
  setRightPanelWidth: (width) => set({ rightPanelWidth: Math.max(240, Math.min(600, width)) }),
  
  // 属性编辑模式
  isPropertyEditing: false,
  setPropertyEditing: (editing) => {
    set({ isPropertyEditing: editing })
  },
  
  // 节点操作
  addNode: (node) => 
    set((state) => ({ 
      nodes: [...state.nodes, node] 
    })),
    
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    })),
    
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter(node => node.id !== nodeId),
      edges: state.edges.filter(edge => 
        (typeof edge.source === 'string' ? edge.source : edge.source.id) !== nodeId && 
        (typeof edge.target === 'string' ? edge.target : edge.target.id) !== nodeId
      ),
      selectedNodes: state.selectedNodes.filter(id => id !== nodeId)
    })),
    
  removeNodes: (nodeIds) =>
    set((state) => ({
      nodes: state.nodes.filter(node => !nodeIds.includes(node.id)),
      edges: state.edges.filter(edge => 
        !nodeIds.includes(typeof edge.source === 'string' ? edge.source : edge.source.id) && 
        !nodeIds.includes(typeof edge.target === 'string' ? edge.target : edge.target.id)
      ),
      selectedNodes: state.selectedNodes.filter(id => !nodeIds.includes(id))
    })),
  
  // 边操作
  addEdge: (edge) =>
    set((state) => ({ 
      edges: [...state.edges, edge] 
    })),
    
  updateEdge: (edgeId, updates) =>
    set((state) => ({
      edges: state.edges.map(edge => 
        edge.id === edgeId ? { ...edge, ...updates } : edge
      )
    })),
    
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter(edge => edge.id !== edgeId),
      selectedEdges: state.selectedEdges.filter(id => id !== edgeId)
    })),
    
  removeEdges: (edgeIds) =>
    set((state) => ({
      edges: state.edges.filter(edge => !edgeIds.includes(edge.id)),
      selectedEdges: state.selectedEdges.filter(id => !edgeIds.includes(id))
    })),
  
  // 视图操作
  updateViewport: (viewport) =>
    set({ viewport }),
    
  resetViewport: () =>
    set({ viewport: initialState.viewport }),
  
  // 选择操作
  selectNode: (nodeId, multi = false) =>
    set((state) => ({
      selectedNodes: multi 
        ? state.selectedNodes.includes(nodeId)
          ? state.selectedNodes.filter(id => id !== nodeId)
          : [...state.selectedNodes, nodeId]
        : [nodeId],
      selectedEdges: multi ? state.selectedEdges : []
    })),
    
  selectEdge: (edgeId, multi = false) =>
    set((state) => ({
      selectedEdges: multi
        ? state.selectedEdges.includes(edgeId)
          ? state.selectedEdges.filter(id => id !== edgeId)
          : [...state.selectedEdges, edgeId]
        : [edgeId],
      selectedNodes: multi ? state.selectedNodes : []
    })),
    
  selectNodes: (nodeIds) =>
    set({ selectedNodes: nodeIds, selectedEdges: [] }),
    
  selectEdges: (edgeIds) =>
    set({ selectedEdges: edgeIds, selectedNodes: [] }),
    
  clearSelection: () =>
    set({ selectedNodes: [], selectedEdges: [] }),
  
  // 模式操作
  setMode: (mode) =>
    set({ mode }),
  
  // 批量操作
  importData: (data) =>
    set({ 
      nodes: data.nodes, 
      edges: data.edges,
      selectedNodes: [],
      selectedEdges: []
    }),
    
  exportData: () => {
    const state = get()
    return {
      nodes: state.nodes,
      edges: state.edges
    }
  },
  
  clearCanvas: () =>
    set(initialState)
})) 