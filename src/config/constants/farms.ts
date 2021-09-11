import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 2) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'DPN',
    lpAddresses: {
      97: '0xdc8C4625A42e6bB7baf6a2eB7E8E4Cf462deED53',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: serializedTokens.dpn,
    quoteToken: serializedTokens.dpn,
  },
  {
    pid: 1,
    lpSymbol: 'EVB',
    lpAddresses: {
      97: '0xe3A3079ec45CF594131f0401A999e2cB027D032d',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: serializedTokens.evb,
    quoteToken: serializedTokens.dpn,
  },
  {
    pid: 2,
    lpSymbol: 'TRX',
    lpAddresses: {
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.dpn,
  }
]

export default farms
