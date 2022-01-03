str62keys = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
/**
* 10进制值转换为62进制
* @param {String} int10 10进制值
* @return {String} 62进制值
*/
function int10to62(int10) {
    var s62 = '';
    var r = 0;
    while (int10 != 0) {
        r = int10 % 62;
        s62 = this.str62keys.charAt(r) + s62;
        int10 = Math.floor(int10 / 62);
    }
    return s62;
}
/**
* id转换为mid
* @param {String} id 微博id，如 "201110410216293360"
* @return {String} 微博mid，如 "wr4mOFqpbO"
*/
function id2mid(id) {
    if (typeof (id) != 'string') {
        return false; // id数值较大，必须为字符串！
    }
    var mid = '';
    for (var i = id.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
    {
        var offset1 = i < 0 ? 0 : i;
        var offset2 = i + 7;
        var num = id.substring(offset1, offset2);
        num = int10to62(num);
        mid = num + mid;
    }
    return mid;
}


if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}


parseParams = (obj) => {
    let result = '';
    let item;
    for (item in obj) {
        if (obj[item] && String(obj[item])) {
            result += '{0}={1}&'.format(item, obj[item]);
        }
    }
    return result;
}

// var url = "https://api.weibo.cn/2/profile/statuses?fid=1076033283000062_-_WEIBO_SECOND_PROFILE_WEIBO&c=weicoabroad&v_p=82&count=20&source=4215535043&ua=STF-AL10_9_WeiboIntlAndroid_4001&uid=2005459566081&s=77777777&wm=2468_1001&gsid=_2AkMW-WVLf8NhqwFRmP0RyWLnaot3wgnEieKgpZSQJRM3HRl-wT8Xqk8AtRV6PUQylw6VwKuF-YIMRbSedqY5XHqBp04b&from=1299295010&page=1&lang=zh_CN_%23Hans&containerid=1076033283000062_-_WEIBO_SECOND_PROFILE_WEIBO&v_f=2&aid=01A2DPJaQ09TNVimbGGXqPqou71QFpyw7ro1OA0xfDRe3fZwY.&need_new_pop=0&need_head_cards=0&q=%E4%B8%89%E5%AD%A9"
// console.log(url)

// var url1 = "https://api.weibo.cn/2/profile/statuses?{0}".format(parseParams(params))
// console.log(url1)


function update(array, new_user_id, newest_weibo_id) {
    var input = document.getElementById('user_id');
    var save = document.getElementById('save');
    var hasExist = false
    for (var i = 0; i < array.length; i++) {
        if (array[i].user_id == new_user_id) {
            hasExist = true
            if ((parseInt(newest_weibo_id) > 0) && newest_weibo_id != array[i].newest_weibo_id) {
                array[i].newest_weibo_id = newest_weibo_id;
                chrome.storage.sync.set({
                    user_id_list: array
                }, function () {
                    console.log("newest weibo id changed");
                    // alert("newest weibo id changed")
                    return;
                });
            }
            break
        }
    }
    if (input == undefined || save == undefined) {
        // 说明 popup 没有打开
        return;
    }
    if (hasExist) {
        alert("请勿重复添加")
        input.value = ""
        input.setAttribute("placeholder", "请输入微博数字 uid ")
        save.innerHTML = "保存"
    } else {
        array.push({
            "user_id": new_user_id,
            "newest_weibo_id": newest_weibo_id
        });
        //then call the set to update with modified value
        chrome.storage.sync.set({
            user_id_list: array
        }, function () {
            console.log("added to list with new values");
            input.value = ""
            input.setAttribute("placeholder", "继续输入微博数字 uid ")
            alert("添加成功")
            save.innerHTML = "保存"
        });
    }
}

// chrome.runtime.onInstalled.addListener(function () {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//         chrome.declarativeContent.onPageChanged.addRules([
//             {
//                 conditions: [
//                     // 只有打开 weibo.com 才显示 pageAction
//                     new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'weibo.com' } })
//                 ],
//                 actions: [new chrome.declarativeContent.ShowPageAction()]
//             }
//         ]);
//     });
// });

function formatDate (date, format) {
    if (date == null) {
        return "";
    }
    var pad = function(n) {
        return n < 10 ? '0' + n : n;
    }
    var year = date.getFullYear();
    var yearShort = year.toString().substring(2);
    var month = date.getMonth() + 1;
    var monthPad = pad(month);
    var dateInMonth = date.getDate();
    var dateInMonthPad = pad(dateInMonth);
    var hour = date.getHours();
    var hourPad = pad(hour);
    var minute = date.getMinutes();
    var minutePad = pad(minute);
    var second = date.getSeconds();
    var secondPad = pad(second);
    return format.replace(/yyyy/g, year).replace(/yy/g, yearShort)
                .replace(/MM/g, monthPad).replace(/M/g, month)
                .replace(/dd/g, dateInMonthPad).replace(/d/g, dateInMonth)
                .replace(/HH/g, hourPad).replace(/H/g, hour)
                .replace(/mm/g, minutePad).replace(/m/g, minute)
                .replace(/ss/g, secondPad).replace(/s/g, second);
}

