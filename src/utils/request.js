/**
 * 请求工具
 */

import Axios from 'axios'


//后台的contextPath 不是http 全路径 ，请求后台用反向代理
const baseUrl = 'api/1.0'

/*
 * 请求配置 config
 */
export const getConfig = (url, method, isJSON, params, message={message:false,hideLoading:false}, isDownload=false) => {
    var split = '/'
    if(url.substring(0,1) == '/') {
        split = '';
    }

    let config = {
        url: `${baseUrl}${split}${url}`,
        method,
        headers: {

        },
        hideLoading:message.hideLoading,
        message:message.message
    }
    if(isDownload) {
        config.responseType ='blob'
    }

    if (!isJSON) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
        // params = Qs.stringify(params)
    } else {
        config.headers['Content-Type'] = 'application/json; charset=UTF-8'
    }

    if (method in {get: true, delete: true}) {
        config.params = params
    } else {
        config.data = params
    }
    return config
}

/**
 * post方式请求 json方式传参
 * @param url 请求url
 * @param params payload 参数
 *
 */

const post = (url, params,message) => {
    return Axios(getConfig(url, 'post', true, params,message))
}
const postDownload = (url, params, hideLoading) => {

    return Axios(getConfig(url, 'post', true, params,hideLoading,true))
}
/**
 * post方式请求 表单传参
 * @param url 请求url
 * @param params fromData 参数
 */

const postForm = (url, params,hideLoading) => {
    return Axios(getConfig(url, 'post', false, params,hideLoading))
}


/**
 * get方式请求，url传参
 * @param url 请求url
 * @param params 参数
 */

const get = (url, params,message) => {
    let result = Axios(getConfig(url, 'get', false, params,message))
    return result
}

export {
    Axios,
    get,
    post,
    postForm,
    postDownload,
    baseUrl
}
