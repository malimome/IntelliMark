// Queue class with timeout support
export class TimeoutQueue {
  constructor(maxRetries = 2, timeoutMs = 200) {
    this.tasks = [];
    this.timeout = null; 
    this.maxRetries = maxRetries;
    this.timeoutMs = timeoutMs;
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
	  clearTimeout(this.timeout);
      task.retries = 0;
	  task.resolve = resolve;
	  task.reject = reject;
      this.tasks.push(task);
      this.dequeue();
    });
  }

  async dequeue() {
    if(this.tasks.length === 0) return;
    const task = this.tasks.shift();
    this.timeout = setTimeout(async () => {
      try {
        await this.processTask(task);
      } catch(err) {
        this.handleError(task, err); 
      }
    }, this.timeoutMs);
  }

  async processTask(task) {
    try {
      const result = await task.fn();
      task.resolve(result);
    } catch(err) {
      this.handleError(task, err);
    }
  }

  handleError(task, err) {
    if(task.retries++ < this.maxRetries) {
      this.tasks.push(task);
    } else {
      task.reject(err);
    }
  }
}