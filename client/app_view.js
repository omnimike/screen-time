// @flow

import React from 'react';
import { ReviewEditView } from './review_view';
import { ListView } from './list_view';
import type { Review } from './models';
import { blankReview } from './models';
import { PrimaryButton, SecondaryButton } from './components';
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
    downloadReviews: Function;
    downloadEffectSizes: Function;
    keyHandler: Function;

    constructor(props: void) {
        super(props);
        this.state = {
            viewState: {type: 'list'}
        };
        this.viewReview = this.viewReview.bind(this);
        this.addReview = this.addReview.bind(this);
        this.saveReview = this.saveReview.bind(this);
        this.listReviews = this.listReviews.bind(this);
        this.downloadReviews = this.downloadReviews.bind(this);
        this.downloadEffectSizes = this.downloadEffectSizes.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keypress', this.keyHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.keyHandler);
    }

    keyHandler(evt: SyntheticKeyboardEvent) {
        if (this.state.viewState.type === 'list') {
            if (evt.key === 'n') {
                this.addReview();
            }
        }
    }

    listReviews() {
        this.setState({
            viewState: {type: 'list'}
        });
    }

    downloadReviews() {
        window.open('/reports/reviews');
    }

    downloadEffectSizes() {
        window.open('/reports/effect_sizes');
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

    saveReview() {
        this.addReview();
        window.scrollTo(0, 0);
    }

    render() {
        const viewState = this.state.viewState;
        return (
            <div className="app-view">
                {viewState.type === 'list' &&
                    <div>
                        <h1>{labels.heading_list_view}</h1>
                        <div
                            className="btn-group nav-bar"
                            role="group"
                        >
                            <SecondaryButton onClick={this.downloadReviews}>
                                {labels.button_download_reviews}
                            </SecondaryButton>
                            <SecondaryButton onClick={this.downloadEffectSizes}>
                                {labels.button_download_effect_sizes}
                            </SecondaryButton>
                            <PrimaryButton onClick={this.addReview}>
                                {labels.button_add_review}
                            </PrimaryButton>
                        </div>
                        <ListView 
                            view={this.viewReview}
                        />
                    </div>
                }
                {viewState.type === 'edit' &&
                    <div>
                        <div
                            className="btn-group nav-bar"
                            role="group"
                        >
                            <PrimaryButton
                                className="nav-button"
                                onClick={this.listReviews}
                            >
                                {labels.button_list_reviews}
                            </PrimaryButton>
                        </div>
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

