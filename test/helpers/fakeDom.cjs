class FakeElement {
  constructor(tagName = "div", options = {}) {
    this.tagName = tagName;
    this.children = [];
    this.parent = null;
    this.classes = new Set();
    this.attributes = {};
    this.listeners = {};
    this.textContent = "";
    this.scrollTop = 0;
    this.scrollHeight = 0;

    if (options.cls) {
      for (const cls of options.cls.split(/\s+/).filter(Boolean)) {
        this.classes.add(cls);
      }
    }

    if (options.text) {
      this.textContent = options.text;
    }

    if (options.attr) {
      Object.assign(this.attributes, options.attr);
    }
  }

  createDiv(options = {}) {
    const child = new FakeElement("div", options);
    this.appendChild(child);
    return child;
  }

  createEl(tagName, options = {}) {
    const child = new FakeElement(tagName, options);
    this.appendChild(child);
    return child;
  }

  createSpan(options = {}) {
    const child = new FakeElement("span", options);
    this.appendChild(child);
    return child;
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    this.recalculateText();
  }

  empty() {
    this.children = [];
    this.textContent = "";
    this.recalculateText();
  }

  remove() {
    if (!this.parent) {
      return;
    }

    this.parent.children = this.parent.children.filter((child) => child !== this);
    this.parent.recalculateText();
    this.parent = null;
  }

  addClass(cls) {
    this.classes.add(cls);
  }

  removeClass(cls) {
    this.classes.delete(cls);
  }

  hasClass(cls) {
    return this.classes.has(cls);
  }

  toggleClass(cls, force) {
    if (force) {
      this.classes.add(cls);
      return;
    }

    this.classes.delete(cls);
  }

  setText(text) {
    this.textContent = text;
    this.recalculateText();
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  recalculateText() {
    const childText = this.children.map((child) => child.textContent).join("");
    this.textContent = `${this.textContent && !this.children.length ? this.textContent : ""}${childText}`;
    if (this.parent) {
      this.parent.recalculateText();
    }
    this.scrollHeight = this.children.length;
  }
}

class FakeItemView {
  constructor(leaf) {
    this.leaf = leaf;
    this.contentEl = new FakeElement("div");
  }
}

function getEntryActions(entryEl) {
  return entryEl.children[1].children[1];
}

module.exports = {
  FakeElement,
  FakeItemView,
  getEntryActions,
};
