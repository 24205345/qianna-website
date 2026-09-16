# Aliyun ECS · Baota (BT Panel) Deployment Guide

> **Applies to**: Docker Compose web apps · domestic ECS · **Baota as the day-to-day ops entry**
>
> **Related article**: Prefer Workbench and installing Docker by hand? See [Aliyun ECS Deployment Guide](/notes/aliyun-ecs-docker-deploy.en) (Workbench path). This guide recommends: **install Baota → manage Docker / edit config / reverse-proxy HTTPS in the panel → use the terminal only when needed**.
>
> **Note**: This is a generic guide. Project names, directories, and ports are placeholders. This site, [qiannawang.com](https://www.qiannawang.com), runs on Vercel + Supabase—not the ECS approach here. Examples may mention projects that ship a `deploy.sh` (e.g. an internal AI Learning Hub); any Compose app can follow the same flow.

---

## 0. Before You Start

### 0.1 What kind of project fits?

- A `docker-compose.yml` / `compose.yaml` (and Dockerfiles) at the repo root
- Usually **one public app port** (e.g. `8080`, `8000`); the database may live in the cloud (e.g. Supabase)
- You want a domain + HTTPS via a panel reverse proxy, not long-term `IP:port` exposure
- You prefer a GUI to edit `.env` and inspect containers instead of living in Workbench

### 0.2 This path vs the Workbench path

| | This guide (Baota) | Previous guide (Workbench) |
|--|--------------------|----------------------------|
| Panel | Install Baota | Optional / none |
| Docker | Baota **Docker** module | `dnf` install Docker CE |
| Edit `.env` | Baota **Files** UI | `vi` / `nano` |
| Start app | `docker compose` or project `./deploy.sh` | `docker compose` |
| Domain + HTTPS | Baota site proxy (default goal) | Optional later |

### 0.3 Phases and time

| Phase | Estimate | Outcome |
|-------|----------|---------|
| Install Baota + open 8888 | 10–20 min | Panel reachable |
| Docker + registry mirror | 5–15 min | `docker` / `docker compose` OK |
| Clone + `.env` + build | 15–40 min | `curl 127.0.0.1:<port>` works |
| Domain proxy + HTTPS | 10–20 min | `https://your-domain` works |

---

## Part 1 · Install Baota Panel

### 1.1 Security group first

ECS console → instance → **Security group** → inbound **Add rule**:

| Port | Purpose |
|------|---------|
| **8888** | Baota panel (needed immediately) |
| **22** | SSH / Workbench (usually already open) |
| **80 / 443** | Site + HTTPS (when binding a domain) |

Source may be `0.0.0.0/0` for first login; afterward, restrict **8888** to your own public IP.

> When creating a rule, **Access source cannot be empty**, or Submit stays disabled. Use `0.0.0.0/0` or `YOUR_IP/32`.

### 1.2 Install (pick one)

**Option A: Aliyun OOS one-click extension (common)**

1. OOS → batch software management → Install
2. Choose **Baota Panel Free one-click install**
3. **Check the target ECS** (Running, Cloud Assistant installed)
4. Confirm risk prompts and wait **5–15 minutes** (longest step: configure package)

> Do not click install repeatedly. Multiple “Completed” rows usually mean duplicate installs; use credentials from the **latest successful Output**.

**Option B: Official script via SSH / Workbench**

Run the current Baota Linux install command from their site (varies slightly by OS).

### 1.3 Get the login URL

OOS task → **Output** → extension fields often include:

- **Public URL**: `https://PUBLIC_IP:8888/secret-path`
- **Username** / **Password**

If those credentials fail (common after reinstalls):

1. Log in as root via Workbench or Baota Terminal
2. Run `bt default` (show current account) or `bt 6` (reset password)

Open the public URL in a browser. For self-signed cert warnings, use Advanced → Proceed (normal).

---

## Part 2 · Prepare Docker in Baota

### 2.1 Use the sidebar Docker module—not the legacy plugin

1. Click **Docker** in the left sidebar (do **not** install the discontinued “Docker Manager” from the App Store)
2. If the engine is missing, install Docker / Compose from the page prompts
3. **Overview** showing container/image counts means Docker is ready  
   (Other containers such as a video tool are unrelated—leave them alone)

Verify in the terminal:

```bash
docker -v
docker compose version
```

### 2.2 Registry mirror (strongly recommended in China)

Docker → **Settings** → registry mirror, e.g.:

```text
https://docker.1ms.run
```

Save and restart Docker. Other Baota-supported China mirrors are fine.

### 2.3 “Several local images” is normal

Leftover base images from older apps are expected. Skip cleanup unless disk is tight. Optional:

```bash
docker image prune
```

Or Docker → **Local images** → **Clean images**. **Do not delete** images used by running containers.

---

## Part 3 · Code and configuration

Suggested path: `/www/wwwroot/<project-dir>` (Baota site convention).

### 3.1 Clone

```bash
cd /www/wwwroot
git clone <git-repo-url> <project-dir>
cd /www/wwwroot/<project-dir>
ls
```

You should see `docker-compose.yml` (or `compose.yaml`).

**Private GitHub repos:**

- GitHub **no longer accepts account passwords** for `git clone`
- Create a **classic** Personal Access Token with scope **`repo`**
- Username = your GitHub username; Password = **paste the token**
- Do **not** type shell commands like `cd xxx` into the Username prompt

Public repos usually clone without credentials.

If GitHub is too slow: zip locally with `git archive`, upload via Baota **Files**, then unzip (same idea as the Workbench zip flow).

### 3.2 Environment file

```bash
cd /www/wwwroot/<project-dir>
cp .env.example .env          # or the project’s real example filename
```

**Prefer Baota Files** (many servers lack `nano`):

1. **Files** → `/www/wwwroot/<project-dir>`
2. Edit `.env` → fill secrets per comments → Save
3. Enable hidden files to see dotfiles

Or use `vi .env` in the terminal.

> Never post screenshots of a filled `.env` or commit it to Git.

### 3.3 Start the app

**Generic Compose projects:**

```bash
cd /www/wwwroot/<project-dir>
docker compose up --build -d
docker compose ps
curl -I http://127.0.0.1:<port>/
```

**If the project ships a deploy script (example):**

```bash
chmod +x deploy.sh
./deploy.sh --check-mirror    # if supported
./deploy.sh                   # or ./deploy.sh --update
./deploy.sh --status          # if supported
```

First builds often take **10–30 minutes**. Paste **only commands** into the terminal—not full log dumps (`remote:`, `[root@...]`), or you will flood `command not found` errors.

Open `<port>` in the security group only if you need a temporary public smoke test; production should expose 80/443 via the proxy and keep the app port local.

---

## Part 4 · Domain, reverse proxy, HTTPS

### 4.1 DNS

Add an **A record** pointing to the ECS public IP.

### 4.2 Baota site + proxy

1. **Website** → **Add site** → enter domain (PHP: static / none)
2. Site → **Reverse proxy** → target `http://127.0.0.1:<port>`
3. Send host: `$host`

Add as needed:

```nginx
client_max_body_size 100m;   # large uploads
proxy_buffering off;         # SSE / long-lived connections
proxy_read_timeout 3600s;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

### 4.3 SSL

Site → **SSL** → Let’s Encrypt → force HTTPS.

If the app has a public base URL / OAuth callback setting, update it to `https://your-domain` and rebuild/recreate containers as the project requires.

---

## Part 5 · Day-to-day ops

```bash
cd /www/wwwroot/<project-dir>
docker compose ps
docker compose logs -f --tail=100
docker compose restart
docker compose down           # avoid -v unless you intend to delete volumes
```

Prefer project `deploy.sh` flags (`--update`, `--backup`, `--logs`, `--status`) when available—see the project README.

Baota Docker → **Overview / Containers** also shows status.

---

## Appendix A · Placeholders

| Placeholder | Meaning | Example |
|-------------|---------|---------|
| `<project-dir>` | Folder under `/www/wwwroot` | `my-app` |
| `<port>` | Host port mapped from the container | `8080` |
| `<git-repo-url>` | Remote Git URL | `https://github.com/<user>/<repo>.git` |

---

## Appendix B · Troubleshooting

| Symptom | Fix |
|---------|-----|
| Wrong panel username/password | `bt default` or `bt 6`; don’t trust stale OOS output |
| Submit disabled on security rule | Fill access source (`0.0.0.0/0`) |
| Red warning on “Docker Manager” plugin | Use sidebar **Docker**; skip the legacy plugin |
| `nano: command not found` | Edit via Baota **Files**, or `vi` / install nano |
| Git asks for password / auth fails | Private repo → Token with `repo` scope, not login password |
| Flood of `command not found` | You pasted logs into the shell; ignore—clone may already have succeeded |
| Proxy 502 | `curl 127.0.0.1:<port>`; check proxy port matches Compose |
| Large upload failures | Nginx `client_max_body_size` |
| Frontend still uses old env | If vars are baked at **image build** time, rebuild |

---

## Related

- Sibling guide (Workbench / hand-installed Docker): [Aliyun ECS Deployment Guide](/notes/aliyun-ecs-docker-deploy.en)
- 中文版源文件：`aliyun-ecs-baota-docker-deploy.md`
