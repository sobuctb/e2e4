﻿import {ProgressState} from './progress-state';
/**
 * Represents state of operation that must be displayed on UI.
 * Used by {@link StateTrackingService}. 
 */
export class Operation {
    /**
     * Settings for names of css classes that are relevant to {@link status} value.
     * This settings is used by {@link className} property and changing of this settings affects every object of {@link Status} type.
     */
    public static settings: any = {
        /**
         * Name of css class that corresponds to {@link ProgressState.Done}.
         */
        statusDoneClassName: 'status-done',
        /**
         * Name of css class that corresponds to {@link ProgressState.Fail}.
         */
        statusFailClassName: 'status-fail',
        /**
         * Name of css class that corresponds to {@link ProgressState.Progress}.
         */
        statusProgressClassName: 'status-progress'
    };
    /**
     * Identifier that was returned by `setTimeout` method.
     * Used to track object in {@link StateTrackingService}
     */
    public sid: number;
    /**
     * Current progress state.
     */
    public status: ProgressState;
    /**
     * Description that will be displayed on UI.
     */
    public title: string;
    constructor(status: ProgressState, title: string) {
        this.status = status;
        this.title = title;
    }
    /**
     * Returns class name from {@link Status.settings} that corresponds to current {@link status} value.
     */
    public get className(): string {
        switch (this.status) {
            case ProgressState.Done:
                return Operation.settings.statusDoneClassName;
            case ProgressState.Progress:
                return Operation.settings.statusProgressClassName;
            case ProgressState.Fail:
                return Operation.settings.statusFailClassName;
            default:
                return '';
        }
    }
}

/**
 * Used to manage state of operation wich description must be displayed on UI.
 * Can be used to implement application-defined UI component to display, for example, visual mask that hides part of UI controls until any operations completed.
 * The typical usage scenario is:
 *  - Operation is registered with {@link trackStatus}, which returns unique identifier of operation.
 *  - Registered operation would be added to the {@link operationsList} after ellapsing of {@link progressDelayInterval} timeout.
 *  - Operation state can be changed via {@link changeStatus}.
 *  - When {@link elementVisibilityInterval} interval is ellapsed all operations with status different than {@link ProgressState.Progress} will be removed from {@link operationsList}.
 */
export class StateTrackingService {
    /**
     * Global timimng settings.
     * 
     * These settings are static and their values are copied to the properties of the same name for each instance of {@link StateTrackingService}.
     * 
     * So, changing of this settings will affect all instances of {@link StateTrackingService} that will be created after those changes.
     * If you want to change settings of concrete object you can use it the same name properties.
     */
    public static settings: any =
    {
        /**
         * @see {@link StateTrackingService.elementVisibilityInterval}
         */
        elementVisibilityInterval: 500,
        /**
         * @see {@link StateTrackingService.progressDelayInterval}
         */
        progressDelayInterval: 500
    };
    /**
     * Specifies how long operation will be displayed after it becomes {@link ProgressState.Done}.
     * In fact this is minimal time of operation visibility. If operation was completed right after {@link progressDelayInterval} it will be displayed at least specified in this property amount of milliseconds. 
     */
    public static elementVisibilityInterval: number = StateTrackingService.elementVisibilityInterval;
    /**
     * Specifies how much time must ellapse from start of operation to it's appearance on UI.
     * This means that if operation was performed faster than that interval it wouldn't be displayed on UI at all.
     * This approach helps to avoid situations when mask is hiddened right after it was rendered since it can be pretty irritating.
     */
    public static progressDelayInterval: number = StateTrackingService.progressDelayInterval;
    /**
     * Current state of service.
     * If {@link operationsList} contains any operation, this property becomes equal to {@link ProgressState.Progress}. This means that mask can be displayed on UI for example.
     * When {@link operationsList} becomes empty then this property becomes equal to {@link ProgressState.Done}.
     */
    public status: ProgressState = ProgressState.Done;
    /**
     * Collection of operations which currently tracked by service and must be displayed on UI.
     * Tracked by {@link trackStatus} and {@link changeStatus} methids.
     */
    public operationsList: Array<Operation> = new Array<Operation>();
    /**
     * true, if current {@link status} doesn't equal to {@link ProgressState.Done}.
     */
    public get isActive(): boolean {
        return this.status !== ProgressState.Done;
    }
    /**
     * Registers operation for tracking.
     * @param title operation description that must be displayed on UI.
     * @returns identifier of `setTimeout` on ellapsing of which operation will be added to {@link operationsList} 
     */
    public trackStatus(title: string): number {
        const sid = setTimeout(() => {
            this.status = ProgressState.Progress;
            const status = new Operation(ProgressState.Progress, title);
            status.sid = sid;
            this.operationsList.push(status);
        }, StateTrackingService.progressDelayInterval);
        return sid;
    }
    /**
     * Changes tracked operation status.
     * @param sid operation identifier that was returned by {@link trackStatus}.
     * @param status status that must be setted on operation.
     * In case when applied status doesn't equal to {@link ProgressState.Progress}, operation will be deleted from {@link operationsList} after {@link elementVisibilityInterval} interval ellapsed.
     */
    public changeStatus(sid: number, status: ProgressState): void {
        clearTimeout(sid);
        const current = this.operationsList.find((item: Operation) => {
            return item.sid === sid;
        });
        if (current) {
            current.status = status;
        }
        setTimeout((): void => {
            const undone = this.operationsList.find((item: Operation) => {
                return item.status === ProgressState.Progress;
            });
            if (undone === undefined) {
                this.operationsList.length = 0;
                this.status = ProgressState.Done;
            } else {
                for (let i = this.operationsList.length - 1; i >= 0; i--) {
                    if (this.operationsList[i].sid === sid) {
                        this.operationsList.splice(i, 1);
                    }
                }
            }
        }, StateTrackingService.elementVisibilityInterval);
    };
}