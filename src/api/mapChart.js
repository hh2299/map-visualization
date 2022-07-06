import {get, post, postForm,postDownload} from '@/utils/request';

export function getPoetryList(params) {
  return get("Poetry/selectPoetry", params, false);
}

export function getCityInfo(params) {
  return get("City/selectCity", params, false);
}
