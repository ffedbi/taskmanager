const getStatusCard = (type) => `${type ? `card--${type}` : ``}`;

const makeTagsBtn = (arr) => {
  let str = ``;
  for (let item of arr) {
    str += `<span class="card__hashtag-inner">
              <input type="hidden"
                     name="hashtag"
                     value="${item}"
                     class="card__hashtag-hidden-input"
              />
              <button type="button" class="card__hashtag-name">#${item}</button>
              <button type="button" class="card__hashtag-delete">delete</button>
            </span>`;
  }
  return str;
};

export const createRandomTask = (data) => {
  return `<article class="card card--${data.color} ${getStatusCard(data.type)}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">edit</button>
            <button type="button" class="card__btn ${data.isDone ? ` card__btn--archive` : ``}">${data.isDone ? `archive` : ``}</button>
            <button type="button" class="card__btn card__btn--favorites ${data.isFavorite ? `` : `card__btn--disabled`}">${data.isFavorite ? ` favorites` : ` `}</button>
          </div>

          <div class="card__color-bar-wave">
            <svg width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea class="card__text" placeholder="Start typing your text here..." name="text">${data.title}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${data.dueDate ? `no` : `yes`}</span>
                </button>

                <fieldset class="card__date-deadline" >
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      value="${data.dueDate[0]}"
                      placeholder="${data.dueDate[0]}"
                      name="date"
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      value="${data.dueDate[1]}"
                      placeholder="${data.dueDate[1]}"
                      name="time"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">no</span>
                </button>

                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-mo-1"
                      name="repeat"
                      value="mo"
                      ${data.repeatingDays.Mo ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-mo-1"
                      >mo</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-tu-1"
                      name="repeat"
                      value="tu"
                      ${data.repeatingDays.Tu ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-tu-1"
                      >tu</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-we-1"
                      name="repeat"
                      value="we"
                      ${data.repeatingDays.We ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-we-1"
                      >we</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-th-1"
                      name="repeat"
                      value="th"
                      ${data.repeatingDays.Th ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-th-1"
                      >th</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-fr-1"
                      name="repeat"
                      value="fr"
                      ${data.repeatingDays.Fr ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-fr-1"
                      >fr</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      name="repeat"
                      value="sa"
                      id="repeat-sa-1"
                      ${data.repeatingDays.Sa ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-sa-1"
                      >sa</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-su-1"
                      name="repeat"
                      value="su"
                      ${data.repeatingDays.Su ? ` checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-su-1"
                      >su</label
                    >
                  </div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">${makeTagsBtn(data.tags)}</div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <label class="card__img-wrap ${data.picture ? `` : ` card__img-wrap--empty`}">
              <input
                type="file"
                class="card__img-input visually-hidden"
                name="img"
              />
              <img
                src="${data.picture ? data.picture : ``}"
                alt="task picture"
                class="card__img"
              />
            </label>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-1"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                  checked
                />
                <label
                  for="color-black-1"
                  class="card__color card__color--black"
                  >black</label
                >
                <input
                  type="radio"
                  id="color-yellow-1"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                />
                <label
                  for="color-yellow-1"
                  class="card__color card__color--yellow"
                  >yellow</label
                >
                <input
                  type="radio"
                  id="color-blue-1"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                />
                <label
                  for="color-blue-1"
                  class="card__color card__color--blue"
                  >blue</label
                >
                <input
                  type="radio"
                  id="color-green-1"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                />
                <label
                  for="color-green-1"
                  class="card__color card__color--green"
                  >green</label
                >
                <input
                  type="radio"
                  id="color-pink-1"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                />
                <label
                  for="color-pink-1"
                  class="card__color card__color--pink"
                  >pink</label
                >
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
};
