## Course: Computer Networks

## Subject: #Computer_network

## Date: 11-06-2025

## Topic: #osi

---

# Introduction

- The **OSI** model has 7 layers, while the **TCP/IP** model has 4 layers.
- The top three layers of the OSI model (Application, presentation, session) correspond to the **Application layer** in the **TCP/IP model**.
[[Drawing 2025-06-11 08.45.46.excalidraw]]

![[Pasted image 20250611085942.png]]

# Session layer (OSI layer 5)

### key functions

- controls conversation between computers
- manages connection setup, maintenance and termination
- organizes individual packets into coherent conversations

### Communication methods

1. **Full-duplex:** simultaneous two way communication (e.g telephones)
2. **Half-duplex:** Alternating two way communication (e.g walkie-talkies)
3. **Simplex:** one way communication only

### Important Session Layer Protocols

- **H.245**: Call control for multimedia communication
- **L2TP**: Tunneling protocol for VPNs (operates at Layer 5 despite name)(layer 2 tunneling protocol)
- **NetBIOS**: Enables LAN communication and file sharing(network basic input/output system)
- **RPC**: Allows executing procedures on remote computers(Remote procedural call)
- **SMB**: Provides shared access to files, printers, and ports(server message block)
- **SOCKS**: Proxy protocol for bypassing firewalls (often uses port 1080)

# Presentation Layer (OSI Layer 6)

### Key Responsibilities

1. **Data Translation**:
    - Converts between different encoding systems (e.g., ASCII to EBCDIC)
    - Ensures interoperability between different computer systems
    - Handles file format standards (TIFF, GIF, JPEG, MPEG, MIDI)
2. **Encryption/Decryption**:
    - Secures sensitive information during transmission
    - Primarily encrypts Application Layer data
3. **Compression**:
    - Reduces data size for efficient transmission
    - Especially important for multimedia content

### Presentation Layer Protocols

- **IMAP**: Email retrieval protocol (keeps emails on server)(**internet message access protocol)**
- **SSH**: Secure remote command execution and shell access(**secure shell**)
- **SSL/TLS**: Cryptographic protocols for secure connections(**secure socket layer**)(**transport layer security**)

# Application Layer (OSI Layer 7)

### Key Characteristics

- Direct interface with users or application processes
- **Highest layer** in both **OSI** and **TCP/IP** models
- Where application software interacts with network services

### Network Architectures

1. **Client-Server**:
    - Dedicated servers with permanent IP addresses
    - Clients connect intermittently, may have dynamic IPs
    - Clients don't communicate directly with each other
![[Pasted image 20250611095243.png]]
2. **Peer-to-Peer (P2P)**:
    - No central servers
    - All peers can act as both clients and servers
    - Highly scalable but harder to manage
![[Pasted image 20250611095324.png]]

### Process Communication

- Processes identified by IP address + port number
- Common port examples: HTTP (80), SMTP (25)
- Client process initiates communication
- Server process waits for contact requests

### Transport Service Requirements

Applications need different transport services based on:

- **Data loss tolerance** (e.g., audio vs. file transfer)
- **Timing requirements** (e.g., VoIP  or online games need low delay)
- **Throughput needs** (e.g., multimedia vs. elastic apps)
- **Security needs** (encryption, data integrity)
- **TCP**:
  - Connection-oriented
  - Reliable with flow and congestion control
  - No timing or throughput guarantees

### Transport Protocol Options

- **UDP**:
  - Connectionless
  - Unreliable but faster
  - No control mechanisms

### Major Application Layer Protocols

1. **DNS** (**domain name system**)
    - Translates domain names to IP addresses
    - Hierarchical structure (.com, .edu, .net domains)
2. **[[website basics|HTTP/HTTPS]]**:(**hypertext transfer protocol**)(**hypertext transfer protocol secure**)
    - Web page delivery protocol
    - Uses HTML for content markup
    - HTTPS adds security layer
3. **FTP**: (**file transfer protocol**)
    - File transfer protocol
    - Uses port 21 for control, port 20 for data
    - Built into most OSes and browsers
4. **Email Protocols**:
    - **SMTP**: Sending mail between servers **(simple mail transfer protocol)**
    - **POP3**: Download-and-delete email access **(post office protocol 3)**
    - **IMAP**: Server-based email management **(internet message access protocol)**
5. **Other Important Protocols**:
    - **DHCP**: Automatic IP address assignment
    - **NFS**: Distributed file sharing system **(network file system)**
    - **RTP**: Streaming media protocol **(real-time transfer protocol)**
    - **SNMP**: Network management protocol **(simple network management protocol)**
    - **Telnet**: Remote terminal protocol (insecure)

### Important Distinction

- OSI Application Layer ≠ end-user applications
- Provides services that applications use (e.g., browser uses HTTP)
- Some applications may use network services transparently (e.g., word processor accessing network file)

