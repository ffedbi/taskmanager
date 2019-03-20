import {FILTER_DATA, TASK_DATA} from './data';
import {clearSection, getRandomNumber} from './utils';
import {createFilter} from './create-filter';
import {createRandomTaskData} from './create-random-task-data';
import Task from "./task";
import TaskEdit from "./task-edit";

const FILTER_BLOCK = document.querySelector(`.main__filter`);
const TASK_BLOCK = document.querySelector(`.board__tasks`);

const fillCardWithFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, createFilter(item)));
};

const createSpecifiedNumCard = (num, section) => {
  for (let i = 0; i < num; i++) {
    let data = createRandomTaskData(i);
    const task = new Task(data);
    const taskEdit = new TaskEdit(data);

    task.onEdit = () => {
      taskEdit.render();
      section.replaceChild(taskEdit.element, task.element);
      task.destroy();
    };

    taskEdit.onSubmit = (newData) => {
      data.title = newData.title;
      data.tags = newData.tags;
      data.color = newData.color;
      data.repeatingDays = newData.repeatingDays;
      data.dueDate = newData.dueDate;
      data.picture = newData.picture;
      task.update(data);
      task.render();
      section.replaceChild(task.element, taskEdit.element);
      taskEdit.destroy();
    };

    taskEdit.onKeyEsc = () => {
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
    clearSection(TASK_BLOCK);
    createSpecifiedNumCard(getRandomNumber(TASK_DATA.MIN_TASK_COUNT, TASK_DATA.MAX_TASK_COUNT), TASK_BLOCK);
  }
});

clearSection(TASK_BLOCK);
clearSection(FILTER_BLOCK);
fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
createSpecifiedNumCard(TASK_DATA.MAX_TASK_COUNT, TASK_BLOCK);
