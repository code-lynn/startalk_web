SkynetJS ( Skynet 统计解决方案 )

### 使用方式：

- 直接jsp/页面引用

见 [http://gitlab.corp.qunar.com/ad/skynet/blob/master/docs/web_sdk.md](http://gitlab.corp.qunar.com/ad/skynet/blob/master/docs/web_sdk.md)

- fekit module 使用

安装： `fekit install QApp`
使用： `require('QApp')`

bid、pid通过biz_name,page_name自动获取
```
QNRSK.manual({
    eid: 'eid',
    edata: {}
})
```
进行调用

- QApp插件引用

引入qapp-plugin-sk.js,通过以下代码进行页面配置
```
QApp.sk.config({
    bid: '3',
    defaults: 'index',
    skOptions: {
        index: {
            pid: '8'
        },
        list: {
            pid: '10'
        }
    }
});
```
在view里，通过
```
view.sk('eid', {/*edata*/});
```
发送自定义统计消息


### 版本信息

最新版本 `0.0.1`


### 项目地址

> `Git` : [http://gitlab.corp.qunar.com/haoliang.yan/skynetjs](http://gitlab.corp.qunar.com/haoliang.yan/skynetjs)

