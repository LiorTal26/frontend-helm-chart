FROM nginx:stable-alpine

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend files
COPY index.html /usr/share/nginx/html/
COPY index.js    /usr/share/nginx/html/ 
COPY style.css /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/


COPY audio/ /usr/share/nginx/html/audio/

# Fix ownership and permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
