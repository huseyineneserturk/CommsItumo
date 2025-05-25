# CommsItumo Backend

Bu klasör, CommsItumo uygulamasının backend kısmını içerir.

## Kurulum

1. Python 3.8 veya üstü sürümünün yüklü olduğundan emin olun
2. Sanal ortam oluşturun ve aktif edin:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```
3. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

## Çalıştırma

```bash
uvicorn main:app --reload
```

API dokümantasyonuna erişmek için:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Klasör Yapısı

- `main.py`: Ana uygulama dosyası
- `requirements.txt`: Bağımlılıklar
- `config/`: Yapılandırma dosyaları
- `routes/`: API rotaları
- `services/`: İş mantığı servisleri
- `models/`: Veri modelleri
- `utils/`: Yardımcı fonksiyonlar 