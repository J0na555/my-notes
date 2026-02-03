---
title: Concurrency control
tags:
  - concurrency
  - database
date: 2025-06-06
---

## concurrency

- A simultaneous execution of [[Transaction|transaction]] in a multi user database is known as **concurrency** **control**
- The main objective is to maintain a serializability in a multi user database environment
- concurrency control is important cause simultaneous execution of transaction can cause a series of data integrity and consistency problems. the four main problems are
 1. lost updates
 2. dirty reads (uncommitted data)
 3. non-repeatable read (inconsistent retrieval)
 4. phantom reads

## concurrency control protocols

concurrency control protocol ensures atomicity, isolation and serialization of concurrent transactions.
The concurrency control protocol can be divided into three categories:

 1. Locking
 2. Timestamp
 3. Optimistic

### Locking methods

- A lock is a data variable which is associated with a data in the database
- The overall purpose of lock is to maximize concurrency and minimize any delay that may happen during processing transactions
- used to prevent multiple users modifying the same data
- **Read lock** or **shared lock**  and **write lock** or **exclusive lock**

#### Types of locking

- **Binary Locks**: Simple lock/unlock.
- **Shared/Exclusive Locks** (Read/Write Locks):
- **Shared (S)**: Multiple transactions can read.
- **Exclusive (X):** Only one transaction can write

#### Lock Mode

- **Shared Lock (Read)**: If a transaction has obtained a shared lock on a data X, then it can read X,but can't write X. Multiple Shared lock can be placed simultaneously on a data item.
- **Exclusive Lock(Write)**: If a transaction T has obtained Exclusive lock on data item X, then T can be read as well as write X. Only one Exclusive lock can be placed on a data item at a time. This means multiple transactions cannot modify the same data simultaneously.
- If *Lock(x)=1* transaction forced to wait
- If *Lock(x)=0,* it is set to 1 & the transaction is allowed to access x, when a transaction finished operations x is issues an unlock item operation
- allowing transactions to lock and unlock data at any time doesn’t prevent concurrency problems.
For example:
- A transaction might lock, unlock, and then lock again.
- This can lead to interleaved operations that break consistency and cause anomalies (like dirty reads, lost updates, etc.).

#### Two phase Locking (2PL)

- It is a method or a protocol of controlling concurrent processing in which all locking operations precede the first unlocking operation.
- Thus, a transaction is said to follow the two-phase locking protocol if all locking operations (read_lock, write_lock) precede the first unlock operation in the transaction
- Such a transaction can be divided into two phases:
 1. Locking (Growing) phase A transaction applies lock(R-W) on desired data items one at a time acquires all locks on items but none can be released;
 2. Unlock(shrinking) phase,a transaction unlocks its locked data items one at a time
- It can be proved that, if every transaction in a schedule follows the basic 2PL, the schedule is guaranteed to be serializable
- The locking mechanism, by enforcing 2PL rules, also enforces serializability
- In summary, all type 2PL protocols guarantee serializability (correctness) of a schedule but limit concurrency
- In 2pl one transaction have to get the lock of another item before unlocking the one it locks, so if two transactions are in execution and each has a lock on one item and wants the other lock in order to unlock the one they have, that is called **deadlock**. even if it gives serialization of transactions it but it limits concurrency.l

#### Deadlock

- A situation where two or more transactions are waiting indefinitely for one another to give up locks.
- Deadlock is said to be one of the most feared complications in DBMS as no task ever gets finished and is in waiting state forever.
- e.g, if we consider, T1 has acquired lock on X and is waiting to acquire lock on Y.
- While, T2 has acquired lock on Y and is waiting to acquire lock on X
- A deadlock is also called a **circular waiting condition** where two transactions are waiting (directly or indirectly) for each other

#### Deadlock Prevention

- It has two possibility
- It is protocol is used in conservative 2PL.
- It requires that every transaction lock all data items it needs in advance before it begins execution
- Since a transaction never waits for a data item.
- if any of the items cannot be obtained, none of the items are locked. Rather, the transaction waits and then tries again to lock all the items it needs
- Deadlock prevention protocol has two possibilities
 1. conservation low phase locking a transaction locks all data items it refers to before it  begins execution since a transaction never waits for a data item but it has restriction concurrency
 2. **Transaction timestamp(TS)**:By giving each transaction,  a priority and ensuring that lower priority transaction not allowed to wait for higher priority transactions(vice versa)
 	- If T1 starts before `T2, TS(T1<Ts(T2)`
 	- The lower the TS the higher the transaction priority that is the oldest transaction has the highest priority

#### Wait-die or wound-wait

- **Wait-die** If Ti has higher priority, its is allowed to wait otherwise it is aborted.
- An older transaction allowed to wait on a younger transaction
- If `TS(Ti)<TS(Tj)` then Ti older than Tj Ti is allowed to wait otherwise Ti younger than Tj)
- Abort Ti (Ti dies) and restart if later with the same timestamp
- **Wound wait** :The opposite of wait-die
- If Ti has higher priority abort Tj otherwise Ti waits
- A younger transaction is allowed to wait on another one

#### Optimistic concurrency

All transaction to proceed Asynchronously & only at the time of commit
Serializability  is checked & transaction are aborted in case of non-serializable schedule
It has three phase
Read, Validation and Write phase
Optimistic no lock/unlock only check the item if free

## Related

- [[Query processing]]
