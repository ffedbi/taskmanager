import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import flatpickr from "flatpickr";

const statisticsInput = document.querySelector(`.statistic__period-input`);
const statTags = document.querySelector(`.statistic__tags-wrap`);
const statColors = document.querySelector(`.statistic__colors-wrap`);

const tagsCtx = document.querySelector(`.statistic__tags`);
const colorsCtx = document.querySelector(`.statistic__colors`);

const dateWeekStart = moment().startOf(`isoWeek`);
const dateWeekEnd = moment().endOf(`isoWeek`);

let tagsChart = null;
let colorsChart = null;

const updateChart = (chart, labels, values, backgrounds = false) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  if (backgrounds) {
    chart.data.datasets[0].backgroundColor = backgrounds;
  }
  chart.update();
};

const onChangeDate = (data, taskData) => {
  const newStartDate = data[0];
  const newEndDate = data[1];
  const newTagsStat = getFilterTaskTags(newStartDate, newEndDate, taskData);
  const newColorStat = getFilterTaskColor(newStartDate, newEndDate, taskData);
  updateChart(tagsChart, newTagsStat.labels, newTagsStat.values);
  updateChart(colorsChart, newColorStat.labels, newColorStat.values, newColorStat.backgrounds);
};

const getFilterTaskDate = (firstDate, secondDate, tasks) => {
  const result = tasks.filter((item) => {
    return (item.dueDate > moment(firstDate).format(`x`) && item.dueDate < moment(secondDate).format(`x`));
  });

  return result;
};

const getFilterTaskTags = (firstDate, secondDate, tasks) => {
  let result = {};
  getFilterTaskDate(firstDate, secondDate, tasks).forEach((item) => {
    item.tags.forEach((tag) => {
      result.hasOwnProperty(tag) ? result[tag]++ : result[tag] = 1;
    });
  });
  const labels = Object.keys(result);
  const values = Object.values(result);
  return {labels, values};
};

const getFilterTaskColor = (firstDate, secondDate, tasks) => {
  let colorsStat = [];
  let backgrounds = [];
  getFilterTaskDate(firstDate, secondDate, tasks).forEach((item) => {
    colorsStat.hasOwnProperty(item.color) ? colorsStat[item.color]++ : colorsStat[item.color] = 1;
  });

  const labels = Object.keys(colorsStat);
  const values = Object.values(colorsStat);

  labels.forEach((color) => backgrounds.push(`${color}`));
  return {labels, values, backgrounds};
};

export const statInit = (tasks) => {
  statTags.classList.remove(`visually-hidden`);
  statColors.classList.remove(`visually-hidden`);

  const taskData = tasks;
  const tagsData = getFilterTaskTags(dateWeekStart, dateWeekEnd, taskData);
  const colorData = getFilterTaskColor(dateWeekStart, dateWeekEnd, taskData);
  tagsChart = new Chart(tagsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: tagsData.labels,
      datasets: [{
        data: tagsData.values,
        backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`],
      }],
    },
    options: {
      plugins: {
        datalabels: {
          display: false,
        },
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          },
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15,
      },
      title: {
        display: true,
        text: `Done by: Tags`,
        fontSize: 16,
        fontColor: `#000000`,
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13,
        },
      },
    },
  });
  colorsChart = new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: colorData.labels,
      datasets: [{
        data: colorData.values,
        backgroundColor: colorData.backgrounds,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          display: false,
        },
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          },
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15,
      },
      title: {
        display: true,
        text: `Done by: Colors`,
        fontSize: 16,
        fontColor: `#000000`,
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13,
        },
      },
    },
  });

  flatpickr(statisticsInput, {
    mode: `range`,
    dateFormat: `d M`,
    defaultDate: [dateWeekStart.format(`DD MMM`), dateWeekEnd.format(`DD MMM`)],
    onClose: (selectedDates) => onChangeDate(selectedDates, taskData),
  });
};


