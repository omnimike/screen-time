// @flow

import React from 'react';
import labels from './labels';
import { delimIndexBy, jsonClone } from './utils';
import { PrimaryButton, SecondaryButton } from './components';
import type {
    Review,
    Exposure,
    Outcome,
    Moderator,
    EffectSize,
    ReviewValidationErrors,
    ExposureValidationErrors,
    OutcomeValidationErrors,
    ModeratorValidationErrors,
    EffectSizeValidationErrors,
} from './models';
import {
    blankReview,
    blankExposure,
    blankOutcome,
    blankModerator,
    blankEffectSize,
    validateReview,
    effectSizeValidator,
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
    keyHandler: Function;

    constructor(props: {model: Review, update: (Review) => void}) {
        super(props);
        this.state = {
            model: props.model || blankReview(),
            message: null,
            validationErrors: null
        };
        this.update = this.update.bind(this);
        this.onSave = this.onSave.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keypress', this.keyHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.keyHandler);
    }

    keyHandler(evt: SyntheticKeyboardEvent) {
        if (evt.ctrlKey && evt.key === 'A') {
            evt.preventDefault();
            this.fillBlanks();
        } else if (evt.ctrlKey && evt.key === 's') {
            evt.preventDefault();
            this.save();
        }
    }

    fillBlanks() {
        const review = jsonClone(this.state.model);
        fillBlanks(review, 'na');
        this.setState({
            model: review
        });
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
        evt.preventDefault();
        this.save();
    }

    save() {
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
    }

    setValidationErrors(errors: ReviewValidationErrors) {
        this.setMessage('error', labels.message_validation_error);
        this.setState({validationErrors: errors});
    }

    render() {
        const model = this.state.model;
        const errors = this.state.validationErrors;
        return (
            <form className="review-view">
                <AlertView message={this.state.message} />
                <ReviewDetailsView
                    model={model}
                    errors={errors}
                    update={this.update}
                />
                <ExposuresView
                    model={model.exposures}
                    errors={errors && errors.exposures || null}
                    update={val =>
                        this.update({
                            ...model,
                            exposures: val,
                        })
                    }
                />
                <OutcomesView
                    model={model.outcomes}
                    errors={errors && errors.outcomes || null}
                    update={val =>
                        this.update({
                            ...model,
                            outcomes: val,
                        })
                    }
                />
                <ModeratorsView
                    model={model.moderators}
                    errors={errors && errors.moderators || null}
                    update={val =>
                        this.update({
                            ...model,
                            moderators: val,
                        })
                    }
                />
                <EffectSizesView
                    model={model}
                    errors={errors && errors.effect_sizes || null}
                    update={val =>
                        this.update({
                            ...model,
                            effect_sizes: val,
                        })
                    }
                />
                <PrimaryButton onClick={this.onSave}>
                    {labels.button_save}
                </PrimaryButton>
            </form>
        );
    }
}

function fillBlanks(obj: Object, filler: string): void {
    for (const key in obj) {
        if (obj[key] === '') {
            obj[key] = filler;
        } else if (Array.isArray(obj[key])) {
            for (const elem of obj[key]) {
                fillBlanks(elem, filler);
            }
        }
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
        <div className={`alert-view alert ${cls}`} role="alert">
            {text}
        </div>
    );
}

type SectionProps<ViewModelType, ValidationErrorType> = {
    model: ViewModelType,
    errors: ValidationErrorType | null,
    update: (ViewModelType) => void,
};

type SubItemProps<ViewModelType, ValidationErrorType> = {
    model: ViewModelType,
    errors: ValidationErrorType | null,
    update: (ViewModelType, number) => void,
    remove: (SyntheticInputEvent) => void,
    idx: number,
};

