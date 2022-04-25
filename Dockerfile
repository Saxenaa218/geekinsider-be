FROM node:12
WORKDIR /var/service
COPY . .
WORKDIR ./BE
RUN npm install --unsafe-perm=true --allow-root
RUN npm start
EXPOSE 8080
CMD "npm start"