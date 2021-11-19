import cluster from 'cluster';
import { ChildProcess } from 'child_process';
import * as os from 'os';

export function runInCluster(bootstrap: () => Promise<void>) {
  const numberOfCores = os.cpus().length;
  console.log(cluster, ChildProcess);

  if (cluster.isPrimary) {
    for (let i = 0; i < numberOfCores; ++i) {
      cluster.fork();
    }
  } else {
    bootstrap();
  }
}
