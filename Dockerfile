FROM ruby:3.1.0

EXPOSE 3000

ENV INSTALL_PATH=/var/apps/haiku

ENV RAILS_ENV=production

RUN mkdir -p $INSTALL_PATH

RUN mkdir -p /var/sockets

WORKDIR $INSTALL_PATH

RUN apt-get update && apt-get install -y --no-install-recommends nginx

RUN mkdir -p tmp/pids


COPY nginx.conf /etc/nginx/nginx.conf

COPY app/ ./app/
COPY bin/ ./bin/
COPY lib/ ./lib/
COPY public/ ./public/
COPY config/ ./config/
COPY Gemfile .
COPY Rakefile .
COPY config.ru .

RUN gem install rails bundler
RUN bundle install

COPY docker/entrypoint.sh /
ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]
