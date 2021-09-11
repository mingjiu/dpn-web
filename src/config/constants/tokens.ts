import { ChainId, Token } from '@pancakeswap/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { SerializedToken } from './types'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export const mainnetTokens = {
  wbnb: new Token(
    MAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.com/',
  ),
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new Token(MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'BNB', 'BNB', 'https://www.binance.com/'),
  cake: new Token(
    MAINNET,
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    18,
    'CAKE',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
  usdt: new Token(
    MAINNET,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'USDT',
    'Tether USD',
    'https://tether.to/',
  ),
  evb: new Token(
    MAINNET,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'EVB',
    'EV Blockchain',
    'https://tether.to/',
  ),
  dpn: new Token(
    MAINNET,
    '0xdc8C4625A42e6bB7baf6a2eB7E8E4Cf462deED53',
    18,
    'DPN',
    'DPN Token',
    'https://daphne.finance/',
  ),
}

export const testnetTokens = {
  wbnb: new Token(
    TESTNET,
    '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    18,
    'TRX',
    'TRON',
    'https://www.binance.com/',
  ),
  cake: new Token(
    TESTNET,
    '0xdc8C4625A42e6bB7baf6a2eB7E8E4Cf462deED53',
    18,
    'DPN',
    'Daphne Token',
    'https://pancakeswap.finance/',
  ),
  busd: new Token(
    TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
    'https://www.paxos.com/busd/',
  ),
  syrup: new Token(
    TESTNET,
    '0xdc8C4625A42e6bB7baf6a2eB7E8E4Cf462deED53',
    18,
    'DPN',
    'DPN Token',
    'https://daphne.finance/',
  ),
  dpn: new Token(
    TESTNET,
    '0xdc8C4625A42e6bB7baf6a2eB7E8E4Cf462deED53',
    18,
    'DPN',
    'DPN Token',
    'https://daphne.finance/',
  ),
  evb: new Token(
    TESTNET,
    '0xe3A3079ec45CF594131f0401A999e2cB027D032d',
    18,
    'EVB',
    'EV Blockchain',
    'https://www.binance.com/',
  ),
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {})
  }

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()
