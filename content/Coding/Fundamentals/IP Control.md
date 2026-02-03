---
title: IP Control
tags:
  - Computer_network
date: 2025-11-06
---

# Hardware Addressing

- used to identify a host within a local network. Hardware addressing is the function of the **data-link layer** of the [[The OSI reference model|OSI model]] (layer 2)
- A MAC address is most often represented in hexadecimal, using one of two accepted formats:
 	- 00:43:AB:F2:32:13
 	- 0043.ABF2.3213
- The first six hexadecimal digits of a MAC address identify the manufacturer of the physical network interface. This is referred to as the **OUI** (**Organizational Unique Identifier**). The last six digits uniquely identify the host itself, and are referred to as the  host ID.
- The MAC address has one shortcoming – it contains no hierarchy. MAC addresses provide no mechanism to create boundaries between networks. There is no method to distinguish one network from another.

# Logical addressing

- Logical addressing is a function of the Network layer of the [[The OSI reference model|OSI Model]] (Layer-3), and provides a hierarchical structure to separate networks. Logical addresses are never hardcoded on physical network interfaces, and can be dynamically assigned and changed freely.
- A logical address contains two components:
 	- Network ID – identifies which network a host belongs to.
 	- Host ID – uniquely identifies the host on that network

# Internet Protocol (IP)

- IP provides two fundamental Network layer services:
 	- **Logical addressing** – provides a unique address that identifies both the host, and the network that host exists on.
 	- **Routing** – determines the best path to a particular destination network, and then routes data accordingly.
- IP is the primary protocol in the **Internet Layer** of the Internet Protocol Suite and has the task of delivering distinguished protocol datagrams (packets) from the source host to the destination host solely based on their **addresses**. For this purpose the Internet Protocol defines addressing methods and structures for datagram encapsulation.
- IPv4 employs a 32-bit address, which limits the number of possible addresses to 4,294,967,296. IPv4 will eventually be replaced by IP Version 6 (IPv6), due to a shortage of available IPv4 addresses.

# IPv4  Addressing

- A core function of IP is to provide logical addressing for hosts. An IP address provides a hierarchical structure to both uniquely identify a host, and what network that host exists on.
- An IP address is most often represented in decimal, in the following format:
                       `158.80.164.3`
- An IP address is comprised of four octets, separated by periods:
 First Octet           Second Octet       Third Octet        Fourth Octet
   158                          80                        164                        3

## IPv4 Data flow