function ReviewDetailsView(props: SectionProps<Review, ReviewValidationErrors>) {
    function inputProps(field) {
        return {
            label: labels['label_review_' + field],
            value: props.model[field],
            error: field !== 'are_you_sure' ? (props.errors ? props.errors[field] : '') : '',
            update: val => {
                props.update({
                    ...props.model,
                    [field]: val
                });
            },
        };
    }

    return (
        <div className="container-fluid">
            <h3>{labels.heading_review_details}</h3>
            <div className="row">
                <Input
                    inputClass="short-input"
                    {...inputProps('extractor_name')}
                />
                <Input
                    inputClass="date-input"
                    {...inputProps('extraction_date')}
                />
                <Input
                    inputClass="short-input"
                    {...inputProps('first_author')}
                />
                <Input
                    inputClass="year-input"
                    {...inputProps('year_of_publication')}
                />
            </div>
            <div className="row">
                <Textarea
                    className="col-6"
                    inputClass="textarea-tall"
                    {...inputProps('search_strategy_desc')}
                />
                <div className="col-6">
                    <div className="row">
                        <Input
                            className="col-6"
                            inputClass="year-input"
                            {...inputProps('earliest_publication_year')}
                        />
                        <Input
                            className="col-6"
                            inputClass="year-input"
                            {...inputProps('latest_publication_year')}
                        />
                    </div>
                    <div className="row">
                        <Input
                            className="col-6"
                            inputClass="number-input"
                            {...inputProps('number_of_studies')}
                        />
                        <Input
                            className="col-6"
                            inputClass="number-input"
                            {...inputProps('number_of_samples')}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <Textarea
                    className="col-6"
                    inputClass="textarea-short"
                    {...inputProps('sample_age_desc')}
                />
                <Input
                    className="col-3"
                    inputClass="number-input"
                    {...inputProps('sample_age_lowest_mean')}
                />
                <Input
                    className="col-3"
                    inputClass="number-input"
                    {...inputProps('sample_age_highest_mean')}
                />
            </div>
            <div className="row">
                <Textarea
                    className="col-6"
                    inputClass="textarea-short"
                    {...inputProps('inclusion_exclusion_concerns')}
                />
                <Checkbox
                    className="col-6 align-self-center"
                    {...inputProps('are_you_sure')}
                />
            </div>
            <div className="row">
                <Input
                    className="col-2"
                    inputClass="number-input"
                    {...inputProps('rating_of_low_risk_bias')}
                />
                <Input
                    className="col-2"
                    inputClass="number-input"
                    {...inputProps('rating_of_moderate_risk_bias')}
                />
                <Input
                    className="col-2"
                    inputClass="number-input"
                    {...inputProps('rating_of_high_risk_bias')}
                />
                <Textarea
                    className="col-3"
                    inputClass="textarea-short"
                    {...inputProps('bias_rating_system')}
                />
                <Textarea
                    className="col-3"
                    inputClass="textarea-short"
                    {...inputProps('bias_rating_system_reference')}
                />
            </div>
            <div className="row">
                <Textarea
                    className="col-4"
                    inputClass="textarea-tall"
                    {...inputProps('level_of_evidence_judgement_1')}
                />
                <Textarea
                    className="col-4"
                    inputClass="textarea-tall"
                    {...inputProps('level_of_evidence_judgement_2')}
                />
                <Textarea
                    className="col-4"
                    inputClass="textarea-tall"
                    {...inputProps('level_of_evidence_judgement_3')}
                />
            </div>
            <div className="row">
                <Textarea
                    className="col-6"
                    inputClass="textarea-tall"
                    {...inputProps('notes')}
                />
            </div>
        </div>
    );
}

