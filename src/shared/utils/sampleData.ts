import { D3NodeData, D3LinkData, NodeType, EdgeType } from '@/shared/types'
import { ChainType, AddressLabelType } from '@/shared/types/address'
import { formatAddress } from '@/shared/utils/addressUtils'
import { getNodeIconSVG } from '@/shared/utils'
import { v4 as uuidv4 } from 'uuid'

// 创建样本节点数据
export const createSampleNodes = (): D3NodeData[] => {
  return [
    {
      id: uuidv4(),
      nodeType: NodeType.ADDRESS,
      value: 'Binance Hot Wallet',
      attributes: {
        balance: '12.5 ETH',
        transactionCount: 245,
        chain: ChainType.ETHEREUM,
        labelType: AddressLabelType.EXCHANGE,
        isContract: false,
        totalValueUSD: 25430.50
      },
      tags: ['热钱包', '交易所', 'Binance'],
      metadata: {
        createdAt: new Date().toISOString(),
        source: '区块浏览器'
      },
      addressDetails: {
        address: '0x742d35Cc6637C0532c2baBcDeFaBcDeF01234567',
        chain: ChainType.ETHEREUM,
        label: 'Binance Hot Wallet',
        labelType: AddressLabelType.EXCHANGE,
        isContract: false,
        tokens: [
          {
            tokenId: uuidv4(),
            symbol: 'ETH',
            name: 'Ethereum',
            decimals: 18,
            balance: '12.5',
            balanceUSD: 25430.50,
            price: 2034.44,
            isNative: true
          },
          {
            tokenId: uuidv4(),
            symbol: 'USDT',
            name: 'Tether USD',
            contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            decimals: 6,
            balance: '50000',
            balanceUSD: 50000,
            price: 1.00
          }
        ],
        totalValueUSD: 75430.50,
        transactionCount: 245,
        customTags: ['热钱包', '交易所', 'Binance'],
        notes: '币安交易所热钱包地址，用于用户提币',
        dataSource: 'manual',
        lastUpdated: new Date().toISOString()
      },
      visual: {
        color: '#3b82f6',
        size: 50,
        opacity: 1,
        strokeColor: '#e5e7eb',
        strokeWidth: 2,
        icon: getNodeIconSVG(NodeType.ADDRESS),
        label: 'Binance Hot Wallet'
      },
      selected: false,
      hovered: false,
      fixed: false,
      x: 300,
      y: 200
    },
    {
      id: uuidv4(),
      nodeType: NodeType.ADDRESS,
      value: '个人冷钱包',
      attributes: {
        balance: '8.2 ETH',
        transactionCount: 156,
        chain: ChainType.ETHEREUM,
        labelType: AddressLabelType.WALLET,
        isContract: false,
        totalValueUSD: 16682.08
      },
      tags: ['冷钱包', '个人持有'],
      metadata: {
        createdAt: new Date().toISOString(),
        source: '区块浏览器'
      },
      addressDetails: {
        address: '0x8ba1f109551bD432803EfGh98765432109876543',
        chain: ChainType.ETHEREUM,
        label: '个人冷钱包',
        labelType: AddressLabelType.WALLET,
        isContract: false,
        tokens: [
          {
            tokenId: uuidv4(),
            symbol: 'ETH',
            name: 'Ethereum',
            decimals: 18,
            balance: '8.2',
            balanceUSD: 16682.08,
            price: 2034.44,
            isNative: true
          }
        ],
        totalValueUSD: 16682.08,
        transactionCount: 156,
        customTags: ['冷钱包', '个人持有'],
        notes: '长期持有的以太坊冷钱包',
        dataSource: 'manual',
        lastUpdated: new Date().toISOString()
      },
      visual: {
        color: '#3b82f6',
        size: 45,
        opacity: 1,
        strokeColor: '#e5e7eb',
        strokeWidth: 2,
        icon: getNodeIconSVG(NodeType.ADDRESS),
        label: '个人冷钱包'
      },
      selected: false,
      hovered: false,
      fixed: false,
      x: 500,
      y: 300
    },
    {
      id: uuidv4(),
      nodeType: NodeType.ENTITY,
      value: 'Binance Exchange',
      attributes: {
        type: '交易所',
        volume: '50M USD/day'
      },
      tags: ['CEX', '大型交易所'],
      metadata: {
        createdAt: new Date().toISOString(),
        source: '手动添加'
      },
      visual: {
        color: '#8b5cf6',
        size: 60,
        opacity: 1,
        strokeColor: '#e5e7eb',
        strokeWidth: 2,
        icon: getNodeIconSVG(NodeType.ENTITY),
        label: 'Binance Exchange'
      },
      selected: false,
      hovered: false,
      fixed: false,
      x: 150,
      y: 150
    },

    {
      id: uuidv4(),
      nodeType: NodeType.PROJECT,
      value: 'Uniswap V3',
      attributes: {
        type: 'DEX',
        tvl: '2.5B USD'
      },
      tags: ['DeFi', 'AMM'],
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'DeFi Pulse'
      },
      visual: {
        color: '#f59e0b',
        size: 55,
        opacity: 1,
        strokeColor: '#e5e7eb',
        strokeWidth: 2,
        icon: getNodeIconSVG(NodeType.PROJECT),
        label: 'Uniswap V3'
      },
      selected: false,
      hovered: false,
      fixed: false,
      x: 600,
      y: 180
    }
  ]
}

// 创建样本边数据
export const createSampleEdges = (nodes: D3NodeData[]): D3LinkData[] => {
  if (nodes.length < 2) return []
  
  return [
    {
      id: uuidv4(),
      source: nodes[0].id,
      target: nodes[1].id,
      edgeType: EdgeType.TRANSACTION,
      value: '5.0 ETH',
      timestamp: new Date().toISOString(),
      direction: 'outgoing',
      attributes: {
        txHash: '0xabc123...def456',
        blockNumber: 18500000
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: '区块浏览器'
      },
      visual: {
        color: '#10b981',
        width: 2,
        opacity: 1,
        arrowSize: 6
      },
      selected: false,
      hovered: false
    },
    {
      id: uuidv4(),
      source: nodes[2].id,
      target: nodes[0].id,
      edgeType: EdgeType.OWNERSHIP,
      value: '归属关系',
      direction: 'outgoing',
      attributes: {
        confidence: 0.85
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: '链上分析'
      },
      visual: {
        color: '#3b82f6',
        width: 3,
        opacity: 1,
        arrowSize: 6
      },
      selected: false,
      hovered: false
    },
    {
      id: uuidv4(),
      source: nodes[1].id,
      target: nodes[3].id,
      edgeType: EdgeType.FLOW,
      value: '流动性提供',
      direction: 'bidirectional',
      attributes: {
        flowAmount: '2.5 ETH'
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'DeFi 协议'
      },
      visual: {
        color: '#f59e0b',
        width: 2,
        opacity: 1,
        arrowSize: 6
      },
      selected: false,
      hovered: false
    }
  ]
}

// 完整的样本数据
export const getSampleData = () => {
  const nodes = createSampleNodes()
  const edges = createSampleEdges(nodes)
  return { nodes, edges }
} 