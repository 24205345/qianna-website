# 阿里云 ECS 部署教程

> **适用类型**：Docker Compose 单容器 Web 应用 · 国内 ECS 常见问题版 · 含 GitHub Actions 自动部署（可选）
>
> **说明**：本文为通用部署指南，示例中的项目名、目录、仓库均为占位符。本站 [qiannawang.com](https://www.qiannawang.com) 使用 Vercel + Supabase 部署，与此文 ECS 方案不同；若你部署的是其他 Docker 化项目，可按本文操作。

---

## 0. 开始之前

### 0.1 本文适用哪类项目？

本文不针对某一个具体产品，而是说明一类常见 Web 应用的上线方式。满足以下特征的项目，都可以按本文部署：

- 项目根目录有 `Dockerfile` 与 `compose.yaml`（或 `docker-compose.yml`）
- 前后端由同一个容器对外提供服务，通常只暴露一个端口（如 `8000`）
- 通过 `.env.docker` / `.env` 等文件配置密钥、数据库、第三方 API
- 国内 ECS 上需要处理 Docker Hub、PyPI/npm 拉取慢或超时的问题

典型例子：内部工具站、AI 辅助应用、管理后台、培训/内容平台等。

### 0.2 推荐部署路径

**推荐路径**：Linux（已有）→ 安装 Docker → `docker compose` 一键运行应用

**可选扩展**：Linux + Docker → 宝塔/Nginx 反代到应用端口 → 绑定域名与 HTTPS

**本文未采用**：不用 Docker、单独用宝塔托管前端 dist + 手工跑后端（前后端分离部署，维护成本通常更高）

> 购买阿里云 ECS 时已预装 Alibaba Cloud Linux，无需再单独安装 Linux 系统。

| 阶段 | 预计耗时 | 产出 |
|------|----------|------|
| 安装 Docker + 镜像加速 | 10～20 分钟 | `docker` / `docker compose` 可用 |
| 上传代码 + 构建容器 | 15～30 分钟 | 容器 `Up (healthy)` |
| 安全组 + 浏览器验收 | 5 分钟 | `http://公网IP:<端口>` 可访问 |
| 域名 + 宝塔反代 + HTTPS | 可选 | `https://你的域名` 可访问 |
| 配置 API + GitHub Actions | 可选 | 第三方服务可用 / 自动部署 |

---

## 第一部分 · 购买与登录 ECS

### 1.1 购买云服务器

1. 打开阿里云 ECS 产品页：<https://www.aliyun.com/product/ecs>
2. 选择个人开发者 e 实例（示例：2 核 2G；价格以阿里云页面为准）
3. 系统选择 **Alibaba Cloud Linux 3**
4. 安全组至少放行 **22**（SSH）；后续还需应用端口（如 `8000`）；绑域名后加 **80/443**

![选择个人开发者 e 实例](/notes/aliyun-ecs-deploy/01-ecs-instance-tier.png)

### 1.2 远程连接 Workbench

1. 进入云服务器控制台 → 实例列表
2. 点击「**远程连接**」
3. 在弹窗中选择 **Workbench** → 点击「**立即登录**」

![ECS 控制台 → 远程连接](/notes/aliyun-ecs-deploy/02-ecs-remote-connect.png)

![Workbench 远程连接 → 立即登录](/notes/aliyun-ecs-deploy/03-workbench-login.png)

登录成功后，终端提示符类似：`[root@iZxxxx ~]#`

---

## 第二部分 · 安装 Docker（步骤 1～5）

以下命令在 Workbench 中**一行一行**执行：复制整行 → 回车 → 等结束再执行下一条。

### 步骤 1 · 确认系统版本

```bash
cat /etc/os-release
```

期望看到 **Alibaba Cloud Linux 3**，平台为 `platform:al8`。

### 步骤 2 · 安装 Docker CE

**2.1 先试阿里云自带源（可能失败）**

```bash
dnf install -y docker docker-compose-plugin
```

若报错 `No match for argument: docker-compose-plugin`，改用 Docker CE 官方源。

**2.2 添加 Docker CE 源**

```bash
wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sed -i 's/$releasever/8/g' /etc/yum.repos.d/docker-ce.repo
```

为什么要 `sed` 改成 8：Alibaba Cloud Linux 3 版本号是 3，但 Docker 官方源按 CentOS 8 组织包。

**2.3 安装 Docker + Compose 插件**

```bash
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 步骤 3 · 启动并验证

```bash
systemctl start docker
systemctl enable docker
docker --version
docker compose version
```

### 步骤 4 · 配置 Docker 镜像加速

```bash
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker
docker info | grep -A 3 "Registry Mirrors"
```

必须看到 `docker.m.daocloud.io` 才算生效。

---

## 第三部分 · 部署应用（步骤 6～10）

### 步骤 6 · 获取代码

**方案 A：git clone（能连 GitHub 时）**

```bash
dnf install -y git
cd /opt
git clone <Git 仓库地址>
cd /opt/<项目目录>
```

国内 ECS 直连 GitHub 易超时，失败请改用方案 B。

**方案 B：本地 zip + Workbench 上传（国内 ECS 推荐）**

在存放项目代码的电脑上执行：

```bash
git archive --format=zip -o app.zip HEAD
```

Workbench 左侧文件管理器进入 `/opt` 目录 → 右键 → 上传 → 选择 `app.zip`

确认文件大小：`ls -lh /opt/app.zip`（**不能为 0**）

![Workbench 文件管理器 → 进入 /opt → 上传项目 zip](/notes/aliyun-ecs-deploy/04-workbench-upload-zip.png)

```bash
cd /opt
mkdir -p <项目目录>
unzip -o app.zip -d <项目目录>
cd /opt/<项目目录>
ls
```

应能看到 `Dockerfile`、`compose.yaml`。缺少 `unzip` 时先执行：`dnf install -y unzip`

### 步骤 7 · 拉基础镜像并修改 Dockerfile（国内必做）

若项目使用 Python + Node 多阶段构建，可按需预拉镜像并替换 Dockerfile 中的 `FROM` 源。

```bash
cd /opt/<项目目录>
# 按项目 Dockerfile 实际基础镜像调整
docker pull docker.m.daocloud.io/library/python:3.12-slim-bookworm
docker pull docker.m.daocloud.io/library/node:20-bookworm-slim
sed -i 's|FROM node:|FROM docker.m.daocloud.io/library/node:|' Dockerfile
sed -i 's|FROM python:|FROM docker.m.daocloud.io/library/python:|' Dockerfile
# Python 项目可加 pip 清华源
sed -i 's|RUN pip install --no-cache-dir -r requirements.txt|RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host pypi.tuna.tsinghua.edu.cn --default-timeout=300 --retries=10|' Dockerfile
grep -E '^FROM |pip install' Dockerfile
```

### 步骤 8 · 配置环境变量

复制项目提供的 `.env.docker.example`（或 `.env.example`）为 `.env.docker`，按注释填写。

```bash
cd /opt/<项目目录>
cp .env.docker.example .env.docker
SECRET=$(openssl rand -hex 32)
# 以下变量名以项目实际为准
sed -i "s|AUTH_JWT_SECRET=replace-with-a-long-random-secret|AUTH_JWT_SECRET=$SECRET|" .env.docker
sed -i "s|APP_BASE_URL=.*|APP_BASE_URL=http://你的公网IP:<端口>|" .env.docker
grep -E '^(AUTH_JWT_SECRET|APP_BASE_URL)=' .env.docker
```

> **安全提醒**
>
> - JWT、数据库、第三方 API 密钥须妥善保管，**切勿**泄露或提交到公开仓库
> - 支付、邮件等暂未启用的项可保持示例值
> - 绑域名后改 `APP_BASE_URL` 为 `https://你的域名`

### 步骤 9 · 构建并启动

首次构建约 15～30 分钟。建议 `nohup` 后台构建，Workbench 掉线不会中断。

```bash
cd /opt/<项目目录>
nohup docker compose up --build -d > /tmp/<应用名>-build.log 2>&1 &
tail -f /tmp/<应用名>-build.log
```

- 日志出现 `Container <容器名> Started`（或类似 `healthy` 状态）表示成功
- `Ctrl+C` 只退出日志查看，不会停止构建
- 断线后重连：`tail -30 /tmp/<应用名>-build.log`

### 步骤 10 · 安全组与验收

容器启动后，还需在阿里云安全组放行应用端口（如 `<端口>`），浏览器才能访问。

1. ECS 控制台 → 安全组 → 选择实例关联的安全组 → **管理规则**
2. 入方向 → **增加规则**
3. 授权策略：允许；协议：自定义 TCP；端口：`<端口>/<端口>`；来源：`0.0.0.0/0`

![安全组列表 → 管理规则](/notes/aliyun-ecs-deploy/05-security-group-list.png)

![入方向 → 增加规则](/notes/aliyun-ecs-deploy/06-security-group-inbound.png)

![新建规则：TCP 端口，来源 0.0.0.0/0](/notes/aliyun-ecs-deploy/07-security-group-add-rule.png)

> **安全提醒**：`0.0.0.0/0` 便于首次验收；**长期运行**建议限制来源 IP，或尽快接入域名 + HTTPS，并视情况配置 WAF/防火墙。

```bash
docker compose -f /opt/<项目目录>/compose.yaml ps
curl -s http://127.0.0.1:<端口>/api/health
```

健康检查路径因项目而异，可能是 `/api/health`、`/health` 或 `/`。

| 检查项 | 期望结果 |
|--------|----------|
| `docker compose ps` | STATUS 为 `Up (healthy)` |
| `curl` 健康检查 | 返回 JSON 或 200 状态码 |
| 浏览器 | `http://公网IP:<端口>` 可打开首页 |

---

## 第四部分 · 日常运维

```bash
cd /opt/<项目目录>
docker compose ps
docker compose logs -f
docker compose restart
docker compose down        # 不要加 -v
```

---

## 第五部分 · 公网分享

部署完成后，可将 `http://公网IP:<端口>/` 分享给测试用户。公网 IP 可在 ECS 实例详情页查看。

> 分享前确认：无测试账号默认弱密码、无调试接口对外暴露；正式环境建议使用域名 + HTTPS（见下一部分）。

---

## 第六部分 · 域名与宝塔反代（可选）

用 IP + 端口验收通过后，若希望用域名访问并启用 HTTPS，可在同一台 ECS 上安装**宝塔面板**，由 Nginx 反代到 Docker 容器端口。应用仍由 `docker compose` 运行，宝塔负责把域名请求转发到容器监听的端口。

### 6.1 域名解析

1. 在域名服务商处添加 **A 记录**，主机记录 `@`（或 `www`），记录值填 **ECS 公网 IP**
2. 等待解析生效（通常几分钟到几小时），可在终端执行 `ping 你的域名` 验证

### 6.2 安全组放行 80 / 443

ECS 控制台 → 安全组 → 入方向增加：

| 协议 | 端口 | 说明 |
|------|------|------|
| TCP | 80 | HTTP（申请证书、跳转 HTTPS） |
| TCP | 443 | HTTPS |

应用端口（如 `8000`）接入反代后，可不再对公网开放，仅 ECS 内部访问即可。

### 6.3 宝塔添加站点与反代

1. 安装宝塔面板（官网脚本按系统提示执行即可），登录面板
2. **网站** → **添加站点** → 填写域名，PHP 选「纯静态」或「不创建」
3. 进入该站点 → **反向代理** → **添加反向代理**
   - 目标 URL：`http://127.0.0.1:<端口>`（与 `compose.yaml` 映射端口一致）
   - 发送域名：`$host`（默认即可）
4. **SSL** → **Let's Encrypt** → 申请免费证书并开启「强制 HTTPS」

### 6.4 同步应用配置

```bash
cd /opt/<项目目录>
sed -i "s|APP_BASE_URL=.*|APP_BASE_URL=https://你的域名|" .env.docker
docker compose up -d --force-recreate
```

浏览器访问 `https://你的域名` 验收。若页面空白或 502，在 ECS 终端执行 `curl http://127.0.0.1:<端口>/` 确认容器正常，再检查反代目标端口是否填写正确。

---

## 第七部分 · 配置第三方 API（可选）

若项目依赖 LLM、短信、对象存储等外部服务，在 `.env.docker` 中追加对应 Key 后重启容器。

```bash
cd /opt/<项目目录>
vi .env.docker
# 末尾追加项目所需变量，例如：
# DEEPSEEK_API_KEY=sk-你的密钥
# DASHSCOPE_API_KEY=sk-你的密钥
docker compose up -d --force-recreate
curl -s http://127.0.0.1:<端口>/api/health
```

改 `.env.docker` 后必须 `--force-recreate`，否则容器仍用旧环境变量。

---

## 第八部分 · GitHub Actions 自动部署（可选）

首部署完成后，`push` 到 `main` 可自动 rsync 代码并在服务器执行 `docker compose` 重建。

### 8.1 本地仓库推送 workflow

```bash
cd <本地项目目录>
git add .github/workflows/deploy.yml scripts/deploy-ecs.sh
git commit -m "add GitHub Actions ECS deploy"
git push origin main
```

### 8.2 服务器创建 deploy 用户 + SSH 密钥

```bash
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
chown -R deploy:deploy /opt/<项目目录>
dnf install -y rsync
```

在本地电脑 PowerShell 生成密钥，公钥写入 `/home/deploy/.ssh/authorized_keys`：

```powershell
ssh-keygen -t ed25519 -C "github-actions-deploy" -f $env:USERPROFILE\.ssh\github_actions_deploy -N '""'
```

> **切勿**将私钥内容提交到 Git 仓库或发送给他人。

### 8.3 配置 GitHub Secrets

GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

![Settings → Secrets and variables → Actions](/notes/aliyun-ecs-deploy/08-github-secrets.png)

| Secret | 示例值 | 说明 |
|--------|--------|------|
| `SERVER_HOST` | `你的公网IP` | ECS 公网 IP |
| `SERVER_PORT` | `22` | SSH 端口 |
| `SERVER_USER` | `deploy` | 部署用户 |
| `SERVER_TARGET` | `/opt/<项目目录>` | 服务器上的项目目录 |
| `SERVER_SSH_KEY` | 私钥全文 | `github_actions_deploy` 文件内容 |

### 8.4 手动触发 Actions 验收

**Actions** → 选择部署 workflow → **Run workflow** → 选择 `main` → **Run workflow**

![Actions → Run workflow](/notes/aliyun-ecs-deploy/09-github-actions-run.png)

```bash
docker compose -f /opt/<项目目录>/compose.yaml ps
curl -s http://127.0.0.1:<端口>/api/health
```

以后更新代码只需：`git push origin main`

---

## 附录 A · 占位符对照表

正文使用占位符，便于套用到不同项目。下表为**虚构示例**，请替换为你自己的值：

| 占位符 / 变量 | 含义 | 示例值（虚构） |
|---------------|------|----------------|
| `<应用名>` | 应用或服务的对外名称 | `my-app` |
| `<端口>` | 容器对外暴露的 TCP 端口 | `8000` |
| `<项目目录>` | `/opt` 下的目录名 | `my-app` |
| `/opt/<项目目录>` | 服务器上的完整部署路径 | `/opt/my-app` |
| `<Git 仓库地址>` | Git 远程仓库地址 | `https://github.com/<用户名>/<仓库>.git` |
| `app.zip` | 本地打包上传的文件名 | `my-app.zip` |
| `<容器名>` | `compose.yaml` 中的 `container_name` | `my-app` |
| `/tmp/<应用名>-build.log` | 后台构建日志路径 | `/tmp/my-app-build.log` |
| `APP_BASE_URL` | 应用对外访问地址 | `http://你的公网IP:8000` |
| `AUTH_JWT_SECRET` | 登录鉴权密钥 | `openssl rand -hex 32` 生成 |
| 健康检查路径 | 验收用的 HTTP 路径 | `/api/health` |
| 第三方 API | 可选外部服务密钥 | `DEEPSEEK_API_KEY` 等 |
| GitHub workflow | Actions 工作流名称 | `Deploy to ECS` |
| `SERVER_TARGET` | Actions 同步目标目录 | `/opt/my-app` |
| SSH 密钥文件名 | Actions 专用密钥 | `github_actions_deploy` |

操作时，将正文中的占位符（如 `<端口>`、`<项目目录>`）替换为上表对应值即可；换项目时只需改实例参数，步骤顺序不变。

---

## 附录 B · 常见错误速查

| 现象 | 处理 |
|------|------|
| `docker-compose-plugin` 找不到 | 改用 Docker CE 源 + `sed` 改 releasever 为 8 |
| 拉镜像超时 | DaoCloud 镜像加速 + 改 Dockerfile `FROM` |
| pip Read timed out | Dockerfile 配清华 pip 源 |
| `app.zip` 大小为 0 | 删除后重新上传 |
| 浏览器打不开 | 检查安全组是否放行 `<端口>` |
| 第三方 API 未生效 | 写入 Key 后 `docker compose up -d --force-recreate` |
| Actions Permission denied | 检查 deploy 用户 `authorized_keys` |
| 域名访问 502 | 确认容器在跑，反代目标端口与 `compose.yaml` 一致 |
| HTTPS 证书失败 | 确认域名 A 记录指向 ECS 公网 IP，且 80 端口可从公网访问 |
