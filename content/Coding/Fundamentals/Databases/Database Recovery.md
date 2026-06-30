## Course: [[Database]]

## Subject: #database

## Date: 07-06-2025

## Topic: #DatabaseRecoveryTechniques

---

# Database Recovery

## purpose of database recovery

- To bring the database to the last consistent state, which existed before the failure.
- To preserve transaction properties (Atomicity, Consistency, Isolation, Durability)

## Types of Failure

- There are three types of failure

1. **Transaction error:** error that happens due to user errors (not always though)
 - Transactions may fail because of incorrect input, deadlock, incorrect synchronization.
2. **System failure**: System may fail because of addressing error, application error, operating system fault, RAM failure, etc.
3. **Media failure:** Disk head crash, power disruption, etc.

## Transaction Log

- In order to recover a database we need to have the history of its [[Transaction|transactions]]. in other words.
- For recovery from any type of failure data values prior to modification (BFIM - BeFore Image) and the new value after modification (AFIM – AFter Image) are required.
- These values and other information is stored in a sequential file called Transaction log.

## Data Updates

- **Immediate Update**: As soon as a data item is modified in cache, the disk copy is updated.
- **Deferred Update**: All modified data  in the cache is written either after a transaction ends its execution or after a fixed number of transactions have completed their execution.
- **Shadow** **update**: The modified version of a data item does not overwrite its disk copy but is written at a separate disk location.
- **In-place** **update**: The disk version of the data item is overwritten by the cache version.

## Data Caching

- Data items to be modified are first stored into database cache by the **Cache Manager** (CM) and after modification they are flushed (written) to the disk.
- The flushing is controlled by **Modified** and **Pin-Unpin** bits.
  - **Pin-Unpin**: Instructs the operating system not to flush the data item.
  - **Modified**: Indicates the AFIM of the data item.

## Transaction Roll-back (Undo) and Roll-Forward **(Redo)**

- To maintain atomicity, a transaction’s operations are redone or undone.
  - **Undo**: Restore all BFIMs on to disk (Remove all AFIMs).
  - **Redo**: Restore all AFIMs on to disk.
- Database recovery is achieved either by performing only Undo or only Redo or by a combination of the two. These operations are recorded in the log as they happen.

### Write-Ahead Logging

- When **in-place** update (immediate or deferred) is used then log is necessary for recovery and it must be available to recovery manager. This is achieved by **Write-Ahead** **Logging** **(WAL)** protocol. WAL states that

  - **For Undo**: Before a data item’s AFIM is flushed to the database disk (overwriting the BFIM) its BFIM must be written to the log and the log must be saved on a stable store (log disk).
  - **For Redo**: Before a transaction executes its commit operation, all its AFIMs must be written to the log and the log must be saved on a stable store.

## Check pointing

- Save the current state to reduce recovery time.
- The following steps defines a checkpoint operation:
 1. Suspend execution of transactions temporarily.
 2. Force write modified buffer data to disk.
 3. Write a [checkpoint] record to the log, save the log to disk.
 4. Resume normal transaction execution.
Steal/No-Steal and Force/No-Force
- Possible ways for flushing database cache to database disk:
 1. **Steal**: Cache can be flushed before transaction commits.
 2. **No-Steal**: Cache cannot be flushed before transaction commit.
 3. **Force**: Cache is immediately flushed (forced) to disk.
 4. **No-Force**: Cache is deferred until transaction commits
- These give rise to four different ways for handling recovery:
  - **Steal/No-Force (Undo/Redo)**
  - **Steal/Force (Undo/No-redo)**
  - **No-Steal/No-Force (Redo/No-undo)**
  - **No-Steal/Force (No-undo/No-redo)**

## Recovery schemes

1. **Deferred update**(no undo/ redo)
 - After reboot from a failure the log is used to redo all the transactions affected by this failure. No undo is required because no AFIM is flushed to the disk before a transaction commits.
 - **deferred update in a single user system** :There is *no* concurrent data sharing in a single user system.
 - **Deferred update with concurrent users**: - This environment requires some concurrency control mechanism to guarantee **isolation** property of transactions. In a system recovery transactions which were recorded in the log after the last checkpoint were **redone**.The recovery manager may scan some of the transactions recorded before the checkpoint to get the AFIMs.
 - Deferred Update with concurrent users
 - Two tables are required for implementing this protocol:
     - **Active** **table**: All active transactions are entered in this table.
     - **Commit** **table**: Transactions to be committed are entered in this table.
     - During recovery,all transactions of the **commit** table are redone and all transactions of **active** tables are ignored since none of their AFIMs reached the database.It is possible that a **commit** table transaction may be **redone** twice but this does not create any inconsistency because of a redone is **idempotent**, that is, one redone for an AFIM is equivalent to multiple redone for the same AFIM.
2. **Immediate update**:  **Undo/No-redo** **Algorithm**
 - In this algorithm AFIMs of a transaction are flushed to the database disk under WAL before it commits.
 - For this reason the recovery manager **undoes** all transactions during recovery.
 - No transaction is **redone**.
 - It is possible that a transaction might have completed execution and ready to commit but this transaction is also **undone**.
   **Undo/ Redo Algorithm for a (single user environment)**
 - Recovery schemes of this category apply **undo** and also **redo** for recovery.
 - In a single-user environment no concurrency control is required but a log is maintained under WAL.
 - Note that at any time there will be one transaction in the system and it will be either in the commit table or in the active table.
 - The recovery manager performs:
     - **Undo** of a transaction if it is in the **active** table.
     - **Redo** of a transaction if it is in the **commit** table.
   **Undo/Redo** **Algorithm** (**Concurrent execution)**
 - Recovery schemes of this category applies **undo** and also **redo** to recover the database from failure.
 - In concurrent execution environment a concurrency control is required and log is maintained under WAL.
 - Commit table records transactions to be committed and active table records active transactions. To minimize the work of the recovery manager checkpointing is used.
    - The recovery performs:
 - **Undo** of a transaction if it is in the **active** table.
 - **Redo of a transaction if it is in the commit table.**
3. **Shadow paging**:
 - The AFIM does not overwrite its BFIM but recorded at another place on the disk.Thus, at any time a data item has AFIM and BFIM (Shadow copy of the data item) at two different places on the disk. 
4. **WAL(write ahead logging)**:
     - All changes are logged before being applied to the database
     - Enables **undo / redo**
     - It identify the standing transaction before any transaction with out a commit/abort records is considered as uncommitted and will be undone.
5. **Check-pointing**:

6. **ARIES algorithm**: is based on WAL .
 - **Repeating** **history** **during** **redo**:
    - ARIES will retrace all actions of the database system prior to the crash to reconstruct the database state when the crash occurred.
 - ##### Logging changes during undo

    - It will prevent ARIES from repeating the completed undo operations if a failure occurs during recovery, which causes a restart of the recovery process.

7. **2 Phase commit**:

## Recovery in Multi database System
