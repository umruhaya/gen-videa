# Use the official Nginx image as the base
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the configuration file from your local to the container
COPY ./config/default.conf /etc/nginx/conf.d/

# Remove the default nginx.html file
RUN rm /usr/share/nginx/html/index.html

# Copy the content of the 'website' directory to /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]