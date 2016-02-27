import nodes from './core/nodes'
import {makeModel} from './utils/modelUtils'
import {combineLatestObj} from './utils/obsUtils'
import {mergeData, findIdenticals} from './utils/utils'
import {flatten,find,prop,difference,findIndex,equals,uniqBy,contains} from 'ramda'


//ui
function toggleFeedsSelection(state, input){
  const feedsSelectionToggled = !state.feedsSelectionToggled
  const addItemsToggled = false //UGH , refactor

  state = mergeData( state, {feedsSelectionToggled,addItemsToggled})
  return state
}

function toggleAddItems(state, input){
  const addItemsToggled = !state.addItemsToggled
  const feedsSelectionToggled = false //UGH , refactor
  state = mergeData( state, {addItemsToggled,feedsSelectionToggled})
  return state
}

function selectFeeds(state, input){
  //acts as a sort of toggle: if already there in the list, remove it , if not add it
  const added = difference(input, state.selections)
  function eqs(a,b){return a.node === b.node && a.feed === b.feed}
  /*let selectedFeeds =  [].concat(input, state.selectedFeeds)
  selectedFeeds = uniqBy(eqs,selectedFeeds)*/
  const sameOnes = findIdenticals(eqs, input, state.selections)

  const selectedFeeds = [].concat(added, state.selections)
    .filter(function(e){
      for(let i=0;i<sameOnes.length;i++){
        let b = sameOnes[i]
        if(eqs(e,b)){
          return false
        }
      }
      return true
    })

  return {data:state.data, selections:selectedFeeds}
}

function filterFeeds(state, input)
{
  //filter feeds accordingly
  const filteredFeeds = state.feeds
    .filter(function(feed){
      return feed
    })

  state = mergeData( state, {selections:filteredFeeds})
  return state
}


//selections "model"
export function toggles(actions){
  const updateFns = {toggleFeedsSelection, toggleAddItems}
  return makeModel({addItemsToggled:false, feedsSelectionToggled:false}, updateFns, actions)
}

//feeds model
export function feeds(actions){
  const updateFns = {selectFeeds, filterFeeds}
  return makeModel({data:[], selections:[]}, updateFns, actions)
}


export default function model(actions){
  return combineLatestObj({
    nodes   :nodes(actions)
    ,feeds  :feeds(actions)
    ,ui     :toggles(actions)
  })
}
