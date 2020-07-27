const moment = require('moment');

module.exports = {

  dateFormat: function (date, format = 'LLL', locale = this.ctx.locale) {
    moment.locale(locale);
    return moment(date).format(format);
  },

  dateCalendar: function (date, locale = this.ctx.locale) {
    moment.locale(locale);
    return moment(date).calendar();
  },

  dateRelative: function (date, locale = this.ctx.locale) {
    moment.locale(locale);
    return moment(date).fromNow();
  },

  dateISO: (date) => {
    return moment(date).utc().format();
  }

};
