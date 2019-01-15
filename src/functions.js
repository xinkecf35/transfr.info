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
