
from sqlalchemy import \
    Table, \
    Column, \
    String, \
    Text, \
    Boolean, \
    MetaData, \
    ForeignKey, \
    create_engine

from config import db_path

engine = create_engine(db_path)

metadata = MetaData()

reviews_table = Table(
    'reviews',
    metadata,
    Column('id', String(50), primary_key=True),
    Column('extractor_name', String(255), nullable=False, default=''),
    Column('extractor_name', String(255), nullable=False, default=''),
    Column('extraction_date', String(255), nullable=False, default=''),
    Column('first_author', String(255), nullable=False, default=''),
    Column('year_of_publication', String(255), nullable=False, default=''),
    Column('search_strategy_desc', Text, nullable=False, default=''),
    Column('sample_age_desc', Text, nullable=False, default=''),
    Column('sample_age_lowest_mean', String(255), nullable=False, default=''),
    Column('sample_age_highest_mean', String(255), nullable=False, default=''),
    Column('are_you_sure', Boolean),
    Column('inclusion_exclusion_concerns', Text, nullable=False, default=''),
    Column('earliest_publication_year', String(255), nullable=False, default=''),
    Column('latest_publication_year', String(255), nullable=False, default=''),
    Column('number_of_studies', String(255), nullable=False, default=''),
    Column('number_of_samples', String(255), nullable=False, default=''),
    Column('rating_of_low_risk_bias', String(255), nullable=False, default=''),
    Column('rating_of_moderate_risk_bias', String(255), nullable=False, default=''),
    Column('rating_of_high_risk_bias', String(255), nullable=False, default=''),
    Column('bias_rating_system', String(255), nullable=False, default=''),
    Column('bias_rating_system_reference', String(255), nullable=False, default=''),
    Column('level_of_evidence_judgement_1', Text, nullable=False, default=''),
    Column('level_of_evidence_judgement_2', Text, nullable=False, default=''),
    Column('level_of_evidence_judgement_3', Text, nullable=False, default=''),
    Column('notes', Text, nullable=False, default=''),
)

exposures_table = Table(
    'exposures',
    metadata,
    Column('id', String(50), primary_key=True),
    Column('review_id', String(50), ForeignKey('reviews.id'), nullable=False),
    Column('content_specifics', String(255), nullable=False, default=''),
    Column('content_category', String(255), nullable=False, default=''),
    Column('measure', String(255), nullable=False, default=''),
    Column('measure_type', String(255), nullable=False, default=''),
    Column('device_type', String(255), nullable=False, default=''),
    Column('device_category', String(255), nullable=False, default=''),
    Column('device_portability', String(255), nullable=False, default=''),
    Column('setting', String(255), nullable=False, default=''),
    Column('setting_category', String(255), nullable=False, default=''),
    Column('social_environment_specific', String(255), nullable=False, default=''),
    Column('social_environment_general', String(255), nullable=False, default=''),
)

outcomes_table = Table(
    'outcomes',
    metadata,
    Column('id', String(50), primary_key=True),
    Column('review_id', String(50), ForeignKey('reviews.id')),
    Column('measure', String(255), nullable=False, default=''),
    Column('measure_type', String(255), nullable=False, default=''),
    Column('specific_variable', String(255), nullable=False, default=''),
    Column('higher_order_variable', String(255), nullable=False, default=''),
    Column('category', String(255), nullable=False, default=''),
)

moderators_table = Table(
    'moderators',
    metadata,
    Column('id', String(50), primary_key=True),
    Column('review_id', String(50), ForeignKey('reviews.id')),
    Column('level', String(255), nullable=False, default=''),
    Column('category', String(255), nullable=False, default=''),
)

effect_sizes_table = Table(
    'effect_sizes',
    metadata,
    Column('review_id', String(50), ForeignKey('reviews.id')),
    Column('exposure_id', String(50), ForeignKey('exposures.id')),
    Column('outcome_id', String(50), ForeignKey('outcomes.id')),
    Column('moderator_id', String(50), ForeignKey('moderators.id')),
    Column('team_narrative_summary', Text, nullable=False, default=''),
    Column('value', String(255), nullable=False, default=''),
    Column('value_lower_bound', String(255), nullable=False, default=''),
    Column('value_upper_bound', String(255), nullable=False, default=''),
    Column('p_value', String(255), nullable=False, default=''),
    Column('statistical_test', String(255), nullable=False, default=''),
    Column('comments', Text, nullable=False, default=''),
)
