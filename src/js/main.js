import {FILTER_DATA, TASK_DATA} from './data';
import {clearSection} from './utils';
import {createArrTaskData} from './create-arr-task-data';
import Task from "./task";
import TaskEdit from "./task-edit";
import Filter from "./filter";
import {statInit} from "./statistics";
import moment from 'moment';

const FILTER_BLOCK = document.querySelector(`.main__filter`);
const TASK_BLOCK = document.querySelector(`.board__tasks`);
const btnActiveStatistic = document.querySelector(`#control__statistic`);
const sectionTask = document.querySelector(`.board`);
const statistic = document.querySelector(`.statistic`);
const btnTasks = document.querySelector(`#control__task`);

const arrTasks = createArrTaskData(TASK_DATA.MAX_TASK_COUNT);

const fillCardWithFilters = (data, section) => {
  for (let i = 0; i < data.length; i++) {
    let filterData = data[i];
    let filter = new Filter(filterData);

    filter.onFilter = () => {
      clearSection(TASK_BLOCK);
      let newFilterData = filterTasks(arrTasks, filter.name);
      createSpecifiedNumCard(newFilterData, TASK_BLOCK);
    };

    filter.render();
    section.appendChild(filter.element);
  }
}

const filterTasks = (tasks, filterName) => {
  switch (filterName) {
    case `all`:
      return tasks;
    case `overdue`:
      return tasks.filter((task) =>
        moment(task.dueDate).isBefore(moment(new Date())));
    case `favorites`:
      return tasks.filter((task) => task._isFavorite);
    case `today`:
      return tasks.filter((task) =>
        moment(task.dueDate).isSame(moment(new Date()), `day`));
    case `repeating`:
      return tasks.filter((task) => [...Object.entries(task.repeatingDays)]
        .some((rec) => rec[1]));
    case `tags`:
      return tasks.filter((task) => task.tags.size);
    case `Arhive`:
      return tasks.filter((task) => task.isArhive);
    default:
      return tasks;
  }
};

const deleteTask = (tasks, id) => {
  tasks.splice(id, 1);
  return tasks;
};

const createSpecifiedNumCard = (data, section) => {
  for (let i = 0; i < data.length; i++) {
    const task = new Task(data[i]);
    const taskEdit = new TaskEdit(data[i]);

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

    taskEdit.onDelete = () => {
      deleteTask(arrTasks, i);
      taskEdit.element.remove();
      taskEdit.destroy();
    };

    task.render();
    section.appendChild(task.element);
  }
};

clearSection(TASK_BLOCK);
clearSection(FILTER_BLOCK);
fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
createSpecifiedNumCard(arrTasks, TASK_BLOCK);

const onClickBtnStatistics = () => {
  sectionTask.classList.add(`visually-hidden`);
  statistic.classList.remove(`visually-hidden`);
  statInit(arrTasks);
};

const onClickBtnTasks = () => {
  sectionTask.classList.remove(`visually-hidden`);
  statistic.classList.add(`visually-hidden`);
};

btnActiveStatistic.addEventListener(`click`, onClickBtnStatistics);
btnTasks.addEventListener(`click`, onClickBtnTasks);

