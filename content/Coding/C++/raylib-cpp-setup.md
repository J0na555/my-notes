---
tags:
  - cpp
  - raylib
  - gamedev
  - setup
created: 2026-09-19
---

# Raylib C++ Project Setup

## Installing Raylib on Linux

### Install it with  Package Manager 

```bash
# Arch/Manjaro
sudo pacman -S raylib

```

---

## Project Structure

```
my-raylib-game/
├── CMakeLists.txt       # or Makefile
├── src/
│   └── main.cpp
├── resources/           # textures, sounds, fonts
│   ├── images/
│   ├── audio/
│   └── fonts/
└── build/               # build output (gitignored)
```

---

## Build Systems

### CMake 

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.10)
project(MyRaylibGame LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find raylib
find_package(PkgConfig REQUIRED)
pkg_check_modules(RAYLIB REQUIRED raylib)

add_executable(${PROJECT_NAME} src/main.cpp)

target_include_directories(${PROJECT_NAME} PRIVATE ${RAYLIB_INCLUDE_DIRS})
target_link_directories(${PROJECT_NAME} PRIVATE ${RAYLIB_LIBRARY_DIRS})
target_link_libraries(${PROJECT_NAME} PRIVATE ${RAYLIB_LIBRARIES})
target_compile_options(${PROJECT_NAME} PRIVATE ${RAYLIB_CFLAGS_OTHER})
```

Build:
```bash
mkdir build && cd build
cmake ..
make
./MyRaylibGame
```

### Simple Makefile

```makefile
# Makefile
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
RAYLIB_FLAGS = $(shell pkg-config --cflags --libs raylib)

TARGET = game
SRC = src/main.cpp

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC) $(RAYLIB_FLAGS)

clean:
	rm -f $(TARGET)

run: $(TARGET)
	./$(TARGET)
```

### Manual Compilation (Quick Test)

```bash
g++ -std=c++17 src/main.cpp -o game $(pkg-config --cflags --libs raylib)
./game
```

---

## Minimal Working Example

```cpp
// src/main.cpp
#include "raylib.h"

int main() {
    // Initialization
    const int screenWidth = 800;
    const int screenHeight = 450;
    
    InitWindow(screenWidth, screenHeight, "Raylib C++ Setup");
    SetTargetFPS(60);

    // Main game loop
    while (!WindowShouldClose()) {
        // Update
        
        // Draw
        BeginDrawing();
            ClearBackground(RAYWHITE);
            DrawText("Raylib is working!", 190, 200, 20, DARKGRAY);
        EndDrawing();
    }

    // De-initialization
    CloseWindow();
    return 0;
}
```

---

## Common Pitfalls

| Issue                                 | Fix                                                           |
| ------------------------------------- | ------------------------------------------------------------- |
| `raylib.h not found`                  | Install `libraylib-dev` or check `pkg-config --cflags raylib` |
| Linker errors (`undefined reference`) | Ensure `-lraylib` is in linker flags, after source files      |
| Window opens then closes immediately  | Missing `SetTargetFPS(60)` or event loop                      |
| Resources not loading                 | Use absolute paths or set working directory to project root   |
| High CPU usage                        | Always call `SetTargetFPS()`                                  |

---

## Resources

- [Official Raylib Cheatsheet](https://www.raylib.com/cheatsheet/cheatsheet.html)
- [Raylib GitHub](https://github.com/raysan5/raylib)
- [Raylib Examples](https://github.com/raysan5/raylib/tree/master/examples)
- [CMake FindRaylib Module](https://github.com/raysan5/raylib/wiki/Working-with-CMake)

---

## Next Steps

- [[raylib-game-loop]] - Understanding the game loop
- [[raylib-resource-management]] - Loading textures, sounds, fonts
- [[raylib-input-handling]] - Keyboard, mouse, gamepad input
- [[raylib-scenes]] - Managing multiple game screens