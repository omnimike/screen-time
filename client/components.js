// @flow

import React from 'react';

export function Button(props: Object) {
    return <button className="btn btn-primary" {...props}>{props.children}</button>;
}
