---
title: "[实战] 零成本打造私人 AI 助手：Win11 + Docker 本地部署 Qwen2.5 + QQ 机器人全流程"
published: 2026-01-14
description: 'Win11 + WSL2 + Docker 本地部署 Qwen2.5-7b + NapCat + AstrBot，零成本打造 QQ AI 机器人。'
image: '/images/2026/01/qwen2-docker-qq-bot-cover.png'
category: '学习记录'
draft: false
---

**摘要：**

不依赖云端 API，告别隐私泄露焦虑！利用 i9-13980HX + RTX 4060 笔记本，在 Windows 11 上通过 WSL2 + Docker 成功部署 **NapCat** (QQ 客户端) + **AstrBot** (机器人大脑) + **Ollama** (推理后端)。本文记录了从环境配置、Docker 路径避坑、网络调试到模型优选（放弃 DeepSeek-R1 转投 Qwen2.5）的全过程。如果你也想拥有一个响应极快、7×24 小时待命的 AI 伙伴，这篇教程就是为你准备的。

---

## **🛠️ 硬件与环境**

- **设备**：华硕 FX607JV

- **CPU**：i9-13980HX

- **GPU**：RTX 4060 Laptop (8GB)

- **内存**：32GB DDR5

- **系统**：Windows 11 (23H2/24H2)

- **核心组件架构**：

- **WSL 2 (Ubuntu)**：底层 Linux 环境

- **Docker Desktop**：容器化部署机器人组件

- **Ollama**：本地大模型推理后端

- **AstrBot**：机器人逻辑大脑（LLM 编排与功能管理）

- **NapCatQQ**：基于 NTQQ 的无头客户端（负责收发消息）

---

## **第一步：基础环境搭建 (WSL2 + Docker)**
## **1. 安装 WSL 2**

Windows 11 安装 WSL 非常简单。右键开始菜单，以**管理员权限**打开 PowerShell，输入：

```
wsl --install
```

重启电脑后，你就拥有了一个完整的 Linux 子系统环境。

## **2. 安装 Docker Desktop**

**⚠️ 避坑指南：** Docker 默认安装在 C 盘，随着镜像增多很容易导致 C 盘爆红。虽然可以通过软链接迁移，但不如安装时直接指定路径方便。

**推荐安装方式（命令行安装）：**

- 去 Docker 官网下载安装包（例如 Docker Desktop Installer.exe）。

- 在安装包所在目录打开终端（右键 -> 在终端中打开），运行以下命令（将 G:\Docker 替换为你想要的安装路径）：

```
Start-Process -FilePath ".\Docker Desktop Installer.exe" -ArgumentList "install --installation-dir=G:\Docker" -Wait
```

安装完成后，建议在 Docker 设置中确认 Resources -> Disk image location 是否已指向你的目标盘。

---

## **第二步：部署 AI 模型 (Ollama) **
为了避免 C 盘空间告急，我们将使用命令行安装 Ollama，并通过环境变量强行指定**模型存储路径**（这是占用空间的大头）。

**💡 模型选择：为什么放弃 DeepSeek-R1？**

DeepSeek-R1 虽然逻辑强大，但作为聊天机器人有一个明显的“短板”：思考时间过长。在实际测试中，R1 往往需要先输出一段冗长的 过程，导致回复延迟较高，对话体验不够流畅。

**✅ 最终选择：Qwen2.5-7b**

对于 RTX 4060 (8GB) 用户，Qwen2.5-7b 是目前的“甜点级”选择——响应速度极快（秒回），逻辑能力在线，且显存占用完美控制在 6GB 左右，不会爆显存。

#### **操作步骤**

## **1. 自定义路径安装 Ollama**

不要直接双击安装包！请按以下步骤操作：

