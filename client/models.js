// @flow

export type Review = {
    id: string,
    extractor_name: string,
    extraction_date: string,
    first_author: string,
    year_of_publication: number | null,
    search_strategy_desc: string,
    sample_age_desc: string,
    sample_age_lowest_mean: number | null,
    sample_age_highest_mean: number | null,
    are_you_sure: boolean,
    inclusion_exclusion_concerns: string,
    earliest_publication_year: number | null,
    latest_publication_year: number | null,
    number_of_studies: number | null,
    number_of_samples: number | null,
    rating_of_low_risk_bias: number | null,
    rating_of_moderate_risk_bias: number | null,
    rating_of_high_risk_bias: number | null,
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
    value: number | null,
    value_lower_bound: number | null,
    value_upper_bound: number | null,
    p_value: number | null,
    statistical_test: string,
    comments: string,
};
