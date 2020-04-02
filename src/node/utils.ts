import { RedisInfo } from "../abstraction/redisinfo";

class Utils {
    /**
     * Convert redis info to RedisInfo
     * @param infostr The string of redis info
     */
    parseInfo(infostr: string): RedisInfo {
        const lines = infostr.split('\r\n');
        const result: any = {};
        let keyword = ''

        while (lines.length > 0) {
            const line: string = lines.shift() || '';
            if (!line) {
                continue;
            }

            if (keyword === 'Keyspace') {
                this.parseKeyspace(line, result)
                continue;
            }

            if (line.startsWith('#')) {
                keyword = line.slice(2);
                result[keyword] = {};
                continue;
            }

            const info = line.split(':');
            result[keyword][info[0]] = info[1]
        }
        return result as RedisInfo
    }

    private parseKeyspace(line: string, result: RedisInfo) {
        const info = line.split(':');
        const dbInfo = info[1].split(',')
        const obj: any = {}
        dbInfo.forEach(t => {
            const arr = t.split('=');
            obj[arr[0]] = parseInt(arr[1])
        })
        result['Keyspace'][info[0]] = obj
    }
}

export default new Utils()