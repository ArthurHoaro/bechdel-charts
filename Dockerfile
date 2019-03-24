FROM node:latest

RUN apt-get update && apt-get install -y cron supervisor
RUN yarn global add http-server

ADD crontab /etc/cron.d/cron
RUN chmod 644 /etc/cron.d/cron
RUN crontab /etc/cron.d/cron
RUN touch /var/log/cron.log 
RUN touch /var/log/hello.log 

WORKDIR /app

# RUN ln -sf /dev/stdout /var/log/bechdel.log \
#     && ln -sf /dev/stderr /var/log/bechdel-errors.log

RUN yarn install
COPY . .
RUN yarn run build

COPY supervisord.conf /etc/supervisor/supervisord.conf

VOLUME /app/src/assets/data

EXPOSE 8080
# CMD [ "http-server", "/app/dist" ]
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]

