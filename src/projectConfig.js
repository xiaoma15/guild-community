'use strict';

var exports = {
    // base url
    get baseUrl() {
        var test = 'https://newimtest.midea.com/mas-api/proxy',
            // var test = 'https://mapnew.midea.com/mas-api/proxy', // 测试正式环境时用的
            prod = 'https://mapnew.midea.com/mas-api/proxy';
        return this.isTest ? test : prod;
    },
    // get mideaCloudUrl() {
    //     var test = '10.17.158.231:18090',
    //     var prod = '10.17.158.232:18090'
    // },
    get resfulUrl() {
        var test = 'https://newimtest.midea.com/mas-api/restful/mideaoutOcr/bill/billInfoGet',
            prod = 'https://mapnew.midea.com/mas-api/restful/mideaoutOcr/bill/billInfoGet';
        return this.isTest ? test : prod;
    },
    // 是否是测试环境
    get isTest() {
        return $envType.type === 0 || $envType.type === 1;
    },
    // 是否是pc环境
    get isPcTest() {
        return $envType.type === 0;
    },
    // token名字
    get tokenName() {
        return this.isTest ? 'mideatest_sso_token' : 'midea_sso_token'
        // return this.isTest ? 'midea_sso_token' : 'midea_sso_token' // 测试正式环境时用的
    },
    // 用于pc环境调试的用户数据
    get fakeUser() {
        return {
            user: {
                // uid: 'ex_guowj',
                uid: '13971104089',
                cn:'张兆东',
                // employeeType:'40',
                employeeType:'10',
                ssoToken: 'T2521197878985728'
            },
            device: {
                deviceId: 'ffffffff-877b-32bf-97a1-79270e96b4e3',
                imei: '860076034608991',
                deviceIp: '0.0.0.0'
            }
        }
    },
    // 美的云的appkey
    get appKey() {
        return this.isTest ? 'b25e5fd0365a4b4e9e95ade368d77715' : '2a340853ce6f40d29cd125ab8c14419b'
    },
    // 美的云的appId
    get appId() {
        return this.isTest ? 'bb9a8cf40c2340b1bbe3be5673525fd1' : '9194f76b2703477391922493ca12547c'
    }
};

module.exports = exports;
