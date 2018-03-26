import { State } from './enums/state';

export class DistributedLockManager {

    private static instances: {} = {};

    private state: State = State.Unlocked;

    private timestamp: Date = null;

    constructor(
        private maximumWaitForAcquireInMilliseconds: number,
        public name: string,
        private timeoutInMilliseconds: number,
    ) {

    }

    public acquire(): boolean {
        const currentTimestamp: Date = new Date();

        if (this.state === State.Unlocked) {
            this.state = State.Locked;
            this.timestamp = currentTimestamp;

            return true;
        }

        if (this.timestamp.getTime() + this.timeoutInMilliseconds < currentTimestamp.getTime()) {
            this.state = State.Locked;
            this.timestamp = currentTimestamp;

            return true;
        }

        return false;
    }

    public static getInstance(maximumWaitForAcquireInMilliseconds: number, name: string, timeoutInMilliseconds: number): DistributedLockManager {
        let instance: DistributedLockManager = DistributedLockManager.instances[name];

        if (instance) {
            return instance;
        }

        instance = new DistributedLockManager(maximumWaitForAcquireInMilliseconds, name, timeoutInMilliseconds);

        DistributedLockManager.instances[name] = instance;

        return instance;
    }

    public release(): void {
        if (this.state === State.Locked) {
            this.state = State.Unlocked;
            this.timestamp = null;
        }
    }

    public async waitAcquire(): Promise<boolean> {
        const delayMilliseconds: number = 100;

        for (let count: number = 0; count < this.maximumWaitForAcquireInMilliseconds / delayMilliseconds; count ++) {
            const result: boolean = await this.acquire();

            if (result) {
                return true;
            }

            await this.delay(delayMilliseconds);
        }

        return false;
    }

    private delay(milliseconds: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
    }

}
