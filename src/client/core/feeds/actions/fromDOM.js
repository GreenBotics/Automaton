import {toArray} from '../../../utils/utils'

export default function actions(DOM){
  const selectFeeds$ = DOM.select(".feed")
    .events('click')
    .map(function(e){
      const node = parseInt(e.currentTarget.dataset.node)
      const feed = e.currentTarget.dataset.feed
      return {node,feed}
    })
    .map(toArray)

  const searchFeeds$ = DOM.select("#feedSearch")
    .events('input')
    .map(e=>e.target.value)

  const toggleFeedsSelection$ = DOM.select("#feedsSelect")
    .events("click")

  const toggleAddItems$ = DOM.select("#addItems")
    .events("click")

  return {
    selectFeeds$
    ,searchFeeds$
    ,toggleFeedsSelection$
    ,toggleAddItems$
  }
}
