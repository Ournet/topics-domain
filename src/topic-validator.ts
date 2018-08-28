import { EntityValidator, Joi } from "@ournet/domain";
import { Topic } from "./topic";

export class TopicValidator extends EntityValidator<Topic> {
    constructor() {
        super({ createSchema, updateSchema });
    }
}

const schema = {
    id: Joi.string().regex(/^[a-z0-9-]{6,40}$/),
    lang: Joi.string().regex(/^[a-z]{2}$/),
    country: Joi.string().regex(/^[a-z]{2}$/),

    wikiId: Joi.string().regex(/^Q\d+$/),

    name: Joi.string().trim().min(2).max(200),
    commonName: Joi.string().trim().min(2).max(200),
    englishName: Joi.string().trim().min(2).max(200),
    abbr: Joi.string().trim().min(2).max(50),
    type: Joi.string().valid(['PERSON', 'PLACE', 'ORG', 'WORK', 'EVENT']),

    description: Joi.string().trim().max(100).truncate(),
    about: Joi.string().trim().max(250).truncate(),

    isActive: Joi.boolean(),

    updatedAt: Joi.string().isoDate(),
    createdAt: Joi.string().isoDate(),
};

const createSchema = Joi.object().keys({
    id: schema.id.required(),
    lang: schema.lang.required(),
    country: schema.country.required(),

    wikiId: schema.wikiId,

    name: schema.name.required(),
    commonName: schema.commonName,
    englishName: schema.englishName,
    abbr: schema.abbr,
    type: schema.type,

    description: schema.description,
    about: schema.about,

    isActive: schema.isActive,

    updatedAt: schema.updatedAt,
    createdAt: schema.createdAt,
}).required();

const updateSchema = Joi.object().keys({
    id: schema.id.required(),
    set: Joi.object().keys({
        wikiId: schema.wikiId,
        name: schema.name,
        commonName: schema.commonName,
        englishName: schema.englishName,
        abbr: schema.abbr,
        type: schema.type,
        description: schema.description,
        about: schema.about,
        isActive: schema.isActive,
        updatedAt: schema.updatedAt,
    }),
    delete: Joi.array().items(Joi.string().valid(['wikiId', 'commonName', 'englishName', 'abbr', 'type', 'description', 'about', 'isActive'])),
}).or('set', 'delete').required();
