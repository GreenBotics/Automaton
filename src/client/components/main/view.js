import Cycle from '@cycle/core'
//import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul} from '@cycle/dom'
import {h as h} from 'cycle-snabbdom'
import Class from 'classnames'
import Rx from 'rx'
const {combineLatest,just} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'

import nodeEditor from '../nodeEditor'
import feedsSelector from '../feedsSelector'

import styles from './styles.css'
import hyperstyles from 'hyperstyles'
//const h = hyperstyles(vh, styles)

console.log('styles',styles)

function renderTopToolBar (state) {
  let _feedsSelector = feedsSelector({props$:just(state)}).DOM
  let _nodeEditor    = nodeEditor({props$:just(state)}).DOM

  //return h('div.foo#bar','some text')
  return h('section#topToolbar.foo',[
      h('button#addItems','Manage items'),
      h('button#feedsSelect','Select feeds'),

      _feedsSelector,
      _nodeEditor
    ])
}

export default function view(state$, graphsGroupVTree$){

  return state$
    .tap(e=>console.log("state",e))
    .map(state=> h('div.foo',[renderTopToolBar(state)]))
}
