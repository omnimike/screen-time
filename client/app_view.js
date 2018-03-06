// @flow

import React from 'react';
import { ReviewEditView } from './review_view';
import { ListView } from './list_view';
import type { Review } from './models';
import { blankReview } from './models';
import { PrimaryButton } from './components';
import labels from './labels';

type AppState = {
    viewState: EditState | ListState
};

type EditState = {
    type: 'edit',
    review: Review
};

type ListState = {
    type: 'list'
};

export class AppView extends React.Component<
    void,
    Object,
    AppState
> {

    state: AppState;
    viewReview: Function;
    addReview: Function;
    saveReview: Function;
    listReviews: Function;

    constructor(props: void) {
        super(props);
        this.state = {
            viewState: {type: 'list'}
        };
        this.viewReview = this.viewReview.bind(this);
        this.addReview = this.addReview.bind(this);
        this.saveReview = this.saveReview.bind(this);
        this.listReviews = this.listReviews.bind(this);
    }

    start() {
        this.render();
    }

    listReviews() {
        this.setState({
            viewState: {type: 'list'}
        });
    }

    viewReview(reviewId: string) {
        fetch('/reviews/' + reviewId).then(res => {
            res.json().then(review => {
                this.setState({
                    viewState: {
                        type: 'edit',
                        review
                    }
                });
            });
        });
    }

    addReview() {
        this.setState({
            viewState: {
                type: 'edit',
                review: blankReview()
            }
        });
    }

    saveReview(review: Review) {
        fetch('/reviews/' + review.id, {
            method: 'PUT',
            body: JSON.stringify(review),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                this.addReview();
                window.scrollTo(0, 0);
            }
        });
    }

    render() {
        const viewState = this.state.viewState;
        return (
            <div>
                {viewState.type === 'list' &&
                    <ListView 
                        view={this.viewReview}
                        add={this.addReview}
                    />
                }
                {viewState.type === 'edit' &&
                    <div>
                        <PrimaryButton onClick={this.listReviews}>
                            {labels.button_list_reviews}
                        </PrimaryButton>
                        <ReviewEditView
                            model={viewState.review}
                            onSave={this.saveReview}
                        />
                    </div>
                }
            </div>
        );
    }
}

function SavingOverlay({state}) {
    return (
        <div className={`overlay ${state ? '' : 'd-none'}`}></div>
    );
}

