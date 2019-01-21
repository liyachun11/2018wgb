//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla
define(['angular'], function (angular) {
  "use strict";
  var app = angular.module('ionic-datepicker', ['ionic']);

  app.service('DatepickerService', function () {

    this.monthsList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    this.yearsList = [2000,
      2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
      2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
      2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
      2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040,
      2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050
    ];

  });

  app.directive('ionicDatepicker', ['$ionicPopup', 'DatepickerService', function ($ionicPopup, DatepickerService) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        ipDate: '=idate',
        disablePreviousDates: '=disablepreviousdates',
        disableFutureDates: '=disablefuturedates',
        callback: '=callback',
        title: '=title'
      },
      link: function (scope, element, attrs) {

        scope.datePickerTitle = scope.title || 'Select Date';

        var monthsList = DatepickerService.monthsList;
        scope.monthsList = monthsList;
        scope.yearsList = DatepickerService.yearsList;

        scope.currentMonth = '';
        scope.currentYear = '';

        if (!scope.ipDate) {
          scope.ipDate = new Date();
        }

        scope.previousDayEpoch = (+(new Date()) - 86400000);
        scope.nextDayEpoch = (+(new Date()));

        var currentDate = angular.copy(scope.ipDate);
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        scope.selctedDateString = currentDate.toString();
        scope.weekNames = ['日', '一', '二', '三', '四', '五', '六'];
        scope.today = {};

        var tempTodayObj = new Date();
        var tempToday = new Date(tempTodayObj.getFullYear(), tempTodayObj.getMonth(), tempTodayObj.getDate());

        scope.today = {
          dateObj: tempTodayObj,
          date: tempToday.getDate(),
          month: tempToday.getMonth(),
          year: tempToday.getFullYear(),
          day: tempToday.getDay(),
          dateString: tempToday.toString(),
          epochLocal: tempToday.getTime(),
          epochUTC: (tempToday.getTime() + (tempToday.getTimezoneOffset() * 60 * 1000))
        };

        var refreshDateList = function (current_date) {
          current_date.setHours(0);
          current_date.setMinutes(0);
          current_date.setSeconds(0);
          current_date.setMilliseconds(0);

          scope.selctedDateString = (new Date(current_date)).toString();
          currentDate = angular.copy(current_date);

          var firstDay = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDate();
          var lastDay = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate();

          scope.dayList = [];

          for (var i = firstDay; i <= lastDay; i++) {
            var tempDate = new Date(current_date.getFullYear(), current_date.getMonth(), i);
            scope.dayList.push({
              date: tempDate.getDate(),
              month: tempDate.getMonth(),
              year: tempDate.getFullYear(),
              day: tempDate.getDay(),
              dateString: tempDate.toString(),
              epochLocal: tempDate.getTime(),
              epochUTC: (tempDate.getTime() + (tempDate.getTimezoneOffset() * 60 * 1000))
            });
          }

          var firstDay = scope.dayList[0].day;

          scope.currentMonthFirstDayEpoch = scope.dayList[0].epochLocal;
          scope.currentMonthLastDayEpoch = scope.dayList[scope.dayList.length - 1].epochLocal;

          for (var j = 0; j < firstDay; j++) {
            scope.dayList.unshift({});
          }

          scope.rows = [];
          scope.cols = [];

          scope.currentMonth = monthsList[current_date.getMonth()];
          scope.currentYear = current_date.getFullYear().toString();
          scope.currentMonthSelected = scope.currentMonth;
          scope.currentYearSelected = scope.currentYear;

          scope.numColumns = 7;
          scope.rows.length = 6;
          scope.cols.length = scope.numColumns;
        };

        scope.monthChanged = function (month) {
          var monthNumber = scope.monthsList.indexOf(month);
          currentDate.setMonth(monthNumber);
          refreshDateList(currentDate);
          scope.date_selection.selected = true;
          scope.date_selection.selectedDate = currentDate;
        };

        scope.yearChanged = function (year) {
          currentDate.setFullYear(year);
          refreshDateList(currentDate);
          scope.date_selection.selected = true;
          scope.date_selection.selectedDate = currentDate;
        };

        scope.prevMonth = function () {
          if (currentDate.getMonth() === 1) {
            currentDate.setFullYear(currentDate.getFullYear());
          }
          currentDate.setMonth(currentDate.getMonth() - 1);

          scope.currentMonth = monthsList[currentDate.getMonth()];
          scope.currentYear = currentDate.getFullYear();

          refreshDateList(currentDate)
        };

        scope.nextMonth = function () {
          if (currentDate.getMonth() === 11) {
            currentDate.setFullYear(currentDate.getFullYear());
          }
          currentDate.setMonth(currentDate.getMonth() + 1);
          scope.currentMonth = monthsList[currentDate.getMonth()];
          scope.currentYear = currentDate.getFullYear();
          refreshDateList(currentDate)
        };

        scope.date_selection = {selected: false, selectedDate: '', submitted: false};

        scope.dateSelected = function (date) {
          scope.selctedDateString = date.dateString;
          scope.date_selection.selected = true;
          scope.date_selection.selectedDate = new Date(date.dateString);
        };

        element.on("click", function () {
          if (!scope.ipDate) {
            var defaultDate = new Date();
            refreshDateList(defaultDate);
          } else {
            refreshDateList(angular.copy(scope.ipDate));
          }

          $ionicPopup.show({
            templateUrl: 'templates/date-picker-modal.html',
            title: scope.datePickerTitle,
            subTitle: '',
            scope: scope,
            buttons: [
              {
                text: '关闭',
                onTap: function (e) {
                  scope.callback(undefined);
                }
              },
              // {
              //   text: 'Today',
              //   onTap: function (e) {
              //
              //     var today = new Date();
              //     today.setHours(0);
              //     today.setMinutes(0);
              //     today.setSeconds(0);
              //     today.setMilliseconds(0);
              //
              //     var tempEpoch = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              //     var todayObj = {
              //       date: today.getDate(),
              //       month: today.getMonth(),
              //       year: today.getFullYear(),
              //       day: today.getDay(),
              //       dateString: today.toString(),
              //       epochLocal: tempEpoch.getTime(),
              //       epochUTC: (tempEpoch.getTime() + (tempEpoch.getTimezoneOffset() * 60 * 1000))
              //     };
              //
              //     scope.selctedDateString = todayObj.dateString;
              //     scope.date_selection.selected = true;
              //     scope.date_selection.selectedDate = new Date(todayObj.dateString);
              //     refreshDateList(new Date());
              //     e.preventDefault();
              //   }
              // },
              {
                text: '确定',
                type: 'button-balanced',
                onTap: function (e) {
                  if (!scope.date_selection.selected) {
                    if (scope.ipDate > new Date()) {
                      scope.callback(scope.ipDate);
                      return;
                    }
                  }
                  scope.date_selection.submitted = true;
                  if (scope.date_selection.selectedDate === "") {
                    var today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);

                    var tempEpoch = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    var todayObj = {
                      date: today.getDate(),
                      month: today.getMonth(),
                      year: today.getFullYear(),
                      day: today.getDay(),
                      dateString: today.toString(),
                      epochLocal: tempEpoch.getTime(),
                      epochUTC: (tempEpoch.getTime() + (tempEpoch.getTimezoneOffset() * 60 * 1000))
                    };

                    scope.selctedDateString = todayObj.dateString;
                    scope.date_selection.selected = true;
                    scope.date_selection.selectedDate = new Date(todayObj.dateString);
                    refreshDateList(new Date());
                  }
                  if (scope.date_selection.selected === true) {
                    scope.ipDate = angular.copy(scope.date_selection.selectedDate);
                    scope.callback(scope.ipDate);
                  } else {
                    e.preventDefault();
                  }
                }
              }
            ]
          })
        })
      }
    }
  }]);
});
