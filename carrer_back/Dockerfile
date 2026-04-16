# Python bazaviy imiji
FROM python:3.13-slim

# Ishchi papkani yaratish
WORKDIR /app

# Talablar faylini ko‘chirish
COPY requirements.txt .

#RUN apt-get update && apt-get install -y \
#    wget \
#    curl \
#    unzip \
#    gnupg \
#    libnss3 \
#    libx11-xcb1 \
#    libxcomposite1 \
#    libxcursor1 \
#    libxdamage1 \
#    libxi6 \
#    libxtst6 \
#    libatk-bridge2.0-0 \
#    libgtk-3-0 \
#    libdrm2 \
#    libgbm1 \
#    libxrandr2 \
#    libasound2 \
#    fonts-liberation \
#    xdg-utils \
#    libu2f-udev \
#    libvulkan1 \
#    libxss1
#
## Google Chrome o‘rnatish
#RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
#    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
#    apt-get update && \
#    apt-get install -y google-chrome-stable
#
## ChromeDriver versiyasini aniqlash va o‘rnatish
#RUN CHROME_VERSION=$(google-chrome-stable --version | grep -oP '\d+\.\d+\.\d+') && \
#    DRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_VERSION") && \
#    wget -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/$DRIVER_VERSION/chromedriver_linux64.zip" && \
#    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
#    chmod +x /usr/local/bin/chromedriver && \
#    rm /tmp/chromedriver.zip \

#RUN #apt-get update && apt-get install -y wkhtmltopdf

# Kutubxonalarni o‘rnatish
RUN pip install -r requirements.txt
# --no-cache-dir
# Butun loyihani ko‘chirish
COPY . .

# Django statik fayllarni to‘plash (ixtiyoriy)
RUN python manage.py collectstatic --noinput

# Portni ochish
EXPOSE 8000

# Serverni ishga tushirish
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
