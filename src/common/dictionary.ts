class Dictionary<T> {

    private readonly entries: { [key: string]: T } = {};

    get(id: string): T {
        return this.entries[id] as T;
    }

    has(id: string): boolean {
        return this.entries[id] !== undefined;
    }

    set(id: string, entry: T): void {
        this.entries[id] = entry;
    }

    del(id: string): void {
        delete this.entries[id];
    }
}

export default Dictionary;