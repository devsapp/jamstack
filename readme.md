## 组件说明

Jamstack组件，主要负责Serverless-Devs项目相关的功能，核心功能如下：

* 项目域名的自动申请： 包括平台域名和自定义域名的支持
* 项目的元信息更新： 包含项目的域名，项目中各个应用的元信息
* Jamstack站点的文件同步： 支持站点文件的增量上传，支持Jamstack部分文件的浏览器端缓存

所有的这些功能，你通过`s deploy`命令就可以自动完成。

## 使用场景

部署Jamstack站点，如Next.js, Gatsby, Hugo, Astro等Jamstack框架。

## Jamstack组件的属性

Jamstack组件的配置如下：

```yaml
 - name: portal #应用名称
   type: jamstack # 应用类型
   releaseCode: dist # 应用的内容发布目录
   paths: # http路由设置
     - /
   indexFile: index.html # index page文件名称
```

其他配置项：

* buildCmd: 编译Jamstack站点的命令，如 `npm run build`
* httpRedirect: _redirects文件的HTTP重定向支持，true或者false

## 具体使用

### s cli 方式

```
s cli jamstack --help
```

jamstack组件的`deploy`子命令的参数如下：

* --dry-run: 模拟更新操作，不会有任何文件上传到服务器
* --force-upload: 从本地从新重新上传所有文件，如果上传中出现中断，建议下一次上传添加该选项

考虑到deploy子命令的特殊性，你可以直接使用`s deploy`命令。

### 相关限制

* 当个Jamstack应用的文件数不能超过10000个
* 单个文件不能超过10M Bytes
* 空文件：也就是文件大小为0，不会被上传
* 隐藏文件：也就是"."开头的文件，如 `.gitignore` 等，不会被上传
* 浏览器端缓存规则，即自动添加 `Cache-Control: public, max-age=31536000` HTTP头，实现浏览器端的缓存，提升站点的访问体验。
    * 文件名等于或超过19个字节(含后缀名)
    * 文件名匹配该正则表达式 `[\-._a-f\d][a-f\d]{8}.(js|css|woff|woff2|jpg|jpeg|png|svg)$`
    * 文件在以下目录： '_nuxt/', '_snowpack/', '51cache/'

### 应用编排的使用方式

请查看example目录下的 [s.yaml](./example/s.yaml)


