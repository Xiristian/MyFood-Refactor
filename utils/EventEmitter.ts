type Listener = (...args: any[]) => void;

class EventEmitterClass {
  private listeners: { [key: string]: Listener[] } = {};

  addListener(eventName: string, listener: Listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);

    return {
      remove: () => {
        this.listeners[eventName] = this.listeners[eventName].filter(l => l !== listener);
      }
    };
  }

  emit(eventName: string, ...args: any[]) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listener => listener(...args));
    }
  }
}

export const EventEmitter = new EventEmitterClass(); 