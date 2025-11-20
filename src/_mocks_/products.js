import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgProduct } from '../utils/mockImages';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'The Freedom Seires',
  'Ignite Elite Mastermind',
  'Calm & Creative Collection',
  'Thinking Into Results',
  'ZoomX SuperRep Surge'
];

const PRODUCT_DESCRIPTION = [
  'Discover the 5 essential elements to quantum leap your results and create a repeatable winning formula',
  '1. Freedom is a Mindset 2.Discover your Purpose 3. Success is a Habit 4.Lead in the New Economy 5. Applied Faith.',
  ' Discover the 5 essential elements to quantum leap your results and create a repeatable winning formula. 1. Freedom is a Mindset 2.Discover your Purpose 3. Success is a Habit 4.Lead in the New Economy 5. Applied Faith.',
  '1. Freedom is a Mindset 2.Discover your Purpose',
  'Success is a Habit. Lead in the New Economy. Applied Faith.'
];
const PRODUCT_COLOR = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107'
];

// ----------------------------------------------------------------------

const products = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    cover: mockImgProduct(setIndex),
    name: PRODUCT_NAME[index],
    description: PRODUCT_DESCRIPTION[index],
    price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
    priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
      PRODUCT_COLOR,
    status: sample(['sale', 'new', '', ''])
  };
});

export default products;
