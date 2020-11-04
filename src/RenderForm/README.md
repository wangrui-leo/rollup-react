# 基于 Ant Design 的 组件封装

## RenderFrom 组件

### API 
参数|说明|类型|默认值
---|---|---|---|
title|Form 表单的标题| string
searchColums|Form 表单控件的配置描述，[具体项见下表](#searchColums)| array
handleSearch|表单的查询数据的方法|function|
view|查看模式|boolean|false|
selectOptions|选择的参数|array|false|


### <span id="searchColums">searchColums</span>

参数|说明|类型|默认值
---|---|---|---|
label|表单的控件的label|string|
name|控件对应后端的字段|string|
searchType|控件的类型，[具体项见下表](#searchType)|string|
hidden|是否隐藏控件|boolean|false
initialValue|初始值|string|
rules|校验规则|array| 
props|控件的时间以及默认的属性|object|


### <span id="searchType">searchType</span>

参数|说明|类型|默认值
---|---|---|---|
input|输入框||string
inputEnterSearch|弹层选择，[具体项见下表](#inputEnterSearch)||string
textArea| 富文本||string
inputNumber|数字输入框||number
checkbox|多选||array
radio|单选||array
datePicker|日期||moment
rangePicker|区间日期||array(object)
cascader|级联选择||array
select|下拉选择||string


### <span id="inputEnterSearch">inputEnterSearch</span>

参数|说明|类型|默认值
---|---|---|---|
title|Form 表单的标题| string
searchColums|Form 表单控件的配置描述，[具体项见表searchColums](#searchColums)|array
handleSearch|表单的查询数据的方法|function|
view|查看模式|boolean|false|
selectOptions|选择的参数|array|false|
modalProps|弹层的Props，[具体项见下表](#modalProps)|object|
enterButtonSearch|点击控件的button事件，[参数说明](#enterButtonSearch)|function|


### <span id="modalProps">modalProps</span>

参数|说明|类型|默认值
---|---|---|---|
tableRowKey|表格单行的key|string|
tableColums|表格的表头|array|
searchColums|Form 表单控件的配置描述，[具体项见表searchColums](#searchColums)|array|
fetchData|调用接口查询数据的方法，[参数说明](#fetchData)|function
onModalOk|弹层的确认事件，[参数说明](#onModalOk)|function


### <span id="fetchData">fetchData</span>
```js
fetchData: () => {
    return (params, callback) => {
        // 1) 直接调用接口返回数据
        axios({ url: `${baseUrl}/getFormData`, method: 'get', params }).then((res) => {
            const { list, total } = res
            callback({ data: { data: list, total } })
        })
        // 2) 结合redux返回数据
        dispatch({
            type: 'getFormData',
            payload: {
                ...params,
            },
            callback,
        })
    }
}             
```


### <span id="onModalOk">onModalOk</span>
```js
onModalOk: (callback, oldSelectItem, newSelectItem) => {
    // 弹层关闭的事件，必须执行的参数
    callback()
    // 之前选中的数据的值
    oldSelectItem
    // 新选中的数据的值
    newSelectItem
}
```


### <span id="enterButtonSearch">enterButtonSearch</span>
```js
enterButtonSearch: (callback, childInputs) => {
    // 显示弹层的事件，必须执行的参数
    callback()
    // 包含所有弹层显示的 objects，以当前控件的 dataIndex 为 key
    childInputs
}
```
