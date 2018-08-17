import { Dictionary } from "@ournet/domain";

export type TopicType = 'PLACE' | 'ORG' | 'PERSON' | 'WORK'

export interface Topic {
    id: string
    lang: string
    country: string

    wikiId?: string

    name: string
    commonName?: string
    englishName?: string
    abbr?: string
    type?: TopicType

    description?: string
    about?: string

    /**
     * Inticates if a topic is active or not. For a person - is alive or dead, etc.
     */
    isActive?: boolean

    createdAt: string
    updatedAt?: string
}

export interface BuildTopicParams {
    lang: string
    country: string

    name: string
    type?: TopicType
    description?: string
    englishName?: string
    commonName?: string
    abbr?: string

    wikiData?: WikiData

    createdAt?: string
}

export interface WikiData {
    id: string
    name?: string
    wikiPageTitle?: string
    about?: string
    data?: Dictionary<string[]>
}
