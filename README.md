
# Obsidian Image Auto Upload Plugin


> forked from [renmu123/obsidian-image-auto-upload-plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin)
> 
> **原始文档**： [中文](readme-zh.md) / [英文](readme-en.md)

##

**本项目根据个人使用情况，做了如下调整：**

1. 优化了解析文件中图片链接的正则逻辑，主要针对以下情况：

- 图片外有链接：`[![image.png](http://example.com/image.png)](http://example.com/image.png)`
- 文件名中有`]`字符：`![[ image]1.png ]]`
- 文件中包含尺寸大小：`![[ image.png | image | 300 ]]`、`![[ image.png | 300 ]]`

2. 增加快捷命令和图标，在弹窗中查看所有含本地图片/网络图片的文件列表（方便管理需要上传或下载的图片）

