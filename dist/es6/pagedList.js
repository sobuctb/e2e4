var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SimpleList } from './simpleList';
import { Utility } from './common/utility';
import { Defaults } from './common/defaults';
import { filter } from './filterAnnotation';
export class PagedList extends SimpleList {
    constructor(stateManager) {
        super(stateManager);
        this.pageSizeInternal = Defaults.pagedListSettings.defaultPageSize;
        this.pageNumberInternal = 1;
        this.displayFrom = 1;
        this.displayTo = 1;
        this.pagedLoadDataSuccessBinded = this.pagedLoadDataSuccessCallback.bind(this);
    }
    pagedLoadDataSuccessCallback(result) {
        this.loadedCount = result[Defaults.listSettings.loadedCountParameterName];
        this.totalCount = result[Defaults.listSettings.totalCountParameterName] || 0;
        this.displayFrom = result[Defaults.pagedListSettings.displayFromParameterName] || 1;
        this.displayTo = result[Defaults.pagedListSettings.displayToParameterName] || 1;
        return result;
    }
    dispose() {
        super.dispose();
        delete this.pagedLoadDataSuccessBinded;
    }
    get pageCount() {
        return Math.ceil(this.totalCount / this.pageSizeInternal);
    }
    get pageNumber() {
        return this.pageNumberInternal;
    }
    set pageNumber(value) {
        const valueStr = (value + '').replace(/[^0-9\.]/g, '');
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
        const valueStr = (value + '').replace(/[^0-9\.]/g, '');
        let pageSize = parseInt(valueStr, 10) ? parseInt(valueStr, 10) : Defaults.pagedListSettings.defaultPageSize;
        if (pageSize > Defaults.pagedListSettings.maxPageSize) {
            pageSize = Defaults.pagedListSettings.maxPageSize;
        }
        if (this.totalCount !== 0) {
            if (pageSize > this.totalCount) {
                pageSize = this.totalCount;
            }
            if (this.pageNumber * pageSize > this.totalCount) {
                pageSize = Math.ceil(this.totalCount / this.pageNumber);
                if (pageSize > Defaults.pagedListSettings.maxPageSize) {
                    pageSize = Defaults.pagedListSettings.maxPageSize;
                }
            }
        }
        if (pageSize < Defaults.pagedListSettings.minPageSize || pageSize === 0) {
            pageSize = Defaults.pagedListSettings.defaultPageSize;
        }
        if (this.pageNumber === this.pageCount && pageSize > this.pageSizeInternal) {
            pageSize = this.pageSizeInternal;
        }
        this.pageSizeInternal = pageSize;
    }
    loadData() {
        const promise = super.loadData.call(this, ...Array.prototype.slice.call(arguments));
        Utility.disposeAll(this.items);
        promise.then(this.pagedLoadDataSuccessBinded);
        return promise;
    }
    clearData() {
        super.clearData();
        this.pageNumber = 1;
        this.pageSize = Defaults.pagedListSettings.defaultPageSize;
    }
    goToFirstPage() {
        if (this.pageNumber > 1) {
            this.pageNumber = 1;
            this.loadData();
        }
    }
    goToPreviousPage() {
        if (this.pageNumber > 1) {
            this.pageNumber -= 1;
            this.loadData();
        }
    }
    goToNextPage() {
        if (this.pageNumber < this.pageCount) {
            this.pageNumber += 1;
            this.loadData();
        }
    }
    goToLastPage() {
        if (this.pageNumber < this.pageCount) {
            this.pageNumber = this.pageCount;
            this.loadData();
        }
    }
}
__decorate([
    filter({ defaultValue: 1, parameterName: Defaults.pagedListSettings.pageNumberParameterName }), 
    __metadata('design:type', Number)
], PagedList.prototype, "pageNumber", null);
__decorate([
    filter({
        defaultValue: Defaults.pagedListSettings.defaultPageSize,
        parameterName: Defaults.pagedListSettings.pageSizeParameterName,
        persisted: Defaults.pagedListSettings.persistPageSize
    }), 
    __metadata('design:type', Number)
], PagedList.prototype, "pageSize", null);

