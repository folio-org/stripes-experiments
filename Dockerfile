FROM node:latest

RUN mkdir -p /usr/src/stripes-experiments
COPY . /usr/src/stripes-experiments
WORKDIR /usr/src/stripes-experiments
RUN cd redux-okapi && \
   npm install 
RUN cd stripes-core && \
   npm install 
RUN cd stripes-core/node_modules/stripes-loader && \
   npm install && \
   npm run build
RUN cd stripes-core/node_modules && \
   ln -fs ../../@stripes-experiments . 

#EXPOSE 8080
#CMD ["npm", "start"]

WORKDIR /usr/src/stripes-experiments/stripes-core
CMD ["npm", "run", "build"]

