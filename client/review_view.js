// @flow

import React from 'react';
import labels from './labels';
import { delimIndexBy } from './utils';
import { PrimaryButton, SecondaryButton, DangerButton } from './components';
import type {
    Review,
    Exposure,
    Outcome,
    Moderator,
    EffectSize,
    ReviewValidationErrors
} from './models';
import {
    blankReview,
    blankExposure,
    blankOutcome,
    blankModerator,
    blankEffectSize,
    validateReview
} from './models';

export type ReviewEditViewProps = {
    model: Review | null,
    onSave: Review => void,
};

type MessageType = 'success' | 'error';

type ReviewEditViewState = {
    model: Review,
    message: null | {type: MessageType, text: string},
    validationErrors: ReviewValidationErrors | null
};

export class ReviewEditView extends React.Component<
    void,
    ReviewEditViewProps,
    ReviewEditViewState
> {
    state: ReviewEditViewState;
    update: Function;
    onSave: Function;

    constructor(props: {model: Review, update: (Review) => void}) {
        super(props);
        this.state = {
            model: props.model || blankReview(),
            message: null,
            validationErrors: null
        };
        this.update = this.update.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    update(model: Review) {
        this.setState({model});
    }

    setMessage(type: MessageType, text: string) {
        this.setState({
            message: {
                type,
                text
            }
        });
    }

    onSave(evt: SyntheticInputEvent) {
        const review = this.state.model;
        const result = validateReview(review);

        if (result.isValid) {
            fetch('/reviews/' + review.id, {
                method: 'PUT',
                body: JSON.stringify(review),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.ok) {
                    this.props.onSave(review);
                    this.setMessage('success', labels.message_review_saved);
                } else {
                    this.setMessage('error', labels.message_review_error);
                }
                window.scrollTo(0, 0);
            });
        } else {
            this.setValidationErrors(result.errors);
        }
        evt.preventDefault();
    }

    setValidationErrors(errors: ReviewValidationErrors) {
        this.setMessage('error', labels.message_validation_error);
        this.setState({validationErrors: errors});
    }

    render() {
        const model = this.state.model;
        const errors = this.state.validationErrors;
        return (
            <form className="review-edit-view">
                <AlertView message={this.state.message} />
                <ReviewDetailsView
                    model={model}
                    errors={errors}
                    update={this.update}
                />
                <ExposuresView
                    model={model.exposures}
                    errors={errors}
                    update={val =>
                        this.update({
                            ...model,
                            exposures: val,
                        })
                    }
                />
                <OutcomesView
                    model={model.outcomes}
                    errors={errors}
                    update={val =>
                        this.update({
                            ...model,
                            outcomes: val,
                        })
                    }
                />
                <ModeratorsView
                    model={model.moderators}
                    errors={errors}
                    update={val =>
                        this.update({
                            ...model,
                            moderators: val,
                        })
                    }
                />
                <EffectSizesView
                    model={model}
                    errors={errors}
                    update={val =>
                        this.update({
                            ...model,
                            effect_sizes: val,
                        })
                    }
                />
                <PrimaryButton onClick={this.onSave}>{labels.button_save}</PrimaryButton>
            </form>
        );
    }
}


function AlertView({message}) {
    let cls = 'd-none';
    let text = '';
    if (message) {
        if (message.type === 'success') {
            cls = 'alert-success';
        } else if (message.type === 'error') {
            cls = 'alert-danger';
        }
        text = message.text;
    }
    return (
        <div className={`alert ${cls}`} role="alert">
            {text}
        </div>
    );
}

type SectionProps<ViewModelType> = {
    model: ViewModelType,
    errors: ReviewValidationErrors | null,
    update: (ViewModelType) => void,
};

type SubItemProps<ViewModelType> = {
    model: ViewModelType,
    update: (ViewModelType, number) => void,
    remove: () => void,
    idx: number,
};

function ReviewDetailsView(props: SectionProps<Review>) {
    function inputProps(field) {
        return {
            label: labels['label_review_' + field],
            value: props.model[field],
            errors: field !== 'are_you_sure' ? (props.errors !== null ? props.errors[field] : '') : '',
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
            <Input {...inputProps('rating_of_low_risk_bias')} />
            <Input {...inputProps('rating_of_moderate_risk_bias')} />
            <Input {...inputProps('rating_of_high_risk_bias')} />
            <Input {...inputProps('bias_rating_system')} />
            <Input {...inputProps('bias_rating_system_reference')} />
            <Input {...inputProps('level_of_evidence_judgement_1')} />
            <Input {...inputProps('level_of_evidence_judgement_2')} />
            <Input {...inputProps('level_of_evidence_judgement_3')} />
        </section>
    );
}

function ExposuresView(props: SectionProps<Exposure[]>) {
    function update(model: Exposure, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create() {
        const newArr = props.model.slice();
        newArr.push(blankExposure());
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
                <ExposureView
                    key={i}
                    idx={i}
                    model={exposure}
                    update={update}
                    remove={removeExposure(i)}
                />
            )}
            <SecondaryButton onClick={create}>
                {labels.button_exposure_add}
            </SecondaryButton>
        </section>
    );
}

