import Component from "./component";
import flatpickr from "flatpickr";
import moment from "moment";
import {createDOMElementFromHtml, createPreview} from "./utils";

export default class TaskEdit extends Component {
  constructor(data) {
    super();

    this._color = data.color;
    this._isDone = data.isDone;
    this._isFavorite = data.isFavorite;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._tags = data.tags;
    this._picture = data.picture;
    this._id = data.id;
    this._state = {
      isDate: false,
      isRepeated: this._isRepeatingTask(),
    };

    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);

    this._onSubmit = null;
    this._onKeyEsc = null;
    this._onDelete = null;
    this._onSubmitBtnClick = this._onSubmitBtnClick.bind(this);
    this._onKeydownEsc = this._onKeydownEsc.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);

    this._onChangeColorTask = this._onChangeColorTask.bind(this);
    this._onAddedHashtag = this._onAddedHashtag.bind(this);
    this._onDeleteHashtag = this._onDeleteHashtag.bind(this);
    this._onChangePicture = this._onChangePicture.bind(this);
    this._onChangeTaskDate = this._onChangeTaskDate.bind(this);
    this._onDayRepeatClick = this._onDayRepeatClick.bind(this);
  }

  _onChangePicture() {
    const input = this._element.querySelector(`.card__img-input`);
    const preview = this._element.querySelector(`.card__img`);
    createPreview(input, preview);
  }

  _onChangeColorTask(evt) {
    const color = `card--${evt.target.value}`;
    this._element.className = `card card--edit`;
    this._element.classList.add(color);
  }

  static _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: new Date(),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      picture: ``,
    };

    const taskEditMapper = TaskEdit.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }
    return entry;
  }

  _createTagsHtml() {
    let tagsHTML = ``;
    for (let item of this._tags) {
      tagsHTML += `
            <span class="card__hashtag-inner">
              <input type="hidden" name="hashtag" value="${item}" class="card__hashtag-hidden-input"/>
              <button type="button" class="card__hashtag-name">#${item}</button>
              <button type="button" class="card__hashtag-delete">delete</button>
            </span>`.trim();
    }
    return tagsHTML;
  }

  _onSubmitBtnClick(e) {
    e.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = TaskEdit._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onKeydownEsc(e) {
    if (typeof this._onKeyEsc === `function` && e.keyCode === 27) {
      this._onKeyEsc();
    }
  }

  _onDeleteButtonClick(e) {
    e.preventDefault();
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onAddedHashtag(e) {
    /* !!! validation */
    e.preventDefault();
    if (e.keyCode === 13) {
      this._createHtmlNewHashtag(e);
      this._tags.add(e.target.value);
      e.target.value = ``;
    }
  }

  _onDeleteHashtag(evt) {
    const button = evt.target.parentNode;
    const value = this._element.querySelector(`input`).value;
    this._tags.delete(value);
    this._element.querySelector(`.card__hashtag-list`).removeChild(button);
  }

  _onDayRepeatClick(e) {
    if (e.target.tagName.toLowerCase() === `input`) {
      this._repeatingDays[e.target.value] = !this._repeatingDays[e.target.value];
    }
  }

  _onChangeTaskDate(e) {
    if (e.target.className === `card__date flatpickr-input`) {
      const taskDate = moment(this._dueDate);
      const inputValue = moment(e.target.value, `D MMMM`);
      taskDate.month(inputValue.month());
      taskDate.date(inputValue.date());

      this._dueDate = taskDate;
      this._checkDeadlineTask();
    }

    if (e.target.className === `card__time flatpickr-input`) {
      const taskDate = moment(this._dueDate);
      const inputValue = moment(e.target.value, `h:mm A`);

      taskDate.hour(inputValue.hour());
      taskDate.minute(inputValue.minute());
      this._dueDate = taskDate;
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onKeyEsc(fn) {
    this._onKeyEsc = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitBtnClick);
      document.addEventListener(`keydown`, this._onKeydownEsc);
      this._element.querySelector(`.card__delete`).addEventListener(`click`, this._onDeleteButtonClick);

      this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeDate);
      this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeRepeated);

      flatpickr(this._element.querySelector(`.card__date`), {
        altInput: true,
        altFormat: `j F`,
        dateFormat: `j F`,
      });
      flatpickr(this._element.querySelector(`.card__time`), {
        enableTime: true,
        noCalendar: true,
        altInput: true,
        altFormat: `h:i K`,
        dateFormat: `h:i K`,
      });

      this._element.querySelector(`.card__hashtag-input`).addEventListener(`change`, this._onAddedHashtag);
      this._element.querySelectorAll(`.card__colors-wrap`).forEach((item) => item.addEventListener(`change`, this._onChangeColorTask));
      this._element.querySelectorAll(`.card__hashtag-delete`).forEach((item) => item.addEventListener(`click`, this._onDeleteHashtag));
      this._element.querySelector(`.card__img-input`).addEventListener(`change`, this._onChangePicture);
      this._element.querySelector(`.card__date-deadline`).addEventListener(`change`, this._onChangeTaskDate);
      this._element.querySelector(`.card__repeat-days-inner`).addEventListener(`click`, this._onDayRepeatClick);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.removeEventListener(`submit`, this._onSubmitBtnClick);
      document.removeEventListener(`keydown`, this._onKeydownEsc);
      this._element.querySelector(`.card__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
      flatpickr(this._element.querySelector(`.card__date`)).destroy();
      flatpickr(this._element.querySelector(`.card__time`)).destroy();

      this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeDate);
      this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeRepeated);
      this._element.querySelectorAll(`.card__colors-wrap`).forEach((item) => item.removeEventListener(`change`, this._onChangeColorTask));
      this._element.querySelectorAll(`.card__hashtag-delete`).forEach((item) => item.removeEventListener(`click`, this._onDeleteHashtag));
      this._element.querySelector(`.card__img-input`).removeEventListener(`click`, this._onChangePicture);
      this._element.querySelector(`.card__repeat-days-inner`).removeEventListener(`click`, this._onDayRepeatClick);
    }
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  render() {
    super.render();
  }

  lockTaskToSaving() {
    this._element.querySelector(`.card__save`).disabled = true;
    this._element.querySelector(`.card__save`).textContent = `Saving...`;
    this._element.querySelector(`.card__text`).disabled = true;
  }

  unblockTaskSave() {
    this._element.querySelector(`.card__save`).disabled = false;
    this._element.querySelector(`.card__save`).textContent = `Save`;
    this._element.querySelector(`.card__text`).disabled = false;
  }

  lockTaskToDeleting() {
    this._element.querySelector(`.card__delete`).disabled = true;
    this._element.querySelector(`.card__delete`).textContent = `Deleting...`;
    this._element.querySelector(`.card__text`).disabled = true;
  }

  unblockTaskDelete() {
    this._element.querySelector(`.card__delete`).disabled = false;
    this._element.querySelector(`.card__delete`).textContent = `Delete`;
    this._element.querySelector(`.card__text`).disabled = false;
  }

  setBorderColorTask(color) {
    this._element.querySelector(`.card__inner`).style.borderColor = color;
  }

  shake() {
    this._element.querySelector(`.card__inner`).style.borderColor = `#ff000`;
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _createHtmlNewHashtag(e) {
    e.preventDefault();
    const hashtagsList = this._element.querySelector(`.card__hashtag-list`);
    const hashtag = this._element.querySelector(`.card__hashtag-input`).value;

    const template = `<span class="card__hashtag-inner">
    <input type="hidden" name="hashtag" value="${hashtag}" class="card__hashtag-hidden-input"/>
    <button type="button" class="card__hashtag-name">#${hashtag}</button>
    <button type="button" class="card__hashtag-delete">delete</button>
  </span>`.trim();
    hashtagsList.appendChild(createDOMElementFromHtml(template));
  }

  static createMapper(target) {
    return {
      hashtag(value) {
        if (value) {
          target.tags.add(value);
        }
      },
      text(value) {
        target.title = value;
      },
      color(value) {
        target.color = value;
      },
      repeat(value) {
        target.repeatingDays[value] = true;
      },
      date(value) {
        const taskDate = moment(target.dueDate);
        const inputValue = moment(value, `D MMMM`);
        taskDate.month(inputValue.month());
        taskDate.date(inputValue.date());

        target.dueDate = taskDate;
      },
      time(value) {
        const taskDate = moment(target.dueDate);
        const inputValue = moment(value, `h:mm A`);

        taskDate.hour(inputValue.hour());
        taskDate.minute(inputValue.minute());
        target.dueDate = taskDate;
      },
      img(value) {
        // TODO как правильно обработать полученное изображение для отправки?
        target.picture = value;
      },
    };
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this._partialUpdate();
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this._partialUpdate();
  }

  _partialUpdate() {
    this._unbind();
    this._element.innerHTML = this.template;
    this._bind();
  }

  _createHtmlRepeatDays() {
    let str = ``;
    Object.keys(this._repeatingDays).forEach((item) => {
      str += `<input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-${item}-${this._id}" name="repeat" value="${item}" ${this._repeatingDays[item] && ` checked`}/>
      <label class="card__repeat-day" for="repeat-${item}-${this._id}">${item}</label>`.trim();
    });

    return str;
  }

  _isRepeatingTask() {
    return Object.values(this._repeatingDays).some((item) => item === true);
  }

  _checkDeadlineTask() {
    return this._dueDate < Date.now() ? `card--deadline` : ``;
  }

  get template() {
    const dueDate = moment(new Date(this._dueDate));
    return `<article class="card card--edit card--${this._color} ${this._isRepeatingTask() ? `card--repeat` : ``} ${this._checkDeadlineTask()}" id="${this._id}">
  <form class="card__form" method="get">
    <div class="card__inner">
      <div class="card__control">
        <button type="button" class="card__btn card__btn--edit">edit</button>
        <button type="button" class="card__btn ${this._isDone ? ` card__btn--archive` : ``}">${this._isDone ? `archive` : ``}</button>
        <button type="button" class="card__btn card__btn--favorites ${this._isFavorite ? `` : `card__btn--disabled`}">${this._isFavorite ? ` favorites` : ` `}</button>
      </div>

      <div class="card__color-bar">
        <svg class="card__color-bar-wave" width="100%" height="10">
          <use xlink:href="#wave"></use>
        </svg>
      </div>

      <div class="card__textarea-wrap">
        <label>
          <textarea class="card__text" placeholder="Start typing your text here..." name="text">${this._title}</textarea>
        </label>
      </div>

      <div class="card__settings">
        <div class="card__details">
          <div class="card__dates">
            <button class="card__date-deadline-toggle" type="button">date: <span class="card__date-status">${this._state.isDate ? `no` : `yes`}</span></button>
            <fieldset class="card__date-deadline" ${this._state.isDate && `disabled`}>
              <label class="card__input-deadline-wrap">
                <input class="card__date" type="text" value="${dueDate.format(`D MMMM`)}" placeholder="${dueDate.format(`D MMMM`)}" name="date"/>
              </label>
              <label class="card__input-deadline-wrap">
                <input class="card__time" type="text" value="${dueDate.format(`h:mm A`)}"  placeholder="${dueDate.format(`h:mm A`)}" name="time"/>
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">repeat: <span class="card__repeat-status">${this._state.isRepeated ? `no` : `yes`}</span></button>

            <fieldset class="card__repeat-days" ${this._state.isRepeated && `disabled`}>
              <div class="card__repeat-days-inner">
                <div class="card__repeat-days-inner">
                  ${this._createHtmlRepeatDays()}
                </div>
              </div>
            </fieldset>
          </div>

          <div class="card__hashtag">
            <div class="card__hashtag-list">${this._createTagsHtml(this._tags)}</div>
            <label>
              <input type="text" class="card__hashtag-input" name="hashtag" placeholder="Type new hashtag here"/>
            </label>
          </div>
        </div>

        <label class="card__img-wrap ${this._picture ? `` : ` card__img-wrap--empty`}">
          <input type="file" class="card__img-input visually-hidden" name="img" accept="image/jpeg,image/png,image/jpg"/>
          <img src="${this._picture ? this._picture : ``}" alt="task picture"class="card__img"/>
        </label>

        <div class="card__colors-inner">
          <h3 class="card__colors-title">Color</h3>
          <div class="card__colors-wrap">
            <input type="radio" id="color-black-${this._id}" class="card__color-input card__color-input--black visually-hidden" name="color" value="black"  ${this._color === `black` && `checked`} checked/>
            <label for="color-black-${this._id}" class="card__color card__color--black">black</label>
            <input type="radio" id="color-yellow-${this._id}" class="card__color-input card__color-input--yellow visually-hidden" name="color" value="yellow"  ${this._color === `yellow` && `checked`}/>
            <label for="color-yellow-${this._id}" class="card__color card__color--yellow">yellow</label>
            <input type="radio" id="color-blue-${this._id}" class="card__color-input card__color-input--blue visually-hidden" name="color" value="blue"  ${this._color === `blue` && `checked`}/>
            <label for="color-blue-${this._id}" class="card__color card__color--blue">blue</label>
            <input type="radio" id="color-green-${this._id}" class="card__color-input card__color-input--green visually-hidden" name="color" value="green"  ${this._color === `green` && `checked`}/>
            <label for="color-green-${this._id}" class="card__color card__color--green">green</label>
            <input type="radio" id="color-pink-${this._id}" class="card__color-input card__color-input--pink visually-hidden" name="color" value="pink" ${this._color === `pink` && `checked`}/>
            <label for="color-pink-${this._id}" class="card__color card__color--pink">pink</label>
          </div>
        </div>
      </div>

      <div class="card__status-btns">
        <button class="card__save" type="submit">save</button>
        <button class="card__delete" type="button">delete</button>
      </div>
    </div>
  </form>
</article>`.trim();
  }
}
