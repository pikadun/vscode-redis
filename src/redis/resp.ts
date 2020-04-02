interface decodeObj {
    buffer: Buffer,
    offset: number
}

class RESP {
    encode(cmd: string) {
        const args = cmd.split(' ');
        let result = `*${args.length}\r\n`;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            result += `$${Buffer.byteLength(arg)}\r\n${arg}\r\n`
        }
        return result;
    }

    /**
     * Handle redis reply
     * @todo missing '#' before Keyspace with command 'INFO KEYSPACE'
     * @param buffer 
     */
    decode(obj: decodeObj): any {
        const type = obj.buffer[obj.offset++];

        switch (type) {
            case 42: // '*' Arrays
                return this.decodeArray(obj);
            case 36: // '$' Bulk Strings
                return this.decodeBulkString(obj)
        }

    }

    /**
     * For Arrays the first byte of the reply is "*"
     */
    private decodeArray(obj: decodeObj) {
        const result = []
        const count = this.length(obj);
        for (let i = 0; i < count; i++) {
            result.push(this.decode(obj))
        }
        return result;
    }

    /**
     * For Bulk Strings the first byte of the reply is "$"
     */
    private decodeBulkString(obj: decodeObj) {
        const count = this.length(obj);
        const u8a = new Uint8Array(count);
        obj.buffer.copy(u8a, 0, obj.offset, obj.offset + count);
        obj.offset += count + 2;
        return Buffer.from(u8a).toString()
    }

    /**
     * Get prefixed-length
     */
    private length(obj: decodeObj) {
        let len = 0;
        let c = 0;
        while ((c = obj.buffer[obj.offset++]) !== 13) {
            len = (len * 10) + (c - 48);
        }
        obj.offset++;
        return len;
    }
}

export default new RESP()