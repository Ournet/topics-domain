import { BuildTopicParams, Topic } from "./topic";
import { slugify } from 'transliteration';
import { Locale } from "./helpers";
import { clearText } from '@ournet/domain';

export class TopicHelper {
    static build(params: BuildTopicParams) {
        const name = params.name;
        const names = [params.name || params.commonName ||
            params.wikiData && params.wikiData.wikiPageTitle || '',
        params.abbr || '', params.englishName || '']
            .filter(item => !!item && item.length > 2 && !/,\(/.test(item));

        const id = TopicHelper.createId(names[0] || name, params);

        const topic: Topic = {
            id,
            name,
            lang: params.lang,
            country: params.country,
            createdAt: params.createdAt || new Date().toISOString(),
        };

        if (params.commonName) {
            topic.commonName = params.commonName;
        }
        if (params.abbr) {
            topic.abbr = params.abbr;
        }
        if (params.englishName) {
            topic.englishName = params.englishName;
        }
        if (params.description) {
            topic.description = params.description;
        }
        if (params.type) {
            topic.type = params.type;
        }


        if (params.wikiData) {
            topic.wikiId = params.wikiData.id;
            if (params.wikiData.about) {
                topic.about = params.wikiData.about;
            }
            const data = params.wikiData.data;
            if (data) {
                // deth date
                if (data['P570'] && data['P570'].length) {
                    topic.isActive = false;
                }
                // barth date
                else if (data['P569'] && data['P569'].length) {
                    const date = data['P569'][0];
                    const year = parseInt(date.substr(0, 4))
                    if (year < new Date().getFullYear() - 100) {
                        topic.isActive = false;
                    }
                }
            }
        }

        return topic;
    }

    static createId(name: string, locale: Locale) {
        const localeId = TopicHelper.formatIdLocale(locale);
        const slug = TopicHelper.createSlug(name);

        return `${localeId}${slug}`;
    }

    static createSlug(name: string) {
        name = clearText(name.toLowerCase());
        let slug = slugify(name);
        const maxLength = 36;
        let numberPart = '';
        if (slug.length > maxLength) {
            numberPart = '-' + name.length;
            if (numberPart.length > 3) {
                numberPart = numberPart.substr(0, 3);
            }
            const slugWords = slug.split(/-+/g).filter((item, i) => i < 2 || item.length > 2);
            numberPart += slugWords[slugWords.length - 1].substr(0, 2);
            let slugLength = 0;
            let slugFirstWords = 0;
            for (let i = 0; i < slugWords.length && slugLength + numberPart.length + slugWords[i].length < maxLength; i++) {
                slugLength += slugFirstWords + slugWords[i].length;
                slugFirstWords++;
            }
            slug = slugWords.splice(0, slugFirstWords).join('-');
        }

        return `${slug}${numberPart}`;
    }

    static formatIdFromSlug(slug: string, locale: Locale) {
        return `${TopicHelper.formatIdLocale(locale)}${slug}`;
    }

    static parseSlugFromId(id: string) {
        return id.substr(4);
    }

    static formatIdLocale(locale: Locale) {
        return `${locale.country.toLowerCase()}${locale.lang.toLowerCase()}`;
    }
    static parseLocaleFromId(id: string): Locale {
        return {
            country: id.substr(0, 2),
            lang: id.substr(2, 2),
        };
    }
}
