/**
 * Promise wrapper for XMLHttpRequest
 * @param {string} method HTTP Request Method
 * @param {string} url the URL for Ajax request
 * @param {string} body input for Authentication Request
 * @return {object} Promise for XMLHttpRequest
 */
export function ajaxRequest(method, url, body) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.withCredentials = true;
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
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
