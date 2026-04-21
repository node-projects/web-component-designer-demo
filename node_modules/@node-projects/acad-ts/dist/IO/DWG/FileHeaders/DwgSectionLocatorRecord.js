export class DwgSectionLocatorRecord {
    number = null;
    seeker = 0;
    size = 0;
    stream = null;
    constructor(number, seeker, size) {
        if (number !== undefined) {
            this.number = number ?? null;
        }
        if (seeker !== undefined) {
            this.seeker = seeker;
        }
        if (size !== undefined) {
            this.size = size;
        }
    }
    isInTheRecord(position) {
        return position >= this.seeker && position < this.seeker + this.size;
    }
    toString() {
        return `Number : ${this.number} | Seeker : ${this.seeker} | Size : ${this.size}`;
    }
}
//# sourceMappingURL=DwgSectionLocatorRecord.js.map