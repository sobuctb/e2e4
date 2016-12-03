import { AsyncSubscriber } from './async-subscriber';
import { FilterConfig } from './contracts/filter-config';
import { ListResponse } from './contracts/list-response';
import { Pager } from './contracts/pager';
import { FiltersService } from './filters-service';
import { NullObjectPager } from './null-object-pager';
import { OperationStatus } from './operation-status';
import { SortingsService } from './sortings-service';
import { StateService } from './state-service';
import { destroyAll } from './utilities';

export class List {
    private pagerInternal: Pager;
    /**
     * Method for getting data. This parameter is required and its configuration is necessary.
     * 
     * This method get one parameter with the settings of the request implementing {@link ListRequest} contract for the simple lists and {@link PagedListRequest} one for the paged lists.
     * The return value of this method should be any subscribable object which can be handled by {@link AsyncSubscriber}. 
     * For the simple lists the response should contain array with the records. As for the paged ones, it should implement {@link ListResponse} contract.
     */
    public fetchMethod: (requestParams: any) => any;
    private stateServices: StateService[] = new Array<StateService>();
    /**
     * Configured {@link Pager} service.
     */
    public get pager(): Pager {
        return this.pagerInternal;
    }
    public set pager(value: Pager) {
        this.filtersService.removeFilterTarget(this.pagerInternal);
        this.pagerInternal = value;
        this.filtersService.registerFilterTarget(this.pagerInternal);
    }
    /**
     * Array of elements transferred in the {@link ListResponse.items} property.
     */
    public items: any[] = new Array<any>();
    /**
     * True if the service was already destroyed via {@link destroy} call.  
     */
    public destroyed: boolean = false;
    /**
     * True if the service was already initialized via {@link init} call.  
     */
    public inited: boolean = false;
    /**
     * Current execution status of the list.  
     */
    public status: OperationStatus = OperationStatus.Initial;
    /**
     * returns `true`, if there is a data request executed at the moment (i.e. {@link state} is equal to {@link ProgressState.Progress})
     */
    public get busy(): boolean {
        return this.status === OperationStatus.Progress;
    }
    /**
     * returns `true`, if there is no data request executed at the moment (i.e. {@link state} is NOT equal to {@link ProgressState.Progress})  
     */
    public get ready(): boolean {
        return this.status !== OperationStatus.Progress;
    }
    constructor(private asyncSubscriber: AsyncSubscriber, stateServices: StateService | StateService[], private sortingsService: SortingsService, private filtersService: FiltersService) {
        if (stateServices != null) {
            if (Array.isArray(stateServices)) {
                this.stateServices.push(...<StateService[]>stateServices);
            } else {
                this.stateServices.push(stateServices);
            }
        }
        this.pager = new NullObjectPager();
    }
    /**
     * Callback which is executed if {@link fetchMethod} execution finished successfully.
     */
    private loadSuccessCallback = (result: ListResponse<any> | any[]): Object => {
        if (Array.isArray(result)) {
            result = {
                items: result,
                loadedCount: result.length,
                totalCount: result.length
            } as ListResponse<any>;
        }
        this.items = this.items.concat(result.items);

        this.pager.processResponse(result);
        // In case when filter changed from last request and there's no data now
        if (this.pager.totalCount === 0) {
            this.clearData();
            this.pager.reset();
        }
        this.status = this.pager.totalCount === 0 ? OperationStatus.NoData : OperationStatus.Done;
        return result;
    }
    /**
     * Callback which is executed if {@link fetchMethod} execution finished with error.
     */
    private loadFailCallback = (): void => {
        this.status = OperationStatus.Fail;
    }
    /**
     * Calls {@link Pager.reset} method and clears {@link items} array. Calls {@link destroyAll} method for {@link items} array to perform optional destroy logic of the elements.
     * {@see destroyAll}  
     */
    private clearData(): void {
        this.pager.reset();
        destroyAll(this.items);
        this.items = [];
    }
    /**
     * Performs initialization logic of the service. This method must be called before first use of the service.
     */
    public init(): void {
        if (this.inited) {
            return;
        }
        this.filtersService.registerFilterTarget(this.pager, this.sortingsService);
        let restoredState = {};
        Object.assign(restoredState, ...this.stateServices.map((service: StateService) => service.getState() || {}));
        this.filtersService.applyParams(restoredState);
        this.inited = true;
    }
    /**
     * Performs destroy logic of the list itself and all of the inner services.
     */
    public destroy(): void {
        this.asyncSubscriber.destroy();
        this.filtersService.destroy();
        this.sortingsService.destroy();
        this.clearData();
        this.destroyed = true;
    }
    /**
     * Performs data loading by calling specified {@link fetchMethod} delegate.
     */
    public loadData(): void {
        if (this.busy) {
            return;
        }
        this.status = OperationStatus.Progress;
        let requestState = this.filtersService.getRequestState();
        const subscribable = this.fetchMethod(requestState);
        if (this.pager.appendedOnLoad === false) {
            destroyAll(this.items);
            this.items = [];
        }
        this.asyncSubscriber.attach(subscribable, this.loadSuccessCallback, this.loadFailCallback);
        this.stateServices.forEach((service: StateService) => service.persistState(this.filtersService));
    }
    /**
     * Resets paging parameters and performs data loading by calling {@link loadData}.
     */
    public reloadData(): void {
        if (this.ready) {
            this.clearData();
            this.loadData();
        }
    }
    /**
     * Cancels the request executed at the moment.
     */
    public cancelRequests(): void {
        if (this.busy) {
            this.asyncSubscriber.detach();
            this.status = OperationStatus.Cancelled;
        }
    }
    /**
     * Registers passed object(s) as state service to manage the list state.
     */
    public registerStateService(...services: StateService[]): void {
        services.forEach((service: StateService) => {
            this.stateServices.push(service);
        });
    }
    /**
     * Removes passed object(s) from state services collection of the list.
     */
    public removeStateService(...services: StateService[]): void {
        services.forEach((service: StateService) => {
            const index = this.stateServices.findIndex((s: StateService) => s === service);
            if (index !== -1) {
                this.stateServices.splice(index, 1);
            }
        });
    }
    /**
     * Registers passed object(s) as filter targets in underlying {@link FiltersService} to include their configured properties as parameters to the data request.
     * @see {@link FiltersService.registerFilterTarget}
     */
    public registerFilterTarget(...targets: Object[]): void {
        this.filtersService.registerFilterTarget(...targets);
    }
    /**
     * @see {@link FiltersService.removeFilterTarget}
     */
    public removeFilterTarget(...targets: Object[]): void {
        this.filtersService.removeFilterTarget(...targets);
    }
    /**
     * @see {@link FiltersService.getRequestState}
     */
    public getRequestState(filterFn?: (config: FilterConfig, proposedValue: any, targetObject: Object) => boolean): any {
        return this.filtersService.getRequestState(filterFn);
    }
    /**
     * Resets the list parameters (sortings, paging, filters) to their default values.
     */
    public resetSettings(): void {
        this.filtersService.resetValues();
    }
}
