"use strict";
var status_1 = require('./common/status');
var defaults_1 = require('./common/defaults');
var progressState_1 = require('./common/progressState');
var StatusTracker = (function () {
    function StatusTracker() {
    }
    Object.defineProperty(StatusTracker, "statusDisplayed", {
        get: function () {
            return StatusTracker.status !== progressState_1.ProgressState.Done;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusTracker, "isActive", {
        get: function () {
            return StatusTracker.statusDisplayed || StatusTracker.modalDisplayed;
        },
        enumerable: true,
        configurable: true
    });
    StatusTracker.trackStatus = function (title) {
        var sid = setTimeout(function () {
            StatusTracker.status = progressState_1.ProgressState.Progress;
            var status = new status_1.Status(progressState_1.ProgressState.Progress, title);
            status.sid = sid;
            StatusTracker.statusList.push(status);
        }, defaults_1.Defaults.uiSettings.progressDelayInterval);
        return sid;
    };
    StatusTracker.resolveStatus = function (sid, status) {
        clearTimeout(sid);
        var current = StatusTracker.statusList.find(function (item) {
            return item.sid === sid;
        });
        if (current) {
            current.status = status;
        }
        setTimeout(function () {
            var undone = StatusTracker.statusList.find(function (item) {
                return item.status === progressState_1.ProgressState.Progress;
            });
            if (undone === undefined) {
                StatusTracker.statusList.length = 0;
                StatusTracker.status = progressState_1.ProgressState.Done;
            }
            else {
                for (var i = StatusTracker.statusList.length - 1; i >= 0; i--) {
                    if (StatusTracker.statusList[i].sid === sid) {
                        StatusTracker.statusList.splice(i, 1);
                    }
                }
            }
        }, defaults_1.Defaults.uiSettings.elementVisibilityInterval);
    };
    ;
    StatusTracker.status = progressState_1.ProgressState.Done;
    StatusTracker.modalDisplayed = false;
    StatusTracker.statusList = new Array();
    return StatusTracker;
}());
exports.StatusTracker = StatusTracker;