- 去 [Ollama 官网](https://ollama.com/)下载 OllamaSetup.exe。

- 在下载目录打开终端（右键 -> 在终端中打开）。

- 运行以下命令（将 G:\Ollama 替换为你想要的软件安装位置）：

```
.\OllamaSetup.exe /DIR="G:\Ollama"
```

## **2. 配置模型存储路径与访问权限 (关键步骤)**

安装完成后**不要急着运行模型**，我们需要先设置环境变量，否则几个 G 的模型还是会下到 C 盘。

- **打开环境变量设置**：设置 -> 系统 -> 高级系统设置 -> 环境变量 -> **系统变量** -> 新建。

- **设置模型存储路径** (防止 C 盘爆红)：

- 变量名：OLLAMA_MODELS

- 变量值：G:\Ollama\Models (或其他你想要的空闲盘路径)

- **设置外部访问权限** (让 Docker 能连上)：

- 变量名：OLLAMA_HOST

- 变量值：0.0.0.0 (允许任何 IP 访问)

- **生效配置**：设置完后，务必在任务栏右下角右键 Ollama 图标 -> **Quit** 退出，然后重新运行 Ollama 软件。

## **3. 拉取并运行模型**

在 WSL 终端或 Windows PowerShell 中执行：

```
ollama run qwen2.5:7b
```

此时显卡应实现加速，生成速度通常能达到 40-60 tokens/s。

## **4. 验证服务**

浏览器访问 [http://localhost:11434](http://localhost:11434)，显示 “Ollama is running” 即代表安装与网络配置均成功。

---

## **第三步：Docker Compose 一键部署机器人**
为了方便管理，我们使用 docker-compose.yml 同时启动 NapCat (QQ客户端) 和 AstrBot (大脑)。

## **📂 目录准备**

**注意：** 这里我们需要手动创建一个**项目文件夹**来存放配置文件。

这个文件夹可以建在任意位置（例如 G:\QQBot 或 D:\Projects\Bot），**不需要**放在 Docker 的安装目录（G:\DockerData）下。

**建议目录结构 (以 ****G:\QQBot\**** 为例)：**

```
G:\QQBot\
├── docker-compose.yml # 核心配置文件
├── napcat\            # 自动生成，存放QQ配置
└── astrbot\           # 自动生成，存放机器人数据
```

## **📝 docker-compose.yml 配置**

在 G:\QQBot\ 目录下新建 docker-compose.yml 文件，填入以下内容：

```
version: '3.8'

services:
# 服务1: NapCat (QQ登录端)
napcat:
image: mlikiowa/napcat-docker:latest
container_name: napcat
restart: always
environment:
- ACCOUNT=      # 留空，通过WebUI扫码
- WS_ENABLE=true
ports:
- "6099:6099"   # NapCat WebUI 默认端口
- "3001:3001"   # 正向 WS 端口 (备用)
volumes:
- ./napcat/config:/app/napcat/config
- ./napcat/logs:/app/napcat/logs

# 服务2: AstrBot (机器人大脑)
astrbot:
image: soulter/astrbot:latest
container_name: astrbot
restart: always
ports:
- "6185:6185"   # AstrBot WebUI 默认端口
volumes:
- ./astrbot/data:/data
depends_on:
- napcat
# 关键：让容器能访问宿主机的 Ollama
extra_hosts:
- "host.docker.internal:host-gateway"
```

## **🚀 启动服务**

在 G:\QQBot\ 目录下打开终端（右键 -> 在终端中打开）：

```
docker compose up -d
```

Docker 会自动拉取镜像并启动两个容器。

---

## **第四步：关键配置与端口排查 (避坑必读)**
在开始配置机器人之前，我们**必须先确保两个服务的管理后台（WebUI）都能正常通过浏览器访问**。

## **1. 检查 WebUI 可访问性**

请打开浏览器，分别尝试访问以下两个地址：

- **NapCat (QQ端):** [http://localhost:6099](http://localhost:6099)

- **AstrBot (大脑):** [http://localhost:6185](http://localhost:6185)

### **情况 A：两个页面都能打开**

恭喜！你的端口没有冲突，请直接跳到 **“3. 配置 NapCat”** 继续操作。

### **情况 B：页面打不开 / 无法访问 / 页面长时间空白(5分钟以上)**

这通常是因为默认端口被占用，或者程序生成了随机端口。请按以下步骤修复：

## **2. 查找真实端口并修复 (修复步骤)**

- **修复 NapCat 端口：**

- 打开文件资源管理器，找到 G:\QQBot\napcat\config\webui.json。

- 用记事本打开它，找到 “port”: xxxx（这是真实端口）和 “token”: “xxxx”（登录密码）。

- **修复 AstrBot 端口：**

- 在项目目录下打开终端，输入命令查看日志：docker logs astrbot

- 在输出的日志的底部找到连接：➜ 本地: http://localhost:xxxx，这个 xxxx 就是真实端口。[](http://localhost:6185)

**⚠️ 修改 Docker 配置与重启 (必做)：**

如果发现真实端口与 docker-compose.yml 中写的 6099 或 6185 不一致，必须修改配置文件：

- 用文本编辑器打开 G:\QQBot\docker-compose.yml。

- 找到 ports: 部分，将旧端口改为你刚刚查到的真实端口。

- 例如：如果 NapCat 真实端口变成了 6001，则修改为 – “6001:6001″。

- **保存文件**。

- 在终端执行以下命令重启 Docker 服务以生效：

```
docker compose down
docker compose up -d
```

- 重启后，再次尝试通过新端口访问 WebUI，确认能打开后再继续。

## **3. 配置 NapCat (QQ 登录)**

- 访问 [http://localhost:6099](http://localhost:6099) (或者你修改后的端口)。

- 输入在 G:\QQBot\napcat\config\webui.json 文件中找到的 token 进行登录。

- 点击“扫码登录”，登录你的 QQ 小号。

- **网络配置（连接大脑）：**

- 进入「网络配置」，新建「Websocket 客户端」。

- **URL 填写：** ws://astrbot:6199/ws

- 注意：这里的 hostname 必须填容器名 astrbot。端口 6199 是 AstrBot 默认的消息通信端口，通常不需要改。

- 点击提交/保存。

## **4. 配置 AstrBot (关联模型与创建机器人)**

- 访问 [http://localhost:6185](http://localhost:6185) (或者你修改后的端口) 进入后台。

- **关联 Ollama：**

- 左侧菜单「模型提供商」 -> 添加 Ollama。

- **API 地址：**[http://host.docker.internal:11434/v1](http://host.docker.internal:11434/v1)

- 注意：这是 Docker 内部访问宿主机的专用地址，千万不要填 127.0.0.1。

- 点击 「获取模型列表」，选择 qwen2.5:7b。

- **关键：** 点击模型右侧的开关按钮 (ON) 启用它。

- **创建机器人：**

- 左侧「机器人」 -> 右上角「新建」。

- ID/名称：随意填写。

- 适配器类型：选择 OneBot V11。

- **反向 Websocket 主机：** 填 0.0.0.0

- **反向 Websocket 端口：** 填 6199 (这个端口要和 NapCat 里填的一致)。

- 保存并点击列表中的开关“启用”该机器人。

- **绑定 AI 模型：**

- 在机器人卡片上点「编辑」 -> 滑到最下方「配置文件」 -> 点击 default 旁的小箭头。

- 找到「AI 配置」，开启它，并在下拉框选择 qwen2.5:7b。

- 点击右下角「保存配置」。

## **5. 最终测试**

现在，用另一个 QQ 给你的机器人账号发送消息（例如“你好”），看是否能收到秒回。

提示：关于 AstrBot 的更多个性化配置，可以参考 [AstrBot 官方文档](https://docs.astrbot.app/config/astrbot-config.html)，本文不过多赘述。

---

## **第五步：效果展示与日常维护**
### **💬 最终效果**

配置完成后，一个响应迅速的 AI 机器人就诞生了！

- **极速响应**：得益于 Qwen2.5-7b 的轻量化，RTX 4060 显存占用仅 5-6GB，回复几乎零延迟。

- **智能对话**：能够流畅处理日常闲聊、代码生成及简单的逻辑推理，体验远超传统的关键词回复机器人。

### **🔌 断电重启指南 (必看)**

很多同学的笔记本不是 24 小时开机的。重启电脑后，请按以下顺序操作：

- **确保 Ollama 运行**：

- 先运行 Ollama（可以设为开机自启，或者手动运行）。如果不运行，机器人会因为连不上大脑而报错。

- **启动 Docker 容器**：

- Docker Desktop 通常会开机自启。

- 如果没有自动启动容器，打开 PowerShell 进入项目目录 G:\QQBot\，输入：

```
docker compose start
```

- 或者直接在 Docker Desktop 界面点击 Start 按钮。

---

## **总结**
通过这次部署，我们不仅实现了一个完全免费、隐私的 AI 助手，还深入理解了 Docker 网络通信和 WSL2 的显卡调用机制。对于拥有 RTX 4060 级别显卡的同学，**Qwen2.5-7b** 是目前的最佳平衡点，既能跑满显卡性能，又能获得非常智能的对话体验。

希望这篇教程能帮到正在折腾的你！🚀

## 关于作者 & 致谢

- **👨‍💻 实战/主笔**：拭柳喑雨

- *热衷折腾的数码爱好者，致力于榨干硬件的每一滴性能。*

- **🤖 整理/润色**：AI 助手 (Google Gemini)

- *协助优化排版、修正逻辑，并与人类作者共同完成了这篇指南。*

- **🌟 特别鸣谢**：开源社区 ([Ollama](https://ollama.com/), [NapCat](https://github.com/NapNeko/NapCatQQ), [AstrBot](https://github.com/AstrBotDevs/AstrBot)) 以及那台努力工作的 RTX 4060。
