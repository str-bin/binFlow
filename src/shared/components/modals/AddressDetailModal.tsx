import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, ExternalLink, Shield } from 'lucide-react'
import { ChainType, AddressLabelType, AddressDetails, TokenInfo, CHAIN_CONFIGS } from '@/shared/types/address'
import { formatAddress } from '@/shared/utils/addressUtils'
import { v4 as uuidv4 } from 'uuid'

interface AddressDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (details: AddressDetails) => void
  initialDetails?: Partial<AddressDetails>
  address?: string
}

const AddressDetailModal: React.FC<AddressDetailModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDetails,
  address: initialAddress
}) => {
  const [details, setDetails] = useState<AddressDetails>({
    address: initialAddress || '',
    chain: ChainType.ETHEREUM,
    labelType: AddressLabelType.UNKNOWN,
    isContract: false,
    tokens: [],
    customTags: [],
    dataSource: 'manual',
    ...initialDetails
  })

  const [newToken, setNewToken] = useState<Partial<TokenInfo>>({
    symbol: '',
    name: '',
    balance: '0',
    decimals: 18
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (isOpen && initialDetails) {
      setDetails(prev => ({ ...prev, ...initialDetails }))
    }
  }, [isOpen, initialDetails])

  const handleSave = () => {
    const finalDetails: AddressDetails = {
      ...details,
      lastUpdated: new Date().toISOString()
    }
    onSave(finalDetails)
    onClose()
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
      
      setDetails(prev => ({
        ...prev,
        tokens: [...prev.tokens, token]
      }))
      
      // 重置表单
      setNewToken({
        symbol: '',
        name: '',
        balance: '0',
        decimals: 18
      })
    }
  }

  const removeToken = (tokenId: string) => {
    setDetails(prev => ({
      ...prev,
      tokens: prev.tokens.filter(t => t.tokenId !== tokenId)
    }))
  }

  const addTag = () => {
    if (newTag && !details.customTags.includes(newTag)) {
      setDetails(prev => ({
        ...prev,
        customTags: [...prev.customTags, newTag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setDetails(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag)
    }))
  }

  const calculateTotalValue = () => {
    return details.tokens.reduce((total, token) => {
      return total + (token.balanceUSD || 0)
    }, 0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">地址详情</h2>
            <p className="text-sm text-muted-foreground mt-1">
              编辑地址节点的详细信息
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">基本信息</h3>
              
              <div>
                <label className="text-sm font-medium">地址</label>
                <input
                  type="text"
                  value={details.address}
                  onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full mt-1 p-2 border border-border rounded-md font-mono text-sm"
                  placeholder="输入区块链地址"
                />
              </div>

              <div>
                <label className="text-sm font-medium">区块链网络</label>
                <select
                  value={details.chain}
                  onChange={(e) => setDetails(prev => ({ ...prev, chain: e.target.value as ChainType }))}
                  className="w-full mt-1 p-2 border border-border rounded-md"
                >
                  {Object.entries(CHAIN_CONFIGS).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.name} ({config.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">标签</label>
                <input
                  type="text"
                  value={details.label || ''}
                  onChange={(e) => setDetails(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full mt-1 p-2 border border-border rounded-md"
                  placeholder="地址标签名称"
                />
              </div>

              <div>
                <label className="text-sm font-medium">标签类型</label>
                <select
                  value={details.labelType}
                  onChange={(e) => setDetails(prev => ({ ...prev, labelType: e.target.value as AddressLabelType }))}
                  className="w-full mt-1 p-2 border border-border rounded-md"
                >
                  <option value={AddressLabelType.EXCHANGE}>交易所</option>
                  <option value={AddressLabelType.WALLET}>钱包</option>
                  <option value={AddressLabelType.CONTRACT}>合约</option>
                  <option value={AddressLabelType.DEFI}>DeFi协议</option>
                  <option value={AddressLabelType.NFT}>NFT相关</option>
                  <option value={AddressLabelType.BRIDGE}>跨链桥</option>
                  <option value={AddressLabelType.MIXER}>混币器</option>
                  <option value={AddressLabelType.BLACKLIST}>黑名单</option>
                  <option value={AddressLabelType.UNKNOWN}>未知</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={details.isContract}
                  onChange={(e) => setDetails(prev => ({ ...prev, isContract: e.target.checked }))}
                  className="rounded"
                />
                <label className="text-sm font-medium">智能合约地址</label>
              </div>

              {details.chain === ChainType.ETHEREUM && (
                <div>
                  <label className="text-sm font-medium">ENS域名</label>
                  <input
                    type="text"
                    value={details.ensName || ''}
                    onChange={(e) => setDetails(prev => ({ ...prev, ensName: e.target.value }))}
                    className="w-full mt-1 p-2 border border-border rounded-md"
                    placeholder="example.eth"
                  />
                </div>
              )}
            </div>

            {/* 代币信息 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">代币持有</h3>
                <div className="text-sm text-muted-foreground">
                  总价值: ${calculateTotalValue().toFixed(2)}
                </div>
              </div>

              {/* 代币列表 */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {details.tokens.map((token) => (
                  <div key={token.tokenId} className="flex items-center justify-between p-3 border border-border rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">{token.name}</div>
                      <div className="text-sm">余额: {token.balance}</div>
                      {token.balanceUSD && (
                        <div className="text-sm text-green-600">${token.balanceUSD.toFixed(2)}</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeToken(token.tokenId)}
                      className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 添加代币 */}
              <div className="border border-border rounded-md p-3 space-y-3">
                <h4 className="font-medium">添加代币</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="代币符号"
                    value={newToken.symbol}
                    onChange={(e) => setNewToken(prev => ({ ...prev, symbol: e.target.value }))}
                    className="p-2 border border-border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="代币名称"
                    value={newToken.name}
                    onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
                    className="p-2 border border-border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="余额"
                    value={newToken.balance}
                    onChange={(e) => setNewToken(prev => ({ ...prev, balance: e.target.value }))}
                    className="p-2 border border-border rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="USD价值"
                    value={newToken.balanceUSD || ''}
                    onChange={(e) => setNewToken(prev => ({ ...prev, balanceUSD: parseFloat(e.target.value) || undefined }))}
                    className="p-2 border border-border rounded text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="合约地址(可选)"
                  value={newToken.contractAddress || ''}
                  onChange={(e) => setNewToken(prev => ({ ...prev, contractAddress: e.target.value }))}
                  className="w-full p-2 border border-border rounded text-sm font-mono"
                />
                <button
                  onClick={addToken}
                  className="w-full p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>添加代币</span>
                </button>
              </div>
            </div>
          </div>

          {/* 自定义标签 */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">自定义标签</h3>
            <div className="flex flex-wrap gap-2">
              {details.customTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="添加标签"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 p-2 border border-border rounded"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <button
                onClick={addTag}
                className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 备注 */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">备注</h3>
            <textarea
              value={details.notes || ''}
              onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-3 border border-border rounded-md h-24 resize-none"
              placeholder="添加备注信息..."
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>数据来源: {details.dataSource === 'manual' ? '手动输入' : 'API获取'}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressDetailModal 