import { useState } from 'react';
import { FoodDTO, getFoods } from '@/backend/get-foods';
import { isTest } from '@/backend/test';
import { ERROR_MESSAGES, APP_CONFIG } from '@/constants/app';

interface SearchState {
  text: string;
  page: number;
  isLoading: boolean;
  results: FoodDTO[];
  selectedItems: string[];
}

interface SearchStateBuilder {
  withText(text: string): SearchStateBuilder;
  withPage(page: number): SearchStateBuilder;
  withLoading(isLoading: boolean): SearchStateBuilder;
  withResults(results: FoodDTO[]): SearchStateBuilder;
  withSelectedItems(items: string[]): SearchStateBuilder;
  build(): SearchState;
}

class SearchStateBuilderImpl implements SearchStateBuilder {
  private state: Partial<SearchState> = {};

  withText(text: string): SearchStateBuilder {
    this.state.text = text;
    return this;
  }

  withPage(page: number): SearchStateBuilder {
    this.state.page = page;
    return this;
  }

  withLoading(isLoading: boolean): SearchStateBuilder {
    this.state.isLoading = isLoading;
    return this;
  }

  withResults(results: FoodDTO[]): SearchStateBuilder {
    this.state.results = results;
    return this;
  }

  withSelectedItems(items: string[]): SearchStateBuilder {
    this.state.selectedItems = items;
    return this;
  }

  build(): SearchState {
    if (
      this.state.text === undefined ||
      this.state.page === undefined ||
      this.state.isLoading === undefined ||
      !this.state.results ||
      !this.state.selectedItems
    ) {
      throw new Error('SearchState is missing required properties');
    }
    return this.state as SearchState;
  }
}

export const useFood = () => {
  const [searchResults, setSearchResults] = useState<FoodDTO[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchPage, setSearchPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const createSearchStateBuilder = (): SearchStateBuilder => new SearchStateBuilderImpl();

  const updateSearchState = (newState: SearchState): void => {
    setSearchText(newState.text);
    setSearchPage(newState.page);
    setIsLoading(newState.isLoading);
    setSearchResults(newState.results);
    setSelectedItems(newState.selectedItems);
  };

  const handleSearch = async (text: string): Promise<void> => {
    if (!text.trim()) {
      const emptyState = createSearchStateBuilder()
        .withText('')
        .withPage(0)
        .withLoading(false)
        .withResults([])
        .withSelectedItems([])
        .build();
      updateSearchState(emptyState);
      return;
    }

    const currentPage = text !== searchText ? 0 : searchPage;

    try {
      const newState = createSearchStateBuilder()
        .withText(text)
        .withPage(currentPage)
        .withLoading(true)
        .withResults(searchResults)
        .withSelectedItems(selectedItems)
        .build();
      updateSearchState(newState);

      const result = await getFoods(text, currentPage);

      const updatedState = createSearchStateBuilder()
        .withText(text)
        .withPage(currentPage)
        .withLoading(false)
        .withResults(currentPage === 0 || isTest ? result : [...searchResults, ...result])
        .withSelectedItems(selectedItems)
        .build();
      updateSearchState(updatedState);
    } catch (error) {
      console.error(ERROR_MESSAGES.FOOD.SEARCH_ERROR, error);
      throw error;
    }
  };

  const loadMoreResults = async (): Promise<void> => {
    const nextPage = searchPage + 1;
    if (nextPage * APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE >= APP_CONFIG.PAGINATION.MAX_RESULTS) {
      return;
    }
    await handleSearch(searchText);
    setSearchPage(nextPage);
  };

  const toggleItemSelection = (id: string): void => {
    const newSelectedItems = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];

    const newState = createSearchStateBuilder()
      .withText(searchText)
      .withPage(searchPage)
      .withLoading(isLoading)
      .withResults(searchResults)
      .withSelectedItems(newSelectedItems)
      .build();
    updateSearchState(newState);
  };

  const getSelectedFoods = (): FoodDTO[] => {
    return searchResults.filter((food) => selectedItems.includes(food.food_id));
  };

  return {
    searchResults,
    isLoading,
    selectedItems,
    handleSearch,
    loadMoreResults,
    toggleItemSelection,
    getSelectedFoods,
  };
};
