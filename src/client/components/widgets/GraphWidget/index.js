/** @jsx hJSX */
import Rx from 'rx'
import {hJSX} from '@cycle/dom'


function GraphWidget ({DOM, props$}, name = '') {
  
  let vtree$ = props$.map(function(props){
    return {new GraphWidget(props.data,props.settings)}
  })
  return {
    DOM:vtree$
  }
}