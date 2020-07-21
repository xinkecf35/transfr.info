/**
 * Promise wrapper for XMLHttpRequest
 * @param {string} method HTTP Request Method
 * @param {string} url the URL for AJAX request
 * @param {string} [body=null] input for Authentication Request
 * @param {array} [headers=null] additional headers to be set by the request
 * @return {object} Promise for XMLHttpRequest
 */
export function ajaxRequest(method, url, body = null, headers = null) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    if (headers) {
      headers.forEach(function(header) {
        xhr.setRequestHeader(header.name, header.value);
      });
    }
    xhr.withCredentials = true;
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({status: xhr.status, response: xhr.response});
      }
    };
    xhr.onerror = function() {
      reject({status: xhr.status, response: xhr.response});
    };
    xhr.send(body);
  });
}

/**
 *
 * @param {string} string uncapitalized string
 * @return {string} Capitalized String
 */
export function capitalize(string) {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
}

/**
 * Null/Empty/Undefined Check for string
 * @param {String} string string to be checked
 * @return {Boolean} Is string empty, null or undefined
 */
export function isEmptyOrNull(string) {
  return string === '' || string === null || string === undefined;
}

/**
 * Empty Object Check, null or undefined
 * @param {Object} object object to be checked
 * @return {Boolean} Is object empty
 */
export function isObjectEmpty(object) {
  if (object !== null && object !== undefined) {
    return Object.keys(object).length === 0 && object.constructor === Object;
  } else {
    return true;
  }
}

export default {ajaxRequest, capitalize, isEmptyOrNull, isObjectEmpty};
