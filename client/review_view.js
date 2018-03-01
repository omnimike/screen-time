// @flow

import React from 'react';
import labels from './labels';
import { delimIndexBy } from './utils';
import type {
    Review,
    Exposure,
    Outcome,
    Moderator,
    EffectSize
} from './models';
import {
    blankReview,
    blankExposure,
    blankOutcome,
    blankModerator,
    blankEffectSize
} from './models';

type ReviewEditViewProps = {
    model: Review | null,
    onSave: Review => void
};

type ReviewEditViewState = {
    model: Review,
    message: null | {type: 'success' | 'error', text: string}
};

export class ReviewEditView extends React.Component<
    void,
    ReviewEditViewProps,
    ReviewEditViewState
> {
    state: ReviewEditViewState;

    constructor(props: {model: Review, update: (Review) => void}) {
        super(props);
        this.state = {
            model: props.model || blankReview(),
            message: null
        };
        this.update.bind(this);
        this.onSave.bind(this);
    }

    update(model: Review) {
        this.setState({...this.state, model});
    }

    onSave() {
        this.props.onSave(this.state.model);
    }

    render() {
        const model = this.state.model;
        return (
            <div className="review-edit-view">
                <AlertView message={this.state.message} />
                <ReviewDetailsView
                    model={model}
                    update={this.update}
                />
                <ExposuresView
                    model={model.exposures}
                    update={val =>
                        this.update({
                            ...model,
                            exposures: val,
                        })
                    }
                />
                <OutcomesView
                    model={model.outcomes}
                    update={val =>
                        this.update({
                            ...model,
                            outcomes: val,
                        })
                    }
                />
                <ModeratorsView
                    model={model.moderators}
                    update={val =>
                        this.update({
                            ...model,
                            moderators: val,
                        })
                    }
                />
                <EffectSizesView
                    model={model}
                    update={val =>
                        this.update({
                            ...model,
                            effect_sizes: val,
                        })
                    }
                />
                <SaveButton onClick={this.onSave}>{labels.button_save}</SaveButton>
            </div>
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
            <AddButton onClick={create}>
                {labels.button_exposure_add}
            </AddButton>
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
            <RemoveButton onClick={props.remove}>
                {labels.button_exposure_remove}
            </RemoveButton>
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
            <AddButton onClick={create}>
                {labels.button_outcome_add}
            </AddButton>
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
            <RemoveButton onClick={props.remove}>
                {labels.button_outcome_remove}
            </RemoveButton>
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
            <AddButton onClick={create}>
                {labels.button_moderator_add}
            </AddButton>
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
            <RemoveButton onClick={props.remove}>
                {labels.button_moderator_remove}
            </RemoveButton>
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
                    visibleEffectSizes.push(effectSizesMap[key]);
                } else {
                    visibleEffectSizes.push(blankEffectSize(
                        exposure.id,
                        outcome.id,
                        moderator.id,
                        effectSizeDisplayName(exposure, outcome, moderator)
                    ));
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
            {visibleEffectSizes.map((effectSize, idx) =>
                <EffectSizeView
                    key={idx}
                    model={effectSize}
                    update={update}
                    displayName=''
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
    return exposure.content_specifics + ' ' +
        outcome.specific_variable + ' ' +
        moderator.level;
}

type EffectSizeProps = {
    model: EffectSize,
    displayName: string,
    update: EffectSize=> void
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
            <h4>{props.displayName}</h4>
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
    return <button className="btn btn-secondary" onClick={props.onClick}>{props.children}</button>;
}

function RemoveButton(props) {
    return <button className="btn btn-danger" onClick={props.onClick}>{props.children}</button>;
}

function Input({label, value, update}) {
    function onChange(e) {
        update(e.target.value);
    }
    return (
        <div>
            <label>
                <div>{label}</div>
                <input className="long-input" value={value} onChange={onChange}/>
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

function SaveButton(props) {
    return <button className="btn btn-primary" {...props}>{props.children}</button>;
}

