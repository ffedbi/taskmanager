import Component from "./component";
import moment from "moment";

export default class Task extends Component {
  constructor(data) {
    super();

    this._color = data.color;
    this._isDone = data.isDone;
    this._isFavorite = data.isFavorite;
    this._title = data.title;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
    this._tags = data.tags;
    this._picture = data.picture;
    this._id = data.id;

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
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

  _isRepeatingTask() {
    return Object.values(this._repeatingDays).some((item) => item === 1);
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _checkDeadlineTask() {
    return this._dueDate < Date.now() ? `card--deadline` : ``;
  }

  get template() {
    const dueDate = moment(new Date(this._dueDate));
    return `<article class="card card--${this._color} ${this._isRepeatingTask() ? `card--repeat` : ``} ${this._checkDeadlineTask()}" id="${this._id}">
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
        <label><textarea class="card__text" placeholder="Start typing your text here..." name="text">${this._title}</textarea></label>
      </div>
      <div class="card__settings">
      
        <div class="card__details">
          <button class="card__date-deadline-toggle" type="button">date: <span class="card__date-status">${this._dueDate ? `no` : `yes`}</span></button>
              <fieldset class="card__date-deadline" >
                <label class="card__input-deadline-wrap">
                  <input class="card__date" type="text" value="${dueDate.format(`D MMMM`)}" placeholder="${dueDate.format(`D MMMM`)}" name="date"/>
                </label>
                <label class="card__input-deadline-wrap">
                  <input class="card__time" type="text" value="${dueDate.format(`h:mm A`)}" placeholder="${dueDate.format(`h:mm A`)}" name="time"/>
                </label>
              </fieldset>
            <div class="card__hashtag">
              <div class="card__hashtag-list">${this._createTagsHtml(this._tags)}</div>
            </div>
        </div>
        
        <label class="card__img-wrap ${this._picture ? `` : ` card__img-wrap--empty`}">
          <input type="file" class="card__img-input visually-hidden" name="img"/>
          <img src="${this._picture ? this._picture : ``}" alt="task picture" class="card__img"/>
        </label>

      <div class="card__status-btns">
        <button class="card__save" type="submit">save</button>
        <button class="card__delete" type="button">delete</button>
      </div>
      
    </div>
  </form>
</article>`;
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditButtonClick);
      this._element.querySelector(`.card__text`).addEventListener(`click`, this._onEditButtonClick);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onEditButtonClick);
      this._element.querySelector(`.card__text`).removeEventListener(`click`, this._onEditButtonClick);
    }
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
  }
}


