import CountryCityTreeQuery from './queries/CountryCityTree';
import CountryCityTreeMutation from './mutations/CountryCityTree';

const exportedTreeQuery = CountryCityTreeQuery;
const exportedTreeMutation = {
  countryCityTreeMutation: CountryCityTreeMutation
};
export {
  exportedTreeQuery as CountryCityTreeQuery,
  exportedTreeMutation as CountryCityTreeMutation
};
