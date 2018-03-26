import chalk from 'chalk';
import * as yargs from 'yargs';

import { HTTPDLMServer } from './http-dlm-server';
import { TCPDLMServer } from './tcp-dlm-server';

function logFn(message: string): void {
    console.log(chalk.magenta(message));
}

const argv = yargs.argv;

const httpPort: number = argv.httpPort || 5000;
const maximumWaitForAcquireInMilliseconds: number = argv.maximumWaitForAcquireInMilliseconds || 2000;
const tcpPort: number = argv.tcpPort || 5001;
const timeoutInMiliseconds: number = argv.timeoutInMiliseconds || 5000;

const httpDLMServer: HTTPDLMServer = new HTTPDLMServer(logFn, maximumWaitForAcquireInMilliseconds, httpPort, timeoutInMiliseconds);
const tcpDLMServer: TCPDLMServer = new TCPDLMServer(logFn, maximumWaitForAcquireInMilliseconds, tcpPort, timeoutInMiliseconds);

httpDLMServer.listen();
tcpDLMServer.listen();

console.log(chalk.blue(`Distributed Lock Manager Configuration:`));
console.log(chalk.blue(`    Maximum Wait for Acquire in Milliseconds: ${maximumWaitForAcquireInMilliseconds} milliseconds`));
console.log(chalk.blue(`    Timeout in Miliseconds: ${timeoutInMiliseconds} milliseconds`));
console.log(chalk.green(`listening on port ${httpPort} for HTTP traffic`));
console.log(chalk.green(`listening on port ${tcpPort} for TCP traffic`));
