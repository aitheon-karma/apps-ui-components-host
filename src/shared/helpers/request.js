import axios from 'axios';
import { addQueryParamsToUrl } from '@/shared/helpers/addQueryParamsToUrl';

export const requestTypes = {
  post: 'post',
  get: 'get',
  put: 'put',
  delete: 'delete',
};

export const request = async (type, url, body, queryParams, absUrl) => {
  const requestType = requestTypes[type];
  const requestMethod = axios[requestType];
  if (queryParams && Object.keys(queryParams)?.length) {
    url = addQueryParamsToUrl(url, queryParams);
  }
  const args = [url];
  if (body) {
    args.push(body);
  }
  if (absUrl) {
    args.push({
      baseURL: ''
    });
  }
  const result = await requestMethod(...args);

  return result;
};
