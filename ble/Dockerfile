# 使用官方的 Python 基础镜像
FROM python:3.8-slim-buster

# 安装编译所需的工具以及 glib 开发文件
RUN apt-get update && apt-get install -y gcc make libglib2.0-dev

# 设置工作目录
WORKDIR /app

# 安装 bluepy
RUN pip install bluepy

# 将您的脚本复制到容器中
COPY ble-client.py /app

# 运行脚本
CMD ["python", "./ble-client.py"]
