---
title: Computer Graphics
tags:
  - computerr-graphics
  - class
date: 2026-04-02
type: note
status: draft
source: class-ppt
---
# Interactive Computer Graphics:Principles, History, and Infrastructure

Computer graphics (CG) serves as a critical interface for human-computer communication, transforming raw data into visual representations that enhance understanding and decision-making. At its core, CG is the art and science of drawing, storing, and manipulating images—ranging from simple charts to complex 3D animations—using programming and specialized hardware.

The field is categorized primarily by user interaction (Interactive vs. Non-interactive), image format (Raster vs. Vector), and dimensionality (2D vs. 3D). Historically, the discipline emerged in the 1950s as a visualization tool for researchers and has evolved into a ubiquitous technology spanning medical imaging, engineering, and global entertainment. Modern infrastructure relies on sophisticated display controllers, frame buffers (V-RAM), and diverse monitor technologies including CRT, LCD, and Plasma. While CG significantly increases productivity and pattern interpretation, it remains constrained by hardware costs, technical complexity, and the challenges of defining realistic motion.

--------------------------------------------------------------------------------

## 1. Fundamentals of Computer Graphics

Computer graphics is defined as the use of computers to define, store, manipulate, interrogate, and represent pictorial output. It functions as an information-processing mechanism that allows users to communicate more effectively with machines.

### Key Technical Concepts

- **Pixel:** The "Picture Element" is the smallest addressable graphical unit on a computer screen. Images are composed of a collection of these discrete pixels.
- **Rasterization:** The special procedure used to determine which pixels provide the best approximation to a desired graphics object.
- **Scan Conversion:** The process of representing a continuous picture or graphics object as a collection of discrete pixels.
- **Transformation:** The use of matrices to control the mapping, location, orientation, and resizing of images (e.g., triangles) within an image space.

--------------------------------------------------------------------------------

## 2. Classification Systems

The source context identifies three primary ways to categorize computer graphics:

### I. Based on User Interaction

- **Interactive CG:** Involves two-way communication between the computer and the user. The user has control over the image, allowing for real-time changes. Examples include video games and touch-screen drawing.
- **Non-Interactive (Passive) CG:** The user has no control over the image; it is entirely dictated by program instructions. Examples include screen savers, static website images, and business brochures.

### II. Based on Image Format

The distinction between Raster and Vector graphics is fundamental to how image data is represented:

|   |   |   |
|---|---|---|
|Feature|Raster (Bitmap) Graphics|Vector Graphics|
|**Composition**|Collection of pixels in a rectangular grid.|Continuous geometric objects (lines, curves).|
|**Foundation**|Pixel patterns.|Mathematical formulas.|
|**Conversion**|Requires Scan Conversion.|Does not require Scan Conversion.|
|**Storage**|Generally takes less space.|Generally takes more space.|
|**Cost**|Less costly.|More costly.|
|**Extensions**|.BMP, .TIF, .JPG|.SVG, .PDF, .AI|

### III. Based on Dimension

- **2D Graphics:** Two-dimensional representations.
- **3D Graphics:** Three-dimensional models representing volume and depth.

--------------------------------------------------------------------------------

## 3. Historical Evolution

Computer graphics originated in government and corporate research centers like Bell Labs and Boeing in the 1950s, pioneered by researchers Verne Hudson and William Fetter.

### Early Milestones (1940–1969)

- **1940-1941:** First digital computer-generated graphics; radiosity images invented at MIT.
- **1950:** John Whitney Sr. used computer-assisted mechanisms for graphic artwork.
- **1955:** Sage system introduced the first light pen as an input device.
- **1960:** William Fetter coined the term "Computer Graphics."
- **1962:** Ivan Sutherland produced a man-machine graphical communication system.
- **1966:** Ralph Baer developed "Odyssey," the first consumer CG game.

### Expansion and Technical Breakthroughs (1970–1989)

