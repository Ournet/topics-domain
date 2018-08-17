import {
    Repository, RepositoryAccessOptions,
} from '@ournet/domain';

import { Topic } from './topic';
import { Locale } from './helpers';

export interface TopicWikiId extends Locale {
    wikiId: string
}

export interface TopicRepository extends Repository<Topic> {
    getByWikiIds(wikiIds: TopicWikiId[], options?: RepositoryAccessOptions<Topic>): Promise<Topic[]>
}
