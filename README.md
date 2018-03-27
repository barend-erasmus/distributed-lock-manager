# Distributed Lock Manager

The DLM maintains a list of system resources and provides locking mechanisms to control allocation and modification of resources.

## Installation

`npm install -g distributed-lock-manager`

## Usage

`dlm-server --httpPort 5000 --tcpPort 5001 --maximumWaitForAcquireInMilliseconds 2000 --timeoutInMiliseconds 5000`

## Screenshot

![screenshot](https://github.com/barend-erasmus/distributed-lock-manager/raw/master/images/screenshot.png)

## Commands

### Acquire

This command will try to acquire the lock for the given name and return `TRUE<newline>` when successfully acquired and `FALSE<newline>` when not acquired.

`acquire <name><newline>`

### Release

This command will release the lock for the given name and return `OK<newline>`.

`release <name><newline>`

### Wait Acquire

This command is exactly the same as the `acquire` command except that it will wait if it could not acquire the lock immediately.

`waitAcquire <name><newline>`

## Client Libraries

* [DistributedLockManager.NET](https://www.nuget.org/packages/DistributedLockManager.NET) (.NET Core)
* [distributed-lock-manager-node](https://github.com/barend-erasmus/distributed-lock-manager-node) (node.js)

## Performance

### Acquire

* Mean: 2.907 ms
* Median: 3 ms
* Standard Deviation: 1.4595
* 95th Percentile: 5 ms

### Release

* Mean: 2.829 ms
* Median: 3 ms
* Standard Deviation: 1.5325
* 95th Percentile: 5 ms
