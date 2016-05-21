import { expect } from 'chai';
import { BufferedPager } from '../src/bufferedPager';
import { Defaults } from '../src/common/defaults';

interface IResponseObject {
    loadedCount: number;
    totalCount: number;
}

function toResponseObject(): IResponseObject {
    return { loadedCount: 20, totalCount: 100 } as IResponseObject;
}
describe('BufferedPager', () => {
    it('process response values', () => {
        let pager = new BufferedPager();
        let response = toResponseObject();
        pager.processResponse(response);
        expect(pager.totalCount).eq(response.totalCount);
        expect(pager.loadedCount).eq(response.loadedCount);
    });
    it('increments skip on each load callback execution', () => {
        let pager = new BufferedPager();
        let response = toResponseObject();
        for (let i = response.loadedCount; i <= response.totalCount; i += response.loadedCount) {
            pager.processResponse(toResponseObject());
            expect(pager.skip).eq(i);
        }
    });
    it('resets contract properties', () => {
        let pager = new BufferedPager();
        let response = toResponseObject();
        pager.processResponse(response);
        pager.reset();
        expect(pager.totalCount).eq(0);
        expect(pager.skip).eq(0);
        expect(pager.takeRowCount).eq(Defaults.bufferedListSettings.defaultTakeRowCount);
    });
});
