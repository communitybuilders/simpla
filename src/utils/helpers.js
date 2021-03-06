import { DATA_PREFIX, QUERIES_PREFIX } from '../constants/state';

const getRemaining = (prefix, item) => {
  let normalized = prefix.slice(-1) === '/' ? prefix.slice(0, -1) : prefix;

  return (
    item &&
    item.path !== prefix &&
    item.path.indexOf(normalized) === 0 &&
    item.path.charAt(normalized.length) === '/' &&
    item.path.replace(normalized, '')
  );
}

export const filters = {
  parent: parent => item => {
    let leftovers = getRemaining(parent, item);
    return leftovers && leftovers.split('/').length === 2;
  },

  ancestor: ancestor => item => {
    let leftovers = getRemaining(ancestor, item);
    return leftovers && leftovers.indexOf('/') !== -1;
  },

  type: expectedType => item => item && item.type === expectedType
}

export function get(obj, path) {
  path = typeof path === 'string' ? path.split('.') : path;
  return path.length === 0 || typeof obj === 'undefined' ? obj : get(obj[path[0]], path.slice(1));
}

export function selectDataFromState(path, state) {
  let content = state[DATA_PREFIX],
      data;

  if (content) {
    data = content[path];
  }

  return data;
}

export function pathsToResponse(paths, state) {
  let content = state[DATA_PREFIX];

  return {
    items: paths.map(path => content[path])
  };
}

export function findDataInState(query, state) {
  let content = state[DATA_PREFIX],
      paths = [];

  if (!content) {
    return { items: [] };
  }

  paths = Object.keys(query)
    .map(filterBy => filters[filterBy](query[filterBy]))
    .reduce(
      (paths, filter) => paths.filter(path => filter(content[path])),
      Object.keys(content)
    );

  return pathsToResponse(paths, state);
}

export function storeToObserver(store) {
  return {
    observe(...args) {
      let onChange = args.pop(),
          selector = args[0],
          lastState,
          getState,
          handleChange;

      getState = () => {
        return get(store.getState(), selector || []);
      }

      lastState = getState();
      handleChange = () => {
        let currentState = getState();
        if (currentState !== lastState) {
          let args = [ currentState, lastState ];
          lastState = currentState;
          onChange(...args);
        }
      }

      return {
        unobserve: store.subscribe(handleChange)
      };
    }
  }
}

export function matchesQuery(query = {}, content) {
  if (typeof content === 'undefined' || content === null) {
    return false;
  }

  return Object.keys(query)
    .map(filterBy => filters[filterBy](query[filterBy]))
    .every(filter => filter(content));
}

export function ensureActionMatches(expectedType) {
  return (action) => {
    return action.type === expectedType ? Promise.resolve(action) : Promise.reject(action);
  }
}

export function runDispatchAndExpect(dispatch, action, expectedType) {
  const isAction = (response) => typeof response.type !== 'undefined' && typeof response.response !== 'undefined';

  return dispatch(action)
    .then(ensureActionMatches(expectedType))
    .then(
      action => action.response,
      action => isAction(action) ? Promise.reject(action.response) : Promise.reject(action)
    );
}

export function dispatchThunkAndExpect(store, ...args) {
  return runDispatchAndExpect(store.dispatch, ...args);
}

/**
 * Deep clone's the given object recursively. Doesn't touch object's prototype,
 *  and only clones obejct, arrays and primitives.
 * @param  {Object} object Object should be JSON compatible
 * @return {Object}        Clone of given object
 */
export function clone(subject) {
  var cloned;

  if (typeof subject !== 'object' || !subject) {
    return subject;
  }

  if ('[object Array]' === Object.prototype.toString.apply(subject)) {
    return subject.map(clone);
  }

  cloned = {};
  for (let key in subject) {
    if (subject.hasOwnProperty(key)) {
      cloned[key] = clone(subject[key]);
    }
  }

  return cloned;
}

export function dataIsValid(data) {
  let whitelist = [ 'type', 'data' ],
      props = Object.keys(data || {});

  if (props.length === 0) {
    return false;
  }

  return props.every(prop => whitelist.indexOf(prop) !== -1);
}

export function toQueryParams(query = {}) {
  // Sort alphabetically, so that when caching it will always be the same key
  let alphabetically = (a, b) => a < b ? -1 : a > b ? 1 : 0;

  return Object.keys(query)
    .sort(alphabetically)
    .reduce((working, param) => {
      let value = query[param],
          prefix;

      if (!working) {
        prefix = '?';
      } else {
        prefix = `${working}&`;
      }

      return `${prefix}${param}=${encodeURIComponent(value)}`;
    }, '');
}

export function toUidQuery(query) {
  let newQuery = Object.assign({}, query),
      paths = [ 'ancestor', 'parent' ];

  paths.forEach(prop => {
    if (prop in newQuery) {
      newQuery[prop] = pathToUid(newQuery[prop]);
    }
  });

  return newQuery;
}

export function hasRunQuery(query, state) {
  const queryState = state[QUERIES_PREFIX],
        queryParams = toQueryParams(query);
  return !!(queryState && queryState[queryParams] && queryState[queryParams].queriedRemote);
}

export function makeBlankItem() {
  return {
    type: null,
    data: null
  };
}

export function makeItemWith(path, item) {
  if (item === null) {
    return null
  };

  return Object.assign(clone(item), { path });
}

export function pathToUid(path) {
  if (!path) {
    return path;
  }

  path = path.replace(/^\/+/, '').replace(/\/+$/, '');

  return path.split('/').join('.');
}

export function uidToPath(uid) {
  if (!uid) {
    return uid;
  }

  // Normalize so there's always a leading /
  if (uid.charAt(0) !== '.') {
    uid = `.${uid}`;
  }

  return uid.split('.').join('/');
}

export function itemUidToPath(item) {
  let path,
      transformed;

  if (!item || !item.id) {
    return item;
  }

  path = uidToPath(item.id);
  transformed = Object.assign({}, item, { path });
  delete transformed.id;

  return transformed;
}


export function pathIsInvalid(path) {
  if (path.charAt(0) !== '/') {
    return new Error(`Invalid path ${path}. Path must be a string starting with '/'`);
  }

  if (path.indexOf('//') !== -1) {
    return new Error(`Invalid path '${path}'. Paths must not have more than one '/' in a row.`);
  }

  return false;
}

export function validatePath(path) {
  let invalid = pathIsInvalid(path);

  if (invalid) {
    throw invalid;
  }
}

export function jsonIsEqual(a, b) {
  let objectName = window.toString.call(a),
      isSameAsIn = other => (item, i) => jsonIsEqual(item, other[i]),
      hasSameIn = (a, b) => (key) => key in a && key in b && jsonIsEqual(a[key], b[key]),
      keysOfA;

  if (objectName !== toString.call(b)) {
    return false;
  }

  switch (objectName) {
  case '[object String]':
  case '[object Number]':
  case '[object Boolean]':
  case '[object Null]':
  case '[object Undefined]':
    return a === b;
  }

  if (Array.isArray(a)) {
    return a.length === b.length  && a.every(isSameAsIn(b));
  }

  // At this point we assume it's an object
  keysOfA = Object.keys(a);

  if (keysOfA.length !== Object.keys(b).length) {
    return false;
  }

  return keysOfA.every(hasSameIn(a, b));
}
