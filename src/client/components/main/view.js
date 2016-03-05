import Cycle from '@cycle/core'
//import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul} from '@cycle/dom'
import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul, option, select} from 'cycle-snabbdom'
import Class from 'classnames'
import Rx from 'rx'
const {combineLatest,just} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'

import nodeEditor from '../nodeEditor'

function renderTopToolBar (state) {
  let feedsSelector = section('#feedsSelector',{style: {opacity: '0', transition: 'opacity 0.5s', remove: {opacity: '0'} } })
  if(state.ui.feedsSelectionToggled){
    feedsSelector = renderFeedsSelector(state)
  }

  ////
  let adder = undefined
  if(state.ui.addItemsToggled){
    adder = nodeEditor({props$:just(state)}).DOM//h('div')//renderNodeEditor(state)
  }

  return section('#topToolbar',[
      h('button#addItems','Manage items'),
      h('button#feedsSelect','Select feeds'),

      /*h('span','Start'),
        input('.slider', {attrs:{type: 'range', min: 0, max: 100, value: 25} }),
      h('span','End' ),
        input('.slider', {attrs:{type: 'range', min: 0, max: 100, value: 75}}),
      h('span','RealTime'),
        input('#realTimeStream.slider', {attrs:{type: 'checkbox'}}),*/

      feedsSelector,
      adder
    ])
}

function renderFeedsSelector (state) {
  console.log("state",state)
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

  return h('section#feedsSelector',{style: {transition: 'opacity 0.5s', delayed:{opacity:'1'}} },
    [
      h('header'[
        h('h1','Select feeds'),
        h('input#feedSearch', {type: 'text'})
      ]),
      h('section',[
        h('ul',flatten(allFeeds),'feeds')
      ])
    ])
}




export default function view(state$, graphsGroupVTree$){
  const _nodeEditor = nodeEditor({props$:state$})

  return state$
    .tap(e=>console.log("state",e))
    .map(state=> h('div',[renderTopToolBar(state,_nodeEditor)]))
}
