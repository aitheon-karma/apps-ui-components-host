#!/bin/bash
npm run build:component -- --target wc --name $1 core-widgets/$2/$2.vue --build-mode "component" && cp dist/$1.min.js public/widgets

