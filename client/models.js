// @flow

import uuid from './vendor/uuid';

export type Review = {
    id: integer,
    extractor_name: string,
    extraction_date: string,
    first_author: string,
    year_of_publication: string,
    search_strategy_desc: string,
    sample_age_desc: string,
    sample_age_lowest_mean: string,
    sample_age_highest_mean: string,
    are_you_sure: boolean,
    inclusion_exclusion_concerns: string,
    earliest_publication_year: string,
    latest_publication_year: string,
    number_of_studies: string,
    number_of_samples: string,
    rating_of_low_risk_bias: string,
    rating_of_moderate_risk_bias: string,
    rating_of_high_risk_bias: string,
    bias_rating_system: string,
    bias_rating_system_reference: string,
    level_of_evidence_judgement_1: string,
    level_of_evidence_judgement_2: string,
    level_of_evidence_judgement_3: string,
    amstar_2: Array<string>,
    exposures: Array<Exposure>,
    outcomes: Array<Outcome>,
    moderators: Array<Moderator>,
    effect_sizes: Array<EffectSize>,
};

export type Exposure = {
    id: string,
    content_specifics: string,
    content_category: string,
    measure: string,
    measure_type: string,
    device_type: string,
    device_category: string,
    device_portability: string,
    setting: string,
    setting_category: string,
    social_environment_specific: string,
    social_environment_general: string,
};

export type Outcome = {
    id: string,
    measure: string,
    measure_type: string,
    specific_variable: string,
    higher_order_variable: string,
    category: string
};

export type Moderator = {
    id: string,
    level: string,
    category: string,
};

export type EffectSize = {
    exposure_id: string,
    outcome_id: string,
    moderator_id: string,
    team_narrative_summary: string,
    value: string,
    value_lower_bound: string,
    value_upper_bound: string,
    p_value: string,
    statistical_test: string,
    comments: string,
};

export function blankReview(): Review {
    return {
        id: uuid(),
        extractor_name: '',
        extraction_date: '',
        first_author: '',
        year_of_publication: '',
        search_strategy_desc: '',
        sample_age_desc: '',
        sample_age_lowest_mean: '',
        sample_age_highest_mean: '',
        are_you_sure: false,
        inclusion_exclusion_concerns: '',
        earliest_publication_year: '',
        latest_publication_year: '',
        number_of_studies: '',
        number_of_samples: '',
        rating_of_low_risk_bias: '',
        rating_of_moderate_risk_bias: '',
        rating_of_high_risk_bias: '',
        bias_rating_system: '',
        bias_rating_system_reference: '',
        level_of_evidence_judgement_1: '',
        level_of_evidence_judgement_2: '',
        level_of_evidence_judgement_3: '',
        amstar_2: [],
        exposures: [],
        outcomes: [],
        moderators: [overallModerator()],
        effect_sizes: [],
    };
}

export function blankExposure(): Exposure {
    return {
        id: uuid(),
        content_specifics: '',
        content_category: '',
        measure: '',
        measure_type: '',
        device_type: '',
        device_category: '',
        device_portability: '',
        setting: '',
        setting_category: '',
        social_environment_specific: '',
        social_environment_general: '',
    };
}

export function blankOutcome(): Outcome {
    return {
        id: uuid(),
        measure: '',
        measure_type: '',
        specific_variable: '',
        higher_order_variable: '',
        category: '',
    };
}

export function blankModerator(): Moderator {
    return {
        id: uuid(),
        level: '',
        category: '',
    };
}

export function overallModerator(): Moderator {
    return {
        id: uuid(),
        level: 'Overall',
        category: 'Overall',
    };
}

export function blankEffectSize(
    exposureId: string,
    outcomeId: string,
    moderatorId: string
): EffectSize{
    return {
        exposure_id: exposureId,
        outcome_id: outcomeId,
        moderator_id: moderatorId,
        team_narrative_summary: '',
        value: '',
        value_lower_bound: '',
        value_upper_bound: '',
        p_value: '',
        statistical_test: '',
        comments: '',
    };
}
