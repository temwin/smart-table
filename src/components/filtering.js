import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    if (elements[elementName]) {
      const options = Object.values(indexes[elementName]);
      const optionElements = options.map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      });
      elements[elementName].append(...optionElements);
    }
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const input = action.parentElement.querySelector("input");
      if (input) {
        input.value = "";
        const field = action.dataset.field;
        state[field] = "";
      }
    }

    if (state.search) {
        data = data.filter(row => {
            return Object.keys(row).some(key => {
                const cellValue = String(row[key]).toLowerCase();
                const searchValue = state.search.toLowerCase();
                return cellValue.includes(searchValue);
            });
        });
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, state));
  };
}
