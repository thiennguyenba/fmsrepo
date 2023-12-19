﻿var Language = function (t, e, n, s) {
    this.language = t, this.months = e, this.monthsAbbr = n, this.days = s, this.rtl = !1, this.ymd = !1, this.yearSuffix = ""
},
    prototypeAccessors = {
        language: {
            configurable: !0
        },
        months: {
            configurable: !0
        },
        monthsAbbr: {
            configurable: !0
        },
        days: {
            configurable: !0
        }
    };
prototypeAccessors.language.get = function () {
    return this._language
}, prototypeAccessors.language.set = function (t) {
    if ("string" != typeof t) throw new TypeError("Language must be a string");
    this._language = t
}, prototypeAccessors.months.get = function () {
    return this._months
}, prototypeAccessors.months.set = function (t) {
    if (12 !== t.length) throw new RangeError("There must be 12 months for " + this.language + " language");
    this._months = t
}, prototypeAccessors.monthsAbbr.get = function () {
    return this._monthsAbbr
}, prototypeAccessors.monthsAbbr.set = function (t) {
    if (12 !== t.length) throw new RangeError("There must be 12 abbreviated months for " + this.language + " language");
    this._monthsAbbr = t
}, prototypeAccessors.days.get = function () {
    return this._days
}, prototypeAccessors.days.set = function (t) {
    if (7 !== t.length) throw new RangeError("There must be 7 days for " + this.language + " language");
    this._days = t
}, Object.defineProperties(Language.prototype, prototypeAccessors);
var vi = new Language("Vietnamese", ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"], ["T 01", "T 02", "T 03", "T 04", "T 05", "T 06", "T 07", "T 08", "T 09", "T 10", "T 11", "T 12"], ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]);