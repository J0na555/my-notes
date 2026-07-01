## Class: [[Python with examples|Python]]

## Topic: #python #pygame

## Date: 24-03-2025

---

Pygame consists of three main things

1. The game window

```python
screen_width = 800
screen_height = 600

screen = pygame.display.get(screen_width,screen_height)
```

1. The game loop

```python
run = true
while run;
```

1. The event handler

```python
 for event in pygame.event.get():
  if event.type == pygame.QUIT:
  run == false
pygame.quit()
```

The whole thing together

```python
import pygame

# initializing the pygame
pygame init()

screen_width = 800
screen_height = 600

screen = pygame.display.get((screen_width,screen_height))

run = true
while run;

 # closes the window if the x is clicked  
 for event in pygame.event.get():
  if event.type == pygame.QUIT:
   run == false
pygame.quit()

```

- This code will make a window appear and closes when the x is clicked
