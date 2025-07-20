// tRPC API路由类型定义

export interface GreetingResponse {
  message: string;
}

export interface AdapterInfo {
  name: string;
  version: string;
  networks: string[];
  status: 'active' | 'inactive';
}

export interface TransactionStatus {
  hash: string;
  status: 'success' | 'failed' | 'pending';
  blockNumber?: number;
  gasUsed?: string;
  timestamp?: number;
}

export interface AccountBalance {
  address: string;
  balance: string;
  network: string;
  currency: string;
  usdValue?: number;
}

export interface TransactionInfo {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'failed';
}

export interface NormalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export interface ERC20Transfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  contractAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface ERC721Transfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

export interface HistoricalBalance {
  account: string;
  balance: string;
  timestamp: number;
  blockNumber: number;
}

export interface BeaconWithdrawal {
  withdrawalIndex: string;
  validatorIndex: string;
  address: string;
  amount: string;
  blockNumber: string;
  timestamp: string;
}

// API请求参数类型
export interface GetAccountBalanceParams {
  address: string;
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
}

export interface GetTransactionsParams {
  provider: 'etherscan' | 'polygonscan' | 'bscscan' | 'arbiscan';
  address: string;
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
  page?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  startBlock?: number;
  endBlock?: number;
}

export interface GetMultipleBalancesParams {
  provider: 'etherscan' | 'polygonscan' | 'bscscan' | 'arbiscan';
  addresses: string[];
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
}

export interface CheckTransactionStatusParams {
  hash: string;
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
}

export interface GetHistoricalBalanceParams {
  provider: 'etherscan';
  address: string;
  network: 'ethereum';
  blockNumber?: number;
}

// tRPC路由类型定义 - 这是一个占位符类型
// 在实际使用中，你应该从后端导入真实的路由器类型
export type AppRouter = any; 