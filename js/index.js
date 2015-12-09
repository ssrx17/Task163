/*判断cookie值*/
window.onload = function () {
    if (getcookie().tip !== 'tipClose') {
        $('.m-tip').style.marginTop = '0px';
    }
    if (getcookie().loginSuc == '1') {
        $('.u-fol').style.display = 'none';
        $('.u-fed').style.display = 'inline-block';
    }

    getCourse(pageNow);
    hotList();
    carouselPic();
};



/*关闭 tip 条 */
addEvent($('.m-tip'), 'click', closetip);

function closetip() {
    $('.m-tip').style.marginTop = '-36px';
    setCookie('tip', 'tipClose');
}



/*遮罩层_登录框&视频播放*/
addEvent($('#loginOpen'), 'click', showLogin);
addEvent($('#loginClose'), 'click', hiddenLogin);
addEvent($('#videoOpen'), 'click', showVideo);
addEvent($('#videoClose'), 'click', hiddenVideo);
addEvent($('.u-mask'), 'click', hiddenLogin);
addEvent($('.u-mask'), 'click', hiddenVideo);
//弹窗_登录框-显示
function showLogin() {
    $('.u-mask').style.visibility = 'visible';
    $('.m-login').style.visibility = 'visible';
}
//弹窗_登录框-关闭
function hiddenLogin() {
    $('.u-mask').style.visibility = 'hidden';
    $('.m-login').style.visibility = 'hidden';
}
//弹窗_视频-显示
function showVideo() {
    $('.u-mask').style.visibility = 'visible';
    $('.m-video').style.visibility = 'visible';
}
//弹窗_视频-关闭
function hiddenVideo() {
    $('.u-mask').style.visibility = 'hidden';
    $('.m-video').style.visibility = 'hidden';
    $('video').pause();
}


/*登录*/
addEvent($('.m-login button'), 'click', login);

function login() {
    var account = $('.u-inputName').value,
        pswd = $('.u-inputPass').value;
    var options = {
        userName: md5(account),
        password: md5(pswd)
    };
    var url = 'http://study.163.com/webDev/login.htm';
    console.log(options);
    get(url, options, fu);

    function fu(response) {
        if (response == 1) {
            $('.u-fol').style.display = 'none';
            $('.u-fed').style.display = 'inline-block';
            hiddenLogin();
            setCookie('loginSuc', 1);
            followAPI();
        } else {
            alert('糟糕惹！萌萌哒系统检测到您的『账号』和『密码』不再爱着对方了，试着重新输入让他们结婚或者彻底分手吧 ？｡◕‿◕｡');
        }
    }

    function followAPI() {
        var url = 'http://study.163.com/webDev/attention.htm';
        get(url, null, function (response) {
            if (response == 1) {
                setCookie('followSuc', 1);
            };
        })
    }
}



/*轮播图*/
function carouselPic() {
    var nowIndex = 0;
    var li_Pic = document.querySelectorAll('.g-tt li'),
        li_Point = document.querySelectorAll('.g-tt i');

    //删除当前的ClassName
    var del_ClassName = function () {
        for (var i = 0; i < li_Point.length; i++) {
            li_Pic[i].className = '';
            li_Point[i].className = '';
        }
    };

    //淡入效果
    var fadeIn = function (element) {
        element.style.opacity = 0.5;

        function show() {
            if (element.style.opacity == 1) {
                clearInterval(timeoutID);
            } else {
                element.style.opacity = Number(element.style.opacity) + 0.1;
            }
        }
        var timeoutID = setInterval(show, 100);
    };

    //点击原点切换图片
    addEvent($('.u-pointer'), 'click', function (event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        nowIndex = target.innerText;

        del_ClassName();
        target.className = 'z-crt';
        fadeIn(li_Pic[nowIndex]);
        li_Pic[nowIndex].className = 'z-crt';
    });

    //自动切换
    var intervalId = setInterval(autoPic, 5000);

    function autoPic() {
        if (nowIndex == li_Point.length - 1) {
            nowIndex = 0;
        } else {
            nowIndex++;
        }

        del_ClassName();
        li_Pic[nowIndex].className = 'z-crt';
        fadeIn(li_Pic[nowIndex]);
        li_Point[nowIndex].className = 'z-crt';
    }

    //移入移出时控制定时器
    addEvent($('.g-tt'), 'mouseover', function () {
        clearInterval(intervalId);
    });
    addEvent($('.g-tt'), 'mouseout', function () {
        intervalId = setInterval(autoPic, 5000);
    });

}



/*课程列表及分页模块*/
var pageNow = Number(location.href.split('#')[1]) || 1;
var pageSize = 20;
var pageType = 10;

