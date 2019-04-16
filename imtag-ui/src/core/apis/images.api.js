function getImage(cb) {
  let domain = getDomain();

  return fetch(`${domain}/images`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function getDomain() {
  let domain = `https://api-dustin.1strategy-sandbox.com/v1`;

  if (process.env.REACT_APP_ENV === 'dev') {
    domain = 'http://localhost:8000';
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

const ImagesApi = { getImage };
export default ImagesApi;
