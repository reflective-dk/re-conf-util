FROM gcr.io/city-7337/base:node-12.15.0

COPY run-unit-tests.sh run-unit-tests.sh
RUN chmod a+x run-unit-tests.sh
RUN git clone git@github.com:reflective-dk/re-conf-util.git
RUN cd re-conf-util && npm install

EXPOSE 8080

CMD [ "npm", "test" ]
