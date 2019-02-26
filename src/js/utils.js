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
// eslint-disable-next-line no-return-assign
export const clearSection = (section) => section.innerHTML = ``;
