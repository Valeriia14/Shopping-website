FROM public.ecr.aws/docker/library/node:14.18.2-stretch
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=8192
COPY . .
RUN npm i
EXPOSE 8080
CMD ["./startup.sh"]