function ExposureView(props: SubItemProps<Exposure>) {
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
            <DangerButton onClick={props.remove}>
                {labels.button_exposure_remove}
            </DangerButton>
        </section>
    );
}

function OutcomesView(props: SectionProps<Outcome[]>) {
    function update(model: Outcome, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create() {
        const newArr = props.model.slice();
        newArr.push(blankOutcome());
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
                <OutcomeView
                    key={i}
                    idx={i}
                    model={model}
                    update={update}
                    remove={remove(i)}
                />
            )}
            <SecondaryButton onClick={create}>
                {labels.button_outcome_add}
            </SecondaryButton>
        </section>
    );
}

function OutcomeView(props: SubItemProps<Outcome>) {
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
            <DangerButton onClick={props.remove}>
                {labels.button_outcome_remove}
            </DangerButton>
        </section>
    );
}

function ModeratorsView(props: SectionProps<Moderator[]>) {
    function update(model: Moderator, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create() {
        const newArr = props.model.slice();
        newArr.push(blankModerator());
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
                <ModeratorView
                    key={i}
                    idx={i}
                    model={model}
                    update={update}
                    remove={remove(i)}
                />
            )}
            <SecondaryButton onClick={create}>
                {labels.button_moderator_add}
            </SecondaryButton>
        </section>
    );
}

function ModeratorView(props: SubItemProps<Moderator>) {
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
            <DangerButton onClick={props.remove}>
                {labels.button_moderator_remove}
            </DangerButton>
        </section>
    );
}

type EffectSizesProps = {
    model: Review,
    update: EffectSize[] => void,
};

function EffectSizesView(props: EffectSizesProps) {
    const review = props.model;
    const effectSizesMap = delimIndexBy(
        review.effect_sizes,
        ['exposure_id', 'outcome_id', 'moderator_id'],
        ':'
    );
    const visibleEffectSizes = [];
    review.exposures.forEach(exposure => {
        review.outcomes.forEach(outcome => {
            review.moderators.forEach(moderator => {
                const key = [
                    exposure.id,
                    outcome.id,
                    moderator.id,
                ].join(':');
                if (effectSizesMap[key]) {
                    visibleEffectSizes.push({
                        effectSize: effectSizesMap[key],
                        displayName: effectSizeDisplayName(
                            exposure,
                            outcome,
                            moderator,
                        ),
                    });
                } else {
                    visibleEffectSizes.push({
                        effectSize: blankEffectSize(
                            exposure.id,
                            outcome.id,
                            moderator.id
                        ),
                        displayName: effectSizeDisplayName(
                            exposure,
                            outcome,
                            moderator,
                        ),
                    });
                }
            });
        });
    });
    function update(model: EffectSize) {
        const effectSizes = review.effect_sizes.slice();
        for (let i = 0; i < review.effect_sizes.length; i++) {
            const effectSize = review.effect_sizes[i];
            if (
                effectSize.exposure_id === model.exposure_id &&
                effectSize.outcome_id === model.outcome_id &&
                effectSize.moderator_id === model.moderator_id
            ) {
                effectSizes[i] = model;
                props.update(effectSizes);
                return;
            }
        }
        effectSizes.push(model);
        props.update(effectSizes);
    }

    return (
        <section>
            {visibleEffectSizes.map(({effectSize, displayName}, idx) =>
                <EffectSizeView
                    key={idx}
                    model={effectSize}
                    update={update}
                    displayName={displayName}
                />
            )}
        </section>
    );
}

function effectSizeDisplayName(
    exposure: Exposure,
    outcome: Outcome,
    moderator: Moderator
): string {
    return labels.subheading_effect_size_for + ' ' +
        labels.subheading_effect_size_exposure + ' ' +
        exposure.content_specifics + ' ' +
        labels.subheading_effect_size_outcome + ' ' +
        outcome.specific_variable + ' ' +
        labels.subheading_effect_size_moderator + ' ' +
        moderator.level;
}

type EffectSizeProps = {
    model: EffectSize,
    displayName: string,
    update: EffectSize => void,
};

function EffectSizeView(props: EffectSizeProps) {
    function inputProps(field) {
        return {
            label: labels['label_effect_size_' + field],
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
            <h3>{labels.heading_effect_size}</h3>
            <span className="effect-size-name">{props.displayName}</span>
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

function Input({label, value, update, errors}) {
    function onChange(e) {
        update(e.target.value);
    }
    const errorClass = errors && errors.length ? 'is-invalid' : '';
    return (
        <div>
            <label>
                <div>{label}</div>
                <input className={'long-input form-control ' + errorClass} value={value} onChange={onChange}/>
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
