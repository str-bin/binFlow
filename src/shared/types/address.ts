// 支持的区块链网络
export enum ChainType {
  ETHEREUM = 'ethereum',
  BITCOIN = 'bitcoin',
  BINANCE_SMART_CHAIN = 'bsc',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
  AVALANCHE = 'avalanche',
  SOLANA = 'solana',
  TRON = 'tron'
}

// 代币信息
export interface TokenInfo {
  tokenId: string
  symbol: string
  name: string
  contractAddress?: string
  decimals: number
  balance: string
  balanceUSD?: number
  price?: number
  logoUrl?: string
  isNative?: boolean // 是否为原生代币(如ETH、BTC)
}

// 地址标签类型
export enum AddressLabelType {
  EXCHANGE = 'exchange',
  WALLET = 'wallet',
  CONTRACT = 'contract',
  DEFI = 'defi',
  NFT = 'nft',
  BRIDGE = 'bridge',
  MIXER = 'mixer',
  BLACKLIST = 'blacklist',
  UNKNOWN = 'unknown'
}

// 地址详细信息
export interface AddressDetails {
  address: string
  chain: ChainType
  label?: string
  labelType: AddressLabelType
  isContract: boolean
  
  // 代币持有信息
  tokens: TokenInfo[]
  totalValueUSD?: number
  
  // 交易统计
  transactionCount?: number
  firstSeenDate?: string
  lastSeenDate?: string
  
  // 风险评估
  riskScore?: number // 0-100, 100为最高风险
  riskFactors?: string[]
  
  // 标签和备注
  customTags: string[]
  notes?: string
  
  // 额外属性
  ensName?: string // ENS域名(仅Ethereum)
  isMultisig?: boolean
  
  // 数据来源
  dataSource?: 'manual' | 'api' | 'import'
  lastUpdated?: string
}

// 链信息配置
export interface ChainConfig {
  name: string
  symbol: string
  logoUrl?: string
  explorerUrl: string
  rpcUrl?: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

// 预定义的链配置
export const CHAIN_CONFIGS: Record<ChainType, ChainConfig> = {
  [ChainType.ETHEREUM]: {
    name: 'Ethereum',
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [ChainType.BITCOIN]: {
    name: 'Bitcoin',
    symbol: 'BTC',
    explorerUrl: 'https://blockstream.info',
    nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 8 }
  },
  [ChainType.BINANCE_SMART_CHAIN]: {
    name: 'BNB Smart Chain',
    symbol: 'BSC',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
  },
  [ChainType.POLYGON]: {
    name: 'Polygon',
    symbol: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  [ChainType.ARBITRUM]: {
    name: 'Arbitrum One',
    symbol: 'ARB',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [ChainType.OPTIMISM]: {
    name: 'Optimism',
    symbol: 'OP',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [ChainType.AVALANCHE]: {
    name: 'Avalanche',
    symbol: 'AVAX',
    explorerUrl: 'https://snowtrace.io',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 }
  },
  [ChainType.SOLANA]: {
    name: 'Solana',
    symbol: 'SOL',
    explorerUrl: 'https://solscan.io',
    nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 }
  },
  [ChainType.TRON]: {
    name: 'TRON',
    symbol: 'TRX',
    explorerUrl: 'https://tronscan.org',
    nativeCurrency: { name: 'TRX', symbol: 'TRX', decimals: 6 }
  }
} 