/**
 * mini $ （querySelector的便捷用法）
 * 
 * @param  {string} selector 选择器
 * @return {HTMLElement} 返回匹配的元素
 */
function $(selector) {
    return document.querySelector(selector);
}

/*读取 cookie*/
function getcookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '') return cookie;
    var list = all.split('; ');
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}

/*设置 cookie*/
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}

/**
 * 实现了对Ajax请求GET方法的封装
 * @param
 * url        {String}    请求资源的url
 * options    {Object}    请求的查询参数
 * callback   {Function}  请求的回调函数，接收XMLHttpRequest对象的responseText属性作为参数
 * @return    void
 */
function get(url, options, callback) {
    //所有现代浏览器均支持 XMLHttpRequest 对象（IE5 和 IE6 使用 ActiveXObject）
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    //当请求被发送到服务器时，我们需要执行一些基于响应的任务。每当 readyState 改变时，就会触发 onreadystatechange 事件。
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            //http 状态码 200到300是指服务端正常返回;304是告诉客户端取缓存数据
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                //responseText 属性返回字符串形式的响应
                callback(xhr.responseText);
            } else {
                console.error("请求错误：" + xhr.status + " " + xhr.statusText);
            }
        }
    };
    xhr.open("GET", url + "?" + serialize(options), true);
    xhr.send(null);
}
/**
 * Ajax 请求参数序列化(查询对象转换为查询字符串)
 * @param  {Object} data 请求的查询参数
 * @return {String}      序列化后的查询参数
 */
function serialize(data) {
    if (!data) return '';
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}





/*IE 兼容 事件注册*/
var addEvent = document.addEventListener ?
    function (elem, type, listener, useCapture) {
        elem.addEventListener(type, listener, useCapture);
    } :
    function (elem, type, listener, useCapture) {
        elem.attachEvent('on' + type, listener);
    };

/*FF 兼容 innerText*/
if (!('innerText' in document.body)) {
    HTMLElement.prototype.__defineGetter__('innerText', function () {
        return this.textContent;
    });
    HTMLElement.prototype.__defineSetter__('innerText', function (s) {
        return this.textContent = s;
    });
}