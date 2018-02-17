// @flow

import React from 'react';
import type {ReviewViewModel} from './models';
import labels from './labels';

export type ReviewProps = {
    review: ReviewViewModel,
    update: (ReviewViewModel) => void,
};

export function Review(props: ReviewProps) {
    function Input({field}) {
        const id = field;
        const label = labels['label_review_' + field];
        const value = props.review[field];
        const update = e => {
            props.update({
                ...props.review,
                [field]: e.target.value
            });
        };
        return (
            <div>
                <label htmlFor={id}>{label}</label>
                <input id={id} value={value} onChange={update}/>
            </div>
        );
    }

    return (
        <section>
            <h3>{labels.heading_extraction_info}</h3>
            <Input field="extractor_name" />
            <Input field="extraction_date" />
            <h3>{labels.heading_review_id}</h3>
            <Input field="first_author" />
            <Input field="year_of_publication" />
            <Input field="search_strategy_desc" />
            <Input field="sample_age_desc" />
            <Input field="sample_age_lowest_mean" />
            <Input field="sample_age_highest_mean" />
            <Input field="are_you_sure" />
            <Input field="inclusion_exclusion_concerns" />
            <Input field="earliest_publication_year" />
            <Input field="latest_publication_year" />
            <Input field="number_of_studies" />
            <Input field="number_of_samples" />
            <h3>{labels.heading_risk_of_bias}</h3>
            <h4>{labels.subheading_review_risk_of_bias}</h4>
            <Input field="rating_of_low_risk_bias" />
            <Input field="rating_of_moderate_risk_bias" />
            <Input field="rating_of_high_risk_bias" />
            <Input field="bias_rating_system" />
            <Input field="bias_rating_system_reference" />
            <h3>{labels.heading_teams_level_of_evidence_judgement}</h3>
            <Input field="level_of_evidence_judgement_1" />
            <Input field="level_of_evidence_judgement_2" />
            <Input field="level_of_evidence_judgement_3" />
        </section>
    );
}

