import {getRandomNumber, getRandomArrayItem, createTaskDate} from './utils';
import {TASK_DATA} from './data';

const getRandomTagsSet = (arr) => {
  const tagsList = new Set();
  const maxItems = getRandomNumber(TASK_DATA.MIN_TAGS_COUNT, TASK_DATA.MAX_TAGS_COUNT);
  for (let i = 0; i < maxItems; i++) {
    tagsList.add(getRandomArrayItem(arr));
  }
  return tagsList;
};

const createRandomTaskData = (id) => {
  return {
    id: id,
    title: getRandomArrayItem(TASK_DATA.TITLES),
    dueDate: createTaskDate(),
    tags: getRandomTagsSet(TASK_DATA.TAGS),
    picture: `http://picsum.photos/100/100?r=${Math.random()}`,
    repeatingDays: {
      'mo': getRandomNumber(0, 1),
      'tu': getRandomNumber(0, 1),
      'we': getRandomNumber(0, 1),
      'th': getRandomNumber(0, 1),
      'fr': getRandomNumber(0, 1),
      'sa': getRandomNumber(0, 1),
      'su': getRandomNumber(0, 1),
    },
    isFavorite: getRandomNumber(0, 1),
    isDone: getRandomNumber(0, 1),
    color: getRandomArrayItem(TASK_DATA.COLOR_CLASSES),
    type: getRandomArrayItem(TASK_DATA.TYPES),
    isArhive: getRandomNumber(0, 1)
  };
};

export const createArrTaskData = (num) => {
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(createRandomTaskData(i));
  }

  return arr;
};
