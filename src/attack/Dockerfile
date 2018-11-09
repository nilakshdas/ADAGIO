FROM python:3.6

ADD . /usr/src/app

RUN mkdir -p /data/uploaded
RUN mkdir -p /data/preprocessed

WORKDIR /data
RUN wget https://github.com/mozilla/DeepSpeech/releases/download/v0.1.0/deepspeech-0.1.0-models.tar.gz \
    && tar -xvzf deepspeech-0.1.0-models.tar.gz \
    && rm deepspeech-0.1.0-models.tar.gz

WORKDIR /usr/src/app
RUN git clone https://github.com/mozilla/DeepSpeech.git \
    && cd DeepSpeech && git checkout tags/v0.1.1
RUN pip install -r requirements.txt
RUN cd audio_adversarial_examples \
    && python3 -u make_checkpoint.py; ls /data/models
WORKDIR /usr/src/app
ENTRYPOINT ["celery"]
CMD ["worker", "-A", "adagio_celery_attack", "-l", "info", "-c", "1", "-Ofair"]
