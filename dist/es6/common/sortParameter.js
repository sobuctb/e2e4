import { SortDirection } from './sortDirection';
export class SortParameter {
    constructor(fieldName, direction = SortDirection.Asc) {
        this.fieldName = null;
        this.fieldName = fieldName;
        this.direction = direction;
    }
    toggleDirection() {
        this.direction = this.direction === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
    }
    toRequest() {
        return { direction: this.direction, fieldName: this.fieldName };
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi9zb3J0UGFyYW1ldGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0saUJBQWlCO0FBQzdDO0lBQ0ksWUFBWSxTQUFpQixFQUFFLFNBQVMsR0FBa0IsYUFBYSxDQUFDLEdBQUc7UUFLM0UsY0FBUyxHQUFXLElBQUksQ0FBQztRQUpyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBR0QsZUFBZTtRQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsS0FBSyxhQUFhLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztJQUNuRyxDQUFDO0lBRUQsU0FBUztRQUNMLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEUsQ0FBQztBQUNMLENBQUM7QUFBQSIsImZpbGUiOiJjb21tb24vc29ydFBhcmFtZXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U29ydERpcmVjdGlvbn0gZnJvbSAnLi9zb3J0RGlyZWN0aW9uJztcclxuZXhwb3J0IGNsYXNzIFNvcnRQYXJhbWV0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoZmllbGROYW1lOiBzdHJpbmcsIGRpcmVjdGlvbjogU29ydERpcmVjdGlvbiA9IFNvcnREaXJlY3Rpb24uQXNjKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZE5hbWUgPSBmaWVsZE5hbWU7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICB9XHJcbiAgICBkaXJlY3Rpb246IFNvcnREaXJlY3Rpb247XHJcbiAgICBmaWVsZE5hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICB0b2dnbGVEaXJlY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbiA9PT0gU29ydERpcmVjdGlvbi5Bc2MgPyBTb3J0RGlyZWN0aW9uLkRlc2MgOiBTb3J0RGlyZWN0aW9uLkFzYztcclxuICAgIH1cclxuXHJcbiAgICB0b1JlcXVlc3QoKTogT2JqZWN0IHtcclxuICAgICAgICByZXR1cm4geyBkaXJlY3Rpb246IHRoaXMuZGlyZWN0aW9uLCBmaWVsZE5hbWU6IHRoaXMuZmllbGROYW1lIH07XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
