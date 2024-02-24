#!/bin/sh
systemctl stop modz-controller.service
systemctl disable modz-controller.service
rm /etc/systemd/system/modz-controller.service