export const themesMap = {};

/**
 * themesMap - object with all included themes
 * wich located in modules/theming/themes/*.js
 * we load them dynamically
 *
 * this module provides API:
 *
 * - selectTheme(themeName: string) selects the current theme
 *
 * - getTheme(): object returns current theme object
 *
 * - getThemesList(): arrayOf(strings) returns names of loaded themes
 *
 * - setTheme(theme: object) adds new or updates existing theme
 *
 * Usage:
 *
 * We don't store theme data in clientStore, we provide getTheme() API instead
 * We pass theme data to all containers automatically via `gen_podda_loader`
 * to use it inside components you may use `this.props.theme`
 *
 */


const reqThemes = require.context('../themes/', true, /.js$/);
reqThemes.keys().forEach((filename) => {
  const theme = reqThemes(filename).default;
  themesMap[theme.name] = theme;
});

export function updateThemesList(clientStore) {
  const themingOptions = clientStore.get('themingOptions');
  themingOptions.themesList = Object.keys(themesMap);
  clientStore.set('themingOptions', themingOptions);
}

function ensureTheme(currentTheme, themeName) {
  if (Object.keys(themesMap).indexOf(themeName) > -1) {
    return themeName;
  }
  return currentTheme;
}

function setTheme(theme) {
  var themeName = theme.name || 'Theme ' + themesMap.length;
  themesMap[themeName] = {
    theme,
    name: themeName,
  };
}

export default {
  selectTheme({ clientStore }, themeName) {
    const uiOptions = clientStore.get('uiOptions');
    uiOptions.currentTheme = ensureTheme(clientStore.get('currentTheme'), themeName);
    clientStore.set('uiOptions', uiOptions);
  },

  getTheme({ clientStore }) {
    var themeName = clientStore.get('uiOptions').currentTheme;
    return themesMap[themeName];
  },

  getThemesList({ clientStore }) {
    return clientStore.get('themingOptions').themesList;
  },

  setTheme({ clientStore }, theme) {
    setTheme(theme);
    updateThemesList(clientStore);
  }
};