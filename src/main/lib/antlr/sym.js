class Symbol {
    constructor(name, type, params = null, other = null) {
        this.name = name;
        this.type = type;
        this.params = params;
        this.other = other;
    }
}

class SymbolTable {
    constructor() {
        this.table = [];
    }

    add(s) {
        if (null == this.find(s.name)) {
            this.table.push(s);
        }
    }

    find(name) {
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].name == name) {
                return this.table[i];
            }
        }
        return null;
    }
}

export { Symbol, SymbolTable };
