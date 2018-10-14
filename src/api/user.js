// import axios from '@/libs/api.request'
import Util from '@/libs/util'

export const login = ({ userName, password }) => {
    const data = {
        userName,
        password
    }
    return new Promise((resolve, reject) => {
        Util.ajax({
            url: '/adminapi/login',
            data,
            method: 'get',
            success: function (result) {
                if (result.error == 0) {
                    resolve(result);
                } else {
                    reject(result);
                }
            },
            error: function (result) {
                reject(result);
            }
        })
    })
}

export const getUserInfo = (token) => {
    return new Promise((resolve, reject) => {
        Util.ajax({
            url: '/adminapi/admins/info',
            method: 'get',
            success: function (result) {
                resolve(result);
            },
            error: function (result) {
                reject(result);
            }
        })
    })

    // return axios.request({
    //     url: 'get_info',
    //     params: {
    //       token
    //     },
    //     method: 'get'
    // })
}

export const logout = (token) => {
    return new Promise((resolve, reject) => {
        Util.ajax({
            url: '/adminapi/logout',
            method: 'post',
            success: function (result) {
                resolve(result);
            },
            error: function (result) {
                reject(result);
            }
        })
    })

    // return axios.request({
    //     url: 'logout',
    //     method: 'post'
    // })
}
