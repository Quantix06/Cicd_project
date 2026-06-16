FROM mysql:9.7

##ENV MYSQL_ROOT_PASSWORD=12345

COPY ./database /docker-entrypoint-initdb.d


EXPOSE 3306