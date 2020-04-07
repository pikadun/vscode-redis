class Collection {

    private readonly entries: { [key: string]: any } = {};

    get<T>(id: string): T {
        return this.entries[id] as T;
    }

    has(id: string) {
        return this.entries[id] !== undefined;
    }

    set<T>(id: string, entry: T) {
        this.entries[id] = entry;
    }

    del(id: string) {
        delete this.entries[id]
    }
}

export default Collection;