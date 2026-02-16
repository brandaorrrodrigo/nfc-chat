FROM nginx:alpine

# Instalar openssl para gerar certificados self-signed
RUN apk add --no-cache openssl

# Copiar configuração
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretório SSL
RUN mkdir -p /etc/nginx/ssl

# Gerar certificado self-signed para desenvolvimento
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/privkey.pem \
    -out /etc/nginx/ssl/fullchain.pem \
    -subj "/C=BR/ST=MG/L=BeloHorizonte/O=NutriFitCoach/CN=localhost"

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
