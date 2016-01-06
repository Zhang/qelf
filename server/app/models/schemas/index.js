'use strict';

const Joi = require('joi');
const AccountSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  name: Joi.string().required(),
  facebookId: Joi.string().required(),
  accessToken: Joi.string().required(),
  friends: Joi.array().items(Joi.string().description('id of other account objects')).required(),
  traits: Joi.array().items(Joi.string()).required().description('Array of strings that correspond to the id of trait objects'),
  profilePicture: Joi.string().required().description('profile picture url'),
  walkthroughComplete: Joi.boolean().required()
});

const VoteSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  traitTemplateId: Joi.string().required(),
  contestants: Joi.array(Joi.string().description('facebookId of contestant').required()).required(),
  comparison: Joi.string().required(),
  selected: Joi.string().required().allow(null),
  comment: Joi.string().required().allow(null),
  voterId: Joi.string().required()
});

const CompletedVotesSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  complete: Joi.array().items(VoteSchema).required().description('an array of vote objects'),
  facebookId: Joi.string().required()
});

const FeedbackSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  text: Joi.string().required(),
  facebookId: Joi.string().required(),
  email: Joi.string().required().allow('')
});

const TraitSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  templateId: Joi.string().required(),
  categories: Joi.array().required().items(Joi.string()).description('An array of categories that the trait fits into'),
  count: Joi.number().required(),
  total: Joi.array().required().items(Joi.string()).description('An array of vote ids corresponding to completed votes')
});

const TraitTemplateSchema = Joi.object().keys({
  _id: Joi.string(),
  id: Joi.string().required(),
  comparisons: Joi.array().required().items(Joi.string().required()),
  categories: Joi.array().required()
});

module.exports = {
  account: AccountSchema,
  completedVotes: CompletedVotesSchema,
  feedback: FeedbackSchema,
  trait: TraitSchema,
  traitTemplate: TraitTemplateSchema,
  vote: VoteSchema
};
