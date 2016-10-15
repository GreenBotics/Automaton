import {toArray} from '../../../utils/utils'

export default function actions(socketIO){
  const setFeedsData$ = socketIO.get("getFeedsData")
    .map(e=>JSON.parse(e))

  return {
    setFeedsData$
  }
}
