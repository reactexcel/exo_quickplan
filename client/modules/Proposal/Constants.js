const STARS = [{
  id: 6,
  text: '★★★★★★'
}, {
  id: 5,
  text: '★★★★★'
}, {
  id: 4,
  text: '★★★★'
}, {
  id: 3,
  text: '★★★'
}, {
  id: 2,
  text: '★★'
}];

const STYLES = [
 { text: 'Active', id: 'Active' },
 { text: 'Adventure', children: ['Cycling', 'Trekking', 'Multi-activity', 'Challenge', 'Kayaking', 'Rafting', 'Skiing'] },
 { text: 'Art & Architecture', id: 'Art & Architecture' },
 { text: 'Beach', id: 'Beach' },
 { text: 'Classic Journeys', id: 'Classic Journeys' },
 { text: 'Cruising', id: 'Cruising' },
 { text: 'Culinary', id: 'Culinary' },
 { text: 'Family', children: ['Family with teenagers', 'Multi-generational', 'Young family'] },
 { text: 'Festivals', id: 'Festivals' },
 { text: 'Heritage & Culture', id: 'Heritage & Culture' },
 { text: 'Homestay', id: 'Homestay' },
 { text: 'Honeymoon', id: 'Honeymoon' },
 { text: 'Nature & Wildlife', id: 'Nature & Wildlife' },
 { text: 'Overland journeys', id: 'Overland journeys' },
 { text: 'Photography', id: 'Photography' },
 { text: 'Promotion & Green Season', id: 'Promotion & Green Season' },
 { text: 'Small group journeys', id: 'Small group journeys' },
 { text: 'Sustainable', id: 'Sustainable' },
 { text: 'Wellness & Spirit', id: 'Wellness & Spirit' }
].sort((a, b) => a.text.localeCompare(b.text));

const GENDERS = ['Male', 'Female'];

const AGE_GROUP = [{
  id: '',
  text: ''
}, {
  id: 'adults',
  text: 'adult (12+)'
}, {
  id: 'children',
  text: 'child (2-11)'
}, {
  id: 'infants',
  text: 'infant (0-1)'
}];

const getAgeGroup = function (age) {
  if (age < 2) {
    return 'infants';
  } else if (age < 12) {
    return 'children';
  } else {  // eslint-disable-line no-else-return
    return 'adults';
  }
};

const ALLERGIES = ['Nuts', 'Peanuts', 'Milk', 'Soya', 'Wheat', 'Citrus', 'Eggs', 'Fish', 'Shelfish', 'Shrimp'].sort((a, b) => a.localeCompare(b));
const COUNTRIES = [{ id: 'DE', text: 'Germany' }, { id: 'ES', text: 'Span' }, { id: 'FR', text: 'France' }, { id: 'IT', text: 'Italy' }, { id: 'TH', text: 'Thailand' }, { id: 'US', text: 'USA' }].sort((a, b) => a.text.localeCompare(b.text));
const DIET = ['Vegetarian', 'Vegan', 'Kosher', 'Halal'].sort((a, b) => a.localeCompare(b));
const LANGUAGES = [{ id: 'DE', text: 'German' }, { id: 'EN', text: 'English' }, { id: 'ES', text: 'Spanish' }, { id: 'FR', text: 'French' }, { id: 'IT', text: 'Italian' }, { id: 'TH', text: 'Thai' }].sort((a, b) => a.text.localeCompare(b.text));

const STYLE_DATA = 'exo-colors-text text-data-1 fs-16 fw-600';
const STYLE_DATA_1 = 'exo-colors-text text-data-1 fs-14 fw-400';
const STYLE_DATA_2 = 'exo-colors-text text-data-1 fs-12 fw-500';
const STYLE_DATA_BOLD = 'exo-colors-text text-data-1 fs-18 fw-700';
const STYLE_DATA_TITLE = 'exo-colors-text text-data-1 fs-20 fw-700';
const STYLE_TITLE = 'exo-colors-text text-data-1 fs-24 fw-700';
const STYLE_BUTTON_DATA = 'exo-colors-text text-base1 fs-16 fw-700';
const STYLE_BUTTON_DISABLE = 'fw-400 exo-colors-text text-label-1 fs-16 fw-700';

export { STARS, STYLES, GENDERS, AGE_GROUP, getAgeGroup, ALLERGIES, COUNTRIES, DIET, LANGUAGES, STYLE_DATA, STYLE_DATA_1, STYLE_DATA_2, STYLE_DATA_BOLD, STYLE_DATA_TITLE, STYLE_TITLE, STYLE_BUTTON_DATA, STYLE_BUTTON_DISABLE };
