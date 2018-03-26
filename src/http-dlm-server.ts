import * as http from 'http';

import { DLMServer } from './dlm-server';

export class HTTPDLMServer extends DLMServer {

    private server: http.Server = null;

    constructor(
        logFn: (message: string) => void,
        maximumWaitForAcquireInMilliseconds: number,
        private port: number,
        timeoutInMiliseconds: number,
    ) {
        super(logFn, maximumWaitForAcquireInMilliseconds, timeoutInMiliseconds);

        this.server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => this.handleRequest(request, response));

        this.server.on('clientError', (err: Error) => {

        });
    }

    public handleRequest(request: http.IncomingMessage, response: http.ServerResponse): void {
        let socketBuffer: Buffer = null;

        request.on('data', (data: Buffer) => {
            socketBuffer = socketBuffer ? Buffer.concat([socketBuffer, data]) : data;

            let command: number[] = [];

            for (const char of socketBuffer) {
                if (!char) {
                    continue;
                }

                if (char === 10) {
                    const parsedCommand: any = this.parseCommand(command);

                    this.handleCommand(parsedCommand.action, parsedCommand.parameters).then((result: string) => {
                        response.write(result);
                        response.end();
                    }).catch((err) => {
                        response.write('ERROR');
                        response.end();
                    });

                    command = [];
                    continue;
                }

                command.push(char);
            }

            socketBuffer = Buffer.from(command);
        });
    }

    public listen(): void {
        this.server.listen(this.port);
    }

    private parseCommand(command: number[]): any {
        command = command.filter((x) => x !== 10 && x !== 13);

        const commandString: string = String.fromCharCode.apply(null, command);

        const splittedCommandString: string[] = commandString.split(' ');

        const action: string = splittedCommandString[0];

        const parameters: string[] = splittedCommandString.slice(1);

        return {
            action,
            parameters,
        };
    }
}
