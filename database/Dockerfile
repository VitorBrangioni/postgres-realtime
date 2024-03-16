FROM postgres:12.3
ADD ./scripts/*.sql /docker-entrypoint-initdb.d/
RUN echo "America/Sao_Paulo" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata