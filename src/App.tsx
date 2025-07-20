import Workspace from '@/features/workspace'
import Canvas from '@/features/canvas'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="binflow-ui-theme">
      <Workspace>
        <Canvas />
      </Workspace>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-background border border-border text-foreground',
          duration: 3000,
        }}
      />
    </ThemeProvider>
  )
}

export default App 