import { SerializedFarmConfig } from 'config/constants/types'
import fetchFarm from './fetchFarm'

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  // console.info(`farm>>>..............`, farmsToFetch.length)
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig)
      const serializedFarm = { ...farm, token: farm.token, quoteToken: farm.quoteToken }
      // console.info(`serializedFarm>>>`, serializedFarm)
      return serializedFarm
    }),
  )

  // console.info(`farm>>> data `, data)
  return data
}

export default fetchFarms
