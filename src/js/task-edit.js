import {Component} from "./component";
import flatpickr from "flatpickr";
import moment from "moment";
import {createDOMElementFromHtml} from "./utils";

export class TaskEdit extends Component {
  constructor(data) {
    super();

    this._color = data.color;
    this._type = data.type;
    this._isDone = data.isDone;
    this._isFavorite = data.isFavorite;
    this._title = data.title;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._tags = data.tags;
    this._picture = data.picture;
    this._id = data.id;

    this._state.isDate = false;
    this._state.isRepeated = false;
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);

    this._onSubmit = null;
    this._onKeyEsc = null;
    this._onSubmitBtnClick = this._onSubmitBtnClick.bind(this);
    this._onKeydownEsc = this._onKeydownEsc.bind(this);

    this._onChangeColorTask = this._onChangeColorTask.bind(this);
    this._onPushedHashtag = this._onPushedHashtag.bind(this);
    this._onDelHashtag = this._onDelHashtag.bind(this);
  }

  _onChangeColorTask(evt) {
    const color = `card--${evt.target.value}`;
    this._element.className = `card card--edit`;
    this._element.classList.add(color);
  }

  _onDelHashtag(evt) {
    const button = evt.target.parentNode;
    const value = this._element.querySelector(`input`).value;
    this._tags.delete(value);
    this._element.querySelector(`.card__hashtag-list`).removeChild(button);
  }

  _processForm(formData) {
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
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onKeydownEsc(e) {
    if (typeof this._onKeyEsc === `function` && e.keyCode === 27 && this._element.hasFocus()) {
      this._onKeyEsc();
    }
  }

  _onPushedHashtag(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      e.preventDefault();
      this._addNewHastag(this._element);
      this._tags.add(e.target.value);
      e.target.value = ``;
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onKeyEsc(fn) {
    this._onKeyEsc = fn;
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitBtnClick);
      document.addEventListener(`keydown`, this._onKeydownEsc);

      this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeDate);
      this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeRepeated);

      if (this._state.isDate) {
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
      }

      this._element.querySelector(`.card__hashtag-input`).addEventListener(`change`, this._onPushedHashtag);
      this._element.querySelectorAll(`.card__colors-wrap`).forEach((item) => item.addEventListener(`change`, this._onChangeColorTask));
      this._element.querySelectorAll(`.card__hashtag-delete`).forEach((item) => item.addEventListener(`click`, this._onDelHashtag));
    }
  }

  _unbind() {
    if (this._element) {
      this._element.removeEventListener(`submit`, this._onSubmitBtnClick);
      document.removeEventListener(`keydown`, this._onKeydownEsc);

      this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeDate);
      this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeRepeated);
      this._element.querySelectorAll(`.card__colors-wrap`).forEach((item) => item.removeEventListener(`change`, this._onChangeColorTask));
      this._element.querySelectorAll(`.card__hashtag-delete`).forEach((item) => item.removeEventListener(`click`, this._onDelHashtag));

      flatpickr(this._element.querySelector(`.card__date`)).destroy();
      flatpickr(this._element.querySelector(`.card__time`)).destroy();
    }
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  _addNewHastag(e) {
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
        target.dueDate = value;
      },
    };
  }

  _onChangeDate() {
    this._state.isDate = !this._state.isDate;
    this._unbind();
    this._partialUpdate();
    this._bind();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this._unbind();
    this._partialUpdate();
    this._bind();
  }

  get template() {
    const dueDate = moment(new Date(this._dueDate));
    return `<article class="card card--edit card--${this._color} ${this._type ? `card--${this._type}` : ``}" id="${this._id}">
  <form class="card__form" method="get">
    <div class="card__inner">
      <div class="card__control">
        <button type="button" class="card__btn card__btn--edit">edit</button>
        <button type="button" class="card__btn ${this._isDone ? ` card__btn--archive` : ``}">${this._isDone ? `archive` : ``}</button>
        <button type="button" class="card__btn card__btn--favorites ${this._isFavorite ? `` : `card__btn--disabled`}">${this._isFavorite ? ` favorites` : ` `}</button>
      </div>

      <div class="card__color-bar-wave">
        <svg width="100%" height="10">
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
            <button class="card__date-deadline-toggle" type="button">date: <span class="card__date-status">${this._dueDate ? `no` : `yes`}</span></button>
            <fieldset class="card__date-deadline" ${!this._state.isDate && `disabled`}>
              <label class="card__input-deadline-wrap">
                <input class="card__date" type="text" value="${dueDate.format(`DD MMMM`)}" placeholder="${dueDate.format(`DD MMMM`)}" name="date"/>
              </label>
              <label class="card__input-deadline-wrap">
                <input class="card__time" type="text" value="${dueDate.format(`h:mm A`)}"  placeholder="${dueDate.format(`h:mm A`)}" name="time"/>
              </label>
            </fieldset>

            <button class="card__repeat-toggle" type="button">repeat: <span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span></button>

            <fieldset class="card__repeat-days" ${!this._state.isRepeated && `disabled`}>
              <div class="card__repeat-days-inner">
                <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-mo-${this._id}" name="repeat" value="mo" ${this._repeatingDays.mo && ` checked`}/>
                <label class="card__repeat-day" for="repeat-mo-${this._id}">mo</label>
                <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-tu-${this._id}" name="repeat" value="tu" ${this._repeatingDays.tu && ` checked`}/>
                <label class="card__repeat-day" for="repeat-tu-${this._id}">tu</label>
                <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-we-${this._id}" name="repeat" value="we" ${this._repeatingDays.we && ` checked`}/>
                <label class="card__repeat-day" for="repeat-we-${this._id}">we</label>
                <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-th-${this._id}" name="repeat" value="th" ${this._repeatingDays.th && ` checked`}/>
                <label class="card__repeat-day" for="repeat-th-${this._id}">th</label>
                <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-fr-${this._id}" name="repeat" value="fr" ${this._repeatingDays.fr && ` checked`}/>
                <label class="card__repeat-day" for="repeat-fr-${this._id}">fr</label>
                <input class="visually-hidden card__repeat-day-input" type="checkbox" name="repeat" value="sa" id="repeat-sa-${this._id}" ${this._repeatingDays.sa && ` checked`}/>
                <label class="card__repeat-day" for="repeat-sa-${this._id}">sa</label>
                <input class="visually-hidden card__repeat-day-input" type="checkbox" id="repeat-su-${this._id}" name="repeat" value="su" ${this._repeatingDays.su && ` checked`}/>
                <label class="card__repeat-day" for="repeat-su-${this._id}">su</label>
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
          <input type="file" class="card__img-input visually-hidden" name="img"/>
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
