// import { toArray } from '../../../utils/utils'

export default function actions (socketIO) {
  const setNodes$ =
  socketIO.get('initialData')
    .map(e => JSON.parse(e))
    .map(data => ({data}))
    .tap(e => console.log('initialData', e))

  return {
    setNodes$
  }
}
