
import test from 'ava';
import { TopicHelper } from './topic-helper';



test('createSlug (short)', t => {
    t.is(TopicHelper.createSlug('Some topic Name'), 'some-topic-name');
    t.is(TopicHelper.createSlug('AMN_23'), 'amn-23');
    t.is(TopicHelper.createSlug('234 a'), '234-a');
    t.is(TopicHelper.createSlug('   ` a name '), 'a-name');
})

test('createSlug (too long)', t => {
    t.is(TopicHelper.createSlug('Some topic Some topic Some topic Some topic Some topic Some topic'),
        'some-topic-some-topic-some-65to');
    t.is(TopicHelper.createSlug('Some topic Some topic Some topic Some topic Some topic Some topic Some topic Some topic Some topic Some topic'),
        'some-topic-some-topic-some-10to');

    t.is(TopicHelper.createSlug('Ministerul Afacerilor Interne al Romaniei'),
        'ministerul-afacerilor-interne-41ro');
    t.is(TopicHelper.createSlug('Ministerul Afacerilor Interne al Italiei'),
        'ministerul-afacerilor-interne-40it');

    t.is(TopicHelper.createSlug('Ministerul Afacerilor Interne al Rugandei'),
        'ministerul-afacerilor-interne-41ru');
})

test('createSlug (Russian)', t => {
    t.is(TopicHelper.createSlug('Молдавия'), 'moldaviya');
    t.is(TopicHelper.createSlug('Додон, Игорь Николаевич'), 'dodon-igor-nikolaevich');
})
