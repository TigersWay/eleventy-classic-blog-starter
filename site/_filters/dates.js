const
  dayjs = require('dayjs');

dayjs
  .extend(require('dayjs/plugin/localizedFormat'))
  .extend(require('dayjs/plugin/relativeTime'));

const
  dayjsLocales = { // dayjs sometimes don't use the right format!
    'en-GB': 'en-gb',
    // 'en-US': 'en',
  };

Object.values(dayjsLocales).forEach(locale => require(`dayjs/locale/${locale}`));


module.exports = {

  dateFormat: function (date, format = 'LLL', locale = this.ctx.site.locale) {
    return dayjs(date).locale(dayjsLocales[locale]).format(format);
  },

  dateRelative: function (date, locale = this.ctx.site.locale) {
    return dayjs(date).locale(dayjsLocales[locale]).fromNow();
  },

  dateISO: (date) => dayjs(date).toISOString(),
  dateRSS: (date) => dayjs(date).format('ddd, D MMM YYYY HH:mm:ss ZZ')

};
