import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import flatpickr from "flatpickr";

const STATISTIC_INPUT = document.querySelector(`.statistic__period-input`);
const TAGS_CANVAS = document.querySelector(`.statistic__tags`);
const COLOR_CANVAS = document.querySelector(`.statistic__colors`);
const TAGS_STATISTIC_BLOCK = document.querySelector(`.statistic__tags-wrap`);
const COLORS_STATISTIC_BLOCK = document.querySelector(`.statistic__colors-wrap`);
let tagsChart = null;
let colorsChart = null;

const dateWeekStart = moment().startOf(`isoWeek`);
const dateWeekEnd = moment().endOf(`isoWeek`);

const updateChart = (chart, data) => {
  chart.data.labels = data.labels;
  chart.data.datasets[0].data = data.values;
  if (data.backgrounds) {
    chart.data.datasets[0].backgroundColor = data.backgrounds;
  }
  chart.update();
};

const onChangeDate = (data, taskData) => {
  const newStartDate = data[0];
  const newEndDate = data[1];
  const newTagsStat = getFilterTaskTags(newStartDate, newEndDate, taskData);
  const newColorStat = getFilterTaskColor(newStartDate, newEndDate, taskData);
  updateChart(tagsChart, newTagsStat);
  updateChart(colorsChart, newColorStat);
};

const getFilterTaskDate = (firstDate, secondDate, tasks) => {
  return tasks.filter((item) => {
    return (item.dueDate > moment(firstDate).format(`x`) && item.dueDate < moment(secondDate).format(`x`));
  });
};

const getFilterTaskTags = (firstDate, secondDate, tasks) => {
  let result = {};
  getFilterTaskDate(firstDate, secondDate, tasks).forEach((item) => {
    item.tags.forEach((tag) => {
      if (result.hasOwnProperty(tag)) {
        result[tag]++;
      }
      result[tag] = 1;
    });
  });

  return {
    labels: Object.keys(result),
    values: Object.values(result),
  };
};

const getFilterTaskColor = (firstDate, secondDate, tasks) => {
  let colorsStat = [];
  let backgrounds = [];
  getFilterTaskDate(firstDate, secondDate, tasks).forEach((item) => {
    if (colorsStat.hasOwnProperty(item.color)) {
      colorsStat[item.color]++;
    }
    colorsStat[item.color] = 1;
  });

  const labels = Object.keys(colorsStat);

  labels.forEach((color) => backgrounds.push(`${color}`));

  return {
    labels: Object.keys(colorsStat),
    values: Object.values(colorsStat),
    backgrounds,
  };
};

const createChart = (canvasElement, charData) => {
  const chart = new Chart(canvasElement, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: charData.labels,
      datasets: [{
        data: charData.values,
        backgroundColor: charData.backgrounds || [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`],
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
  return chart;
};

export const statInit = (tasks) => {
  TAGS_STATISTIC_BLOCK.classList.remove(`visually-hidden`);
  COLORS_STATISTIC_BLOCK.classList.remove(`visually-hidden`);

  const tagsData = getFilterTaskTags(dateWeekStart, dateWeekEnd, tasks);
  const colorData = getFilterTaskColor(dateWeekStart, dateWeekEnd, tasks);

  if (!tagsChart) {
    tagsChart = createChart(TAGS_CANVAS, tagsData);
    colorsChart = createChart(COLOR_CANVAS, colorData);
  }

  updateChart(tagsChart, tagsData);
  updateChart(colorsChart, colorData);

  flatpickr(STATISTIC_INPUT, {
    mode: `range`,
    dateFormat: `d M`,
    defaultDate: [dateWeekStart.format(`DD MMM`), dateWeekEnd.format(`DD MMM`)],
    onClose: (selectedDates) => onChangeDate(selectedDates, tasks),
  });
};
