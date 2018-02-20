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

