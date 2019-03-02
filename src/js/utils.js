const OPTIONS_DATE = {
  hour: `numeric`,
  minute: `numeric`,
  hour12: true
};

const DEVIATION_TIME = 7 * 24 * 60 * 60 * 1000;

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

const createDateTask = () => {
  const dateTask = Date.now();
  const arrTimeSift = [dateTask + DEVIATION_TIME, dateTask - DEVIATION_TIME];
  return getRandomNumber(arrTimeSift[0], arrTimeSift[1]);
};

export const convertDate = () => {
  const result = new Date(createDateTask()).toLocaleString(`en-US`, {month: `long`, day: `numeric`});
  return result.split(` `).reverse().join(` `);
};

export const convertHours = () => new Date(createDateTask()).toLocaleString(`en-US`, OPTIONS_DATE);
