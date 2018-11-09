FROM python:2.7

EXPOSE 8888

RUN mkdir -p /data/uploaded
RUN mkdir -p /data/preprocessed

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN pip install -r requirements.txt

CMD ["python", "-u", "main.py"]
