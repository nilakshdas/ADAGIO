from BaseHTTPServer import HTTPServer

from handler import FileUploadDownloadHandler


def serve(port):
    print('Starting a server on port %d' % port)
    server_address = ('', port)

    httpd = HTTPServer(server_address, FileUploadDownloadHandler)
    httpd.serve_forever()


if __name__ == '__main__':
    serve(8080)