//# sourceMappingURL=data:application/json;base64,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QyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUM7SUFDTCxDQUFDO0lBQ0QsWUFBWTtRQUNSLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUF0Rkc7SUFBQyxNQUFNLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLEVBQW1CLENBQUM7OzJDQUFBO0FBZWhIO0lBQUMsTUFBTSxDQUFDO1FBQ0osWUFBWSxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlO1FBQ3hELGFBQWEsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMscUJBQXFCO1FBQy9ELFNBQVMsRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsZUFBZTtLQUN4RCxDQUFDOzt5Q0FBQTtBQW1FTCIsImZpbGUiOiJwYWdlZExpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NpbXBsZUxpc3R9IGZyb20gJy4vc2ltcGxlTGlzdCc7XHJcbmltcG9ydCB7VXRpbGl0eX0gZnJvbSAnLi9jb21tb24vdXRpbGl0eSc7XHJcbmltcG9ydCB7RGVmYXVsdHN9IGZyb20gJy4vY29tbW9uL2RlZmF1bHRzJztcclxuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJy4vZmlsdGVyQW5ub3RhdGlvbic7XHJcbmltcG9ydCB7SUZpbHRlckNvbmZpZ30gZnJvbSAnLi9jb250cmFjdHMvSUZpbHRlckNvbmZpZyc7XHJcbmltcG9ydCB7SVN0YXRlTWFuYWdlcn0gZnJvbSAnLi9jb250cmFjdHMvSVN0YXRlTWFuYWdlcic7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGFnZWRMaXN0IGV4dGVuZHMgU2ltcGxlTGlzdCB7XHJcbiAgICBwcml2YXRlIHBhZ2VTaXplSW50ZXJuYWwgPSBEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5kZWZhdWx0UGFnZVNpemU7XHJcbiAgICBwcml2YXRlIHBhZ2VOdW1iZXJJbnRlcm5hbCA9IDE7XHJcbiAgICBwcml2YXRlIHBhZ2VkTG9hZERhdGFTdWNjZXNzQmluZGVkOiAocmVzdWx0OiBPYmplY3QpID0+IE9iamVjdDtcclxuICAgIHByaXZhdGUgcGFnZWRMb2FkRGF0YVN1Y2Nlc3NDYWxsYmFjayhyZXN1bHQ6IE9iamVjdCk6IE9iamVjdCB7XHJcbiAgICAgICAgdGhpcy5sb2FkZWRDb3VudCA9IHJlc3VsdFtEZWZhdWx0cy5saXN0U2V0dGluZ3MubG9hZGVkQ291bnRQYXJhbWV0ZXJOYW1lXTtcclxuICAgICAgICB0aGlzLnRvdGFsQ291bnQgPSByZXN1bHRbRGVmYXVsdHMubGlzdFNldHRpbmdzLnRvdGFsQ291bnRQYXJhbWV0ZXJOYW1lXSB8fCAwO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3BsYXlGcm9tID0gcmVzdWx0W0RlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLmRpc3BsYXlGcm9tUGFyYW1ldGVyTmFtZV0gfHwgMTtcclxuICAgICAgICB0aGlzLmRpc3BsYXlUbyA9IHJlc3VsdFtEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5kaXNwbGF5VG9QYXJhbWV0ZXJOYW1lXSB8fCAxO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBkaXNwbGF5RnJvbSA9IDE7XHJcbiAgICBkaXNwbGF5VG8gPSAxO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlTWFuYWdlcjogSVN0YXRlTWFuYWdlcikge1xyXG4gICAgICAgIHN1cGVyKHN0YXRlTWFuYWdlcik7XHJcbiAgICAgICAgdGhpcy5wYWdlZExvYWREYXRhU3VjY2Vzc0JpbmRlZCA9IHRoaXMucGFnZWRMb2FkRGF0YVN1Y2Nlc3NDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3Bvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnBhZ2VkTG9hZERhdGFTdWNjZXNzQmluZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMudG90YWxDb3VudCAvIHRoaXMucGFnZVNpemVJbnRlcm5hbCk7XHJcbiAgICB9XHJcbiAgICBAZmlsdGVyKHsgZGVmYXVsdFZhbHVlOiAxLCBwYXJhbWV0ZXJOYW1lOiBEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5wYWdlTnVtYmVyUGFyYW1ldGVyTmFtZSB9IGFzIElGaWx0ZXJDb25maWcpXHJcbiAgICBnZXQgcGFnZU51bWJlcigpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VOdW1iZXJJbnRlcm5hbDtcclxuICAgIH1cclxuICAgIHNldCBwYWdlTnVtYmVyKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZVN0ciA9ICh2YWx1ZSArICcnKS5yZXBsYWNlKC9bXjAtOVxcLl0vZywgJycpO1xyXG4gICAgICAgIGxldCBwYWdlTnVtYmVyID0gcGFyc2VJbnQodmFsdWVTdHIsIDEwKSA/IHBhcnNlSW50KHZhbHVlU3RyLCAxMCkgOiAxO1xyXG4gICAgICAgIGlmIChwYWdlTnVtYmVyID4gdGhpcy5wYWdlQ291bnQpIHtcclxuICAgICAgICAgICAgcGFnZU51bWJlciA9IHRoaXMucGFnZUNvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGFnZU51bWJlciA8IDEpIHtcclxuICAgICAgICAgICAgcGFnZU51bWJlciA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFnZU51bWJlckludGVybmFsID0gcGFnZU51bWJlcjtcclxuICAgIH1cclxuICAgIEBmaWx0ZXIoe1xyXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogRGVmYXVsdHMucGFnZWRMaXN0U2V0dGluZ3MuZGVmYXVsdFBhZ2VTaXplLFxyXG4gICAgICAgIHBhcmFtZXRlck5hbWU6IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLnBhZ2VTaXplUGFyYW1ldGVyTmFtZSxcclxuICAgICAgICBwZXJzaXN0ZWQ6IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLnBlcnNpc3RQYWdlU2l6ZVxyXG4gICAgfSlcclxuICAgIGdldCBwYWdlU2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VTaXplSW50ZXJuYWw7XHJcbiAgICB9XHJcbiAgICBzZXQgcGFnZVNpemUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlU3RyID0gKHZhbHVlICsgJycpLnJlcGxhY2UoL1teMC05XFwuXS9nLCAnJyk7XHJcbiAgICAgICAgbGV0IHBhZ2VTaXplID0gcGFyc2VJbnQodmFsdWVTdHIsIDEwKSA/IHBhcnNlSW50KHZhbHVlU3RyLCAxMCkgOiBEZWZhdWx0cy5wYWdlZExpc3RTZXR0aW5ncy5kZWZhdWx0UGFnZVNpemU7XHJcblxyXG4gICAgICAgIGlmIChwYWdlU2l6ZSA+IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLm1heFBhZ2VTaXplKSB7XHJcbiAgICAgICAgICAgIHBhZ2VTaXplID0gRGVmYXVsdHMucGFnZWRMaXN0U2V0dGluZ3MubWF4UGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnRvdGFsQ291bnQgIT09IDApIHtcclxuICAgICAgICAgICAgaWYgKHBhZ2VTaXplID4gdGhpcy50b3RhbENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZSA9IHRoaXMudG90YWxDb3VudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGFnZU51bWJlciAqIHBhZ2VTaXplID4gdGhpcy50b3RhbENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZSA9IE1hdGguY2VpbCh0aGlzLnRvdGFsQ291bnQgLyB0aGlzLnBhZ2VOdW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VTaXplID4gRGVmYXVsdHMucGFnZWRMaXN0U2V0dGluZ3MubWF4UGFnZVNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlU2l6ZSA9IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLm1heFBhZ2VTaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYWdlU2l6ZSA8IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLm1pblBhZ2VTaXplIHx8IHBhZ2VTaXplID09PSAwKSB7XHJcbiAgICAgICAgICAgIHBhZ2VTaXplID0gRGVmYXVsdHMucGFnZWRMaXN0U2V0dGluZ3MuZGVmYXVsdFBhZ2VTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wYWdlTnVtYmVyID09PSB0aGlzLnBhZ2VDb3VudCAmJiBwYWdlU2l6ZSA+IHRoaXMucGFnZVNpemVJbnRlcm5hbCkge1xyXG4gICAgICAgICAgICBwYWdlU2l6ZSA9IHRoaXMucGFnZVNpemVJbnRlcm5hbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWdlU2l6ZUludGVybmFsID0gcGFnZVNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZERhdGEoKTogUHJvbWlzZTxPYmplY3Q+IHtcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gc3VwZXIubG9hZERhdGEuY2FsbCh0aGlzLCAuLi5BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICBVdGlsaXR5LmRpc3Bvc2VBbGwodGhpcy5pdGVtcyk7XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKHRoaXMucGFnZWRMb2FkRGF0YVN1Y2Nlc3NCaW5kZWQpO1xyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG4gICAgY2xlYXJEYXRhKCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLmNsZWFyRGF0YSgpO1xyXG4gICAgICAgIHRoaXMucGFnZU51bWJlciA9IDE7XHJcbiAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IERlZmF1bHRzLnBhZ2VkTGlzdFNldHRpbmdzLmRlZmF1bHRQYWdlU2l6ZTtcclxuICAgIH1cclxuICAgIGdvVG9GaXJzdFBhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFnZU51bWJlciA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTnVtYmVyID0gMTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdvVG9QcmV2aW91c1BhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFnZU51bWJlciA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTnVtYmVyIC09IDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnb1RvTmV4dFBhZ2UoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFnZU51bWJlciA8IHRoaXMucGFnZUNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZU51bWJlciArPSAxO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ29Ub0xhc3RQYWdlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhZ2VOdW1iZXIgPCB0aGlzLnBhZ2VDb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VOdW1iZXIgPSB0aGlzLnBhZ2VDb3VudDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