const getReq = (user_id_list, uid, newest_wid) => {
    var params = {
        'fid': '107603{0}_-_WEIBO_SECOND_PROFILE_WEIBO'.format(uid),
        'c': 'weicoabroad',
        'v_p': '82',
        'count': '20',
        'source': '4215535043',
        'ua': 'STF-AL10_9_WeiboIntlAndroid_4001',
        'uid': '2005459566081',
        's': '77777777',
        'wm': '2468_1001',
        'gsid': '_2AkMW-WVLf8NhqwFRmP0RyWLnaot3wgnEieKgpZSQJRM3HRl-wT8Xqk8AtRV6PUQylw6VwKuF-YIMRbSedqY5XHqBp04b',
        'from': '1299295010',
        'page': '2',
        'lang': 'zh_CN_%23Hans',  /** # ---> %23 */
        'containerid': '107603{0}_-_WEIBO_SECOND_PROFILE_WEIBO'.format(uid),
        'v_f': '2',
        'aid': '01A2DPJaQ09TNVimbGGXqPqou71QFpyw7ro1OA0xfDRe3fZwY.',
        'need_new_pop': '0',
        'need_head_cards': '0',
    }

    var xmlhttp = new XMLHttpRequest();
    // get方法带参数是将参数写在url里面传过去给后端
    xmlhttp.open("GET", "https://api.weibo.cn/2/profile/statuses?fid=107603{0}_-_WEIBO_SECOND_PROFILE_WEIBO&c=weicoabroad&v_p=82&count=20&source=4215535043&ua=STF-AL10_9_WeiboIntlAndroid_4001&uid=2005459566081&s=77777777&wm=2468_1001&gsid=_2AkMW-WVLf8NhqwFRmP0RyWLnaot3wgnEieKgpZSQJRM3HRl-wT8Xqk8AtRV6PUQylw6VwKuF-YIMRbSedqY5XHqBp04b&from=1299295010&page=1&lang=zh_CN_%23Hans&containerid=107603{0}_-_WEIBO_SECOND_PROFILE_WEIBO&v_f=2&aid=01A2DPJaQ09TNVimbGGXqPqou71QFpyw7ro1OA0xfDRe3fZwY.&need_new_pop=0&need_head_cards=0&q=%E4%B8%89%E5%AD%A9".format(uid), true);

    xmlhttp.send();
    // readyState == 4 为请求完成，status == 200为请求返回的状态
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            // alert(xmlhttp.responseText)
            var json_data = JSON.parse(xmlhttp.responseText)
            if (json_data.cards.length > 0) {
                var newest_weibo_id = ''
                var newest_weibo_user_name = ''
                var newest_weibo_user_id = ''
                var newset_weibo_publish_time = ''
                var newset_weibo_link = ''
                var newest_weibo_content = ''
                for (var i = 0; i < json_data.cards.length; i++) {
                    if (json_data.cards[i].card_type == 9) {
                        var newest_weibo = json_data.cards[i].mblog
                        if (newest_weibo.isTop == 1) {
                            // 过滤掉指定微博
                            continue
                        }
                        newest_weibo_id = newest_weibo.idstr
                        newest_weibo_user_name = newest_weibo.user.screen_name
                        newest_weibo_user_id = newest_weibo.user.idstr
                        newset_weibo_publish_time = newest_weibo.created_at
                        newset_weibo_link = "https://weibo.com/{0}/{1}?from=buyixiao".format(newest_weibo_user_id, id2mid(newest_weibo_id))
                        newest_weibo_content = newest_weibo.text
                        if (newest_wid != newest_weibo_id) {
                            update(user_id_list, newest_weibo_user_id, newest_weibo_id)
                            chrome.notifications.create("new_weibo_notify_${Date.now()}", {
                                type: 'basic',
                                // iconUrl: 'img/icon.png',
                                iconUrl: newest_weibo.user.avatar_hd,
                                title: '您关注的 ' + newest_weibo_user_name + ' 发新微博啦！！！',
                                message: '时间: ' + formatDate(new Date(newset_weibo_publish_time), "yyyy-MM-dd HH:mm:ss") + '\n内容: ' + newest_weibo_content + '\n链接: {0}\n\n'.format(newset_weibo_link)
                                // message: " has new weibo!!!! \nuser_id: " + newest_weibo_id + '\nweibo_user_name: ' + newest_weibo_user_name + '\npublish_time: ' + newset_weibo_publish_time + '\ncontent: ' + newest_weibo_content + '\nlink: <a src="{0}"/>'.format(newset_weibo_link)
                            }, (id) => {
                                // alert(JSON.stringify(chrome.runtime.lastError)); // 如果没调成功可以在这里看看报错，在生产环境别忘了注释掉
                            })
                            // alert(" has new weibo!!!! \nuser_id: " + newest_weibo_id + '\nweibo_user_name: ' + newest_weibo_user_name + '\npublish_time: ' + newset_weibo_publish_time + '\ncontent: ' + newest_weibo_content + '\nlink: <a src="{0}"/>'.format(newset_weibo_link))
                        } else {
                            // alert("has no new weibo")
                        }
                        break
                    }
                }
            }
        }
    }
};


runner = () => {
    chrome.storage.sync.get({
        user_id_list: [] //put defaultvalues if any
    }, function (data) {
        var user_id_list = data.user_id_list;
        for (var i = 0; i < user_id_list.length; i++) {
            var c_user = user_id_list[i]
            getReq(user_id_list, c_user.user_id, c_user.newest_weibo_id)
        }
    }
    );
}


setInterval(function () { //每20秒刷新一次图表
    //需要执行的代码写在这里
    runner()
}, 20000);
// getReq("7711487956")