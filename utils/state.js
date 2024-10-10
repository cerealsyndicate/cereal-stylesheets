class State {
  constructor() {
    this.data = []
  }

  get() {
    return this.data;
  }

  add(items) {
    this.data.push(...items);
  }

  clear() {
    this.data = [];
  }
}

const state = new State();
export default state;
