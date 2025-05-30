import { ColorValue } from 'react-native';

type ThemeColors = {
  PRIMARY: ColorValue;
  SECONDARY: ColorValue;
  BACKGROUND: {
    LIGHT: ColorValue;
    DARK: ColorValue;
  };
  TEXT: {
    LIGHT: ColorValue;
    DARK: ColorValue;
  };
  ICON: ColorValue;
  ERROR: ColorValue;
  SEPARATOR: ColorValue;
  FOOD_ITEM: ColorValue;
  BORDER: {
    SELECTED: ColorValue;
    TRANSPARENT: ColorValue;
  };
  FAB: ColorValue;
  WHITE: ColorValue;
  TINT: {
    LIGHT: ColorValue;
    DARK: ColorValue;
  };
  TAB_ICON: {
    DEFAULT: ColorValue;
    SELECTED: {
      LIGHT: ColorValue;
      DARK: ColorValue;
    };
  };
};

type ThemeSpacing = {
  PADDING: {
    VERTICAL: number;
    HORIZONTAL: number;
  };
  MARGIN: {
    TOP: number;
    BOTTOM: number;
    VERTICAL: number;
    HORIZONTAL: number;
    LEFT: number;
  };
};

type ThemeBorder = {
  RADIUS: {
    BUTTON: number;
    IMAGE: number;
    CONTAINER: number;
    PREVIEW: number;
  };
  WIDTH: number;
};

type ThemeIcon = {
  SIZE: {
    CAMERA: number;
    CHEVRON: number;
    ACCOUNT: number;
    MEALS: number;
    GRAPHICS: number;
    USER: number;
    BACK: number;
  };
  COLOR: ColorValue;
};

type ThemeImage = {
  SIZE: {
    CONTAINER: number;
    PREVIEW: number;
  };
};

type ThemeFont = {
  SIZE: {
    TITLE: number;
    SUBTITLE: number;
    NORMAL: number;
    SMALL: number;
    FOOD_NAME: number;
    DETAILS: number;
    NUMBER: number;
    MENU: number;
    NAME: number;
  };
};

type ThemeInput = {
  HEIGHT: number;
  BORDER_RADIUS: number;
};

type ThemeModal = {
  WIDTH: number;
  TOP_OFFSET: number;
  HEIGHT: number;
  BORDER_RADIUS: number;
  BORDER_WIDTH: number;
};

type ThemeOverlay = {
  OPACITY: number;
};

type ThemeLayout = {
  TAB_BAR: {
    MAX_HEIGHT: string;
  };
};

export type Theme = {
  COLORS: ThemeColors;
  SPACING: ThemeSpacing;
  BORDER: ThemeBorder;
  ICON: ThemeIcon;
  IMAGE: ThemeImage;
  FONT: ThemeFont;
  INPUT: ThemeInput;
  MODAL: ThemeModal;
  OVERLAY: ThemeOverlay;
  LAYOUT: ThemeLayout;
};

export const THEME: Theme = {
  COLORS: {
    PRIMARY: '#547260',
    SECONDARY: '#76A689',
    BACKGROUND: {
      LIGHT: '#FFFCEB',
      DARK: '#3C3C3C',
    },
    TEXT: {
      LIGHT: '#FFFCEB',
      DARK: '#FFFFFF',
    },
    ICON: '#435B4D',
    ERROR: '#FF6B6B',
    SEPARATOR: '#E3E3E3',
    FOOD_ITEM: '#F5F5F5',
    BORDER: {
      SELECTED: '#76A689',
      TRANSPARENT: 'transparent',
    },
    FAB: '#344e41',
    WHITE: '#FFFFFF',
    TINT: {
      LIGHT: '#2f95dc',
      DARK: '#fff',
    },
    TAB_ICON: {
      DEFAULT: '#ccc',
      SELECTED: {
        LIGHT: '#2f95dc',
        DARK: '#fff',
      },
    },
  },
  SPACING: {
    PADDING: {
      VERTICAL: 10,
      HORIZONTAL: 15,
    },
    MARGIN: {
      TOP: 20,
      BOTTOM: 50,
      VERTICAL: 5,
      HORIZONTAL: 10,
      LEFT: 10,
    },
  },
  BORDER: {
    RADIUS: {
      BUTTON: 8,
      IMAGE: 10,
      CONTAINER: 100,
      PREVIEW: 50,
    },
    WIDTH: 2,
  },
  ICON: {
    SIZE: {
      CAMERA: 40,
      CHEVRON: 24,
      ACCOUNT: 24,
      MEALS: 40,
      GRAPHICS: 30,
      USER: 30,
      BACK: 25,
    },
    COLOR: '#FFFFFF',
  },
  IMAGE: {
    SIZE: {
      CONTAINER: 200,
      PREVIEW: 150,
    },
  },
  FONT: {
    SIZE: {
      TITLE: 24,
      SUBTITLE: 20,
      NORMAL: 16,
      SMALL: 14,
      FOOD_NAME: 18,
      DETAILS: 16,
      NUMBER: 16,
      MENU: 20,
      NAME: 24,
    },
  },
  INPUT: {
    HEIGHT: 40,
    BORDER_RADIUS: 10,
  },
  MODAL: {
    WIDTH: 80,
    TOP_OFFSET: -10,
    HEIGHT: 300,
    BORDER_RADIUS: 30,
    BORDER_WIDTH: 5,
  },
  OVERLAY: {
    OPACITY: 0.9,
  },
  LAYOUT: {
    TAB_BAR: {
      MAX_HEIGHT: '10%',
    },
  },
} as const;
