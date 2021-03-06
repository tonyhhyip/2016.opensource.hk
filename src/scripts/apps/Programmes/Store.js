'use strict';

import { createStore } from "redux";

class actions {

  // set all properties of the filters at once
  static setFilters(filters) {
    return {
      filters,
      type: "FILTER_SET"
    }
  }

  // reset filter properties to empty object
  static resetFilters() {
    return {
      type: "FILTER_SET",
      filters: {}
    }
  }

  // set an attribute value
  static setAttribute(key, value) {
    return {
      "type": "ATTR_SET",
      key,
      value
    }
  }

  // add a specific filter
  static addFilter(key, value) {
    return {
      key,
      value,
      type: "FILTER_ADD_PROP"
    }
  }

  // remove a specific filter
  static removeFilter(key, value) {
    return {
      key,
      value,
      type: "FILTER_REMOVE_PROP"
    }
  }

  // setHighlight highlights some
  // row information provided to the action
  // (should trigger pop up)
  static setHighlight(highlightType, highlight) {
    return {
      highlightType,
      highlight,
      type: "SET_HIGHLIGHT"
    }
  }

  static unsetHighlight() {
    return {
      type: "UNSET_HIGHLIGHT"
    }
  }

}

// filterer the all array by the definition of filters
function filterer(filters, all) {
  const result = all.filter((item) => {
    for (let key in filters) {
      var match = false;
      for (let value of filters[key]) {
        if (Array.isArray(item[key])) {

          if (item[key].indexOf(value) !== -1) {
            match = true;
            break;
          }

        } else if (item[key] === value) {
          match = true;
          break;
        }
      }
      if (!match) {
        return false;
      }
    }
    return true;
  });
  return result
}

const initialState = {
  // full data tree for rendering
  "data": {},

  // array of processed topic objects for filtering to work with
  "all": [],

  // an object to store all filters in the format:
  //   {
  //     "prop1": ["value1", "value2"],
  //     "prop2": ["value3", "value4"],
  //   }
  //
  // as in to search for:
  //
  //   objects in all with
  //       (prop1 is / has "value1" or "value2") and
  //       (prop2 is / has "value3" or "value4")
  //
  "filters": {},

  // an object of attributes
  "attributes": {
    "filterShow": true
  },

  // a shortlisted version of "all" array according to filters criteria
  // (Note: if filters is empty, show all items in "all")
  "display": []
};

// apply filter add / remove actions to the store
function reducer(state = initialState, action) {

  const { all, attributes } = state;

  switch (action.type) {

    case "ATTR_SET":
      const newAttrs = Object.assign(
        {},
        attributes,
        {
          [action.key]: action.value
        }
      );

      // apply filter properties and deduct the display array
      return Object.assign(
        {},
        state,
        {
          attributes: newAttrs
        }
      );

    case "FILTER_SET":
      return Object.assign(
        {},
        state,
        {
          display: filterer(action.filters, all),
          filters: action.filters
        }
      );

    case "FILTER_ADD_PROP":

      // add filter properties
      var filters = Object.assign({}, state.filters);
      if (typeof state.filters[action.key] === "undefined") {
        filters[action.key] = [action.value];
      } else {
        filters[action.key] = [
          ...filters[action.key],
          action.value
        ];
      }

      // apply filter properties and deduct the display array
      return Object.assign(
        {},
        state,
        {
          filters,
          display: filterer(filters, all)
        }
      );

    case "FILTER_REMOVE_PROP":

      // remove filter properties
      var filters = Object.assign({}, state.filters);
      if (typeof state.filters[action.key] !== "undefined") {
        var keyFilter = filters[action.key].reduce((results, current) => {
          if (action.value !== current) {
            results.push(current);
          }
          return results;
        }, []);

        // delete filter[action.key] if it is empty
        if (keyFilter.length === 0) {
          delete filters[action.key];
        } else {
          filters[action.key] = keyFilter;
        }
      }

      // apply filter properties and deduct the display array
      return Object.assign(
        {},
        state,
        {
          filters,
          display: filterer(filters, all)
        }
      );

    case "SET_HIGHLIGHT":
      // set the highlight object
      return Object.assign(
        {},
        state,
        {
          highlight: {
            type: action.highlightType,
            item: action.highlight
          }
        }
      );

    case "UNSET_HIGHLIGHT":
      var result = Object.assign(
        {},
        state
      )
      if (typeof result.highlight != "undefined") {
        delete result.highlight;
      }
      return result;

    default:
      return state;
  }
}

export { actions, filterer, reducer };

export default function (initialState) {
  return createStore(reducer, initialState);
};
