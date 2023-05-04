from http import client

class ClientCommunication():

    def send_request(self):
        conn = client.HTTPConnection('172.22.71.239', 5000, timeout=10)
        headers = { 'Content-type': 'application/json' }

        conn.request('POST', '/face-recognition', '{}', headers)

        response = conn.getresponse()
        conn.close()
        return response.read().decode()