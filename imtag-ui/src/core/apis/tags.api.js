function getTags(userId, cb) {
  let domain = getDomain();

  let url = '/tags';

  if (userId) {
    url = `/tags?user=${userId}`;
  }

  return fetch(`${domain}${url}`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function postTag(payload, cb) {
  let domain = getDomain();

  return fetch(`${domain}/tags`, {
    accept: 'application/json',
    method: 'post',
    body: JSON.stringify(payload)
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function getDomain() {
  let domain = `https://api-dustin.1strategy-sandbox.com/api`;

  if (process.env.REACT_APP_ENV === 'dev') {
    domain = 'http://localhost:8001';
  }

  return domain;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error);
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const TagsApi = { getTags, postTag };
export default TagsApi;