//页码切换事件代理
addEvent($('.m-page'), 'click', function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var clickPageNum = Number(target.href.split('#')[1]);
    if (clickPageNum !== pageNow) {
        pageNow = clickPageNum;
        getCourse(pageNow);
    }
});

//课程类别切换事件注册
addEvent($('.m-btn'), 'change', rdoCourse);

function rdoCourse() {
    if ($('#radio-2-2').checked) {
        pageType = 20;
    } else {
        pageType = 10;
    }
    pageNow = 1;
    location.href = '#1';
    getCourse(pageNow);
}

//获取课程内容与生成画面
function getCourse(now) {
    var url = "http://study.163.com/webDev/couresByCategory.htm";
    var options = {
        pageNo: now,
        psize: pageSize,
        type: pageType
    };

    //get数据
    get(url, options, function (response) {
        drawCourse(response);
        drawPage(response);
    });

    //页面课程内容生成
    function drawCourse(response) {
        var data = JSON.parse(response);

        var l_img = document.querySelectorAll('.u-li img'),
            l_name = document.querySelectorAll('.u-li .f-name'),
            l_provider = document.querySelectorAll('.u-li .f-provider'),
            l_category = document.querySelectorAll('.u-li f-category'),
            l_learnerCount = document.querySelectorAll('.u-li .f-learnerCount'),
            l_price = document.querySelectorAll('.u-li .f-price'),
            l_description = document.querySelectorAll('.u-li .f-description');

        for (var i = 0, list = data.list; i < list.length; i++) {
            l_img[i].src = list[i].middlePhotoUrl;
            l_name[i].innerText = list[i].name;
            l_provider[i].innerText = list[i].provider;
            l_learnerCount[i].innerText = list[i].learnerCount;
            l_price[i].innerText = '￥' + list[i].price.toFixed(2);
            l_description[i].innerText = list[i].description;
        }
    }
    //页码生成
    function drawPage(response) {
        var data = JSON.parse(response);
        var pageTotal = data.totalPage || 8;

        //取得页码的初始页
        var minPage = function () {
            if (pageNow - 4 <= 1) {
                return 1;
            } else {
                if (pageNow - 4 >= pageTotal - 7) {
                    return pageTotal - 7;
                } else {
                    return pageNow - 4;
                }
            }
        };
        //准备插入新页码前先清空此前的页码
        $('.m-page').innerText = '';

        //上一页
        if (pageNow == 1) {
            var ppS = document.createElement('span');
            ppS.className = 'z-dis';
            ppS.innerText = ' < ';
            $('.m-page').appendChild(ppS);
        } else {
            var ppA = document.createElement('a');
            ppA.className = 'z-nex';
            ppA.href = '#' + (pageNow - 1);
            ppA.innerText = ' < ';
            $('.m-page').appendChild(ppA);
        }

        //循环生成页码节点
        for (var i = minPage(); i <= minPage() + 7; i++) {
            if (pageNow == i) {
                var oS = document.createElement('span');
                oS.className = 'z-dis';
                oS.innerText = i;
                $('.m-page').appendChild(oS);
            } else {
                var oA = document.createElement('a');
                oA.href = '#' + i;
                oA.innerText = i;
                $('.m-page').appendChild(oA);
            }
        }

        //下一页
        if (pageNow == pageTotal) {
            var npS = document.createElement('span');
            npS.className = 'z-dis';
            npS.innerText = ' > ';
            $('.m-page').appendChild(npS);
        } else {
            var npA = document.createElement('a');
            npA.className = 'z-nex';
            npA.href = '#' + (pageNow + 1);
            npA.innerText = ' > ';
            $('.m-page').appendChild(npA);
        }
    }
}


/*热门推荐及滚动模块*/
function hotList() {
    var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
    var oUl = $('.m-top ul');
    var aLi = $('.m-top li');

    //获取热门排行课程数据
    get(url, null, initTop);

    //初始化热门课程列表
    function initTop(response) {
        var data = JSON.parse(response);

        var l_img = document.querySelectorAll('.m-top img'),
            l_name = document.querySelectorAll('.m-top .f-name'),
            l_learnerCount = document.querySelectorAll('.m-top .f-learnerCount');

        //生成热门课程列表
        var listIndex = 0;
        var drawList = function () {
            for (var i = 0; i < 10; i++) {
                if (listIndex >= 20) {
                    listIndex = 0;
                }
                l_img[i].src = data[listIndex].smallPhotoUrl;
                l_name[i].innerText = data[listIndex].name;
                l_learnerCount[i].innerText = data[listIndex].learnerCount;
                listIndex++;
            }
        };
        drawList();

        //自动滚动
        setInterval(scroll, 5000);

        function scroll() {
            if ((listIndex - 9) < 0) {
                listIndex = listIndex + 20 - 9;
            } else {
                listIndex = listIndex - 9;
            }
            drawList();
        }
    }
}