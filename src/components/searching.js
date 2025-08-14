import {rules, createComparison, defaultRules} from "../lib/compare.js";


export function initSearching(elements, indexes, searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison({
        skipEmptyTargetValues: true,
        searchMultipleFields: (searchField, fields, skipEmpty) => {
            return (row) => {
                return fields.some((field) => {
                    const value = String(row[field]).toLowerCase();
                    return value.includes(searchField.toLowerCase())
                })
            }
        }
    })
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        if (state.search) {
        return data.filter((row) => compare(row, state));
        }
        return data;
    };
}