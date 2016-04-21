import { ISelectionConfig } from './contracts/ISelectionConfig';
export declare class SelectionEventsHelper {
    selectionConfig: ISelectionConfig;
    constructor(selectionConfig: ISelectionConfig);
    trySelectAll(browserEvent: KeyboardEvent): void;
    onArrowUp(browserEvent: KeyboardEvent, allowMultipleSelection: boolean): void;
    onArrowDown(browserEvent: KeyboardEvent, allowMultipleSelection: boolean): void;
    keyboardHandler(browserEvent: KeyboardEvent, allowMultipleSelection: boolean): void;
    mouseHandler(browserEvent: MouseEvent, itemIndex: number): void;
    clearWindowSelection(): void;
}
