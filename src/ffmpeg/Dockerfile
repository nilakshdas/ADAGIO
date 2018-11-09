FROM jrottenberg/ffmpeg:4.0-ubuntu

RUN yes | apt-get update
RUN yes | apt-get install python-pip

RUN mkdir -p /data/uploaded
RUN mkdir -p /data/preprocessed

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN pip install -r requirements.txt

ENTRYPOINT ["celery"]
CMD ["worker", "-A", "adagio_celery_ffmpeg", "-l", "info", "-c", "5", "-Ofair"]
