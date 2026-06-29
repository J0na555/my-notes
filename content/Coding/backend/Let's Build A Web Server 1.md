---
title: Let’s Build A Web Server 1
tags:
  - web-server
  - web
date: 2026-05-29
type: note
status: draft
source: https://ruslanspivak.com/lsbaws-part1/
---
"When you know the whole system and understand how different pieces fit together, you can identify and fix problems faster."

## What is a Web Server?

Its a networking server that sits on a physical server and waits for a client to send a request. When it receives a request, it generates a response and sends it back to the client using HTTP protocol.A client can be browser or any other software that speaks HTTP.
![[Pasted image 20260529210138.png]]
```python
import socket

HOST, PORT = '', 8888

listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
listen_socket.bind((HOST, PORT))
listen_socket.listen(1)
print(f'Serving HTTP on port {PORT} ...')

while True:
	client_connection, client_address = listen_socket.accept()
	request_data = client_connection.recv(1024)
	print(request_data.decode('utf-8'))

http_response = b"""\
HTTP/1.1 200 OK
Hello, World!
"""

client_connection.sendall(http_response)

client_connection.close()
```

![[Pasted image 20260529212812.png]]
![[Pasted image 20260529212837.png]]

The response status line _HTTP/1.1 200 OK_ consists of the _HTTP Version_, the _HTTP status code_ and the _HTTP status code reason_ phrase _OK_. When the browser gets the response, it displays the body of the response and that’s why you see _“Hello, World!”_ in the browser.

In general, The Web server creates a listening socket and starts accepting new connections in a loop. The client initiates a TCP connections and, after successfully establishing it, the client sends an HTTP request to the server and the server responses with an HTTP response that gets displayed to the user. To establish a TCP connection both client and server use sockets. 
