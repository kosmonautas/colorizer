import ColorFactory from './ColorFactory';
import ColorHydrator from './ColorHydrator';

const config = {
  SUPPORTED_COLORS: ['green', 'blue', 'red', 'white', 'black'],
  PROCESSING_MODES: { PARALLEL: 'parallel', SEQUENTIAL: 'sequential' },
};

class Colorizer {
  constructor() {
    this.processingMode;
    this.setProcessingMode();
    this.colors = [];
    this.colorOrder = new Set();
  }

  setProcessingMode() {
    const processingMode = process.argv[2].toLowerCase();
    for (const k of Object.keys(config.PROCESSING_MODES)) {
      if (config.PROCESSING_MODES[k] === processingMode) {
        this.processingMode = config.PROCESSING_MODES[k];
        return;
      }
    }
    throw new Error(`Supported processing modes one of: ${Object.values(config.PROCESSING_MODES)}`);
  }

  parseArgColorOrder(orderOption) {
    let parsedOrder = [];
    try {
      parsedOrder = JSON.parse(orderOption);
    } catch (e) {
      throw new Error(`Color ordering expected to be a serialized JSON: ${e.message.toString()}`);
    }
    if (!Array.isArray(parsedOrder)) throw new Error(`Expected an array of color order, actual ${typeof parsedOrder}`);
    if (!parsedOrder.every(e => config.SUPPORTED_COLORS.includes(e)))
      throw new Error(`Invalid color found in color order. Supported colors: ${config.SUPPORTED_COLORS}`);
    return parsedOrder;
  }

  parseArgColorOption(option) {
    const opt = option.toLowerCase();
    if (opt === 'true') return true;
    if (opt === 'false') return false;
    throw new Error('Unparsable color option');
  }

  async processInParallel() {
    const hydrators = [];
    this.colors.forEach(color => hydrators.push(ColorHydrator.hydrate(color)));
    await Promise.all(hydrators);
    console.log(this.colors);
  }

  async processSequentially() {
    for (let i = 0; i < this.colors.length; i++) {
      await ColorHydrator.hydrate(this.colors[i]);
      console.log(this.colors[i]);
    }
  }

  async processColors() {
    if (this.processingMode == config.PROCESSING_MODES.SEQUENTIAL) await this.processSequentially();
    else await this.processInParallel();
  }

  instantiateColors() {
    this.colorOrder.forEach(colorName => this.colors.push(ColorFactory.getColor(colorName)));
  }

  processArguments() {
    const args = process.argv;
    // Handle color order arg
    const colorNamesInOrder = this.parseArgColorOrder(args[args.length - 1]);

    // Take color option args
    const colorOptionArgs = args.slice(3, args.length - 1);
    if (colorOptionArgs.length !== colorNamesInOrder.length)
      throw new Error(`Color options mismatch. Expected ${colorNamesInOrder.length} options, actual ${colorOptionArgs.length}`);

    // Dedup and pick "enabled" colors
    for (let i = 0; i < colorNamesInOrder.length; i++) {
      if (this.parseArgColorOption(colorOptionArgs[i])) {
        this.colorOrder.add(colorNamesInOrder[i]);
      }
    }
  }

  async main() {
    console.log('DEBUG: ', process.argv);
    this.processArguments();
    this.instantiateColors();
    await this.processColors();
    console.log('Done.');
  }
}

const colorizer = new Colorizer();
colorizer.main();
