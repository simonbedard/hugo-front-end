export interface ISearchHistory {
  title: string
}

export function SearchManager() {
  // composable
  const searchHistoryCookie = useCookie<any>('search')

  // state
  const getSearchHistory = (): any => searchHistoryCookie.value || [];
  const searchHistory = useState<ISearchHistory>('search.history', () => 
    getSearchHistory()
  );
  
  // wathcers
  watch(searchHistory, (history) => {
      console.log(toRaw(history));
      searchHistoryCookie.value = Object.assign([], history);
    },
    { deep: true }
  )

  // init theme
  const init = () => {
    searchHistory.value = getSearchHistory()
  }

  onBeforeMount(() => init())
  onBeforeUnmount(() => {})

  return {
    searchHistory,
    init
  }
}