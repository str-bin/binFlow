/**
 * 格式化地址显示
 * @param address 完整地址
 * @param startChars 开头显示字符数，默认8
 * @param endChars 结尾显示字符数，默认8
 * @returns 格式化后的地址
 */
export const formatAddress = (address: string, startChars: number = 8, endChars: number = 8): string => {
  if (!address) return ''
  
  // 如果地址长度小于等于显示字符数，直接返回
  if (address.length <= startChars + endChars + 3) {
    return address
  }
  
  const start = address.substring(0, startChars)
  const end = address.substring(address.length - endChars)
  
  return `${start}...${end}`
}

/**
 * 检查是否为有效的地址格式
 * @param address 地址字符串
 * @returns 是否为有效地址
 */
export const isValidAddress = (address: string): boolean => {
  if (!address) return false
  
  // 简单的地址格式检查
  // Ethereum地址: 0x + 40位十六进制
  if (address.startsWith('0x') && address.length === 42) {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }
  
  // Bitcoin地址: 通常以1、3、bc1开头
  if (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) {
    return address.length >= 26 && address.length <= 62
  }
  
  // Solana地址: Base58编码，通常44个字符
  if (address.length >= 32 && address.length <= 44) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  }
  
  // TRON地址: 以T开头，34个字符
  if (address.startsWith('T') && address.length === 34) {
    return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)
  }
  
  return true // 其他格式暂时都认为有效
}

/**
 * 根据地址格式猜测可能的区块链类型
 * @param address 地址字符串
 * @returns 可能的区块链类型数组
 */
export const guessChainFromAddress = (address: string): string[] => {
  const possibleChains: string[] = []
  
  if (address.startsWith('0x') && address.length === 42) {
    possibleChains.push('ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'avalanche')
  }
  
  if (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) {
    possibleChains.push('bitcoin')
  }
  
  if (address.startsWith('T') && address.length === 34) {
    possibleChains.push('tron')
  }
  
  if (address.length >= 32 && address.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) {
    possibleChains.push('solana')
  }
  
  return possibleChains
} 