# Distributed Lock Manager

A distributed lock manager (DLM) runs in every machine in a cluster, with an identical copy of a cluster-wide lock database.

## Installation

`npm install -g distributed-lock-manager`

## Usage

`dlm-server --httpPort 5000 --tcpPort 5001 --maximumWaitForAcquireInMilliseconds 2000 --timeoutInMiliseconds 5000`