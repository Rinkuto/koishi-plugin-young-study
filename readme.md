# koishi-plugin-young-study

[![npm](https://img.shields.io/npm/v/@rinkuto/koishi-plugin-young-study?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-young-study)

青年大学习插件

目前只有江西地区才能使用此插件，其他地区的同学想用可以提issue（需要青年大学习的接口）

# 指令

### 提交大学习

使用此指令前必须先设置青年大学习<br>
提交青年大学习，并且返回截图。

### 设置青年大学习

设置后可以持久化保存青年大学习的信息，下次使用不需要再次设置<br>
输入参数以`#`隔开<br>
指令格式：设置青年大学习 #省份#一级团委#二级团委#三级团委#四级团委#姓名
例如：

```
设置青年大学习 #江西#省属本科院校团委#xx大学团委#xx学院团委#xxx团支部#张三
```

### 查组织

用来查某个团委下的所有下级团委<br>
输入参数以`#`隔开
指令格式：设置青年大学习 #省份#一级团委#二级团委...
例如：

```
查组织 #江西#省属本科院校团委#xx大学团委#xx学院团委
```
