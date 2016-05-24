var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Defaults } from './common/defaults';
import { filter } from './filterAnnotation';
export class PagedPager {
    constructor() {
        this.pageSizeInternal = Defaults.pagedListSettings.defaultPageSize;
        this.pageNumberInternal = 1;
        this.defaultPageSize = Defaults.pagedListSettings.defaultPageSize;
        this.maxPageSize = Defaults.pagedListSettings.maxPageSize;
        this.minPageSize = Defaults.pagedListSettings.minPageSize;
        this.totalCount = 0;
        this.loadedCount = 0;
        this.displayFrom = 0;
        this.displayTo = 0;
    }
    get pageCount() {
        return Math.ceil(this.totalCount / this.pageSizeInternal);
    }
    get pageNumber() {
        return this.pageNumberInternal;
    }
    set pageNumber(value) {
        const valueStr = (value + '').replace(/[^0-9]/g, '');
        let pageNumber = parseInt(valueStr, 10) ? parseInt(valueStr, 10) : 1;
        if (pageNumber > this.pageCount) {
            pageNumber = this.pageCount;
        }
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        this.pageNumberInternal = pageNumber;
    }
    get pageSize() {
        return this.pageSizeInternal;
    }
    set pageSize(value) {
        const valueStr = (value + '').replace(/[^0-9]/g, '');
        let pageSize = parseInt(valueStr, 10) ? parseInt(valueStr, 10) : this.defaultPageSize;
        if (pageSize > this.maxPageSize) {
            pageSize = this.maxPageSize;
        }
        if (this.totalCount !== 0) {
            if (pageSize > this.totalCount) {
                pageSize = this.totalCount;
            }
            if (this.pageNumber * pageSize > this.totalCount) {
                pageSize = Math.ceil(this.totalCount / this.pageNumber);
                if (pageSize > this.maxPageSize) {
                    pageSize = this.maxPageSize;
                }
            }
        }
        if (pageSize < this.minPageSize || pageSize === 0) {
            pageSize = this.defaultPageSize;
        }
        if (this.pageNumber === this.pageCount && pageSize > this.pageSizeInternal) {
            pageSize = this.pageSizeInternal;
        }
        this.pageSizeInternal = pageSize;
    }
    processResponse(result) {
        this.loadedCount = result[Defaults.listSettings.loadedCountParameterName] || 0;
        this.totalCount = result[Defaults.listSettings.totalCountParameterName] || 0;
        this.displayFrom = result[Defaults.pagedListSettings.displayFromParameterName] || 0;
        this.displayTo = result[Defaults.pagedListSettings.displayToParameterName] || 0;
    }
    reset() {
        this.totalCount = 0;
        this.pageNumber = 1;
        this.pageSize = this.defaultPageSize;
    }
}
__decorate([
    filter({
        defaultValue: 1,
        parameterName: Defaults.pagedListSettings.pageNumberParameterName,
        parseFormatter: function (proposedParam) {
            return isNaN(proposedParam) || !proposedParam ? 1 : proposedParam;
        }
    }), 
    __metadata('design:type', Object)
], PagedPager.prototype, "pageNumberInternal", void 0);
__decorate([
    filter({
        defaultValue: function () { return this.defaultPageSize; },
        parameterName: Defaults.pagedListSettings.pageSizeParameterName,
        parseFormatter: function (proposedParam) {
            return isNaN(proposedParam) || !proposedParam ? this.defaultPageSize : proposedParam;
        },
        persisted: Defaults.pagedListSettings.persistPageSize
    }), 
    __metadata('design:type', Number)
], PagedPager.prototype, "pageSize", null);

