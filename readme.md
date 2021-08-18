## 组件说明

Jamstack组件，主要负责Serverless-Devs项目的

* 域名的自动申请
* 项目的元信息更新
* Jamstack站点的文件上传

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

其他配置：

* httpRedirect: _redirects文件的HTTP重定向支持，true或者false

## 具体用法

### s cli 方式

```
s cli jamstack --help
```

### 相关限制

* 文件不能超过10M
* 不支持上传隐藏文件，也就是"."开头的文件，如 `.gitignore` 等
* 浏览器端缓存规则，即自动添加 `Cache-Control: public, max-age=31536000` HTTP头，实现流量端缓存。
    * 文件名等于或超过19个字节(含后缀名)
    * 文件名匹配该正则表达式 `[\-._a-f\d][a-f\d]{8}.(js|css|woff|woff2|jpg|jpeg|png|svg)$`
    * 文件在以下目录： '_nuxt/', '_snowpack/', '51cache/'

### 应用编排使用方式

查看 example目录下的 [s.yaml](./example/s.yaml)


