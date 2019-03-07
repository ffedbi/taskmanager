import {FILTER_DATA, TASK_DATA} from './data';
import {clearSection, getRandomNumber} from './utils';
import {createFilter} from './create-filter';
import {createRandomDataTask} from './create-random-data-task';
import {Task} from "./task";
import {TaskEdit} from "./task-edit";

const FILTER_BLOCK = document.querySelector(`.main__filter`);
const CARD_BLOCK = document.querySelector(`.board__tasks`);

/**
 * Заполняет ноду фильтрами
 * @param {Array} data - массив фильтров
 * @param {HTMLElement} section - DOM нода
 */
const fillCardWithFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, createFilter(item)));
};

/**
 * Отрисовывает заданное количество карточек
 * @param {number} num - число карточек которое нужно отрисовать
 */
const createSpecifiedNumCard = (num) => {
  for (let i = 0; i < num; i++) {
    let data = createRandomDataTask();
    const task = new Task(data);
    const taskEdit = new TaskEdit(data);

    task.render(CARD_BLOCK);

    task.onEdit = () => {
      taskEdit.render(CARD_BLOCK);
      CARD_BLOCK.replaceChild(taskEdit.element, task.element);
      task.destroy();
    };

    taskEdit.onSubmit = () => {
      task.render(CARD_BLOCK);
      CARD_BLOCK.replaceChild(task.element, taskEdit.element);
      taskEdit.destroy();
    };
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


