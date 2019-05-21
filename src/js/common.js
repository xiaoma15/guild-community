let storage = {
    get(key, isLocalStorage = true) {
        if (!key) return null
        let _storage = isLocalStorage ? localStorage : sessionStorage,
            props = key.split('.'),
            k = props.shift(),
            itemStr = _storage.getItem(k),
            itemObj = null
        try {
            itemObj = JSON.parse(itemStr)
            if (typeof itemObj != 'object')
                throw('Not an object!')
        } catch (e) {
            return props.length ? null : itemStr
        }
        while (props.length && itemObj) {
            itemObj = itemObj[props.shift()]
        }
        return itemObj
    },
    set(key, value, isLocalStorage = true) {
        if (!key) return
        let _storage = isLocalStorage ? localStorage : sessionStorage,
            props = key.split('.'),
            k = props.shift()
        if (!props.length) {
            if (typeof value === 'object') value = JSON.stringify(value)
            _storage.setItem(k, value)
            return
        }
        let itemStr = _storage.getItem(k),
            itemObj = null
        if (itemStr) {
            try {
                itemObj = JSON.parse(itemStr)
                if (typeof itemObj != 'object')
                    throw('Not an object!')
            } catch (e) {
                throw('storage.set: key ' + k + ' 已被占用并且不是一个对象，无法为其设置属性值' )
            }
        }
        let copy = itemObj = itemObj || {}
        while (props.length > 1) {
            let p = props.shift()
            copy[p] = copy[p] || {}
            copy = copy[p]
        }
        copy[props[0]] = value
        _storage.setItem(k, JSON.stringify(itemObj))
    },
    remove(key, isLocalStorage = true) {
        if (!key) return
        let _storage = isLocalStorage ? localStorage : sessionStorage
        _storage.removeItem(key)
    },
    clear(isLocalStorage = true) {
        let _storage = isLocalStorage ? localStorage : sessionStorage
        _storage.clear()
    },
    // 生成uuid
    getUuid(len, radix) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;
            // uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; // TODO 暂时放着，看后端要求的格式
            uuid[14] = '4';
            for (i = 0; i < 32; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    // 生成requireTime
    getTime() {
        var date = new Date();
        var year = date.getFullYear();
        var mon = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        var hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
        var mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        var ss = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
        if (hh*1 > 12) {
            hh = (hh*1 - 12) > 9 ? hh : '0' + (hh*1-12);
        }
        return year + '-' + mon + '-' + day + ' ' + hh + ':' + mm + ':' + ss;
    }
}
// 防抖函数，让某个函数在上一次执行后，满足等待某个时间内不再触发此函数后再执行，而在这个等待时间内再次触发此函数，等待时间会重新计算
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    var later = function () {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };
    return function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
let methods = {
    isIOS() {
        let isIphone, ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            // alert("iphone");
            isIphone = true
        } else if (/android/.test(ua)) {
            // alert("android");
            isIphone = false
        }
        return isIphone
    },
    storage: storage,
    devicePixelRatio() {
        let default_dpr = 1;
        let dpr = window.devicePixelRatio;
        let scale = (dpr / default_dpr).toFixed(0);
        return scale > 0 ? scale : 1;
    },
    debounce,
    /**
     * function canvasImageToBase64
     * @param url
     * @returns {Promise<any>}
     */
    canvasImageToBase64(url) {
        return new Promise((resolve, reject) => {
            try {
                //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
                var Img = new Image(),
                    dataURL='';
                Img.src = url;
                Img.onload = function(){ //要先确保图片完整获取到，这是个异步事件
                    var canvas = document.createElement("canvas"), //创建canvas元素
                        width = Img.width, //确保canvas的尺寸和图片一样
                        height = Img.height;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
                    dataURL = canvas.toDataURL('image/jpeg'); //转换图片为dataURL
                    resolve(dataURL)
                };
            } catch(e) {
                throw error('canvas to base64 error!')
                reject(e);
            }
        })
    },
};

export {storage, methods}
export default methods
