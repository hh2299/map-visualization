/**
 * 请求工具
 */

// import {getToken, getUserToken, getRedirectUrlLogin} from '@/utils/common'

//后台的contextPath 不是http 全路径 ，请求后台用反向代理
// const baseUrl = 'http://47.114.105.158:8081/'
const baseUrl = 'http://47.114.105.158:8081/'


function post(url, params) {
  params = JSON.stringify(params)
  let that = this
  $.ajax({
    type:'post',
    url: baseUrl+url,
    data:params,
    async:false,
    contentType: "application/json;charset=UTF-8",
    datatype:'json',               //同步调用，保证先执行result=true,后再执行return result;
    success:function(res){
      if(res.status==200){
        data = res.data

      }else{
        that.$alert(data)
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert(XMLHttpRequest.status);
      alert(XMLHttpRequest.readyState);
      alert(textStatus);
    },
  });
  return data
}

function get(url, param){
  let that = this
  let id = param.id
  $.ajax({
    type:'get',
    url: baseUrl+url+'?id='+id,
    async:false,
    contentType: "application/json;charset=UTF-8",
    datatype:'json',               //同步调用，保证先执行result=true,后再执行return result;
    success:function(res){
      if(res.status==200){
        data = res.data

      }else{
        that.$alert(data)
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert(XMLHttpRequest.status);
      alert(XMLHttpRequest.readyState);
      alert(textStatus);
    },
  });
  return data
}
