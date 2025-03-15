FROM ruby:3.3.6

EXPOSE 3000

ENV INSTALL_PATH=/var/apps/haiku

ENV RAILS_ENV=production

RUN mkdir -p $INSTALL_PATH

RUN mkdir -p /var/sockets

WORKDIR $INSTALL_PATH

RUN apt-get update && apt-get install -y --no-install-recommends nginx npm

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

RUN (cd public/web ; npm install --force ; npm run build; rm -rf node_modules)

COPY docker/entrypoint.sh /
ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]
