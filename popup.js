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
                });
            }
            break
        }
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

            // var bg = chrome.extension.getBackgroundPage();
            // bg.runner(); // 访问bg的函数

            alert("添加成功")
            save.innerHTML = "保存"
        });
    }
}

// 保存方法
function save_data() {
    var adding_user_id = document.getElementById('user_id');
    if (adding_user_id.value.length == 10 && /^\d+$/.test(adding_user_id.value)) {
        chrome.storage.sync.get({
            user_id_list: [] //put defaultvalues if any
        }, function (data) {
            console.log(data.user_id_list);
            update(data.user_id_list, adding_user_id.value, "0"); //storing the storage value in a variable and passing to update function
        }
        );

    } else {
        alert("添加的微博数字 uid 不合法")
    }
}

function auto_parse_uid() {
    var input = document.getElementById('user_id');
    var save = document.getElementById('save');
    chrome.tabs.getSelected(null, function (tab) {
        var current_url = tab.url
        if(current_url == undefined){
            return
        }
        var adding_user_id = ''
        if (current_url.indexOf("?") > -1) {
            current_url = current_url.slice(0, current_url.indexOf("?"))
        }
        if (current_url.lastIndexOf("/") > -1) {
            adding_user_id = current_url.slice(current_url.lastIndexOf("/") + 1)
            if (adding_user_id.length == 10 && /^\d+$/.test(adding_user_id)) {
                input.value = adding_user_id
                save.innerHTML = "自动解析 uid 成功，点击保存"
            }
        }
        console.log(tab.url);
    });
}

function get_data() {
    chrome.storage.sync.get({
        user_id_list: [] //put defaultvalues if any
    }, function (data) {
        console.log(data.user_id_list);
        var info = ''
        for (var i = 0; i < data.user_id_list.length; i++) {
            info += 'uid:  ' + data.user_id_list[i].user_id + ' newest_weibo_id:  ' + data.user_id_list[i].newest_weibo_id + '\n'
        }
        // alert(info)
    }
    );
}

function clear_data() {
    // sync 区域
    chrome.storage.sync.clear(function () {
        //do something
    });

}
// clear_data()
auto_parse_uid()
get_data()
// 点击保存，执行保存value
var save = document.getElementById("save");
save.addEventListener('click', save_data)
