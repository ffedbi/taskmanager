import {FILTER_DATA, TASK_DATA} from './data';
import {clearSection, getRandomNumber} from './utils';
import {createFilter} from './create-filter';
import {createRandomTaskData} from './create-random-task-data';
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
 * Отрисовывает заданное количество задач
 * @param {Number} num - количество тасков
 * @param {HTMLElement} section - дом элемент
 */
const createSpecifiedNumTask = (num, section) => {
  for (let i = 0; i < num; i++) {
    let data = createRandomTaskData();
    let task = new Task(data);
    let taskEdit = new TaskEdit(data);

    task.onEdit = () => {
      taskEdit.render();
      section.replaceChild(taskEdit.element, task.element);
      task.destroy();
    };

    taskEdit.onSubmit = () => {
      task.render();
      section.replaceChild(task.element, taskEdit.element);
      taskEdit.destroy();
    };

    task.render();
    section.appendChild(task.element);
  }
};

FILTER_BLOCK.addEventListener(`change`, (e) => {
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(CARD_BLOCK);
    createSpecifiedNumTask(getRandomNumber(TASK_DATA.MIN_TASK_COUNT, TASK_DATA.MAX_TASK_COUNT), CARD_BLOCK);
  }
});

clearSection(CARD_BLOCK);
clearSection(FILTER_BLOCK);
fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
createSpecifiedNumTask(TASK_DATA.MAX_TASK_COUNT, CARD_BLOCK);


