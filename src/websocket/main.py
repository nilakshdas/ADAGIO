from SimpleWebSocketServer import SimpleWebSocketServer

from server import DemoWebSocket


def serve(port):
    server = SimpleWebSocketServer('', port, DemoWebSocket)
    server.serveforever()


if __name__ == '__main__':
    serve(8888)
