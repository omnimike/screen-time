// @flow

export type Review = {
    review_id: number,
    extractor_name: string,
    extraction_date: string,
    first_author: string,
    year_of_publication: number,
    search_strategy_desc: string,
    sample_age_desc: string,
    sample_age_lowest_mean: number,
    sample_age_highest_mean: number,
    are_you_sure: boolean,
    inclusion_exclusion_concerns: string,
    earliest_publication_year: number,
    latest_publication_year: number,
    number_of_studies: number,
    number_of_samples: number,
    rating_of_low_risk_bias: number,
    rating_of_moderate_risk_bias: number,
    rating_of_high_risk_bias: number,
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
    exposure_id: number,
    review_id: number,
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
    outcome_id: number,
    review_id: number,
    measure: string,
    measure_type: string,
    specific_variable: string,
    higher_order_variable: string,
    category: string
};

export type Moderator = {
    moderator_id: number,
    review_id: number,
    level: string,
    category: string,
};

export type EffectSize = {
    review_id: number,
    exposure_id: number,
    outcome_id: number,
    moderator_id: number,
    team_narrative_summary: string,
    value: number,
    value_lower_bound: number,
    value_upper_bound: number,
    p_value: number,
    statistical_test: string,
    comments: string,
};

export type ReviewViewModel = {
    review_id: number | null,
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
    exposures: Array<ExposureViewModel>,
    outcomes: Array<OutcomeViewModel>,
    moderators: Array<ModeratorViewModel>,
    effect_sizes: Array<EffectSizeViewModel>,
};

export type ExposureViewModel = {
    exposure_id: number | null,
    review_id: number | null,
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

export type OutcomeViewModel = {
    outcome_id: number | null,
    review_id: number | null,
    measure: string,
    measure_type: string,
    specific_variable: string,
    higher_order_variable: string,
    category: string
};

export type ModeratorViewModel = {
    moderator_id: number | null,
    review_id: number | null,
    level: string,
    category: string,
};

export type EffectSizeViewModel = {
    review_id: number | null,
    exposure_id: number | null,
    outcome_id: number | null,
    moderator_id: number | null,
    team_narrative_summary: string,
    value: string,
    value_lower_bound: string,
    value_upper_bound: string,
    p_value: string,
    statistical_test: string,
    comments: string,
};

export function blankReviewViewModel(): ReviewViewModel {
    return {
        review_id: null,
        extractor_name: '',
        extraction_date: '',
        first_author: '',
        year_of_publication: '',
        search_strategy_desc: '',
        same_age_desc: '',
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
        moderators: [],
        effect_sizes: [],
    };
}

export function blankExposureViewModel(): ExposureViewModel {
    return {
        exposure_id: null,
        review_id: null,
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

export function blankOutcomeViewModel(): OutcomeViewModel {
    return {
        outcome_id: null,
        review_id: null,
        measure: '',
        measure_type: '',
        specific_variable: '',
        higher_order_variable: '',
        category: '',
    };
}

export function blankModeratorViewModel(): ModeratorViewModel {
    return {
        moderator_id: null,
        review_id: null,
        level: '',
        category: '',
    };
}

export function blankEffectSizeViewModel(): EffectSizeViewModel {
    return {
        review_id: null,
        exposure_id: null,
        outcome_id: null,
        moderator_id: null,
        team_narrative_summary: '',
        value: '',
        value_lower_bound: '',
        value_upper_bound: '',
        p_value: '',
        statistical_test: '',
        comments: '',
    };
}

