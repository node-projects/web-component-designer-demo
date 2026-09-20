//#region src/Internals/Helpers.ts
function bulge(fillet) {
	const b = Math.sqrt(Math.pow(fillet, 2) + Math.pow(fillet, 2)) / 2;
	return -(fillet - Math.sqrt(Math.pow(fillet, 2) - Math.pow(b, 2))) / b;
}
/**
* @param x The X coordinate of the point.
* @param y The Y coordinate of the point.
* @param z The Z coordinate of the point. By default 0.
* @returns The vec3_t point.
*/
function point3d(x, y, z) {
	return {
		x: x ?? 0,
		y: y ?? 0,
		z: z ?? 0
	};
}
/**
* @param x The X coordinate of the point.
* @param y The Y coordinate of the point.
* @returns The vec2_t point.
*/
function point2d(x, y) {
	return {
		x: x ?? 0,
		y: y ?? 0
	};
}
function rad2deg(v) {
	return v * 180 / Math.PI;
}
function deg2rad(v) {
	return v * Math.PI / 180;
}
//#endregion
//#region src/Internals/Handle.ts
var Handle = class Handle {
	static {
		this.seed = 0;
	}
	static next() {
		return (++Handle.seed).toString(16).toUpperCase();
	}
	static peek() {
		return (Handle.seed + 1).toString(16).toUpperCase();
	}
	static clear() {
		Handle.seed = 0;
	}
};
//#endregion
//#region src/Sections/BlocksSection/DxfEndBlk.ts
var DxfEndBlk = class {
	constructor() {
		this.handle = Handle.next();
	}
	dxfy(dx) {
		dx.type("ENDBLK");
		dx.handle(this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker("AcDbEntity");
		dx.layerName("0");
		dx.subclassMarker("AcDbBlockEnd");
	}
};
//#endregion
//#region src/Internals/BoundingBox.ts
const createBoundingBox = (tl, br) => {
	return {
		tl,
		br
	};
};
var BoundingBox = class BoundingBox {
	static centerRadiusBBox(center, radius) {
		return createBoundingBox(point3d(center.x - radius, center.y + radius), point3d(center.x + radius, center.y - radius));
	}
	static pointBBox(point) {
		return createBoundingBox(point3d(point.x - 100, point.y + 100), point3d(point.x + 100, point.y - 100));
	}
	/**
	* @param sp The start point.
	* @param ep The end point.
	* @returns
	*/
	static lineBBox(sp, ep) {
		const maxX = sp.x > ep.x ? sp.x : ep.x;
		const minX = sp.x < ep.x ? sp.x : ep.x;
		const maxY = sp.y > ep.y ? sp.y : ep.y;
		const minY = sp.y < ep.y ? sp.y : ep.y;
		const maxZ = sp.z > ep.z ? sp.z : ep.z;
		const minZ = sp.z < ep.z ? sp.z : ep.z;
		return createBoundingBox(point3d(minX, maxY, minZ), point3d(maxX, minY, maxZ));
	}
	static verticesBBox(vertices) {
		let _xMax = -Infinity;
		let _yMax = -Infinity;
		let _xMin = Infinity;
		let _yMin = Infinity;
		for (let i = 0; i < vertices.length; i++) {
			const { x, y } = vertices[i];
			if (_xMax < x) _xMax = x;
			if (_yMax < y) _yMax = y;
			if (_xMin > x) _xMin = x;
			if (_yMin > y) _yMin = y;
		}
		return createBoundingBox(point3d(_xMin, _yMax), point3d(_xMax, _yMin));
	}
	static boundingBox(boundingBoxes) {
		if (boundingBoxes.length === 0) return BoundingBox.pointBBox(point3d());
		const _vertices = [];
		for (let i = 0; i < boundingBoxes.length; i++) {
			const _bbox = boundingBoxes[i];
			_vertices.push(_bbox.tl, _bbox.br);
		}
		return BoundingBox.verticesBBox(_vertices);
	}
	static boundingBoxCenter(boundingBox) {
		return point3d(boundingBox.tl.x + (boundingBox.br.x - boundingBox.tl.x) / 2, boundingBox.br.y + (boundingBox.tl.y - boundingBox.br.y) / 2, 0);
	}
	static boundingBoxHeight(boundingBox) {
		return boundingBox.tl.y - boundingBox.br.y;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfRecord.ts
let LayerFlags = /* @__PURE__ */ function(LayerFlags) {
	LayerFlags[LayerFlags["None"] = 0] = "None";
	LayerFlags[LayerFlags["Frozen"] = 1] = "Frozen";
	LayerFlags[LayerFlags["FrozenInNewViewports"] = 2] = "FrozenInNewViewports";
	LayerFlags[LayerFlags["Locked"] = 4] = "Locked";
	LayerFlags[LayerFlags["XRefDependent"] = 16] = "XRefDependent";
	LayerFlags[LayerFlags["XRefResolved"] = 32] = "XRefResolved";
	return LayerFlags;
}({});
let StyleFlags = /* @__PURE__ */ function(StyleFlags) {
	StyleFlags[StyleFlags["None"] = 0] = "None";
	StyleFlags[StyleFlags["DescribeShape"] = 1] = "DescribeShape";
	StyleFlags[StyleFlags["VerticalText"] = 4] = "VerticalText";
	StyleFlags[StyleFlags["XRefDependent"] = 16] = "XRefDependent";
	StyleFlags[StyleFlags["XRefResolved"] = 32] = "XRefResolved";
	return StyleFlags;
}({});
let ViewFlags = /* @__PURE__ */ function(ViewFlags) {
	ViewFlags[ViewFlags["None"] = 0] = "None";
	ViewFlags[ViewFlags["PaperSpace"] = 1] = "PaperSpace";
	ViewFlags[ViewFlags["XRefDependent"] = 16] = "XRefDependent";
	ViewFlags[ViewFlags["XRefResolved"] = 32] = "XRefResolved";
	return ViewFlags;
}({});
var DxfRecord = class {
	constructor(type) {
		this.type = type;
		this.handle = Handle.next();
	}
	dxfy(dx) {
		dx.type(this.type);
		dx.handle(this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker("AcDbSymbolTableRecord");
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfLayer.ts
var DxfLayer = class extends DxfRecord {
	static {
		this.layerZeroName = "0";
	}
	constructor(name, color, lineType, flags) {
		super("LAYER");
		this.name = name;
		this.colorNumber = color;
		this.lineType = lineType;
		this.flags = flags ?? 0;
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbLayerTableRecord");
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.colorNumber(this.colorNumber);
		dx.push(420, this.trueColor);
		dx.lineType(this.lineType);
		dx.push(370, 0);
		dx.push(390, 0);
		dx.push(347, this.materialObject);
	}
};
//#endregion
//#region src/Internals/Functions.ts
function tag(code, value) {
	return {
		code,
		value
	};
}
function stringByteSize(value) {
	return new Blob([value]).size;
}
function stringChunksSplit(value, length = 255) {
	const chunks = [];
	const tempChunk = [];
	for (let i = 0; i < value.length; i++) {
		const char = value[i];
		if (tempChunk.length === length || i === value.length - 1) {
			chunks.push(tempChunk.join(""));
			tempChunk.length = 0;
		} else tempChunk.push(char);
	}
	return chunks;
}
//#endregion
//#region src/Internals/ExtendedData.ts
var ExtendedData = class {
	#tags;
	constructor(name) {
		this.name = name;
		this.#tags = [];
	}
	clear() {
		this.#tags.length = 0;
	}
	string(string) {
		stringChunksSplit(string).forEach((chunk) => this.#tags.push(tag(1e3, chunk)));
	}
	beginList() {
		this.#tags.push(tag(1002, "{"));
	}
	endList() {
		this.#tags.push(tag(1002, "}"));
	}
	layerName(name) {
		this.#tags.push(tag(1003, name));
	}
	binaryData(data) {
		stringChunksSplit(data).forEach((chunk) => this.#tags.push(tag(1004, chunk)));
	}
	databaseHandle(handle) {
		this.#tags.push(tag(1005, handle));
	}
	point(point) {
		this.#tags.push(tag(1010, point.x));
		this.#tags.push(tag(1020, point.y));
		this.#tags.push(tag(1030, point.z));
	}
	position(position) {
		this.#tags.push(tag(1011, position.x));
		this.#tags.push(tag(1021, position.y));
		this.#tags.push(tag(1031, position.z));
	}
	displacement(displacement) {
		this.#tags.push(tag(1012, displacement.x));
		this.#tags.push(tag(1022, displacement.y));
		this.#tags.push(tag(1032, displacement.z));
	}
	direction(direction) {
		this.#tags.push(tag(1013, direction.x));
		this.#tags.push(tag(1023, direction.y));
		this.#tags.push(tag(1033, direction.z));
	}
	real(real) {
		this.#tags.push(tag(1040, real));
	}
	distance(distance) {
		this.#tags.push(tag(1041, distance));
	}
	scale(scale) {
		this.#tags.push(tag(1042, scale));
	}
	integer(integer) {
		this.#tags.push(tag(1070, integer));
	}
	long(long) {
		this.#tags.push(tag(1071, long));
	}
	dxfy(dx) {
		dx.push(1001, this.name);
		dx.push(1002, "{");
		this.#tags.forEach((t) => dx.push(t.code, t.value));
		dx.push(1002, "}");
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entity.ts
var Entity = class {
	/**
	* Entity class is the base class of all enities.
	* @param type - The type of the entity example : LINE, POLYLINE, ....
	* @param subclassMarker - The subclass marker of the entity.
	* @param options - The common options of all entities.
	*/
	constructor(type, subclassMarker, options) {
		this.type = type;
		this.subclassMarker = subclassMarker;
		this.layerName = options?.layerName;
		this.handle = Handle.next();
		this.trueColor = options?.trueColor;
		this.inPaperSpace = false;
		this.colorNumber = options?.colorNumber;
		this.visible = options?.visible;
		this.lineType = options?.lineType;
		this.lineTypeScale = options?.lineTypeScale;
		this.extrusion = options?.extrusion;
		this.xdatas = [];
	}
	/**
	* Get the boundingBox of an entity.
	* @returns The boundingBox of an entity.
	*/
	boundingBox() {
		return BoundingBox.pointBBox(point3d());
	}
	addXData(name) {
		const xdata = new ExtendedData(name);
		this.xdatas.push(xdata);
		return xdata;
	}
	dxfy(dx) {
		dx.type(this.type);
		dx.handle(this.handle);
		dx.push(330, this.ownerBlockRecord);
		dx.subclassMarker("AcDbEntity");
		if (this.inPaperSpace) dx.push(67, Number(this.inPaperSpace));
		dx.push(420, this.trueColor);
		dx.layerName(this.layerName || DxfLayer.layerZeroName);
		dx.lineType(this.lineType);
		dx.colorNumber(this.colorNumber);
		dx.push(48, this.lineTypeScale);
		dx.visibilty(this.visible);
		dx.subclassMarker(this.subclassMarker);
		if (this.type !== "HATCH") {
			dx.push(210, this.extrusion?.x);
			dx.push(220, this.extrusion?.y);
			dx.push(230, this.extrusion?.z);
		}
		this.dxfyChild(dx);
		this.xdatas.forEach((xdata) => xdata.dxfy(dx));
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/Dimension.ts
let DimensionType = /* @__PURE__ */ function(DimensionType) {
	DimensionType[DimensionType["Default"] = 0] = "Default";
	DimensionType[DimensionType["Aligned"] = 1] = "Aligned";
	DimensionType[DimensionType["Angular"] = 2] = "Angular";
	DimensionType[DimensionType["Diameter"] = 3] = "Diameter";
	DimensionType[DimensionType["Radius"] = 4] = "Radius";
	DimensionType[DimensionType["Angular3Point"] = 5] = "Angular3Point";
	DimensionType[DimensionType["Ordinate"] = 6] = "Ordinate";
	DimensionType[DimensionType["ReferencedByThis"] = 32] = "ReferencedByThis";
	DimensionType[DimensionType["OrdinateType"] = 64] = "OrdinateType";
	return DimensionType;
}({});
let AttachmentPoint = /* @__PURE__ */ function(AttachmentPoint) {
	AttachmentPoint[AttachmentPoint["TopLeft"] = 1] = "TopLeft";
	AttachmentPoint[AttachmentPoint["TopCenter"] = 2] = "TopCenter";
	AttachmentPoint[AttachmentPoint["TopRight"] = 3] = "TopRight";
	AttachmentPoint[AttachmentPoint["MiddleLeft"] = 4] = "MiddleLeft";
	AttachmentPoint[AttachmentPoint["MiddleCenter"] = 5] = "MiddleCenter";
	AttachmentPoint[AttachmentPoint["MiddleRight"] = 6] = "MiddleRight";
	AttachmentPoint[AttachmentPoint["BottomLeft"] = 7] = "BottomLeft";
	AttachmentPoint[AttachmentPoint["BottomCenter"] = 8] = "BottomCenter";
	AttachmentPoint[AttachmentPoint["BottomRight"] = 9] = "BottomRight";
	return AttachmentPoint;
}({});
let TextLineSpacingStyle = /* @__PURE__ */ function(TextLineSpacingStyle) {
	TextLineSpacingStyle[TextLineSpacingStyle["AtLeast"] = 1] = "AtLeast";
	TextLineSpacingStyle[TextLineSpacingStyle["Exact"] = 2] = "Exact";
	return TextLineSpacingStyle;
}({});
var Dimension = class extends Entity {
	constructor(options) {
		super("DIMENSION", "AcDbDimension", options);
		this.blockName = options?.blockName;
		this.definitionPoint = options?.definitionPoint;
		this.middlePoint = options?.middlePoint;
		this.dimensionType = 0;
		this.attachmentPoint = options?.attachmentPoint || 5;
		this.textLineSpacingStyle = options?.textLineSpacingStyle;
		this.textLineSpacingFactor = options?.textLineSpacingFactor;
		this.ActualMeasurement = options?.ActualMeasurement;
		this.text = options?.text;
		this.rotation = options?.rotation;
		this.horizontalDirection = options?.horizontalDirection;
		this.styleName = options?.styleName;
	}
	dxfyChild(dx) {
		dx.push(2, this.blockName);
		dx.point3d(this.definitionPoint);
		dx.point3d(this.middlePoint, 1);
		dx.push(70, this.dimensionType);
		dx.push(71, this.attachmentPoint);
		dx.push(72, this.textLineSpacingStyle);
		dx.push(41, this.textLineSpacingFactor);
		dx.push(42, this.ActualMeasurement);
		dx.push(1, this.text);
		dx.push(53, this.rotation === "auto" ? this.rotate() : this.rotation);
		dx.push(51, this.horizontalDirection);
		dx.push(3, this.styleName);
	}
};
//#endregion
//#region src/Internals/Utils.ts
const specialCharsRegex = /[<>/\\":;?*|=`]/g;
function d(f, s) {
	return Math.sqrt(Math.pow(f.x - s.x, 2) + Math.pow(f.y - s.y, 2));
}
function rad2deg$1(v) {
	return v * 180 / Math.PI;
}
function deg2rad$1(v) {
	return v * Math.PI / 180;
}
function angle(f, s) {
	const _d = d(f, s);
	if (_d === 0) return _d;
	return rad2deg$1(Math.asin(Math.abs(f.y - s.y) / _d));
}
function b(d, ab) {
	const [a, b] = ab;
	return b - d * Math.sqrt(a * a + 1);
}
function ab(f, s) {
	const deltaX = f.x - s.x;
	let a = 0;
	if (deltaX !== 0) a = (f.y - s.y) / deltaX;
	const b = f.y - a * f.x;
	return [a, b];
}
function xy(ab, p) {
	const [a, b] = ab;
	const a2 = a ?? -1 / a;
	const b2 = p.y - a2 * p.x;
	const deltaA = a2 - a;
	let x = b - b2;
	if (deltaA !== 0) x = (b - b2) / deltaA;
	const y = a * x + b;
	return point3d(x, y, p.z);
}
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/AlignedDimension.ts
var AlignedDimension = class extends Dimension {
	constructor(first, second, options) {
		super(options);
		this.dimensionType = 1;
		this.insertionPoint = options?.insertionPoint;
		this.fisrtPoint = first;
		this.secondPoint = second;
		this.offset(options?.offset);
	}
	offset(v) {
		if (v == null) return;
		const [a_, b_] = ab(this.fisrtPoint, this.secondPoint);
		const _b = b(v, [a_, b_]);
		this.definitionPoint = xy([a_, _b], this.fisrtPoint);
	}
	rotate() {
		return angle(this.fisrtPoint, this.secondPoint);
	}
	dxfyChild(dx) {
		super.dxfyChild(dx);
		dx.subclassMarker("AcDbAlignedDimension");
		dx.point3d(this.insertionPoint, 2);
		dx.point3d(this.fisrtPoint, 3);
		dx.point3d(this.secondPoint, 4);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/AngularDimLines.ts
var AngularDimLines = class extends Dimension {
	constructor(first, second, location, options) {
		super(options);
		this.first = first;
		this.second = second;
		this.location = location;
		this.dimensionType = 2;
	}
	rotate() {
		return 0;
	}
	_update() {
		this.definitionPoint = this.second.end;
	}
	dxfyChild(dx) {
		this._update();
		super.dxfyChild(dx);
		dx.subclassMarker("AcDb2LineAngularDimension");
		dx.point3d(this.first.start, 3);
		dx.point3d(this.first.end, 4);
		dx.point3d(this.second.start, 5);
		dx.point3d(this.location, 6);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/AngularDimPoints.ts
var AngularDimPoints = class extends Dimension {
	constructor(center, first, second, options) {
		super(options);
		this.center = center;
		this.first = first;
		this.second = second;
		this.dimensionType = 5;
	}
	rotate() {
		return 0;
	}
	dxfyChild(dx) {
		super.dxfyChild(dx);
		dx.subclassMarker("AcDb3PointAngularDimension");
		dx.point3d(this.first, 3);
		dx.point3d(this.second, 4);
		dx.point3d(this.center, 5);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/ArcDimension.ts
var ArcDimension = class extends Dimension {
	constructor(center, startPoint, endPoint, options) {
		super(options);
		this.type = "ARC_DIMENSION";
		this.center = center;
		this.startPoint = startPoint;
		this.endPoint = endPoint;
		this.startAngle = 0;
		this.endAngle = 0;
		this.isPartial = 0;
		this.hasLeader = 0;
	}
	rotate() {
		return 0;
	}
	dxfyChild(dx) {
		super.dxfyChild(dx);
		dx.subclassMarker("AcDbArcDimension");
		dx.point3d(this.startPoint, 3);
		dx.point3d(this.endPoint, 4);
		dx.point3d(this.center, 5);
		dx.push(40, this.startAngle);
		dx.push(41, this.endAngle);
		dx.push(70, this.isPartial);
		dx.push(71, this.hasLeader);
		dx.point3d(this.firstLeaderPoint, 6);
		dx.point3d(this.secondLeaderPoint, 7);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/DiameterDimension.ts
var DiameterDimension = class extends Dimension {
	constructor(first, second, options) {
		super(options);
		this.dimensionType = 3;
		this.first = first;
		this.definitionPoint = second;
		this.leaderLength = options?.leaderLength;
	}
	rotate() {
		return 0;
	}
	dxfyChild(dx) {
		super.dxfyChild(dx);
		dx.subclassMarker("AcDbDiametricDimension");
		dx.point3d(this.first, 5);
		dx.push(40, this.leaderLength);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/LinearDimension.ts
var LinearDimension = class extends Dimension {
	constructor(first, second, options) {
		super(options);
		this.dimensionType = 0;
		this.insertionPoint = options?.insertionPoint;
		this.fisrtPoint = first;
		this.secondPoint = second;
		this.angle = options?.angle ?? 0;
		this.linearType = options?.linearType;
		this.offset(options?.offset);
	}
	offset(v) {
		if (v == null) return;
		const radAngle = deg2rad$1(this.angle);
		const x = this.fisrtPoint.x + v * Math.floor(Math.sin(radAngle));
		const y = this.fisrtPoint.y + v * Math.floor(Math.cos(radAngle));
		this.definitionPoint = point3d(x, y, 0);
	}
	rotate() {
		return this.angle;
	}
	dxfyChild(dx) {
		super.dxfyChild(dx);
		dx.subclassMarker("AcDbAlignedDimension");
		dx.point3d(this.insertionPoint, 2);
		dx.point3d(this.fisrtPoint, 3);
		dx.point3d(this.secondPoint, 4);
		dx.push(50, this.angle);
		dx.push(52, this.linearType);
		dx.subclassMarker("AcDbRotatedDimension");
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Dimension/RadialDimension.ts
var RadialDimension = class extends Dimension {
	constructor(first, second, options) {
		super(options);
		this.dimensionType = 4;
		this.first = first;
		this.definitionPoint = second;
		this.leaderLength = options?.leaderLength;
	}
	rotate() {
		return 0;
	}
	dxfyChild(dx) {
		super.dxfyChild(dx);
		dx.subclassMarker("AcDbRadialDimension");
		dx.point3d(this.first, 5);
		dx.push(40, this.leaderLength);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Arc.ts
var Arc = class extends Entity {
	get start() {
		return point3d(this.center.x + this.radius * Math.cos(deg2rad$1(this.startAngle)), this.center.y + this.radius * Math.sin(deg2rad$1(this.startAngle)));
	}
	get end() {
		return point3d(this.center.x + this.radius * Math.cos(deg2rad$1(this.endAngle)), this.center.y + this.radius * Math.sin(deg2rad$1(this.endAngle)));
	}
	constructor(center, radius, startAngle, endAngle, options) {
		super("ARC", "AcDbCircle", options);
		this.center = center;
		this.radius = radius;
		this.startAngle = startAngle;
		this.endAngle = endAngle;
	}
	boundingBox() {
		return BoundingBox.centerRadiusBBox(this.center, this.radius);
	}
	dxfyChild(dx) {
		dx.point3d(this.center);
		dx.push(40, this.radius);
		dx.subclassMarker("AcDbArc");
		dx.push(50, this.startAngle);
		dx.push(51, this.endAngle);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Attdef.ts
var Attdef = class extends Entity {
	constructor(firstAlignmentPoint, height, tag, value, options) {
		super("ATTDEF", "AcDbText", options);
		this.position = firstAlignmentPoint;
		this.height = height;
		this.value = value;
		this.tag = tag;
		this.textStyle = "STANDARD";
		this.rotation = options?.rotation;
		this.obliqueAngle = options?.obliqueAngle;
		this.generationFlags = options?.generationFlags;
		this.horizontalAlignment = options?.horizontalAlignment;
		this.verticalAlignment = options?.verticalAlignment;
		this.secondAlignmentPoint = options?.secondAlignmentPoint;
		this.relativeXScaleFactor = options?.relativeXScaleFactor;
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.position);
	}
	dxfyChild(dx) {
		dx.point3d(this.position);
		dx.push(40, this.height);
		dx.primaryText(this.value);
		dx.push(50, this.rotation);
		dx.push(41, this.relativeXScaleFactor);
		dx.push(51, this.obliqueAngle);
		dx.textStyle(this.textStyle);
		dx.push(71, this.generationFlags);
		dx.push(72, this.horizontalAlignment);
		if (this.secondAlignmentPoint) {
			dx.push(11, this.secondAlignmentPoint.x);
			dx.push(21, this.secondAlignmentPoint.y);
			dx.push(31, this.secondAlignmentPoint.z);
		}
		dx.push(73, this.verticalAlignment);
		dx.subclassMarker("AcDbAttributeDefinition");
		dx.push(280, 0);
		dx.push(3, "");
		dx.push(2, this.tag);
		dx.push(70, 0);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Attrib.ts
var Attrib = class extends Entity {
	constructor(firstAlignmentPoint, height, tag, value, options) {
		super("ATTRIB", "AcDbText", options);
		this.position = firstAlignmentPoint;
		this.height = height;
		this.value = value;
		this.tag = tag;
		this.textStyle = "STANDARD";
		this.rotation = options?.rotation;
		this.obliqueAngle = options?.obliqueAngle;
		this.generationFlags = options?.generationFlags;
		this.horizontalAlignment = options?.horizontalAlignment;
		this.verticalAlignment = options?.verticalAlignment;
		this.secondAlignmentPoint = options?.secondAlignmentPoint;
		this.relativeXScaleFactor = options?.relativeXScaleFactor;
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.position);
	}
	dxfyChild(dx) {
		dx.point3d(this.position);
		dx.push(40, this.height);
		dx.primaryText(this.value);
		dx.push(50, this.rotation);
		dx.push(41, this.relativeXScaleFactor);
		dx.push(51, this.obliqueAngle);
		dx.textStyle(this.textStyle);
		dx.push(71, this.generationFlags);
		dx.push(72, this.horizontalAlignment);
		dx.point3d(this.secondAlignmentPoint, 1);
		dx.push(73, this.verticalAlignment);
		dx.subclassMarker("AcDbAttribute");
		dx.push(280, 0);
		dx.push(2, this.tag);
		dx.push(70, 0);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Circle.ts
var Circle = class extends Entity {
	constructor(center, radius, options) {
		super("CIRCLE", "AcDbCircle", options);
		this.center = center;
		this.radius = radius;
	}
	boundingBox() {
		return BoundingBox.centerRadiusBBox(this.center, this.radius);
	}
	dxfyChild(dx) {
		dx.point3d(this.center);
		dx.push(40, this.radius);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Ellipse.ts
var Ellipse = class extends Entity {
	constructor(center, endPointOfMajorAxis, ratioOfMinorAxisToMajorAxis, startParameter, endParameter, options) {
		super("ELLIPSE", "AcDbEllipse", options);
		this.center = center;
		this.endPointOfMajorAxis = endPointOfMajorAxis;
		this.ratioOfMinorAxisToMajorAxis = ratioOfMinorAxisToMajorAxis;
		this.startParameter = startParameter;
		this.endParameter = endParameter;
	}
	boundingBox() {
		const x = this.center.x;
		const y = this.center.y;
		const xEndPointOfMajorAxis = this.endPointOfMajorAxis.x;
		const yEndPointOfMajorAxis = this.endPointOfMajorAxis.y;
		const bigRadius = Math.sqrt(Math.pow(x - (x + xEndPointOfMajorAxis), 2) + Math.pow(y - (y + yEndPointOfMajorAxis), 2));
		return BoundingBox.centerRadiusBBox(this.center, bigRadius);
	}
	dxfyChild(dx) {
		dx.point3d(this.center);
		dx.point3d(this.endPointOfMajorAxis, 1);
		dx.push(40, this.ratioOfMinorAxisToMajorAxis);
		dx.push(41, this.startParameter);
		dx.push(42, this.endParameter);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Face.ts
let InvisibleEdgeFlags = /* @__PURE__ */ function(InvisibleEdgeFlags) {
	InvisibleEdgeFlags[InvisibleEdgeFlags["None"] = 0] = "None";
	InvisibleEdgeFlags[InvisibleEdgeFlags["First"] = 1] = "First";
	InvisibleEdgeFlags[InvisibleEdgeFlags["Second"] = 2] = "Second";
	InvisibleEdgeFlags[InvisibleEdgeFlags["Third"] = 4] = "Third";
	InvisibleEdgeFlags[InvisibleEdgeFlags["Fourth"] = 8] = "Fourth";
	return InvisibleEdgeFlags;
}({});
var Face = class extends Entity {
	constructor(firstCorner, secondCorner, thirdCorner, fourthCorner, options) {
		super("3DFACE", "AcDbFace", options);
		this.firstCorner = firstCorner;
		this.secondCorner = secondCorner;
		this.thirdCorner = thirdCorner;
		this.fourthCorner = fourthCorner;
		this.invisibleEdges = options?.invisibleEdges || 0;
	}
	setFirstEdgeVisible(visible) {
		this.setEdgeVisible(1, visible);
	}
	setSecondEdgeVisible(visible) {
		this.setEdgeVisible(2, visible);
	}
	setThirdEdgeVisible(visible) {
		this.setEdgeVisible(4, visible);
	}
	setFourthEdgeVisible(visible) {
		this.setEdgeVisible(8, visible);
	}
	setEdgesVisible(visible) {
		if (visible) this.invisibleEdges = 0;
		else this.invisibleEdges = 15;
	}
	setEdgeVisible(flag, visible) {
		if (visible) this.invisibleEdges |= flag;
		else if (this.invisibleEdges === (this.invisibleEdges | flag)) this.invisibleEdges ^= flag;
	}
	boundingBox() {
		return BoundingBox.verticesBBox([
			this.firstCorner,
			this.secondCorner,
			this.thirdCorner,
			this.fourthCorner
		]);
	}
	dxfyChild(dx) {
		dx.point3d(this.firstCorner);
		dx.point3d(this.secondCorner, 1);
		dx.point3d(this.thirdCorner, 2);
		dx.point3d(this.fourthCorner, 3);
		dx.push(70, this.invisibleEdges);
	}
};
//#endregion
//#region src/Internals/HatchPatterns.ts
var HatchPattern = class {
	set angle(angle) {
		this.patternsData.forEach((p) => p.lineAngle = angle);
	}
	constructor(name) {
		this.name = name;
		this.patternsData = [];
		this.scale = 1;
	}
	dxfy(dx) {
		dx.push(78, this.patternsData.length);
		for (const p of this.patternsData) {
			dx.push(53, p.lineAngle);
			dx.push(43, p.x);
			dx.push(44, p.y);
			dx.push(45, p.offsetX * this.scale);
			dx.push(46, p.offsetY * this.scale);
			dx.push(79, p.dashLengthItems.length);
			for (const d of p.dashLengthItems) dx.push(49, d * this.scale);
		}
	}
	add(patternData) {
		this.patternsData.push(patternData);
	}
};
const PredefinedHatchPatterns = /* @__PURE__ */ new Map();
const ANGLE = new HatchPattern("ANGLE");
ANGLE.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: .275,
	offsetY: .2,
	dashLengthItems: [-.075]
});
ANGLE.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: .275,
	offsetY: .2,
	dashLengthItems: [-.075]
});
PredefinedHatchPatterns.set("ANGLE", ANGLE);
const ANSI31 = new HatchPattern("ANSI31");
ANSI31.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 1.25,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("ANSI31", ANSI31);
const ANSI32 = new HatchPattern("ANSI32");
ANSI32.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("ANSI32", ANSI32);
const ANSI33 = new HatchPattern("ANSI33");
ANSI33.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 9.525,
	dashLengthItems: []
});
ANSI33.add({
	lineAngle: 45,
	x: 4.49013,
	y: 0,
	offsetX: 0,
	offsetY: 9.525,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("ANSI33", ANSI33);
const ANSI34 = new HatchPattern("ANSI34");
ANSI34.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
ANSI34.add({
	lineAngle: 45,
	x: 4.49013,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: [3.175, -1.5875]
});
PredefinedHatchPatterns.set("ANSI34", ANSI34);
const ANSI35 = new HatchPattern("ANSI35");
ANSI35.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 19.05,
	dashLengthItems: []
});
ANSI35.add({
	lineAngle: 45,
	x: 4.49013,
	y: 0,
	offsetX: 0,
	offsetY: 19.05,
	dashLengthItems: []
});
ANSI35.add({
	lineAngle: 45,
	x: 8.98026,
	y: 0,
	offsetX: 0,
	offsetY: 19.05,
	dashLengthItems: []
});
ANSI35.add({
	lineAngle: 45,
	x: 13.4704,
	y: 0,
	offsetX: 0,
	offsetY: 19.05,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("ANSI35", ANSI35);
const ANSI36 = new HatchPattern("ANSI36");
ANSI36.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
ANSI36.add({
	lineAngle: 45,
	x: 4.49013,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: [
		7.9375,
		-1.5875,
		0,
		-1.5875
	]
});
PredefinedHatchPatterns.set("ANSI36", ANSI36);
const ANSI37 = new HatchPattern("ANSI37");
ANSI37.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 5.55625,
	offsetY: 3.175,
	dashLengthItems: [
		7.9375,
		-1.5875,
		0,
		-1.5875
	]
});
PredefinedHatchPatterns.set("ANSI37", ANSI37);
const ANSI38 = new HatchPattern("ANSI38");
ANSI38.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
ANSI38.add({
	lineAngle: 135,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("ANSI38", ANSI38);
const AR_B816 = new HatchPattern("AR_B816");
AR_B816.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
AR_B816.add({
	lineAngle: 135,
	x: 0,
	y: 0,
	offsetX: 6.35,
	offsetY: 3.175,
	dashLengthItems: [7.9375, -4.7625]
});
PredefinedHatchPatterns.set("AR_B816", AR_B816);
const AR_B816C = new HatchPattern("AR_B816C");
AR_B816C.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 203.2,
	dashLengthItems: []
});
AR_B816C.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 203.2,
	offsetY: 203.2,
	dashLengthItems: [203.2, -203.2]
});
PredefinedHatchPatterns.set("AR_B816C", AR_B816C);
const AR_B88 = new HatchPattern("AR_B88");
AR_B88.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 203.2,
	offsetY: 203.2,
	dashLengthItems: [396.875, -9.525]
});
AR_B88.add({
	lineAngle: 0,
	x: -203.2,
	y: 9.525,
	offsetX: 203.2,
	offsetY: 203.2,
	dashLengthItems: [396.875, -9.525]
});
AR_B88.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 203.2,
	offsetY: 203.2,
	dashLengthItems: [-212.725, 193.675]
});
AR_B88.add({
	lineAngle: 90,
	x: -9.525,
	y: 0,
	offsetX: 203.2,
	offsetY: 203.2,
	dashLengthItems: [-212.725, 193.675]
});
PredefinedHatchPatterns.set("AR_B88", AR_B88);
const AR_BRELM = new HatchPattern("AR_BRELM");
AR_BRELM.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 203.2,
	dashLengthItems: []
});
AR_BRELM.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 203.2,
	offsetY: 101.6,
	dashLengthItems: [203.2, -203.2]
});
PredefinedHatchPatterns.set("AR_BRELM", AR_BRELM);
const AR_BRSTD = new HatchPattern("AR_BRSTD");
AR_BRSTD.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 135.484,
	dashLengthItems: [193.675, -9.525]
});
AR_BRSTD.add({
	lineAngle: 0,
	x: 0,
	y: 57.15,
	offsetX: 0,
	offsetY: 135.484,
	dashLengthItems: [193.675, -9.525]
});
AR_BRSTD.add({
	lineAngle: 0,
	x: 50.8,
	y: 67.7418,
	offsetX: 0,
	offsetY: 135.484,
	dashLengthItems: [92.075, -9.525]
});
AR_BRSTD.add({
	lineAngle: 0,
	x: 50.8,
	y: 124.892,
	offsetX: 0,
	offsetY: 135.484,
	dashLengthItems: [92.075, -9.525]
});
AR_BRSTD.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 203.2,
	dashLengthItems: [57.15, -78.334]
});
AR_BRSTD.add({
	lineAngle: 90,
	x: -9.525,
	y: 0,
	offsetX: 0,
	offsetY: 203.2,
	dashLengthItems: [57.15, -78.334]
});
AR_BRSTD.add({
	lineAngle: 90,
	x: 50.8,
	y: 67.7418,
	offsetX: 0,
	offsetY: 101.6,
	dashLengthItems: [57.15, -78.334]
});
AR_BRSTD.add({
	lineAngle: 90,
	x: 41.275,
	y: 67.7418,
	offsetX: 0,
	offsetY: 101.6,
	dashLengthItems: [57.15, -78.334]
});
PredefinedHatchPatterns.set("AR_BRSTD", AR_BRSTD);
const AR_CONC = new HatchPattern("AR_CONC");
AR_CONC.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 67.7418,
	dashLengthItems: []
});
AR_CONC.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 67.7418,
	offsetY: 101.6,
	dashLengthItems: [67.7418, -67.7418]
});
PredefinedHatchPatterns.set("AR_CONC", AR_CONC);
const AR_HBONE = new HatchPattern("AR_HBONE");
AR_HBONE.add({
	lineAngle: 50,
	x: 0,
	y: 0,
	offsetX: 104.896,
	offsetY: -149.807,
	dashLengthItems: [19.05, -209.55]
});
AR_HBONE.add({
	lineAngle: 355,
	x: 0,
	y: 0,
	offsetX: -51.76101082,
	offsetY: 187.25814969,
	dashLengthItems: [15.24, -167.64058417]
});
AR_HBONE.add({
	lineAngle: 100.4514447,
	x: 15.182007,
	y: -1.3282535,
	offsetX: 145.5569059,
	offsetY: -176.270089,
	dashLengthItems: [16.1900088, -178.0902446]
});
AR_HBONE.add({
	lineAngle: 46.1842,
	x: 0,
	y: 50.8,
	offsetX: 157.343,
	offsetY: -224.71,
	dashLengthItems: [28.575, -314.325]
});
AR_HBONE.add({
	lineAngle: 96.63555761,
	x: 22.5899,
	y: 47.2965,
	offsetX: 218.33577212,
	offsetY: -264.40480444,
	dashLengthItems: [24.28502314, -267.13560816]
});
AR_HBONE.add({
	lineAngle: 351.18415117,
	x: 0,
	y: 50.8,
	offsetX: 196.67912063,
	offsetY: 280.88740361,
	dashLengthItems: [22.85996707, -251.45973192]
});
AR_HBONE.add({
	lineAngle: 21,
	x: 25.4,
	y: 38.1,
	offsetX: 104.89565868,
	offsetY: -149.80652586,
	dashLengthItems: [19.05, -209.55]
});
AR_HBONE.add({
	lineAngle: 326,
	x: 25.4,
	y: 38.1,
	offsetX: -51.7604,
	offsetY: 187.258,
	dashLengthItems: [15.24, -167.64]
});
AR_HBONE.add({
	lineAngle: 71.451445,
	x: 38.0345326,
	y: 29.5779001,
	offsetX: 145.5567546,
	offsetY: -176.2700748,
	dashLengthItems: [16.1900088, -178.0899376]
});
AR_HBONE.add({
	lineAngle: 37.5,
	x: 0,
	y: 0,
	offsetX: 53.9242,
	offsetY: 65.2018,
	dashLengthItems: [
		0,
		-165.608,
		0,
		-170.18,
		0,
		-168.275
	]
});
AR_HBONE.add({
	lineAngle: 7.5,
	x: 0,
	y: 0,
	offsetX: 79.3242,
	offsetY: 90.6018,
	dashLengthItems: [
		0,
		-97.028,
		0,
		-161.798,
		0,
		-64.135
	]
});
AR_HBONE.add({
	lineAngle: -32.5,
	x: -56.642,
	y: 0,
	offsetX: 117.434,
	offsetY: 68.0212,
	dashLengthItems: [
		0,
		-63.5,
		0,
		-198.12,
		0,
		-262.89
	]
});
AR_HBONE.add({
	lineAngle: -42.5,
	x: -82.042,
	y: 0,
	offsetX: 92.0344,
	offsetY: 118.821,
	dashLengthItems: [
		0,
		-82.55,
		0,
		-131.572,
		0,
		-186.69
	]
});
PredefinedHatchPatterns.set("AR_HBONE", AR_HBONE);
const AR_PARQ1 = new HatchPattern("AR_PARQ1");
AR_PARQ1.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 101.6,
	offsetY: 101.6,
	dashLengthItems: [304.8, -101.6]
});
AR_PARQ1.add({
	lineAngle: 135,
	x: 71.842,
	y: 71.842,
	offsetX: 101.6,
	offsetY: -101.6,
	dashLengthItems: [304.8, -101.6]
});
PredefinedHatchPatterns.set("AR_PARQ1", AR_PARQ1);
const AR_RROOF = new HatchPattern("AR_RROOF");
AR_RROOF.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 90,
	x: 50.8,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 90,
	x: 101.6,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 90,
	x: 152.4,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 90,
	x: 203.2,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 90,
	x: 254,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 90,
	x: 304.8,
	y: 0,
	offsetX: 304.8,
	offsetY: 304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 304.8,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 355.6,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 406.4,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 457.2,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 508,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 558.8,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
AR_RROOF.add({
	lineAngle: 0,
	x: 0,
	y: 609.6,
	offsetX: 304.8,
	offsetY: -304.8,
	dashLengthItems: [304.8, -304.8]
});
PredefinedHatchPatterns.set("AR_RROOF", AR_RROOF);
const AR_RSHKE = new HatchPattern("AR_RSHKE");
AR_RSHKE.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 55.88,
	offsetY: 25.4,
	dashLengthItems: [
		381,
		-50.8,
		127,
		-25.4
	]
});
AR_RSHKE.add({
	lineAngle: 0,
	x: 33.782,
	y: 12.7,
	offsetX: -25.4,
	offsetY: 33.782,
	dashLengthItems: [
		76.2,
		-8.382,
		152.4,
		-19.05
	]
});
AR_RSHKE.add({
	lineAngle: 0,
	x: 12.7,
	y: 21.59,
	offsetX: 132.08,
	offsetY: 17.018,
	dashLengthItems: [
		203.2,
		-35.56,
		101.6,
		-25.4
	]
});
PredefinedHatchPatterns.set("AR_RSHKE", AR_RSHKE);
const AR_SAND = new HatchPattern("AR_SAND");
AR_SAND.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 647.7,
	offsetY: 304.8,
	dashLengthItems: [
		152.4,
		-127,
		177.8,
		-76.2,
		228.6,
		-101.6
	]
});
AR_SAND.add({
	lineAngle: 0,
	x: 152.4,
	y: 12.7,
	offsetX: 647.7,
	offsetY: 304.8,
	dashLengthItems: [
		127,
		-482.6,
		101.6,
		-152.4
	]
});
AR_SAND.add({
	lineAngle: 0,
	x: 457.2,
	y: -19.05,
	offsetX: 647.7,
	offsetY: 304.8,
	dashLengthItems: [76.2, -787.4]
});
AR_SAND.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 304.8,
	offsetY: 215.9,
	dashLengthItems: [292.1, -927.1]
});
AR_SAND.add({
	lineAngle: 90,
	x: 152.4,
	y: 0,
	offsetX: 304.8,
	offsetY: 215.9,
	dashLengthItems: [285.75, -933.45]
});
AR_SAND.add({
	lineAngle: 90,
	x: 279.4,
	y: 0,
	offsetX: 304.8,
	offsetY: 215.9,
	dashLengthItems: [266.7, -952.5]
});
AR_SAND.add({
	lineAngle: 90,
	x: 457.2,
	y: -19.05,
	offsetX: 304.8,
	offsetY: 215.9,
	dashLengthItems: [292.1, -927.1]
});
AR_SAND.add({
	lineAngle: 90,
	x: 533.4,
	y: -19.05,
	offsetX: 304.8,
	offsetY: 215.9,
	dashLengthItems: [292.1, -927.1]
});
AR_SAND.add({
	lineAngle: 90,
	x: 762,
	y: 0,
	offsetX: 304.8,
	offsetY: 215.9,
	dashLengthItems: [279.4, -939.8]
});
PredefinedHatchPatterns.set("AR_SAND", AR_SAND);
const BOX = new HatchPattern("BOX");
BOX.add({
	lineAngle: 37.5,
	x: 0,
	y: 0,
	offsetX: 28.5242,
	offsetY: 39.8018,
	dashLengthItems: [
		0,
		-38.608,
		0,
		-43.18,
		0,
		-41.275
	]
});
BOX.add({
	lineAngle: 7.5,
	x: 0,
	y: 0,
	offsetX: 53.9242,
	offsetY: 65.2018,
	dashLengthItems: [
		0,
		-20.828,
		0,
		-34.798,
		0,
		-13.335
	]
});
BOX.add({
	lineAngle: -32.5,
	x: -31.242,
	y: 0,
	offsetX: 66.6344,
	offsetY: 42.6212,
	dashLengthItems: [
		0,
		-12.7,
		0,
		-45.72,
		0,
		-59.69
	]
});
BOX.add({
	lineAngle: -42.5,
	x: -31.242,
	y: 0,
	offsetX: 41.2344,
	offsetY: 68.0212,
	dashLengthItems: [
		0,
		-6.35,
		0,
		-29.972,
		0,
		-34.29
	]
});
PredefinedHatchPatterns.set("BOX", BOX);
const BRASS = new HatchPattern("BRASS");
BRASS.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: []
});
BRASS.add({
	lineAngle: 90,
	x: 6.35,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: []
});
BRASS.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [-6.35, 6.35]
});
BRASS.add({
	lineAngle: 0,
	x: 0,
	y: 6.35,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [-6.35, 6.35]
});
BRASS.add({
	lineAngle: 0,
	x: 0,
	y: 12.7,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [6.35, -6.35]
});
BRASS.add({
	lineAngle: 0,
	x: 0,
	y: 19.05,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [6.35, -6.35]
});
BRASS.add({
	lineAngle: 90,
	x: 12.7,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [6.35, -6.35]
});
BRASS.add({
	lineAngle: 90,
	x: 19.05,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [6.35, -6.35]
});
PredefinedHatchPatterns.set("BRASS", BRASS);
const BRICK = new HatchPattern("BRICK");
BRICK.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
BRICK.add({
	lineAngle: 0,
	x: 0,
	y: 3.175,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: [3.175, -1.5875]
});
PredefinedHatchPatterns.set("BRICK", BRICK);
const BRSTONE = new HatchPattern("BRSTONE");
BRSTONE.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
BRSTONE.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 12.7,
	dashLengthItems: [6.35, -6.35]
});
BRSTONE.add({
	lineAngle: 90,
	x: 6.35,
	y: 0,
	offsetX: 0,
	offsetY: 12.7,
	dashLengthItems: [-6.35, 6.35]
});
PredefinedHatchPatterns.set("BRSTONE", BRSTONE);
const CLAY = new HatchPattern("CLAY");
CLAY.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 8.382,
	dashLengthItems: []
});
CLAY.add({
	lineAngle: 90,
	x: 22.86,
	y: 0,
	offsetX: 8.382,
	offsetY: 12.7,
	dashLengthItems: [8.382, -8.382]
});
CLAY.add({
	lineAngle: 90,
	x: 20.32,
	y: 0,
	offsetX: 8.382,
	offsetY: 12.7,
	dashLengthItems: [8.382, -8.382]
});
CLAY.add({
	lineAngle: 0,
	x: 22.86,
	y: 1.397,
	offsetX: 12.7,
	offsetY: 8.382,
	dashLengthItems: [-22.86, 2.54]
});
CLAY.add({
	lineAngle: 0,
	x: 22.86,
	y: 2.794,
	offsetX: 12.7,
	offsetY: 8.382,
	dashLengthItems: [-22.86, 2.54]
});
CLAY.add({
	lineAngle: 0,
	x: 22.86,
	y: 4.191,
	offsetX: 12.7,
	offsetY: 8.382,
	dashLengthItems: [-22.86, 2.54]
});
CLAY.add({
	lineAngle: 0,
	x: 22.86,
	y: 5.588,
	offsetX: 12.7,
	offsetY: 8.382,
	dashLengthItems: [-22.86, 2.54]
});
CLAY.add({
	lineAngle: 0,
	x: 22.86,
	y: 6.985,
	offsetX: 12.7,
	offsetY: 8.382,
	dashLengthItems: [-22.86, 2.54]
});
PredefinedHatchPatterns.set("CLAY", CLAY);
const CORK = new HatchPattern("CORK");
CORK.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 4.7625,
	dashLengthItems: []
});
CORK.add({
	lineAngle: 0,
	x: 0,
	y: .79375,
	offsetX: 0,
	offsetY: 4.7625,
	dashLengthItems: []
});
CORK.add({
	lineAngle: 0,
	x: 0,
	y: 1.5875,
	offsetX: 0,
	offsetY: 4.7625,
	dashLengthItems: []
});
CORK.add({
	lineAngle: 0,
	x: 0,
	y: 3.175,
	offsetX: 0,
	offsetY: 4.7625,
	dashLengthItems: [4.7625, -3.175]
});
PredefinedHatchPatterns.set("CORK", CORK);
const CROSS = new HatchPattern("CROSS");
CROSS.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
CROSS.add({
	lineAngle: 135,
	x: 1.5875,
	y: -1.5875,
	offsetX: 0,
	offsetY: 8.98026,
	dashLengthItems: [4.49013, -4.49013]
});
CROSS.add({
	lineAngle: 135,
	x: 2.38125,
	y: -1.5875,
	offsetX: 0,
	offsetY: 8.98026,
	dashLengthItems: [4.49013, -4.49013]
});
CROSS.add({
	lineAngle: 135,
	x: 3.175,
	y: -1.5875,
	offsetX: 0,
	offsetY: 8.98026,
	dashLengthItems: [4.49013, -4.49013]
});
PredefinedHatchPatterns.set("CROSS", CROSS);
const DASH = new HatchPattern("DASH");
DASH.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [3.175, -9.525]
});
DASH.add({
	lineAngle: 90,
	x: 1.5875,
	y: -1.5875,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [3.175, -9.525]
});
PredefinedHatchPatterns.set("DASH", DASH);
const DOLMIT = new HatchPattern("DOLMIT");
DOLMIT.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 3.175,
	offsetY: 3.175,
	dashLengthItems: [3.175, -3.175]
});
PredefinedHatchPatterns.set("DOLMIT", DOLMIT);
const DOTS = new HatchPattern("DOTS");
DOTS.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
DOTS.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 17.9605,
	dashLengthItems: [8.980256121069154, -17.960512242138307]
});
PredefinedHatchPatterns.set("DOTS", DOTS);
const EARTH = new HatchPattern("EARTH");
EARTH.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: .79375,
	offsetY: 1.5875,
	dashLengthItems: [0, -1.5875]
});
PredefinedHatchPatterns.set("EARTH", EARTH);
const ESCHER = new HatchPattern("ESCHER");
ESCHER.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
ESCHER.add({
	lineAngle: 0,
	x: 0,
	y: 2.38125,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
ESCHER.add({
	lineAngle: 0,
	x: 0,
	y: 4.7625,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
ESCHER.add({
	lineAngle: 90,
	x: .79375,
	y: 5.55625,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
ESCHER.add({
	lineAngle: 90,
	x: 3.175,
	y: 5.55625,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
ESCHER.add({
	lineAngle: 90,
	x: 5.55625,
	y: 5.55625,
	offsetX: 6.35,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
PredefinedHatchPatterns.set("ESCHER", ESCHER);
const FLEX = new HatchPattern("FLEX");
FLEX.add({
	lineAngle: 60,
	x: 0,
	y: 0,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [27.94, -2.54]
});
FLEX.add({
	lineAngle: 180,
	x: 0,
	y: 0,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [27.94, -2.54]
});
FLEX.add({
	lineAngle: 300,
	x: 0,
	y: 0,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [27.94, -2.54]
});
FLEX.add({
	lineAngle: 60,
	x: 2.54,
	y: 0,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 300,
	x: 2.54,
	y: 0,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 60,
	x: -1.27,
	y: 2.199704516,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 180,
	x: -1.27,
	y: 2.199704516,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 300,
	x: -1.27,
	y: -2.199704516,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 180,
	x: -1.27,
	y: -2.199704516,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 60,
	x: -10.16,
	y: 0,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 300,
	x: -10.16,
	y: 0,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 60,
	x: 5.08,
	y: -8.7988180894,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 180,
	x: 5.08,
	y: -8.7988180894,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 300,
	x: 5.08,
	y: 8.7988180894,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 180,
	x: 5.08,
	y: 8.7988180894,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [5.08, -25.4]
});
FLEX.add({
	lineAngle: 0,
	x: 5.08,
	y: 4.3994090574,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [17.78, -12.7]
});
FLEX.add({
	lineAngle: 0,
	x: 5.08,
	y: -4.3994090574,
	offsetX: -15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [17.78, -12.7]
});
FLEX.add({
	lineAngle: 120,
	x: 1.27,
	y: 6.5991135734,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [17.78, -12.7]
});
FLEX.add({
	lineAngle: 120,
	x: -6.35,
	y: 2.199704516,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [17.78, -12.7]
});
FLEX.add({
	lineAngle: 240,
	x: -6.35,
	y: -2.199704516,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [17.78, -12.7]
});
FLEX.add({
	lineAngle: 240,
	x: 1.27,
	y: -6.5991135734,
	offsetX: 15.24,
	offsetY: 26.3964542936,
	dashLengthItems: [17.78, -12.7]
});
PredefinedHatchPatterns.set("FLEX", FLEX);
const GOST_GLASS = new HatchPattern("GOST_GLASS");
GOST_GLASS.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: [6.35, -6.35]
});
GOST_GLASS.add({
	lineAngle: 45,
	x: 6.35,
	y: 0,
	offsetX: 4.490128053,
	offsetY: 4.490128053,
	dashLengthItems: [
		1.5875,
		-5.8052561314,
		1.5875,
		-8.9802561314
	]
});
PredefinedHatchPatterns.set("GOST_GLASS", GOST_GLASS);
const GOST_WOOD = new HatchPattern("GOST_WOOD");
GOST_WOOD.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 6,
	offsetY: -6,
	dashLengthItems: [5, -7]
});
GOST_WOOD.add({
	lineAngle: 45,
	x: 2.12132,
	y: 0,
	offsetX: 6,
	offsetY: -6,
	dashLengthItems: [2, -10]
});
GOST_WOOD.add({
	lineAngle: 45,
	x: 0,
	y: 2.12132,
	offsetX: 6,
	offsetY: -6,
	dashLengthItems: [2, -10]
});
PredefinedHatchPatterns.set("GOST_WOOD", GOST_WOOD);
const GOST_GROUND = new HatchPattern("GOST_GROUND");
GOST_GROUND.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: -6,
	dashLengthItems: [10, -2]
});
GOST_GROUND.add({
	lineAngle: 90,
	x: 2,
	y: -2,
	offsetX: 0,
	offsetY: -6,
	dashLengthItems: [
		6,
		-1.5,
		3,
		-1.5
	]
});
GOST_GROUND.add({
	lineAngle: 90,
	x: 4,
	y: -5,
	offsetX: 0,
	offsetY: -6,
	dashLengthItems: [10, -2]
});
PredefinedHatchPatterns.set("GOST_GROUND", GOST_GROUND);
const GRASS = new HatchPattern("GRASS");
GRASS.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 10,
	offsetY: -10,
	dashLengthItems: [20]
});
GRASS.add({
	lineAngle: 45,
	x: 3,
	y: 0,
	offsetX: 10,
	offsetY: -10,
	dashLengthItems: [20]
});
GRASS.add({
	lineAngle: 45,
	x: 6,
	y: 0,
	offsetX: 10,
	offsetY: -10,
	dashLengthItems: [20]
});
PredefinedHatchPatterns.set("GRASS", GRASS);
const GRATE = new HatchPattern("GRATE");
GRATE.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 17.96051224,
	offsetY: 17.96051224,
	dashLengthItems: [4.7625, -31.15852448]
});
GRATE.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [4.7625, -20.6375]
});
GRATE.add({
	lineAngle: 135,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 25.4,
	dashLengthItems: [4.7625, -20.6375]
});
PredefinedHatchPatterns.set("GRATE", GRATE);
const GRAVEL = new HatchPattern("GRAVEL");
GRAVEL.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: .79375,
	dashLengthItems: []
});
GRAVEL.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("GRAVEL", GRAVEL);
const HEX = new HatchPattern("HEX");
HEX.add({
	lineAngle: 228.0127875,
	x: 18.288,
	y: 25.4,
	offsetX: 305.85067529778,
	offsetY: 1.88796713245,
	dashLengthItems: [3.4172144, -338.30483639565]
});
HEX.add({
	lineAngle: 184.969741,
	x: 16.002,
	y: 22.86,
	offsetX: -305.8545235377,
	offsetY: 1.10019612724,
	dashLengthItems: [5.8640472, -580.54048893524]
});
HEX.add({
	lineAngle: 132.5104471,
	x: 10.16,
	y: 22.352,
	offsetX: -377.59492241548,
	offsetY: 1.56030959675,
	dashLengthItems: [4.1348152, -409.347227941]
});
HEX.add({
	lineAngle: 267.273689,
	x: .254,
	y: 16.002,
	offsetX: -508.63316875916,
	offsetY: 1.20815479432,
	dashLengthItems: [5.3400452, -528.66437425738]
});
HEX.add({
	lineAngle: 292.83365418,
	x: 0,
	y: 10.668,
	offsetX: -330.19770134945,
	offsetY: 1.23208097566,
	dashLengthItems: [5.236337, -518.39807745344]
});
HEX.add({
	lineAngle: 357.273689,
	x: 2.032,
	y: 5.842,
	offsetX: -508.63316875916,
	offsetY: 1.20815479432,
	dashLengthItems: [5.3400452, -528.66437425738]
});
HEX.add({
	lineAngle: 37.69424047,
	x: 7.366,
	y: 5.588,
	offsetX: -416.58997273292,
	offsetY: .91357450169,
	dashLengthItems: [7.0619366, -699.13115314247]
});
HEX.add({
	lineAngle: 72.25532837,
	x: 12.954,
	y: 9.906,
	offsetX: 586.40373773403,
	offsetY: .96766293399,
	dashLengthItems: [6.6671952, -660.05256601905]
});
HEX.add({
	lineAngle: 121.42956562,
	x: 14.986,
	y: 16.256,
	offsetX: 387.71230339293,
	offsetY: 1.2040754753,
	dashLengthItems: [5.35813, -530.45545698712]
});
HEX.add({
	lineAngle: 175.2363583,
	x: 12.192,
	y: 20.828,
	offsetX: -280.5442400419,
	offsetY: 2.10935518695,
	dashLengthItems: [6.1171328, -299.7393695]
});
HEX.add({
	lineAngle: 222.3974378,
	x: 6.096,
	y: 21.336,
	offsetX: 413.48123885686,
	offsetY: .81554484621,
	dashLengthItems: [7.9107792, -783.16772512177]
});
HEX.add({
	lineAngle: 138.81407483,
	x: 25.4,
	y: 15.748,
	offsetX: 234.164238558,
	offsetY: 2.38943100688,
	dashLengthItems: [2.7000454, -267.30565824344]
});
HEX.add({
	lineAngle: 171.4692344,
	x: 23.368,
	y: 17.526,
	offsetX: -334.082478726,
	offsetY: 1.25594916784,
	dashLengthItems: [5.1368198, -508.5463899704]
});
HEX.add({
	lineAngle: 225,
	x: 18.288,
	y: 18.288,
	offsetX: 17.96051224214,
	offsetY: 17.96051224214,
	dashLengthItems: [3.5920934, -32.32893108428]
});
HEX.add({
	lineAngle: 203.19859051,
	x: 16.51,
	y: 21.336,
	offsetX: -136.74251918,
	offsetY: 3.33518339548,
	dashLengthItems: [1.9344132, -191.50622368894]
});
HEX.add({
	lineAngle: 291.80140949,
	x: 14.732,
	y: 20.574,
	offsetX: -80.18324702488,
	offsetY: 4.71666158921,
	dashLengthItems: [2.7356562, -134.0475299]
});
HEX.add({
	lineAngle: 30.96375653,
	x: 15.748,
	y: 18.034,
	offsetX: 91.47734531502,
	offsetY: 4.35606406258,
	dashLengthItems: [4.4431966, -143.6629815291]
});
HEX.add({
	lineAngle: 161.56505118,
	x: 19.558,
	y: 20.32,
	offsetX: -56.2252967978,
	offsetY: 8.03218525675,
	dashLengthItems: [3.2128714, -77.10898116828]
});
HEX.add({
	lineAngle: 16.389540334,
	x: 0,
	y: 20.574,
	offsetX: 265.17991128726,
	offsetY: 1.43340492604,
	dashLengthItems: [4.50088, -445.58826672539]
});
HEX.add({
	lineAngle: 70.34617594,
	x: 4.318,
	y: 21.844,
	offsetX: -297.29446803469,
	offsetY: 1.70858889651,
	dashLengthItems: [3.7759894, -373.822156782]
});
HEX.add({
	lineAngle: 293.19859051,
	x: 19.558,
	y: 25.4,
	offsetX: -136.7425191801,
	offsetY: 3.33518339548,
	dashLengthItems: [3.868801, -189.57183588894]
});
HEX.add({
	lineAngle: 343.61045967,
	x: 21.082,
	y: 21.844,
	offsetX: -265.17991128725,
	offsetY: 1.433404926,
	dashLengthItems: [4.50088, -445.5882667254]
});
HEX.add({
	lineAngle: 339.44395478,
	x: 0,
	y: 4.826,
	offsetX: -136.75087638398,
	offsetY: 2.97284513779,
	dashLengthItems: [4.340352, -212.67734313106]
});
HEX.add({
	lineAngle: 294.7751406,
	x: 4.064,
	y: 3.302,
	offsetX: -306.90424056705,
	offsetY: 1.77401295215,
	dashLengthItems: [3.6367212, -360.0359338072]
});
HEX.add({
	lineAngle: 66.80140949,
	x: 19.812,
	y: 0,
	offsetX: 136.74251918012,
	offsetY: 3.33518339452,
	dashLengthItems: [3.868801, -189.57183588894]
});
HEX.add({
	lineAngle: 17.35402464,
	x: 21.336,
	y: 3.556,
	offsetX: -345.47402804977,
	offsetY: 1.51523696536,
	dashLengthItems: [4.2578274, -421.523759802]
});
HEX.add({
	lineAngle: 69.44395478,
	x: 7.366,
	y: 0,
	offsetX: -136.75087638396,
	offsetY: 2.97284513874,
	dashLengthItems: [2.170176, -214.84751913106]
});
HEX.add({
	lineAngle: 101.309932474,
	x: 18.288,
	y: 0,
	offsetX: 104.60834648271,
	offsetY: 4.98134983255,
	dashLengthItems: [1.295146, -128.21994964526]
});
HEX.add({
	lineAngle: 165.963756532,
	x: 18.034,
	y: 1.27,
	offsetX: -80.085263387,
	offsetY: 6.16040487582,
	dashLengthItems: [5.236337, -99.49054589069]
});
HEX.add({
	lineAngle: 186.00900596,
	x: 12.954,
	y: 2.54,
	offsetX: -255.26337856879,
	offsetY: 1.32949676118,
	dashLengthItems: [4.85267, -480.41364863337]
});
HEX.add({
	lineAngle: 303.69006753,
	x: 15.748,
	y: 15.748,
	offsetX: -56.35753993648,
	offsetY: 7.0446924921,
	dashLengthItems: [3.6632388, -87.9177635968]
});
HEX.add({
	lineAngle: 353.15722659,
	x: 17.78,
	y: 12.7,
	offsetX: 434.77679606606,
	offsetY: 1.0087628707,
	dashLengthItems: [6.3955676, -633.16009065031]
});
HEX.add({
	lineAngle: 60.9453959,
	x: 24.13,
	y: 11.938,
	offsetX: -204.76648550216,
	offsetY: 2.46706609031,
	dashLengthItems: [2.6150824, -258.8939231811]
});
HEX.add({
	lineAngle: 90,
	x: 25.4,
	y: 14.224,
	offsetX: 25.4,
	offsetY: 25.4,
	dashLengthItems: [1.524, -23.876]
});
HEX.add({
	lineAngle: 120.25643716,
	x: 12.446,
	y: 3.302,
	offsetX: -204.77318477297,
	offsetY: 1.8283320086,
	dashLengthItems: [3.5286696, -349.339407732]
});
HEX.add({
	lineAngle: 48.0127875,
	x: 10.668,
	y: 6.35,
	offsetX: 305.85067529778,
	offsetY: 1.88796713138,
	dashLengthItems: [6.8344288, -334.88762199565]
});
HEX.add({
	lineAngle: 0,
	x: 15.24,
	y: 11.43,
	offsetX: 25.4,
	offsetY: 25.4,
	dashLengthItems: [6.604, -18.796]
});
HEX.add({
	lineAngle: 325.3048465,
	x: 21.844,
	y: 11.43,
	offsetX: 310.04235091354,
	offsetY: -1.6064370526,
	dashLengthItems: [4.0160956, -397.5931672414]
});
HEX.add({
	lineAngle: 254.0546041,
	x: 25.146,
	y: 9.144,
	offsetX: 104.6687497289,
	offsetY: 3.48895832444,
	dashLengthItems: [3.6982908, -181.21650038772]
});
HEX.add({
	lineAngle: 207.64597536,
	x: 24.13,
	y: 5.588,
	offsetX: 545.36007557253,
	offsetY: 1.07143433066,
	dashLengthItems: [6.021451, -596.12464422938]
});
HEX.add({
	lineAngle: 175.42607874,
	x: 18.796,
	y: 2.794,
	offsetX: 331.1739336186,
	offsetY: 1.01276432357,
	dashLengthItems: [6.3702946, -630.6584645624]
});
PredefinedHatchPatterns.set("HEX", HEX);
const HONEY = new HatchPattern("HONEY");
HONEY.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5.4992613154,
	dashLengthItems: [3.175, -6.35]
});
HONEY.add({
	lineAngle: 120,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5.4992613154,
	dashLengthItems: [3.175, -6.35]
});
HONEY.add({
	lineAngle: 60,
	x: 3.175,
	y: 0,
	offsetX: 0,
	offsetY: 5.4992613154,
	dashLengthItems: [3.175, -6.35]
});
PredefinedHatchPatterns.set("HONEY", HONEY);
const HOUND = new HatchPattern("HOUND");
HOUND.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 4.7625,
	offsetY: 2.749630645,
	dashLengthItems: [3.175, -6.35]
});
HOUND.add({
	lineAngle: 120,
	x: 0,
	y: 0,
	offsetX: 4.7625,
	offsetY: 2.749630645,
	dashLengthItems: [3.175, -6.35]
});
HOUND.add({
	lineAngle: 60,
	x: 0,
	y: 0,
	offsetX: 4.7625,
	offsetY: 2.749630645,
	dashLengthItems: [-6.35, 3.175]
});
PredefinedHatchPatterns.set("HOUND", HOUND);
const INSUL = new HatchPattern("INSUL");
INSUL.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 6.35,
	offsetY: 1.5875,
	dashLengthItems: [25.4, -12.7]
});
INSUL.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: -6.35,
	offsetY: 1.5875,
	dashLengthItems: [25.4, -12.7]
});
PredefinedHatchPatterns.set("INSUL", INSUL);
const ACAD_ISO02W100 = new HatchPattern("ACAD_ISO02W100");
ACAD_ISO02W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 9.525,
	dashLengthItems: []
});
ACAD_ISO02W100.add({
	lineAngle: 0,
	x: 0,
	y: 3.175,
	offsetX: 0,
	offsetY: 9.525,
	dashLengthItems: [3.175, -3.175]
});
ACAD_ISO02W100.add({
	lineAngle: 0,
	x: 0,
	y: 6.35,
	offsetX: 0,
	offsetY: 9.525,
	dashLengthItems: [3.175, -3.175]
});
PredefinedHatchPatterns.set("ACAD_ISO02W100", ACAD_ISO02W100);
const ACAD_ISO03W100 = new HatchPattern("ACAD_ISO03W100");
ACAD_ISO03W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [12, -3]
});
PredefinedHatchPatterns.set("ACAD_ISO03W100", ACAD_ISO03W100);
const ACAD_ISO04W100 = new HatchPattern("ACAD_ISO04W100");
ACAD_ISO04W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [12, -18]
});
PredefinedHatchPatterns.set("ACAD_ISO04W100", ACAD_ISO04W100);
const ACAD_ISO05W100 = new HatchPattern("ACAD_ISO05W100");
ACAD_ISO05W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		24,
		-3,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO05W100", ACAD_ISO05W100);
