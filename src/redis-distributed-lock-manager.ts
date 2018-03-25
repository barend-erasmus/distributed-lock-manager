export class RedisDistributedLockManager {

    private maxRetryCount: number = 5;

    constructor(
        private name: string,
        private timeoutInMilliseconds: number,
    ) {

    }

    public async acquire(): Promise<boolean> {
        const key: string = `${this.name}.lock`;
        const value: string = (new Date().getTime() + this.timeoutInMilliseconds).toString();

        const resultSETNX: boolean = await this.redisSETNX(key, value);

        if (resultSETNX) {
            return true;
        }

        const resultGETSET: string = await this.redisGETSET(key, value);

        const timestamp: number = resultGETSET ? parseInt(resultGETSET, 10) : -1;

        if (timestamp < new Date().getTime()) {
            return true;
        }

        return false;
    }

    private async release(): Promise<void> {
        const key: string = `${this.name}.lock`;

        const resultGETSET: string = await this.redisGETSET(key, value);
    }

    private async redisDEL(key: string): Promise<boolean> {
        return true;
    }

    private async redisGETSET(key: string, value: string): Promise<string> {
        return null;
    }

    private async redisSETNX(key: string, value: string): Promise<boolean> {
        return true;
    }
}
