import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, REWARD_PER_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  // console.info(`pool stakingTokenPrice: `, stakingTokenPrice)
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  // return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
  // console.info(`farm weight: `, poolWeight.toJSON())
  // console.info(`cakePriceUsd: `, cakePriceUsd.toJSON())
  // console.info(`poolLiquidityUsd: `, poolLiquidityUsd.toJSON())
  // return { cakeRewardsApr: 1190, lpRewardsApr:0 }

  let _cakePriceUsd = cakePriceUsd
  if (!cakePriceUsd || cakePriceUsd.isNaN()) {
    _cakePriceUsd = new BigNumber(1)
  }

  let _poolLiquidityUsd = poolLiquidityUsd
  if (!poolLiquidityUsd || poolLiquidityUsd.isNaN() || poolLiquidityUsd.isZero()) {
    _poolLiquidityUsd = new BigNumber('1000000')
  }

  const yearlyCakeRewardAllocation = REWARD_PER_YEAR.times(poolWeight)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(_cakePriceUsd).div(_poolLiquidityUsd).times(100)
  let cakeRewardsAprAsNumber = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

// export const getFarmApr = (
//   poolWeight: BigNumber,
//   cakePriceUsd: BigNumber,
//   poolLiquidityUsd: BigNumber,
//   farmAddress: string,
// ): { cakeRewardsApr: number; lpRewardsApr: number } => {
//   // return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
//   console.info(`farm weight: `, poolWeight)
//   console.info(`cakePriceUsd: `, cakePriceUsd)
//   console.info(`poolLiquidityUsd: `, poolLiquidityUsd)

//   const yearlyCakeRewardAllocation = REWARD_PER_YEAR.times(poolWeight)
//   const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
//   let cakeRewardsAprAsNumber = null
//   if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
//     cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
//   }
//   const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
//   return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
// }

export default null
