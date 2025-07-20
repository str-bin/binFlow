import { create } from 'zustand'

interface UIStore {
  // JSON面板状态
  jsonPanel: {
    showPretty: boolean
    copiedField: string | null
  }
  
  // 样式面板状态  
  stylePanel: {
    activeTab: string
  }
  
  // 主题状态
  theme: {
    isDark: boolean
  }
  
  // JSON面板操作
  setJsonShowPretty: (showPretty: boolean) => void
  setJsonCopiedField: (field: string | null) => void
  
  // 样式面板操作
  setStyleActiveTab: (tab: string) => void
  
  // 主题操作
  setTheme: (isDark: boolean) => void
  toggleTheme: () => void
  
  // 重置操作
  resetJsonPanel: () => void
  resetStylePanel: () => void
  resetAll: () => void
}

const initialState = {
  jsonPanel: {
    showPretty: true,
    copiedField: null,
  },
  stylePanel: {
    activeTab: 'nodes',
  },
  theme: {
    isDark: false,
  },
}

export const useUIStore = create<UIStore>((set, get) => ({
  ...initialState,
  
  // JSON面板操作
  setJsonShowPretty: (showPretty) => set((state) => ({
    jsonPanel: { ...state.jsonPanel, showPretty }
  })),
  
  setJsonCopiedField: (copiedField) => set((state) => ({
    jsonPanel: { ...state.jsonPanel, copiedField }
  })),
  
  // 样式面板操作
  setStyleActiveTab: (activeTab) => set((state) => ({
    stylePanel: { ...state.stylePanel, activeTab }
  })),
  
  // 主题操作
  setTheme: (isDark) => set((state) => ({
    theme: { ...state.theme, isDark }
  })),
  
  toggleTheme: () => set((state) => ({
    theme: { ...state.theme, isDark: !state.theme.isDark }
  })),
  
  // 重置操作
  resetJsonPanel: () => set((state) => ({
    jsonPanel: initialState.jsonPanel
  })),
  
  resetStylePanel: () => set((state) => ({
    stylePanel: initialState.stylePanel
  })),
  
  resetAll: () => set(initialState),
})) 