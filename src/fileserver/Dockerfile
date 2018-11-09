FROM python:2

EXPOSE 8080

RUN mkdir -p /data/uploaded
RUN mkdir -p /data/preprocessed

ADD . /usr/src/app
WORKDIR /usr/src/app

CMD ["python", "-u", "main.py"]
