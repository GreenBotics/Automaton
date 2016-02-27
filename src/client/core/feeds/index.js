import {makeModel} from '../../utils/modelUtils'
import {mergeData, findIdenticals} from '../../utils/utils'
import {difference} from 'ramda'


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

//feeds model
export default function feeds(actions){
  const updateFns = {selectFeeds, filterFeeds}
  return makeModel({data:[], selections:[]}, updateFns, actions)
}
