![Maintainance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://actumjs.github.io/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

# What is Actumjs?
Actumjs is a Javascript library to manage application state. You can use Actumjs with front-end libraries and frameworks like Reactjs,Vue and Angular.
it provides a state which is accessible to all other components of an application.
The only way to to update the applicaiton state is to trigger an action. [ Read more](https://actumjs.github.io)

# Installation

### Using NPM
```javascript
$ npm install  @actumjs/actum
```
### Using Yarn
```javascript
$ yarn add  @actumjs/actum
```
### With script tag
```html
<script type="text/Javascript" src ="https://actumjs.github.io/dist/v1.0.0/actum.js"></script>
```
# Creating Store
```javascript
import {createStore} from '@actumjs/actum';
//initial state of store
   const initial_state = { count:0 };         
   const store = createStore(initial_state);
```

# Adding Actions
```javascript
   store.addAction("increment",(payload,state)=>{ state.count++; });
```
# Listening to action
```javascript 
//listening to increment action
   const afterIncrement = store.after("increment",(payload,state)=>{
        //your code to handle action 
    })
```
# Examples
* [ Using with Reactjs](https://actumjs.github.io/basic-react-example)
* [ Using with Vuejs](https://actumjs.github.io/basic-vue-example)
* [ Todo App with Reactjs](https://actumjs.github.io/todo-app-with-react-example)
* [ Todo App With Vuejs](https://actumjs.github.io/todo-app-with-vue-example)
