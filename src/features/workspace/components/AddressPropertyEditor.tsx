import React, { useState } from 'react'
import { D3NodeData } from '@/shared/types'
import { AddressDetails, ChainType, AddressLabelType, TokenInfo, CHAIN_CONFIGS } from '@/shared/types/address'
import { useCanvasStore } from '@/store'
import { formatAddress } from '@/shared/utils/addressUtils'
import { Edit3, Save, X, Plus, Trash2, ExternalLink } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddressPropertyEditorProps {
  node: D3NodeData
}

const AddressPropertyEditor: React.FC<AddressPropertyEditorProps> = ({ node }) => {
  const { updateNode, isPropertyEditing, setPropertyEditing } = useCanvasStore()
  const [editedDetails, setEditedDetails] = useState<AddressDetails>(
    node.addressDetails || {
      address: node.value,
      chain: ChainType.ETHEREUM,
      labelType: AddressLabelType.UNKNOWN,
      isContract: false,
      tokens: [],
      customTags: [],
      dataSource: 'manual'
    }
  )
  const [newToken, setNewToken] = useState<Partial<TokenInfo>>({
    symbol: '',
    name: '',
    balance: '0',
    decimals: 18
  })

  const handleSave = () => {
    const updatedNode = {
      ...node,
      value: editedDetails.label || editedDetails.address,
      attributes: {
        ...node.attributes,
        chain: editedDetails.chain,
        labelType: editedDetails.labelType,
        isContract: editedDetails.isContract,
        totalValueUSD: editedDetails.totalValueUSD
      },
      tags: [...editedDetails.customTags],
      addressDetails: {
        ...editedDetails,
        lastUpdated: new Date().toISOString()
      }
    }
    updateNode(node.id, updatedNode)
    setPropertyEditing(false)
  }

  const addToken = () => {
    if (newToken.symbol && newToken.name) {
      const token: TokenInfo = {
        tokenId: uuidv4(),
        symbol: newToken.symbol,
        name: newToken.name,
        contractAddress: newToken.contractAddress,
        decimals: newToken.decimals || 18,
        balance: newToken.balance || '0',
        balanceUSD: newToken.balanceUSD,
        price: newToken.price,
        isNative: newToken.isNative || false
      }
      
      setEditedDetails(prev => ({
        ...prev,
        tokens: [...prev.tokens, token]
      }))
      
      setNewToken({
        symbol: '',
        name: '',
        balance: '0',
        decimals: 18
      })
    }
  }

  const removeToken = (tokenId: string) => {
    setEditedDetails(prev => ({
      ...prev,
      tokens: prev.tokens.filter(t => t.tokenId !== tokenId)
    }))
  }

  const calculateTotalValue = () => {
    return editedDetails.tokens.reduce((total, token) => {
      return total + (token.balanceUSD || 0)
    }, 0)
  }

  const openInExplorer = () => {
    const config = CHAIN_CONFIGS[editedDetails.chain]
    if (config) {
      const url = `${config.explorerUrl}/address/${editedDetails.address}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">地址数据</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openInExplorer}
            title="在区块浏览器中查看"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPropertyEditing(!isPropertyEditing)}
          >
            {isPropertyEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 基本信息 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">地址</Label>
          {isPropertyEditing ? (
            <Input
              value={editedDetails.address}
              onChange={(e) => setEditedDetails(prev => ({ ...prev, address: e.target.value }))}
              className="text-xs font-mono"
            />
          ) : (
            <div className="p-2 bg-muted rounded text-xs font-mono break-all" title={editedDetails.address}>
              {editedDetails.address}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">区块链</Label>
          {isPropertyEditing ? (
            <Select 
              value={editedDetails.chain} 
              onValueChange={(value) => setEditedDetails(prev => ({ ...prev, chain: value as ChainType }))}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="选择区块链" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHAIN_CONFIGS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 bg-muted rounded text-xs">
              {CHAIN_CONFIGS[editedDetails.chain]?.name || editedDetails.chain}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">标签</Label>
          {isPropertyEditing ? (
            <Input
              value={editedDetails.label || ''}
              onChange={(e) => setEditedDetails(prev => ({ ...prev, label: e.target.value }))}
              className="text-xs"
              placeholder="地址标签"
            />
          ) : (
            <div className="p-2 bg-muted rounded text-xs">
              {editedDetails.label || '无标签'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">类型</Label>
          {isPropertyEditing ? (
            <Select 
              value={editedDetails.labelType} 
              onValueChange={(value) => setEditedDetails(prev => ({ ...prev, labelType: value as AddressLabelType }))}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="选择地址类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AddressLabelType.UNKNOWN}>未知</SelectItem>
                <SelectItem value={AddressLabelType.EXCHANGE}>交易所</SelectItem>
                <SelectItem value={AddressLabelType.WALLET}>钱包</SelectItem>
                <SelectItem value={AddressLabelType.CONTRACT}>合约</SelectItem>
                <SelectItem value={AddressLabelType.DEFI}>DeFi</SelectItem>
                <SelectItem value={AddressLabelType.NFT}>NFT</SelectItem>
                <SelectItem value={AddressLabelType.BRIDGE}>跨链桥</SelectItem>
                <SelectItem value={AddressLabelType.MIXER}>混币器</SelectItem>
                <SelectItem value={AddressLabelType.BLACKLIST}>黑名单</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 bg-muted rounded text-xs">
              {editedDetails.labelType}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">合约状态</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isContract"
              checked={editedDetails.isContract}
              onChange={(e) => setEditedDetails(prev => ({ ...prev, isContract: e.target.checked }))}
              disabled={!isPropertyEditing}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isContract" className="text-xs">
              {editedDetails.isContract ? '是合约地址' : '非合约地址'}
            </Label>
          </div>
        </div>

        {/* 代币列表 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">代币</Label>
            {isPropertyEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addToken}
                disabled={!newToken.symbol || !newToken.name}
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {editedDetails.tokens.length > 0 ? (
            <div className="space-y-2">
              {editedDetails.tokens.map((token) => (
                <div key={token.tokenId} className="p-2 bg-muted rounded text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-muted-foreground">{token.name}</div>
                      <div>余额: {token.balance} {token.symbol}</div>
                      {token.balanceUSD && (
                        <div>价值: ${token.balanceUSD.toFixed(2)}</div>
                      )}
                    </div>
                    {isPropertyEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeToken(token.tokenId)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-xs text-muted-foreground">
                总价值: ${calculateTotalValue().toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
              暂无代币
            </div>
          )}
          
          {isPropertyEditing && (
            <div className="space-y-2 p-2 border border-dashed border-gray-300 rounded">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="代币符号"
                  value={newToken.symbol}
                  onChange={(e) => setNewToken(prev => ({ ...prev, symbol: e.target.value }))}
                  className="text-xs"
                />
                <Input
                  placeholder="代币名称"
                  value={newToken.name}
                  onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="余额"
                  value={newToken.balance}
                  onChange={(e) => setNewToken(prev => ({ ...prev, balance: e.target.value }))}
                  className="text-xs"
                />
                <Input
                  placeholder="合约地址 (可选)"
                  value={newToken.contractAddress || ''}
                  onChange={(e) => setNewToken(prev => ({ ...prev, contractAddress: e.target.value }))}
                  className="text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* 自定义标签 */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">自定义标签</Label>
          <div className="flex flex-wrap gap-1">
            {editedDetails.customTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {isPropertyEditing && (
            <Input
              placeholder="添加标签 (逗号分隔)"
              className="text-xs"
              onBlur={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                setEditedDetails(prev => ({
                  ...prev,
                  customTags: [...prev.customTags, ...tags]
                }))
                e.target.value = ''
              }}
            />
          )}
        </div>

        {/* 保存按钮 */}
        {isPropertyEditing && (
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        )}
      </div>
    </div>
  )
}

export default AddressPropertyEditor 