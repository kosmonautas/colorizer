const { getColor } = require('./apiMock');

export default class ColorHydrator {
  static fetch(color) {
    return getColor(color.name);
  }

  static hydrate(color) {
    return this.fetch(color).then(data => {
      color.hexCode = data.HEX;
      color.rgbCode = data.RGB;
    });
  }
}
