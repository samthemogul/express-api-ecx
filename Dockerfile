FROM node:18-alpine

WORKDIR /src

COPY package.json /src

RUN npm install

COPY . /src

RUN npm run build

EXPOSE 3000 4000 5000

CMD ["npm", "run", "start"]
