// @flow

import React from 'react';

export function PrimaryButton(props: Object) {
    return (
        <button {...mergeClasses(props, 'btn btn-primary')}>
            {props.children}
        </button>
    );
}

export function SecondaryButton(props: Object) {
    return (
        <button {...mergeClasses(props, 'btn btn-secondary')}>
            {props.children}
        </button>
    );
}

export function DangerButton(props: Object) {
    return (
        <button {...mergeClasses(props, 'btn btn-danger')}>
            {props.children}
        </button>
    );
}

function mergeClasses(props, className='') {
    let fullClassName = props.className ?
        props.className + ' ' + className :
        className;
    return {
        ...props,
        className: fullClassName
    };
}

