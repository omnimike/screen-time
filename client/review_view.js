// @flow

import React from 'react';
import labels from './labels';
import uuid from './vendor/uuid';
import { delimIndexBy } from './utils';

export type ReviewViewModel = {
    review_id: string,
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

export function blankReviewViewModel(): ReviewViewModel {
    return {
        review_id: uuid(),
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
        moderators: [],
        effect_sizes: [],
    };
}

type ReviewProps = {
    model: ReviewViewModel,
    update: (ReviewViewModel) => void
};

export function Review(props: ReviewProps) {
    return (
        <div>
            <ReviewDetails
                model={props.model}
                update={props.update}
            />
            <Exposures
                model={props.model.exposures}
                update={val =>
                    props.update({
                        ...props.model,
                        exposures: val,
                    })
                }
            />
            <Outcomes
                model={props.model.outcomes}
                update={val =>
                    props.update({
                        ...props.model,
                        outcomes: val,
                    })
                }
            />
            <Moderators
                model={props.model.moderators}
                update={val =>
                    props.update({
                        ...props.model,
                        moderators: val,
                    })
                }
            />
            <EffectSizes
                model={props.model}
                update={val =>
                    props.update({
                        ...props.model,
                        effect_sizes: val,
                    })
                }
            />
        </div>
    );
}

type SectionProps<ViewModelType> = {
    model: ViewModelType,
    update: (ViewModelType) => void,
};

function ReviewDetails(props: SectionProps<ReviewViewModel>) {
    function inputProps(field) {
        return {
            label: labels['label_review_' + field],
            value: props.model[field],
            update: val => {
                props.update({
                    ...props.model,
                    [field]: val
                });
            },
        };
    }

    return (
        <section>
            <h3>{labels.heading_extraction_info}</h3>
            <Input {...inputProps('extractor_name')} />
            <Input {...inputProps('extraction_date')} />
            <h3>{labels.heading_review_id}</h3>
            <Input {...inputProps('first_author')} />
            <Input {...inputProps('year_of_publication')} />
            <Input {...inputProps('search_strategy_desc')} />
            <Input {...inputProps('sample_age_desc')} />
            <Input {...inputProps('sample_age_lowest_mean')} />
            <Input {...inputProps('sample_age_highest_mean')} />
            <Checkbox {...inputProps('are_you_sure')} />
            <Input {...inputProps('inclusion_exclusion_concerns')} />
            <Input {...inputProps('earliest_publication_year')} />
            <Input {...inputProps('latest_publication_year')} />
            <Input {...inputProps('number_of_studies')} />
            <Input {...inputProps('number_of_samples')} />
            <h3>{labels.heading_risk_of_bias}</h3>
            <h4>{labels.subheading_review_risk_of_bias}</h4>
            <Input {...inputProps('rating_of_low_risk_bias')} />
            <Input {...inputProps('rating_of_moderate_risk_bias')} />
            <Input {...inputProps('rating_of_high_risk_bias')} />
            <Input {...inputProps('bias_rating_system')} />
            <Input {...inputProps('bias_rating_system_reference')} />
            <h3>{labels.heading_teams_level_of_evidence_judgement}</h3>
            <Input {...inputProps('level_of_evidence_judgement_1')} />
            <Input {...inputProps('level_of_evidence_judgement_2')} />
            <Input {...inputProps('level_of_evidence_judgement_3')} />
        </section>
    );
}

type ExposureViewModel = {
    exposure_id: string,
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

export function blankExposureViewModel(): ExposureViewModel {
    return {
        exposure_id: uuid(),
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

function Exposures(props: SectionProps<ExposureViewModel[]>) {
    function update(model: ExposureViewModel, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create() {
        const newArr = props.model.slice();
        newArr.push(blankExposureViewModel());
        props.update(newArr);
    }
    function removeExposure(idx: number) {
        return () => {
            const newArr = props.model.slice();
            newArr.splice(idx, 1);
            props.update(newArr);
        };
    }
    return (
        <section>
            {props.model.map((exposure, i) =>
                <Exposure
                    key={i}
                    idx={i}
                    model={exposure}
                    update={update}
                    remove={removeExposure(i)}
                />
            )}
            <AddButton onClick={create}>
                {labels.button_exposure_add}
            </AddButton>
        </section>
    );
}

type SubItemProps<ViewModelType> = {
    model: ViewModelType,
    update: (ViewModelType, number) => void,
    remove: () => void,
    idx: number,
};

function Exposure(props: SubItemProps<ExposureViewModel>) {
    function inputProps(field) {
        return {
            label: labels['label_exposure_' + field],
            value: props.model[field],
            update: val => {
                props.update({
                    ...props.model,
                    [field]: val
                }, props.idx);
            },
        };
    }

    return (
        <section>
            <h3>{labels.heading_exposure_info}</h3>
            <Input {...inputProps('content_specifics')} />
            <Input {...inputProps('content_category')} />
            <Input {...inputProps('measure')} />
            <Input {...inputProps('measure_type')} />
            <Input {...inputProps('device_type')} />
            <Input {...inputProps('device_category')} />
            <Input {...inputProps('device_portability')} />
            <Input {...inputProps('setting')} />
            <Input {...inputProps('setting_category')} />
            <Input {...inputProps('social_environment_specific')} />
            <Input {...inputProps('social_environment_general')} />
            <RemoveButton onClick={props.remove}>
                {labels.button_exposure_remove}
            </RemoveButton>
        </section>
    );
}

type OutcomeViewModel = {
    outcome_id: string,
    measure: string,
    measure_type: string,
    specific_variable: string,
    higher_order_variable: string,
    category: string
};

export function blankOutcomeViewModel(): OutcomeViewModel {
    return {
        outcome_id: uuid(),
        measure: '',
        measure_type: '',
        specific_variable: '',
        higher_order_variable: '',
        category: '',
    };
}


function Outcomes(props: SectionProps<OutcomeViewModel[]>) {
    function update(model: OutcomeViewModel, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create() {
        const newArr = props.model.slice();
        newArr.push(blankOutcomeViewModel());
        props.update(newArr);
    }
    function remove(idx: number) {
        return () => {
            const newArr = props.model.slice();
            newArr.splice(idx, 1);
            props.update(newArr);
        };
    }
    return (
        <section>
            {props.model.map((model, i) =>
                <Outcome
                    key={i}
                    idx={i}
                    model={model}
                    update={update}
                    remove={remove(i)}
                />
            )}
            <AddButton onClick={create}>
                {labels.button_outcome_add}
            </AddButton>
        </section>
    );
}

function Outcome(props: SubItemProps<OutcomeViewModel>) {
    function inputProps(field) {
        return {
            label: labels['label_outcome_' + field],
            value: props.model[field],
            update: val => {
                props.update({
                    ...props.model,
                    [field]: val
                }, props.idx);
            },
        };
    }

    return (
        <section>
            <h3>{labels.heading_outcome_info}</h3>
            <Input {...inputProps('measure')} />
            <Input {...inputProps('measure_type')} />
            <Input {...inputProps('specific_variable')} />
            <Input {...inputProps('higher_order_variable')} />
            <Input {...inputProps('category')} />
            <RemoveButton onClick={props.remove}>
                {labels.button_outcome_remove}
            </RemoveButton>
        </section>
    );
}

type ModeratorViewModel = {
    moderator_id: string,
    level: string,
    category: string,
};

export function blankModeratorViewModel(): ModeratorViewModel {
    return {
        moderator_id: uuid(),
        level: '',
        category: '',
    };
}

function Moderators(props: SectionProps<ModeratorViewModel[]>) {
    function update(model: ModeratorViewModel, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create() {
        const newArr = props.model.slice();
        newArr.push(blankModeratorViewModel());
        props.update(newArr);
    }
    function remove(idx: number) {
        return () => {
            const newArr = props.model.slice();
            newArr.splice(idx, 1);
            props.update(newArr);
        };
    }
    return (
        <section>
            {props.model.map((model, i) =>
                <Moderator
                    key={i}
                    idx={i}
                    model={model}
                    update={update}
                    remove={remove(i)}
                />
            )}
            <AddButton onClick={create}>
                {labels.button_moderator_add}
            </AddButton>
        </section>
    );
}

function Moderator(props: SubItemProps<ModeratorViewModel>) {
    function inputProps(field) {
        return {
            label: labels['label_moderator_' + field],
            value: props.model[field],
            update: val => {
                props.update({
                    ...props.model,
                    [field]: val
                }, props.idx);
            },
        };
    }

    return (
        <section>
            <h3>{labels.heading_moderator_info}</h3>
            <Input {...inputProps('level')} />
            <Input {...inputProps('category')} />
            <RemoveButton onClick={props.remove}>
                {labels.button_moderator_remove}
            </RemoveButton>
        </section>
    );
}

type EffectSizeViewModel = {
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

export function blankEffectSizeViewModel(
    exposureId: string,
    outcomeId: string,
    moderatorId: string
): EffectSizeViewModel {
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

type EffectSizesProps = {
    model: ReviewViewModel,
    update: EffectSizeViewModel[] => void,
};

function EffectSizes(props: EffectSizesProps) {
    const review = props.model;
    const effectSizesMap = delimIndexBy(
        review.effect_sizes,
        ['exposure_id', 'outcome_id', 'moderator_id'],
        ':'
    );
    const effectSizes = [];
    review.exposures.forEach(exposure => {
        review.outcomes.forEach(outcome => {
            review.moderators.forEach(moderator => {
                const key  = [
                    exposure.exposure_id,
                    outcome.outcome_id,
                    moderator.moderator_id,
                ].join(':');
                if (effectSizesMap[key]) {
                    effectSizes.push(effectSizesMap[key]);
                } else {
                    effectSizes.push(blankEffectSizeViewModel(
                        exposure.exposure_id,
                        outcome.outcome_id,
                        moderator.moderator_id
                    ));
                }
            });
        });
    });

    return (
        <section>
            {effectSizes.map((effectSize, idx) =>
                <EffectSize
                    key={idx}
                    idx={idx}
                    model={effectSize}
                    update={()=>{}}
                />
            )}
        </section>
    );
}

type EffectSizeProps = {
    model: EffectSize,
    update: EffectSize => void,
    idx: number,
};

function EffectSize(props: EffectSizeProps) {
    function inputProps(field) {
        return {
            label: labels['label_effect_size_' + field],
            value: props.model[field],
            update: val => {
                props.update({
                    ...props.model,
                    [field]: val
                }, props.idx);
            },
        };
    }

    return (
        <section>
            <h3>{labels.heading_benefit_and_risk_analysis}</h3>
            <Input {...inputProps('team_narrative_summary')} />
            <Input {...inputProps('value')} />
            <Input {...inputProps('value_lower_bound')} />
            <Input {...inputProps('value_upper_bound')} />
            <Input {...inputProps('p_value')} />
            <Input {...inputProps('statistical_test')} />
            <Input {...inputProps('comments')} />
        </section>
    );
}

function AddButton(props) {
    return <button onClick={props.onClick}>{props.children}</button>;
}

function RemoveButton(props) {
    return <button onClick={props.onClick}>{props.children}</button>;
}

function Input({label, value, update}) {
    function onChange(e) {
        update(e.target.value);
    }
    return (
        <div>
            <label>
                {label}
                <input value={value} onChange={onChange}/>
            </label>
        </div>
    );
}

function Checkbox({label, value, update}) {
    function onChange(e) {
        update(!!e.target.checked);
    }
    return (
        <div>
            <label>
                {label}
                <input type="checkbox" value={value} onChange={onChange}/>
            </label>
        </div>
    );
}
