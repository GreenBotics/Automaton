import {h} from 'cycle-snabbdom'
import Rx from 'rx'
const {combineLatest} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'
import Class from 'classnames'

function view(state$){
  return state$.map(view_inner)
}

function view_inner (state) {
  const allFeeds = state.nodes.data.map(function(node){
    return node.sensors.map(function(feed){
      //const attributes = attributes={{"data-name": row.name, "data-id":row.id}} key={row.id}
      const key = `${node._id}${feed.id}`

      const selected = state.feeds.selections.reduce(function(acc,cur){
        return acc || (cur.node === node._id && cur.feed === feed.id)
      },false) // Is this node & feed combo selected

      let className = Class(".feed",{ ".selected": selected })
      const entry = h('li'+className,{attrs:{"data-node": node._id, "data-feed":feed.id}},[
          h('div',feed.type),
          h('div',`Node_${node._id}`)
        ])
      return entry
    })
  })

  if(state.ui.feedsSelectionToggled){
    return h('section#feedsSelector',{style: {transition: 'opacity 0.5s', delayed:{opacity:'1'}} },
      [
        h('header',[
          h('h1','Select feeds'),
          h('input#feedSearch', {type: 'text'})
        ]),
        h('section',[
          h('ul',flatten(allFeeds))
        ])
      ])
    }
    else{
      return h('section#feedsSelector',{style: {opacity: '0', transition: 'opacity 0.5s', remove: {opacity: '0'} } })
    }
}

export default function feedsSelector(sources) {
  const props$ = sources.props$

  //const actions = intent(sources.DOM)
  const state$ = props$//model(actions)
  const vtree$ = view(state$)
  return {
    DOM: vtree$
    //remove: actions.remove$,
  }
}
