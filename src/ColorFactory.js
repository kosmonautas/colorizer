import { Green, Blue, Red, White, Black } from './classes';

export default class ColorFactory {
  static getColor(color) {
    switch (color) {
      case 'green':
        return new Green();
      case 'blue':
        return new Blue();
      case 'red':
        return new Red();
      case 'white':
        return new White();
      case 'black':
        return new Black();
      default:
        return null;
    }
  }
}
