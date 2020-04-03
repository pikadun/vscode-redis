class Collection {

    private entries: { [key: string]: any } = {}

    get<T>(id: string): T {
        return this.entries[id] as T
    }

    set<T>(id: string, entry: T) {
        this.entries[id] = entry
    }
}

export default Collection;