import { FilterConfig } from './contracts/filter-config';
import { cloneAsLiteral, coerceValue } from './utilities';
/**
 * Used for declarative building of objects which represent valuable state of `target object`.
 *
 * Since this declaration is pretty abstract and hard to understand, let's look at a specific sample.
 *
 * Typical usage of this service is something like this:
 * ```JavaScript
 *      class EndUserClass {
 *         @filter
 *         public parameter1 = 'Hey';
 *         @filter
 *         public parameter2 = 'There';
 *      }
 *      let endUserClassInstance = new EndUserClass();
 *      let filterService = new FilterService(endUserClassInstance);
 * ```
 * Now we can use created `filtersService` instance for several cases:
 *  - by calling {@link getRequestState} we can get serializable representation of object state
 * ```JavaScript
 *      {
 *         parameter1: 'Hey',
 *         parameter2: 'There'
 *      }
 * ```
 *  - by calling {@link resetValues} we can reset values of annotated properties to initial values (or to what was specified in {@link FilterConfig.defaultValue} property).
 *  - by calling {@link applyParams} we can automatically apply any set of values to annotated properties (we can pass queryString object to automatically apply values from it, for example).
 *  - by calling {@link getRequestState} with some filters we can "query" the state of filters and save it to the settings storage, for example.
 *  - by calling {@link registerFilterTarget} you can add any count of additional objects and get their
 * composed state via {@link getRequestState} method as well as process them all with {@link resetValues} and {@link applyParams}.
 */
export class FiltersService {
    /**
     * Global collection of all filters configuration.
     *
     * Used to build {@link appliedFiltersMap} for concrete set of objects that were registered as `target objects` via {@link registerFilterTarget} for concrete service instance.
     */
    public static filterPropertiesMap: Map<any, FilterConfig[]> = new Map<any, FilterConfig[]>();

    /**
     * Used to register type property as `target property` with specified filter config for later usage with {@link FiltersService}.
     *
     * This method is called by {@link filter} annotation, for example.
     * @param targetType type definition that contains specified property declaration.
     * @param propertyConfig configuration for property as a filter.
     */
    public static registerFilterConfig(targetType: object, propertyConfig: FilterConfig): void {
        const typeConfigs = FiltersService.filterPropertiesMap.has(targetType) ? FiltersService.filterPropertiesMap.get(targetType) : new Array<FilterConfig>();
        typeConfigs.push(propertyConfig);
        FiltersService.filterPropertiesMap.set(targetType, typeConfigs);
    }
    /**
     * Used to build resulted value of `target property` based on specified {@link FilterConfig}.
     *
     * This method is used by {@link getRequestState} and also calls oneself for the case of array values.
     *
     *
     * In addition to {@link FilterConfig} configuration, this method checks if `target property` has method `toRequest()`. If so this method will be used to get serialized value.
     *
     * This convention has sense in several scenarios:
     *  - Serialization of complex object can be performed by it's own method which was declared once instead of copy-paste it in {@link FilterConfig.serializeFormatter} declarations.
     *  - Very tricky but sometimes useful usage of this convention is to declare `toRequest` in `Date` prototype.
     *
     * This gives ability to easily send `Date` objects to the server in appropriate format which server can apply or, for example, always send UTC-dates.
     *
     * But be accurate with this approach. There's a lot of problems with extending of embedded types.
     *
     * @param target `target object` which holds specified `target property`. Used as `this` scope for {@link FilterConfig.serializeFormatter} method.
     * @param value raw value of `target property`.
     * @param config filter configuration for `target property`.
     */
    protected static buildFilterValue(target: object, value: any, config: FilterConfig): object {
        if (config && config.serializeFormatter) {
            return config.serializeFormatter.call(target, value);
        }

        value = config && config.emptyIsNull ? value || null : value;
        value = config && config.coerce ? coerceValue(value) : value;
        if (value && value.toRequest) {
            return value.toRequest();
        }
        if (Array.isArray(value)) {
            const temp = [];
            for (let i = 0; i < value.length; i++) {
                temp[i] = FiltersService.buildFilterValue(target, value[i], null);
            }
            return temp;
        }
        return value;
    }
    /**
     * Internal implementation of {@link appliedFiltersMap}
     */
    protected appliedFiltersMapInternal: Map<object, FilterConfig[]> = new Map<object, FilterConfig[]>();
    /**
     * Specifies was {@link appliedFiltersMap} already constructed or not.
     */
    protected filtersMapBuilded: boolean = false;
    /**
     * @param target `target object` that will be registered with {@link registerFilterTarget} method.
     */
    constructor(target?: object) {
        if (target) {
            this.registerFilterTarget(target);
        }
    }

