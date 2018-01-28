import wire from './js-wire';

const unexportedType = 0x00;

const typeRegistry = {};

export function registerType(type, fields, id = unexportedType) {
    typeRegistrar[type] = {'id': id, 'fields': fields};
}

function findTypeEntry(obj) {
    for (type in typeRegistry) {
        if (obj instanceof type) {
            return typeRegistrar[type];
        }
    }

    throw 'no entry found';
}

function writeBytes(writer, bytes) {
    writer.writeUvarint(bytes.length);
    for (var i = 0; i < bytes.length; i++) {
        writer.writeUint8(bytes[i]);
    }
}

function writeNull(writer) {
    writer.writeUint8(0);
}

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
        case 'object':
            if (obj instanceof Buffer) {
                writeBytes(writer, obj);
            } else {
                const entry = findTypeEntry(obj);
                writeType(writer, entry.id);
                entry.fields.forEach(field => {
                    writeObject(writer, obj[field]);
                });
            }
            break;
        default:
            throw 'unknown obj type';
    }
}

exports.Reader = wire.Reader;
exports.Writer = wire.Writer;
