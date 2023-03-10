#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>hola mundo 10 mar 23 - with love, $(hostname -f)</h1>" > /var/www/html/index.html
