FROM python:2.7

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN pip install -r requirements.txt

ENTRYPOINT ["flower"]
CMD ["--port=5555", "--broker=amqp://admin:password@rabbitmq-service:5672/", "--broker_api=http://admin:password@rabbitmq-service:15672/api/"]
