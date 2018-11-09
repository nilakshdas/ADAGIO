import os
from base64 import decodestring
import json
from BaseHTTPServer import BaseHTTPRequestHandler


UPLOADED_FILES_DIR = '/data/uploaded'
PREPROCESSED_FILES_DIR = '/data/preprocessed'

class FileUploadDownloadHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        print self.headers

        self.send_response(200)
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers',
                         'X-Requested-With, Content-type, Accept')
        self.end_headers()
        print '---------------'

    def do_POST(self):
        print self.headers
        print
        try:
            length = int(self.headers['Content-Length'])
            request = json.loads(self.rfile.read(length))
            uploaded_file = os.path.join(UPLOADED_FILES_DIR, '%s.wav' % request['id'])
            with open(uploaded_file, 'wb') as f:
                f.write(decodestring(request['blobData'].split(",")[1]))
            print(request['id'])

            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
        except Exception as e:
            print e
            self.send_response(500)
        print '---------------'

    def do_GET(self):
        print self.headers
        print
        try:
            filename = self.path.split('/')[-1]

            if  filename.startswith('audiocard') and filename.endswith('.wav'):
                preprocessed_file = os.path.join(PREPROCESSED_FILES_DIR, filename)
                with open(preprocessed_file, 'r') as f:
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-type', 'audio/wav')
                    self.end_headers()
                    self.wfile.write(f.read())

                    os.remove(preprocessed_file)
            else:
                self.send_response(404)
        except Exception as e:
            print e
            self.send_response(500)
        print '---------------'
