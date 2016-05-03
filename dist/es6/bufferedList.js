import { SimpleList } from './simpleList';
import { BufferedPager } from './bufferedPager';
export class BufferedList extends SimpleList {
    constructor(stateManager) {
        super(stateManager, new BufferedPager());
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1ZmZlcmVkTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGNBQWM7T0FDaEMsRUFBQyxhQUFhLEVBQUMsTUFBTSxpQkFBaUI7QUFHN0Msa0NBQTJDLFVBQVU7SUFDakQsWUFBWSxZQUEyQjtRQUNuQyxNQUFNLFlBQVksRUFBRSxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQztBQUNMLENBQUM7QUFBQSIsImZpbGUiOiJidWZmZXJlZExpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NpbXBsZUxpc3R9IGZyb20gJy4vc2ltcGxlTGlzdCc7XHJcbmltcG9ydCB7QnVmZmVyZWRQYWdlcn0gZnJvbSAnLi9idWZmZXJlZFBhZ2VyJztcclxuaW1wb3J0IHtJU3RhdGVNYW5hZ2VyfSBmcm9tICcuL2NvbnRyYWN0cy9JU3RhdGVNYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWZmZXJlZExpc3QgZXh0ZW5kcyBTaW1wbGVMaXN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlTWFuYWdlcjogSVN0YXRlTWFuYWdlcikge1xyXG4gICAgICAgIHN1cGVyKHN0YXRlTWFuYWdlciwgbmV3IEJ1ZmZlcmVkUGFnZXIoKSk7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
