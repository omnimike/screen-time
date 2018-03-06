// @flow

import React from 'react';
import { AppView } from './app_view';
import { render } from 'react-dom';

function main(el: HTMLElement) {
    render(<AppView />, el);
}

window.main = main;
