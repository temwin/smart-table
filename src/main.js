import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

import { initPagination } from "./components/pagination.js";

import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const API = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); 
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState();
  let query = {};
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applyPagination(query, state, action);
  query = applySorting(query, state, action);
  const { total, items } = await API.getRecords(query);
  updatePagination(total, query);
  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

let applyFiltering;
let applySearching;

async function init() {
  const indexes = await API.getIndexes();
  const filtering = initFiltering(sampleTable.filter.elements);
  applyFiltering = filtering.applyFiltering;

  filtering.updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });

  applySearching = initSearching(
    sampleTable.search.elements,
    indexes,
    "search"
  );
}

init().then(render);
