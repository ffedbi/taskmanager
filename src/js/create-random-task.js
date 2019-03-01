import {getRandomNumber, getRandomArrayItem, convertDate, convertHours} from './utils';
import {TASK_DATA} from './data';

const getRandomSetItems = (arr) => {
  const tagsList = new Set();
  const maxItems = getRandomNumber(TASK_DATA.MIN_NUM_HESTAG, TASK_DATA.MAX_NUM_HESTAG);
  for (let i = 0; i < maxItems; i++) {
    tagsList.add(getRandomArrayItem(arr));
  }
  return tagsList;
};

export const createRandomTask = () => {
  return {
    title: getRandomArrayItem(TASK_DATA.TITLE),
    dueDate: [convertDate(), convertHours()],
    tags: getRandomSetItems(TASK_DATA.TAGS),
    picture: `http://picsum.photos/100/100?r=${Math.random()}`,
    repeatingDays: {
      'Mo': getRandomNumber(0, 1),
      'Tu': getRandomNumber(0, 1),
      'We': getRandomNumber(0, 1),
      'Th': getRandomNumber(0, 1),
      'Fr': getRandomNumber(0, 1),
      'Sa': getRandomNumber(0, 1),
      'Su': getRandomNumber(0, 1),
    },
    isFavorite: getRandomNumber(0, 1),
    isDone: getRandomNumber(0, 1),
    color: getRandomArrayItem(TASK_DATA.COLOR_CLASS),
    type: getRandomArrayItem(TASK_DATA.TYPE),
  };
};