    /**
     * Performs service destroy.
     */
    public destroy(): void {
        this.appliedFiltersMapInternal.clear();
    }
    /**
     * Collection of {@link FilterConfig} settings that matches configuration for all objects that were registered in current service instance via {@link registerFilterTarget} method.
     *
     * This collection is also filled up with configurations of passed `target objects` base classes since config applicability is determined by `instanceof` check.
     *
     * This collection is "lazy" and will be filled up on first call of {@link resetValues}, {@link applyParams} or {@link getRequestState} method.
     */
    public get appliedFiltersMap(): Map<object, FilterConfig[]> {
        if (!this.filtersMapBuilded) {
            this.buildFiltersMap();
        }
        return this.appliedFiltersMapInternal;
    }
    /**
     * Goes through all `target properties` of all `target objects` and sets their values to configured default.
     *
     * Default value will be determined as:
     *  - If value for {@link FilterConfig.defaultValue} is specified it will be applied.
     *  - Otherwise this service writes to {@link FilterConfig.defaultValue} value of `target property` at the moment of first call of
     * {@link resetValues}, {@link applyParams} or {@link getRequestState}.
     *
     * This method performs next actions:
     *  - If value specified as {@link FilterConfig.defaultValue} is function it will be called with `target object` as `this` scope. If specified value is not a function it will be used by itself.
     *  - Result of previous step will be cloned by {@link cloneLiteral} function to avoid possible reference types problems.
     *  - If {@link FilterConfig.parseFormatter} method is specified it will be called with previous step result as parameter.
     *  - Result of previous steps is applied as value to `target property`.
     */
    public resetValues(): void {
        this.appliedFiltersMap.forEach((targetConfig: FilterConfig[], target: { [id: string]: any }) => {
            for (const config of targetConfig) {
                const defaultValue = (typeof config.defaultValue === 'function') ? (config.defaultValue as () => any).call(target) : config.defaultValue;
                const clonedObject = cloneAsLiteral({ defaultValue });
                target[config.propertyName] = config.parseFormatter ? config.parseFormatter.call(target, clonedObject.defaultValue) : clonedObject.defaultValue;
            }
        });
    }
    /**
     * Goes through all `target properties` of all `target objects` and tries to find property within passed object which name is equal
     * to configured {@link FilterConfig.parameterName}.
     *
     * If match is found, value of the property from passed object is applied to `target property` in accordance with
     * {@link FilterConfig.ignoreOnAutoMap}, {@link FilterConfig.emptyIsNull}, {@link FilterConfig.coerce}, {@link FilterConfig.parseFormatter}.
     * @param params - object with values to apply.
     */
    public applyParams(params: { [id: string]: any }): void {
        this.appliedFiltersMap.forEach((targetConfig: FilterConfig[], target: { [id: string]: any }) => {
            for (const config of targetConfig) {
                if (params && params.hasOwnProperty(config.parameterName) && false === config.ignoreOnAutoMap) {
                    let proposedVal = config.emptyIsNull ? params[config.parameterName] || null : params[config.parameterName];
                    proposedVal = config.coerce ? coerceValue(proposedVal) : proposedVal;
                    target[config.propertyName] = config.parseFormatter ? config.parseFormatter.call(target, proposedVal, params) : proposedVal;
                }
            }
        });
    }
    /**
     * Goes through all `target properties` of all `target objects` and applies their values to one resulted object literal.
     *
     * Typical usage of this method is building request to send it to the server.
     *
     * Names of properties in result object depends on {@link FilterConfig.parameterName}. Final values would be constructed by {@link buildFilterValue} method.
     * @param filterFn - optional function to filter applied values.
     * @returns resulted object literal.
     */
    public getRequestState(filterFn?: (config: FilterConfig, proposedValue: any, targetObject: object) => boolean): any {
        const result: { [id: string]: any } = {};
        this.appliedFiltersMap.forEach((targetConfig: FilterConfig[], target: { [id: string]: any }) => {
            for (let config of targetConfig) {
                config = Object.assign({}, config);
                const proposedVal = target[config.propertyName];
                if (filterFn ? filterFn(config, proposedVal, target) : true) {
                    const resultValue = FiltersService.buildFilterValue(target, proposedVal, config);
                    if (!config.omitIfNullOrUndefined || (resultValue !== null && typeof resultValue !== 'undefined')) {
                        result[config.parameterName] = resultValue;
                    }
                }
            }
        });
        return result;
    }
    /**
     * Registers passed object as `target object` for current service instance.
     *
     * {@link getRequestState} method will compose result from objects that were registered by this method.
     *
     * {@link applyParams} and {@link resetValues} methods processes registered objects that were registered by this method.
     * @param targets object(s) to register as `target object`.
     */
    public registerFilterTarget(...targets: object[]): void {
        targets.forEach((target: object) => {
            this.appliedFiltersMapInternal.set(target, null);
            if (this.filtersMapBuilded) {
                this.buildFilterTargetMap(target);
            }
        });
    }
    /**
     * Removes passed object from `target objects` collection for current service instance.
     *
     * This means that {@link getRequestState}, {@link applyParams} and {@link resetValues} methods stops to process this objects.
     * @param targets object(s) to remove from collection of `target object`.
     */
    public removeFilterTarget(...targets: object[]): void {
        targets.forEach((target: object) => {
            this.appliedFiltersMapInternal.delete(target);
        });
    }
    /**
     * Builds final map of settings for objects that were registered as `target objects`.
     *
     * This method is called automatically before first usage of {@link appliedFiltersMap}.
     */
    private buildFiltersMap(): void {
        this.appliedFiltersMapInternal.forEach((targetConfig: FilterConfig[], target: object) => {
            this.buildFilterTargetMap(target);
        });
        this.filtersMapBuilded = true;
    }
    /**
     * Builds map of settings for passed `target object`.
     *
     */
    private buildFilterTargetMap(target: { [id: string]: any }): void {
        let targetConfig = new Array<FilterConfig>();
        FiltersService.filterPropertiesMap.forEach((typeConfig: FilterConfig[], type: any) => {
            if (target instanceof type) {
                targetConfig = targetConfig.concat(typeConfig);
                for (const config of targetConfig) {
                    if (typeof config.defaultValue === 'undefined') {
                        config.defaultValue = cloneAsLiteral({ defaultValue: target[config.propertyName] }).defaultValue;
                    }
                }
            }
        });
        if (targetConfig.length > 0) {
            this.appliedFiltersMapInternal.set(target, targetConfig);
        } else {
            this.appliedFiltersMapInternal.delete(target);
        }
    }
}
