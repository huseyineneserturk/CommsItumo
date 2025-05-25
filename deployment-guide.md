# CommsItumo Profesyonel Deployment Rehberi

## 🌐 Domain ve DNS Konfigürasyonu

### 1. Domain Satın Alma
- Domain sağlayıcısından domain satın alın
- DNS yönetimini Cloudflare'e transfer edin

### 2. Cloudflare DNS Ayarları
```
Type    Name    Content                 TTL
A       @       YOUR_SERVER_IP          Auto
A       www     YOUR_SERVER_IP          Auto
CNAME   api     YOUR_SERVER_IP          Auto
```

## 🖥️ Server Kurulumu (DigitalOcean)

### 1. Droplet Oluşturma
```bash
# Ubuntu 22.04 LTS seçin
# 2GB RAM, 50GB SSD önerilen
# SSH Key ekleyin
```

### 2. Server'a Bağlanma
```bash
ssh root@YOUR_SERVER_IP
```

### 3. Temel Güvenlik
```bash
# Firewall kurulumu
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable

# Yeni kullanıcı oluşturma
adduser deploy
usermod -aG sudo deploy
```

### 4. Gerekli Yazılımları Kurma
```bash
# System update
apt update && apt upgrade -y

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Python kurulumu
apt install python3 python3-pip python3-venv -y

# Nginx kurulumu
apt install nginx -y

# Certbot (SSL) kurulumu
apt install certbot python3-certbot-nginx -y

# PM2 kurulumu (Process Manager)
npm install -g pm2

# Git kurulumu
apt install git -y
```

## 🚀 Uygulama Deploy

### 1. Repository Klonlama
```bash
cd /var/www
git clone https://github.com/huseyineneserturk/CommsItumo.git
cd CommsItumo
chown -R deploy:deploy /var/www/CommsItumo
```

### 2. Backend Deploy
```bash
cd backend

# Virtual environment
python3 -m venv venv
source venv/bin/activate

# Dependencies
pip install -r requirements.txt

# Environment variables
cp .env.example .env
nano .env  # Gerçek değerleri girin

# PM2 ile çalıştırma
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name "commsiturk-api"
pm2 save
pm2 startup
```

### 3. Frontend Build
```bash
cd ../frontend

# Dependencies
npm install

# Environment variables
cp .env.example .env
nano .env  # Production değerleri girin

# Build
npm run build

# Build dosyalarını nginx klasörüne kopyala
cp -r dist/* /var/www/html/
```

## 🌐 Nginx Konfigürasyonu

### 1. Site Konfigürasyonu
```bash
nano /etc/nginx/sites-available/commsiturk.com
```

```nginx
server {
    listen 80;
    server_name commsiturk.com www.commsiturk.com;
    
    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static/ {
        alias /var/www/CommsItumo/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Site'ı Aktifleştirme
```bash
ln -s /etc/nginx/sites-available/commsiturk.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🔒 SSL Sertifikası

### 1. Let's Encrypt SSL
```bash
certbot --nginx -d commsiturk.com -d www.commsiturk.com
```

### 2. Otomatik Yenileme
```bash
crontab -e
# Şu satırı ekleyin:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring ve Backup

### 1. PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### 2. Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 3. Otomatik Backup Script
```bash
nano /home/deploy/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups"

# Database backup (if using)
# pg_dump your_db > $BACKUP_DIR/db_$DATE.sql

# Code backup
tar -czf $BACKUP_DIR/code_$DATE.tar.gz /var/www/CommsItumo

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /home/deploy/backup.sh
crontab -e
# Günlük backup için:
0 2 * * * /home/deploy/backup.sh
```

## 🔄 Deployment Script

### 1. Auto Deploy Script
```bash
nano /home/deploy/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/CommsItumo

# Git pull
git pull origin main

# Backend update
cd backend
source venv/bin/activate
pip install -r requirements.txt
pm2 restart commsiturk-api

# Frontend update
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/html/

# Nginx reload
sudo systemctl reload nginx

echo "Deployment completed!"
```

```bash
chmod +x /home/deploy/deploy.sh
```

## 📈 Performance Optimization

### 1. Nginx Gzip
```nginx
# /etc/nginx/nginx.conf içine ekleyin
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Cloudflare Ayarları
- Speed > Optimization > Auto Minify: CSS, HTML, JS
- Speed > Optimization > Brotli: On
- Caching > Caching Level: Standard
- Security > Security Level: Medium

## 💰 Maliyet Hesabı

### Aylık Maliyetler:
- **Domain**: $1/ay (yıllık $12)
- **DigitalOcean Droplet**: $12/ay (2GB RAM)
- **Cloudflare**: Ücretsiz
- **SSL**: Ücretsiz (Let's Encrypt)
- **Email**: $6/ay (Google Workspace)

**Toplam**: ~$19/ay ($228/yıl)

### Yıllık Maliyetler:
- **Domain yenileme**: $12
- **Server**: $144
- **Email**: $72
- **Toplam**: $228/yıl

## 🎯 Sonraki Adımlar

1. **Analytics**: Google Analytics kurulumu
2. **Monitoring**: Uptime monitoring (UptimeRobot)
3. **Backup**: Otomatik backup sistemi
4. **CDN**: Static dosyalar için CDN
5. **Database**: Production database kurulumu 