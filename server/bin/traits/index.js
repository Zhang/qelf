'use strict';

const _ = require('lodash');
const traitTemplateModel = require('../../app/models/traitTemplate');

const CATEGORIES = {
  happiness: 'Traits that predict happiness (Kaufman at UPenn)',
  likeability: 'Traits that make you likeable (Norman Anderson)',
  leadership: 'Traits of strong leadership (Cattell Leadership Potential Equation)',
  founder: 'Traits of a YCombinator founder (Paul Graham via Y Combinator)',
  friend: 'Traits of being a good friend (Roberts-Griffin at UPenn)'
};

//Trait names must fit into the sentence: "I scored really high in ___TRAIT___"
//Comparisons are meant to:
//  1. Be interesting to answer
//  2. Together, fully encompass the given trait
//  3. Concise

const defaults = [
  {
    id: 'Kindness', //Ethical, pleasant, and concerned about others (Wikipedia)
    comparisons: [
      'Who is more kind?',
      'Who is more ethical?',
      'Who is more pleasant?',
      'Who is more concerned about others?'
    ]
  },
  {
    id: 'Thoughtfulness',
    comparisons: [
      'Who is more thoughtful?',
      'Who is more likely to keep your interests in mind?',
      'Who is more likely to remember your birthday?',
      'Who is more likely to wonder about your thoughts at night?'
    ]
  },
  {
    id: 'Enthusiasm',
    comparisons: [
      'Who is more enthusiastic?',
      'Who is more energetic?',
      'Who is more interested in the events in their life?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Intuitiveness',
    comparisons: [
      'Who is more intuitive?',
      'Who is more likely to rely on their gut instinct?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Charisma',
    comparisons: [
      'Who is more charismatic?',
      'Who do you feel more devoted towards?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Emotionally Stability',
    comparisons: [
      'Who is more emotionally stable?',
      'Who is more even-tempered?'
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
    comparisons: [
      'Who has a more positive attitude?'
    ]
  },
  {
    id: 'Dominance',
    comparisons: [
      'Who is more dominant?'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Loving to Learn',
    comparisons: [
      'Who is more excited about learning something new?',
      'Who looks for new things to learn?'
    ],
    categories: [CATEGORIES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: [
      'Who is more sincere?'
    ],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: [
      'Who\'s more honest?',
      'Who is more likely to return excess change given to them by a cashier'
    ],
    categories: [CATEGORIES.likeability, CATEGORIES.leadership]
  },
  {
    id: 'Loyalty',
    comparisons: [
      'Who is a more loyal friend?'
    ],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Gratitude',
    comparisons: [
      'Who shows their gratitude most frequently'
    ],
    categories: [CATEGORIES.happiness]
  },
  {
    id: 'Happiness',
    comparisons: [
      'Who is happier?'
    ],
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
      'Who do you trust more?',
      'Who '
    ],
    categories: [CATEGORIES.likeability, CATEGORIES.leadership]
  },
  {
    id: 'Social Boldness',
    comparisons: [
      'Who is less effected by shame or rejection in social situations?',
      'Who is less offended by criticism'
    ],
    categories: [CATEGORIES.leadership]
  },
  {
    id: 'Inspiration',
    comparisons: [
      'Who is more inspiring?'
    ]
  },
  {
    id: 'Patience',
    comparisons: [
      'Who is more patient?',
      'Who is less likely to have road rage?'
    ]
  },
  {
    id: 'Likeability',
    comparisons: [
      'Who do you like more?'
    ],
    categories: [CATEGORIES.likeability]
  },
  {
    id: 'Comfortable Person to be Around',
    comparisons: [
      'Who are you more comfortable being yourself around?'
    ]
  },
  {
    id: 'Fun',
    comparisons: [
      'Who do you think is more fun to hang out with?'
    ]
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
      'Who is more likely to complete a goal once they set their mind on it?',
      'Who is more determined?',
      'Who will not quit?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Adaptability',
    comparisons: [
      'If time travelled to the 1800\'s, who do you think would adapt the most quickly?',
      'If woken up in a foreign country, who would be most likely to make it home unscathed?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Imaginative',
    comparisons: [
      'Who can talk an unusual road to a solution?',
      'Who would make it further on a season of Survivor?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Naughtiness',
    comparisons: [
      'Who is likely to successfully bend the rules to get what they want?'
    ],
    categories: [CATEGORIES.founder]
  },
  {
    id: 'Supportive',
    comparisons: [
      'Who is more likely to show up to support you at the finish line of a half-marathon?',
      'Who is more likely to know your goals?'
    ],
    categories: [CATEGORIES.friend]
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
