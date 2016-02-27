const setHighlightMod$ = actions.setHighlight$
  .map(function(highlighted){
    return function (state) {
      return state.set('highlighted', highlighted)
    })
  }

//generic
/*any time the actionA emits
actions.actionA$ ---------E--------->
*/
const actionModifier$ = actions.actionA$
  .map(function(input){
    return function (state) {
      return state.set('input', input)
    })
  }

const actionModifier$ = actions.actionA$
  .map(function(input){
    return function (state) {
      return state.set('input', input)
    })
  }

let modA$   = actions.actionA$
  .map((input) => (state) => {
    state   = modFnA(state, input)//call the adapted function
    return state
  })

let modB$   = actions.actionB$
  .map((input) => (state) => {
    state   = modFnB(state, input)//call the adapted function
    return state
  })
let mods$ = merge(modA$, modB$)

/*any time the actionA emits
action$ -----A----B----A----->
mods$   -----A$---B$---A$---->
*/

//in this one actions$ is a stream of (higher level) observables
export function makeModel2(defaults, updateFns, actions$,){
  let mods$ =  makeModifications(actions, updateFns, options)

  let source$ = source || just( defaults)

  source$ = applyDefaults(source$, defaults)

  if(options.doApplyTransform){
    source$ = applyTransform( source$, transform )
  }

  return mods$
    .merge(source$)
    .scan(smartStateFold)//combine existing data with new one
    .shareReplay(1)
}
