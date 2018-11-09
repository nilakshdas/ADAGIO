from celery import Celery

from transcribe import deepspeech_transcribe


BROKER_URL = 'amqp://admin:password@rabbitmq-service:5672/transcribe'
BACKEND_URL = 'redis://redis-service:6379'


app = Celery('adagio_celery_deepspeech', broker=BROKER_URL, backend=BACKEND_URL)


@app.task
def transcribe(filename, foldername):
    return deepspeech_transcribe(filename, foldername)
