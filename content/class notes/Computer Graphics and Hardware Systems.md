---
title: Computer Graphics and Hardware Systems
tags:
  - computerr-graphics
  - class
date: 2026-04-02
type: note
status: draft
source: class-ppt
---
# Computer Graphics and Hardware Systems: A Comprehensive Briefing

## Executive Summary

The field of computer graphics is defined by the hardware and software systems designed to render 3D objects as pixels on a display. This document synthesizes key insights into the architectural evolution of graphics hardware, from the fundamental mechanics of Cathode Ray Tubes (CRT) and flat-panel displays to the sophisticated graphics adapters that offload processing from the CPU. Central to this evolution is the transition from "flat" unintelligent cards to modern accelerated video processors that utilize high-speed buses (PCI/AGP) and specialized memory (VRAM/Frame Buffers). Effective rendering is further supported by industry-standard software interfaces like OpenGL and critical algorithms such as Z-buffer hidden surface removal, which ensure visual accuracy and system efficiency.

--------------------------------------------------------------------------------

## 1. Fundamental Graphics Terminology and Concepts

Computer graphics relies on a specific set of geometric units and processes to simulate reality:

- **Geometric Building Blocks:**
    - **Vertex:** A discrete point in 3D space.
    - **Edge:** A line in 3D connecting two vertices.
    - **Polygon/Face/Facet:** The fundamental unit of 3D computer graphics, formed by connected vertices.
    - **Mesh:** A set of connected polygons forming a surface or object.
- **Core Processes:**
    - **Transformation:** The manipulation of objects via translation, rotation, scaling, and shearing.
    - **Animation:** The simulation of changes over time.
    - **Shading:** Modeling the interaction of light with 3D objects.
    - **Hidden Surface Removal (HSR):** The process of determining and displaying only the visible parts of an object from a specific viewpoint.
- **Signal Integrity:**
    - **Aliasing:** Distortion produced when a high-resolution signal is represented at a lower resolution (e.g., "jagged edges").
    - **Anti-aliasing:** Techniques used to remove or minimize aliasing effects.

--------------------------------------------------------------------------------

## 2. Display Technologies

### Cathode Ray Tube (CRT)

The CRT remains a foundational video monitor technology. Its operation involves an electron gun emitting a beam (cathode rays) through focusing and deflection systems. When the beam strikes a phosphor-coated screen, light is emitted. The image is maintained by quickly redrawing the picture over the same points.

#### Scanning Methodologies

|   |   |   |
|---|---|---|
|Feature|Raster Scan|Random Scan (Vector/Calligraphic)|
|**Beam Movement**|Sweeps across the screen row-by-row from top to bottom.|Directed only to parts of the screen where the picture is drawn.|
|**Data Storage**|Refresh Buffer / Frame Buffer (stores intensity for all points).|Refresh Display File (stores line-drawing commands).|
|**Refresh Rate**|Standardized cycles.|30 to 60 times per second.|
|**Terminology**|Uses pixels (picture elements) and scan lines.|Also called stroke-writing or vector display.|

### Flat Panel Displays

Emerging to replace CRTs, flat panels offer lower volume, lighter weight, and reduced power consumption. They are categorized into two types:

- **Emissive Displays:** Convert electrical energy into light (e.g., Plasma Panels, LED, Thin-film electro-luminescent).
    - _Plasma Panels:_ Utilize a gas mixture (neon) between glass plates. Firing voltages break the gas into glowing plasma at the intersection of horizontal and vertical conductors.
- **Non-Emissive Displays:** Use optical effects to convert light from other sources into patterns.
    - _Liquid Crystal Display (LCD):_ Uses nematic liquid crystal sandwiched between polarized plates. Molecules are aligned via voltage to either allow or block light passage at specific pixel positions.

### Specialized Viewing Devices

- **3D Viewing Devices:** Utilize techniques such as reflecting CRT images off vibrating, flexible mirrors (varifocal mirrors) to change focal lengths, allowing users to view objects from different angles.
- **Virtual Reality (VR):** Immersive systems that use special interface devices to transmit and record sights, sounds, and sensations, enabling interaction with computer-simulated environments.

