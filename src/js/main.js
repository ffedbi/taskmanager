import {FILTER_DATA, TASK_DATA} from './data';
import {clearSection, getRandomNumber} from './utils';
import {createFilter} from './create-filter';
import {createCard} from './create-card';
import {createRandomTask} from './create-random-task';

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
    CARD_BLOCK.insertAdjacentHTML(`beforeend`, createCard(createRandomTask()));
  }
};

FILTER_BLOCK.addEventListener(`change`, (e) => {
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(CARD_BLOCK);
    createSpecifiedNumCard(getRandomNumber(TASK_DATA.MIN, TASK_DATA.MAX));
  }
});

clearSection(CARD_BLOCK);
clearSection(FILTER_BLOCK);
fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
createSpecifiedNumCard(TASK_DATA.MAX);
