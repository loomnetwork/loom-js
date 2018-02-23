export { Reader, Writer } from './js-wire';

const unexportedType = 0x00;

const typeRegistry = new Map();

export function registerType(type, fields, id) {
    typeRegistry.set(type, {'id': id, 'fields': fields});
}

function findTypeEntry(obj) {
    for (let [type, entry] of typeRegistry) {
        if (obj instanceof type) {
            return entry;
        }
    }

    throw 'no entry found';
}

function writeBytes(writer, bytes) {
    for (var i = 0; i < bytes.length; i++) {
        writer.writeUint8(bytes[i]);
    }
}

function writeNull(writer) {
    writer.writeUint8(0);
}1

function writeType(writer, type) {
    writer.writeUint8(type);
}

export function writeObject(writer, obj) {
    switch(typeof obj) {
        case 'undefined':
            writeNull(writer);
            break;
        case 'string':
            writer.writeString(obj);
            break;
        case 'boolean':
            obj ? writer.writeUint8(1) : writer.writeUint8(0);
            break;
        case 'object':
            if (Array.isArray(obj)) {
                writer.writeUvarint(obj.length);
                obj.forEach(val => {
                    writeObject(writer, val);
                })
            } else if (obj instanceof Buffer) {
                writer.writeUvarint(obj.length);
                writeBytes(writer, obj);
            } else if (obj instanceof Uint8Array) {
                writeBytes(writer, obj);
            } else {
                const entry = findTypeEntry(obj);
                if (entry.id !== unexportedType) {
                    writeType(writer, entry.id);
                }
                entry.fields.forEach(field => {
                    writeObject(writer, obj[field]);
                });
            }
            break;
        default:
            throw 'unknown obj type';
    }

    return writer;
}
