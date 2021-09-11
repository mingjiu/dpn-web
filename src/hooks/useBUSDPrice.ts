import { ChainId, Currency, currencyEquals, JSBI, Price } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import tokens, { mainnetTokens } from 'config/constants/tokens'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const BUSD_MAINNET = mainnetTokens.usdt
const { trx: TRX } = tokens

/**
 * Returns the price in USDT of the input currency
 * @param currency currency to compute the USDT price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && currencyEquals(TRX, wrapped) ? undefined : currency, chainId ? TRX : undefined],
      [wrapped?.equals(BUSD_MAINNET) ? undefined : wrapped, chainId === ChainId.MAINNET ? BUSD_MAINNET : undefined],
      [chainId ? TRX : undefined, chainId === ChainId.MAINNET ? BUSD_MAINNET : undefined],
    ],
    [chainId, currency, wrapped],
  )
  const [[ethPairState, ethPair], [busdPairState, busdPair], [busdEthPairState, busdEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(TRX)) {
      if (busdPair) {
        const price = busdPair.priceOf(TRX)
        return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(BUSD_MAINNET)) {
      return new Price(BUSD_MAINNET, BUSD_MAINNET, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(TRX)
    const ethPairETHBUSDValue: JSBI =
      ethPairETHAmount && busdEthPair ? busdEthPair.priceOf(TRX).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (
      busdPairState === PairState.EXISTS &&
      busdPair &&
      busdPair.reserveOf(BUSD_MAINNET).greaterThan(ethPairETHBUSDValue)
    ) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, BUSD_MAINNET, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && busdEthPairState === PairState.EXISTS && busdEthPair) {
      if (busdEthPair.reserveOf(BUSD_MAINNET).greaterThan('0') && ethPair.reserveOf(TRX).greaterThan('0')) {
        const ethBusdPrice = busdEthPair.priceOf(BUSD_MAINNET)
        const currencyEthPrice = ethPair.priceOf(TRX)
        const busdPrice = ethBusdPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, BUSD_MAINNET, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, ethPair, ethPairState, busdEthPair, busdEthPairState, busdPair, busdPairState, wrapped])
}

export const useCakeBusdPrice = (): Price | undefined => {
  const cakeBusdPrice = useBUSDPrice(tokens.cake)
  return cakeBusdPrice
}

export const useBNBBusdPrice = (): Price | undefined => {
  const bnbBusdPrice = useBUSDPrice(tokens.trx)
  return bnbBusdPrice
}
