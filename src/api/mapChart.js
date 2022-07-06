import {get, post, postForm,postDownload} from '@/utils/request';

export function getPoetryList(params) {
  return get("test/selectPoetry", params, false);
}

export function getCityInfo(params) {
  return get("test/selectCity", params, false);
}
