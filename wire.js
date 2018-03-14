export { Reader, Writer } from './js-wire';

export const TypeNull = {
    write(writer, val) {
        writer.writeUint8(0);
    },
    read(reader) {
        const val = reader.readUint8();
        if (val !== 0) {
            throw 'expected null byte';
        }

        return null;
    },
};

export const TypeByte = {
    write(writer, val) {
        writer.writeUint8(val);
    },
    read(reader) {
        return reader.readUint8();
    },
};

export const TypeBoolean = {
    write(writer, val) {
        writer.writeUint8(val ? 1 : 0);
    },
    read(reader) {
        const val = reader.readUint8();
        if (val === 1) {
            return true;
        } else if (val === 0) {
            return false;
        }

        throw 'expected boolean';
    }
};

export const TypeInteger = {
    write(writer, val) {
        writer.writeUint32(val);
    },
    read(reader) {
        return reader.readUint32();
    },
};

export const TypeString = {
    write(writer, val) {
        writer.writeString(val);
    },
    read(reader) {
        return reader.readString();
    },
};

export const TypeArray = function(hint, size) {
    return {
        write(writer, val) {
            if (val.length != size) {
                throw 'unexpected array size';
            }
            for (let i = 0; i < val.length; i++) {
                writeObject(writer, val[i], hint);
            }
        },
        read(reader) {
            const arr = [];
            for (let i = 0; i < size; i++) {
                arr.push(readObject(reader, hint));
            }

            if (hint === TypeByte) {
                return Uint8Array(arr);
            }

            return arr;
        },
    }
};

export const TypeVarArray = function(hint) {
    return {
        write(writer, val) {
            writer.writeUvarint(val.length);
            for (let i = 0; i < val.length; i++) {
                writeObject(writer, val[i], hint);
            }
        },
        read(reader) {
            const size = reader.readUvarint();
            const arr = [];
            for (let i = 0; i < size; i++) {
                arr.push(readObject(reader, hint));
            }

            if (hint === TypeByte) {
                return Buffer(arr);
            }

            return arr;
        },
    }
};

export const TypeStruct = function(baseType, fields, id) {
    return {
        write(writer, val) {
            if (id) {
                writer.writeUint8(id);
            }
            fields.forEach(field => {
                writeObject(writer, val[field.name], field.type);
            });
        },
        read(reader) {
            if (id) {
                const typeId = reader.readUint8() || undefined;
                if (typeId !== id) {
                    throw 'expecting different type id';
                }
            }

            const obj = Object.create(baseType.prototype);
            fields.forEach(field => {
                obj[field.name] = readObject(reader, field.type);
            });

            return obj;
        },
    }
};

const typeRegistry = new Map();

function normField(field) {
    if (typeof field == 'string') {
        return { name: field };
    }

    if (Array.isArray(field)) {
        return { name: field[0], type: field[1] };
    }

    return field;
}

export function registerType(baseType, fields, id) {
    typeRegistry.set(baseType, TypeStruct(baseType, fields.map(normField), id));
}

function findTypeEntry(obj) {
    for (let [type, entry] of typeRegistry) {
        if (obj instanceof type) {
            return entry;
        }
    }

    throw 'no entry found';
}

function findTypeEntryById(id) {
    for (let [type, entry] of typeRegistry) {
        if (type.id === id) {
            return entry;
        }
    }

    throw 'no entry found';
}

function detType(obj) {
    const type = {
        'undefined': TypeNull,
        'string': TypeString,
        'boolean': TypeBoolean,
        'number': TypeInteger,
    }[typeof obj];

    if (type) {
        return type;
    }

    if (Array.isArray(obj)) {
        return TypeVarArray();
    }

    if (obj instanceof Buffer) {
        return TypeVarArray(TypeByte);
    }

    if (obj instanceof Uint8Array) {
        return TypeArray(TypeByte);
    }

    return findTypeEntry(obj);
}

export function writeObject(writer, obj, typeHint) {
    const type = typeHint || detType(obj);
    type.write(writer, obj);
    return writer;
}

export function readObject(reader, type) {
    type = typeRegistry.get(type) || type;
    return type.read(reader);
}
