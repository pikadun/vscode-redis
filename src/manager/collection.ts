class Collection<T> {

    private readonly entries: { [key: string]: any } = {};

    get(id: string): T {
        return this.entries[id] as T;
    }

    has(id: string) {
        return this.entries[id] !== undefined;
    }

    set(id: string, entry: T) {
        this.entries[id] = entry;
    }

    del(id: string) {
        delete this.entries[id]
    }
}

export default Collection;