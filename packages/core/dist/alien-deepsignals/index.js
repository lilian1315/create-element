import { i as handleChildren, n as classkeys, r as handleAttribute, t as childToNode } from "../utils-Cxvtubyt.js";
import { effect, isComputed, isSignal } from "alien-deepsignals";

//#region src/alien-deepsignals/utils.ts
function handleSignalAttribute(element, key, value) {
	if (isSignal(value) || isComputed(value)) {
		effect(() => handleAttribute(element, key, value.get()));
		return;
	}
	if (typeof key === "string") {
		if (handleClassSignalAttribute(element, key, value)) return;
		if (handleStyleSignalAttribute(element, key, value)) return;
		if (handleDataSignalAttribute(element, key, value)) return;
	}
	handleAttribute(element, key, value);
}
function handleClassSignalAttribute(element, name, value) {
	if (!classkeys.includes(name)) return false;
	if (Array.isArray(value)) {
		effect(() => {
			element.classList = "";
			for (let v of value) {
				if (isSignal(v) || isComputed(v)) v = v.get();
				if (v) element.classList.add(v);
			}
		});
		return true;
	}
	if (typeof value === "object") {
		for (const k of Object.keys(value)) effect(() => {
			let v = value[k];
			if (isSignal(v) || isComputed(v)) v = v.get();
			element.classList.toggle(k, v === true);
		});
		return true;
	}
	return false;
}
function handleStyleSignalAttribute(element, name, value) {
	if (name !== "style") return false;
	if (typeof value === "object" && value !== null) {
		if (element instanceof SVGElement) effect(() => {
			const styleString = Object.entries(value).map(([key, val]) => {
				return `${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}: ${isSignal(val) || isComputed(val) ? val.get() : val};`;
			}).join("");
			element.setAttribute("style", styleString);
		});
		else for (const key of Object.keys(value)) effect(() => {
			let val = value[key];
			if (isSignal(val) || isComputed(val)) val = val.get();
			element.style[key] = val;
		});
		return true;
	}
	return false;
}
function handleDataSignalAttribute(element, key, value) {
	if (key !== "data") return false;
	if (typeof value === "object" && value !== null) {
		for (const k of Object.keys(value)) {
			let v = value[k];
			effect(() => {
				if (isSignal(v) || isComputed(v)) v = v.get();
				if (typeof v === "string") element.dataset[k] = v;
			});
		}
		return true;
	}
	return false;
}
function handleSignalChildren(element, children) {
	if (isSignal(children) || isComputed(children)) {
		let placeholder = null;
		const getPlaceholder = () => {
			if (!placeholder) placeholder = document.createComment("signal placeholder");
			return placeholder;
		};
		const nodes = [];
		effect(() => {
			const newNodes = getNodes(children);
			if (newNodes.length === 0) newNodes.push(getPlaceholder());
			let lastInsertedNode = null;
			for (let i = 0; i < Math.max(newNodes.length, nodes.length); i++) {
				const newNode = newNodes[i];
				const node = nodes[i];
				const isInNew = node && newNodes.indexOf(node) !== -1;
				if (node && !isInNew && i + 1 < nodes.length) {
					if (element.contains(node)) element.removeChild(node);
					nodes.splice(i, 1);
					i--;
					continue;
				}
				if (newNode && newNode === node) {
					lastInsertedNode = newNode;
					continue;
				}
				if (newNode) {
					if (node && element.contains(node)) element.insertBefore(newNode, node);
					else if (lastInsertedNode && element.contains(lastInsertedNode)) insertAfter(element, newNode, lastInsertedNode);
					else element.appendChild(newNode);
					const indexInOld = nodes.indexOf(newNode);
					if (indexInOld !== -1) nodes.splice(indexInOld, 1);
					nodes.splice(i, 0, newNode);
					lastInsertedNode = newNode;
					continue;
				}
				if (!newNode && node) {
					for (let j = i; j < nodes.length; j++) if (element.contains(nodes[j])) element.removeChild(nodes[j]);
					nodes.splice(i);
					break;
				}
			}
		});
		return;
	}
	handleChildren(element, children);
}
function getNodes(reactiveChild) {
	const value = getReactiveChildValue(reactiveChild);
	const nodes = [];
	if (Array.isArray(value)) value.forEach((v) => {
		const node = childToNode(v);
		if (node) nodes.push(node);
	});
	else {
		const node = childToNode(value);
		if (node) nodes.push(node);
	}
	return nodes;
}
function getReactiveChildValue(child) {
	if (isSignal(child) || isComputed(child)) return child.get();
	throw new Error("Invalid reactive child");
}
function insertAfter(parent, newNode, referenceNode) {
	const nextNode = referenceNode.nextSibling;
	if (nextNode) parent.insertBefore(newNode, nextNode);
	else parent.appendChild(newNode);
}

//#endregion
//#region src/alien-deepsignals/index.ts
function el(tag, attributes, ...children) {
	let element;
	if (tag === "svg" || tag.startsWith("svg:")) element = document.createElementNS("http://www.w3.org/2000/svg", tag === "svg" ? "svg" : tag.substring(4));
	else if (tag === "math" || tag.startsWith("math:")) element = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag === "math" ? "math" : tag.substring(5));
	else element = document.createElement(tag);
	if (attributes) for (let key of Reflect.ownKeys(attributes)) if (key === "children") {
		var _attributes$children;
		(_attributes$children = attributes.children) === null || _attributes$children === void 0 || _attributes$children.flat().forEach((child) => handleSignalChildren(element, child));
	} else handleSignalAttribute(element, key, attributes[key]);
	children.flat().forEach((child) => handleSignalChildren(element, child));
	return element;
}

//#endregion
export { el };
//# sourceMappingURL=index.js.map