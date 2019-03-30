import {FILTER_DATA} from './data';
import {clearSection} from './utils';
import Task from "./task";
import TaskEdit from "./task-edit";
import Filter from "./filter";
import {statInit} from "./statistics";
import moment from 'moment';
import API from "./api";

const FILTER_BLOCK = document.querySelector(`.main__filter`);
const TASK_BLOCK = document.querySelector(`.board__tasks`);
const BUTTON_STATISTIC = document.querySelector(`#control__statistic`);
const SECTIONS_TASK = document.querySelector(`.board`);
const STATISTIC = document.querySelector(`.statistic`);
const BUTTON_TASKS = document.querySelector(`#control__task`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
let arrTasks = null;

const deleteTask = (tasks, id) => {
  tasks.splice(id, 1);
  return tasks;
};

const LoadingMsg = {
  loading: `Loading tasks...`,
  error: `Something went wrong while loading your tasks. Check your connection or try again later`,
};

const BLOCK_MASSAGE = document.querySelector(`.board__no-tasks`);
BLOCK_MASSAGE.classList.remove(`visually-hidden`);
BLOCK_MASSAGE.textContent = LoadingMsg.loading;

api.getTasks()
  .then((tasks) => {
    arrTasks = tasks;
    renderTasks(tasks, TASK_BLOCK);
  })
  .then(() => {
    BLOCK_MASSAGE.classList.add(`visually-hidden`);
  })
  .catch(() => {
    BLOCK_MASSAGE.textContent = LoadingMsg.error;
  });

const fillCardWithFilters = (data, section) => {
  for (let i = 0; i < data.length; i++) {
    let filterData = data[i];
    let filter = new Filter(filterData);

    filter.onFilter = () => {
      clearSection(TASK_BLOCK);
      let newFilterData = filterTasks(arrTasks, filter.name);
      renderTasks(newFilterData, TASK_BLOCK);
    };

    filter.render();
    section.appendChild(filter.element);
  }
};

const filterTasks = (tasks, name) => {
  const filterName = name.toLowerCase();
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
    case `archive`:
      return tasks.filter((task) => task.isDone);
    default:
      return tasks;
  }
};
const renderTasks = (data) => {
  clearSection(TASK_BLOCK);
  for (let item of data) {
    const task = new Task(item);
    const taskEdit = new TaskEdit(item);

    task.onEdit = () => {
      taskEdit.render();
      TASK_BLOCK.replaceChild(taskEdit.element, task.element);
      task.destroy();
    };

    taskEdit.onSubmit = (newData) => {
      item.title = newData.title;
      item.tags = newData.tags;
      item.color = newData.color;
      item.repeatingDays = newData.repeatingDays;
      item.dueDate = newData.dueDate;
      item.picture = newData.picture;

      taskEdit.lockToSaving();

      api.updateTask({id: item.id, data: item.toRAW()})
        .then((response) => {
          if (response) {
            task.update(response);
            task.render();
            TASK_BLOCK.replaceChild(task.element, taskEdit.element);
          }
        })
        .catch(() => {
          taskEdit.setBorderColorTask(`#ff0000`);
          taskEdit.shake();
        })
        .then(() => {
          taskEdit.setBorderColorTask(`#000000`);
          taskEdit.unlockToSave();
          taskEdit.destroy();
        });
    };

    taskEdit.onKeyEsc = () => {
      task.render();
      TASK_BLOCK.replaceChild(task.element, taskEdit.element);
      taskEdit.destroy();
    };

    taskEdit.onDelete = (({id}) => {
      taskEdit.lockToDeleting();

      api.deleteTask({id})
        .then(() => api.getTasks())
        .then(renderTasks)
        .catch(() => {
          taskEdit.shake();
        })
        .then(() => {
          taskEdit.unlockToDelete();
        });

      deleteTask(arrTasks, id);
    });

    task.render();
    TASK_BLOCK.appendChild(task.element);
  }
};

const onClickBtnStatistics = () => {
  SECTIONS_TASK.classList.add(`visually-hidden`);
  STATISTIC.classList.remove(`visually-hidden`);
  statInit(arrTasks);
};

const onClickBtnTasks = () => {
  SECTIONS_TASK.classList.remove(`visually-hidden`);
  STATISTIC.classList.add(`visually-hidden`);
};

fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
BUTTON_STATISTIC.addEventListener(`click`, onClickBtnStatistics);
BUTTON_TASKS.addEventListener(`click`, onClickBtnTasks);
