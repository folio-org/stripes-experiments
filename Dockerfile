FROM node:latest

RUN mkdir -p /usr/src/stripes-experiments
COPY . /usr/src/stripes-experiments
WORKDIR /usr/src/stripes-experiments
RUN ./bin/install-nexus.sh