const ACAD_ISO06W100 = new HatchPattern("ACAD_ISO06W100");
ACAD_ISO06W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		24,
		-3,
		.5,
		-3,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO06W100", ACAD_ISO06W100);
const ACAD_ISO07W100 = new HatchPattern("ACAD_ISO07W100");
ACAD_ISO07W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		24,
		-3,
		.5,
		-3,
		.5,
		-6.5
	]
});
ACAD_ISO07W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		-34,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO07W100", ACAD_ISO07W100);
const ACAD_ISO08W100 = new HatchPattern("ACAD_ISO08W100");
ACAD_ISO08W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [.5, -3]
});
PredefinedHatchPatterns.set("ACAD_ISO08W100", ACAD_ISO08W100);
const ACAD_ISO09W100 = new HatchPattern("ACAD_ISO09W100");
ACAD_ISO09W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		24,
		-3,
		6,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO09W100", ACAD_ISO09W100);
const ACAD_ISO10W100 = new HatchPattern("ACAD_ISO10W100");
ACAD_ISO10W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		24,
		-3,
		6,
		-3,
		6,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO10W100", ACAD_ISO10W100);
const ACAD_ISO11W100 = new HatchPattern("ACAD_ISO11W100");
ACAD_ISO11W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		12,
		-3,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO11W100", ACAD_ISO11W100);
