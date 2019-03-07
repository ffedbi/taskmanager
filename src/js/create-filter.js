export const createFilter = (data) => {
  const captionLowered = data.name.toLowerCase();
  return `<input type="radio" id="filter__${captionLowered}" class="filter__input visually-hidden" name="filter" ${data.isChecked ? ` checked` : ``} ${data.amount === 0 ? ` disabled` : ``}>
            <label for="filter__${captionLowered}" class="filter__label">${data.name.toUpperCase()} <span class="filter__${captionLowered}-count">${data.amount}</span></label>`;
};
