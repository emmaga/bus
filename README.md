# bus

> 班车预约for酒店

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

## 微信访问的首页地址

``` bash
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxeae127ff98a4c844&redirect_uri=http://openvoddev.cleartv.cn/wx/bus/index.html&response_type=code&scope=snsapi_base&state=1&component_appid=wxc6e8a3fab4f25a4f#wechat_redirect
```

## mock clear_session

``` bash
src/mock/index.js enableMock 设为false为正常项目使用，设为true为测试参数，读取的是 src/mock/data.js 内的数据
```