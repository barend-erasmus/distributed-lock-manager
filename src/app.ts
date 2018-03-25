import { LeakyBucketAlgorithm } from './leaky-bucket-algorithm';

const leakyBucketAlgorithm: LeakyBucketAlgorithm = new LeakyBucketAlgorithm(200, 10);

console.log(leakyBucketAlgorithm.toString());

function setupTimeout() {
    setTimeout(() => {
        if (leakyBucketAlgorithm.addDrop()) {
            console.log(`Added (${leakyBucketAlgorithm.getNumberOfDrops()})`);
        } else {
            console.log(`Overflow (${leakyBucketAlgorithm.getNumberOfDrops()})`);
        }

        setupTimeout();
    }, (500 * Math.random()) + 50);
}

setupTimeout();
