import intent from './intent'
import model from './model'
import view from './view'

export default function nodeEditor (sources) {
  const props$ = sources.props$

  const actions = intent(sources.sources)
  const state$ = model({actions, props$})
  const vtree$ = view(state$)

  return {
    DOM: vtree$,
    events: {
      activeNode: state$.pluck('activeNode').sample(actions.saveData$)
    }
  }
}
