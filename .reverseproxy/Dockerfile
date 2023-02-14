ARG BUILD_ENV=staging
FROM public.ecr.aws/nginx/nginx:latest
ARG BUILD_ENV
RUN echo "Building for env: $BUILD_ENV"
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx-conf-${BUILD_ENV} /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
