from celery import Celery

from preprocessing import amr_encode, mp3_compress


BROKER_URL = 'amqp://admin:password@rabbitmq-service:5672/preprocess'
BACKEND_URL = 'redis://redis-service:6379'
METHOD_MAP = {'amr': amr_encode, 'mp3': mp3_compress}


app = Celery('adagio_celery_ffmpeg', broker=BROKER_URL, backend=BACKEND_URL)


@app.task
def preprocess(method, filename):
    m = METHOD_MAP[method]
    outfile = m(filename)

    return {'method': method, 'output': outfile}
