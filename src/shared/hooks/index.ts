// 共享Hooks入口文件

export { useD3Layout } from './useD3Layout'

// 通用hooks可以在这里导出
// export { default as useLocalStorage } from './useLocalStorage'
// export { default as useDebounce } from './useDebounce'
// export { default as useKeyboard } from './useKeyboard'

// 暂时导出一个空对象，避免构建错误
export const sharedHooks = {} 