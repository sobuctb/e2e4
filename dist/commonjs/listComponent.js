"use strict";
var defaults_1 = require('./common/defaults');
var utility_1 = require('./common/utility');
var selectionManager_1 = require('./selectionManager');
var filterManager_1 = require('./filterManager');
var progressState_1 = require('./common/progressState');
var sortManager_1 = require('./sortManager');
var ListComponent = (function () {
    function ListComponent(stateManager) {
        this.disposed = false;
        this.inited = false;
        this.state = null;
        ///IListComponent
        this.items = [];
        this.totalCount = 0;
        this.loadedCount = 0;
        ///IRequestCanceller
        ///IComponentWithState
        this.useModelState = true;
        this.stateManager = stateManager;
        selectionManager_1.SelectionManager.includeIn(this, 'items');
        filterManager_1.FilterManager.includeIn(this);
        sortManager_1.SortManager.includeIn(this);
        this.filterManager.registerFilterTarget(this.sortManager);
        this.listLoadDataSuccessBinded = this.listLoadDataSuccessCallback.bind(this);
        this.listLoadDataFailBinded = this.listLoadDataFailCallback.bind(this);
    }
    ListComponent.prototype.listLoadDataSuccessCallback = function (result) {
        this.loadedCount = result[defaults_1.Defaults.listComponent.loadedCountParameterName];
        this.totalCount = result[defaults_1.Defaults.listComponent.totalCountParameterName] || 0;
        this.state = progressState_1.ProgressState.Done;
        return result;
    };
    ListComponent.prototype.listLoadDataFailCallback = function () {
        this.state = progressState_1.ProgressState.Fail;
    };
    ListComponent.prototype.clearDataInternal = function () {
        this.totalCount = 0;
        this.selectionManager.deselectAll();
        utility_1.Utility.disposeAll(this.items);
    };
    Object.defineProperty(ListComponent.prototype, "busy", {
        get: function () {
            return this.state === progressState_1.ProgressState.Progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListComponent.prototype, "ready", {
        get: function () {
            return this.state !== progressState_1.ProgressState.Progress;
        },
        enumerable: true,
        configurable: true
    });
    ///IComponent overrides
    ListComponent.prototype.init = function (queryParams) {
        this.inited = true;
        var restoredState = this.getRestoredState(queryParams);
        this.filterManager.parseParams(restoredState);
    };
    ListComponent.prototype.dispose = function () {
        this.disposed = true;
        delete this.listLoadDataSuccessBinded;
        delete this.listLoadDataFailBinded;
        this.clearDataInternal();
        this.sortManager.dispose();
        this.filterManager.dispose();
        this.selectionManager.dispose();
    };
    ///IComponent overrides
    ListComponent.prototype.onSortChangesCompleted = function () {
        if (this.ready) {
            this.clearDataInternal();
            this.loadData();
        }
    };
    ListComponent.prototype.toRequest = function () {
        return this.filterManager.buildRequest(null);
    };
    ListComponent.prototype.getLocalState = function () {
        return this.filterManager.buildPersistedState(null);
    };
    ListComponent.prototype.loadData = function () {
        if (!this.inited) {
            throw new Error('loadData can be called only after activation.');
        }
        this.totalCount = 0;
        this.state = progressState_1.ProgressState.Progress;
        var promise = this.getDataReadPromise();
        this.addToCancellationSequence(promise);
        promise.then(this.listLoadDataSuccessBinded, this.listLoadDataFailBinded);
        if (this.useModelState) {
            this.saveRequestState();
            this.saveLocalState();
        }
        return promise;
    };
    ListComponent.prototype.clearData = function () {
        this.clearDataInternal();
    };
    ListComponent.prototype.reloadData = function () {
        if (this.ready) {
            this.clearData();
            this.loadData();
        }
    };
    ///IListComponent
    ///IRequestCanceller
    ListComponent.prototype.addToCancellationSequence = function (promise) { };
    ;
    ListComponent.prototype.cancelRequests = function () { };
    ;
    ListComponent.prototype.saveRequestState = function () {
        this.stateManager.flushRequestState(this.toRequest());
    };
    ;
    ListComponent.prototype.saveLocalState = function () {
        this.stateManager.persistLocalState(this.getLocalState());
    };
    ;
    ListComponent.prototype.getRestoredState = function (params) {
        if (this.useModelState === false) {
            return params;
        }
        return this.stateManager.mergeStates(params);
    };
    return ListComponent;
}());
exports.ListComponent = ListComponent;
