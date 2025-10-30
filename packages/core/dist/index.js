import { i as handleChildren, r as handleAttribute } from "./utils-Cxvtubyt.js";

//#region src/index.ts
function el(tag, attributes, ...children) {
	let element;
	if (tag === "svg" || tag.startsWith("svg:")) element = document.createElementNS("http://www.w3.org/2000/svg", tag.substring(4));
	else if (tag === "math" || tag.startsWith("math:")) element = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag.substring(5));
	else element = document.createElement(tag);
	if (attributes) for (let key of Reflect.ownKeys(attributes)) if (key === "children") {
		var _attributes$children;
		(_attributes$children = attributes.children) === null || _attributes$children === void 0 || _attributes$children.forEach((subChildren) => handleChildren(element, subChildren));
	} else handleAttribute(element, key, attributes[key]);
	children.forEach((subChildren) => handleChildren(element, subChildren));
	return element;
}

//#endregion
export { el };
//# sourceMappingURL=index.js.map