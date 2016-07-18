FROM node:latest

RUN mkdir -p /usr/src/stripes-experiments
COPY . /usr/src/stripes-experiments
WORKDIR /usr/src/stripes-experiments
RUN cd redux-okapi && \
   npm install 

# run from github source repo
#RUN cd stripes-core/node_modules/stripes-loader && \
#   npm install && \
#   npm run build

# run from tarball
RUN mkdir -p stripes-core/node_modules && \
   cd stripes-core/node_modules/ && \
   rm -rf stripes-loader && \
   rm -rf stripes-loader-[0-9]* && \
   wget https://s3.amazonaws.com/folio-ui-bundle/tarball/stripes-loader-0.0.0-nogit.tgz && \
   tar xfz stripes-loader-0.0.0-nogit.tgz

RUN cd stripes-core && \
   npm install 

RUN cd stripes-core/node_modules && \
   ln -fs ../../@stripes-experiments . 

#EXPOSE 8080
#CMD ["npm", "start"]

WORKDIR /usr/src/stripes-experiments/stripes-core
CMD ["npm", "run", "build"]

