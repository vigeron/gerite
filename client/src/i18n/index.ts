import Vue from 'vue';
import VueI18n from 'vue-i18n';

/* fix null i18n */
const I18nPlugin = {
  /* eslint no-underscore-dangle: 0 */
  install() {
    const $tt = Vue.prototype.$t;
    Vue.prototype.$tt = $tt;
    Vue.prototype.$t = function (...args: any) {
      if (this.$i18n) {
        return $tt.apply(this, args);
      }
      return $tt.apply(this.$root, args);
    };
  },
};

Vue.use(VueI18n);
Vue.use(I18nPlugin);

function loadLocaleMessages() {
  const locales = require.context('./data', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: {[ k: string]: any} = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}
export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
});
