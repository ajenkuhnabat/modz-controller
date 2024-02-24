#!/bin/sh
npm i
npm run build
cp modz-controller.service /etc/systemd/system
systemctl enable modz-controller.service
systemctl start modz-controller.service