--------------------------------------------------------------------------------

## 3. Graphics Adapters and Hardware Evolution

Graphics hardware includes the display, graphics accelerator, scan controller, and video memory. The video card (or display adapter) acts as a specialized processor to control screen images.

### Evolution of Adapters (Intel/IBM Standards)

- **Monochrome Adapter (MA):** The first available; supported only text in a single color.
- **Hercules Adapter (HA):** Emulated MA but added a graphics mode, becoming a standard for monochrome graphics.
- **Color Graphics Adapter (CGA):** Supported text and graphics but suffered from "flicker" (flashing text) and "snow" (bright dots).
    - _Medium Res:_ 320 x 200 (4 colors).
    - _High Res:_ 640 x 200 (2 colors).
- **Enhanced Graphics Adapter (EGA):** Introduced by IBM in 1984; offered 640 x 350 resolution with 16 colors. A major limitation was that its internal registers were write-only, making it difficult for software to detect the adapter's state.
- **Video Graphics Adapter (VGA):** Supported all previous modes plus 640 x 480 with 16 colors. Early VGA cards were "flat" (unintelligent), requiring the CPU to perform all calculations.
- **Super VGA (SVGA):** Not a single specification, but a group of cards with varying high-resolution capabilities (e.g., 800 x 600, 1024 x 768) requiring specific device drivers.
- **Extended Graphics Adapter (XGA):** Evolved from VGA; featured "bus mastering," allowing the adapter to take control of the system for better performance.

--------------------------------------------------------------------------------

## 4. Performance and Memory Architecture

### The Role of RAM on the Video Card

The video card's RAM, or **Frame Buffer**, stores the bit map of the screen image.

- **VRAM (Video RAM):** A specialized dual-ported RAM that allows the video processor to read old data and write new data simultaneously. While more expensive, it significantly improves speed.
- **Integrated Memory:**
    - **UMA/SMBA:** Shared system RAM for the frame buffer; generally slow and unpopular.
    - **DVMT (Dynamic Video Memory Technology):** A more modern approach used in Intel chipsets to allocate system RAM dynamically.

### Data Transport Challenges

Modern graphics demand heavy data movement. For example, a 1024 x 768 image in 16-bit color is a 1.5 MB bit map. At a 75 Hz refresh rate, the system must move massive amounts of data, which "zaps" CPU energy.

- **Accelerators:** Modern cards offload work from the CPU. Instead of the CPU calculating every pixel, the video card is programmed to draw lines and shapes directly.
- **Buses:** High-speed buses like PCI and AGP (an improved version of PCI) are essential for the bandwidth required by 3D gaming, which can reach data transfer rates of 400 MB per second.

### RAMDAC

All traditional graphics cards include a **RAMDAC** chip. This component converts digital data from the PC into the analog signals required by CRT monitors. Recommendations for high quality include using an external (non-integrated) chip with clock speeds between 250–360 MHz.

--------------------------------------------------------------------------------

## 5. Rendering and Software Interfaces

### Hidden Surface Removal: Z-Buffer Algorithm

The Z-buffer is a widely used image-space approach to HSR. It utilizes two buffers:

1. **Frame Buffer:** Stores color/intensity information.
2. **Z-Buffer:** Handles depth information by storing the "Z" value (distance) of the nearest 3D point for each pixel.

**Advantages:** Simple to implement, requires no sorting or geometric intersection calculations, and handles overlapping triangles correctly. **Disadvantages:** Requires large memory to store Z values.

### OpenGL

OpenGL is the industry-standard software interface for graphics hardware, introduced in 1992.

- **Functionality:** It renders multidimensional objects into a frame buffer and provides functions for texture mapping and special effects.
- **Portability:** Designed for compatibility across various hardware and operating systems, allowing developers to port code easily between platforms.
- **Impact:** It serves as a premier environment for interactive 2D and 3D applications, promoting innovation through a standardized API.