- **1972:** Nolan Bushnell developed the "PONG" game.
- **1973-1974:** Development of Z-buffer algorithms, texture mapping, and Phong shading.
- **1980s:** Introduction of AutoCAD 1.0 (1982), VGA standards (1987), and the first website (1989).

### Modern Era (1990–Present)

- **1993-1995:** Release of the Mosaic browser, MS Internet Explorer, and the first fully CGI-generated imagery.
- **2000-2009:** Release of Sketchup (web-based CAD); use of big data for animations.
- **2018:** Achievement of "realistic" graphics on mobile phones and real-time CGI-based human faces.

--------------------------------------------------------------------------------

## 4. Hardware Infrastructure

The modern display of graphics relies on three core components working in tandem: the display controller, the frame buffer, and the monitor.

### Display and Video Controllers

- **Function:** Serves as the interface between the memory buffer and the monitor. It converts the 0s and 1s of the frame buffer into video signals.
- **Evolution of Adapters:**
    - **Monochrome Adapter (MA):** First available; text only, no graphics.
    - **Color Graphics Adapter (CGA):** Supported text and 4-color graphics but suffered from "flicker" and "snow."
    - **Video Graphics Adapter (VGA):** Supported 640x480 resolution with 16 colors.
    - **Super VGA (SVGA):** A group of cards with varying enhanced capabilities requiring specific drivers.
    - **Extended Graphics Adapter (XGA):** A "bus master" adapter providing high resolution and up to 65,536 colors.

### Memory Systems

- **Frame Buffer (V-RAM):** Digital memory where images are stored as a matrix of bits. V-RAM increases graphics speed by allowing the processor to simultaneously read old data and write new data.

### Monitor Technologies

- **Cathode Ray Tube (CRT):** Uses an electron gun to emit a beam of electrons towards a phosphor-coated screen. The phosphor emits light when hit, and the image is redrawn by quickly redirecting the beam.
- **Flat Panel Displays:**
    - **Emissive (Plasma):** Converts electrical energy into light using a mixture of gases (usually neon) between glass plates.
    - **Non-Emissive (LCD):** Uses nematic liquid crystals and light polarizers to block or allow light to pass through based on applied voltage.

--------------------------------------------------------------------------------

## 5. 3D Graphics Methodology and Terminology

The creation of 3D graphics involves a specific set of processes and structural units:

- **Modeling:** Representing 3D objects using quads and polygons.
- **Rendering:** The process of constructing 2D images from 3D models.
- **Texture Mapping:** Covering geometry with images.
- **Shading:** Modeling the interaction of light with 3D objects.
- **Hidden Surface Removal:** Ensuring only the visible parts of an object are displayed.
- **Structural Units:**
    - **Vertex:** A point in 3D space.
    - **Edge:** A line connecting two vertices.
    - **Polygon/Face:** The fundamental unit of 3D graphics formed by connected vertices.
    - **Mesh:** A set of connected polygons forming a surface.
- **Quality Control:** **Aliasing** is the distortion produced when high-resolution signals are represented at lower resolutions; **Anti-aliasing** is the technique used to remove this distortion.

--------------------------------------------------------------------------------

## 6. Applications and Impact

Computer graphics has transitioned from a specialized research tool to an essential component of modern industry.

### Primary Applications

- **Medical Imaging:** Facilitates non-invasive internal examinations via MRIs and CT scans.
- **Engineering & Architecture:** Replaces traditional blueprints with CAD/CAM for prototypes and construction plans.
- **Education & Training:** Uses simulators (e.g., flight simulators) to allow students to learn machine operation without physical risk.
- **Entertainment:** Drives the production of major motion pictures and video games.
- **Visualization:** Used in weather mapping, satellite imaging, and business presentations ("A picture is worth a thousand words").

### Operational Assessment

- **Advantages:** Superior product quality, increased productivity, lower development costs over time, and a significantly enhanced ability to interpret complex data patterns.
- **Disadvantages:** High hardware costs, technical complexities in defining motion, and issues with coupling displays to simulations.