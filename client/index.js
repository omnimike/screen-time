// @flow

import React from 'react';
import { render } from 'react-dom';
import { Review } from './views';
import { blankReviewViewModel } from './models';

let state = {
    review: blankReviewViewModel()
};
function update(review) {
    state.review = review;
    render(
        <Review
            review={state.review}
            update={update}
        />,
        document.getElementById('container')
    );
}
update(state.review);
