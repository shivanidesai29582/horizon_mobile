
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from "../redux/index";
const middleware = [
  thunk,
];

// const store = createStore(reducers, {}, applyMiddleware(...middleware));

const configureStore = () => {
  let store = null;
  // if (__DEV__) {
  //   import('./../../ReactotronConfig').then(() =>
  //       console.log('Reactotron Configured'),
  //   );
  // }
  /*Redux thunk use as third prty midleware that is use for update store after call async task ,
   it hold action and dispatch after getting response from api
   if we have no async taks than no need to use it.*/

  /*Compose is used when you want to pass multiple store enhancers to the store. Store enhancers are higher order functions that add some extra functionality to the store
  * e.g compose(func1, func2, func3, func4)
  * */
  store = compose(applyMiddleware(...middleware))(createStore)(reducers);
  return store;
};

export default configureStore();
