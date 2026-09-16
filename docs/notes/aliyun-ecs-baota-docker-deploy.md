# 阿里云 ECS · 宝塔面板部署教程

> **适用类型**：Docker Compose Web 应用 · 国内 ECS · **以宝塔为日常运维入口**
>
> **与上一篇的关系**：若你更习惯 Workbench 命令行手装 Docker，请看 [阿里云 ECS 部署教程](/notes/aliyun-ecs-docker-deploy)（Workbench 路径）。本文推荐路径是：**装宝塔 → 面板管 Docker / 改配置 / 反代 HTTPS → 终端只跑必要命令**。
>
> **说明**：本文为通用指南，项目名、目录、端口均为占位符。本站 [qiannawang.com](https://www.qiannawang.com) 本身用 Vercel + Supabase，不走本文 ECS 方案。示例会偶尔提到带 `deploy.sh` 的项目（如内部 AI Learning Hub），换你自己的 Compose 项目同样适用。

---

## 0. 开始之前

### 0.1 本文适用哪类项目？

- 根目录有 `docker-compose.yml` / `compose.yaml`（以及对应 Dockerfile）
- 对外通常 **一个主端口**（如 `8080`、`8000`），数据库可用云端服务（如 Supabase）
- 需要域名 + HTTPS，希望用面板做反代，而不是长期裸奔 `IP:端口`
- 运维者更想用图形界面改 `.env`、看容器，而不是整段待在 Workbench

### 0.2 推荐路径 vs 旧路径

| | 本文（宝塔路径） | 上一篇（Workbench 路径） |
|--|------------------|--------------------------|
| 装面板 | OOS / 官方脚本装宝塔 | 不装面板也行 |
| 装 Docker | 宝塔「Docker」模块 | `dnf` 手装 Docker CE |
| 改 `.env` | 宝塔 **文件** 可视化编辑 | `vi` / `nano` |
| 启动应用 | 终端 `docker compose` 或项目自带 `./deploy.sh` | 终端 `docker compose` |
| 域名 HTTPS | 宝塔网站反代（默认目标） | 可选后补宝塔 |

### 0.3 阶段与耗时

| 阶段 | 预计耗时 | 产出 |
|------|----------|------|
| 装宝塔 + 安全组 8888 | 10～20 分钟 | 能打开面板 |
| Docker + 镜像加速 | 5～15 分钟 | `docker` / `docker compose` 可用 |
| 拉代码 + 配 `.env` + 构建 | 15～40 分钟 | 本机 `curl 127.0.0.1:<端口>` 通 |
| 域名反代 + HTTPS | 10～20 分钟 | `https://你的域名` 可访问 |

---

## 第一部分 · 安装宝塔面板

### 1.1 安全组先放行

ECS 控制台 → 实例 → **安全组** → 入方向 **手动添加**：

| 端口 | 用途 |
|------|------|
| **8888** | 宝塔面板（装完立刻要） |
| **22** | SSH / Workbench（通常已有） |
| **80 / 443** | 网站与 HTTPS（绑域名时） |

访问来源首次可用 `0.0.0.0/0`；面板能登录后，建议把 **8888** 收紧到你自己的公网 IP。

> 新建规则时：**访问来源不能为空**，否则「提交」按钮是灰的。填 `0.0.0.0/0` 或 `你的IP/32`。

### 1.2 安装方式（二选一）

**方式 A：阿里云 OOS 一键扩展（常见）**

1. 系统运维管理 OOS → 批量管理软件 → 安装
2. 选 **宝塔面板免费版一键安装**
3. **勾选要装的那一台 ECS**（运行中、云助手已安装）
4. 确认风险提示后创建任务，等待 **5～15 分钟**（「配置软件包」阶段最久）

> 不要短时间重复点多次安装。多条「已完成」记录通常是重复安装造成的；以**最新一次成功输出**里的登录信息为准。

**方式 B：SSH / Workbench 官方脚本**

按宝塔官网当前 Linux 安装命令执行即可（系统不同命令略有差异）。

### 1.3 拿到登录地址

OOS 任务 → **输出** → 扩展信息，常见字段：

- **公网链接**：`https://公网IP:8888/安全入口`
- **用户名** / **密码**

若页面上的账号登不进去（重复安装后很常见）：

1. Workbench 或宝塔终端用 root 登录服务器
2. 执行：`bt default`（查看当前账号）或 `bt 6`（改密码）`bt 5`（改用户名）

浏览器打开公网链接。若提示证书不受信任，点「高级 → 继续访问」（自签证书，正常）。

---

## 第二部分 · 在宝塔里准备 Docker

### 2.1 用左侧「Docker」，不要装旧插件

1. 左侧点 **Docker**（不要去软件商店装已停更的「Docker管理器」）
2. 若提示未安装引擎，按页面安装 **Docker / Compose**
3. **总览**里能看到容器/镜像数量，说明引擎已就绪  
   （已有别的容器如视频工具也没关系，与新项目无关）

终端验证：

```bash
docker -v
docker compose version
```

### 2.2 配置镜像加速（国内强烈建议）

Docker → **设置** → 镜像加速，例如：

```text
https://docker.1ms.run
```

保存并重启 Docker。也可用宝塔允许的其它国内加速地址。

### 2.3 关于「本地镜像好几个」

很正常：以前项目、基础镜像会占多条。磁盘不紧就不必清理。若要清：Docker → **本地镜像** → **清理镜像**，或终端：

```bash
docker image prune
```

**不要删** 正在运行容器所依赖的镜像。

---

## 第三部分 · 获取代码与配置

建议目录：`/www/wwwroot/<项目目录>`（宝塔站点习惯路径）。

### 3.1 克隆代码

```bash
cd /www/wwwroot
git clone <Git 仓库地址> <项目目录>
cd /www/wwwroot/<项目目录>
ls
```

应能看到 `docker-compose.yml`（或 `compose.yaml`）。

**私有 GitHub 仓库注意：**

- GitHub **不再接受登录密码** 做 `git clone`
- 需在 GitHub → Settings → Developer settings → Tokens 创建 **classic** Token，勾选 **`repo`**
- 提示 Username：填 GitHub 用户名；Password：**粘贴 Token**
- Username **不要**误粘贴成 `cd xxx` 这类命令

公开仓库一般可直接 clone，无需 Token。

国内 GitHub 极慢时：本机 `git archive` 打 zip，用宝塔 **文件** 上传到 `/www/wwwroot` 再解压（思路同 Workbench 上传篇）。

### 3.2 配置环境变量

```bash
cd /www/wwwroot/<项目目录>
cp .env.example .env          # 或项目实际的 example 文件名
```

**推荐用宝塔文件管理器编辑**（很多机器没有 `nano`）：

1. 左侧 **文件** → `/www/wwwroot/<项目目录>`
2. 打开 `.env` → 编辑 → 按项目注释填写密钥 → 保存
3. 显示隐藏文件后才能看到以 `.` 开头的文件

终端也可用：`vi .env`。

> 切勿把含密钥的 `.env` 截图发到公开聊天或提交到 Git。

### 3.3 启动应用

**通用方式（任意 Compose 项目）：**

```bash
cd /www/wwwroot/<项目目录>
docker compose up --build -d
docker compose ps
curl -I http://127.0.0.1:<端口>/
```

**若项目自带部署脚本（示例）：**

```bash
chmod +x deploy.sh
./deploy.sh --check-mirror    # 若脚本支持
./deploy.sh                   # 或 ./deploy.sh --update
./deploy.sh --status          # 若脚本支持
```

首次构建常要 **10～30 分钟**。终端里 **只粘贴要执行的命令**，不要把整段日志（含 `remote:`、`[root@...]`）再贴回去，否则会出现大量 `command not found`。

安全组若要对公网直接测端口，再放行 `<端口>`；正式环境建议只反代 80/443，应用端口仅本机访问。

---

## 第四部分 · 域名、反代与 HTTPS

### 4.1 域名解析

域名服务商添加 **A 记录** → ECS 公网 IP。

### 4.2 宝塔添加站点

1. **网站** → **添加站点** → 填域名（PHP 可选纯静态/不创建）
2. 站点 → **反向代理** → 目标 URL：`http://127.0.0.1:<端口>`
3. 发送域名：`$host`

建议在站点配置中视项目需要加入：

```nginx
client_max_body_size 100m;   # 大文件上传
proxy_buffering off;         # SSE / 长连接
proxy_read_timeout 3600s;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

### 4.3 SSL

站点 → **SSL** → Let's Encrypt → 强制 HTTPS。

若应用配置里有「对外访问 URL」类变量（如 `APP_BASE_URL`、OAuth 回调），改成 `https://你的域名` 后按项目要求重建/重启容器。

---

## 第五部分 · 日常运维

```bash
cd /www/wwwroot/<项目目录>
docker compose ps
docker compose logs -f --tail=100
docker compose restart
docker compose down           # 不要随便加 -v（会删数据卷）
```

有 `deploy.sh` 的项目可优先用脚本提供的 `--update` / `--backup` / `--logs` / `--status`，以项目 README 为准。

宝塔 Docker → **总览 / 容器** 也可查看运行状态。

---

## 附录 A · 占位符

| 占位符 | 含义 | 示例 |
|--------|------|------|
| `<项目目录>` | `/www/wwwroot` 下目录名 | `my-app` |
| `<端口>` | 容器映射到宿主机的端口 | `8080` |
| `<Git 仓库地址>` | 远程仓库 | `https://github.com/<user>/<repo>.git` |

---

## 附录 B · 常见问题

| 现象 | 处理 |
|------|------|
| 面板用户名或密码错误 | `bt default` 或 `bt 6` 重置；勿死用 OOS 过期输出 |
| 安全组提交按钮灰色 | 访问来源未填，写 `0.0.0.0/0` |
| 软件商店「Docker管理器」红字 | 改用左侧 **Docker**，勿装停更插件 |
| `nano: command not found` | 用宝塔 **文件** 编辑，或 `dnf install -y nano` / `vi` |
| git 要密码 / 认证失败 | 私有库用 Token（scope:`repo`），不是登录密码 |
| `command not found` 刷屏 | 误把日志粘进终端，忽略即可；代码往往已 clone 成功 |
| 反代 502 | `curl 127.0.0.1:<端口>`；检查反代端口与 Compose 一致 |
| PDF/大文件上传失败 | Nginx `client_max_body_size` |
| 改了前端环境变量网页仍旧 | 若 Key 在 **镜像构建时** 写入，必须重新 `build` |

---

## 相关文档

- 同系列（Workbench 手装 Docker）：[阿里云 ECS 部署教程](/notes/aliyun-ecs-docker-deploy)
- English：[Aliyun ECS · Baota Panel Deploy](/notes/aliyun-ecs-baota-docker-deploy.en)（若站点已配置英文 slug，以实际路由为准；源文件为 `aliyun-ecs-baota-docker-deploy.en.md`）
