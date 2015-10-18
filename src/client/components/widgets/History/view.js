

function historyM(actions){
  let actionsL = []
  for(let key in actions){
    //console.log("actions",key)

    let opName = key.replace(/\$/g, "")
    let action$ = actions[key].map(a=>({type:opName,data:a}))
    actionsL.push(action$)
  }

  return Rx.Observable.merge(actionsL)
}

function renderHistory(items){
  let list = items.map(item=> <li></li>)
  return <ul> {list}</ul>
}

<section> 
  <button id="undo" disabled={model.history.past.length===0}> undo </button>
  <button id="redo" disabled={model.history.future.length===0}> redo </button>

  <div> Undos : {model.history.past.length} Redos: {model.history.future.length} </div>
  <div id="undosList">
    {renderHistory(model.history.past)}
  </div>
</section> 



  //let history$ = history(historyIntent(DOM),model$) 

  /*let opHistory$ = historyM(intent(DOM))
  opHistory$.subscribe(h=>console.log("Operation/action/command",h))*/