function ExposuresView(props: SectionProps<Exposure[], ExposureValidationErrors[]>) {
    function update(model: Exposure, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create(evt) {
        evt.preventDefault();
        const newArr = props.model.slice();
        newArr.push(blankExposure());
        props.update(newArr);
    }
    function remove(idx: number) {
        return (evt) => {
            evt.preventDefault();
            const newArr = props.model.slice();
            newArr.splice(idx, 1);
            props.update(newArr);
        };
    }
    return (
        <section>
            <h3>{labels.heading_exposures}</h3>
            {props.model.map((exposure, i) =>
                <ExposureView
                    key={i}
                    idx={i}
                    model={exposure}
                    errors={props.errors && props.errors[i]}
                    update={update}
                    remove={remove(i)}
                />
            )}
            <SecondaryButton onClick={create}>
                {labels.button_exposure_add}
            </SecondaryButton>
        </section>
    );
}

function ExposureView(props: SubItemProps<Exposure, ExposureValidationErrors>) {
    function inputProps(field) {
        return {
            className: 'col-2',
            inputClass: 'autofill-input',
            label: labels['label_exposure_' + field],
            value: props.model[field],
            error: props.errors && props.errors[field],
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
            <h4>
                <DeleteButton
                    onClick={props.remove}
                    title={labels.title_exposure_remove}
                />
                {labels.heading_exposure} {props.idx + 1}
            </h4>
            <div className="row">
                <Input {...inputProps('content_specifics')} />
                <Input {...inputProps('content_category')} />
                <Input {...inputProps('measure')} />
                <Input {...inputProps('measure_type')} />
                <Input {...inputProps('setting')} />
                <Input {...inputProps('setting_category')} />
            </div>
            <div className="row">
                <Input {...inputProps('device_type')} />
                <Input {...inputProps('device_category')} />
                <Input {...inputProps('device_portability')} />
                <Input {...inputProps('social_environment_specific')} />
                <Input {...inputProps('social_environment_general')} />
            </div>
        </section>
    );
}

function DeleteButton({onClick, title}) {
    return (
        <span className="d-inline-block align-bottom">
            <button
                type="button"
                className="close"
                title={title}
                onClick={onClick}
            >
                {labels.button_remove_icon}
            </button>
        </span>
    );
}

function OutcomesView(props: SectionProps<Outcome[], OutcomeValidationErrors[]>) {
    function update(model: Outcome, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create(evt) {
        evt.preventDefault();
        const newArr = props.model.slice();
        newArr.push(blankOutcome());
        props.update(newArr);
    }
    function remove(idx: number) {
        return (evt) => {
            evt.preventDefault();
            const newArr = props.model.slice();
            newArr.splice(idx, 1);
            props.update(newArr);
        };
    }
    return (
        <section>
            <h3>{labels.heading_outcomes}</h3>
            {props.model.map((model, i) =>
                <OutcomeView
                    key={i}
                    idx={i}
                    model={model}
                    errors={props.errors && props.errors[i]}
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

function OutcomeView(props: SubItemProps<Outcome, OutcomeValidationErrors>) {
    function inputProps(field) {
        return {
            className: 'col-2',
            inputClass: 'autofill-input',
            label: labels['label_outcome_' + field],
            value: props.model[field],
            error: props.errors && props.errors[field],
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
            <h4>
                <DeleteButton
                    onClick={props.remove}
                    title={labels.title_outcome_remove}
                />
                {labels.heading_outcome} {props.idx + 1}
            </h4>
            <div className="row">
                <Input {...inputProps('measure')} />
                <Input {...inputProps('measure_type')} />
                <Input {...inputProps('category')} />
                <Input {...inputProps('specific_variable')} />
                <Input {...inputProps('higher_order_variable')} />
            </div>
        </section>
    );
}

function ModeratorsView(props: SectionProps<Moderator[], ModeratorValidationErrors[]>) {
    function update(model: Moderator, i: number) {
        const newArr = props.model.slice();
        newArr[i] = model;
        props.update(newArr);
    }
    function create(evt) {
        evt.preventDefault();
        const newArr = props.model.slice();
        newArr.push(blankModerator());
        props.update(newArr);
    }
    function remove(idx: number) {
        return (evt) => {
            evt.preventDefault();
            const newArr = props.model.slice();
            newArr.splice(idx, 1);
            props.update(newArr);
        };
    }
    return (
        <section>
            <h3>{labels.heading_moderators}</h3>
            {props.model.map((model, i) =>
                <ModeratorView
                    key={i}
                    idx={i}
                    model={model}
                    errors={props.errors && props.errors[i]}
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

function ModeratorView(props: SubItemProps<Moderator, ModeratorValidationErrors>) {
    function inputProps(field) {
        return {
            className: 'col-2',
            inputClass: 'autofill-input',
            label: labels['label_moderator_' + field],
            value: props.model[field],
            error: props.errors && props.errors[field],
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
            <h4>
                <DeleteButton
                    onClick={props.remove}
                    title={labels.title_moderator_remove}
                />
                {labels.heading_moderator} {props.idx + 1}
            </h4>
            <div className="row">
                <Input {...inputProps('level')} />
                <Input {...inputProps('category')} />
            </div>
        </section>
    );
}

type EffectSizesProps = {
    model: Review,
    errors: EffectSizeValidationErrors[] | null,
    update: EffectSize[] => void,
};

function EffectSizesView(props: EffectSizesProps) {
    const review = props.model;
    const errors = props.errors;
    const idxMapping = {};
    review.effect_sizes.forEach((effectSize, i) => {
        const key = [
            effectSize.exposure_id,
            effectSize.outcome_id,
            effectSize.moderator_id
        ].join(':');
        idxMapping[key] = i;
    });
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
                        errors: errors && errors[idxMapping[key]] || null,
                        displayName: effectSizeDisplayName(
                            exposure,
                            outcome,
                            moderator,
                        ),
                    });
                } else {
                    const newEffectSize = blankEffectSize(
                        exposure.id,
                        outcome.id,
                        moderator.id
                    );
                    visibleEffectSizes.push({
                        effectSize: newEffectSize,
                        errors: effectSizeValidator(newEffectSize),
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
            {visibleEffectSizes.map(({effectSize, errors, displayName}, idx) =>
                <EffectSizeView
                    key={idx}
                    model={effectSize}
                    errors={errors}
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
    errors: EffectSizeValidationErrors | null,
    displayName: string,
    update: EffectSize => void,
};

function EffectSizeView(props: EffectSizeProps) {
    function inputProps(field) {
        return {
            label: labels['label_effect_size_' + field],
            value: props.model[field],
            error: props.errors && props.errors[field],
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
            <div className="row">
                <Textarea
                    className="col-4"
                    inputClass="textarea-x-tall"
                    {...inputProps('team_narrative_summary')}
                />
                <div className="col-8">
                    <div className="row">
                        <Input
                            className="col-2"
                            inputClass="number-input"
                            {...inputProps('value')}
                        />
                        <Input
                            className="col-2"
                            inputClass="number-input"
                            {...inputProps('value_lower_bound')}
                        />
                        <Input
                            className="col-2"
                            inputClass="number-input"
                            {...inputProps('value_upper_bound')}
                        />
                        <Input
                            className="col-2"
                            inputClass="number-input"
                            {...inputProps('p_value')}
                        />
                        <Input
                            className="col-3"
                            inputClass="autofill-input"
                            {...inputProps('statistical_test')}
                        />
                    </div>
                    <div className="row">
                        <Textarea
                            className="col-10"
                            inputClass="textarea-short"
                            {...inputProps('comments')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function Input({
    label,
    value,
    update,
    error,
    className='col-sm',
    inputClass=''
}) {
    function onChange(e) {
        update(e.target.value);
    }
    const errorClass = error ? 'is-invalid' : '';
    const errorMessage = validationMessage(error);
    return (
        <div className={className}>
            <label>
                <div>{label}</div>
                <input
                    className={'form-control ' + errorClass + ' ' + inputClass}
                    title={errorMessage}
                    value={value}
                    onChange={onChange}
                />
            </label>
        </div>
    );
}

function Textarea({
    label,
    value,
    update,
    error,
    className='col-sm-12',
    inputClass=''
}) {
    function onChange(e) {
        update(e.target.value);
    }
    const errorClass = error ? 'is-invalid' : '';
    const errorMessage = validationMessage(error);
    return (
        <div className={className}>
            <label>
                <div>{label}</div>
                <textarea
                    className={'form-control ' + errorClass + ' ' + inputClass}
                    title={errorMessage}
                    value={value}
                    onChange={onChange}
                />
            </label>
        </div>
    );
}

function Checkbox({label, value, update, className}) {
    function onChange(e) {
        update(!!e.target.checked);
    }
    return (
        <div className={className}>
            <label>
                <input type="checkbox" value={value} onChange={onChange}/>
                {' '}
                {label}
            </label>
        </div>
    );
}

function validationMessage(error) {
    if (error) {
        return labels['validation_error_' + error];
    } else {
        return '';
    }
}
