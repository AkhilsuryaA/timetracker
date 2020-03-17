
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux"
import App from "./App";
import configStore from "../src/store/store";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configStore();

const rootElement = document.getElementById("root");
ReactDOM.render(
<Provider store={store} >
    <PersistGate persistor={persistor}>
        <App />
    </PersistGate>
</Provider>
, rootElement);


/*
import React from 'react';
import ReactDOM, {render} from 'react-dom';
import routing from "../src/App";
import { Provider } from 'react-redux';
import App from "../src/App";
import { createStore } from 'redux';
import reducer from "../src/reducers/team_reducer";

const store = createStore(reducer);

render(<Provider store={store}><App/></Provider>, document.getElementById("root") )
*/

