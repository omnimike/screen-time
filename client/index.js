// @flow

import React from 'react';
import { render } from 'react-dom';
import { Review, blankReviewViewModel } from './review_view';

let state = {
    review: blankReviewViewModel()
};
function update(review) {
    state.review = review;
    console.log(review);
    render(
        <Review
            model={state.review}
            update={update}
        />,
        document.getElementById('container')
    );
}
update(state.review);
