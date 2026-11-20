import { NbSearchService } from '@liquid-js/lyr-core';

describe('NbSearchService', () => {
  it('should emit onSearchInput when searchInput called', () => {
    const term = 'term';
    const tag = 'tag';
    const searchService = new NbSearchService();
    const onSearchInputSpy = vi.fn();
    searchService.onSearchInput().subscribe(onSearchInputSpy);

    searchService.searchInput(term, tag);

    expect(onSearchInputSpy).toHaveBeenCalledTimes(1);
    expect(onSearchInputSpy.mock.calls[0]).toEqual(expect.objectContaining([{ term, tag }]));
  });
});
