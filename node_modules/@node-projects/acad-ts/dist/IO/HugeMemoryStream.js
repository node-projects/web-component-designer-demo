export class HugeMemoryStream {
    static _maxChunkSize = 1048576 * 1024;
    static _maxChunkShift = 30;
    static _maxChunkMask = (1048576 * 1024) - 1;
    _currentChunk;
    _currentInChunk = 0;
    _length;
    _position = 0;
    _chunks;
    static create(length) {
        if (length <= 0x7FFFFFFF) {
            return new Uint8Array(length);
        }
        else {
            return new HugeMemoryStream(length);
        }
    }
    constructor(arg) {
        if (typeof arg === 'number') {
            const length = arg;
            this._length = length;
            this._position = 0;
            this._chunks = [];
            let lengthLeft = length;
            while (lengthLeft > 0) {
                const chunkSize = Math.min(lengthLeft, HugeMemoryStream._maxChunkSize);
                this._chunks.push(new Uint8Array(chunkSize));
                lengthLeft -= chunkSize;
            }
            this.position = 0;
        }
        else {
            this._chunks = arg;
            this._length = arg.reduce((sum, x) => sum + x.length, 0);
            this.position = 0;
        }
    }
    get canRead() { return true; }
    get canSeek() { return true; }
    get canWrite() { return true; }
    get length() { return this._length; }
    get position() { return this._position; }
    set position(value) {
        this._position = value;
        this._currentChunk = this._chunks[value >> HugeMemoryStream._maxChunkShift];
        this._currentInChunk = value & HugeMemoryStream._maxChunkMask;
    }
    read(buffer, offset, count) {
        if (count === 1) {
            buffer[offset] = this._currentChunk[this._currentInChunk];
            this.position++;
            return 1;
        }
        if (this._currentInChunk + count > HugeMemoryStream._maxChunkSize) {
            const toRead = HugeMemoryStream._maxChunkSize - this._currentInChunk;
            buffer.set(this._currentChunk.subarray(this._currentInChunk, this._currentInChunk + toRead), offset);
            this.position += toRead;
            return toRead + this.read(buffer, offset + toRead, count - toRead);
        }
        else {
            buffer.set(this._currentChunk.subarray(this._currentInChunk, this._currentInChunk + count), offset);
            this.position += count;
            return count;
        }
    }
    readByte() {
        const value = this._currentChunk[this._currentInChunk];
        this.position++;
        return value;
    }
    write(buffer, offset, count) {
        if (count === 1) {
            this._currentChunk[this._currentInChunk] = buffer[offset];
            this.position++;
            return;
        }
        if (this._currentInChunk + count > HugeMemoryStream._maxChunkSize) {
            const toWrite = HugeMemoryStream._maxChunkSize - this._currentInChunk;
            this._currentChunk.set(buffer.subarray(offset, offset + toWrite), this._currentInChunk);
            this.position += toWrite;
            this.write(buffer, offset + toWrite, count - toWrite);
        }
        else {
            this._currentChunk.set(buffer.subarray(offset, offset + count), this._currentInChunk);
            this.position += count;
        }
    }
    writeByte(value) {
        this._currentChunk[this._currentInChunk] = value;
        this.position++;
    }
    clone() {
        return new HugeMemoryStream(this._chunks);
    }
    static cloneStream(stream) {
        if (stream instanceof HugeMemoryStream) {
            return stream.clone();
        }
        else if (stream instanceof Uint8Array) {
            return new Uint8Array(stream);
        }
        else {
            throw new Error('The provided stream type is not supported for cloning.');
        }
    }
}
//# sourceMappingURL=HugeMemoryStream.js.map