// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

type State = {
    counter: number
};

type IncrementAction = {
    type: 'increment'
};

type Action = IncrementAction;

function initialState(): State {
    return {
        counter: 0
    };
}

function reducer(state: State, action: Action) {
    switch (action) {
    case 'increment':
        return {
            counter: state.counter + 1
        };
    default:
        return state;
    }

}

function Counter(props) {
    return <div>counter: {props.counter}</div>;
}

function mapStateToProps(state: State) {
    return {
        counter: state.counter
    };
}

const AppView = connect(
    mapStateToProps
)(Counter);

const store = createStore(reducer, initialState());

render(
    <Provider store={store}>
        <AppView />
    </Provider>,
    document.getElementById('container')
);

