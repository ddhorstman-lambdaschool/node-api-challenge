import axios from "axios";

const baseURL = "http://localhost:5000/api";

/**
 * A function to perform axios calls which automatically include
 * an authorization token specified by the "token" key in localStorage.
 * @param {object} [options] The options to be passed to axios.create()
 */
export function axiosWithAuth(options) {
  let token = localStorage.getItem("token");
  if (token === null) {
    throw new Error(
      `No token found. axiosWithAuth requires a token to be placed in localStorage under the "token" key.`
    );
  }
  try {
    //parse a JSON-encoded token, such as one created by useLocalStorage
    token = JSON.parse(token);
    //console.log(`Found stringified token in localStorage: ${token}`);
  } catch {
    //console.log(`Found non-stringified token in localStorage: ${token}`);
  }
  return axios.create({
    baseURL,
    ...options,
    headers: {
      ...options?.headers,
      Authorization: token,
    },
  });
}

/**
 * A function to perform axios calls similarly to axiosWithAuth,
 * but without automatically including an authorization token.
 * @param {object} [options] The options to be passed to axios.create()
 */
export function axiosWithoutAuth(options) {
  return axios.create({
    baseURL,
    ...options,
  });
}

/**
 * Create an axios instance which automatically includes
 * an authorization token specified by the "token" key in
 * localStorage as well as the ability to cancel the call
 * if the component unmounts.
 * @param {object} [options] The options to pass on to axios.create()
 */
export function axiosWithAuthCancellable(options) {
  let source = axios.CancelToken.source();
  let unmountedInternal = false;

  /**
   * @returns {boolean} Whether the component has been unmounted
   */
  const unmounted = () => unmountedInternal;

  /**
   * A function to cancel the API call in progress and
   * prevent any downstream changes based on the unmounted() property.
   * Call in componentWillUnmount() or return from useEffect().
   */
  const cancelAPICall = () => {
    unmountedInternal = true;
    source.cancel("Component unmounted. Data fetching cancelled.");
  };

  /**
   * A function to perform axios calls which automatically include
   * an authorization token specified by the "token" key in
   * localStorage as well as the ability to cancel the call
   * if the component unmounts using cancelAPICall().
   * @param {object} [optionsInner] The options to be passed to axios.create()
   */
  const axiosWithAuthC = (optionsInner = options) =>
    axiosWithAuth({ ...optionsInner, cancelToken: source.token });

  return {
    isCancel: axios.isCancel,
    unmounted,
    axiosWithAuth: axiosWithAuthC,
    cancelAPICall,
  };
}

export default axiosWithAuth;
