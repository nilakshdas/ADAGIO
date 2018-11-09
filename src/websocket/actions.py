import time

from celery import Celery
from celery.result import AsyncResult


CELERY_BACKEND_URL = 'redis://redis-service:6379'
CELERY_FFMPEG_BROKER_URL = 'amqp://admin:password@rabbitmq-service:5672/preprocess'
CELERY_DEEPSPEECH_BROKER_URL = 'amqp://admin:password@rabbitmq-service:5672/transcribe'
CELERY_ATTACK_BROKER_URL = 'amqp://admin:password@rabbitmq-service:5672/attack'


def preprocess(method, audio_file_name):
    PREPROCESS_TASK = 'adagio_celery_ffmpeg.preprocess'
    FFMPEG_TIMEOUT = 10

    print('%s preprocessing %s' % (method, audio_file_name))
    app = Celery(broker=CELERY_FFMPEG_BROKER_URL, backend=CELERY_BACKEND_URL)
    result = app.send_task(PREPROCESS_TASK, args=(method, audio_file_name))

    timeout = False
    start = time.time()
    while not result.ready():
        now = time.time()
        if now - start > FFMPEG_TIMEOUT:
            timeout = True
            break
        else:
            time.sleep(0.2)

    return not timeout


def transcribe(audio_file_name, folder_name):
    TRANSCRIBE_TASK = 'adagio_celery_deepspeech.transcribe'
    DEEPSPEECH_TIMEOUT = 60

    print('transcribing %s/%s' % (folder_name, audio_file_name))
    app = Celery(broker=CELERY_DEEPSPEECH_BROKER_URL, backend=CELERY_BACKEND_URL)
    result = app.send_task(TRANSCRIBE_TASK, args=(audio_file_name, folder_name))

    timeout = False
    start = time.time()
    while not result.ready():
        now = time.time()
        if now - start > DEEPSPEECH_TIMEOUT:
            timeout = True
            break
        else:
            time.sleep(0.2)

    transcription = result.get() if not timeout else ''
    return transcription


def queue_attack(audio_file_name, target_transcription):
    ATTACK_TASK = 'adagio_celery_attack.attack'

    print('attacking %s: %s' % (audio_file_name, target_transcription))
    app = Celery(broker=CELERY_ATTACK_BROKER_URL, backend=CELERY_BACKEND_URL)
    result = app.send_task(ATTACK_TASK, args=(audio_file_name, target_transcription))

    return result.id


def query_attack(task_id):
    app = Celery(broker=CELERY_ATTACK_BROKER_URL, backend=CELERY_BACKEND_URL)
    task = AsyncResult(task_id, backend=CELERY_BACKEND_URL, app=app)

    return task.info
