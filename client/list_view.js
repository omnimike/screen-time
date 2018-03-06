// @flow

import React from 'react';
import labels from './labels';
import { PrimaryButton } from './components';

type ListViewReviewModel = {
    id: string,
    extractor_name: string,
    extraction_date: string,
    first_author: string,
    year_of_publication: string,
};

type ListViewProps = {
    view: (string) => void,
    add: () => void,
};

type ListViewState = {
    reviews: Array<ListViewReviewModel>
};

export class ListView extends React.Component<
    void,
    ListViewProps,
    ListViewState
> {
    state: ListViewState;

    constructor(props: ListViewProps) {
        super(props);
        this.state = {
            reviews: []
        };
    }

    componentDidMount() {
        fetch('/reviews').then(res => {
            if (res.ok) {
                res.json().then(reviews => {
                    this.setState({
                        ...this.state,
                        reviews
                    });
                });
            }
        });
    }

    render() {
        const openView = reviewId => {
            return () => this.props.view(reviewId);
        };
        return (
            <div>
                <PrimaryButton onClick={this.props.add}>
                    {labels.button_add_review}
                </PrimaryButton>
                <table className="table">
                    <thead>
                        <tr>
                            <td>{labels.table_heading_extractor_name}</td>
                            <td>{labels.table_heading_extraction_date}</td>
                            <td>{labels.table_heading_first_author}</td>
                            <td>{labels.table_heading_year_of_publication}</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.reviews.map(review => (
                            <tr key={review.id}
                                onClick={openView(review.id)}
                                className="review-list-row"
                            >
                                <td>{review.extractor_name}</td>
                                <td>{review.extraction_date}</td>
                                <td>{review.first_author}</td>
                                <td>{review.year_of_publication}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
