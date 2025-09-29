# Usar uma imagem base com Node.js
FROM alpine:latest

# Instalar Node.js
RUN apk add --no-cache nodejs npm

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos de configuração do npm
COPY package.json package-lock.json* ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta usada pelo webpack-dev-server
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "start"]