//# sourceMappingURL=data:application/json;base64,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LENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDekMsQ0FBQztBQUNMLENBQUM7QUF0Rkc7SUFBQyxNQUFNLENBQUM7UUFDSixZQUFZLEVBQUUsQ0FBQztRQUNmLGFBQWEsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCO1FBQ2pFLGNBQWMsRUFBRSxVQUFVLGFBQWtCO1lBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQztRQUN0RSxDQUFDO0tBQ2EsQ0FBQzs7c0RBQUE7QUE0Qm5CO0lBQUMsTUFBTSxDQUFDO1FBQ0osWUFBWSxFQUFFLGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNsRSxhQUFhLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQjtRQUMvRCxjQUFjLEVBQUUsVUFBVSxhQUFrQjtZQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO1FBQ3pGLENBQUM7UUFDRCxTQUFTLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGVBQWU7S0FDeEQsQ0FBQzs7MENBQUE7QUE2Q0wiLCJmaWxlIjoicGFnZWRQYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGVmYXVsdHN9IGZyb20gJy4vY29tbW9uL2RlZmF1bHRzJztcclxuaW1wb3J0IHtJUGFnZXJ9IGZyb20gJy4vY29udHJhY3RzL0lQYWdlcic7XHJcbmltcG9ydCB7ZmlsdGVyfSBmcm9tICcuL2ZpbHRlckFubm90YXRpb24nO1xyXG5pbXBvcnQge0lGaWx0ZXJDb25maWd9IGZyb20gJy4vY29udHJhY3RzL0lGaWx0ZXJDb25maWcnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhZ2VkUGFnZXIgaW1wbGVtZW50cyBJUGFnZXIge1xyXG4gICAgcHJpdmF0ZSBwYWdlU2l6ZUludGVybmFsID0gRGVmYXVsdHMucGFnZWRMaXN0U2V0dGluZ3MuZGVmYXVsdFBhZ2VTaXplO1xyXG5cclxuICAgIEBmaWx0ZXIoe1xyXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogMSxcclxuICAgICAgICBwYXJhbWV0ZXJOYW1lOiBEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5wYWdlTnVtYmVyUGFyYW1ldGVyTmFtZSxcclxuICAgICAgICBwYXJzZUZvcm1hdHRlcjogZnVuY3Rpb24gKHByb3Bvc2VkUGFyYW06IGFueSk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc05hTihwcm9wb3NlZFBhcmFtKSB8fCAhcHJvcG9zZWRQYXJhbSA/IDEgOiBwcm9wb3NlZFBhcmFtO1xyXG4gICAgICAgIH1cclxuICAgIH0gYXMgSUZpbHRlckNvbmZpZylcclxuICAgIHByaXZhdGUgcGFnZU51bWJlckludGVybmFsID0gMTtcclxuXHJcbiAgICBkZWZhdWx0UGFnZVNpemUgPSBEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5kZWZhdWx0UGFnZVNpemU7XHJcbiAgICBtYXhQYWdlU2l6ZSA9IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLm1heFBhZ2VTaXplO1xyXG4gICAgbWluUGFnZVNpemUgPSBEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5taW5QYWdlU2l6ZTtcclxuICAgIHRvdGFsQ291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBsb2FkZWRDb3VudDogbnVtYmVyID0gMDtcclxuICAgIGRpc3BsYXlGcm9tID0gMDtcclxuICAgIGRpc3BsYXlUbyA9IDA7XHJcblxyXG4gICAgZ2V0IHBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy50b3RhbENvdW50IC8gdGhpcy5wYWdlU2l6ZUludGVybmFsKTtcclxuICAgIH1cclxuICAgIGdldCBwYWdlTnVtYmVyKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZU51bWJlckludGVybmFsO1xyXG4gICAgfVxyXG4gICAgc2V0IHBhZ2VOdW1iZXIodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlU3RyID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teMC05XS9nLCAnJyk7XHJcbiAgICAgICAgbGV0IHBhZ2VOdW1iZXIgPSBwYXJzZUludCh2YWx1ZVN0ciwgMTApID8gcGFyc2VJbnQodmFsdWVTdHIsIDEwKSA6IDE7XHJcbiAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPiB0aGlzLnBhZ2VDb3VudCkge1xyXG4gICAgICAgICAgICBwYWdlTnVtYmVyID0gdGhpcy5wYWdlQ291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYWdlTnVtYmVyIDwgMSkge1xyXG4gICAgICAgICAgICBwYWdlTnVtYmVyID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWdlTnVtYmVySW50ZXJuYWwgPSBwYWdlTnVtYmVyO1xyXG4gICAgfVxyXG4gICAgQGZpbHRlcih7XHJcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBmdW5jdGlvbiAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZGVmYXVsdFBhZ2VTaXplOyB9LFxyXG4gICAgICAgIHBhcmFtZXRlck5hbWU6IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLnBhZ2VTaXplUGFyYW1ldGVyTmFtZSxcclxuICAgICAgICBwYXJzZUZvcm1hdHRlcjogZnVuY3Rpb24gKHByb3Bvc2VkUGFyYW06IGFueSk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBpc05hTihwcm9wb3NlZFBhcmFtKSB8fCAhcHJvcG9zZWRQYXJhbSA/IHRoaXMuZGVmYXVsdFBhZ2VTaXplIDogcHJvcG9zZWRQYXJhbTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHBlcnNpc3RlZDogRGVmYXVsdHMucGFnZWRMaXN0U2V0dGluZ3MucGVyc2lzdFBhZ2VTaXplXHJcbiAgICB9KVxyXG4gICAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZVNpemVJbnRlcm5hbDtcclxuICAgIH1cclxuICAgIHNldCBwYWdlU2l6ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVTdHIgPSAodmFsdWUgKyAnJykucmVwbGFjZSgvW14wLTldL2csICcnKTtcclxuICAgICAgICBsZXQgcGFnZVNpemUgPSBwYXJzZUludCh2YWx1ZVN0ciwgMTApID8gcGFyc2VJbnQodmFsdWVTdHIsIDEwKSA6IHRoaXMuZGVmYXVsdFBhZ2VTaXplO1xyXG5cclxuICAgICAgICBpZiAocGFnZVNpemUgPiB0aGlzLm1heFBhZ2VTaXplKSB7XHJcbiAgICAgICAgICAgIHBhZ2VTaXplID0gdGhpcy5tYXhQYWdlU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudG90YWxDb3VudCAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAocGFnZVNpemUgPiB0aGlzLnRvdGFsQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplID0gdGhpcy50b3RhbENvdW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlTnVtYmVyICogcGFnZVNpemUgPiB0aGlzLnRvdGFsQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplID0gTWF0aC5jZWlsKHRoaXMudG90YWxDb3VudCAvIHRoaXMucGFnZU51bWJlcik7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZVNpemUgPiB0aGlzLm1heFBhZ2VTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZVNpemUgPSB0aGlzLm1heFBhZ2VTaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYWdlU2l6ZSA8IHRoaXMubWluUGFnZVNpemUgfHwgcGFnZVNpemUgPT09IDApIHtcclxuICAgICAgICAgICAgcGFnZVNpemUgPSB0aGlzLmRlZmF1bHRQYWdlU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFnZU51bWJlciA9PT0gdGhpcy5wYWdlQ291bnQgJiYgcGFnZVNpemUgPiB0aGlzLnBhZ2VTaXplSW50ZXJuYWwpIHtcclxuICAgICAgICAgICAgcGFnZVNpemUgPSB0aGlzLnBhZ2VTaXplSW50ZXJuYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFnZVNpemVJbnRlcm5hbCA9IHBhZ2VTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2Nlc3NSZXNwb25zZShyZXN1bHQ6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubG9hZGVkQ291bnQgPSByZXN1bHRbRGVmYXVsdHMubGlzdFNldHRpbmdzLmxvYWRlZENvdW50UGFyYW1ldGVyTmFtZV0gfHwgMDtcclxuICAgICAgICB0aGlzLnRvdGFsQ291bnQgPSByZXN1bHRbRGVmYXVsdHMubGlzdFNldHRpbmdzLnRvdGFsQ291bnRQYXJhbWV0ZXJOYW1lXSB8fCAwO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3BsYXlGcm9tID0gcmVzdWx0W0RlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLmRpc3BsYXlGcm9tUGFyYW1ldGVyTmFtZV0gfHwgMDtcclxuICAgICAgICB0aGlzLmRpc3BsYXlUbyA9IHJlc3VsdFtEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5kaXNwbGF5VG9QYXJhbWV0ZXJOYW1lXSB8fCAwO1xyXG5cclxuICAgIH1cclxuICAgIHJlc2V0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMudG90YWxDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYWdlTnVtYmVyID0gMTtcclxuICAgICAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5kZWZhdWx0UGFnZVNpemU7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