# Transport Layer (OSI Layer 4)

## Introduction to Transport Layer

- **Position in OSI Model**: 4th layer (between Network and Session layers)
- **Key Responsibility**: Process-to-process delivery of complete messages (vs network layer's packet-by-packet delivery)
- **Core Functions**:
  - Multiplexing multiple applications on single devices
  - Ensuring reliable, in-order data delivery
  - Implementing error handling mechanisms

## Key Concepts

### Delivery Types Comparison

1. **Node-to-node**: Handled by Data Link Layer **(Layer 2)**
2. **Host-to-host**: Handled by Network Layer **(Layer 3)**
3. **Process-to-process**: Handled by Transport Layer **(Layer 4)**

### Transport Layer Responsibilities

1. **Service-point Addressing**:
    - Uses port numbers to identify specific processes
    - While network layer delivers to host, transport layer delivers to correct application
2. **Segmentation and Reassembly**:
    - Divides messages into transmittable segments
    - Uses sequence numbers for proper reassembly
    - Handles lost packet retransmission
3. **Flow Control**:
    - End-to-end control (vs Data Link Layer's single-link control)
    - Prevents sender from overwhelming receiver
4. **Error Control**:
    - Process-to-process error checking
    - Ensures complete message arrives without errors
    - Uses acknowledgments and retransmissions
5. **Connection Control**:
    - Connectionless (independent segments) vs Connection-oriented (established connection)

## Addressing and Ports

### Port Number System

- **Purpose**: Identify specific processes on a host
- **Range**: 16-bit integers (0-65,535)
- **Types**:
  - **Well-known ports**: 0-1023 (assigned by IANA)
    - Examples: FTP (21), SSH (22), SMTP (25), HTTP (80)
  - **Registered ports**: 1024-49,151 (can be registered)
  - **Dynamic/Ephemeral ports**: 49,152-65,535 (temporary client ports)

### Socket Address

- Combination of IP address and port number
- Uniquely identifies both ends of communication
- Example: 200.23.56.8:69

![[Pasted image 20250611103917.png]]

## Transport Layer Protocols

### 1. User Datagram Protocol (UDP)

- **Characteristics**:
  - Connectionless
  - Unreliable (no guarantees)
  - Minimal overhead (8-byte header)
  - No flow/error/connection control
- **Header Fields**:
  - Source port (16 bits)
  - Destination port (16 bits)
  - Length (16 bits)
  - Checksum (16 bits)
- **Use Cases**:
  - Simple request-response applications
  - Processes with built-in error control (e.g., TFTP)
  - Multicasting
  - Management processes (SNMP)
  - Routing protocols (RIP)

### 2. Transmission Control Protocol (TCP)

- **Characteristics**:
  - Connection-oriented (3-way handshake)
  - Reliable delivery
  - Stream-oriented (vs message-oriented)
  - Full-duplex communication
  - Implements flow and error control
- **Key Features**:
  - **Buffering**: Uses send/receive buffers to handle speed mismatches
  - **Segmentation**: Groups bytes into segments for IP transmission
  - **Sequence Numbers**: Tracks every byte transmitted
  - **Acknowledgments**: Uses cumulative ACKs (ACK number = next expected byte)
- **Connection Management**:
  - **Establishment**: 3-way handshake
        1. SYN (client → server)
        2. SYN-ACK (server → client)
        3. ACK (client → server)
  - **Termination**: 4-way handshake (FIN/FIN-ACK sequence)
- **Segment Structure**:
  - Sequence number (first byte in segment)
  - Acknowledgment number (next expected byte)
  - Control flags (SYN, ACK, FIN, PSH, RST, URG)
  - Window size (for flow control)

## Comparison of UDP and TCP

| Feature           | UDP                           | TCP                               |
| ----------------- | ----------------------------- | --------------------------------- |
| Connection        | Connectionless                | Connection-oriented               |
| Reliability       | Unreliable                    | Reliable                          |
| Flow Control      | None                          | Implemented                       |
| Error Control     | Minimal checksum              | Extensive (ACKs, retransmissions) |
| Data Organization | Message-oriented              | Stream-oriented                   |
| Overhead          | Low (8-byte header)           | Higher (20-byte header + control) |
| Speed             | Faster                        | Slower                            |
| Use Cases         | DNS, SNMP, VoIP, multicasting | HTTP, FTP, email, file transfer   |

## Related

- [[DSA MOC]] — Algorithms power network protocols
- [[Django MOC]] — HTTP request/response uses these layers
- [[HTTP Request]] — HTTP operates at Application layer
- [[Wireless Communication and Mobile Computing]] — Wireless networks use these protocols
- [[Fundamentals and Applications of Mobile Computing]] — Mobile networking infrastructure
