
const debug = require('debug')('ournet:topics-domain');

import { BuildTopicParams, Topic } from "./topic";
import { TopicHelper } from "./topic-helper";
import { TopicWikiId, TopicRepository } from "./topic-repository";

export class SaveTopicsUseCase {
    constructor(private topicRep: TopicRepository) { }

    async execute(knownData: BuildTopicParams[]) {
        if (knownData.length === 0) {
            return [];
        }
        const freshTopics = knownData.map(TopicHelper.build);

        const knownNoWikiTopics: Topic[] = [];
        const knownWikiTopics: Topic[] = [];
        const topicsWikiIds: TopicWikiId[] = [];
        const topicsIds: string[] = [];

        freshTopics.forEach(item => {
            if (item.wikiId) {
                knownWikiTopics.push(item);
                topicsWikiIds.push({
                    lang: item.lang,
                    country: item.country,
                    wikiId: item.wikiId,
                });
            } else {
                knownNoWikiTopics.push(item);
                topicsIds.push(item.id);
            }
        });

        const tasks: Promise<Topic[]>[] = [];
        if (topicsWikiIds.length) {
            tasks.push(this.topicRep.getByWikiIds(topicsWikiIds));
        }
        if (topicsIds.length) {
            tasks.push(this.topicRep.getByIds(topicsIds));
        }

        if (tasks.length === 0) {
            return [];
        }

        const results = await Promise.all(tasks);

        let existingTopics = results[0];
        if (results.length > 1) {
            existingTopics = existingTopics.concat(results[1]);
        }

        return this.processTopics(freshTopics, existingTopics);
    }

    protected async processTopics(freshTopics: Topic[], existingTopics: Topic[]) {
        const minUpdateDate = new Date();
        minUpdateDate.setDate(minUpdateDate.getDate() - 7);
        const minUpdateStringDate = minUpdateDate.toISOString();

        const topics: Topic[] = [];

        for (const freshTopic of freshTopics) {
            const existingTopic = existingTopics.find(item => {
                if (freshTopic.wikiId) {
                    return item.wikiId === freshTopic.wikiId;
                }
                return item.id === freshTopic.id;
            });
            if (!existingTopic) {
                topics.push(await this.createTopic(freshTopic));
            } else {
                topics.push(await this.updateTopic(freshTopic, existingTopic, minUpdateStringDate));
            }
        }

        return topics;
    }

    protected createTopic(topic: Topic) {
        debug(`creating topic: ${topic.id}`);
        return this.topicRep.create(topic);
    }

    protected async updateTopic(freshTopic: Topic, existingTopic: Topic, minDate: string) {
        const refDate = existingTopic.updatedAt || existingTopic.createdAt;
        if (refDate > minDate) {
            return existingTopic;
        }

        const deleteFields: (keyof Topic)[] = [];
        const setFields: Partial<Topic> = {};
        let hasChanges = false;

        const updatableFields: (keyof Topic)[] = [
            'abbr',
            'about',
            'commonName',
            'description',
            'englishName',
            'isActive',
            'name',
            'type',
            'wikiId',
        ];

        for (const field of updatableFields) {
            if (freshTopic[field] !== existingTopic[field]) {
                hasChanges = true;
                if (freshTopic[field] === undefined) {
                    deleteFields.push(field);
                } else {
                    setFields[field] = freshTopic[field];
                }
            }
        }

        if (hasChanges) {
            debug(`updating topic: ${existingTopic.id}`);

            return this.topicRep.update({
                id: existingTopic.id,
                set: setFields,
                delete: deleteFields,
            });
        }

        return existingTopic;
    }
}
