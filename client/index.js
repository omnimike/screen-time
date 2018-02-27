// @flow

import React from 'react';
import { render } from 'react-dom';
import {
    ReviewEditView,
    blankReviewViewModel,
    reviewVMToModel
} from './review_view';
import type { ReviewViewModel } from './review_view';

type State = {
    review: ReviewViewModel,
    saving: boolean,
    message: {
        type: 'success' | 'error',
        value: string
    } | null
};

let state: State = {
    review: blankReviewViewModel(),
    saving: false,
    message: null
};

function save() {
    const review = reviewVMToModel(state.review);
    state.saving = true;
    state.message = null;
    update();
    fetch('/reviews', {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            state.review = blankReviewViewModel();
            state.message = {
                type: 'success',
                value: 'Review saved successfully'
            };
        } else {
            state.message = {
                type: 'error',
                value: 'An unexpected error occured'
            };
        }
        state.saving = false;
        update();
        window.scrollTo(0, 0);
    });
}

function update() {
    render(
        (
            <div>
                <SavingOverlay state={state.saving} />
                <AlertView message={state.message} />
                <ReviewEditView
                    review={state.review}
                    update={updateReview}
                    onSave={save}
                />
            </div>
        ),
        document.getElementById('container')
    );
}

function SavingOverlay({state}) {
    return (
        <div className={`overlay ${state ? '' : 'd-none'}`}></div>
    );
}

function AlertView({message}) {
    let cls = 'd-none';
    let text = '';
    if (message) {
        if (message.type === 'success') {
            cls = 'alert-success';
        } else if (message.type === 'error') {
            cls = 'alert-danger';
        }
        text = message.value;
    }
    return (
        <div className={`alert ${cls}`} role="alert">
            {text}
        </div>
    );
}

function updateReview(review) {
    state.review = review;
    update();
}
update();
