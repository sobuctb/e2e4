import { ListResponse } from '../src/contracts/list-response';
import { FiltersService } from '../src/filters-service';
import { PagedPager } from '../src/paged-pager';

import { expect } from 'chai';

function toResponseObject(): ListResponse<any> {
    return {
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        loadedCount: 20,
        totalCount: 100
    };
}

describe('PagedPager', () => {
    describe('ctor', () => {
        it('created with good state', () => {
            let pager = new PagedPager();
            expect(pager.totalCount).eq(0);
            expect(pager.loadedCount).eq(0);
            expect(pager.pageNumber).eq(1);
            expect(pager.pageSize).eq(pager.defaultPageSize);
            expect(pager.displayFrom).eq(0);
            expect(pager.displayTo).eq(0);

        });
    });

    describe('response processing', () => {
        it('process response values', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            pager.processResponse(response);

            expect(pager.totalCount).eq(response.totalCount);
            expect(pager.loadedCount).eq(response.loadedCount);
        });

        it('process incorrect totalCount as 0', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            response.totalCount = null;
            pager.processResponse(response);
            expect(pager.totalCount).eq(0);
        });

        it('can calculate loadedCount from items array', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            response.loadedCount = null;
            response.totalCount = 20;
            pager.processResponse(response);
            expect(pager.loadedCount).eq(response.items.length);
        });
        it('sets loadedCount to 0 if it not specified in response and items array is empty', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            response.loadedCount = null;
            response.items.length = 0;
            pager.processResponse(response);
            expect(pager.loadedCount).eq(0);
        });
        it('calculates displayFrom and displayTo', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            response.loadedCount = 20;
            response.totalCount = 35;
            pager.processResponse(response);
            expect(pager.displayFrom).eq(1);
            expect(pager.displayTo).eq(20);

            pager.tryMoveToNextPage();
            response.loadedCount = 15;
            pager.processResponse(response);
            expect(pager.displayFrom).eq(21);
            expect(pager.displayTo).eq(35);
        });

        it('resets contract properties', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            pager.processResponse(response);
            pager.reset();
            expect(pager.totalCount).eq(0);
            expect(pager.pageNumber).eq(1);
            expect(pager.pageSize).eq(pager.defaultPageSize);
        });
    });
    describe('as filter target', () => {
        it('maps pageNumber to skip param on building request', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);
            let result = filtersService.getRequestState();
            expect(result.skip).eq(0);
            pager.totalCount = 100;
            pager.tryMoveToNextPage();
            result = filtersService.getRequestState();
            expect(result.skip).eq(pager.pageSize);
        });
        it('maps pageSize to take param on building request', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);
            let result = filtersService.getRequestState();
            expect(result.take).eq(pager.pageSize);
        });
        it('parse skip param to pageNumber', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);

            expect(pager.pageNumber).eq(1);
            let params = {
                skip: 50,
                take: 10
            };
            filtersService.applyParams(params);
            expect(pager.pageNumber).eq(6);
        });
        it('parse pageNumber as 1 if skip param is invalid', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);

            expect(pager.pageNumber).eq(1);
            let params = {
                skip: null,
                take: 10
            };
            filtersService.applyParams(params);
            expect(pager.pageNumber).eq(1);
            params.skip = {};
            filtersService.applyParams(params);
            expect(pager.pageNumber).eq(1);
        });
        it('doesn\'t round pageNumber (if skip % take!=0 then 1)', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);

            expect(pager.pageNumber).eq(1);
            let params = {
                skip: 7,
                take: 10
            };
            filtersService.applyParams(params);
            expect(pager.pageNumber).eq(1);
        });
        it('parse pageSize as defaultPageSize if take param is invalid', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);

            expect(pager.pageNumber).eq(1);
            let params = {
                skip: 20,
                take: null
            };
            filtersService.applyParams(params);
            expect(pager.pageSize).eq(pager.defaultPageSize);
            params.take = {};
            filtersService.applyParams(params);
            expect(pager.pageSize).eq(pager.defaultPageSize);
        });
        it('parse pageSize from take param', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);

            expect(pager.pageNumber).eq(1);
            let params = {
                skip: 50,
                take: 10
            };
            filtersService.applyParams(params);
            expect(pager.pageSize).eq(params.take);
        });

        it('sets pageSize to defaultPageSize on reset', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);
            pager.pageSize = 40;
            expect(pager.pageSize).eq(40);
            filtersService.resetValues();
            expect(pager.pageSize).eq(pager.defaultPageSize);
        });

        it('can have own defaultPageSize', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);
            pager.defaultPageSize = 5;
            filtersService.resetValues();
            expect(pager.pageSize).eq(5);
            expect(PagedPager.settings.defaultPageSize).not.eq(pager.defaultPageSize);
        });

        it('can persist pageSize', () => {
            let pager = new PagedPager();
            let filtersService = new FiltersService(pager);
            pager.persistPageSize = true;
            const persistedState = filtersService.getPersistedState();

            expect(persistedState).eql({ take: pager.pageSize });
        });

    });
    describe('internal state', () => {
        describe('pageSize', () => {
            it('sets pageNumber to defaultPageSize on invalid', () => {
                let pager = new PagedPager();
                pager.pageSize = null;
                expect(pager.pageSize).eq(pager.defaultPageSize);
                pager.pageSize = undefined;
                expect(pager.pageSize).eq(pager.defaultPageSize);
                pager.pageSize = -20;
                expect(pager.pageSize).eq(pager.defaultPageSize);
            });
            it('sets pageSize to maxPageSize when try to set bigger value', () => {
                let pager = new PagedPager();
                pager.pageSize = PagedPager.settings.maxPageSize + 100;
                expect(pager.pageSize).eq(PagedPager.settings.maxPageSize);
            });

            it('can have own maxPageSize', () => {
                let pager = new PagedPager();
                pager.maxPageSize = PagedPager.settings.maxPageSize + 100;
                pager.pageSize = pager.maxPageSize + 100;
                expect(pager.pageSize).eq(pager.maxPageSize);
                expect(pager.maxPageSize).not.eq(PagedPager.settings.maxPageSize);
            });

            it('sets pageSize to defaultPageSize when try to set value less then minPageSize', () => {
                let pager = new PagedPager();
                pager.pageSize = PagedPager.settings.minPageSize - 1;
                expect(pager.pageSize).eq(pager.defaultPageSize);
            });

            it('can have own minPageSize', () => {
                let pager = new PagedPager();
                pager.minPageSize = PagedPager.settings.minPageSize + 10;
                pager.pageSize = pager.minPageSize - 10;
                expect(pager.pageSize).eq(pager.defaultPageSize);
                expect(pager.minPageSize).not.eq(PagedPager.settings.minPageSize);
            });

            it('sets pageSize to totalCount when try to set value greater then totalCount', () => {
                let response = toResponseObject();
                let pager = new PagedPager();
                pager.processResponse(response);
                pager.pageSize = response.totalCount + 1;
                expect(pager.pageSize).eq(response.totalCount);
            });

            it('sets pageSize to specified value when totalCount is not zero', () => {
                let response = toResponseObject();
                let pager = new PagedPager();
                pager.processResponse(response);
                pager.pageSize = response.totalCount - 1;
                expect(pager.pageSize).eq(response.totalCount - 1);
            });

            it('sets pageSize to maximum possible for current pageNumber', () => {
                let response = toResponseObject();
                let pager = new PagedPager();
                pager.processResponse(response);

                pager.pageNumber = response.totalCount / response.loadedCount;

                pager.pageSize = response.loadedCount + 1;
                expect(pager.pageSize).eq(response.loadedCount);
            });

            it('sets pageSize to maximum possible for current pageNumber and not bigger then maxPageSize', () => {
                let response = toResponseObject();
                let pager = new PagedPager();
                pager.processResponse(response);
                pager.maxPageSize = response.loadedCount / 2;
                pager.pageNumber = response.totalCount / response.loadedCount;
                pager.pageSize = response.loadedCount + 1;
                expect(pager.pageSize).eq(pager.maxPageSize);
            });
        });
        describe('Pages navigation', () => {
            describe('tryMoveToFirstPage', () => {
                it('Goes to first page', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);

                    pager.pageNumber = pager.pageCount;
                    expect(pager.pageNumber).eq(pager.pageCount);
                    const wasHandled = pager.tryMoveToFirstPage();
                    expect(pager.pageNumber).eq(1);
                    expect(wasHandled).true;
                });

                it('Doesn\'t go to first page if it\'s already first', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);

                    expect(pager.pageNumber).eq(1);
                    const wasHandled = pager.tryMoveToFirstPage();
                    expect(pager.pageNumber).eq(1);
                    expect(wasHandled).false;
                });
            });
            describe('tryMoveToPreviousPage', () => {
                it('Goes to previous page', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);

                    pager.pageNumber = pager.pageCount;
                    expect(pager.pageNumber).eq(pager.pageCount);
                    const wasHandled = pager.tryMoveToPreviousPage();
                    expect(pager.pageNumber).eq(pager.pageCount - 1);
                    expect(wasHandled).true;
                });

                it('Doesn\'t go to previous page if it\'s already first', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);

                    expect(pager.pageNumber).eq(1);
                    const wasHandled = pager.tryMoveToPreviousPage();
                    expect(pager.pageNumber).eq(1);
                    expect(wasHandled).false;
                });
            });
            describe('tryMoveToLastPage', () => {
                it('Goes to last page', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);
                    expect(pager.pageNumber).eq(1);

                    const wasHandled = pager.tryMoveToLastPage();

                    expect(pager.pageNumber).eq(pager.pageCount);
                    expect(wasHandled).true;
                });

                it('Doesn\'t go to last page if it\'s already last', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);
                    pager.pageNumber = pager.pageCount;
                    expect(pager.pageNumber).eq(pager.pageCount);

                    const wasHandled = pager.tryMoveToLastPage();
                    expect(pager.pageNumber).eq(pager.pageCount);
                    expect(wasHandled).false;
                });
            });
            describe('tryMoveToNextPage', () => {
                it('Goes to next page', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);
                    expect(pager.pageNumber).eq(1);

                    const wasHandled = pager.tryMoveToNextPage();

                    expect(pager.pageNumber).eq(1 + 1);
                    expect(wasHandled).true;
                });

                it('Doesn\'t go to next page if it\'s already last page', () => {
                    let pager = new PagedPager();
                    let response = toResponseObject();
                    pager.processResponse(response);
                    pager.pageNumber = pager.pageCount;
                    expect(pager.pageNumber).eq(pager.pageCount);

                    const wasHandled = pager.tryMoveToNextPage();
                    expect(pager.pageNumber).eq(pager.pageCount);
                    expect(wasHandled).false;
                });
            });
        });
        describe('pageNumber', () => {
            it('sets pageNumber to 1 on invalid', () => {
                let pager = new PagedPager();
                pager.pageNumber = null;
                expect(pager.pageNumber).eq(1);
                pager.pageNumber = undefined;
                expect(pager.pageNumber).eq(1);
                pager.pageNumber = -20;
                expect(pager.pageNumber).eq(1);
            });

            it('sets pageNumber to 1 if invalid', () => {
                let pager = new PagedPager();
                pager.pageNumber = null;
                expect(pager.pageNumber).eq(1);
                pager.pageNumber = undefined;
                expect(pager.pageNumber).eq(1);
            });
            it('sets pageNumber no bigger then pageCount', () => {
                let pager = new PagedPager();
                let response = toResponseObject();
                pager.processResponse(response);
                pager.pageNumber = pager.pageCount;
                expect(pager.pageNumber).eq(pager.pageCount);
                pager.pageNumber = pager.pageCount + 10;
                expect(pager.pageNumber).eq(pager.pageCount);
            });
        });
        it('calculates pageCount as count/size', () => {
            let pager = new PagedPager();
            let response = toResponseObject();
            pager.processResponse(response);
            expect(pager.pageCount).eq(Math.ceil(pager.totalCount / pager.pageSize));
        });
    });
});
