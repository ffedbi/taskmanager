const monthNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

export const convertDate = () => {
  let day = new Date().getDate();
  let month = new Date().getMonth();
  return `${day} ${monthNames[month]}`;
};

export const convertHours = () => new Date().toLocaleString(`en-US`, {hour: `numeric`, minute: `numeric`, hour12: true});

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
