export class Queue<T> {
  list: T[];
  constructor() {
    this.list = [];
  }
  push(...el: T[]) {
    this.list.push(...el);
  }
  top() {
    if (this.empty()) {
      throw new Error('Queue is empty');
    }
    return this.list[0];
  }

  pop() {
    if (this.empty()) {
      throw new Error('Queue is empty');
    }
    return this.list.shift();
  }

  empty() {
    return this.list.length == 0;
  }

  getQueue() {
    return this.list;
  }
}
