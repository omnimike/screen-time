// @flow

import React from 'react';
import labels from './labels';

export type ListViewModel = {
    reviews: ListViewReviewModel[],
    view: string => void, 
};

type ListViewReviewModel = {
    id: string,
    extractor_name: string,
    extraction_date: string,
    first_author: string,
    year_of_publication: string,
};

export function ListView({reviews, view}: ListViewModel) {
    function openView(reviewId) {
        return () => view(reviewId);
    }
    return (
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <td>{labels.table_heading_extractor_name}</td>
                        <td>{labels.table_heading_extraction_date}</td>
                        <td>{labels.table_heading_first_author}</td>
                        <td>{labels.table_heading_year_of_publication}</td>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map(review => (
                        <tr key={review.id} onClick={openView(review.id)}>
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
