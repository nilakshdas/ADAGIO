# uses https://github.com/dpallot/simple-websocket-server

import json
import os
import time

from SimpleWebSocketServer import WebSocket

import actions


DATA_DIR = '/data'


class DemoWebSocket(WebSocket):
    def transcribe_and_send(self, id_, audio_file_name, folder_name, response_subject):
        transcription = actions.transcribe(audio_file_name, folder_name)

        response = {
            'subject': response_subject,
            'payload': {
                'id': id_,
                'transcription': transcription
            }
        }

        self.sendMessage(json.dumps(response))
        print(self.address, folder_name, audio_file_name,
              'resolved' if transcription != '' else 'timedout')

    def handleConnected(self):
        print(self.address, 'connected')

    def handleMessage(self):
        print(self.address, 'pinged')

        request = json.loads(self.data)

        if request['subject'] == 'transcribe':
            upload_folder_name = 'uploaded'
            audio_file_name = '%s.wav' % request['payload']['id']
            audio_file_path = os.path.join(DATA_DIR, upload_folder_name, audio_file_name)

            self.transcribe_and_send(
                id_=request['payload']['id'],
                audio_file_name=audio_file_name,
                folder_name=upload_folder_name,
                response_subject='transcribed')

            os.remove(audio_file_path)

        elif request['subject'] == 'preprocess-and-transcribe':
            upload_folder_name = 'uploaded'
            preprocessed_folder_name = 'preprocessed'
            input_file_name = '%s.wav' % request['payload']['id']
            input_file_path = os.path.join(DATA_DIR, upload_folder_name, input_file_name)

            method = request['payload']['preprocessingOption']
            has_preprocessed = actions.preprocess(method, input_file_name)

            if has_preprocessed:
                self.transcribe_and_send(
                    id_=request['payload']['id'],
                    audio_file_name=input_file_name,
                    folder_name=preprocessed_folder_name,
                    response_subject='preprocessed-and-transcribed')

            os.remove(input_file_path)

        elif request['subject'] == 'perturb':
            upload_folder_name = 'uploaded'
            input_file_name = '%s.wav' % request['payload']['id']
            input_file_path = os.path.join(DATA_DIR, upload_folder_name, input_file_name)

            job_id = actions.queue_attack(
                input_file_name, request['payload']['targetTranscription'])

            response = {
                'subject': 'perturbing',
                'payload': {
                    'id': request['payload']['id'],
                    'jobID': job_id
                }
            }

            self.sendMessage(json.dumps(response))
            print(self.address, input_file_path, 'perturbing')

            job_status = actions.query_attack(job_id)
            while not job_status['attackStarted']:
                time.sleep(5.0)
                job_status = actions.query_attack(job_id)
            print('%s started, deleting %s' % (job_id, input_file_path))
            os.remove(input_file_path)

        elif request['subject'] == 'fetch-status':
            job_id = request['payload']['jobID']
            job_status = actions.query_attack(job_id)

            response = {
                'subject': 'perturbation-status',
                'payload': {
                    'id': request['payload']['id'],
                    'jobID': job_id,
                    'status': job_status
                }
            }

            self.sendMessage(json.dumps(response))
            print(self.address, request['payload']['id'], 'perturbation-status')

    def handleClose(self):
        print(self.address, 'closed')
