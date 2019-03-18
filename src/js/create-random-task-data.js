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

export const createRandomTaskData = (num) => {
  return {
    id: num,
    title: getRandomArrayItem(TASK_DATA.TITLES),
    dueDate: createTaskDate(),
    tags: getRandomTagsSet(TASK_DATA.TAGS),
    picture: `http://picsum.photos/100/100?r=${Math.random()}`,
    repeatingDays: {
      'mo': false,
      'tu': false,
      'we': false,
      'th': false,
      'fr': false,
      'sa': false,
      'su': false,
    },
    isFavorite: getRandomNumber(0, 1),
    isDone: getRandomNumber(0, 1),
    color: getRandomArrayItem(TASK_DATA.COLOR_CLASSES),
    type: getRandomArrayItem(TASK_DATA.TYPES),
  };
};
