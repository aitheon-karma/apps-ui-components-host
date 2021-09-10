FROM node:10-alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app

ARG NPM_PROJECTS_TOKEN

COPY . /opt/app
RUN npm i

RUN npm run build

COPY .npmrc /opt/app/dist

WORKDIR /opt/app/dist

RUN npm publish