const ACAD_ISO12W100 = new HatchPattern("ACAD_ISO12W100");
ACAD_ISO12W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		12,
		-3,
		12,
		-3,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO12W100", ACAD_ISO12W100);
const ACAD_ISO13W100 = new HatchPattern("ACAD_ISO13W100");
ACAD_ISO13W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		12,
		-3,
		.5,
		-3,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO13W100", ACAD_ISO13W100);
const ACAD_ISO14W100 = new HatchPattern("ACAD_ISO14W100");
ACAD_ISO14W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		12,
		-3,
		12,
		-3,
		.5,
		-6.5
	]
});
ACAD_ISO14W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		-33.5,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO14W100", ACAD_ISO14W100);
const ACAD_ISO15W100 = new HatchPattern("ACAD_ISO15W100");
ACAD_ISO15W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		12,
		-3,
		.5,
		-3,
		.5,
		-6.5
	]
});
ACAD_ISO15W100.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		-22,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("ACAD_ISO15W100", ACAD_ISO15W100);
const JIS_LC_20 = new HatchPattern("JIS_LC_20");
JIS_LC_20.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		12,
		-3,
		12,
		-3,
		.5,
		-10
	]
});
JIS_LC_20.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5,
	dashLengthItems: [
		-33.5,
		.5,
		-3,
		.5,
		-3
	]
});
PredefinedHatchPatterns.set("JIS_LC_20", JIS_LC_20);
const JIS_LC_20A = new HatchPattern("JIS_LC_20A");
JIS_LC_20A.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 20,
	dashLengthItems: []
});
JIS_LC_20A.add({
	lineAngle: 45,
	x: .4,
	y: 0,
	offsetX: 0,
	offsetY: 20,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_LC_20A", JIS_LC_20A);
const JIS_LC_8 = new HatchPattern("JIS_LC_8");
JIS_LC_8.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 20,
	dashLengthItems: []
});
JIS_LC_8.add({
	lineAngle: 45,
	x: 1,
	y: 0,
	offsetX: 0,
	offsetY: 20,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_LC_8", JIS_LC_8);
const JIS_LC_8A = new HatchPattern("JIS_LC_8A");
JIS_LC_8A.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 7.8,
	dashLengthItems: []
});
JIS_LC_8A.add({
	lineAngle: 45,
	x: .4,
	y: 0,
	offsetX: 0,
	offsetY: 7.8,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_LC_8A", JIS_LC_8A);
const JIS_RC_10 = new HatchPattern("JIS_RC_10");
JIS_RC_10.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 7.8,
	dashLengthItems: []
});
JIS_RC_10.add({
	lineAngle: 45,
	x: 1,
	y: 0,
	offsetX: 0,
	offsetY: 7.8,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_RC_10", JIS_RC_10);
const JIS_RC_15 = new HatchPattern("JIS_RC_15");
JIS_RC_15.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 10,
	dashLengthItems: []
});
JIS_RC_15.add({
	lineAngle: 45,
	x: .725,
	y: 0,
	offsetX: 0,
	offsetY: 10,
	dashLengthItems: []
});
JIS_RC_15.add({
	lineAngle: 45,
	x: 1.45,
	y: 0,
	offsetX: 0,
	offsetY: 10,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_RC_15", JIS_RC_15);
const JIS_RC_18 = new HatchPattern("JIS_RC_18");
JIS_RC_18.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 15,
	dashLengthItems: []
});
JIS_RC_18.add({
	lineAngle: 45,
	x: .725,
	y: 0,
	offsetX: 0,
	offsetY: 15,
	dashLengthItems: []
});
JIS_RC_18.add({
	lineAngle: 45,
	x: 1.45,
	y: 0,
	offsetX: 0,
	offsetY: 15,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_RC_18", JIS_RC_18);
const JIS_RC_30 = new HatchPattern("JIS_RC_30");
JIS_RC_30.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 18,
	dashLengthItems: []
});
JIS_RC_30.add({
	lineAngle: 45,
	x: 1,
	y: 0,
	offsetX: 0,
	offsetY: 18,
	dashLengthItems: []
});
JIS_RC_30.add({
	lineAngle: 45,
	x: 2,
	y: 0,
	offsetX: 0,
	offsetY: 18,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_RC_30", JIS_RC_30);
const JIS_STN_1E = new HatchPattern("JIS_STN_1E");
JIS_STN_1E.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 30,
	dashLengthItems: []
});
JIS_STN_1E.add({
	lineAngle: 45,
	x: 1,
	y: 0,
	offsetX: 0,
	offsetY: 30,
	dashLengthItems: []
});
JIS_STN_1E.add({
	lineAngle: 45,
	x: 2,
	y: 0,
	offsetX: 0,
	offsetY: 30,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("JIS_STN_1E", JIS_STN_1E);
const JIS_STN_2_5 = new HatchPattern("JIS_STN_2_5");
JIS_STN_2_5.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 1,
	dashLengthItems: []
});
JIS_STN_2_5.add({
	lineAngle: 45,
	x: .705,
	y: 0,
	offsetX: 0,
	offsetY: 1,
	dashLengthItems: [1, -.5]
});
PredefinedHatchPatterns.set("JIS_STN_2_5", JIS_STN_2_5);
const JIS_WOOD = new HatchPattern("JIS_WOOD");
JIS_WOOD.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 2.5,
	dashLengthItems: []
});
JIS_WOOD.add({
	lineAngle: 45,
	x: 1.765,
	y: 0,
	offsetX: 0,
	offsetY: 2.5,
	dashLengthItems: [1.2, -.5]
});
PredefinedHatchPatterns.set("JIS_WOOD", JIS_WOOD);
const LINE = new HatchPattern("LINE");
LINE.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: .70710678,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("LINE", LINE);
const MUDST = new HatchPattern("MUDST");
MUDST.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("MUDST", MUDST);
const NET = new HatchPattern("NET");
NET.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 12.7,
	offsetY: 6.35,
	dashLengthItems: [
		6.35,
		-6.35,
		0,
		-6.35,
		0,
		-6.35
	]
});
PredefinedHatchPatterns.set("NET", NET);
const NET3 = new HatchPattern("NET3");
NET3.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
NET3.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("NET3", NET3);
const PLAST = new HatchPattern("PLAST");
PLAST.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PLAST.add({
	lineAngle: 60,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PLAST.add({
	lineAngle: 120,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("PLAST", PLAST);
const PLASTI = new HatchPattern("PLASTI");
PLASTI.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
PLASTI.add({
	lineAngle: 0,
	x: 0,
	y: .79375,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
PLASTI.add({
	lineAngle: 0,
	x: 0,
	y: 1.5875,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("PLASTI", PLASTI);
const SACNCR = new HatchPattern("SACNCR");
SACNCR.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
SACNCR.add({
	lineAngle: 0,
	x: 0,
	y: .79375,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
SACNCR.add({
	lineAngle: 0,
	x: 0,
	y: 1.5875,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
SACNCR.add({
	lineAngle: 0,
	x: 0,
	y: 3.96875,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("SACNCR", SACNCR);
const SQUARE = new HatchPattern("SQUARE");
SQUARE.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 2.38125,
	dashLengthItems: []
});
SQUARE.add({
	lineAngle: 45,
	x: 1.6838,
	y: 0,
	offsetX: 0,
	offsetY: 2.38125,
	dashLengthItems: [0, -2.38125]
});
PredefinedHatchPatterns.set("SQUARE", SQUARE);
const STARS = new HatchPattern("STARS");
STARS.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: [3.175, -3.175]
});
STARS.add({
	lineAngle: 90,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: [3.175, -3.175]
});
PredefinedHatchPatterns.set("STARS", STARS);
const STEEL = new HatchPattern("STEEL");
STEEL.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5.4992613154,
	dashLengthItems: [3.175, -3.175]
});
STEEL.add({
	lineAngle: 60,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 5.4992613154,
	dashLengthItems: [3.175, -3.175]
});
STEEL.add({
	lineAngle: 120,
	x: 1.5875,
	y: 2.7496306704,
	offsetX: 0,
	offsetY: 5.4992613154,
	dashLengthItems: [3.175, -3.175]
});
PredefinedHatchPatterns.set("STEEL", STEEL);
const SWAMP = new HatchPattern("SWAMP");
SWAMP.add({
	lineAngle: 45,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
SWAMP.add({
	lineAngle: 45,
	x: 0,
	y: 1.5875,
	offsetX: 0,
	offsetY: 3.175,
	dashLengthItems: []
});
PredefinedHatchPatterns.set("SWAMP", SWAMP);
const TRANS = new HatchPattern("TRANS");
TRANS.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 12.7,
	offsetY: 21.9970452362,
	dashLengthItems: [3.175, -22.225]
});
TRANS.add({
	lineAngle: 90,
	x: 1.5875,
	y: 0,
	offsetX: 21.9970452362,
	offsetY: 12.7,
	dashLengthItems: [1.5875, -42.4065904724]
});
TRANS.add({
	lineAngle: 90,
	x: 1.984375,
	y: 0,
	offsetX: 21.9970452362,
	offsetY: 12.7,
	dashLengthItems: [1.27, -42.7240904724]
});
TRANS.add({
	lineAngle: 90,
	x: 1.190625,
	y: 0,
	offsetX: 21.9970452362,
	offsetY: 12.7,
	dashLengthItems: [1.27, -42.7240904724]
});
TRANS.add({
	lineAngle: 60,
	x: 2.38125,
	y: 0,
	offsetX: 12.7,
	offsetY: 21.9970452362,
	dashLengthItems: [1.016, -24.384]
});
TRANS.add({
	lineAngle: 120,
	x: .79375,
	y: 0,
	offsetX: 12.7,
	offsetY: 21.9970452362,
	dashLengthItems: [1.016, -24.384]
});
PredefinedHatchPatterns.set("TRANS", TRANS);
const TRIANG = new HatchPattern("TRIANG");
TRIANG.add({
	lineAngle: 0,
	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: []
});
TRIANG.add({
	lineAngle: 0,
	x: 0,
	y: 3.175,
	offsetX: 0,
	offsetY: 6.35,
	dashLengthItems: [3.175, -3.175]
});
PredefinedHatchPatterns.set("TRIANG", TRIANG);
const ZIGZAG = new HatchPattern("ZIGZAG");
ZIGZAG.add({
	lineAngle: 60,
	x: 0,
	y: 0,
	offsetX: 4.7625,
	offsetY: 8.2488919604,
	dashLengthItems: [4.7625, -4.7625]
});
ZIGZAG.add({
	lineAngle: 120,
	x: 0,
	y: 0,
	offsetX: 4.7625,
	offsetY: 8.2488919604,
	dashLengthItems: [4.7625, -4.7625]
});
ZIGZAG.add({
	lineAngle: 0,
	x: -2.38125,
	y: 4.1244459802,
	offsetX: 4.7625,
	offsetY: 8.2488919604,
	dashLengthItems: [4.7625, -4.7625]
});
PredefinedHatchPatterns.set("ZIGZAG", ZIGZAG);
//#endregion
//#region src/Internals/TrueColor.ts
var TrueColor = class TrueColor {
	static fromHex(hex) {
		if (hex.startsWith("#")) hex = hex.replace("#", "");
		return parseInt(hex, 16);
	}
	static fromRGB(r, g, b) {
		const hex = [
			r,
			g,
			b
		].reduce((acc, c) => {
			const h = c.toString(16);
			return `${acc}${h.length === 1 ? "0" + h : h}`;
		}, "0x00");
		return TrueColor.fromHex(hex);
	}
};
//#endregion
//#region src/Internals/Colors.ts
const acicolors = [
	[
		[
			"00",
			"00",
			"00"
		],
		0,
		[
			"0",
			"0",
			"0"
		]
	],
	[
		[
			"FF",
			"00",
			"00"
		],
		1,
		[
			"255",
			"0",
			"0"
		]
	],
	[
		[
			"FF",
			"FF",
			"00"
		],
		2,
		[
			"255",
			"255",
			"0"
		]
	],
	[
		[
			"00",
			"FF",
			"00"
		],
		3,
		[
			"0",
			"255",
			"0"
		]
	],
	[
		[
			"00",
			"FF",
			"FF"
		],
		4,
		[
			"0",
			"255",
			"255"
		]
	],
	[
		[
			"00",
			"00",
			"FF"
		],
		5,
		[
			"0",
			"0",
			"255"
		]
	],
	[
		[
			"FF",
			"00",
			"FF"
		],
		6,
		[
			"255",
			"0",
			"255"
		]
	],
	[
		[
			"FF",
			"FF",
			"FF"
		],
		7,
		[
			"255",
			"255",
			"255"
		]
	],
	[
		[
			"41",
			"41",
			"41"
		],
		8,
		[
			"65",
			"65",
			"65"
		]
	],
	[
		[
			"80",
			"80",
			"80"
		],
		9,
		[
			"128",
			"128",
			"128"
		]
	],
	[
		[
			"FF",
			"00",
			"00"
		],
		10,
		[
			"255",
			"0",
			"0"
		]
	],
	[
		[
			"FF",
			"AA",
			"AA"
		],
		11,
		[
			"255",
			"170",
			"170"
		]
	],
	[
		[
			"BD",
			"00",
			"00"
		],
		12,
		[
			"189",
			"0",
			"0"
		]
	],
	[
		[
			"BD",
			"7E",
			"7E"
		],
		13,
		[
			"189",
			"126",
			"126"
		]
	],
	[
		[
			"81",
			"00",
			"00"
		],
		14,
		[
			"129",
			"0",
			"0"
		]
	],
	[
		[
			"81",
			"56",
			"56"
		],
		15,
		[
			"129",
			"86",
			"86"
		]
	],
	[
		[
			"68",
			"00",
			"00"
		],
		16,
		[
			"104",
			"0",
			"0"
		]
	],
	[
		[
			"68",
			"45",
			"45"
		],
		17,
		[
			"104",
			"69",
			"69"
		]
	],
	[
		[
			"4F",
			"00",
			"00"
		],
		18,
		[
			"79",
			"0",
			"0"
		]
	],
	[
		[
			"4F",
			"35",
			"35"
		],
		19,
		[
			"79",
			"53",
			"53"
		]
	],
	[
		[
			"FF",
			"3F",
			"00"
		],
		20,
		[
			"255",
			"63",
			"0"
		]
	],
	[
		[
			"FF",
			"BF",
			"AA"
		],
		21,
		[
			"255",
			"191",
			"170"
		]
	],
	[
		[
			"BD",
			"2E",
			"00"
		],
		22,
		[
			"189",
			"46",
			"0"
		]
	],
	[
		[
			"BD",
			"8D",
			"7E"
		],
		23,
		[
			"189",
			"141",
			"126"
		]
	],
	[
		[
			"81",
			"1F",
			"00"
		],
		24,
		[
			"129",
			"31",
			"0"
		]
	],
	[
		[
			"81",
			"60",
			"56"
		],
		25,
		[
			"129",
			"96",
			"86"
		]
	],
	[
		[
			"68",
			"19",
			"00"
		],
		26,
		[
			"104",
			"25",
			"0"
		]
	],
	[
		[
			"68",
			"4E",
			"45"
		],
		27,
		[
			"104",
			"78",
			"69"
		]
	],
	[
		[
			"4F",
			"13",
			"00"
		],
		28,
		[
			"79",
			"19",
			"0"
		]
	],
	[
		[
			"4F",
			"3B",
			"35"
		],
		29,
		[
			"79",
			"59",
			"53"
		]
	],
	[
		[
			"FF",
			"7F",
			"00"
		],
		30,
		[
			"255",
			"127",
			"0"
		]
	],
	[
		[
			"FF",
			"D4",
			"AA"
		],
		31,
		[
			"255",
			"212",
			"170"
		]
	],
	[
		[
			"BD",
			"5E",
			"00"
		],
		32,
		[
			"189",
			"94",
			"0"
		]
	],
	[
		[
			"BD",
			"9D",
			"7E"
		],
		33,
		[
			"189",
			"157",
			"126"
		]
	],
	[
		[
			"81",
			"40",
			"00"
		],
		34,
		[
			"129",
			"64",
			"0"
		]
	],
	[
		[
			"81",
			"6B",
			"56"
		],
		35,
		[
			"129",
			"107",
			"86"
		]
	],
	[
		[
			"68",
			"34",
			"00"
		],
		36,
		[
			"104",
			"52",
			"0"
		]
	],
	[
		[
			"68",
			"56",
			"45"
		],
		37,
		[
			"104",
			"86",
			"69"
		]
	],
	[
		[
			"4F",
			"27",
			"00"
		],
		38,
		[
			"79",
			"39",
			"0"
		]
	],
	[
		[
			"4F",
			"42",
			"35"
		],
		39,
		[
			"79",
			"66",
			"53"
		]
	],
	[
		[
			"FF",
			"BF",
			"00"
		],
		40,
		[
			"255",
			"191",
			"0"
		]
	],
	[
		[
			"FF",
			"EA",
			"AA"
		],
		41,
		[
			"255",
			"234",
			"170"
		]
	],
	[
		[
			"BD",
			"8D",
			"00"
		],
		42,
		[
			"189",
			"141",
			"0"
		]
	],
	[
		[
			"BD",
			"AD",
			"7E"
		],
		43,
		[
			"189",
			"173",
			"126"
		]
	],
	[
		[
			"81",
			"60",
			"00"
		],
		44,
		[
			"129",
			"96",
			"0"
		]
	],
	[
		[
			"81",
			"76",
			"56"
		],
		45,
		[
			"129",
			"118",
			"86"
		]
	],
	[
		[
			"68",
			"4E",
			"00"
		],
		46,
		[
			"104",
			"78",
			"0"
		]
	],
	[
		[
			"68",
			"5F",
			"45"
		],
		47,
		[
			"104",
			"95",
			"69"
		]
	],
	[
		[
			"4F",
			"3B",
			"00"
		],
		48,
		[
			"79",
			"59",
			"0"
		]
	],
	[
		[
			"4F",
			"49",
			"35"
		],
		49,
		[
			"79",
			"73",
			"53"
		]
	],
	[
		[
			"FF",
			"FF",
			"00"
		],
		50,
		[
			"255",
			"255",
			"0"
		]
	],
	[
		[
			"FF",
			"FF",
			"AA"
		],
		51,
		[
			"255",
			"255",
			"170"
		]
	],
	[
		[
			"BD",
			"BD",
			"00"
		],
		52,
		[
			"189",
			"189",
			"0"
		]
	],
	[
		[
			"BD",
			"BD",
			"7E"
		],
		53,
		[
			"189",
			"189",
			"126"
		]
	],
	[
		[
			"81",
			"81",
			"00"
		],
		54,
		[
			"129",
			"129",
			"0"
		]
	],
	[
		[
			"81",
			"81",
			"56"
		],
		55,
		[
			"129",
			"129",
			"86"
		]
	],
	[
		[
			"68",
			"68",
			"00"
		],
		56,
		[
			"104",
			"104",
			"0"
		]
	],
	[
		[
			"68",
			"68",
			"45"
		],
		57,
		[
			"104",
			"104",
			"69"
		]
	],
	[
		[
			"4F",
			"4F",
			"00"
		],
		58,
		[
			"79",
			"79",
			"0"
		]
	],
	[
		[
			"4F",
			"4F",
			"35"
		],
		59,
		[
			"79",
			"79",
			"53"
		]
	],
	[
		[
			"BF",
			"FF",
			"00"
		],
		60,
		[
			"191",
			"255",
			"0"
		]
	],
	[
		[
			"EA",
			"FF",
			"AA"
		],
		61,
		[
			"234",
			"255",
			"170"
		]
	],
	[
		[
			"8D",
			"BD",
			"00"
		],
		62,
		[
			"141",
			"189",
			"0"
		]
	],
	[
		[
			"AD",
			"BD",
			"7E"
		],
		63,
		[
			"173",
			"189",
			"126"
		]
	],
	[
		[
			"60",
			"81",
			"00"
		],
		64,
		[
			"96",
			"129",
			"0"
		]
	],
	[
		[
			"76",
			"81",
			"56"
		],
		65,
		[
			"118",
			"129",
			"86"
		]
	],
	[
		[
			"4E",
			"68",
			"00"
		],
		66,
		[
			"78",
			"104",
			"0"
		]
	],
	[
		[
			"5F",
			"68",
			"45"
		],
		67,
		[
			"95",
			"104",
			"69"
		]
	],
	[
		[
			"3B",
			"4F",
			"00"
		],
		68,
		[
			"59",
			"79",
			"0"
		]
	],
	[
		[
			"49",
			"4F",
			"35"
		],
		69,
		[
			"73",
			"79",
			"53"
		]
	],
	[
		[
			"7F",
			"FF",
			"00"
		],
		70,
		[
			"127",
			"255",
			"0"
		]
	],
	[
		[
			"D4",
			"FF",
			"AA"
		],
		71,
		[
			"212",
			"255",
			"170"
		]
	],
	[
		[
			"5E",
			"BD",
			"00"
		],
		72,
		[
			"94",
			"189",
			"0"
		]
	],
	[
		[
			"9D",
			"BD",
			"7E"
		],
		73,
		[
			"157",
			"189",
			"126"
		]
	],
	[
		[
			"40",
			"81",
			"00"
		],
		74,
		[
			"64",
			"129",
			"0"
		]
	],
	[
		[
			"6B",
			"81",
			"56"
		],
		75,
		[
			"107",
			"129",
			"86"
		]
	],
	[
		[
			"34",
			"68",
			"00"
		],
		76,
		[
			"52",
			"104",
			"0"
		]
	],
	[
		[
			"56",
			"68",
			"45"
		],
		77,
		[
			"86",
			"104",
			"69"
		]
	],
	[
		[
			"27",
			"4F",
			"00"
		],
		78,
		[
			"39",
			"79",
			"0"
		]
	],
	[
		[
			"42",
			"4F",
			"35"
		],
		79,
		[
			"66",
			"79",
			"53"
		]
	],
	[
		[
			"3F",
			"FF",
			"00"
		],
		80,
		[
			"63",
			"255",
			"0"
		]
	],
	[
		[
			"BF",
			"FF",
			"AA"
		],
		81,
		[
			"191",
			"255",
			"170"
		]
	],
	[
		[
			"2E",
			"BD",
			"00"
		],
		82,
		[
			"46",
			"189",
			"0"
		]
	],
	[
		[
			"8D",
			"BD",
			"7E"
		],
		83,
		[
			"141",
			"189",
			"126"
		]
	],
	[
		[
			"1F",
			"81",
			"00"
		],
		84,
		[
			"31",
			"129",
			"0"
		]
	],
	[
		[
			"60",
			"81",
			"56"
		],
		85,
		[
			"96",
			"129",
			"86"
		]
	],
	[
		[
			"19",
			"68",
			"00"
		],
		86,
		[
			"25",
			"104",
			"0"
		]
	],
	[
		[
			"4E",
			"68",
			"45"
		],
		87,
		[
			"78",
			"104",
			"69"
		]
	],
	[
		[
			"13",
			"4F",
			"00"
		],
		88,
		[
			"19",
			"79",
			"0"
		]
	],
	[
		[
			"3B",
			"4F",
			"35"
		],
		89,
		[
			"59",
			"79",
			"53"
		]
	],
	[
		[
			"00",
			"FF",
			"00"
		],
		90,
		[
			"0",
			"255",
			"0"
		]
	],
	[
		[
			"AA",
			"FF",
			"AA"
		],
		91,
		[
			"170",
			"255",
			"170"
		]
	],
	[
		[
			"00",
			"BD",
			"00"
		],
		92,
		[
			"0",
			"189",
			"0"
		]
	],
	[
		[
			"7E",
			"BD",
			"7E"
		],
		93,
		[
			"126",
			"189",
			"126"
		]
	],
	[
		[
			"00",
			"81",
			"00"
		],
		94,
		[
			"0",
			"129",
			"0"
		]
	],
	[
		[
			"56",
			"81",
			"56"
		],
		95,
		[
			"86",
			"129",
			"86"
		]
	],
	[
		[
			"00",
			"68",
			"00"
		],
		96,
		[
			"0",
			"104",
			"0"
		]
	],
	[
		[
			"45",
			"68",
			"45"
		],
		97,
		[
			"69",
			"104",
			"69"
		]
	],
	[
		[
			"00",
			"4F",
			"00"
		],
		98,
		[
			"0",
			"79",
			"0"
		]
	],
	[
		[
			"35",
			"4F",
			"35"
		],
		99,
		[
			"53",
			"79",
			"53"
		]
	],
	[
		[
			"00",
			"FF",
			"3F"
		],
		100,
		[
			"0",
			"255",
			"63"
		]
	],
	[
		[
			"AA",
			"FF",
			"BF"
		],
		101,
		[
			"170",
			"255",
			"191"
		]
	],
	[
		[
			"00",
			"BD",
			"2E"
		],
		102,
		[
			"0",
			"189",
			"46"
		]
	],
	[
		[
			"7E",
			"BD",
			"8D"
		],
		103,
		[
			"126",
			"189",
			"141"
		]
	],
	[
		[
			"00",
			"81",
			"1F"
		],
		104,
		[
			"0",
			"129",
			"31"
		]
	],
	[
		[
			"56",
			"81",
			"60"
		],
		105,
		[
			"86",
			"129",
			"96"
		]
	],
	[
		[
			"00",
			"68",
			"19"
		],
		106,
		[
			"0",
			"104",
			"25"
		]
	],
	[
		[
			"45",
			"68",
			"4E"
		],
		107,
		[
			"69",
			"104",
			"78"
		]
	],
	[
		[
			"00",
			"4F",
			"13"
		],
		108,
		[
			"0",
			"79",
			"19"
		]
	],
	[
		[
			"35",
			"4F",
			"3B"
		],
		109,
		[
			"53",
			"79",
			"59"
		]
	],
	[
		[
			"00",
			"FF",
			"7F"
		],
		110,
		[
			"0",
			"255",
			"127"
		]
	],
	[
		[
			"AA",
			"FF",
			"D4"
		],
		111,
		[
			"170",
			"255",
			"212"
		]
	],
	[
		[
			"00",
			"BD",
			"5E"
		],
		112,
		[
			"0",
			"189",
			"94"
		]
	],
	[
		[
			"7E",
			"BD",
			"9D"
		],
		113,
		[
			"126",
			"189",
			"157"
		]
	],
	[
		[
			"00",
			"81",
			"40"
		],
		114,
		[
			"0",
			"129",
			"64"
		]
	],
	[
		[
			"56",
			"81",
			"6B"
		],
		115,
		[
			"86",
			"129",
			"107"
		]
	],
	[
		[
			"00",
			"68",
			"34"
		],
		116,
		[
			"0",
			"104",
			"52"
		]
	],
	[
		[
			"45",
			"68",
			"56"
		],
		117,
		[
			"69",
			"104",
			"86"
		]
	],
	[
		[
			"00",
			"4F",
			"27"
		],
		118,
		[
			"0",
			"79",
			"39"
		]
	],
	[
		[
			"35",
			"4F",
			"42"
		],
		119,
		[
			"53",
			"79",
			"66"
		]
	],
	[
		[
			"00",
			"FF",
			"BF"
		],
		120,
		[
			"0",
			"255",
			"191"
		]
	],
	[
		[
			"AA",
			"FF",
			"EA"
		],
		121,
		[
			"170",
			"255",
			"234"
		]
	],
	[
		[
			"00",
			"BD",
			"8D"
		],
		122,
		[
			"0",
			"189",
			"141"
		]
	],
	[
		[
			"7E",
			"BD",
			"AD"
		],
		123,
		[
			"126",
			"189",
			"173"
		]
	],
	[
		[
			"00",
			"81",
			"60"
		],
		124,
		[
			"0",
			"129",
			"96"
		]
	],
	[
		[
			"56",
			"81",
			"76"
		],
		125,
		[
			"86",
			"129",
			"118"
		]
	],
	[
		[
			"00",
			"68",
			"4E"
		],
		126,
		[
			"0",
			"104",
			"78"
		]
	],
	[
		[
			"45",
			"68",
			"5F"
		],
		127,
		[
			"69",
			"104",
			"95"
		]
	],
	[
		[
			"00",
			"4F",
			"3B"
		],
		128,
		[
			"0",
			"79",
			"59"
		]
	],
	[
		[
			"35",
			"4F",
			"49"
		],
		129,
		[
			"53",
			"79",
			"73"
		]
	],
	[
		[
			"00",
			"FF",
			"FF"
		],
		130,
		[
			"0",
			"255",
			"255"
		]
	],
	[
		[
			"AA",
			"FF",
			"FF"
		],
		131,
		[
			"170",
			"255",
			"255"
		]
	],
	[
		[
			"00",
			"BD",
			"BD"
		],
		132,
		[
			"0",
			"189",
			"189"
		]
	],
	[
		[
			"7E",
			"BD",
			"BD"
		],
		133,
		[
			"126",
			"189",
			"189"
		]
	],
	[
		[
			"00",
			"81",
			"81"
		],
		134,
		[
			"0",
			"129",
			"129"
		]
	],
	[
		[
			"56",
			"81",
			"81"
		],
		135,
		[
			"86",
			"129",
			"129"
		]
	],
	[
		[
			"00",
			"68",
			"68"
		],
		136,
		[
			"0",
			"104",
			"104"
		]
	],
	[
		[
			"45",
			"68",
			"68"
		],
		137,
		[
			"69",
			"104",
			"104"
		]
	],
	[
		[
			"00",
			"4F",
			"4F"
		],
		138,
		[
			"0",
			"79",
			"79"
		]
	],
	[
		[
			"35",
			"4F",
			"4F"
		],
		139,
		[
			"53",
			"79",
			"79"
		]
	],
	[
		[
			"00",
			"BF",
			"FF"
		],
		140,
		[
			"0",
			"191",
			"255"
		]
	],
	[
		[
			"AA",
			"EA",
			"FF"
		],
		141,
		[
			"170",
			"234",
			"255"
		]
	],
	[
		[
			"00",
			"8D",
			"BD"
		],
		142,
		[
			"0",
			"141",
			"189"
		]
	],
	[
		[
			"7E",
			"AD",
			"BD"
		],
		143,
		[
			"126",
			"173",
			"189"
		]
	],
	[
		[
			"00",
			"60",
			"81"
		],
		144,
		[
			"0",
			"96",
			"129"
		]
	],
	[
		[
			"56",
			"76",
			"81"
		],
		145,
		[
			"86",
			"118",
			"129"
		]
	],
	[
		[
			"00",
			"4E",
			"68"
		],
		146,
		[
			"0",
			"78",
			"104"
		]
	],
	[
		[
			"45",
			"5F",
			"68"
		],
		147,
		[
			"69",
			"95",
			"104"
		]
	],
	[
		[
			"00",
			"3B",
			"4F"
		],
		148,
		[
			"0",
			"59",
			"79"
		]
	],
	[
		[
			"35",
			"49",
			"4F"
		],
		149,
		[
			"53",
			"73",
			"79"
		]
	],
	[
		[
			"00",
			"7F",
			"FF"
		],
		150,
		[
			"0",
			"127",
			"255"
		]
	],
	[
		[
			"AA",
			"D4",
			"FF"
		],
		151,
		[
			"170",
			"212",
			"255"
		]
	],
	[
		[
			"00",
			"5E",
			"BD"
		],
		152,
		[
			"0",
			"94",
			"189"
		]
	],
	[
		[
			"7E",
			"9D",
			"BD"
		],
		153,
		[
			"126",
			"157",
			"189"
		]
	],
	[
		[
			"00",
			"40",
			"81"
		],
		154,
		[
			"0",
			"64",
			"129"
		]
	],
	[
		[
			"56",
			"6B",
			"81"
		],
		155,
		[
			"86",
			"107",
			"129"
		]
	],
	[
		[
			"00",
			"34",
			"68"
		],
		156,
		[
			"0",
			"52",
			"104"
		]
	],
	[
		[
			"45",
			"56",
			"68"
		],
		157,
		[
			"69",
			"86",
			"104"
		]
	],
	[
		[
			"00",
			"27",
			"4F"
		],
		158,
		[
			"0",
			"39",
			"79"
		]
	],
	[
		[
			"35",
			"42",
			"4F"
		],
		159,
		[
			"53",
			"66",
			"79"
		]
	],
	[
		[
			"00",
			"3F",
			"FF"
		],
		160,
		[
			"0",
			"63",
			"255"
		]
	],
	[
		[
			"AA",
			"BF",
			"FF"
		],
		161,
		[
			"170",
			"191",
			"255"
		]
	],
	[
		[
			"00",
			"2E",
			"BD"
		],
		162,
		[
			"0",
			"46",
			"189"
		]
	],
	[
		[
			"7E",
			"8D",
			"BD"
		],
		163,
		[
			"126",
			"141",
			"189"
		]
	],
	[
		[
			"00",
			"1F",
			"81"
		],
		164,
		[
			"0",
			"31",
			"129"
		]
	],
	[
		[
			"56",
			"60",
			"81"
		],
		165,
		[
			"86",
			"96",
			"129"
		]
	],
	[
		[
			"00",
			"19",
			"68"
		],
		166,
		[
			"0",
			"25",
			"104"
		]
	],
	[
		[
			"45",
			"4E",
			"68"
		],
		167,
		[
			"69",
			"78",
			"104"
		]
	],
	[
		[
			"00",
			"13",
			"4F"
		],
		168,
		[
			"0",
			"19",
			"79"
		]
	],
	[
		[
			"35",
			"3B",
			"4F"
		],
		169,
		[
			"53",
			"59",
			"79"
		]
	],
	[
		[
			"00",
			"00",
			"FF"
		],
		170,
		[
			"0",
			"0",
			"255"
		]
	],
	[
		[
			"AA",
			"AA",
			"FF"
		],
		171,
		[
			"170",
			"170",
			"255"
		]
	],
	[
		[
			"00",
			"00",
			"BD"
		],
		172,
		[
			"0",
			"0",
			"189"
		]
	],
	[
		[
			"7E",
			"7E",
			"BD"
		],
		173,
		[
			"126",
			"126",
			"189"
		]
	],
	[
		[
			"00",
			"00",
			"81"
		],
		174,
		[
			"0",
			"0",
			"129"
		]
	],
	[
		[
			"56",
			"56",
			"81"
		],
		175,
		[
			"86",
			"86",
			"129"
		]
	],
	[
		[
			"00",
			"00",
			"68"
		],
		176,
		[
			"0",
			"0",
			"104"
		]
	],
	[
		[
			"45",
			"45",
			"68"
		],
		177,
		[
			"69",
			"69",
			"104"
		]
	],
	[
		[
			"00",
			"00",
			"4F"
		],
		178,
		[
			"0",
			"0",
			"79"
		]
	],
	[
		[
			"35",
			"35",
			"4F"
		],
		179,
		[
			"53",
			"53",
			"79"
		]
	],
	[
		[
			"3F",
			"00",
			"FF"
		],
		180,
		[
			"63",
			"0",
			"255"
		]
	],
	[
		[
			"BF",
			"AA",
			"FF"
		],
		181,
		[
			"191",
			"170",
			"255"
		]
	],
	[
		[
			"2E",
			"00",
			"BD"
		],
		182,
		[
			"46",
			"0",
			"189"
		]
	],
	[
		[
			"8D",
			"7E",
			"BD"
		],
		183,
		[
			"141",
			"126",
			"189"
		]
	],
	[
		[
			"1F",
			"00",
			"81"
		],
		184,
		[
			"31",
			"0",
			"129"
		]
	],
	[
		[
			"60",
			"56",
			"81"
		],
		185,
		[
			"96",
			"86",
			"129"
		]
	],
	[
		[
			"19",
			"00",
			"68"
		],
		186,
		[
			"25",
			"0",
			"104"
		]
	],
	[
		[
			"4E",
			"45",
			"68"
		],
		187,
		[
			"78",
			"69",
			"104"
		]
	],
	[
		[
			"13",
			"00",
			"4F"
		],
		188,
		[
			"19",
			"0",
			"79"
		]
	],
	[
		[
			"3B",
			"35",
			"4F"
		],
		189,
		[
			"59",
			"53",
			"79"
		]
	],
	[
		[
			"7F",
			"00",
			"FF"
		],
		190,
		[
			"127",
			"0",
			"255"
		]
	],
	[
		[
			"D4",
			"AA",
			"FF"
		],
		191,
		[
			"212",
			"170",
			"255"
		]
	],
	[
		[
			"5E",
			"00",
			"BD"
		],
		192,
		[
			"94",
			"0",
			"189"
		]
	],
	[
		[
			"9D",
			"7E",
			"BD"
		],
		193,
		[
			"157",
			"126",
			"189"
		]
	],
	[
		[
			"40",
			"00",
			"81"
		],
		194,
		[
			"64",
			"0",
			"129"
		]
	],
	[
		[
			"6B",
			"56",
			"81"
		],
		195,
		[
			"107",
			"86",
			"129"
		]
	],
	[
		[
			"34",
			"00",
			"68"
		],
		196,
		[
			"52",
			"0",
			"104"
		]
	],
	[
		[
			"56",
			"45",
			"68"
		],
		197,
		[
			"86",
			"69",
			"104"
		]
	],
	[
		[
			"27",
			"00",
			"4F"
		],
		198,
		[
			"39",
			"0",
			"79"
		]
	],
	[
		[
			"42",
			"35",
			"4F"
		],
		199,
		[
			"66",
			"53",
			"79"
		]
	],
	[
		[
			"BF",
			"00",
			"FF"
		],
		200,
		[
			"191",
			"0",
			"255"
		]
	],
	[
		[
			"EA",
			"AA",
			"FF"
		],
		201,
		[
			"234",
			"170",
			"255"
		]
	],
	[
		[
			"8D",
			"00",
			"BD"
		],
		202,
		[
			"141",
			"0",
			"189"
		]
	],
	[
		[
			"AD",
			"7E",
			"BD"
		],
		203,
		[
			"173",
			"126",
			"189"
		]
	],
	[
		[
			"60",
			"00",
			"81"
		],
		204,
		[
			"96",
			"0",
			"129"
		]
	],
	[
		[
			"76",
			"56",
			"81"
		],
		205,
		[
			"118",
			"86",
			"129"
		]
	],
	[
		[
			"4E",
			"00",
			"68"
		],
		206,
		[
			"78",
			"0",
			"104"
		]
	],
	[
		[
			"5F",
			"45",
			"68"
		],
		207,
		[
			"95",
			"69",
			"104"
		]
	],
	[
		[
			"3B",
			"00",
			"4F"
		],
		208,
		[
			"59",
			"0",
			"79"
		]
	],
	[
		[
			"49",
			"35",
			"4F"
		],
		209,
		[
			"73",
			"53",
			"79"
		]
	],
	[
		[
			"FF",
			"00",
			"FF"
		],
		210,
		[
			"255",
			"0",
			"255"
		]
	],
	[
		[
			"FF",
			"AA",
			"FF"
		],
		211,
		[
			"255",
			"170",
			"255"
		]
	],
	[
		[
			"BD",
			"00",
			"BD"
		],
		212,
		[
			"189",
			"0",
			"189"
		]
	],
	[
		[
			"BD",
			"7E",
			"BD"
		],
		213,
		[
			"189",
			"126",
			"189"
		]
	],
	[
		[
			"81",
			"00",
			"81"
		],
		214,
		[
			"129",
			"0",
			"129"
		]
	],
	[
		[
			"81",
			"56",
			"81"
		],
		215,
		[
			"129",
			"86",
			"129"
		]
	],
	[
		[
			"68",
			"00",
			"68"
		],
		216,
		[
			"104",
			"0",
			"104"
		]
	],
	[
		[
			"68",
			"45",
			"68"
		],
		217,
		[
			"104",
			"69",
			"104"
		]
	],
	[
		[
			"4F",
			"00",
			"4F"
		],
		218,
		[
			"79",
			"0",
			"79"
		]
	],
	[
		[
			"4F",
			"35",
			"4F"
		],
		219,
		[
			"79",
			"53",
			"79"
		]
	],
	[
		[
			"FF",
			"00",
			"BF"
		],
		220,
		[
			"255",
			"0",
			"191"
		]
	],
	[
		[
			"FF",
			"AA",
			"EA"
		],
		221,
		[
			"255",
			"170",
			"234"
		]
	],
	[
		[
			"BD",
			"00",
			"8D"
		],
		222,
		[
			"189",
			"0",
			"141"
		]
	],
	[
		[
			"BD",
			"7E",
			"AD"
		],
		223,
		[
			"189",
			"126",
			"173"
		]
	],
	[
		[
			"81",
			"00",
			"60"
		],
		224,
		[
			"129",
			"0",
			"96"
		]
	],
	[
		[
			"81",
			"56",
			"76"
		],
		225,
		[
			"129",
			"86",
			"118"
		]
	],
	[
		[
			"68",
			"00",
			"4E"
		],
		226,
		[
			"104",
			"0",
			"78"
		]
	],
	[
		[
			"68",
			"45",
			"5F"
		],
		227,
		[
			"104",
			"69",
			"95"
		]
	],
	[
		[
			"4F",
			"00",
			"3B"
		],
		228,
		[
			"79",
			"0",
			"59"
		]
	],
	[
		[
			"4F",
			"35",
			"49"
		],
		229,
		[
			"79",
			"53",
			"73"
		]
	],
	[
		[
			"FF",
			"00",
			"7F"
		],
		230,
		[
			"255",
			"0",
			"127"
		]
	],
	[
		[
			"FF",
			"AA",
			"D4"
		],
		231,
		[
			"255",
			"170",
			"212"
		]
	],
	[
		[
			"BD",
			"00",
			"5E"
		],
		232,
		[
			"189",
			"0",
			"94"
		]
	],
	[
		[
			"BD",
			"7E",
			"9D"
		],
		233,
		[
			"189",
			"126",
			"157"
		]
	],
	[
		[
			"81",
			"00",
			"40"
		],
		234,
		[
			"129",
			"0",
			"64"
		]
	],
	[
		[
			"81",
			"56",
			"6B"
		],
		235,
		[
			"129",
			"86",
			"107"
		]
	],
	[
		[
			"68",
			"00",
			"34"
		],
		236,
		[
			"104",
			"0",
			"52"
		]
	],
	[
		[
			"68",
			"45",
			"56"
		],
		237,
		[
			"104",
			"69",
			"86"
		]
	],
	[
		[
			"4F",
			"00",
			"27"
		],
		238,
		[
			"79",
			"0",
			"39"
		]
	],
	[
		[
			"4F",
			"35",
			"42"
		],
		239,
		[
			"79",
			"53",
			"66"
		]
	],
	[
		[
			"FF",
			"00",
			"3F"
		],
		240,
		[
			"255",
			"0",
			"63"
		]
	],
	[
		[
			"FF",
			"AA",
			"BF"
		],
		241,
		[
			"255",
			"170",
			"191"
		]
	],
	[
		[
			"BD",
			"00",
			"2E"
		],
		242,
		[
			"189",
			"0",
			"46"
		]
	],
	[
		[
			"BD",
			"7E",
			"8D"
		],
		243,
		[
			"189",
			"126",
			"141"
		]
	],
	[
		[
			"81",
			"00",
			"1F"
		],
		244,
		[
			"129",
			"0",
			"31"
		]
	],
	[
		[
			"81",
			"56",
			"60"
		],
		245,
		[
			"129",
			"86",
			"96"
		]
	],
	[
		[
			"68",
			"00",
			"19"
		],
		246,
		[
			"104",
			"0",
			"25"
		]
	],
	[
		[
			"68",
			"45",
			"4E"
		],
		247,
		[
			"104",
			"69",
			"78"
		]
	],
	[
		[
			"4F",
			"00",
			"13"
		],
		248,
		[
			"79",
			"0",
			"19"
		]
	],
	[
		[
			"4F",
			"35",
			"3B"
		],
		249,
		[
			"79",
			"53",
			"59"
		]
	],
	[
		[
			"33",
			"33",
			"33"
		],
		250,
		[
			"51",
			"51",
			"51"
		]
	],
	[
		[
			"50",
			"50",
			"50"
		],
		251,
		[
			"80",
			"80",
			"80"
		]
	],
	[
		[
			"69",
			"69",
			"69"
		],
		252,
		[
			"105",
			"105",
			"105"
		]
	],
	[
		[
			"82",
			"82",
			"82"
		],
		253,
		[
			"130",
			"130",
			"130"
		]
	],
	[
		[
			"BE",
			"BE",
			"BE"
		],
		254,
		[
			"190",
			"190",
			"190"
		]
	],
	[
		[
			"FF",
			"FF",
			"FF"
		],
		255,
		[
			"255",
			"255",
			"255"
		]
	]
];
function aciHex(aci) {
	let color = "";
	const c = acicolors.find((l) => {
		const [, _aci] = l;
		return _aci === aci;
	});
	if (c) {
		const [h] = c;
		const [f, s, t] = h;
		color = `${f}${s}${t}`;
	}
	return color;
}
//#endregion
//#region src/Sections/EntitiesSection/Entities/Hatch.ts
let HatchPredefinedPatterns = /* @__PURE__ */ function(HatchPredefinedPatterns) {
	HatchPredefinedPatterns["SOLID"] = "SOLID";
	HatchPredefinedPatterns["ANGLE"] = "ANGLE";
	HatchPredefinedPatterns["ANSI31"] = "ANSI31";
	HatchPredefinedPatterns["ANSI32"] = "ANSI32";
	HatchPredefinedPatterns["ANSI33"] = "ANSI33";
	HatchPredefinedPatterns["ANSI34"] = "ANSI34";
	HatchPredefinedPatterns["ANSI35"] = "ANSI35";
	HatchPredefinedPatterns["ANSI36"] = "ANSI36";
	HatchPredefinedPatterns["ANSI37"] = "ANSI37";
	HatchPredefinedPatterns["ANSI38"] = "ANSI38";
	HatchPredefinedPatterns["AR_B816"] = "AR_B816";
	HatchPredefinedPatterns["AR_B816C"] = "AR_B816C";
	HatchPredefinedPatterns["AR_B88"] = "AR_B88";
	HatchPredefinedPatterns["AR_BRELM"] = "AR_BRELM";
	HatchPredefinedPatterns["AR_BRSTD"] = "AR_BRSTD";
	HatchPredefinedPatterns["AR_CONC"] = "AR_CONC";
	HatchPredefinedPatterns["AR_HBONE"] = "AR_HBONE";
	HatchPredefinedPatterns["AR_PARQ1"] = "AR_PARQ1";
	HatchPredefinedPatterns["AR_RROOF"] = "AR_RROOF";
	HatchPredefinedPatterns["AR_RSHKE"] = "AR_RSHKE";
	HatchPredefinedPatterns["AR_SAND"] = "AR_SAND";
	HatchPredefinedPatterns["BOX"] = "BOX";
	HatchPredefinedPatterns["BRASS"] = "BRASS";
	HatchPredefinedPatterns["BRICK"] = "BRICK";
	HatchPredefinedPatterns["BRSTONE"] = "BRSTONE";
	HatchPredefinedPatterns["CLAY"] = "CLAY";
	HatchPredefinedPatterns["CORK"] = "CORK";
	HatchPredefinedPatterns["CROSS"] = "CROSS";
	HatchPredefinedPatterns["DASH"] = "DASH";
	HatchPredefinedPatterns["DOLMIT"] = "DOLMIT";
	HatchPredefinedPatterns["DOTS"] = "DOTS";
	HatchPredefinedPatterns["EARTH"] = "EARTH";
	HatchPredefinedPatterns["ESCHER"] = "ESCHER";
	HatchPredefinedPatterns["FLEX"] = "FLEX";
	HatchPredefinedPatterns["GOST_GLASS"] = "GOST_GLASS";
	HatchPredefinedPatterns["GOST_WOOD"] = "GOST_WOOD";
	HatchPredefinedPatterns["GOST_GROUND"] = "GOST_GROUND";
	HatchPredefinedPatterns["GRASS"] = "GRASS";
	HatchPredefinedPatterns["GRATE"] = "GRATE";
	HatchPredefinedPatterns["GRAVEL"] = "GRAVEL";
	HatchPredefinedPatterns["HEX"] = "HEX";
	HatchPredefinedPatterns["HONEY"] = "HONEY";
	HatchPredefinedPatterns["HOUND"] = "HOUND";
	HatchPredefinedPatterns["INSUL"] = "INSUL";
	HatchPredefinedPatterns["ACAD_ISO02W100"] = "ACAD_ISO02W100";
	HatchPredefinedPatterns["ACAD_ISO03W100"] = "ACAD_ISO03W100";
	HatchPredefinedPatterns["ACAD_ISO04W100"] = "ACAD_ISO04W100";
	HatchPredefinedPatterns["ACAD_ISO05W100"] = "ACAD_ISO05W100";
	HatchPredefinedPatterns["ACAD_ISO06W100"] = "ACAD_ISO06W100";
	HatchPredefinedPatterns["ACAD_ISO07W100"] = "ACAD_ISO07W100";
	HatchPredefinedPatterns["ACAD_ISO08W100"] = "ACAD_ISO08W100";
	HatchPredefinedPatterns["ACAD_ISO09W100"] = "ACAD_ISO09W100";
	HatchPredefinedPatterns["ACAD_ISO10W100"] = "ACAD_ISO10W100";
	HatchPredefinedPatterns["ACAD_ISO11W100"] = "ACAD_ISO11W100";
	HatchPredefinedPatterns["ACAD_ISO12W100"] = "ACAD_ISO12W100";
	HatchPredefinedPatterns["ACAD_ISO13W100"] = "ACAD_ISO13W100";
	HatchPredefinedPatterns["ACAD_ISO14W100"] = "ACAD_ISO14W100";
	HatchPredefinedPatterns["ACAD_ISO15W100"] = "ACAD_ISO15W100";
	HatchPredefinedPatterns["JIS_LC_20"] = "JIS_LC_20";
	HatchPredefinedPatterns["JIS_LC_20A"] = "JIS_LC_20A";
	HatchPredefinedPatterns["JIS_LC_8"] = "JIS_LC_8";
	HatchPredefinedPatterns["JIS_LC_8A"] = "JIS_LC_8A";
	HatchPredefinedPatterns["JIS_RC_10"] = "JIS_RC_10";
	HatchPredefinedPatterns["JIS_RC_15"] = "JIS_RC_15";
	HatchPredefinedPatterns["JIS_RC_18"] = "JIS_RC_18";
	HatchPredefinedPatterns["JIS_RC_30"] = "JIS_RC_30";
	HatchPredefinedPatterns["JIS_STN_1E"] = "JIS_STN_1E";
	HatchPredefinedPatterns["JIS_STN_2_5"] = "JIS_STN_2_5";
	HatchPredefinedPatterns["JIS_WOOD"] = "JIS_WOOD";
	HatchPredefinedPatterns["LINE"] = "LINE";
	HatchPredefinedPatterns["MUDST"] = "MUDST";
	HatchPredefinedPatterns["NET"] = "NET";
	HatchPredefinedPatterns["NET3"] = "NET3";
	HatchPredefinedPatterns["PLAST"] = "PLAST";
	HatchPredefinedPatterns["PLASTI"] = "PLASTI";
	HatchPredefinedPatterns["SACNCR"] = "SACNCR";
	HatchPredefinedPatterns["SQUARE"] = "SQUARE";
	HatchPredefinedPatterns["STARS"] = "STARS";
	HatchPredefinedPatterns["STEEL"] = "STEEL";
	HatchPredefinedPatterns["SWAMP"] = "SWAMP";
	HatchPredefinedPatterns["TRANS"] = "TRANS";
	HatchPredefinedPatterns["TRIANG"] = "TRIANG";
	HatchPredefinedPatterns["ZIGZAG"] = "ZIGZAG";
	return HatchPredefinedPatterns;
}({});
let HatchPatternType = /* @__PURE__ */ function(HatchPatternType) {
	HatchPatternType[HatchPatternType["UserDefined"] = 0] = "UserDefined";
	HatchPatternType[HatchPatternType["Predifined"] = 1] = "Predifined";
	HatchPatternType[HatchPatternType["Custom"] = 2] = "Custom";
	return HatchPatternType;
}({});
function vertex(x, y, bulge) {
	if (bulge) return {
		x,
		y,
		bulge
	};
	else return {
		x,
		y
	};
}
var HatchPolylineBoundary = class {
	constructor(verticies) {
		this.vertices = verticies || [];
	}
	add(vertex) {
		this.vertices.push(vertex);
	}
	dxfy(dx) {
		const bulge = this.vertices.find((v) => v.bulge) ? true : false;
		dx.push(72, Number(bulge));
		dx.push(73, 1);
		dx.push(93, this.vertices.length);
		for (const v of this.vertices) {
			dx.point2d(v);
			if (bulge) dx.push(42, v.bulge || 0);
		}
		dx.push(97, 0);
	}
};
let PathTypeFlag = /* @__PURE__ */ function(PathTypeFlag) {
	PathTypeFlag[PathTypeFlag["Default"] = 0] = "Default";
	PathTypeFlag[PathTypeFlag["External"] = 1] = "External";
	PathTypeFlag[PathTypeFlag["Polyline"] = 2] = "Polyline";
	PathTypeFlag[PathTypeFlag["Derived"] = 4] = "Derived";
	PathTypeFlag[PathTypeFlag["Textbox"] = 8] = "Textbox";
	PathTypeFlag[PathTypeFlag["Outermost"] = 16] = "Outermost";
	return PathTypeFlag;
}({});
var HatchBoundaryPaths = class {
	constructor() {
		this.pathTypeFlag = 5;
		this.polylineBoundaries = [];
		this.edgesTypeDatas = [];
	}
	get length() {
		let count = 0;
		if (this.isPolyline()) count += this.polylineBoundaries.length;
		else if (this.isEdges()) this.edgesTypeDatas.forEach((data) => {
			count += data.edgesData.length;
		});
		return count;
	}
	addPolylineBoundary(polylineBoundary) {
		if ((this.pathTypeFlag & 2) !== 2) this.pathTypeFlag |= 2;
		this.polylineBoundaries.push(polylineBoundary);
	}
	isPolyline() {
		return this.polylineBoundaries && (this.pathTypeFlag & 2) === 2;
	}
	isEdges() {
		return this.edgesTypeDatas && (this.pathTypeFlag & 2) !== 2;
	}
	addEdgesTypeData(edgesTypeData) {
		if ((this.pathTypeFlag & 2) !== 2) this.pathTypeFlag ^= 2;
		this.edgesTypeDatas.push(edgesTypeData);
	}
	dxfy(dx) {
		if (this.isPolyline()) this.polylineBoundaries.forEach((polyline) => {
			dx.push(92, this.pathTypeFlag);
			polyline.dxfy(dx);
		});
		else if (this.isEdges()) this.edgesTypeDatas.forEach((data) => {
			dx.push(92, this.pathTypeFlag);
			data.dxfy(dx);
		});
		else throw new Error("The boundary path is empty!");
	}
};
var HatchLineEdgeData = class {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}
	dxfy(dx) {
		dx.point2d(this.start);
		dx.push(11, this.end.x);
		dx.push(21, this.end.y);
	}
};
var HatchArcEdgeData = class {
	constructor(center, raduis, startAngle, endAngle, isCounterClockwise) {
		this.center = center;
		this.raduis = raduis;
		this.startAngle = startAngle;
		this.endAngle = endAngle;
		this.isCounterClockwise = isCounterClockwise;
	}
	dxfy(dx) {
		dx.point2d(this.center);
		dx.push(40, this.raduis);
		dx.push(50, this.startAngle);
		dx.push(51, this.endAngle);
		dx.push(73, Number(this.isCounterClockwise));
	}
};
var HatchEdgesTypeData = class {
	constructor() {
		this.edgesData = [];
	}
	addLineEdgeData(start, end) {
		this.edgesData.push(new HatchLineEdgeData(start, end));
	}
	addArcEdgeData(center, raduis, startAngle, endAngle, isCounterClockwise) {
		this.edgesData.push(new HatchArcEdgeData(center, raduis, startAngle, endAngle, isCounterClockwise));
	}
	dxfy(dx) {
		for (const edge of this.edgesData) edge.dxfy(dx);
	}
};
let SolidFillFlag = /* @__PURE__ */ function(SolidFillFlag) {
	SolidFillFlag[SolidFillFlag["SolidFill"] = 1] = "SolidFill";
	SolidFillFlag[SolidFillFlag["PatternFill"] = 0] = "PatternFill";
	return SolidFillFlag;
}({});
let AssociativityFlag = /* @__PURE__ */ function(AssociativityFlag) {
	AssociativityFlag[AssociativityFlag["NonAssociative"] = 0] = "NonAssociative";
	AssociativityFlag[AssociativityFlag["Associative"] = 1] = "Associative";
	return AssociativityFlag;
}({});
let HatchStyle = /* @__PURE__ */ function(HatchStyle) {
	HatchStyle[HatchStyle["Normal"] = 0] = "Normal";
	HatchStyle[HatchStyle["Outer"] = 1] = "Outer";
	HatchStyle[HatchStyle["Ignore"] = 2] = "Ignore";
	return HatchStyle;
}({});
let GradientType = /* @__PURE__ */ function(GradientType) {
	GradientType["LINEAR"] = "LINEAR";
	GradientType["CYLINDER"] = "CYLINDER";
	GradientType["INVCYLINDER"] = "INVCYLINDER";
	GradientType["SPHERICAL"] = "SPHERICAL";
	GradientType["HEMISPHERICAL"] = "HEMISPHERICAL";
	GradientType["CURVED"] = "CURVED";
	GradientType["INVSPHERICAL"] = "SPHERICAL";
	GradientType["INVHEMISPHERICAL"] = "INVHEMISPHERICAL";
	GradientType["INVCURVED"] = "INVCURVED";
	return GradientType;
}({});
function gradient(fill) {
	return fill;
}
function pattern(fill) {
	return fill;
}
var Hatch = class extends Entity {
	get patternName() {
		let _patternName = "SOLID";
		if (this.isPattern(this.fill)) _patternName = this.fill.name;
		return _patternName;
	}
	get solidFillFlag() {
		if (this.patternName === "SOLID") return 1;
		else return 0;
	}
	constructor(boundaryPath, fill, options) {
		super("HATCH", "AcDbHatch", options);
		this.fill = fill;
		this.elevation = options?.elevation || 0;
		this.extrusion = options?.extrusion || point3d(0, 0, 1);
		this.boundaryPath = boundaryPath;
	}
	pattern(dx, fill) {
		const name = fill.name;
		const angle = fill.angle ?? 0;
		const scale = fill.scale || 1;
		const double = fill.double || false;
		dx.push(52, angle);
		dx.push(41, scale);
		dx.push(77, Number(double));
		const pattern = PredefinedHatchPatterns.get(name);
		if (pattern) {
			pattern.scale = scale;
			if (angle !== 0) pattern.angle = angle;
			pattern.dxfy(dx);
		}
	}
	gradient(dx, fill) {
		const firstColor = fill.firstColor;
		const secondColor = fill.secondColor ?? 7;
		const angle = fill.angle ?? 0;
		const definition = fill.definition || 0;
		const tint = fill.tint ?? 1;
		const type = fill.type || "LINEAR";
		dx.push(450, 1);
		dx.push(451, 0);
		dx.push(460, angle);
		dx.push(461, definition);
		dx.push(452, fill.secondColor ? 0 : 1);
		dx.push(462, tint);
		dx.push(453, 2);
		dx.push(463, 0);
		dx.push(63, firstColor);
		dx.push(421, TrueColor.fromHex(aciHex(firstColor)));
		dx.push(463, 1);
		dx.push(63, secondColor);
		dx.push(421, TrueColor.fromHex(aciHex(secondColor)));
		dx.push(470, type);
	}
	isPattern(fill) {
		return "name" in fill;
	}
	boundingBox() {
		return BoundingBox.pointBBox(point3d(0, 0));
	}
	dxfyChild(dx) {
		dx.point3d(point3d(0, 0, this.elevation));
		dx.push(210, this.extrusion?.x);
		dx.push(220, this.extrusion?.y);
		dx.push(230, this.extrusion?.z);
		dx.name(this.patternName);
		dx.push(70, this.solidFillFlag);
		dx.push(71, 0);
		dx.push(91, this.boundaryPath.length);
		this.boundaryPath.dxfy(dx);
		dx.push(75, 1);
		dx.push(76, 1);
		if (this.isPattern(this.fill)) {
			if (this.solidFillFlag === 0) this.pattern(dx, this.fill);
			dx.push(47, 1);
			dx.push(98, 0);
		} else {
			dx.push(47, 1);
			dx.push(98, 0);
			this.gradient(dx, this.fill);
		}
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Image.ts
let ImageDisplayFlags = /* @__PURE__ */ function(ImageDisplayFlags) {
	ImageDisplayFlags[ImageDisplayFlags["ShowImage"] = 1] = "ShowImage";
	ImageDisplayFlags[ImageDisplayFlags["ShowImageWhenNotAlignedWithScreen"] = 2] = "ShowImageWhenNotAlignedWithScreen";
	ImageDisplayFlags[ImageDisplayFlags["UseClippingBoundary"] = 4] = "UseClippingBoundary";
	ImageDisplayFlags[ImageDisplayFlags["TransparencyIsOn"] = 8] = "TransparencyIsOn";
	return ImageDisplayFlags;
}({});
let ImageClippingType = /* @__PURE__ */ function(ImageClippingType) {
	ImageClippingType[ImageClippingType["Rectangular"] = 1] = "Rectangular";
	ImageClippingType[ImageClippingType["Polygonal"] = 2] = "Polygonal";
	return ImageClippingType;
}({});
let ImageClippingStateFlag = /* @__PURE__ */ function(ImageClippingStateFlag) {
	ImageClippingStateFlag[ImageClippingStateFlag["Off"] = 0] = "Off";
	ImageClippingStateFlag[ImageClippingStateFlag["On"] = 1] = "On";
	return ImageClippingStateFlag;
}({});
let ImageClipModeFlag = /* @__PURE__ */ function(ImageClipModeFlag) {
	ImageClipModeFlag[ImageClipModeFlag["Outside"] = 0] = "Outside";
	ImageClipModeFlag[ImageClipModeFlag["Inside"] = 1] = "Inside";
	return ImageClipModeFlag;
}({});
var Image = class extends Entity {
	#clipBoundaryVertices;
	constructor(imageArgs, options) {
		super("IMAGE", "AcDbRasterImage", options);
		this.width = imageArgs.width;
		this.height = imageArgs.height;
		this.scale = imageArgs.scale;
		this.rotation = imageArgs.rotation;
		this.insertionPoint = imageArgs.insertionPoint;
		this.ratio = this.scale / this.width;
		this.imageDefHandle = imageArgs.imageDefHandle;
		this.imageDisplayFlags = options?.imageDisplayFlags || 3;
		this.clippingStateFlag = options?.clippingStateFlag || 1;
		this.clipModeFlag = options?.clipModeFlag || 1;
		this.clippingType = options?.clippingType || 1;
		this.brightness = options?.brightness || 50;
		this.contrast = options?.brightness || 50;
		this.fade = options?.fade || 0;
		this.#clipBoundaryVertices = [];
		this.classVersion = options?.classVersion || 0;
		this.resetClipping();
	}
	/**
	\*
	\* @param verticies - The clip boundary verticies.
	\* @param clippingType - The clipping boundary type.
	\*/
	setClipBoundaryVerticies(verticies, clippingType) {
		if (clippingType === 1) {
			if (verticies.length == 2) this.#clipBoundaryVertices = verticies;
			else throw new Error("The number of vertices should be 2 in rectangular clipping !");
		} else if (verticies.length >= 3) this.#clipBoundaryVertices = verticies;
		else throw new Error("The number of vertices should be >= 3 in polygonal clipping !");
		this.#clipBoundaryVertices = [];
		this.#clipBoundaryVertices.push(...verticies);
	}
	resetClipping() {
		const verticies = [point2d(-.5, -.5), point2d(this.width - .5, this.height - .5)];
		this.setClipBoundaryVerticies(verticies, 1);
	}
	_vector() {
		return point2d(this.ratio * Math.cos(this.rotation * Math.PI / 180), this.ratio * Math.sin(this.rotation * Math.PI / 180));
	}
	_uVector() {
		const v = this._vector();
		return point3d(v.x, -v.y, 0);
	}
	_vVector() {
		const v = this._vector();
		return point3d(v.y, v.x, 0);
	}
	boundingBox() {
		const width = this.scale;
		const height = this.width / this.height * this.scale;
		const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
		return BoundingBox.centerRadiusBBox(this.insertionPoint, diagonal);
	}
	dxfyChild(dx) {
		dx.push(90, this.classVersion);
		dx.point3d(this.insertionPoint);
		dx.point3d(this._uVector(), 1);
		dx.point3d(this._vVector(), 2);
		dx.push(13, this.width);
		dx.push(23, this.height);
		dx.push(340, this.imageDefHandle);
		dx.push(70, this.imageDisplayFlags);
		dx.push(280, this.clippingStateFlag);
		dx.push(281, this.brightness);
		dx.push(282, this.contrast);
		dx.push(283, this.fade);
		dx.push(360, this.imageDefReactorHandle);
		dx.push(71, this.clippingType);
		dx.push(91, this.#clipBoundaryVertices.length);
		this.#clipBoundaryVertices.forEach((v) => dx.point2d(v, 4));
		dx.push(290, this.clipModeFlag);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Insert.ts
var Insert = class extends Entity {
	constructor(blockName, insertionPoint, options) {
		super("INSERT", "AcDbBlockReference", options);
		this.blockName = blockName;
		this.insertionPoint = insertionPoint;
		this.scaleFactor = options?.scaleFactor || point3d(1, 1, 1);
		this.rotationAngle = options?.rotationAngle ?? 0;
		this.columnCount = options?.columnCount ?? 1;
		this.rowCount = options?.rowCount ?? 1;
		this.columnSpacing = options?.columnSpacing ?? 0;
		this.rowSpacing = options?.rowSpacing ?? 0;
		this.attributesFollowFlag = options?.rowSpacing ?? 0;
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.insertionPoint);
	}
	dxfyChild(dx) {
		dx.name(this.blockName);
		dx.point3d(this.insertionPoint);
		dx.push(41, this.scaleFactor.x);
		dx.push(42, this.scaleFactor.y);
		dx.push(43, this.scaleFactor.z);
		dx.push(50, this.rotationAngle);
		dx.push(66, this.attributesFollowFlag);
		dx.push(70, this.columnCount);
		dx.push(71, this.rowCount);
		dx.push(44, this.columnSpacing);
		dx.push(45, this.rowSpacing);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Leader.ts
let ArrowHeadFlag = /* @__PURE__ */ function(ArrowHeadFlag) {
	ArrowHeadFlag[ArrowHeadFlag["Disabed"] = 0] = "Disabed";
	ArrowHeadFlag[ArrowHeadFlag["Enabled"] = 1] = "Enabled";
	return ArrowHeadFlag;
}({});
let LeaderPathType = /* @__PURE__ */ function(LeaderPathType) {
	LeaderPathType[LeaderPathType["StraightLine"] = 0] = "StraightLine";
	LeaderPathType[LeaderPathType["Spline"] = 1] = "Spline";
	return LeaderPathType;
}({});
var Leader = class extends Entity {
	constructor(vertices, options) {
		super("LEADER", "AcDbLeader", options);
		this.vertices = vertices;
		this.flag = options?.flag ?? 1;
		this.leaderPathType = options?.leaderPathType ?? 0;
		this.dimensionStyleName = options?.dimensionStyleName || "Standard";
	}
	boundingBox() {
		return BoundingBox.verticesBBox(this.vertices);
	}
	dxfyChild(dx) {
		dx.push(3, this.dimensionStyleName);
		dx.push(71, this.flag);
		dx.push(72, this.leaderPathType);
		dx.push(76, this.vertices.length);
		this.vertices.forEach((vertex) => dx.point3d(vertex));
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Line.ts
var Line = class extends Entity {
	constructor(startPoint, endPoint, options) {
		super("LINE", "AcDbLine", options);
		this.startPoint = startPoint;
		this.endPoint = endPoint;
	}
	boundingBox() {
		return BoundingBox.lineBBox(this.startPoint, this.endPoint);
	}
	dxfyChild(dx) {
		dx.point3d(this.startPoint);
		dx.point3d(this.endPoint, 1);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/LWPolyline.ts
let LWPolylineFlags = /* @__PURE__ */ function(LWPolylineFlags) {
	LWPolylineFlags[LWPolylineFlags["None"] = 0] = "None";
	LWPolylineFlags[LWPolylineFlags["Closed"] = 1] = "Closed";
	LWPolylineFlags[LWPolylineFlags["Plinegen"] = 128] = "Plinegen";
	return LWPolylineFlags;
}({});
var LWPolyline = class extends Entity {
	constructor(vertices, options) {
		super("LWPOLYLINE", "AcDbPolyline", options);
		this.vertices = vertices;
		this.flags = options?.flags || 0;
		this.constantWidth = options?.constantWidth || 0;
		this.elevation = options?.elevation || 0;
		this.thickness = options?.thickness || 0;
	}
	boundingBox() {
		return BoundingBox.verticesBBox(this.vertices.map((vertex) => point3d(vertex.point.x, vertex.point.y, 0)));
	}
	dxfyChild(dx) {
		dx.push(90, this.vertices.length);
		dx.push(70, this.flags || 0);
		if (!this.vertices.find((v) => {
			return (v.startingWidth ?? 0) > 0 && (v.endWidth ?? 0) > 0;
		})) dx.push(43, this.constantWidth);
		dx.elevation(this.elevation);
		dx.thickness(this.thickness);
		for (const v of this.vertices) {
			dx.point2d(v.point);
			dx.push(40, v.startingWidth);
			dx.push(41, v.endWidth);
			dx.push(42, v.bulge);
		}
		dx.push(210, this.extrusion?.x);
		dx.push(220, this.extrusion?.y);
		dx.push(230, this.extrusion?.z);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/MText.ts
let MTextAttachmentPoint = /* @__PURE__ */ function(MTextAttachmentPoint) {
	MTextAttachmentPoint[MTextAttachmentPoint["TopLeft"] = 1] = "TopLeft";
	MTextAttachmentPoint[MTextAttachmentPoint["TopCenter"] = 2] = "TopCenter";
	MTextAttachmentPoint[MTextAttachmentPoint["TopRight"] = 3] = "TopRight";
	MTextAttachmentPoint[MTextAttachmentPoint["MiddleLeft"] = 4] = "MiddleLeft";
	MTextAttachmentPoint[MTextAttachmentPoint["MiddleCenter"] = 5] = "MiddleCenter";
	MTextAttachmentPoint[MTextAttachmentPoint["MiddleRight"] = 6] = "MiddleRight";
	MTextAttachmentPoint[MTextAttachmentPoint["BottomLeft"] = 7] = "BottomLeft";
	MTextAttachmentPoint[MTextAttachmentPoint["BottomCenter"] = 8] = "BottomCenter";
	MTextAttachmentPoint[MTextAttachmentPoint["BottomRight"] = 9] = "BottomRight";
	return MTextAttachmentPoint;
}({});
let MTextDrawingDirection = /* @__PURE__ */ function(MTextDrawingDirection) {
	MTextDrawingDirection[MTextDrawingDirection["LeftToRight"] = 1] = "LeftToRight";
	MTextDrawingDirection[MTextDrawingDirection["TopToBottom"] = 3] = "TopToBottom";
	MTextDrawingDirection[MTextDrawingDirection["ByStyle"] = 5] = "ByStyle";
	return MTextDrawingDirection;
}({});
let MTextLineSpacingStyle = /* @__PURE__ */ function(MTextLineSpacingStyle) {
	MTextLineSpacingStyle[MTextLineSpacingStyle["AtLeast"] = 1] = "AtLeast";
	MTextLineSpacingStyle[MTextLineSpacingStyle["Exact"] = 2] = "Exact";
	return MTextLineSpacingStyle;
}({});
var MText = class extends Entity {
	constructor(firstAlignmentPoint, height, value, options) {
		super("MTEXT", "AcDbMText", options);
		this.position = firstAlignmentPoint;
		this.height = height;
		this.value = value;
		this.textStyle = "STANDARD";
		this.rotation = options?.rotation;
		this.attachmentPoint = options?.attachmentPoint;
		this.drawingDirection = options?.drawingDirection;
		this.lineSpacingStyle = options?.lineSpacingStyle;
		this.width = options?.width;
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.position);
	}
	dxfyChild(dx) {
		dx.point3d(this.position);
		dx.push(40, this.height);
		dx.push(41, this.width);
		dx.push(71, this.attachmentPoint);
		dx.push(72, this.drawingDirection);
		dx.push(73, this.lineSpacingStyle);
		dx.primaryText(this.value);
		dx.push(50, this.rotation);
		dx.textStyle(this.textStyle);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Point.ts
var Point = class extends Entity {
	constructor(x, y, z, options) {
		super("POINT", "AcDbPoint", options);
		this.x = x;
		this.y = y;
		this.z = z;
	}
	boundingBox() {
		return BoundingBox.pointBBox(point3d(this.x, this.y, this.z));
	}
	dxfyChild(dx) {
		dx.point3d(point3d(this.x, this.y, this.z));
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Vertex.ts
let VertexFlags = /* @__PURE__ */ function(VertexFlags) {
	VertexFlags[VertexFlags["None"] = 0] = "None";
	VertexFlags[VertexFlags["ExtraVertex"] = 1] = "ExtraVertex";
	VertexFlags[VertexFlags["CurveFit"] = 2] = "CurveFit";
	VertexFlags[VertexFlags["NotUsed"] = 4] = "NotUsed";
	VertexFlags[VertexFlags["SplineVertex"] = 8] = "SplineVertex";
	VertexFlags[VertexFlags["SplineFrame"] = 16] = "SplineFrame";
	VertexFlags[VertexFlags["Polyline3dVertex"] = 32] = "Polyline3dVertex";
	VertexFlags[VertexFlags["Polygon3dMesh"] = 64] = "Polygon3dMesh";
	VertexFlags[VertexFlags["PolyfaceMeshVertex"] = 128] = "PolyfaceMeshVertex";
	return VertexFlags;
}({});
var Vertex = class extends Entity {
	constructor(point, options) {
		super("VERTEX", "AcDbVertex", options);
		this.point = point;
		this.flags = options?.flags ?? 0;
		if (options) {
			if ("startingWidth" in options) this.startingWidth = options.startingWidth;
			if ("endWidth" in options) this.endWidth = options.endWidth;
			if ("bulge" in options) this.bulge = options.bulge;
		}
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.point);
	}
	dxfyChild(dx) {
		dx.subclassMarker("AcDb3dPolylineVertex");
		dx.point3d(this.point);
		dx.push(40, this.startingWidth);
		dx.push(41, this.endWidth);
		dx.push(42, this.bulge);
		dx.push(70, this.flags);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/SeqEnd.ts
var SeqEnd = class extends Entity {
	dxfyChild(dx) {}
	constructor() {
		super("SEQEND");
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Polyline.ts
let PolylineFlags = /* @__PURE__ */ function(PolylineFlags) {
	PolylineFlags[PolylineFlags["None"] = 0] = "None";
	PolylineFlags[PolylineFlags["Closed"] = 1] = "Closed";
	PolylineFlags[PolylineFlags["CurveFit"] = 2] = "CurveFit";
	PolylineFlags[PolylineFlags["SplineFit"] = 4] = "SplineFit";
	PolylineFlags[PolylineFlags["Polyline3D"] = 8] = "Polyline3D";
	PolylineFlags[PolylineFlags["PolygonMesh3D"] = 16] = "PolygonMesh3D";
	PolylineFlags[PolylineFlags["PolygonMeshClosed"] = 32] = "PolygonMeshClosed";
	PolylineFlags[PolylineFlags["PolyfaceMesh"] = 64] = "PolyfaceMesh";
	PolylineFlags[PolylineFlags["LinetypeGenerated"] = 128] = "LinetypeGenerated";
	return PolylineFlags;
}({});
let SurfaceType = /* @__PURE__ */ function(SurfaceType) {
	SurfaceType[SurfaceType["NoSmooth"] = 0] = "NoSmooth";
	SurfaceType[SurfaceType["QuadraticBSpline"] = 5] = "QuadraticBSpline";
	SurfaceType[SurfaceType["CubicBSpline"] = 6] = "CubicBSpline";
	SurfaceType[SurfaceType["Bezier"] = 8] = "Bezier";
	return SurfaceType;
}({});
var Polyline = class extends Entity {
	constructor(vertices, options) {
		super("POLYLINE", "AcDb3dPolyline", options);
		this._seqend = new SeqEnd();
		this.vertices = [];
		this.thickness = options?.thickness ?? 0;
		this.elevation = options?.elevation ?? 0;
		this.flags = options?.flags ?? 0;
		this.defaultStartWidth = options?.defaultStartWidth ?? 0;
		this.defaultEndWidth = options?.defaultEndWidth ?? 0;
		this.polygonMeshM = options?.polygonMeshM ?? 0;
		this.polygonMeshN = options?.polygonMeshN ?? 0;
		this.smoothSurfaceM = options?.smoothSurfaceM ?? 0;
		this.smoothSurfaceN = options?.smoothSurfaceN ?? 0;
		this.surfaceType = options?.surfaceType ?? 0;
		vertices.forEach((v) => this.vertices.push(new Vertex(v.point, {
			startingWidth: v.startingWidth,
			endWidth: v.endWidth,
			bulge: v.bulge,
			flags: 32
		})));
	}
	boundingBox() {
		return BoundingBox.verticesBBox(this.vertices.map((v) => v.point));
	}
	dxfyChild(dx) {
		dx.push(66, 1);
		dx.point3d(point3d(0, 0, this.elevation));
		dx.push(39, this.thickness);
		dx.push(70, this.flags);
		dx.push(40, this.defaultStartWidth);
		dx.push(41, this.defaultEndWidth);
		dx.push(71, this.polygonMeshM);
		dx.push(72, this.polygonMeshN);
		dx.push(73, this.smoothSurfaceM);
		dx.push(74, this.smoothSurfaceN);
		dx.push(75, this.surfaceType);
		this.vertices.forEach((vertex) => vertex.dxfy(dx));
		this._seqend.dxfy(dx);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Spline.ts
let SplineFlags = /* @__PURE__ */ function(SplineFlags) {
	SplineFlags[SplineFlags["Closed"] = 1] = "Closed";
	SplineFlags[SplineFlags["Periodic"] = 2] = "Periodic";
	SplineFlags[SplineFlags["Rational"] = 4] = "Rational";
	SplineFlags[SplineFlags["Planar"] = 8] = "Planar";
	SplineFlags[SplineFlags["Linear"] = 16] = "Linear";
	return SplineFlags;
}({});
var Spline = class extends Entity {
	constructor(splineArgs, options) {
		super("SPLINE", "AcDbSpline", options);
		this.controlPoints = splineArgs.controlPoints;
		this.degreeCurve = splineArgs.degreeCurve ?? 3;
		this.flags = splineArgs.flags ?? 8;
		this.knots = splineArgs.knots || [];
		this.weights = splineArgs.weights || [];
		this.fitPoints = splineArgs.fitPoints || [];
		const cpl = this.controlPoints.length;
		const dc = this.degreeCurve;
		const edc = dc + 1;
		const fpl = this.fitPoints.length;
		if (cpl < edc) throw new Error(`Number of control points should be >= ${edc}.`);
		if (fpl !== 0 && fpl < 2) throw new Error("Number of fit points should be >= 2.");
		const eknl = dc + cpl + 1;
		if (this.knots.length === 0) {
			let k = 0;
			for (let i = 0; i < eknl; i++) if (i <= dc || i >= cpl + 1) this.knots.push(k);
			else this.knots.push(++k);
		}
		if (this.knots.length !== eknl) throw new Error(`Number of knots should be ${eknl}.`);
	}
	boundingBox() {
		return BoundingBox.verticesBBox([...this.controlPoints, ...this.fitPoints]);
	}
	dxfyChild(dx) {
		dx.push(70, this.flags);
		dx.push(71, this.degreeCurve);
		dx.push(72, this.knots.length);
		dx.push(73, this.controlPoints.length);
		dx.push(74, this.fitPoints.length);
		dx.push(42, "0.0000001");
		dx.push(43, "0.0000001");
		dx.push(42, "0.0000000001");
		this.knots.forEach((k) => dx.push(40, k));
		this.weights.forEach((w) => dx.push(41, w));
		this.controlPoints.forEach((cp) => dx.point3d(cp));
		this.fitPoints.forEach((fp) => dx.point3d(fp, 1));
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Table.ts
let CellType = /* @__PURE__ */ function(CellType) {
	CellType[CellType["Text"] = 1] = "Text";
	CellType[CellType["Block"] = 2] = "Block";
	return CellType;
}({});
let CellMerged = /* @__PURE__ */ function(CellMerged) {
	CellMerged[CellMerged["False"] = 0] = "False";
	CellMerged[CellMerged["True"] = 1] = "True";
	return CellMerged;
}({});
let CellAutoFitFlag = /* @__PURE__ */ function(CellAutoFitFlag) {
	CellAutoFitFlag[CellAutoFitFlag["False"] = 0] = "False";
	CellAutoFitFlag[CellAutoFitFlag["True"] = 1] = "True";
	return CellAutoFitFlag;
}({});
let CellAlignment = /* @__PURE__ */ function(CellAlignment) {
	CellAlignment[CellAlignment["TopLeft"] = 1] = "TopLeft";
	CellAlignment[CellAlignment["TopCenter"] = 2] = "TopCenter";
	CellAlignment[CellAlignment["TopRight"] = 3] = "TopRight";
	CellAlignment[CellAlignment["MiddleLeft"] = 4] = "MiddleLeft";
	CellAlignment[CellAlignment["MiddleCenter"] = 5] = "MiddleCenter";
	CellAlignment[CellAlignment["MiddleRight"] = 6] = "MiddleRight";
	CellAlignment[CellAlignment["BottomLeft"] = 7] = "BottomLeft";
	CellAlignment[CellAlignment["BottomCenter"] = 8] = "BottomCenter";
	CellAlignment[CellAlignment["BottomRight"] = 9] = "BottomRight";
	return CellAlignment;
}({});
var Cell = class {
	constructor(options) {
		this.cellType = options?.cellType || 1;
		this.cellMerged = options?.cellMerged || false;
		this.cellAutoFit = options?.cellAutoFitFlag || false;
		this.cellBorderWidth = options?.cellBorderWidth ?? 1;
		this.cellBorderHeight = options?.cellBorderHeight ?? 1;
		this.cellRotationValue = options?.cellRotationValue ?? 0;
		this.cellText = options?.cellText;
		this.cellTextHeight = options?.cellTextHeight;
		this.cellAlignment = options?.cellAlignment ?? 5;
	}
	dxfy(dx) {
		dx.push(171, this.cellType);
		dx.push(173, Number(this.cellMerged));
		dx.push(174, Number(this.cellAutoFit));
		dx.push(175, this.cellBorderWidth);
		dx.push(176, this.cellBorderHeight);
		dx.push(145, this.cellRotationValue);
		dx.push(170, this.cellAlignment);
		dx.push(91, 262177);
		dx.push(140, this.cellTextHeight);
		dx.push(301, "CELL_VALUE");
		dx.push(90, this.cellText ? 4 : 0);
		dx.push(1, this.cellText);
		dx.push(300, "");
		dx.push(302, this.cellText ?? "");
		dx.push(304, "ACVALUE_END");
	}
};
var Table = class extends Entity {
	constructor(blockName, position, numberOfRows, numberOfColumn, rowsHeight, columnsHeight, options) {
		super("ACAD_TABLE", "AcDbBlockReference", options);
		this.blockName = blockName;
		this.position = position;
		this.numberOfRows = numberOfRows;
		this.numberOfColumn = numberOfColumn;
		this.rowsHeight = rowsHeight;
		this.columnsHeight = columnsHeight;
		this.horizontalDirectionVector = options?.horizontalDirectionVector || point3d(1);
		this.cells = options?.cell;
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.position);
	}
	dxfyChild(dx) {
		dx.name(this.blockName);
		dx.point3d(this.position);
		dx.subclassMarker("AcDbTable");
		dx.point3d(this.horizontalDirectionVector, 1);
		dx.push(91, this.numberOfRows);
		dx.push(92, this.numberOfColumn);
		for (let i = 0; i < this.numberOfRows; i++) dx.push(141, this.rowsHeight[i] ?? this.rowsHeight[0] ?? 1);
		for (let i = 0; i < this.numberOfColumn; i++) dx.push(142, this.columnsHeight[i] ?? this.columnsHeight[0] ?? 1);
		this.cells.forEach((cell) => cell.dxfy(dx));
	}
};
//#endregion
//#region src/Sections/EntitiesSection/Entities/Text.ts
let TextGenerationFlags = /* @__PURE__ */ function(TextGenerationFlags) {
	TextGenerationFlags[TextGenerationFlags["None"] = 0] = "None";
	TextGenerationFlags[TextGenerationFlags["Backward"] = 2] = "Backward";
	TextGenerationFlags[TextGenerationFlags["UpsideDown"] = 4] = "UpsideDown";
	return TextGenerationFlags;
}({});
let TextHorizontalAlignment = /* @__PURE__ */ function(TextHorizontalAlignment) {
	TextHorizontalAlignment[TextHorizontalAlignment["Left"] = 0] = "Left";
	TextHorizontalAlignment[TextHorizontalAlignment["Center"] = 1] = "Center";
	TextHorizontalAlignment[TextHorizontalAlignment["Right"] = 2] = "Right";
	TextHorizontalAlignment[TextHorizontalAlignment["Aligned"] = 3] = "Aligned";
	TextHorizontalAlignment[TextHorizontalAlignment["Middle"] = 4] = "Middle";
	TextHorizontalAlignment[TextHorizontalAlignment["Fit"] = 5] = "Fit";
	return TextHorizontalAlignment;
}({});
let TextVerticalAlignment = /* @__PURE__ */ function(TextVerticalAlignment) {
	TextVerticalAlignment[TextVerticalAlignment["BaseLine"] = 0] = "BaseLine";
	TextVerticalAlignment[TextVerticalAlignment["Bottom"] = 1] = "Bottom";
	TextVerticalAlignment[TextVerticalAlignment["Middle"] = 2] = "Middle";
	TextVerticalAlignment[TextVerticalAlignment["Top"] = 3] = "Top";
	return TextVerticalAlignment;
}({});
var Text = class extends Entity {
	constructor(firstAlignmentPoint, height, value, options) {
		super("TEXT", "AcDbText", options);
		this.position = firstAlignmentPoint;
		this.height = height;
		this.value = value;
		this.textStyle = "STANDARD";
		this.rotation = options?.rotation;
		this.obliqueAngle = options?.obliqueAngle;
		this.generationFlags = options?.generationFlags;
		this.horizontalAlignment = options?.horizontalAlignment;
		this.verticalAlignment = options?.verticalAlignment;
		this.secondAlignmentPoint = options?.secondAlignmentPoint;
		this.relativeXScaleFactor = options?.relativeXScaleFactor;
	}
	boundingBox() {
		return BoundingBox.pointBBox(this.position);
	}
	dxfyChild(dx) {
		dx.point3d(this.position);
		dx.push(40, this.height);
		dx.primaryText(this.value);
		dx.push(50, this.rotation);
		dx.push(41, this.relativeXScaleFactor);
		dx.push(51, this.obliqueAngle);
		dx.textStyle(this.textStyle);
		dx.push(71, this.generationFlags);
		dx.push(72, this.horizontalAlignment);
		dx.point3d(this.secondAlignmentPoint, 1);
		dx.subclassMarker("AcDbText");
		dx.push(73, this.verticalAlignment);
	}
};
//#endregion
//#region src/Sections/EntitiesSection/EntitiesManager.ts
var EntitiesManager = class {
	constructor(objects, blockRecord, layerName) {
		this.entities = [];
		this.handle = Handle.next();
		this.objects = objects;
		this.blockRecord = blockRecord;
		this.layerName = layerName;
	}
	dxfy(dx) {
		for (const entity of this.entities) entity.dxfy(dx);
	}
	addHatch(boundaryPath, fill, options) {
		const hatch = new Hatch(boundaryPath, fill, options);
		return this.addEntity(hatch);
	}
	addEntity(entity) {
		entity.ownerBlockRecord = this.blockRecord.handle;
		if (this.blockRecord.isPaperSpace) entity.inPaperSpace = true;
		if (entity.layerName == null) entity.layerName = this.layerName;
		this.entities.push(entity);
		return entity;
	}
	addAttrib(firstAlignmentPoint, height, tag, value, ownerInsert, options) {
		ownerInsert.attributesFollowFlag = 1;
		const attrib = this.addEntity(new Attrib(firstAlignmentPoint, height, tag, value, options));
		const seqEnd = this.addEntity(new SeqEnd());
		seqEnd.ownerBlockRecord = ownerInsert.handle;
		return attrib;
	}
	addAttdef(firstAlignmentPoint, height, tag, value, options) {
		return this.addEntity(new Attdef(firstAlignmentPoint, height, tag, value, options));
	}
	addAlignedDim(first, second, options) {
		return this.addEntity(new AlignedDimension(first, second, options));
	}
	addDiameterDim(first, second, options) {
		return this.addEntity(new DiameterDimension(first, second, options));
	}
	addRadialDim(first, second, options) {
		return this.addEntity(new RadialDimension(first, second, options));
	}
	addLinearDim(first, second, options) {
		return this.addEntity(new LinearDimension(first, second, options));
	}
	addAngularLinesDim(first, second, location, options) {
		return this.addEntity(new AngularDimLines(first, second, location, options));
	}
	addAngularPointsDim(center, first, second, options) {
		return this.addEntity(new AngularDimPoints(center, first, second, options));
	}
	addLine(startPoint, endPoint, options) {
		return this.addEntity(new Line(startPoint, endPoint, options));
	}
	addLeader(points, options) {
		return this.addEntity(new Leader(points, options));
	}
	addLWPolyline(points, options) {
		return this.addEntity(new LWPolyline(points, options));
	}
	addRectangle(topLeft, bottomRight, options) {
		const vertices = [];
		const tX = topLeft.x;
		const tY = topLeft.y;
		const bX = bottomRight.x;
		const bY = bottomRight.y;
		if (options?.fillet !== void 0 && options?.chamfer !== void 0) throw new Error("You cannot define both fillet and chamfer!");
		if (options?.fillet !== void 0) {
			const f = options?.fillet;
			const b = bulge(f);
			vertices.push({
				point: point2d(tX, tY - f),
				bulge: b
			});
			vertices.push({ point: point2d(tX + f, tY) });
			vertices.push({
				point: point2d(bX - f, tY),
				bulge: b
			});
			vertices.push({ point: point2d(bX, tY - f) });
			vertices.push({
				point: point2d(bX, bY + f),
				bulge: b
			});
			vertices.push({ point: point2d(bX - f, bY) });
			vertices.push({
				point: point2d(tX + f, bY),
				bulge: b
			});
			vertices.push({ point: point2d(tX, bY + f) });
		} else if (options?.chamfer !== void 0) {
			const f = options?.chamfer.first;
			const s = options?.chamfer.second || f;
			vertices.push({ point: point2d(tX, tY - f) });
			vertices.push({ point: point2d(tX + s, tY) });
			vertices.push({ point: point2d(bX - f, tY) });
			vertices.push({ point: point2d(bX, tY - s) });
			vertices.push({ point: point2d(bX, bY + f) });
			vertices.push({ point: point2d(bX - s, bY) });
			vertices.push({ point: point2d(tX + f, bY) });
			vertices.push({ point: point2d(tX, bY + s) });
		} else {
			vertices.push({ point: point2d(tX, tY) });
			vertices.push({ point: point2d(bX, tY) });
			vertices.push({ point: point2d(bX, bY) });
			vertices.push({ point: point2d(tX, bY) });
		}
		return this.addLWPolyline(vertices, {
			...options,
			flags: 1
		});
	}
	addImage(imagePath, name, insertionPoint, width, height, scale, rotation, options) {
		const imageDef = this.objects.addImageDef(imagePath);
		imageDef.width = width;
		imageDef.height = height;
		const image = new Image({
			height,
			width,
			scale,
			rotation,
			insertionPoint,
			imageDefHandle: imageDef.handle
		}, options);
		const imageDefReactor = this.objects.addImageDefReactor(image.handle);
		image.imageDefReactorHandle = imageDefReactor.handle;
		this.addEntity(image);
		const dictionary = this.objects.addDictionary();
		dictionary.addEntryObject(name, imageDef.handle);
		imageDef.ownerObjecthandle = dictionary.handle;
		this.objects.root.addEntryObject("ACAD_IMAGE_DICT", dictionary.handle);
		imageDef.acadImageDictHandle = dictionary.handle;
		imageDef.addImageDefReactorHandle(imageDefReactor.handle);
		return image;
	}
	addPolyline3D(vertices, options) {
		return this.addEntity(new Polyline(vertices, options));
	}
	addPoint(x, y, z, options) {
		return this.addEntity(new Point(x, y, z, options));
	}
	addCircle(center, radius, options) {
		return this.addEntity(new Circle(center, radius, options));
	}
	addArc(center, radius, startAngle, endAngle, options) {
		return this.addEntity(new Arc(center, radius, startAngle, endAngle, options));
	}
	addSpline(splineArgs, options) {
		return this.addEntity(new Spline(splineArgs, options));
	}
	addEllipse(center, endPointOfMajorAxis, ratioOfMinorAxisToMajorAxis, startParameter, endParameter, options) {
		const ellipse = new Ellipse(center, endPointOfMajorAxis, ratioOfMinorAxisToMajorAxis, startParameter, endParameter, options);
		this.addEntity(ellipse);
		return ellipse;
	}
	add3dFace(firstCorner, secondCorner, thirdCorner, fourthCorner, options) {
		return this.addEntity(new Face(firstCorner, secondCorner, thirdCorner, fourthCorner, options));
	}
	addText(firstAlignementPoint, height, value, options) {
		return this.addEntity(new Text(firstAlignementPoint, height, value, options));
	}
	addMText(firstAlignementPoint, height, value, options) {
		return this.addEntity(new MText(firstAlignementPoint, height, value, options));
	}
	addInsert(blockName, insertionPoint, options) {
		return this.addEntity(new Insert(blockName, insertionPoint, options || {}));
	}
	addTable(blockName, position, noOfRows, noOfColumn, rowHeights, columnHeights, tableOptions) {
		return this.addEntity(new Table(blockName, position, noOfRows, noOfColumn, rowHeights, columnHeights, tableOptions));
	}
	boundingBox() {
		const _bboxes = [];
		for (let i = 0; i < this.entities.length; i++) _bboxes.push(this.entities[i].boundingBox());
		return BoundingBox.boundingBox(_bboxes);
	}
	centerView() {
		return BoundingBox.boundingBoxCenter(this.boundingBox());
	}
	viewHeight() {
		return BoundingBox.boundingBoxHeight(this.boundingBox());
	}
};
//#endregion
//#region src/Sections/BlocksSection/DxfBlock.ts
let BlockFlags = /* @__PURE__ */ function(BlockFlags) {
	BlockFlags[BlockFlags["None"] = 0] = "None";
	BlockFlags[BlockFlags["AnonymousBlock"] = 1] = "AnonymousBlock";
	BlockFlags[BlockFlags["HasNonConstantAttribute"] = 2] = "HasNonConstantAttribute";
	BlockFlags[BlockFlags["XRef"] = 4] = "XRef";
	BlockFlags[BlockFlags["XRefOverlay"] = 8] = "XRefOverlay";
	BlockFlags[BlockFlags["ExternallyDependent"] = 16] = "ExternallyDependent";
	BlockFlags[BlockFlags["ResolvedXRef"] = 32] = "ResolvedXRef";
	BlockFlags[BlockFlags["ReferencedXRef"] = 64] = "ReferencedXRef";
	return BlockFlags;
}({});
var DxfBlock = class extends EntitiesManager {
	get isPaperSpace() {
		return this.name.startsWith("*Paper_Space");
	}
	get isModelSpace() {
		return this.name.startsWith("*Model_Space");
	}
	get isModelOrPaperSpace() {
		return this.isModelSpace || this.isPaperSpace;
	}
	constructor(name, blockRecord, objects) {
		super(objects, blockRecord, "0");
		this.name = name;
		this.flags = 0;
		this.endBlk = new DxfEndBlk();
		this.ownerObjectHandle = blockRecord.handle;
		this.basePoint = point3d(0, 0, 0);
		this.xrefPathName = "";
	}
	setLayerName(layerName) {
		this.layerName = layerName;
	}
	dxfy(dx) {
		dx.type("BLOCK");
		dx.handle(this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker("AcDbEntity");
		dx.layerName(this.layerName);
		dx.subclassMarker("AcDbBlockBegin");
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.point3d(this.basePoint);
		dx.name(this.name, 3);
		dx.push(1, this.xrefPathName);
		if (!this.isModelSpace && this.name !== "*Paper_Space") super.dxfy(dx);
		this.endBlk.dxfy(dx);
	}
};
//#endregion
//#region src/Sections/BlocksSection/DxfBlocksSection.ts
var DxfBlocksSection = class {
	constructor(tables, objects) {
		this.blocks = [];
		this.paperSpaceSeed = 0;
		this.tables = tables;
		this.objects = objects;
		this.modelSpace = this.addBlock("*Model_Space", objects, false);
		this.paperSpace = this.addBlock("*Paper_Space", objects, false);
	}
	addBlock(name, objects, removeSpecialChars = true) {
		if (removeSpecialChars) name = name.replace(specialCharsRegex, "");
		const blockRecord = this.tables.addBlockRecord(name);
		const block = new DxfBlock(name, blockRecord, objects);
		this.blocks.push(block);
		return block;
	}
	addPaperSpace() {
		const name = `*Paper_Space${this.paperSpaceSeed++}`;
		return this.addBlock(name, this.objects, false);
	}
	dxfy(dx) {
		dx.start("BLOCKS");
		this.blocks.forEach((b) => b.dxfy(dx));
		dx.end();
	}
};
//#endregion
//#region src/Sections/ClassesSection/DxfClassesSection.ts
var DxfClassesSection = class {
	dxfy(dx) {
		dx.start("CLASSES");
		dx.end();
	}
};
//#endregion
//#region src/Sections/EntitiesSection/DxfEntitiesSection.ts
var DxfEntitiesSection = class {
	constructor(blocks) {
		this.blocks = blocks;
		this.modelSpace = blocks.modelSpace;
		this.paperSpace = blocks.paperSpace;
	}
	setLayerName(layerName) {
		this.modelSpace.setLayerName(layerName);
	}
	dxfy(dx) {
		dx.start("ENTITIES");
		this.paperSpace.entities.forEach((e) => e.dxfy(dx));
		this.modelSpace.entities.forEach((e) => e.dxfy(dx));
		dx.end();
	}
};
//#endregion
//#region src/Sections/HeaderSection/DxfVariable.ts
var DxfVariable = class {
	constructor(name, values) {
		this.values = values;
		this.name = name;
	}
	dxfy(dx) {
		dx.variableName(this.name);
		Object.entries(this.values).forEach((entry) => {
			const [code, value] = entry;
			dx.push(parseInt(code), value);
		});
	}
};
//#endregion
//#region src/Sections/HeaderSection/DxfHeaderSection.ts
var DxfHeaderSection = class {
	constructor() {
		this.variables = [];
	}
	setVariable(name, values) {
		const variable = this.variables.find((v) => v.name === name);
		if (variable) variable.values = values;
		else this.variables.push(new DxfVariable(name, values));
	}
	dxfy(dx) {
		dx.start("HEADER");
		this.variables.forEach((variable) => variable.dxfy(dx));
		dx.end();
	}
};
//#endregion
//#region src/Sections/ObjectsSection/DxfObject.ts
var DxfObject = class {
	constructor(type) {
		this.type = type;
		this.ownerObjecthandle = "0";
		this.handle = Handle.next();
	}
	dxfy(dx) {
		dx.type(this.type);
		dx.handle(this.handle);
		dx.push(330, this.ownerObjecthandle);
	}
};
//#endregion
//#region src/Sections/ObjectsSection/Objects/DxfDictionary.ts
var DxfDictionary = class extends DxfObject {
	constructor() {
		super("DICTIONARY");
		this.entries = [];
		this.duplicateRecordCloningFlag = 0;
	}
	addEntryObject(name, entryObjectHandle) {
		this.entries.push({
			name,
			entryObjectHandle
		});
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbDictionary");
		dx.push(280, this.hardOwnerFlag);
		dx.push(281, this.duplicateRecordCloningFlag);
		for (const entry of this.entries) {
			dx.push(3, entry.name);
			dx.push(350, entry.entryObjectHandle);
		}
	}
};
//#endregion
//#region src/Internals/DefinedApplication.ts
var DxfDefinedApplication = class {
	constructor(name) {
		this.name = name;
		this.tags = [];
	}
	add(code, value) {
		this.tags.push({
			code,
			value
		});
	}
	dxfy(dx) {
		dx.push(102, `{${this.name}`);
		for (const tag of this.tags) dx.push(tag.code, tag.value);
		dx.push(102, "}");
	}
};
//#endregion
//#region src/Sections/ObjectsSection/Objects/DxfImageDef.ts
let ImageDefResolutionUnits = /* @__PURE__ */ function(ImageDefResolutionUnits) {
	ImageDefResolutionUnits[ImageDefResolutionUnits["NoUnits"] = 0] = "NoUnits";
	ImageDefResolutionUnits[ImageDefResolutionUnits["Centimeters"] = 2] = "Centimeters";
	ImageDefResolutionUnits[ImageDefResolutionUnits["Inch"] = 5] = "Inch";
	return ImageDefResolutionUnits;
}({});
var DxfImageDef = class extends DxfObject {
	constructor(path) {
		super("IMAGEDEF");
		this.path = path;
		this.acadImageDictHandle = "";
		this.imageReactorHandles = [];
		this.width = 1;
		this.height = 1;
		this.widthPixelSize = 1;
		this.heightPixelSize = 1;
		this.loaded = true;
		this.resolutionUnits = 0;
	}
	addImageDefReactorHandle(id) {
		this.imageReactorHandles.push(id);
	}
	dxfy(dx) {
		super.dxfy(dx);
		const da = new DxfDefinedApplication("ACAD_REACTORS");
		da.add(330, this.acadImageDictHandle);
		for (const handle of this.imageReactorHandles) da.add(330, handle);
		da.dxfy(dx);
		dx.subclassMarker("AcDbRasterImageDef");
		dx.push(1, this.path);
		dx.point2d(point2d(this.width, this.height));
		dx.push(11, this.widthPixelSize);
		dx.push(21, this.heightPixelSize);
		dx.push(280, Number(this.loaded));
		dx.push(281, this.resolutionUnits);
	}
};
//#endregion
//#region src/Sections/ObjectsSection/Objects/DxfImageDefReactor.ts
var DxfImageDefReactor = class extends DxfObject {
	constructor(imageHandle) {
		super("IMAGEDEF_REACTOR");
		this.imageHandle = imageHandle;
		this.classVersion = 2;
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbRasterImageDefReactor");
		dx.push(90, this.classVersion);
		dx.push(330, this.imageHandle);
	}
};
//#endregion
//#region src/Sections/ObjectsSection/DxfObjectsSection.ts
var DxfObjectsSection = class {
	constructor() {
		this.root = new DxfDictionary();
		this.objects = [];
		this.root.duplicateRecordCloningFlag = 1;
		const d = this.addDictionary();
		this.root.addEntryObject("ACAD_GROUP", d.handle);
	}
	addObject(object) {
		this.objects.push(object);
		return object;
	}
	addImageDef(path) {
		return this.addObject(new DxfImageDef(path));
	}
	addImageDefReactor(imageHandle) {
		return this.addObject(new DxfImageDefReactor(imageHandle));
	}
	addDictionary() {
		const d = new DxfDictionary();
		d.ownerObjecthandle = this.root.handle;
		this.addObject(d);
		return d;
	}
	addEntryToRoot(name, softOwner) {
		this.root.addEntryObject(name, softOwner);
	}
	dxfy(dx) {
		dx.start("OBJECTS");
		this.root.dxfy(dx);
		for (const obj of this.objects) obj.dxfy(dx);
		dx.end();
		dx.type("EOF");
	}
};
//#endregion
//#region src/Sections/ObjectsSection/Objects/DxfRasterVariables.ts
var DxfRasterVariables = class extends DxfObject {
	constructor() {
		super("RASTERVARIABLES");
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbRasterVariables");
		dx.push(70, 0);
		dx.push(71, 1);
		dx.push(72, 0);
	}
};
//#endregion
//#region src/Sections/TablesSection/DxfTable.ts
var DxfTable = class {
	constructor(name) {
		this.name = name;
		this.maxNumberEntries = 0;
		this.ownerObjectHandle = "0";
		this.handle = Handle.next();
		this.records = [];
	}
	dxfy(dx) {
		dx.type("TABLE");
		dx.name(this.name);
		dx.handle(this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker("AcDbSymbolTable");
		dx.push(70, this.records.length);
		for (const record of this.records) record.dxfy(dx);
		dx.type("ENDTAB");
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfAppId.ts
let AppIdFlags = /* @__PURE__ */ function(AppIdFlags) {
	AppIdFlags[AppIdFlags["None"] = 0] = "None";
	AppIdFlags[AppIdFlags["XRefDependent"] = 16] = "XRefDependent";
	AppIdFlags[AppIdFlags["XRefResolved"] = 32] = "XRefResolved";
	return AppIdFlags;
}({});
var DxfAppId = class extends DxfRecord {
	constructor(name, flags) {
		super("APPID");
		this.name = name;
		this.flags = flags ?? 0;
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbRegAppTableRecord");
		dx.name(this.name);
		dx.push(70, this.flags);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfBlockRecord.ts
var DxfBlockRecord = class extends DxfRecord {
	get isPaperSpace() {
		return this.name.startsWith("*Paper_Space");
	}
	constructor(name) {
		super("BLOCK_RECORD");
		this.name = name;
		this.insertionUnits = 0;
		this.explodability = 1;
		this.scalability = 0;
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbBlockTableRecord");
		dx.name(this.name);
		dx.push(340, this.layoutObject);
		dx.push(70, this.insertionUnits);
		dx.push(280, this.explodability);
		dx.push(281, this.scalability);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfDimStyle.ts
let DimStyleFlags = /* @__PURE__ */ function(DimStyleFlags) {
	DimStyleFlags[DimStyleFlags["None"] = 0] = "None";
	DimStyleFlags[DimStyleFlags["XRefDependent"] = 16] = "XRefDependent";
	DimStyleFlags[DimStyleFlags["XRefRefesolved"] = 32] = "XRefRefesolved";
	return DimStyleFlags;
}({});
var DxfDimStyle = class {
	constructor(name, flags) {
		this.name = name;
		this.flags = flags ?? 0;
		this.handle = Handle.next();
		this.type = "DIMSTYLE";
	}
	dxfy(dx) {
		dx.type(this.type);
		dx.push(105, this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker("AcDbSymbolTableRecord");
		dx.subclassMarker("AcDbDimStyleTableRecord");
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.push(3, this.DIMPOST);
		dx.push(4, this.DIMAPOST);
		dx.push(5, this.DIMBLK);
		dx.push(6, this.DIMBLK1);
		dx.push(7, this.DIMBLK2);
		dx.push(40, this.DIMSCALE);
		dx.push(41, this.DIMASZ);
		dx.push(42, this.DIMEXO);
		dx.push(43, this.DIMDLI);
		dx.push(44, this.DIMEXE);
		dx.push(45, this.DIMRND);
		dx.push(46, this.DIMDLE);
		dx.push(47, this.DIMTP);
		dx.push(48, this.DIMTM);
		dx.push(140, this.DIMTXT);
		dx.push(141, this.DIMCEN);
		dx.push(142, this.DIMTSZ);
		dx.push(143, this.DIMALTF);
		dx.push(144, this.DIMLFAC);
		dx.push(145, this.DIMTVP);
		dx.push(146, this.DIMTFAC);
		dx.push(147, this.DIMGAP);
		dx.push(148, this.DIMALTRND);
		dx.push(71, this.DIMTOL);
		dx.push(72, this.DIMLIM);
		dx.push(73, this.DIMTIH);
		dx.push(74, this.DIMTOH);
		dx.push(75, this.DIMSE1);
		dx.push(76, this.DIMSE2);
		dx.push(77, this.DIMTAD);
		dx.push(78, this.DIMZIN);
		dx.push(79, this.DIMAZIN);
		dx.push(170, this.DIMALT);
		dx.push(171, this.DIMALTD);
		dx.push(172, this.DIMTOFL);
		dx.push(173, this.DIMSAH);
		dx.push(174, this.DIMTIX);
		dx.push(175, this.DIMSOXD);
		dx.push(176, this.DIMCLRD);
		dx.push(177, this.DIMCLRE);
		dx.push(178, this.DIMCLRT);
		dx.push(179, this.DIMADEC);
		dx.push(271, this.DIMDEC);
		dx.push(272, this.DIMTDEC);
		dx.push(273, this.DIMALTU);
		dx.push(274, this.DIMALTTD);
		dx.push(275, this.DIMAUNIT);
		dx.push(276, this.DIMFRAC);
		dx.push(277, this.DIMLUNIT);
		dx.push(278, this.DIMDSEP);
		dx.push(279, this.DIMTMOVE);
		dx.push(280, this.DIMJUST);
		dx.push(281, this.DIMSD1);
		dx.push(282, this.DIMSD2);
		dx.push(283, this.DIMTOLJ);
		dx.push(284, this.DIMTZIN);
		dx.push(285, this.DIMALTZ);
		dx.push(286, this.DIMALTTZ);
		dx.push(287, this.DIMFIT);
		dx.push(288, this.DIMUPT);
		dx.push(289, this.DIMATFIT);
		dx.push(340, this.DIMTXSTY);
		dx.push(341, this.DIMLDRBLK);
		dx.push(342, this.DIMBLK);
		dx.push(343, this.DIMBLK1);
		dx.push(344, this.DIMBLK2);
		dx.push(371, this.DIMLWD);
		dx.push(372, this.DIMLWE);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfLType.ts
var DxfLType = class extends DxfRecord {
	constructor(name, descriptive, elements, flags) {
		super("LTYPE");
		this.name = name;
		this.descriptive = descriptive;
		this.elements = elements;
		this.flags = flags ?? 0;
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbLinetypeTableRecord");
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.push(3, this.descriptive);
		dx.push(72, 65);
		dx.push(73, this.elements.length);
		let sum = 0;
		for (const element of this.elements) sum += Math.abs(element);
		dx.push(40, sum);
		for (const element of this.elements) {
			dx.push(49, element);
			dx.push(74, 0);
		}
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfStyle.ts
var DxfStyle = class extends DxfRecord {
	constructor(name, flags) {
		super("STYLE");
		this.fixedTextHeight = 0;
		this.widthFactor = 1;
		this.obliqueAngle = 0;
		this.textGenerationFlag = 0;
		this.lastHeightUsed = 1;
		this.fontFileName = "txt";
		this.bigFontFileName = "";
		this.name = name;
		this.flags = flags ?? 0;
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbTextStyleTableRecord");
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.push(40, this.fixedTextHeight);
		dx.push(41, this.widthFactor);
		dx.push(50, this.obliqueAngle);
		dx.push(71, this.textGenerationFlag);
		dx.push(42, this.lastHeightUsed);
		dx.push(3, this.fontFileName);
		dx.push(4, this.bigFontFileName);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfUcs.ts
var DxfUcs = class extends DxfRecord {
	constructor(name) {
		super("UCS");
		this.name = name;
	}
	dxfy(dx) {
		super.dxfy(dx);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfVPort.ts
var DxfVPort = class extends DxfRecord {
	constructor(name) {
		super("VPORT");
		this.name = name;
		this.viewHeight = 200;
		this.viewCenter = [0, 0];
	}
	dxfy(dx) {
		super.dxfy(dx);
		const [x, y] = this.viewCenter;
		dx.subclassMarker("AcDbViewportTableRecord");
		dx.name(this.name);
		dx.push(70, 0);
		dx.point2d({
			x: 0,
			y: 0
		});
		dx.push(11, 1);
		dx.push(21, 1);
		dx.push(12, x);
		dx.push(22, y);
		dx.push(13, 0);
		dx.push(23, 0);
		dx.push(14, 10);
		dx.push(24, 10);
		dx.push(15, 10);
		dx.push(25, 10);
		dx.push(16, 0);
		dx.push(26, 0);
		dx.push(36, 1);
		dx.push(17, 0);
		dx.push(27, 0);
		dx.push(37, 0);
		dx.push(40, this.viewHeight || 200);
		dx.push(41, 2);
		dx.push(42, 50);
		dx.push(43, 0);
		dx.push(44, 0);
		dx.push(50, 0);
		dx.push(51, 0);
		dx.push(71, 0);
		dx.push(72, 100);
		dx.push(73, 1);
		dx.push(74, 3);
		dx.push(75, 0);
		dx.push(76, 1);
		dx.push(77, 0);
		dx.push(78, 0);
		dx.push(281, 0);
		dx.push(65, 1);
		dx.push(110, 0);
		dx.push(120, 0);
		dx.push(130, 0);
		dx.push(111, 1);
		dx.push(121, 0);
		dx.push(131, 0);
		dx.push(112, 0);
		dx.push(122, 1);
		dx.push(132, 0);
		dx.push(79, 0);
		dx.push(146, 0);
		dx.push(348, 10020);
		dx.push(60, 7);
		dx.push(61, 5);
		dx.push(292, 1);
		dx.push(282, 1);
		dx.push(141, 0);
		dx.push(142, 0);
		dx.push(63, 250);
		dx.push(421, 3358443);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/Records/DxfView.ts
var DxfView = class extends DxfRecord {
	constructor(args) {
		super("VIEW");
		this.name = args.name;
		this.flags = args.flags ?? 0;
		this.viewHeight = args.viewHeight;
		this.viewCenter = args.viewCenter;
		this.viewWidth = args.viewWidth;
		this.viewDirection = args.viewDirection;
		this.targetPoint = args.targetPoint;
		this.lensLength = args.lensLength;
		this.frontClipping = args.frontClipping;
		this.backClipping = args.backClipping;
		this.twistAngle = args.twistAngle;
		this.viewMode = args.viewMode;
		this.renderMode = args.renderMode;
		this.isUCSAssociated = args.isUCSAssociated;
		this.isCameraPlottable = args.isCameraPlottable || false;
		args.backgroundObjectHandle && (this.backgroundObjectHandle = args.backgroundObjectHandle);
		args.liveSectionObjectHandle && (this.liveSectionObjectHandle = args.liveSectionObjectHandle);
		args.visualStyleObjectHandle && (this.visualStyleObjectHandle = args.visualStyleObjectHandle);
	}
	dxfy(dx) {
		super.dxfy(dx);
		dx.subclassMarker("AcDbViewTableRecord");
		dx.name(this.name);
		dx.push(70, this.flags);
		dx.push(40, this.viewHeight);
		dx.point2d(this.viewCenter);
		dx.push(41, this.viewWidth);
		dx.push(11, this.viewDirection.x);
		dx.push(21, this.viewDirection.y);
		dx.push(31, this.viewDirection.z);
		dx.push(12, this.targetPoint.x);
		dx.push(22, this.targetPoint.y);
		dx.push(32, this.targetPoint.z);
		dx.push(42, this.lensLength);
		dx.push(43, this.frontClipping);
		dx.push(44, this.backClipping);
		dx.push(50, this.twistAngle);
		dx.push(71, this.viewMode);
		dx.push(281, this.renderMode);
		dx.push(72, this.isUCSAssociated ? 1 : 0);
		dx.push(73, this.isCameraPlottable ? 1 : void 0);
		dx.push(332, this.backgroundObjectHandle);
		dx.push(334, this.liveSectionObjectHandle);
		dx.push(348, this.visualStyleObjectHandle);
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfAppIdTable.ts
var DxfAppIdTable = class extends DxfTable {
	constructor() {
		super("APPID");
	}
	addAppId(name, flags) {
		const r = new DxfAppId(name, flags);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfBlockRecordTable.ts
var DxfBlockRecordTable = class extends DxfTable {
	constructor() {
		super("BLOCK_RECORD");
	}
	addBlockRecord(name) {
		const r = new DxfBlockRecord(name);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfDimStyleTable.ts
var DxfDimStyleTable = class extends DxfTable {
	constructor() {
		super("DIMSTYLE");
		this.ownerObjectHandle = "0";
	}
	addDimStyle(name, flags) {
		const r = new DxfDimStyle(name, flags);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
	dxfy(dx) {
		dx.type("TABLE");
		dx.name(this.name);
		dx.handle(this.handle);
		dx.push(330, this.ownerObjectHandle);
		dx.subclassMarker("AcDbSymbolTable");
		dx.push(70, this.records.length);
		dx.subclassMarker("AcDbDimStyleTable");
		for (const record of this.records) record.dxfy(dx);
		dx.type("ENDTAB");
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfLTypeTable.ts
var DxfLTypeTable = class extends DxfTable {
	constructor() {
		super("LTYPE");
	}
	exist(name) {
		return this.records.find((lineTypeRecord) => {
			return lineTypeRecord.name === name;
		}) !== void 0;
	}
	ltype(name) {
		return this.records.find((r) => r.name === name);
	}
	addLType(name, descriptive, elements, flags) {
		const found = this.ltype(name);
		if (found) return found;
		const r = new DxfLType(name, descriptive, elements, flags);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Internals/Enums.ts
let Colors = /* @__PURE__ */ function(Colors) {
	Colors[Colors["Red"] = 1] = "Red";
	Colors[Colors["Green"] = 3] = "Green";
	Colors[Colors["Cyan"] = 4] = "Cyan";
	Colors[Colors["Blue"] = 5] = "Blue";
	Colors[Colors["Magenta"] = 6] = "Magenta";
	Colors[Colors["White"] = 7] = "White";
	Colors[Colors["Black"] = 0] = "Black";
	Colors[Colors["Yellow"] = 2] = "Yellow";
	return Colors;
}({});
let Units = /* @__PURE__ */ function(Units) {
	Units[Units["Unitless"] = 0] = "Unitless";
	Units[Units["Inches"] = 1] = "Inches";
	Units[Units["Feet"] = 2] = "Feet";
	Units[Units["Miles"] = 3] = "Miles";
	Units[Units["Millimeters"] = 4] = "Millimeters";
	Units[Units["Centimeters"] = 5] = "Centimeters";
	Units[Units["Meters"] = 6] = "Meters";
	Units[Units["Kilometers"] = 7] = "Kilometers";
	Units[Units["Microinches"] = 8] = "Microinches";
	Units[Units["Mils"] = 9] = "Mils";
	Units[Units["Yards"] = 10] = "Yards";
	Units[Units["Angstroms"] = 11] = "Angstroms";
	Units[Units["Nanometers"] = 12] = "Nanometers";
	Units[Units["Microns"] = 13] = "Microns";
	Units[Units["Decimeters"] = 14] = "Decimeters";
	Units[Units["Decameters"] = 15] = "Decameters";
	Units[Units["Hectometers"] = 16] = "Hectometers";
	Units[Units["Gigameters"] = 17] = "Gigameters";
	Units[Units["AstronomicalUnits"] = 18] = "AstronomicalUnits";
	Units[Units["LightYears"] = 19] = "LightYears";
	Units[Units["Parsecs"] = 20] = "Parsecs";
	Units[Units["USSurveyFeet"] = 21] = "USSurveyFeet";
	Units[Units["USSurveyInch"] = 22] = "USSurveyInch";
	Units[Units["USSurveyYard"] = 23] = "USSurveyYard";
	Units[Units["USSurveyMile"] = 24] = "USSurveyMile";
	return Units;
}({});
let LineTypes = /* @__PURE__ */ function(LineTypes) {
	LineTypes["Continuous"] = "Continuous";
	return LineTypes;
}({});
//#endregion
//#region src/Sections/TablesSection/Tables/DxfLayerTable.ts
var DxfLayerTable = class extends DxfTable {
	constructor(lineTypeTable) {
		super("LAYER");
		this.lTypeTable = lineTypeTable;
	}
	addLayer(name, color, lineType, flags) {
		name = name.replace(specialCharsRegex, "");
		const layer = this.layer(name);
		if (layer) return layer;
		if (!this.lTypeTable.exist(lineType)) lineType = "Continuous";
		const r = new DxfLayer(name, color, lineType, flags);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
	layer(name) {
		name = name.replace(specialCharsRegex, "");
		return this.records.find((layerRecord) => layerRecord.name === name);
	}
	exist(name) {
		return this.records.find((layerRecord) => {
			return layerRecord.name === name;
		}) !== void 0;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfStyleTable.ts
var DxfStyleTable = class extends DxfTable {
	constructor() {
		super("STYLE");
	}
	addStyle(name, flags) {
		const r = new DxfStyle(name, flags);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfUcsTable.ts
var DxfUcsTable = class extends DxfTable {
	constructor() {
		super("UCS");
	}
	addUcs(name) {
		const r = new DxfUcs(name);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfVPortTable.ts
var DxfVPortTable = class extends DxfTable {
	constructor() {
		super("VPORT");
	}
	addViewPort(name) {
		const r = new DxfVPort(name);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Sections/TablesSection/Tables/DxfViewTable.ts
var DxfViewTable = class extends DxfTable {
	constructor() {
		super("VIEW");
	}
	addView(args) {
		const r = new DxfView(args);
		r.ownerObjectHandle = this.handle;
		this.records.push(r);
		return r;
	}
};
//#endregion
//#region src/Sections/TablesSection/DxfTablesSection.ts
var DxfTablesSection = class {
	constructor() {
		this.vPortTable = new DxfVPortTable();
		this.ltypeTable = new DxfLTypeTable();
		this.layerTable = new DxfLayerTable(this.ltypeTable);
		this.styleTable = new DxfStyleTable();
		this.viewTable = new DxfViewTable();
		this.ucsTable = new DxfUcsTable();
		this.appIdTable = new DxfAppIdTable();
		this.dimStyleTable = new DxfDimStyleTable();
		this.blockRecordTable = new DxfBlockRecordTable();
	}
	layer(name) {
		return this.layerTable.layer(name);
	}
	addLType(name, descriptive, elements, flags) {
		return this.ltypeTable.addLType(name, descriptive, elements, flags);
	}
	addBlockRecord(name) {
		return this.blockRecordTable.addBlockRecord(name);
	}
	addLayer(name, color, lineType, flags) {
		return this.layerTable.addLayer(name, color, lineType, flags);
	}
	addStyle(name) {
		return this.styleTable.addStyle(name);
	}
	addView(args) {
		return this.viewTable.addView(args);
	}
	addUcs(name) {
		return this.ucsTable.addUcs(name);
	}
	addAppId(name, flags) {
		return this.appIdTable.addAppId(name, flags);
	}
	addDimStyle(name, flags) {
		return this.dimStyleTable.addDimStyle(name, flags);
	}
	addVPort(name) {
		return this.vPortTable.addViewPort(name);
	}
	dxfy(dx) {
		dx.start("TABLES");
		this.vPortTable.dxfy(dx);
		this.ltypeTable.dxfy(dx);
		this.layerTable.dxfy(dx);
		this.styleTable.dxfy(dx);
		this.viewTable.dxfy(dx);
		this.ucsTable.dxfy(dx);
		this.appIdTable.dxfy(dx);
		this.dimStyleTable.dxfy(dx);
		this.blockRecordTable.dxfy(dx);
		dx.end();
	}
};
//#endregion
//#region src/Internals/Dxfier.ts
var Dxfier = class {
	constructor() {
		this.lines = [];
	}
	push(code, value) {
		if (value != null) this.lines.push(code, value);
	}
	stringify() {
		return this.lines.join("\n");
	}
	start(name) {
		this.push(0, "SECTION");
		this.push(2, name);
	}
	end() {
		this.push(0, "ENDSEC");
	}
	variableName(name) {
		this.push(9, name);
	}
	type(entityType) {
		this.push(0, entityType);
	}
	primaryText(primaryText) {
		this.push(1, primaryText);
	}
	name(name, code = 2) {
		this.push(code, name);
	}
	handle(handle) {
		this.push(5, handle);
	}
	lineType(lineType) {
		this.push(6, lineType);
	}
	textStyle(textStyle) {
		this.push(7, textStyle);
	}
	layerName(layerName) {
		this.push(8, layerName);
	}
	point2d(point, digit = 0) {
		this.push(10 + digit, point?.x);
		this.push(20 + digit, point?.y);
	}
	point3d(point, digit = 0) {
		this.point2d(point, digit);
		this.push(30 + digit, point?.z);
	}
	elevation(elevation) {
		this.push(38, elevation);
	}
	thickness(thickness) {
		this.push(39, thickness);
	}
	visibilty(visibilty) {
		if (visibilty != null) this.push(60, visibilty ? 0 : 1);
	}
	colorNumber(colorNumber) {
		this.push(62, colorNumber);
	}
	subclassMarker(subclassMarker) {
		this.push(100, subclassMarker);
	}
};
//#endregion
//#region package.json
var name = "@tarikjabiri/dxf";
//#endregion
//#region src/DxfDocument.ts
var DxfDocument = class {
	constructor() {
		Handle.clear();
		this.header = new DxfHeaderSection();
		this.classes = new DxfClassesSection();
		this.tables = new DxfTablesSection();
		this.objects = new DxfObjectsSection();
		this.blocks = new DxfBlocksSection(this.tables, this.objects);
		this.entities = new DxfEntitiesSection(this.blocks);
		this.currentLayerName = DxfLayer.layerZeroName;
		this.currentUnits = 0;
		this.header.setVariable("$ACADVER", { 1: "AC1021" });
		this.header.setVariable("$LASTSAVEDBY", { 1: name });
		this._handseed();
		this.setUnits(0);
		this.tables.addLType("ByBlock", "", []);
		this.tables.addLType("ByLayer", "", []);
		const ltc = this.tables.addLType("Continuous", "Solid line", []);
		this.tables.addLayer(DxfLayer.layerZeroName, 7, ltc.name);
		this.styleStandard = this.tables.addStyle("Standard");
		this.tables.addAppId("ACAD", 0);
		this.dimStyleStandard = this.tables.addDimStyle("Standard");
		this.dimStyleStandard.DIMTXSTY = this.styleStandard.handle;
		this.activeVPort = this.tables.addVPort("*Active");
		this.modelSpace = this.blocks.modelSpace;
		this.paperSpace = this.blocks.paperSpace;
		this.setZeroLayerAsCurrent();
	}
	dxfy(dx) {
		this.header.dxfy(dx);
		this.classes.dxfy(dx);
		this.tables.dxfy(dx);
		this.blocks.dxfy(dx);
		this.entities.dxfy(dx);
		this.objects.dxfy(dx);
	}
	addBlock(name) {
		return this.blocks.addBlock(name, this.objects);
	}
	setZeroLayerAsCurrent() {
		this.setCurrentLayerName(DxfLayer.layerZeroName);
	}
	setCurrentLayerName(name) {
		this.currentLayerName = name.replace(specialCharsRegex, "");
		this.entities.setLayerName(this.currentLayerName);
		this.setCLayerVariable();
	}
	_handseed() {
		this.header.setVariable("$HANDSEED", { 5: Handle.peek() });
	}
	setUnits(units) {
		this.currentUnits = units;
		this.header.setVariable("$INSUNITS", { 70: this.currentUnits });
	}
	setCLayerVariable() {
		this.header.setVariable("$CLAYER", { 8: this.currentLayerName });
	}
	setViewCenter(center) {
		this.header.setVariable("$VIEWCTR", {
			10: center.x,
			20: center.y
		});
		this.activeVPort.viewCenter = [center.x, center.y];
	}
	stringify() {
		const dx = new Dxfier();
		this._handseed();
		this.setViewCenter(this.modelSpace.centerView());
		this.activeVPort.viewHeight = this.modelSpace.viewHeight();
		this.dxfy(dx);
		return dx.stringify();
	}
};
//#endregion
//#region src/DxfWriter.ts
/**
* The base class for creating the dxf content.
*/
var DxfWriter = class {
	get header() {
		return this.document.header;
	}
	get tables() {
		return this.document.tables;
	}
	get blocks() {
		return this.document.blocks;
	}
	get entities() {
		return this.document.entities;
	}
	get currentLayer() {
		return this.document.currentLayerName;
	}
	get units() {
		return this.document.currentUnits;
	}
	get modelSpace() {
		return this.document.modelSpace;
	}
	constructor() {
		this.document = new DxfDocument();
	}
	/**
	* Get the layer object by name.
	* @param name The name of the layer.
	* @returns The layer object.
	*/
	layer(name) {
		return this.tables.layer(name);
	}
	/**
	* Sets the zero layer as current layer.
	*/
	setZeroLayerAsCurrent() {
		this.document.setZeroLayerAsCurrent();
	}
	/**
	* Add a block to the blocks tables.
	* @param name - The block name.
	* @returns The added block.
	*/
	addBlock(name) {
		return this.blocks.addBlock(name, this.document.objects);
	}
	/**
	* Add new paper space block to the blocks tables.
	* @returns The added block.
	*/
	addPaperSpace() {
		return this.blocks.addPaperSpace();
	}
	/**
	* Add a header variable to the dxf if not exist.
	* If exist it will update values.
	*
	* @example
	* ```js
	* const dxf = new DxfWriter();
	* dxf.setVariable("$ANGDIR", {70: 1});
	* dxf.setVariable("$EXTMAX", {10: 500, 20: 500, 30: 0});
	* ```
	* @param name - The name of the variable. Ex: $ANGDIR, $EXTMAX, ...
	* @param values - The values corresponding to the variable.
	*/
	setVariable(name, values) {
		this.header.setVariable(name, values);
	}
	/**
	* Add a new LineType to the dxf.
	*
	* @param name - Name of the lineType.
	* @param descriptive - The descriptive of the line ex: __ __ . __ __ .
	* @param elements - An array of elements of the pattern. 📝 Need more explications 😭!
	*/
	addLType(name, descriptive, elements) {
		return this.tables.addLType(name, descriptive, elements);
	}
	/**
	* Add a Dimension style.
	*
	* @param name Dimension style name
	* @returns Dimension style object
	*/
	addDimStyle(name) {
		return this.tables.addDimStyle(name);
	}
	/**
	* Add an aligned dimension entity to the dxf.
	* @param first The first definition point for linear and angular dimensions.
	* @param second The second definition point for linear and angular dimensions.
	* @param options The options of the aligned dimension entity.
	* @returns
	*/
	addAlignedDim(first, second, options) {
		return this.modelSpace.addAlignedDim(first, second, options);
	}
	/**
	* Add a diameter dimension entity to the dxf.
	* @param first The first definition point for diameter dimensions.
	* @param second The second definition point for diameter dimensions.
	* @param options The options of the diameter dimension entity.
	* @returns
	*/
	addDiameterDim(first, second, options) {
		return this.modelSpace.addDiameterDim(first, second, options);
	}
	/**
	* Add a radial dimension entity to the dxf.
	* @param first The first definition point for radius dimensions.
	* @param second The second definition point for radius dimensions.
	* @param options The options of the radial dimension entity.
	* @returns
	*/
	addRadialDim(first, second, options) {
		return this.modelSpace.addRadialDim(first, second, options);
	}
	/**
	* Add a linear dimension entity to the dxf.
	* @param first The first definition point for linear and angular dimensions.
	* @param second The second definition point for linear and angular dimensions.
	* @param options The options of the radial dimension entity.
	* @returns
	*/
	addLinearDim(first, second, options) {
		return this.modelSpace.addLinearDim(first, second, options);
	}
	/**
	* Add an angular dimension entity to the dxf.
	* @param first The first extension line defined by a start and an end points.
	* @param second The second extension line defined by a start and an end points.
	* @param location The location of the dimension line arc.
	* @param options The options of the dimension.
	* @returns The added dimension entity.
	*/
	addAngularLinesDim(first, second, location, options) {
		return this.modelSpace.addAngularLinesDim(first, second, location, options);
	}
	/**
	* Add an angular dimension entity to the dxf.
	* @param center The vertex of the angle.
	* @param first The endpoint of the first extension line.
	* @param second The endpoint of the second extension line.
	* @param options The options of the dimension.
	* @returns The added dimension entity.
	*/
	/**
	* Add a Hatch entity to the dxf.
	* @param boundaryPath - The boundary paths.
	* @param fill - The fill aka solid or gradient.
	* @param options - The options of the hatch entity.
	* @returns The added hatch entity.
	*/
	addHatch(boundaryPath, fill, options) {
		return this.modelSpace.addHatch(boundaryPath, fill, options);
	}
	/**
	* Add a new Layer to the dxf.
	* @param name - The name of the layer.
	* @param color - The color number. See [AutoCAD Color Index](https://gohtx.com/acadcolors.php).
	* @param lineType - The lineType name.
	* @param flags - Layer standard flags (bit-coded values).
	* @returns Return the added layer.
	*/
	addLayer(name, color, lineType, flags = 0) {
		if (!lineType) lineType = "Continuous";
		return this.tables.addLayer(name, color, lineType, flags);
	}
	/**
	* Set the current layer name of the dxf.
	* @param name - The layer name.
	*/
	setCurrentLayerName(name) {
		this.document.setCurrentLayerName(name);
	}
	/**
	* Set the units of the dxf.
	*
	* @param units - The units for AutoCAD DesignCenter blocks.
	*/
	setUnits(units) {
		this.document.setUnits(units);
	}
	/**
	* Add a Line entity to the dxf.
	*
	* @param startPoint - The start point of the line.
	* @param endPoint - The end point of the line.
	* @param options - The options of the line entity.
	* @returns Return the added line.
	*/
	addLine(startPoint, endPoint, options) {
		return this.modelSpace.addLine(startPoint, endPoint, options);
	}
	/**
	* Add a Leader entity to the dxf.
	* [Dxf Leader](https://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-396B2369-F89F-47D7-8223-8B7FB794F9F3)
	*
	* @param points - An array of points.
	* @param options - The options of the leader entity.
	*
	* @returns Returns the added leader.
	*/
	addLeader(points, options) {
		return this.modelSpace.addLeader(points, options);
	}
	/**
	* Add a LWPolyline entity to the dxf.
	*
	* [Dxf Polyline](http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-ABF6B778-BE20-4B49-9B58-A94E64CEFFF3)
	*
	* The Polyline entity can represent the Rectangle and the Polygon
	* just pass the array of points and LWPolylineFlags.Closed flag.
	*
	* @param points - An array of {@link LWPolylineVertex}.
	* @param options - The options of LWPolyline entity.
	*
	* @returns Return the added lwpolyline.
	*/
	addLWPolyline(points, options) {
		return this.modelSpace.addLWPolyline(points, options);
	}
	/**
	* Add a Rectangle as closed LWPolyline entity to the dxf.
	* In DXF Reference there is no entity called Rectangle or Polygon.
	* To represent these entities (Rectangle and Polygon) use Polyline entity (Closed).
	*
	* @param topLeft - The top left corner of the rectangle.
	* @param bottomRight - The bottom right corner of the rectangle.
	* @param options - The options to apply to the rectangle.
	* @returns Return the added lwpolyline.
	*/
	addRectangle(topLeft, bottomRight, options) {
		return this.modelSpace.addRectangle(topLeft, bottomRight, options);
	}
	/**
	* Add a 3D Polyline entity to the dxf.
	* @param vertices - An array of points.
	* @param options - The options to apply to the polyline.
	* @returns Return the added polyline.
	*/
	addPolyline3D(vertices, options) {
		return this.modelSpace.addPolyline3D(vertices, options);
	}
	/**
	* Add a Point entity to the dxf.
	*
	* @param x - The X coordinate of the point.
	* @param y - The Y coordinate of the point.
	* @param z - The Z coordinate of the point.
	* @param options - The options to apply to the point.
	* @returns Return the added point.
	*/
	addPoint(x, y, z, options) {
		return this.modelSpace.addPoint(x, y, z, options);
	}
	/**
	* Add a Circle entity to the dxf.
	*
	* @param center - The center point of the circle.
	* @param radius - The radius of the circle.
	* @param options - The Circle entity options;
	* @returns Return the added circle.
	*/
	addCircle(center, radius, options) {
		return this.modelSpace.addCircle(center, radius, options);
	}
	/**
	* Add an Arc entity to the dxf.
	*
	* @param center - The center of the arc.
	* @param radius - The radius of the arc.
	* @param startAngle - The start of the angle (beginning of arc) in degrees Anticlockwise.
	* @param endAngle - The end of the angle (end of arc) in degrees Anticlockwise.
	* Angles always start from The X-axis towards anticlockwise.
	* @param options - Arc entity options.
	* @returns Return the added arc.
	*/
	addArc(center, radius, startAngle, endAngle, options) {
		return this.modelSpace.addArc(center, radius, startAngle, endAngle, options);
	}
	/**
	* Add a Spline entity to the dxf. It's a NURBS.
	*
	* NURBS, Non-Uniform Rational B-Splines, are mathematical representations of 3D geometry that
	* can accurately describe any shape from a simple 2D line, circle, arc, or curve to the most
	* complex 3D organic free-form surface or solid. Because of their flexibility and accuracy,
	* NURBS models can be used in any process, from illustration and animation to manufacturing.
	*
	* For more information see : [NURBS](https://www.rhino3d.com/features/nurbs/) and
	* [Dxf Spline](http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-E1F884F8-AA90-4864-A215-3182D47A9C74)
	*
	* @param splineArgs - The Spline arguments. See {@link SplineArgs}.
	* @param options - The options of the spline entity.
	* @returns Return the added spline.
	*/
	addSpline(splineArgs, options) {
		return this.modelSpace.addSpline(splineArgs, options);
	}
	/**
	* Add an Ellipse entity to the dxf.
	*
	* @param center - The center point of the ellipse.
	* @param endPointOfMajorAxis - The end point of major axis, relative to the center of the ellipse.
	* @param ratioOfMinorAxisToMajorAxis - The ratio of minor axis to major axis.
	* @param startParameter - The start parameter (this value is 0.0 for a full ellipse).
	* @param endParameter - The end parameter (this value is 2pi for a full ellipse).
	* @param options
	* @returns Return the added ellipse.
	*/
	addEllipse(center, endPointOfMajorAxis, ratioOfMinorAxisToMajorAxis, startParameter, endParameter, options) {
		return this.modelSpace.addEllipse(center, endPointOfMajorAxis, ratioOfMinorAxisToMajorAxis, startParameter, endParameter, options);
	}
	/**
	* Add an Image entity to the dxf.
	* @example
	* ```js
	* const dxf = new DxfWriter();
	* dxf.addImage(
	*    '.\\test.png', // Or the absolute path if not in the same folder.
	*    'test', // The name of the image.
	*    point3d(10, 10, 0), // The insertion point.
	*    600, // The width of the image in pixels.
	*    600, //The height of the image in pixels.
	*    1, // The scale to be applied to the image.
	*    0 //The scale to be applied to the image.
	* );
	* ```
	* @param imagePath - The path of the image.
	* @param name - The name of the image.
	* @param insertionPoint - The insertion point.
	* @param width - The width of the image in pixels.
	* @param height - The height of the image in pixels.
	* @param scale - The scale to be applied to the image.
	* @param rotation - The rotation angle (Degrees) to be applied to the image.
	* @param options
	* @returns Return the added image.
	*/
	addImage(imagePath, name, insertionPoint, width, height, scale, rotation, options) {
		return this.modelSpace.addImage(imagePath, name, insertionPoint, width, height, scale, rotation, options);
	}
	/**
	* Add a 3D Face entity to the dxf.
	*
	* @param firstCorner - The first corner of the 3d face.
	* @param secondCorner - The first corner of the 3d face.
	* @param thirdCorner - The first corner of the 3d face.
	* @param fourthCorner - The first corner of the 3d face. \
	* If you want only three corners, make this is the same as the third corner
	* @param options - The options of the 3dFace entity.
	* @returns Return the added face.
	*/
	add3dFace(firstCorner, secondCorner, thirdCorner, fourthCorner, options) {
		return this.modelSpace.add3dFace(firstCorner, secondCorner, thirdCorner, fourthCorner, options);
	}
	/**
	* Add a text entity to the dxf.
	* @param firstAlignmentPoint - The first alignment point of the text.
	* @param height - The text height.
	* @param value - The default value (the string itself).
	* @param options - The options of the text entity.
	* @returns Return the added text.
	*/
	addText(firstAlignmentPoint, height, value, options) {
		return this.modelSpace.addText(firstAlignmentPoint, height, value, options);
	}
	/**
	* Add an attdef entity to the dxf.
	*
	* @param firstAlignmentPoint
	* @param height
	* @param tag
	* @param value
	* @param options
	*/
	addAttdef(firstAlignmentPoint, height, tag, value, options) {
		return this.modelSpace.addAttdef(firstAlignmentPoint, height, tag, value, options);
	}
	/**
	* Add an attrib entity to the dxf.
	* @param firstAlignmentPoint
	* @param height
	* @param tag
	* @param value
	* @param ownerInsert
	* @param options
	*/
	addAttrib(firstAlignmentPoint, height, tag, value, ownerInsert, options) {
		return this.modelSpace.addAttrib(firstAlignmentPoint, height, tag, value, ownerInsert, options);
	}
	/**
	* Add a Mtext entity to the dxf.
	* @param firstAlignementPoint - The first alignment point of the Mtext.
	* @param height - The Mtext height.
	* @param value - The default value (the string itself).
	* @param options - The options of the Mtext entity.
	* @returns Return the added Mtext.
	*/
	addMText(firstAlignementPoint, height, value, options) {
		return this.modelSpace.addMText(firstAlignementPoint, height, value, options);
	}
	/**
	* Add an insert entity to the dxf.
	*
	* @param blockName - The name of the block to insert.
	* @param insertionPoint - The point where the block is to be inserted.
	* @param options - The options of the Insert entity.
	* @returns Return the added insert.
	*/
	addInsert(blockName, insertionPoint, options) {
		return this.modelSpace.addInsert(blockName, insertionPoint, options);
	}
	/**
	* Add a table entity to the dxf
	*
	* @param blockName - The name of the block
	* @param position - The point where the Table is to be placed
	* @param noOfRows - The no of rows
	* @param noOfColumn - The no of columns
	* @param rowHeights - Array of row heights
	* @param columnHeights - Array of column heights
	* @param tableOptions - the option of the Table entity
	* @returns Returns the added Table
	*/
	addTable(blockName, position, noOfRows, noOfColumn, rowHeights, columnHeights, tableOptions) {
		return this.modelSpace.addTable(blockName, position, noOfRows, noOfColumn, rowHeights, columnHeights, tableOptions);
	}
	/**
	* Get the content of the dxf.
	*
	* @returns Return the dxf string.
	*/
	stringify() {
		return this.document.stringify();
	}
};
//#endregion
export { AlignedDimension, AngularDimLines, AngularDimPoints, AppIdFlags, Arc, ArcDimension, ArrowHeadFlag, AssociativityFlag, AttachmentPoint, Attdef, Attrib, BlockFlags, BoundingBox, Cell, CellAlignment, CellAutoFitFlag, CellMerged, CellType, Circle, Colors, DiameterDimension, DimStyleFlags, Dimension, DimensionType, DxfAppId, DxfAppIdTable, DxfBlock, DxfBlockRecord, DxfBlockRecordTable, DxfBlocksSection, DxfClassesSection, DxfDictionary, DxfDimStyle, DxfDimStyleTable, DxfDocument, DxfEndBlk, DxfEntitiesSection, DxfHeaderSection, DxfImageDef, DxfImageDefReactor, DxfLType, DxfLTypeTable, DxfLayer, DxfLayerTable, DxfObject, DxfObjectsSection, DxfRasterVariables, DxfRecord, DxfStyle, DxfStyleTable, DxfTable, DxfTablesSection, DxfUcs, DxfUcsTable, DxfVPort, DxfVPortTable, DxfVariable, DxfView, DxfViewTable, DxfWriter, Dxfier, Ellipse, EntitiesManager, ExtendedData, Face, GradientType, Hatch, HatchArcEdgeData, HatchBoundaryPaths, HatchEdgesTypeData, HatchLineEdgeData, HatchPattern, HatchPatternType, HatchPolylineBoundary, HatchPredefinedPatterns, HatchStyle, Image, ImageClipModeFlag, ImageClippingStateFlag, ImageClippingType, ImageDefResolutionUnits, ImageDisplayFlags, Insert, InvisibleEdgeFlags, LWPolyline, LWPolylineFlags, LayerFlags, Leader, LeaderPathType, Line, LineTypes, LinearDimension, MText, MTextAttachmentPoint, MTextDrawingDirection, MTextLineSpacingStyle, PathTypeFlag, Point, Polyline, PolylineFlags, RadialDimension, SeqEnd, SolidFillFlag, Spline, SplineFlags, StyleFlags, SurfaceType, Table, Text, TextGenerationFlags, TextHorizontalAlignment, TextLineSpacingStyle, TextVerticalAlignment, TrueColor, Units, Vertex, VertexFlags, ViewFlags, aciHex, bulge, createBoundingBox, deg2rad, gradient, pattern, point2d, point3d, rad2deg, stringByteSize, stringChunksSplit, tag, vertex };
