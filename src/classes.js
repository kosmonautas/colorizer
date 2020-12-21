class Color {
  constructor(name) {
    this.name = name;
    this.hex = null;
    this.rgb = null;
  }

  set hexCode(hex) {
    this.hex = hex;
  }

  set rgbCode(rgb) {
    this.rgb = rgb;
  }
}

class Green extends Color {
  constructor() {
    super('green');
  }
}

class Blue extends Color {
  constructor() {
    super('blue');
  }
}

class Red extends Color {
  constructor() {
    super('red');
  }
}

class White extends Color {
  constructor() {
    super('white');
  }
}

class Black extends Color {
  constructor() {
    super('black');
  }
}

export { Green, Blue, Red, White, Black };
