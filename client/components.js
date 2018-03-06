// @flow

import React from 'react';

export function PrimaryButton(props: Object) {
    return <button className="btn btn-primary" {...props}>{props.children}</button>;
}

export function SecondaryButton(props: Object) {
    return <button className="btn btn-secondary" {...props}>{props.children}</button>;
}

export function DangerButton(props: Object) {
    return <button className="btn btn-danger" {...props}>{props.children}</button>;
}
