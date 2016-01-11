'use strict';

const _ = require('lodash');
const traitTemplateModel = require('../../app/models/traitTemplate');
//Rename
const THEMES = {
  happiness: 'Traits that predict happiness (Kaufman @ UPenn)',
  likeability: 'Traits that make you likeable (Norman Anderson)',
  leadership: 'Traits measuring leadership potential (Cattell Leadership Potential Equation)',
  founder: 'Traits of a strong YCombinator founder (Paul Graham @ Y Combinator)',
  friend: 'Traits of a good friend (Roberts-Griffin @ UPenn)'
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
    themes: [THEMES.leadership]
  },
  {
    id: 'Intuitiveness',
    comparisons: [
      'Who is more intuitive?',
      'Who is more likely to rely on their gut instinct?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Charisma',
    comparisons: [
      'Who is more charismatic?',
      'Who do you feel more devoted towards?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Emotionally Stability',
    comparisons: [
      'Who is more emotionally stable?',
      'Who is more even-tempered?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Self Assurance',
    comparisons: [
      'Who is more confident?',
      'Who would you consider to have less need for approval?'
    ],
    themes: [THEMES.leadership]
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
    themes: [THEMES.leadership]
  },
  {
    id: 'Loving to Learn',
    comparisons: [
      'Who is more excited about learning something new?',
      'Who looks for new things to learn?'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Sincerity',
    comparisons: [
      'Who is more sincere?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Honesty',
    comparisons: [
      'Who\'s more honest?',
      'Who is more likely to return excess change given to them by a cashier'
    ],
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Loyalty',
    comparisons: [
      'Who is a more loyal friend?'
    ],
    themes: [THEMES.likeability]
  },
  {
    id: 'Gratitude',
    comparisons: [
      'Who shows their gratitude most frequently'
    ],
    themes: [THEMES.happiness]
  },
  {
    id: 'Happiness',
    comparisons: [
      'Who is happier?'
    ],
    themes: [THEMES.happiness]
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
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Social Boldness',
    comparisons: [
      'Who is less effected by shame or rejection in social situations?',
      'Who is less offended by criticism'
    ],
    themes: [THEMES.leadership]
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
    themes: [THEMES.likeability]
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
    themes: [THEMES.likeability, THEMES.leadership]
  },
  {
    id: 'Conscientiousness',
    comparisons: [
      'Who would you consider to have a high standards for themselves?',
      'Who would you consider to be thorough, someone who follows through with what they start?'
    ],
    themes: [THEMES.leadership]
  },
  {
    id: 'Determination',
    comparisons: [
      'Who is more likely to complete a goal once they set their mind on it?',
      'Who is more determined?',
      'Who will not quit?'
    ],
    themes: [THEMES.founder]
  },
  {
    id: 'Adaptability',
    comparisons: [
      'If time travelled to the 1800\'s, who do you think would adapt the most quickly?',
      'If woken up in a foreign country, who would be most likely to make it home unscathed?'
    ],
    themes: [THEMES.founder]
  },
  {
    id: 'Imaginative',
    comparisons: [
      'Who can talk an unusual road to a solution?',
      'Who would make it further on a season of Survivor?'
    ],
    themes: [THEMES.founder]
  },
  {
    id: 'Naughtiness',
    comparisons: [
      'Who is likely to successfully bend the rules to get what they want?'
    ],
    themes: [THEMES.founder]
  },
  {
    id: 'Supportive',
    comparisons: [
      'Who is more likely to show up to support you at the finish line of a half-marathon?',
      'Who is more likely to know your goals?'
    ],
    themes: [THEMES.friend]
  }
];

module.exports = {
  defaultTraits: defaults,
  addDefault: function* () {
    yield _.map(defaults, function(trait) {
      if (!trait.themes) {
        trait.themes = [];
      }
      return traitTemplateModel.addOrUpdate(trait);
    });
  }
};
