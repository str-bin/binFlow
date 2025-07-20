import React from 'react'
import { useD3Layout, D3LayoutSettings } from '@/shared/hooks/useD3Layout'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, Settings, Play, Pause } from 'lucide-react'

interface D3LayoutPanelProps {
  settings: D3LayoutSettings
  onSettingChange: <K extends keyof D3LayoutSettings>(key: K, value: D3LayoutSettings[K]) => void
  onRestart: () => void
  onPause: () => void
  onPlay: () => void
  isPlaying: boolean
}

const D3LayoutPanel: React.FC<D3LayoutPanelProps> = ({
  settings,
  onSettingChange,
  onRestart,
  onPause,
  onPlay,
  isPlaying
}) => {
  return (
    <Card className="w-80 p-4 space-y-4 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">布局控制</span>
        </div>
        <div className="flex gap-1">
          {isPlaying ? (
            <Button size="sm" variant="outline" onClick={onPause}>
              <Pause className="w-3 h-3" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onPlay}>
              <Play className="w-3 h-3" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onRestart}>
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* 力的强度 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">排斥力强度</Label>
          <span className="text-xs text-muted-foreground">
            {Math.abs(settings.chargeStrength)}
          </span>
        </div>
        <Slider
          value={[Math.abs(settings.chargeStrength)]}
          onValueChange={([value]) => onSettingChange('chargeStrength', -value)}
          min={50}
          max={1000}
          step={50}
          className="w-full"
        />
      </div>

      {/* 连线距离 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">连线距离</Label>
          <span className="text-xs text-muted-foreground">
            {settings.linkDistance}
          </span>
        </div>
        <Slider
          value={[settings.linkDistance]}
          onValueChange={([value]) => onSettingChange('linkDistance', value)}
          min={30}
          max={300}
          step={10}
          className="w-full"
        />
      </div>

      {/* 碰撞半径 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">碰撞半径</Label>
          <span className="text-xs text-muted-foreground">
            {settings.collisionRadius}
          </span>
        </div>
        <Slider
          value={[settings.collisionRadius]}
          onValueChange={([value]) => onSettingChange('collisionRadius', value)}
          min={10}
          max={80}
          step={5}
          className="w-full"
        />
      </div>

      {/* 中心力强度 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">中心拉力</Label>
          <span className="text-xs text-muted-foreground">
            {settings.centerStrength.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[settings.centerStrength * 100]}
          onValueChange={([value]) => onSettingChange('centerStrength', value / 100)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      <Separator />

      {/* 预设布局 */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">预设布局</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {
              onSettingChange('chargeStrength', -300)
              onSettingChange('linkDistance', 100)
              onSettingChange('collisionRadius', 30)
              onSettingChange('centerStrength', 0.1)
            }}
          >
            默认
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {
              onSettingChange('chargeStrength', -800)
              onSettingChange('linkDistance', 150)
              onSettingChange('collisionRadius', 40)
              onSettingChange('centerStrength', 0.3)
            }}
          >
            分散
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {
              onSettingChange('chargeStrength', -100)
              onSettingChange('linkDistance', 50)
              onSettingChange('collisionRadius', 20)
              onSettingChange('centerStrength', 0.8)
            }}
          >
            紧密
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {
              onSettingChange('chargeStrength', -500)
              onSettingChange('linkDistance', 200)
              onSettingChange('collisionRadius', 50)
              onSettingChange('centerStrength', 0.05)
            }}
          >
            松散
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default D3LayoutPanel 