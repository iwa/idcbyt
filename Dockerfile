FROM node:16

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY tsconfig.json /app
COPY .git /app/.git
COPY src /app/src

RUN yarn
RUN yarn build; exit 0

RUN useradd -u 8877 idcbyt
USER idcbyt

CMD ["node", "."]