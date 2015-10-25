import GraphsGroup from '../widgets/GraphsGroup'

export function GraphsGroupWrapper(state$, DOM){
  let props$ = state$
  return GraphsGroup({DOM,props$})
}