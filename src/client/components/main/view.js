import Cycle from '@cycle/core'
//import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul} from '@cycle/dom'
import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul, option, select} from 'cycle-snabbdom'
import Class from 'classnames'
import Rx from 'rx'
const {combineLatest,just} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'

import nodeEditor from '../nodeEditor'
import feedsSelector from '../feedsSelector'


function renderTopToolBar (state) {
  let _feedsSelector = feedsSelector({props$:just(state)}).DOM
  let _nodeEditor    = nodeEditor({props$:just(state)}).DOM

  return section('#topToolbar',[
      h('button#addItems','Manage items'),
      h('button#feedsSelect','Select feeds'),

      _feedsSelector,
      _nodeEditor
    ])
}

export default function view(state$, graphsGroupVTree$){

  return state$
    .tap(e=>console.log("state",e))
    .map(state=> h('div',[renderTopToolBar(state)]))
}
