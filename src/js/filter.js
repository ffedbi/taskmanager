import Component from "./component";
import {createDOMElementFromHtml} from "./utils";

export default class Filter extends Component {
  constructor(data) {
    super();

    this._name = data.name;
    this._amount = data.amount;
    this._isChecked = data.isChecked;

    this._onFilter = null;
    this._onClickFilter = this._onClickFilter.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onClickFilter(e) {
    e.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  get name() {
    return this._name.toLowerCase();
  }

  get template() {
    const captionLowered = this._name.toLowerCase();
    return `<div><input type="radio" id="filter__${captionLowered}" class="filter__input visually-hidden" name="filter" ${this._isChecked ? ` checked` : ``} ${this._amount === 0 ? ` disabled` : ``}>
            <label for="filter__${captionLowered}" class="filter__label">${this._name.toUpperCase()} <span class="filter__${captionLowered}-count">${this._amount}</span></label></div>`.trim();
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`.filter__label`).addEventListener(`click`, this._onClickFilter);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.querySelector(`.filter__label`).removeEventListener(`click`, this._onClickFilter);
    }
  }

  render() {
    this.destroy();
    this._element = createDOMElementFromHtml(this.template);
    this._bind();
    return this._element;
  }
}

