// @flow

import React from 'react';
import { render } from 'react-dom';
import { ReviewEditView } from './review_view';
import { ListView } from './list_view';
import type { Review } from './models';
import { blankReview } from './models';
import { Button } from './components';
import labels from './labels';

type AppState = EditState | ListState;

type EditState = {
    view: 'edit',
    review: Review
};

type ListState = {
    view: 'list'
};

class App {

    state: AppState;
    el: HTMLElement;
    viewReview: Function;
    addReview: Function;
    saveReview: Function;
    listReviews: Function;

    constructor(el: HTMLElement) {
        this.el = el;
        this.state = {
            view: 'list'
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
        this.state = {
            view: 'list'
        };
        this.render();
    }

    viewReview(reviewId: string) {
        fetch('/reviews/' + reviewId).then(res => {
            res.json().then(review => {
                this.state = {
                    view: 'edit',
                    review
                };
                this.render();
            });
        });
    }

    addReview() {
        this.state = {
            view: 'edit',
            review: blankReview()
        };
        this.render();
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
        render(
            <div>
                {this.state.view === 'list' &&
                    <ListView 
                        view={this.viewReview}
                        add={this.addReview}
                    />
                }
                {this.state.view === 'edit' &&
                    <div>
                        <Button onClick={this.listReviews}>
                            {labels.button_list_reviews}
                        </Button>
                        <ReviewEditView
                            model={this.state.review}
                            onSave={this.saveReview}
                        />
                    </div>
                }
            </div>,
            this.el
        );
    }
}

function SavingOverlay({state}) {
    return (
        <div className={`overlay ${state ? '' : 'd-none'}`}></div>
    );
}

const appEl = document.getElementById('container');
if (appEl) {
    window.app = new App(appEl);
    window.app.start();
}
