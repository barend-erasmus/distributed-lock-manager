import * as net from 'net';
import { DistributedLockManager } from './distributed-lock-manager';

function handleSocket(socket: net.Socket): void {
    let socketBuffer: Buffer = null;

    socket.on('data', (data: Buffer) => {
        socketBuffer = socketBuffer ? Buffer.concat([socketBuffer, data]) : data;

        let command: number[] = [];

        for (const char of socketBuffer) {
            if (!char) {
                continue;
            }

            if (char === 10) {
                handleCommand(command, socket).then(() => { });

                command = [];
                continue;
            }

            command.push(char);
        }

        socketBuffer = Buffer.from(command);
    });
}

async function handleCommand(command: number[], socket: net.Socket): Promise<void> {
    command = command.filter((x) => x !== 10 && x !== 13);

    const commandString: string = String.fromCharCode.apply(null, command);

    const splittedCommandString: string[] = commandString.split(' ');

    const action: string = splittedCommandString[0];

    const parameters: string[] = splittedCommandString.slice(1);

    const distributedLockManager: DistributedLockManager = DistributedLockManager.getInstance(parameters[0], 1000);

    if (action === 'acquire') {
        // acquire <name>
        const result: boolean = distributedLockManager.acquire();

        socket.write(result ? 'TRUE\r\n' : 'FALSE\r\n');
    } else if (action === 'release') {
        // release <name>

        distributedLockManager.release();

        socket.write('OK\r\n');
    } else if (action === 'waitAcquire') {
        // waitAcquire <name>
        const result: boolean = await distributedLockManager.waitAcquire();

        socket.write(result ? 'TRUE\r\n' : 'FALSE\r\n');
    } else {
        socket.write('Invalid Command\r\n');
    }
}

net.createServer(handleSocket).listen(5000);

const port: number = 5000;

console.log(`listening on ${port}`);
