import React, { Component } from 'react';
import 'whatwg-fetch';
import 'es6-promise';

class NetUtil extends React.Component{
    /*
     *  get请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static get(url, params, resolve, reject){
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        //fetch请求
        fetch(url, {
            method: 'GET',
            mode: "cors",
            headers:{
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
                //return response.json();
            })
            .then((responseJSON) => {
                resolve(responseJSON);
            }).catch((err) => {
                reject(err);
                console.log(err);
            });
    }
    /*
     *  post请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static post(url,formData,resolve,reject){
        //fetch请求
        //fetch请求
        fetch(url, {
            method: 'POST',
            mode: "cors",
            headers:{
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(formData), 
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
                //return response.json();
            })
            .then((responseJSON) => {
                resolve(responseJSON);
            }).catch((err) => {
                reject(err);
                console.log(err);
            });
    }
    
    promiseRequest(url, method, params = ''){
        let header = {
            "Content-Type": "application/json;charset=UTF-8",
            "accesstoken":token  //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
        };
        console.log('request url:',url,params);  //打印请求参数
        if(params == ''){   //如果网络请求中带有参数
            return new Promise(function (resolve, reject) {
                fetch(common_url + url, {
                    method: method,
                    headers: header
                }).then((response) => response.json())
                    .then((responseData) => {
                        console.log('res:',url,responseData);  //网络请求成功返回的数据
                        resolve(responseData);
                    })
                    .catch( (err) => {
                        console.log('err:',url, err);     //网络请求失败返回的数据        
                        reject(err);
                    });
            });
        }else{   //如果网络请求中没有参数
            return new Promise(function (resolve, reject) {
                fetch(common_url + url, {
                    method: method,
                    headers: header,
                    body:JSON.stringify(params)   //body参数，通常需要转换成字符串后服务器才能解析
                }).then((response) => response.json())
                    .then((responseData) => {
                        console.log('res:',url, responseData);   //网络请求成功返回的数据
                        resolve(responseData);
                    })
                    .catch( (err) => {
                        console.log('err:',url, err);   //网络请求失败返回的数据  
                        reject(err);
                    });
            });
        }
    } 
 
 
}
 
module.exports = NetUtil;