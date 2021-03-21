function createStore (initialState = {}) {

  const store = {};

  store.actions = {};

  store.addAction = function (actionName, callback) {
    if (actionName === undefined) {
      throw new Error('Invalid action');
    }

    actionName = actionName.trim().toLowerCase();

    if (store.actions[actionName] !== undefined) {
      throw new Error('Action already exists with the same name,try replace instead');
    }

    if (callback === undefined || typeof callback !== 'function') {
      throw new Error('Invalid action callback provided');
    }

    const actionObject = {callback:callback,before: [],after: [] };
    store.actions[actionName] = actionObject;
  }

  store.removeListener = function (pos, actionName, callback) {
    if (pos === undefined || pos === '' || pos === null || (!['after', 'before'].includes(pos.trim().toLowerCase()))) {
      throw new Error('Invalid listener position :' + pos)
    }

    if (actionName === undefined || actionName === '' || actionName === null || store.actions[actionName.trim().toLowerCase()] === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }

    if (callback === undefined || callback == null || typeof callback !== 'function') {
      throw new Error('Invalid callback provided as listener')
    }

    actionName = actionName.trim().toLowerCase()

    pos = pos.trim().toLowerCase()

    store.actions[actionName][pos] = store.actions[actionName][pos].filter(function (tmpCallback) {
      return (tmpCallback !== callback)
    })
  }

  store.after = function (actionName, callback) {
    return addListener('after', actionName, callback)
  }

  store.before = function (actionName, callback) {
    return addListener('before', actionName, callback)
  }

  function addListener (pos, actionName, callback) {
    if (actionName === undefined || actionName === '' || actionName === null || store.actions[actionName.trim().toLowerCase()] === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }

    if (callback === undefined || callback == null || typeof callback !== 'function') {
      throw new Error('Invalid callback provided as listener')
    }

    actionName = actionName.trim().toLowerCase()

    pos = pos.trim().toLowerCase()

    store.actions[actionName][pos].push(callback)

    return function () {
      store.removeListener(pos, actionName, callback)
    }
  };

  store.removeAction = function (actionName) {
    if (actionName === undefined || actionName === '' || actionName === null || store.actions[actionName.trim().toLowerCase()] === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }

    store.actions[actionName] = undefined
  }

  store.replaceActionCallback = function (actionName, callback) {
    if (actionName === undefined || actionName === '' || actionName === null || store.actions[actionName.trim().toLowerCase()] === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }

    store.actions[actionName].callback = callback
  }
  store.executeListener = function (pos, actionName, payload) {
    if (actionName === undefined || actionName === '' || actionName === null || store.actions[actionName.trim().toLowerCase()] === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }

    if (pos === undefined || pos === '' || pos === null || (!['after', 'before'].includes(pos.trim().toLowerCase()))) {
      throw new Error('Invalid position :' + pos)
    }

    let listenerCallback = null

    for (let i = 0; i < store.actions[actionName][pos].length; i++) {
      listenerCallback = store.actions[actionName][pos][i]

      if (typeof listenerCallback === 'function') {
        listenerCallback(payload, store.getState())
      }
    }
  }
  
  store.trigger = function (actionName, payload) {

    if (actionName === undefined || actionName === '' || actionName === null || store.actions[actionName.trim().toLowerCase()] === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }
    actionName = actionName.trim().toLowerCase();

    const actionCallback = store.actions[actionName].callback

    const add = store.addAction

    const remove = store.removeAction

    const replace = store.replaceActionCallback

    const addListener = store.addListener

    const removeListener = store.removeListener

    store.addAction = store.removeAction = store.addListener = store.removeListener = store.replaceActionCallback = function () {
      throw new Error("Error : Can't Add action/listener ,remove action/listener,replace action call back while another action is running")
    }

    if (actionCallback === null || actionCallback === undefined) {
      throw new Error('Invalid action name :' + actionName)
    }

    if (actionCallback === 'running') {
      throw new Error("Error : Can't execute " + actionName + ' while ' + actionName + ' is runing')
    }

    
    store.actions[actionName].callback = 'running'
    store.executeListener('before', actionName, payload)
    
    actionCallback(payload, store.state)

    store.executeListener('after', actionName, payload)

    store.actions[actionName].callback = actionCallback

    store.addAction = add

    store.removeAction = remove

    store.replaceActionCallback = replace

    store.addListener = addListener

    store.removeListener = removeListener

    store.removeAction = store.replaceActionCallback = function () {}
  }


  store.state = new Proxy(initialState,{
      get:function(){
          return Reflect.get(...arguments);
      },
      set:function(target,name ,value,reciver){
        let actionNames=Object.keys(store.actions);
        let isAnyActionRunning = actionNames.find((t,i)=>store.actions[t].actionCallback=="running") || false;
        if(isAnyActionRunning){
          throw new Error('Error : trying to modify state outside an action')
        }
          return Reflect.set(...arguments);
      }
  });
  //a read onnly state
  let state2= new Proxy(initialState,{
    get:function(){
        return Reflect.get(...arguments);
    },
    set:function(target,name ,value,reciver){
        throw new Error('Error : trying to modify state outside an action')
    }
  });

  store.getState = function () {
    return state2;
  }
  return store
}

module.exports = { createStore }
