# Distributed Lock Manager

A distributed lock manager (DLM) runs in every machine in a cluster, with an identical copy of a cluster-wide lock database.

## Installation

`npm install -g distributed-lock-manager`

## Usage

`dlm-server --httpPort 5000 --tcpPort 5001 --maximumWaitForAcquireInMilliseconds 2000 --timeoutInMiliseconds 5000`

## Screenshot

![screenshot](https://github.com/barend-erasmus/distributed-lock-manager/raw/master/images/screenshot.png)

## Commands

### Acquire

This command will try to acquire the lock for the given name and return `TRUE<newline>` when successfully acquired and `FALSE<newline>` when not acquired.

`aquire <name><newline>`

### Release

This command will release the lock for the given name and return `OK<newline>`.

`release <name><newline>`

### Wait Acquire

This command is exactly the same as the `acquire` command except that it will wait if it could not acquire the lock immediately.

`waitAcquire <name><newline>`

## HTTP Interface

### CSharp

```CSharp
var client = new RestClient();
client.BaseUrl = new Uri("http://localhost:5000");

var request = new RestRequest(Method.POST);
request.AddParameter("text/text", "acquire mylock\r\n", ParameterType.RequestBody);

IRestResponse response = client.Execute(request);

if (response.Content == "TRUE\r\n")
{
    Console.WriteLine("Lock acquired");
}
else
{
    Console.WriteLine("Failed to acquire lock");
}
```

### Node.js

```javascript
const rp = require('request-promise');

const response = await rp({
            body: `acquire mylock\r\n`,
            method: 'POST',
            uri: 'http://localhost:5000',
        });

if (response === 'TRUE\r\n') {
    console.log('Lock acquired');
} else {
    console.log('Failed to acquire lock');
}
```

## TCP Interface

### CSharp

```CSharp
var client = new TcpClient("127.0.0.1", 5001);
var stream = client.GetStream();

var messageSend = Encoding.ASCII.GetBytes("acquire mylock\r\n");
stream.Write(messageSend, 0, messageSend.Length);

byte[] bytesReceived = new byte[100];
int numberOfBytesReceived = stream.Read(bytesReceived, 0, 100);

var messageReceived = '';
for (int index = 0; index < numberOfBytesReceived; index++)
{
    messageReceived += (char)bytesReceived[index];
}

if (messageReceived == "TRUE\r\n")
{
    Console.WriteLine("Lock acquired");
} else
{
    Console.WriteLine("Failed to acquire lock");
}

stream.Close();
client.Close();
```

### Node.js

```javascript
const net = require('net');

const client = new net.Socket();

client.connect(5001, '127.0.0.1', () => {
	client.write(`acquire mylock\r\n`);
});

client.on('data', (data) => {
	if (data.toString() === 'TRUE\r\n') {
        console.log('Lock acquired');
    } else {
        console.log('Failed to acquire lock');
    }

    client.destroy();
});
```

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
