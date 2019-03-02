const timeData = {
  days: 7,
  hourse: 24,
  minute: 60,
  seconds: 60,
  ms: 1000,
  optionsDate: {hour: `numeric`, minute: `numeric`, hour12: true}
};

/**
 * Возвращает случайное значение в заданном диапазоне от:
 * @param {number} min - минимальное значение в диапазоне
 * @param {number} max - максимальное значение в диапазоне
 * @return {number}
 */
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

/**
 * Возвращает случайный элемент массива
 * @param {Array} arr - массив из которго его хотим получить
 * @return {number}
 */
export const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Очищает дом элемент
 * @param {str} section - DOM нода
 * @return {result}
 */

export const clearSection = (section) => {
  section.innerHTML = ``;
};

const getDeviationTime = () => timeData.days * timeData.hourse * timeData.minute * timeData.seconds * timeData.ms;

const createDateTask = () => {
  const shift = getDeviationTime();
  const dateTask = Date.now();
  const arrTimeSift = [dateTask + shift, dateTask - shift];
  return getRandomArrayItem(arrTimeSift);
};

export const convertDate = () => {
  const result = new Date(createDateTask()).toLocaleString(`en-US`, {month: `long`, day: `numeric`});
  return result.split(` `).reverse().join(` `);
};

export const convertHours = () => new Date(createDateTask()).toLocaleString(`en-US`, timeData.optionsDate);


