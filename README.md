食品农产品交易微信小程序
======

> Wechat Mini-Program for food purchase platform, having its own [backend](https://github.com/highjump0615/Duck_Backend_Laravel)

## Overview

### 1. 主要功能
- 商品浏览  
商品分类、商品列表  
- 订单管理  
下单（微信支付）、自提订单、配送订单、拼团  
- 基础信息管理  
收货地址  

### 2. 技术内容
#### 2.1 微信小程序 ( wxml / wxss / js ) 
- ```<template/>``` 模板渲染列表  
- ```<modal />``` 做自定义对话框  
- ```wx.requestPayment()``` 用为微信付款
- ```wx.openLocation()``` 地图显示

#### 2.2 Third-Party Libraries 
- [Javascript MD5 v2.1](http://pajhome.org.uk/crypt/md5/)
- [微信小程序富文本解析组件 wxParse v0.3](https://github.com/icindy/wxParse)
  
## Need to Improve  
- 界面需要优化、完善
