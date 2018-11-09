import sys
sys.path.append('audio_adversarial_examples')
sys.path.append('DeepSpeech')

from celery import Celery

from audio_adversarial_examples.attack import do_attack


BROKER_URL = 'amqp://admin:password@rabbitmq-service:5672/attack'
BACKEND_URL = 'redis://redis-service:6379'


app = Celery('adagio_celery_attack', broker=BROKER_URL, backend=BACKEND_URL)


@app.task(bind=True)
def attack(self, filename, target_transcription):
    current_state = {
        'cardID': filename.replace('.wav', ''),
        'numIters': 0,
        'attackStarted': False,
        'attackTerminated': False,
        'currentTranscription': None,
        'targetTranscription': target_transcription}
    self.update_state(state='STARTING', meta=current_state)

    return do_attack(filename, target_transcription, current_state, self.update_state)
