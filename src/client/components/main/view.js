import Cycle from '@cycle/core'
//import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul} from '@cycle/dom'
import {h as h} from 'cycle-snabbdom'
import Class from 'classnames'
import Rx from 'rx'
const {combineLatest,just} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'

import feedsSelector from '../feedsSelector'

import styles from './styles.css'
//import hyperstyles from 'hyperstyles'
//const h = hyperstyles(vh, styles)
//console.log("styles",styles)

function renderTopToolBar (data) {
  const {state,nodeEditor} = data
  let _feedsSelector = feedsSelector({props$:just(state)}).DOM
  //let _nodeEditor    = nodeEditor({props$:just(state)}).DOM

  return h('section#'+styles.topToolbar,[
      h('button#addItems','Manage nodes'),
      h('button#feedsSelect','Select feeds'),

      _feedsSelector,
      nodeEditor
    ])
}

export default function view(state$, nodeEditorVtree$, graphsGroupVTree$){

  return state$
    .tap(e=>console.log("state",e))
    .combineLatest(nodeEditorVtree$,(state,nodeEditor)=>({state,nodeEditor}))
    .map((data)=> h('div.'+styles.mainWrap,[renderTopToolBar(data)]))
}
