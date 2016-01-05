'use strict';

const _ = require('lodash');
const traitTemplateModel = require('../../app/models/traitTemplate');

const CATEGORIES = {
  happiness: 'Traits predicting happiness (According to: UPenn Study by Kaufman)',
  likeability: 'Traits predicting likability (According to: Norman Anderson Study)',
  likeHangingOutWith: 'Why people enjoy hanging out with you',
  leadership: 'Traits related to leadership (According to: Cattell leadership potential equation)',
  founder: 'Traits of being a good founder (According to Paul Graham + Y Combinator)',
  authenticity: 'Traits related to authenticity (According to UWash Study by Kernis and Goldman)'
};

//Trait names must fit into the sentence: "I scored really high in ___TRAIT___"
const defaults = [
  {
    id: 'Kindness',
    comparisons: [
      'Who do you think is more kind?'
    ]
  },
  {
    id: 'Thoughtfulness',
    comparisons: [
      'Who is more thoughtful?',
      'Who is more likely to keep your interests in mind?',
    ],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Enthusiasm',
    comparisons: [
      'Who is more energetic?',
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
    id: 'Charisma',
    comparisons: [
      'Who would you consider as being more charismatic?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Emotionally Stability',
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
    id: 'Loving to Learn',
    comparisons: [
      'Who do you think would get more excited about learning something new?',
      'Who more actively seeks to learn and participate in their interests?'
    ],
    categories: [CATEGORIES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: [
      'Who do you think is more sincere?'
    ],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: [
      'Who\'s more honest?'
    ],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Loyalty',
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
    id: 'Calmness',
    comparisons: [
      'Who\'s calmer?',
      'Who\'s more likely to keep their cool in a stressful situation?'
    ]
  },
  {
    id: 'Trustworthiness',
    comparisons: [
      'Who do you trust more?'
    ],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Social Boldness',
    comparisons: [
      'Who do you think less effected by shame or rejection in social situations?',
      'Who do you think would be less offended by criticism'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Inspiration',
    comparisons: [
      'Who are you more inspired by?'
    ],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Patience',
    comparisons: [
      'Who is more patient?'
    ]
  },
  {
    id: 'Likeability',
    comparisons: [
      'Who do you like more?'
    ],
    categories: [CATEGORIES.likeHangingOutWith, CATEGORIES.likeability]
  },
  {
    id: 'Comfortable Person to be Around',
    comparisons: [
      'Who are you more comfortable being yourself around?'
    ],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Fun',
    comparisons: [
      'Who do you think is more fun to hang out with?'
    ],
    categories: [CATEGORIES.likeHangingOutWith]
  },
  {
    id: 'Reliability',
    comparisons: [
      'Who would you be more likey to rely on?'
    ]
  },
  {
    id: 'Integrity',
    comparisons: [
      'Who is more true to their word?'
    ]
  },
  {
    id: 'Empathy',
    comparisons: [
      'Who would be more likely to understand your point of view?',
      'Who is more empathetic towards your point of view?'
    ],
    categories: [CATEGORIES.likeability, CATEGORIES.leadership]
  },
  {
    id: 'Conscientiousness',
    comparisons: [
      'Who would you consider to have a high standards for themselves?',
      'Who would you consider to be thorough, someone who follows through with what they start?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Determination',
    comparisons: [
      'Who is more determined?',
      'Who is more likely to pursue their dreams and continue until they succeed?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Adaptability',
    comparisons: [
      'Who is more adaptable?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Imaginative',
    comparisons: [
      'Who can talk an unusual road to a solution?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Naughtiness',
    comparisons: [
      'Who is likely to successfully bend the rules to get what they want?'
    ],
    categories: [CATEGORIES.founder]
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
