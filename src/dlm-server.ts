import { DistributedLockManager } from './distributed-lock-manager';

export abstract class DLMServer {

    constructor(
        private logFn: (message: string) => void,
        private maximumWaitForAcquireInMilliseconds: number,
        private timeoutInMiliseconds: number,
    ) {

    }

    public async handleCommand(action: string, parameters: string[]): Promise<string> {
        const distributedLockManager: DistributedLockManager = DistributedLockManager.getInstance(this.maximumWaitForAcquireInMilliseconds, parameters[0], this.timeoutInMiliseconds);

        if (action === 'acquire') {
            // acquire <name>
            const result: boolean = distributedLockManager.acquire();

            if (this.logFn && result) {
                this.logFn(`Lock acquired for '${distributedLockManager.name}'`);
            }

            return result ? 'TRUE\r\n' : 'FALSE\r\n';
        } else if (action === 'release') {
            // release <name>
            distributedLockManager.release();

            if (this.logFn) {
                this.logFn(`Lock released for '${distributedLockManager.name}'`);
            }

            return 'OK\r\n';
        } else if (action === 'waitAcquire') {
            // waitAcquire <name>
            const result: boolean = await distributedLockManager.waitAcquire();

            if (this.logFn && result) {
                this.logFn(`Lock acquired for '${distributedLockManager.name}'`);
            }

            return result ? 'TRUE\r\n' : 'FALSE\r\n';
        } else {
            return 'Invalid Command\r\n';
        }
    }

    public abstract listen(): void;

}
