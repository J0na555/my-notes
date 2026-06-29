---
title: Let’s Build A Web Server 2
tags:
  - web
  - web-server
date: 2026-05-29
type: note
status: draft
source: https://ruslanspivak.com/lsbaws-part2/
---
## how to run Web server with multiple Web frameworks without making code changes either to the Web server or to the Web frameworks?
- The answer is WSGI("wizgy")

[WSGI](https://www.python.org/dev/peps/pep-0333/ "WSGI") allowed developers to separate choice of a Web framework from choice of a Web server. Now you can actually mix and match Web servers and Web frameworks and choose a pairing that suits your needs. You can run [Django](https://www.djangoproject.com/ "Django"), [Flask](http://flask.pocoo.org/ "Flask"), or [Pyramid](http://trypyramid.com/ "Pyramid"), for example, with [Gunicorn](http://gunicorn.org/ "Gunicorn") or [Nginx/uWSGI](http://uwsgi-docs.readthedocs.org "uWSGI") or [Waitress](http://waitress.readthedocs.org "Waitress"). Real mix and match, thanks to the WSGI support in both servers and frameworks:
![[Pasted image 20260529214712.png]]
