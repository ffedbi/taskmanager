/**
 * Создаёт фильтр
 * @param {string} caption - название фильтра
 * @param {number} amount - количество задач
 * @param {boolean} isChecked - выбран ли фильтр
 * @return {string}
 */
export const createFilter = (caption, amount, isChecked = false) => {
  const captionLowered = caption.toLowerCase();
  return `<input type="radio" id="filter__${captionLowered}" class="filter__input visually-hidden" name="filter" ${isChecked ? ` checked` : ``} ${amount === 0 ? ` disabled` : ``}>
            <label for="filter__${captionLowered}" class="filter__label">${caption.toUpperCase()} <span class="filter__${captionLowered}-count">${amount}</span></label>`;
};
