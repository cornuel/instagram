export const FILTER_TEMPLATES = [
  {
    name: 'Original',
    filter: {}
  },
  {
    name: 'Clarendon',
    filter: {
      contrast: 1.2,
      saturate: 1.35
    }
  },
  {
    name: 'Gingham',
    filter: {
      'hue-rotate': -10,
      brightness: 1.05
    }
  },
  {
    name: 'Moon',
    filter: {
      brightness: 1.1,
      contrast: 1.1,
      grayscale: 1
    }
  },
  {
    name: 'Lark',
    filter: {
      contrast: 0.9
    }
  },
  {
    name: 'Reyes',
    filter: {
      sepia: 0.22,
      contrast: 0.85,
      brightness: 1.1,
      saturate: 0.75
    }
  },
  {
    name: 'Juno',
    filter: {
      contrast: 1.2,
      brightness: 1.1,
      saturate: 1.4,
      sepia: 0.2,
      'hue-rotate': -10
    }
  },
  {
    name: 'Slumber',
    filter: {
      brightness: 1.05,
      saturate: 0.66,
      grayscale: 0.1
    }
  },
  {
    name: 'Crema',
    filter: {
      contrast: 0.9,
      brightness: 1.05,
      saturate: 0.8
    }
  },
  {
    name: 'Ludwig',
    filter: {
      contrast: 1.2,
      brightness: 1.1,
      saturate: 1.4,
      grayscale: 0.1
    }
  },
  {
    name: 'Aden',
    filter: {
      'hue-rotate': -20,
      contrast: 0.9,
      saturate: 0.85,
      brightness: 1.05,
      grayscale: 0.1
    }
  },
  {
    name: 'Perpetua',
    filter: {
      contrast: 0.9,
      brightness: 1.05,
      saturate: 0.8,
      grayscale: 0.1
    }
  }
]

export const DEFAULT_FILTER = {
  brightness: 1,
  contrast: 1,
  saturate: 1,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  'hue-rotate': 0,
  temperature: 0,
}

export const DEFAULT_ADJUST = {
  brightness: 0,
  contrast: 0,
  saturate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  'hue-rotate': 0,
  temperature: 0,
  vignette: 0
}
