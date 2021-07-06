class Lexer {
    private input: string[] = [];

    analyze(input: string[]): [string, string[]] {
        this.input = input;
        let tokens: string[] = [];
        let str = '';
        while (this.input.length > 0) {
            switch (this.input[0]) {
                case '"':
                case '\'':
                    tokens.push(this.scanStringLiteral());
                    break;
                case ' ':
                    this.input.shift();
                    tokens.push(str);
                    str = '';
                    break;
                default:
                    str += this.input.shift();
            }
        }
        tokens.push(str);
        tokens = tokens.filter(token => token !== '');
        return [tokens[0] as string, tokens.slice(1)];
    }

    private scanStringLiteral(): string {
        const quoteCharacter = this.input.shift();
        let str = '';
        while (this.input.length > 0) {
            const ch = this.input.shift() as string;
            if (ch === quoteCharacter) {
                break;
            } else if (ch == '\\') {
                str += ch;
                str += this.input.shift();
            } else {
                str += ch;
            }
        }

        return str;
    }
}

export default new Lexer();