import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { SerializedFarm } from 'state/types'
import tokens from 'config/constants/tokens'

const getFarmFromTokenSymbol = (
  farms: SerializedFarm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): SerializedFarm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}


const getFarmBaseTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  nativeTokenPriceUSD: BigNumber,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)
  console.info(`getFarmBaseTokenPrice fram:`, farm)

  if (farm.quoteToken.symbol === tokens.usdt.symbol) {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === tokens.trx.symbol) {
    return nativeTokenPriceUSD
  }

  if (farm.quoteToken.symbol === tokens.dpn.symbol) {
    // TODO: change to the swap price 
    return new BigNumber('0.2')
  }

  // return BIG_ONE
  if (farm.quoteToken.symbol === tokens.usdt.symbol) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === tokens.trx.symbol) {
    return hasTokenPriceVsQuote ? nativeTokenPriceUSD.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for USDT/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't USDT or TRX, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - USDT price
  if (quoteTokenFarm.quoteToken.symbol === tokens.trx.symbol) {
    const quoteTokenInBusd = nativeTokenPriceUSD.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === tokens.usdt.symbol) {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed USDT/TRX quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  nativeTokenPriceUSD: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === tokens.usdt.symbol) {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === tokens.trx.symbol) {
    return nativeTokenPriceUSD
  }

  if (farm.quoteToken.symbol === tokens.dpn.symbol) {
    // TODO: change to the swap price 
    return new BigNumber('0.2')
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'TRX') {
    return quoteTokenFarm.tokenPriceVsQuote ? nativeTokenPriceUSD.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'USDT') {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const fetchFarmsPrices = async (farms: SerializedFarm[]) => {
  const bnbBusdFarm = farms.find((farm) => farm.pid === 2)
  const nativeTokenPriceUSD = bnbBusdFarm.tokenPriceVsQuote ? BIG_ONE.div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO

  // console.info(`fetchFarmsPrice nativeTokenPriceUSD>>>> `, nativeTokenPriceUSD)
  
  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const tokenPriceUSD = getFarmBaseTokenPrice(farm, quoteTokenFarm, nativeTokenPriceUSD)
    const quoteTokenPriceUSD = getFarmQuoteTokenPrice(farm, quoteTokenFarm, nativeTokenPriceUSD)

    return {
      ...farm,
      tokenPriceUSD: tokenPriceUSD.toJSON(),
      quoteTokenPriceUSD: quoteTokenPriceUSD.toJSON(),
    }
  })

  // console.info(`==== farmsWithPrices: `, farmsWithPrices)
  return farmsWithPrices
}

export default fetchFarmsPrices
