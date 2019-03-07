import {FILTER_DATA, TASK_DATA} from './data';
import {clearSection, getRandomNumber} from './utils';
import {createFilter} from './create-filter';
import {createTask} from './create-task';
import {createRandomTaskData} from './create-random-task-data';

const FILTER_BLOCK = document.querySelector(`.main__filter`);
const CARD_BLOCK = document.querySelector(`.board__tasks`);

/**
 * Заполняет ноду фильтрами
 * @param {Array} data - массив фильтров
 * @param {HTMLElement} section - DOM нода
 */
const fillCardWithFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, createFilter(item.name, item.amount, item.isChecked)));
};

/**
 * Отрисовывает заданное количество карточек
 * @param {number} num - число карточек которое нужно отрисовать
 */
const createSpecifiedNumCard = (num) => {
  for (let i = 0; i < num; i++) {
    CARD_BLOCK.insertAdjacentHTML(`beforeend`, createTask(createRandomTaskData()));
  }
};

FILTER_BLOCK.addEventListener(`change`, (e) => {
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(CARD_BLOCK);
    createSpecifiedNumCard(getRandomNumber(TASK_DATA.MIN_TASK_COUNT, TASK_DATA.MAX_TASK_COUNT));
  }
});

clearSection(CARD_BLOCK);
clearSection(FILTER_BLOCK);
fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
createSpecifiedNumCard(TASK_DATA.MAX_TASK_COUNT);

