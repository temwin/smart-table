export function initSearching(elements, indexes, searchField) {
  return (query, state, action) => {
    return state[searchField]
      ? Object.assign({}, query, {
          search: state[searchField],
        })
      : query;
  };
}
