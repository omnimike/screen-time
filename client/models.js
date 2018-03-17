// @flow

import uuid from './vendor/uuid';

export type Review = {
    id: string,
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
    notes: string,
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
        notes: '',
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

export type ValidationResult = {
    isValid: true
} | {
    isValid: false,
    errors: ReviewValidationErrors
};

export type EmptyError = 'EMPTY';
export type NotAnIntegerError = 'NOT_AN_INTEGER';
export type NotADecimalError = 'NOT_A_DECIMAL';
export type NotAYearError = 'NOT_A_YEAR';

export type ReviewValidationErrors = {
    extractor_name?: EmptyError,
    extraction_date?: EmptyError,
    first_author?: EmptyError,
    year_of_publication?: NotAYearError,
    search_strategy_desc?: EmptyError,
    sample_age_desc?: EmptyError,
    sample_age_lowest_mean?: NotADecimalError,
    sample_age_highest_mean?: NotADecimalError,
    inclusion_exclusion_concerns?: EmptyError,
    earliest_publication_year?: NotAYearError,
    latest_publication_year?: NotAYearError,
    number_of_studies?: NotAnIntegerError,
    number_of_samples?: NotAnIntegerError,
    rating_of_low_risk_bias?: NotADecimalError,
    rating_of_moderate_risk_bias?: NotADecimalError,
    rating_of_high_risk_bias?: NotADecimalError,
    bias_rating_system?: EmptyError,
    bias_rating_system_reference?: EmptyError,
    level_of_evidence_judgement_1?: EmptyError,
    level_of_evidence_judgement_2?: EmptyError,
    level_of_evidence_judgement_3?: EmptyError,
    notes?: EmptyError,
    exposures?: Array<ExposureValidationErrors>,
    outcomes?: Array<OutcomeValidationErrors>,
    moderators?: Array<ModeratorValidationErrors>,
    effect_sizes?: Array<EffectSizeValidationErrors>,
};

export type ExposureValidationErrors = {
    content_specifics?: EmptyError,
    content_category?: EmptyError,
    measure?: EmptyError,
    measure_type?: EmptyError,
    device_type?: EmptyError,
    device_category?: EmptyError,
    device_portability?: EmptyError,
    setting?: EmptyError,
    setting_category?: EmptyError,
    social_environment_specific?: EmptyError,
    social_environment_general?: EmptyError,
};

export type OutcomeValidationErrors = {
    measure?: EmptyError,
    measure_type?: EmptyError,
    specific_variable?: EmptyError,
    higher_order_variable?: EmptyError,
    category?: EmptyError,
};

export type ModeratorValidationErrors = {
    level?: EmptyError,
    category?: EmptyError,
};

export type EffectSizeValidationErrors = {
    team_narrative_summary?: EmptyError,
    value?: NotADecimalError,
    value_lower_bound?: NotADecimalError,
    value_upper_bound?: NotADecimalError,
    p_value?: NotADecimalError,
    statistical_test?: EmptyError,
    comments?: EmptyError,
};

function notEmpty(val): EmptyError | null {
    if (val === '') {
        return 'EMPTY';
    }
    return null;
}

function integer(val): NotAnIntegerError | null {
    if (applicable(val) && !val.match(/\d+/)) {
        return 'NOT_AN_INTEGER';
    }
    return null;
}

function decimal(val: string): NotADecimalError | null {
    if (applicable(val) && !val.match(/\d+(\.\d+)?/)) {
        return 'NOT_A_DECIMAL';
    }
    return null;
}

function year(val): NotAYearError | null {
    if (applicable(val) && !val.match(/\d{4}/)) {
        return 'NOT_A_YEAR';
    }
    return null;
}

function applicable(val: string) {
    const lowerVal = val.toLowerCase();
    return lowerVal !== 'nr' && lowerVal !== 'na';
}

function modelValidator(rules) {
    return (model: Object) => {
        const errors = {};
        let found = false;
        for (const field in rules) {
            const val = model[field];
            errors[field] = rules[field](val);
            if (errors[field] !== null) {
                found = true;
            }
        }
        if (found) {
            return errors;
        } else {
            return null;
        }
    };
}

function arrayValidator(validator) {
    return (models) => {
        const errors = [];
        let foundError = false;
        for (let i = 0; i < models.length; i++) {
            errors[i] = validator(models[i]);
            if (errors[i]) {
                foundError = true;
            }
        }
        if (foundError) {
            return errors;
        }
        return null;
    };
}

export const exposureValidator = modelValidator({
    content_specifics: notEmpty,
    content_category: notEmpty,
    measure: notEmpty,
    measure_type: notEmpty,
    device_type: notEmpty,
    device_category: notEmpty,
    device_portability: notEmpty,
    setting: notEmpty,
    setting_category: notEmpty,
    social_environment_specific: notEmpty,
    social_environment_general: notEmpty,
});

export const outcomeValidator = modelValidator({
    measure: notEmpty,
    measure_type: notEmpty,
    specific_variable: notEmpty,
    higher_order_variable: notEmpty,
    category: notEmpty,
});

export const moderatorValidator = modelValidator({
    level: notEmpty,
    category: notEmpty,
});

export const effectSizeValidator = modelValidator({
    team_narrative_summary: notEmpty,
    value: decimal,
    value_lower_bound: decimal,
    value_upper_bound: decimal,
    p_value: decimal,
    statistical_test: notEmpty,
    comments: notEmpty,
});

export const reviewValidator = modelValidator({
    extractor_name: notEmpty,
    extraction_date: notEmpty,
    first_author: notEmpty,
    year_of_publication: year,
    search_strategy_desc: notEmpty,
    sample_age_desc: notEmpty,
    sample_age_lowest_mean: decimal,
    sample_age_highest_mean: decimal,
    inclusion_exclusion_concerns: notEmpty,
    earliest_publication_year: year,
    latest_publication_year: year,
    number_of_studies: integer,
    number_of_samples: integer,
    rating_of_low_risk_bias: decimal,
    rating_of_moderate_risk_bias: decimal,
    rating_of_high_risk_bias: decimal,
    bias_rating_system: notEmpty,
    bias_rating_system_reference: notEmpty,
    level_of_evidence_judgement_1: notEmpty,
    level_of_evidence_judgement_2: notEmpty,
    level_of_evidence_judgement_3: notEmpty,
    notes: notEmpty,
    exposures: arrayValidator(exposureValidator),
    outcomes: arrayValidator(outcomeValidator),
    moderators: arrayValidator(moderatorValidator),
    effect_sizes: arrayValidator(effectSizeValidator),
});

export function validateReview(review: Review): ValidationResult {
    const errors = reviewValidator(review);
    for (const key in errors) {
        if (errors[key] !== null) {
            return {
                isValid: false,
                errors
            };
        }
    }
    return {
        isValid: true
    };
}

