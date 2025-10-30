//#region src/utils.ts
const classkeys = [
	"class",
	"className",
	"classList"
];
function handleAttribute(element, key, value) {
	if (typeof key === "string") {
		if (handleClassAttribute(element, key, value)) return;
		if (handleStyleAttribute(element, key, value)) return;
		if (handleEventHandlerAttribute(element, key, value)) return;
		if (handleDataAttribute(element, key, value)) return;
	}
	if (key in element) try {
		element[key] = value;
		return;
	} catch (_unused) {}
	if (typeof key === "string") element.setAttribute(key, String(value));
}
function handleClassAttribute(element, name, value) {
	if (!classkeys.includes(name)) return false;
	if (typeof value === "string") {
		element.classList = "";
		element.classList.add(...value.split(" ").filter(Boolean));
	} else if (Array.isArray(value)) value.filter(Boolean).forEach((className) => element.classList.add(className));
	else if (typeof value === "object" && value !== null) Object.entries(value).forEach(([className, shouldInclude]) => {
		element.classList.toggle(className, !!shouldInclude);
	});
	return true;
}
function handleEventHandlerAttribute(element, name, value) {
	if (!name.startsWith("on") || typeof value !== "function") return false;
	const eventName = name.slice(2).toLowerCase();
	element.addEventListener(eventName, value);
	return true;
}
function handleStyleAttribute(element, name, value) {
	if (name !== "style") return false;
	if (typeof value === "string") element.setAttribute("style", value);
	else if (typeof value === "object" && value !== null) if (element instanceof SVGElement) {
		const styleString = Object.entries(value).map(([key, val]) => {
			return `${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}: ${val};`;
		}).join(" ");
		element.setAttribute("style", styleString);
	} else Object.assign(element.style, value);
	return true;
}
function handleDataAttribute(element, key, value) {
	if (key !== "data" || typeof value !== "object" || value === null) return false;
	Object.assign(element.dataset, value);
	return true;
}
function handleChildren(element, children) {
	if (!Array.isArray(children)) children = [children];
	children.forEach((child) => {
		const node = childToNode(child);
		if (node) element.appendChild(node);
	});
}
function childToNode(child) {
	if (child === null || child === void 0) return null;
	if (typeof child === "string" || typeof child === "number") return document.createTextNode(child.toString());
	else return child;
}

//#endregion
export { handleChildren as i, classkeys as n, handleAttribute as r, childToNode as t };
//# sourceMappingURL=utils-Cxvtubyt.js.map