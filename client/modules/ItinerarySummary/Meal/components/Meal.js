import React from 'react';
import timeSlots from '../../../City/timeSlots.json';


const getMealLabel =
  slotOrder => timeSlots.find(
    timeSlot => timeSlot.order === slotOrder
  ).mealLabel;


const typesToLabels = {
  'No meal arranged': 'not arranged',
  'Included with tour': 'included with tour',
  'Included with hotel': 'included with hotel',
  'Pre-arranged': 'pre-arranged',
  'Guest self-arranged': 'self-arranged'
};


export default ({
  timeSlot: {
    slotOrder,
    meal: {
      type = 'No meal arranged'
    } = {}
  }
}) => (<span

  className={type === 'No meal arranged'
    ? 'exo-colors-text text-accent-4 bold'
    : 'bold'}
>{[
  getMealLabel(slotOrder),
  'is',
  `${typesToLabels[type]}.`,
  ''
].join(' ')}</span>);
