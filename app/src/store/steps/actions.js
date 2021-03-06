import client from 'api-steps-client'

/*
export function someAction (context) {
}
*/
export function fetchSteps (state, data) {
  return client
    .fetchSteps()
    .then(steps => {
      state.commit('setSteps', steps)
      return steps
    })
}

export function fetchStepsByProcessId (state, id) {
  return client
    .fetchStepsByProcessId(id)
    .then(steps => {
      state.commit('setSteps', steps)
      return steps
    })
}

export function addStep (state, step) {
  state.commit('addNode', step)
  return 1
}

export function changeStep (state, payload) {
  state.commit('changeStep', payload)
  return
}


export function deleteStep (state, payload) {
  state.commit('deleteStep', payload)
  return
}

export function addSteps (state, data) {
  return client
    .fetchSteps()
    .then(steps => state.commit('setSteps', steps))
}

export function editSteps (state, steps) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(steps)
  return client
    .updateSteps(steps)
    .then(steps_return => state.commit('editSteps', steps_return))
}

export function saveStep (state, step) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log(step)
  let savingStep = JSON.parse(JSON.stringify(step, ['id', 'cost', 'locationSpecific', 'location', 'locationLon', 'locationLat', 'idProcess']));

  console.log("before calling save step api")

  return client
    .saveStep(savingStep)
    .then(steps_return => {
      //    state.commit('saveSteps', steps_return)
    })

}

export function deleteSteps (state, steps) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(steps)
  return client
    .deleteSteps(steps)
    .then(steps_return => state.commit('deleteSteps', steps_return))
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
/*export function deleteDocument({commit}, document_type) {

  commit(delete_document_type, document_type.id)
} */