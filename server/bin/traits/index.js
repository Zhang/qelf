'use strict';

const _ = require('lodash');
const traitTemplateModel = require('../../app/models/traitTemplate');

const CATEGORIES = {
  happiness: 'Traits predicting happiness (According to: UPenn Study by Kaufman)',
  likeability: 'Traits predicting likability (According to: Norman Anderson Study)',
  likeHangingOutWith: 'Why people enjoy hanging out with you',
  leadership: 'Traits related to leadership (According to: Cattell leadership potential equation)'
};
//Friendship related things
//Personal related things
//Professional related things
//Curiosity driven things

//Someone that people want to reach out to and hang out with -
//This person is easy to invite to events, I think of this person when I want to invite them to things
//This person is
//I like being around this person
//

//Are you someone that is predispositioned to be happy?
//Happiness
//Calmness, and unpreterbability
//Enjoys things
//Positivity
//Gratitude + love of learning (AHHH - Are you predispositioned towards happiness according to xyz)

//What do people look up to you for?
//Smarts
//Charm
//Success

//What composes likeability (aboutpeople.com)
//General likability
//Relevance
//Empathy
//Realness

//What do people like about hanging out with you
//You make things happen
//You are someone that is fun to hang out with

const defaults = [
  //Personal Improvement
  {
    id: 'Kindness',
    comparisons: ['Who is more kind?']
  },
  {
    id: 'Thoughtfulness',
    comparisons: ['Who is more thoughtful?'],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Enthusiastic',
    comparisons: [
      'Who is more enthusiastic?',
      'Who might you describe as more eager and interested in events in their lives?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Intuitiveness',
    comparisons: [
      'Who would you consider as being more intuitive?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Charasmatic',
    comparisons: [
      'Who would you consider as being more charismatic?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Emotionally Stable',
    comparisons: [
      'Who would you consider as being more emotionally stable?',
      'Who would you consider as being even-tempered?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Self Assurance',
    comparisons: [
      'Who is more confident?',
      'Who would you consider to have less need for approval?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Positivity',
    comparisons: ['Who would you consider to have a more positive attitude?']
  },
  {
    id: 'Dominance',
    comparisons: [
      'Who would you consider as more dominant?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Love of Learning',
    comparisons: ['Who displays a greater love of learning'],
    categories: [CATEGORIES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: ['Who do you consider more sincere?'],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: ['Who do you consider to be more honest?'],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Loyalty (as a friend)',
    comparisons: ['Who would you consider to be a more loyal friend?'],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Gratitude',
    comparisons: ['Who shows their gratitude most frequently'],
    categories: [CATEGORIES.happiness]
  },
  {
    id: 'Happiness',
    comparisons: ['Who would you consider to be a happier person?'],
    categories: [CATEGORIES.happiness]
  },
  {
    id: 'Successful',
    comparisons: ['Who do you consider to be more successful?']
  },
  {
    id: 'Calm',
    comparisons: ['Who would you consider more calm?']
  },
  {
    id: 'Trustworthy',
    comparisons: ['Who do you trust more?'],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Social Boldness',
    comparisons: [
      'Who do you believe is less effected by shame or rejection in social situations?',
      'Who would you consider to be more socially bold?',
      'Who would you consider to be more thick skinned?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Inspiring',
    comparisons: ['I find this person to be more inspiring'],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Patience (towards friends)',
    comparisons: ['Who is more patient with you?']
  },
  {
    id: 'Likable',
    comparisons: ['Who do you like more?'],
    categories: [CATEGORIES.likeHangingOutWith, CATEGORIES.likeability]
  },
  {
    id: 'Comfortable to be around',
    comparisons: ['Who makes you feel more comfortable to be around?'],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Fun',
    comparisons: ['Who is more fun to spend time with?'],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Reliability',
    comparisons: ['Who is more reliable?']
  },
  {
    id: 'True to their word',
    comparisons: ['This person is likely to keep a promise they make to you?']
  },
  {
    id: 'Empathy',
    comparisons: ['Who would you consider to be more empathetic?'],
    categories: [CATEGORIES.likeability, CATEGORIES.leadership]
  },
  {
    id: 'Conscientiousness',
    comparisons: [
      'Who would you consider to have a high standards for themselves?',
      'Who would you consider to be thorough, someone who follows through with what they start?'
    ],
    categories: [CATEGORIES.leadership]
  }
];

module.exports = {
  defaultTraits: defaults,
  addDefault: function* () {
    yield _.map(defaults, function(trait) {
      if (!trait.categories) {
        trait.categories = [];
      }
      return traitTemplateModel.addOrUpdate(trait);
    });
  }
};
