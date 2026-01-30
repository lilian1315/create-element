export namespace DOMTypes {
    /**
     * The **`HTMLAnchorElement`** interface represents hyperlink elements and provides special properties and methods (beyond those of the regular HTMLElement object interface that they inherit from) for manipulating the layout and presentation of such elements. This interface corresponds to <a> element; not to be confused with <link>, which is represented by HTMLLinkElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement)
     */
    export interface HTMLAnchorElement extends HTMLElement, HTMLHyperlinkElementUtils {
        relList: string;
        /** @deprecated */
        charset: string;
        /** @deprecated */
        coords: string;
        /**
         * The **`HTMLAnchorElement.download`** property is a string indicating that the linked resource is intended to be downloaded rather than displayed in the browser. The value, if any, specifies the default file name for use in labeling the resource in a local file system. If the name is not a valid file name in the underlying OS, the browser will adjust it.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/download)
         */
        download: string;
        /**
         * The **`hreflang`** property of the HTMLAnchorElement interface is a string that is the language of the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/hreflang)
         */
        hreflang: string;
        /** @deprecated */
        name: string;
        /**
         * The **`ping`** property of the HTMLAnchorElement interface is a space-separated list of URLs. When the link is followed, the browser will send POST requests with the body PING to the URLs.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/ping)
         */
        ping: string;
        /**
         * The **`HTMLAnchorElement.referrerPolicy`** property reflect the HTML referrerpolicy attribute of the <a> element defining which referrer is sent when fetching the resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/referrerPolicy)
         */
        referrerPolicy: string;
        /**
         * The **`HTMLAnchorElement.rel`** property reflects the rel attribute. It is a string containing a space-separated list of link types indicating the relationship between the resource represented by the <a> element and the current document.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/rel)
         */
        rel: string;
        /** @deprecated */
        rev: string;
        /** @deprecated */
        shape: string;
        /**
         * The **`target`** property of the HTMLAnchorElement interface is a string that indicates where to display the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/target)
         */
        target: string;
        /**
         * The **`text`** property of the HTMLAnchorElement represents the text inside the element. This property represents the same information as Node.textContent.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/text)
         */
        text: string;
        /**
         * The **`type`** property of the HTMLAnchorElement interface is a string that indicates the MIME type of the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/type)
         */
        type: string;
    }

    /**
     * The **`HTMLElement`** interface represents any HTML element. Some elements directly implement this interface, while others implement it via an interface that inherits it.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement)
     */
    export interface HTMLElement extends Element, ElementCSSInlineStyle, ElementContentEditable, GlobalEventHandlers, HTMLOrSVGElement {
        /**
         * The **`HTMLElement.accessKey`** property sets the keystroke which a user can press to jump to a given element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/accessKey)
         */
        accessKey: string;
        /**
         * The **`autocapitalize`** property of the HTMLElement interface represents the element's capitalization behavior for user input. It is available on all HTML elements, though it doesn't affect all of them, including:
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocapitalize)
         */
        autocapitalize: string;
        /**
         * The **`autocorrect`** property of the HTMLElement interface controls whether or not autocorrection of editable text is enabled for spelling and/or punctuation errors.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autocorrect)
         */
        autocorrect: boolean;
        /**
         * The **`HTMLElement.dir`** property indicates the text writing directionality of the content of the current element. It reflects the element's dir attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dir)
         */
        dir: string;
        /**
         * The **`draggable`** property of the HTMLElement interface gets and sets a Boolean primitive indicating if the element is draggable.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/draggable)
         */
        draggable: boolean;
        /**
         * The HTMLElement property **`hidden`** reflects the value of the element's hidden attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidden)
         */
        hidden: boolean | "until-found";
        /**
         * The HTMLElement property **`inert`** reflects the value of the element's inert attribute. It is a boolean value that, when present, makes the browser "ignore" user input events for the element, including focus events and events from assistive technologies. The browser may also ignore page search and text selection in the element. This can be useful when building UIs such as modals where you would want to "trap" the focus inside the modal when it's visible.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert)
         */
        inert: boolean;
        /**
         * The **`lang`** property of the HTMLElement interface indicates the base language of an element's attribute values and text content, in the form of a BCP 47 language tag. It reflects the element's lang attribute; the xml:lang attribute does not affect this property.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/lang)
         */
        lang: string;
        /**
         * The **`popover`** property of the HTMLElement interface gets and sets an element's popover state via JavaScript ("auto", "hint", or "manual"), and can be used for feature detection.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/popover)
         */
        popover: string | null;
        /**
         * The **`spellcheck`** property of the HTMLElement interface represents a boolean value that controls the spell-checking hint. It is available on all HTML elements, though it doesn't affect all of them.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/spellcheck)
         */
        spellcheck: boolean;
        /**
         * The **`HTMLElement.title`** property represents the title of the element: the text usually displayed in a 'tooltip' popup when the mouse is over the node.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/title)
         */
        title: string;
        /**
         * The **`translate`** property of the HTMLElement interface indicates whether an element's attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/translate)
         */
        translate: boolean;
        /**
         * The **`writingSuggestions`** property of the HTMLElement interface is a string indicating if browser-provided writing suggestions should be enabled under the scope of the element or not.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/writingSuggestions)
         */
        writingSuggestions: string;
    }

    /**
     * **`Element`** is the most general base class from which all element objects (i.e., objects that represent elements) in a Document inherit. It only has methods and properties common to all kinds of elements. More specific classes inherit from Element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element)
     */
    interface Element extends Node, ARIAMixin, Animatable, ChildNode, NonDocumentTypeChildNode, ParentNode, Slottable {
        part: string;
        textContent: string;
        /**
         * The **`id`** property of the Element interface represents the element's identifier, reflecting the id global attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/id)
         */
        id: string;
        /**
         * The **`innerHTML`** property of the Element interface gets or sets the HTML or XML markup contained within the element, omitting any shadow roots in both cases.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/innerHTML)
         */
        innerHTML: string;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenchange_event) */
        onfullscreenchange: ((this: Element, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/fullscreenerror_event) */
        onfullscreenerror: ((this: Element, ev: Event) => any) | null;
        /**
         * The **`scrollLeft`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its left edge. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollLeft)
         */
        scrollLeft: number;
        /**
         * The **`scrollTop`** property of the Element interface gets or sets the number of pixels by which an element's content is scrolled from its top edge. This value is subpixel precise in modern browsers, meaning that it isn't necessarily a whole number.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/scrollTop)
         */
        scrollTop: number;
        /**
         * The **`slot`** property of the Element interface returns the name of the shadow DOM slot the element is inserted in.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/slot)
         */
        slot: string;
    }

    /**
     * The DOM **`Node`** interface is an abstract base class upon which many other DOM API objects are based, thus letting those object types be used similarly and often interchangeably. As an abstract class, there is no such thing as a plain Node object. All objects that implement Node functionality are based on one of its subclasses. Most notable are Document, Element, and DocumentFragment.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node)
     */
    interface Node extends EventTarget {
    }

    /**
     * The **`EventTarget`** interface is implemented by objects that can receive events and may have listeners for them. In other words, any target of events implements the three methods associated with this interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget)
     */
    interface EventTarget {
    }

    interface ARIAMixin {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaActiveDescendantElement) */
        ariaActiveDescendantElement: Element | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAtomic) */
        ariaAtomic: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaAutoComplete) */
        ariaAutoComplete: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleLabel) */
        ariaBrailleLabel: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBrailleRoleDescription) */
        ariaBrailleRoleDescription: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaBusy) */
        ariaBusy: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaChecked) */
        ariaChecked: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColCount) */
        ariaColCount: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndex) */
        ariaColIndex: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColIndexText) */
        ariaColIndexText: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaColSpan) */
        ariaColSpan: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaControlsElements) */
        ariaControlsElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaCurrent) */
        ariaCurrent: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescribedByElements) */
        ariaDescribedByElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDescription) */
        ariaDescription: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDetailsElements) */
        ariaDetailsElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaDisabled) */
        ariaDisabled: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaErrorMessageElements) */
        ariaErrorMessageElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaExpanded) */
        ariaExpanded: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaFlowToElements) */
        ariaFlowToElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHasPopup) */
        ariaHasPopup: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaHidden) */
        ariaHidden: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaInvalid) */
        ariaInvalid: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaKeyShortcuts) */
        ariaKeyShortcuts: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabel) */
        ariaLabel: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLabelledByElements) */
        ariaLabelledByElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLevel) */
        ariaLevel: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaLive) */
        ariaLive: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaModal) */
        ariaModal: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiLine) */
        ariaMultiLine: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaMultiSelectable) */
        ariaMultiSelectable: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOrientation) */
        ariaOrientation: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaOwnsElements) */
        ariaOwnsElements: ReadonlyArray<Element> | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPlaceholder) */
        ariaPlaceholder: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPosInSet) */
        ariaPosInSet: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaPressed) */
        ariaPressed: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaReadOnly) */
        ariaReadOnly: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRelevant) */
        ariaRelevant: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRequired) */
        ariaRequired: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRoleDescription) */
        ariaRoleDescription: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowCount) */
        ariaRowCount: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndex) */
        ariaRowIndex: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowIndexText) */
        ariaRowIndexText: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaRowSpan) */
        ariaRowSpan: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSelected) */
        ariaSelected: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSetSize) */
        ariaSetSize: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaSort) */
        ariaSort: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMax) */
        ariaValueMax: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueMin) */
        ariaValueMin: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueNow) */
        ariaValueNow: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/ariaValueText) */
        ariaValueText: string | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/role) */
        role: string | null;
    }

    interface Animatable {
    }

    interface ChildNode extends Node {
    }

    interface NonDocumentTypeChildNode {
    }

    interface ParentNode extends Node {
    }

    interface Slottable {
    }

    interface ElementCSSInlineStyle {
    }

    interface ElementContentEditable {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/contentEditable) */
        contentEditable: string;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/enterKeyHint) */
        enterKeyHint: string;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/inputMode) */
        inputMode: string;
    }

    interface GlobalEventHandlers {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/abort_event) */
        onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationcancel_event) */
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event) */
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event) */
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event) */
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/auxclick_event) */
        onauxclick: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforeinput_event) */
        onbeforeinput: ((this: GlobalEventHandlers, ev: InputEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforematch_event) */
        onbeforematch: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/beforetoggle_event) */
        onbeforetoggle: ((this: GlobalEventHandlers, ev: ToggleEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/blur_event) */
        onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event) */
        oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplay_event) */
        oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplaythrough_event) */
        oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event) */
        onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/click_event) */
        onclick: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/close_event) */
        onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/command_event) */
        oncommand: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextlost_event) */
        oncontextlost: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event) */
        oncontextmenu: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextrestored_event) */
        oncontextrestored: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/copy_event) */
        oncopy: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/cuechange_event) */
        oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/cut_event) */
        oncut: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/dblclick_event) */
        ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drag_event) */
        ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragend_event) */
        ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragenter_event) */
        ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragleave_event) */
        ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragover_event) */
        ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragstart_event) */
        ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drop_event) */
        ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/durationchange_event) */
        ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/emptied_event) */
        onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended_event) */
        onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/error_event) */
        onerror: OnErrorEventHandler;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/focus_event) */
        onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/formdata_event) */
        onformdata: ((this: GlobalEventHandlers, ev: FormDataEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/gotpointercapture_event) */
        ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/input_event) */
        oninput: ((this: GlobalEventHandlers, ev: InputEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/invalid_event) */
        oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) */
        onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        /**
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keypress_event)
         */
        onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keyup_event) */
        onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/load_event) */
        onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadeddata_event) */
        onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadedmetadata_event) */
        onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadstart_event) */
        onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/lostpointercapture_event) */
        onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousedown_event) */
        onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseenter_event) */
        onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseleave_event) */
        onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousemove_event) */
        onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseout_event) */
        onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseover_event) */
        onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseup_event) */
        onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/paste_event) */
        onpaste: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/pause_event) */
        onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play_event) */
        onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playing_event) */
        onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointercancel_event) */
        onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerdown_event) */
        onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerenter_event) */
        onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerleave_event) */
        onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointermove_event) */
        onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event) */
        onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerover_event) */
        onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /**
         * Available only in secure contexts.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerrawupdate_event)
         */
        onpointerrawupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerup_event) */
        onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/progress_event) */
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ratechange_event) */
        onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/reset_event) */
        onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/resize_event) */
        onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scroll_event) */
        onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scrollend_event) */
        onscrollend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/securitypolicyviolation_event) */
        onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeked_event) */
        onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeking_event) */
        onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/select_event) */
        onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/selectionchange_event) */
        onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/selectstart_event) */
        onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement/slotchange_event) */
        onslotchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/stalled_event) */
        onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/submit_event) */
        onsubmit: ((this: GlobalEventHandlers, ev: SubmitEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/suspend_event) */
        onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/timeupdate_event) */
        ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/toggle_event) */
        ontoggle: ((this: GlobalEventHandlers, ev: ToggleEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchcancel_event) */
        ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchend_event) */
        ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchmove_event) */
        ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchstart_event) */
        ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitioncancel_event) */
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event) */
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionrun_event) */
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionstart_event) */
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volumechange_event) */
        onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waiting_event) */
        onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /**
         * @deprecated This is a legacy alias of `onanimationend`.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event)
         */
        onwebkitanimationend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /**
         * @deprecated This is a legacy alias of `onanimationiteration`.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event)
         */
        onwebkitanimationiteration: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /**
         * @deprecated This is a legacy alias of `onanimationstart`.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event)
         */
        onwebkitanimationstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /**
         * @deprecated This is a legacy alias of `ontransitionend`.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event)
         */
        onwebkittransitionend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/wheel_event) */
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
    }

    interface HTMLOrSVGElement {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/autofocus) */
        autofocus: boolean;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/nonce) */
        nonce: string;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/tabIndex) */
        tabIndex: number;
    }

    interface HTMLHyperlinkElementUtils {
        /**
         * Returns the hyperlink's URL's fragment (includes leading "#" if non-empty).
         *
         * Can be set, to change the URL's fragment (ignores leading "#").
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/hash)
         */
        hash: string;
        /**
         * Returns the hyperlink's URL's host and port (if different from the default port for the scheme).
         *
         * Can be set, to change the URL's host and port.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/host)
         */
        host: string;
        /**
         * Returns the hyperlink's URL's host.
         *
         * Can be set, to change the URL's host.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/hostname)
         */
        hostname: string;
        /**
         * Returns the hyperlink's URL.
         *
         * Can be set, to change the URL.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/href)
         */
        href: string;
        /**
         * Returns the hyperlink's URL's password.
         *
         * Can be set, to change the URL's password.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/password)
         */
        password: string;
        /**
         * Returns the hyperlink's URL's path.
         *
         * Can be set, to change the URL's path.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/pathname)
         */
        pathname: string;
        /**
         * Returns the hyperlink's URL's port.
         *
         * Can be set, to change the URL's port.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/port)
         */
        port: string;
        /**
         * Returns the hyperlink's URL's scheme.
         *
         * Can be set, to change the URL's scheme.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/protocol)
         */
        protocol: string;
        /**
         * Returns the hyperlink's URL's query (includes leading "?" if non-empty).
         *
         * Can be set, to change the URL's query (ignores leading "?").
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/search)
         */
        search: string;
        /**
         * Returns the hyperlink's URL's username.
         *
         * Can be set, to change the URL's username.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement/username)
         */
        username: string;
    }

    /**
     * The **`HTMLAreaElement`** interface provides special properties and methods (beyond those of the regular object HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of <area> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement)
     */
    export interface HTMLAreaElement extends HTMLElement, HTMLHyperlinkElementUtils {
        relList: string;
        /**
         * The **`alt`** property of the HTMLAreaElement interface specifies the text of the hyperlink, defining the textual label for an image map's link. It reflects the <area> element's alt attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/alt)
         */
        alt: string;
        /**
         * The **`coords`** property of the HTMLAreaElement interface specifies the coordinates of the element's shape as a list of floating-point numbers. It reflects the <area> element's coords attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/coords)
         */
        coords: string;
        /**
         * The **`download`** property of the HTMLAreaElement interface is a string indicating that the linked resource is intended to be downloaded rather than displayed in the browser. The value represent the proposed name of the file. If the name is not a valid filename of the underlying OS, browser will adjust it accordingly.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/download)
         */
        download: string;
        /** @deprecated */
        noHref: boolean;
        /**
         * The **`ping`** property of the HTMLAreaElement interface is a space-separated list of URLs. When the link is followed, the browser will send POST requests with the body PING to the URLs.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/ping)
         */
        ping: string;
        /**
         * The **`HTMLAreaElement.referrerPolicy`** property reflect the HTML referrerpolicy attribute of the <area> element defining which referrer is sent when fetching the resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/referrerPolicy)
         */
        referrerPolicy: string;
        /**
         * The **`HTMLAreaElement.rel`** property reflects the rel attribute. It is a string containing a space-separated list of link types indicating the relationship between the resource represented by the <area> element and the current document.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/rel)
         */
        rel: string;
        /**
         * The **`shape`** property of the HTMLAreaElement interface specifies the shape of an image map area. It reflects the <area> element's shape attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/shape)
         */
        shape: string;
        /**
         * The **`target`** property of the HTMLAreaElement interface is a string that indicates where to display the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement/target)
         */
        target: string;
    }

    /**
     * The **`HTMLAudioElement`** interface provides access to the properties of <audio> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLAudioElement)
     */
    export interface HTMLAudioElement extends HTMLMediaElement {
    }

    /**
     * The **`HTMLMediaElement`** interface adds to HTMLElement the properties and methods needed to support basic media-related capabilities that are common to audio and video.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement)
     */
    export interface HTMLMediaElement extends HTMLElement {
        /**
         * The **`HTMLMediaElement.autoplay`** property reflects the autoplay HTML attribute, indicating whether playback should automatically begin as soon as enough media is available to do so without interruption.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/autoplay)
         */
        autoplay: boolean;
        /**
         * The **`HTMLMediaElement.controls`** property reflects the controls HTML attribute, which controls whether user interface controls for playing the media item will be displayed.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/controls)
         */
        controls: boolean;
        /**
         * The **`HTMLMediaElement.crossOrigin`** property is the CORS setting for this media element. See CORS settings attributes for details.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/crossOrigin)
         */
        crossOrigin: string | null;
        /**
         * The HTMLMediaElement interface's **`currentTime`** property specifies the current playback time in seconds.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/currentTime)
         */
        currentTime: number;
        /**
         * The **`HTMLMediaElement.defaultMuted`** property reflects the muted HTML attribute, which indicates whether the media element's audio output should be muted by default. This property has no dynamic effect. To mute and unmute the audio output, use the muted property.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/defaultMuted)
         */
        defaultMuted: boolean;
        /**
         * The **`HTMLMediaElement.defaultPlaybackRate`** property indicates the default playback rate for the media.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/defaultPlaybackRate)
         */
        defaultPlaybackRate: number;
        /**
         * The **`disableRemotePlayback`** property of the HTMLMediaElement interface determines whether the media element is allowed to have a remote playback UI.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/disableRemotePlayback)
         */
        disableRemotePlayback: boolean;
        /**
         * The **`HTMLMediaElement.loop`** property reflects the loop HTML attribute, which controls whether the media element should start over when it reaches the end.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loop)
         */
        loop: boolean;
        /**
         * The **`HTMLMediaElement.muted`** property indicates whether the media element is muted.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/muted)
         */
        muted: boolean;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/encrypted_event) */
        onencrypted: ((this: HTMLMediaElement, ev: MediaEncryptedEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waitingforkey_event) */
        onwaitingforkey: ((this: HTMLMediaElement, ev: Event) => any) | null;
        /**
         * The **`HTMLMediaElement.playbackRate`** property sets the rate at which the media is being played back. This is used to implement user controls for fast forward, slow motion, and so forth. The normal playback rate is multiplied by this value to obtain the current rate, so a value of 1.0 indicates normal speed.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playbackRate)
         */
        playbackRate: number;
        /**
         * The **`preload`** property of the HTMLMediaElement interface is a string that provides a hint to the browser about what the author thinks will lead to the best user experience.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/preload)
         */
        preload: "none" | "metadata" | "auto" | "";
        /**
         * The **`HTMLMediaElement.preservesPitch`** property determines whether or not the browser should adjust the pitch of the audio to compensate for changes to the playback rate made by setting HTMLMediaElement.playbackRate.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/preservesPitch)
         */
        preservesPitch: boolean;
        /**
         * The **`HTMLMediaElement.src`** property reflects the value of the HTML media element's src attribute, which indicates the URL of a media resource to use in the element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/src)
         */
        src: string;
        /**
         * The **`srcObject`** property of the HTMLMediaElement interface sets or returns the object which serves as the source of the media associated with the HTMLMediaElement, or null if not assigned.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/srcObject)
         */
        srcObject: MediaProvider | null;
        /**
         * The **`HTMLMediaElement.volume`** property sets the volume at which the media will be played.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volume)
         */
        volume: number;
    }

    /**
     * The **`HTMLBRElement`** interface represents an HTML line break element (<br>). It inherits from HTMLElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLBRElement)
     */
    export interface HTMLBRElement extends HTMLElement {
        /** @deprecated */
        clear: string;
    }

    /**
     * The **`HTMLBaseElement`** interface contains the base URI for a document. This object inherits all of the properties and methods as described in the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLBaseElement)
     */
    export interface HTMLBaseElement extends HTMLElement {
        /**
         * The **`href`** property of the HTMLBaseElement interface contains a string that is the URL to use as the base for relative URLs.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLBaseElement/href)
         */
        href: string;
        /**
         * The **`target`** property of the HTMLBaseElement interface is a string that represents the default target tab to show the resulting output for hyperlinks and form elements.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLBaseElement/target)
         */
        target: string;
    }

    /**
     * The **`HTMLBodyElement`** interface provides special properties (beyond those inherited from the regular HTMLElement interface) for manipulating <body> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLBodyElement)
     */
    export interface HTMLBodyElement extends HTMLElement, WindowEventHandlers {
        /** @deprecated */
        aLink: string;
        /** @deprecated */
        background: string;
        /** @deprecated */
        bgColor: string;
        /** @deprecated */
        link: string;
        /** @deprecated */
        text: string;
        /** @deprecated */
        vLink: string;
    }

    interface WindowEventHandlers {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/afterprint_event) */
        onafterprint: ((this: WindowEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/beforeprint_event) */
        onbeforeprint: ((this: WindowEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/beforeunload_event) */
        onbeforeunload: ((this: WindowEventHandlers, ev: BeforeUnloadEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/gamepadconnected_event) */
        ongamepadconnected: ((this: WindowEventHandlers, ev: GamepadEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/gamepaddisconnected_event) */
        ongamepaddisconnected: ((this: WindowEventHandlers, ev: GamepadEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/hashchange_event) */
        onhashchange: ((this: WindowEventHandlers, ev: HashChangeEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/languagechange_event) */
        onlanguagechange: ((this: WindowEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/message_event) */
        onmessage: ((this: WindowEventHandlers, ev: MessageEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/messageerror_event) */
        onmessageerror: ((this: WindowEventHandlers, ev: MessageEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/offline_event) */
        onoffline: ((this: WindowEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/online_event) */
        ononline: ((this: WindowEventHandlers, ev: Event) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/pagehide_event) */
        onpagehide: ((this: WindowEventHandlers, ev: PageTransitionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/pagereveal_event) */
        onpagereveal: ((this: WindowEventHandlers, ev: PageRevealEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/pageshow_event) */
        onpageshow: ((this: WindowEventHandlers, ev: PageTransitionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/pageswap_event) */
        onpageswap: ((this: WindowEventHandlers, ev: PageSwapEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/popstate_event) */
        onpopstate: ((this: WindowEventHandlers, ev: PopStateEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/rejectionhandled_event) */
        onrejectionhandled: ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/storage_event) */
        onstorage: ((this: WindowEventHandlers, ev: StorageEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/unhandledrejection_event) */
        onunhandledrejection: ((this: WindowEventHandlers, ev: PromiseRejectionEvent) => any) | null;
        /**
         * @deprecated The unload event is not reliable, consider visibilitychange or pagehide events.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/unload_event)
         */
        onunload: ((this: WindowEventHandlers, ev: Event) => any) | null;
    }

    /**
     * The **`HTMLButtonElement`** interface provides properties and methods (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating <button> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement)
     */
    export interface HTMLButtonElement extends HTMLElement, PopoverTargetAttributes {
        /**
         * The **`command`** property of the HTMLButtonElement interface gets and sets the action to be performed on an element being controlled by this button. For this to have an effect, commandfor must be set.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/command)
         */
        command: string;
        /**
         * The **`commandForElement`** property of the HTMLButtonElement interface gets and sets the element to control via a button.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/commandForElement)
         */
        commandForElement: Element | null;
        /**
         * The **`HTMLButtonElement.disabled`** property indicates whether the control is disabled, meaning that it does not accept any clicks.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`formAction`** property of the HTMLButtonElement interface is the URL of the program that is executed on the server when the form that owns this control is submitted. It reflects the value of the <button>'s formaction attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/formAction)
         */
        formAction: string;
        /**
         * The **`formEnctype`** property of the HTMLButtonElement interface is the MIME type of the content sent to the server when the form is submitted. It reflects the value of the <button>'s formenctype attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/formEnctype)
         */
        formEnctype: string;
        /**
         * The **`formMethod`** property of the HTMLButtonElement interface is the HTTP method used to submit the <form> if the <button> element is the control that submits the form. It reflects the value of the <button>'s formmethod attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/formMethod)
         */
        formMethod: string;
        /**
         * The **`formNoValidate`** property of the HTMLButtonElement interface is a boolean value indicating if the <form> will bypass constraint validation when submitted via the <button>. It reflects the <button> element's formnovalidate attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/formNoValidate)
         */
        formNoValidate: boolean;
        /**
         * The **`formTarget`** property of the HTMLButtonElement interface is the tab, window, or iframe where the response of the submitted <form> is to be displayed. It reflects the value of the <button> element's formtarget attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/formTarget)
         */
        formTarget: string;
        /**
         * The **`name`** property of the HTMLButtonElement interface indicates the name of the <button> element or the empty string if the element has no name. It reflects the element's name attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/name)
         */
        name: string;
        /**
         * The **`type`** property of the HTMLButtonElement interface is a string that indicates the behavior type of the <button> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/type)
         */
        type: "submit" | "reset" | "button";
        /**
         * The **`value`** property of the HTMLButtonElement interface represents the value of the <button> element as a string, or the empty string if no value is set. It reflects the element's value attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/value)
         */
        value: string;
    }

    interface PopoverTargetAttributes {
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetAction) */
        popoverTargetAction: string;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetElement) */
        popoverTargetElement: Element | null;
    }

    /**
     * The **`HTMLCanvasElement`** interface provides properties and methods for manipulating the layout and presentation of <canvas> elements. The HTMLCanvasElement interface also inherits the properties and methods of the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement)
     */
    export interface HTMLCanvasElement extends HTMLElement {
        /**
         * The **`HTMLCanvasElement.height`** property is a positive integer reflecting the height HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 150 is used.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/height)
         */
        height: number;
        /**
         * The **`HTMLCanvasElement.width`** property is a positive integer reflecting the width HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 300 is used.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/width)
         */
        width: number;
    }

    /**
     * The **`HTMLDListElement`** interface provides special properties (beyond those of the regular HTMLElement interface it also has available to it by inheritance) for manipulating definition list (<dl>) elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDListElement)
     */
    export interface HTMLDListElement extends HTMLElement {
        /**
         * The **`compact`** property of the HTMLDListElement interface indicates that spacing between list items should be reduced. The exact handling of the compact attribute is browser-specific. Instead of using this property, consider using CSS line-height instead.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDListElement/compact)
         */
        compact: boolean;
    }

    /**
     * The **`HTMLDataElement`** interface provides special properties (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating <data> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDataElement)
     */
    export interface HTMLDataElement extends HTMLElement {
        /**
         * The **`value`** property of the HTMLDataElement interface returns a string reflecting the value HTML attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDataElement/value)
         */
        value: string;
    }

    /**
     * The **`HTMLDataListElement`** interface provides special properties (beyond the HTMLElement object interface it also has available to it by inheritance) to manipulate <datalist> elements and their content.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDataListElement)
     */
    export interface HTMLDataListElement extends HTMLElement {
    }

    /**
     * The **`HTMLDetailsElement`** interface provides special properties (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating <details> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement)
     */
    export interface HTMLDetailsElement extends HTMLElement {
        /**
         * The **`name`** property of the HTMLDetailsElement interface reflects the name attribute of <details> elements. It enables multiple <details> elements to be connected together, where only one for the <details> elements can be open at once. This allows developers to easily create UI features such as accordions without scripting.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement/name)
         */
        name: string;
        /**
         * The **`open`** property of the HTMLDetailsElement interface is a boolean value reflecting the open HTML attribute, indicating whether the <details>'s contents (not counting the <summary>) is to be shown to the user.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement/open)
         */
        open: boolean;
    }

    /**
     * The **`HTMLDialogElement`** interface provides methods to manipulate <dialog> elements. It inherits properties and methods from the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement)
     */
    export interface HTMLDialogElement extends HTMLElement {
        /**
         * The **`closedBy`** property of the HTMLDialogElement interface indicates the types of user actions that can be used to close the associated <dialog> element. It sets or returns the dialog's closedby attribute value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/closedBy)
         */
        closedBy: string;
        /**
         * The **`open`** property of the HTMLDialogElement interface is a boolean value reflecting the open HTML attribute, indicating whether the <dialog> is available for interaction.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/open)
         */
        open: boolean;
        /**
         * The **`returnValue`** property of the HTMLDialogElement interface is a string representing the return value for a <dialog> element when it's closed. You can set the value directly (dialog.returnValue = "result") or by providing the value as a string argument to close() or requestClose().
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/returnValue)
         */
        returnValue: string;
    }

    /** @deprecated */
    export interface HTMLDirectoryElement extends HTMLElement {
        /** @deprecated */
        compact: boolean;
    }

    /**
     * The **`HTMLDivElement`** interface provides special properties (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating <div> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDivElement)
     */
    export interface HTMLDivElement extends HTMLElement {
        /** @deprecated */
        align: string;
    }

    /**
     * The **`HTMLEmbedElement`** interface provides special properties (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating <embed> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLEmbedElement)
     */
    export interface HTMLEmbedElement extends HTMLElement {
        /** @deprecated */
        align: string;
        /**
         * The **`height`** property of the HTMLEmbedElement interface returns a string that reflects the height attribute of the <embed> element, indicating the displayed height of the resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLEmbedElement/height)
         */
        height: string;
        /** @deprecated */
        name: string;
        /**
         * The **`src`** property of the HTMLEmbedElement interface returns a string that indicates the URL of the resource being embedded.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLEmbedElement/src)
         */
        src: string;
        /**
         * The **`type`** property of the HTMLEmbedElement interface returns a string that reflects the type attribute of the <embed> element, indicating the MIME type of the resource. It reflects the <embed> element's type attribute
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLEmbedElement/type)
         */
        type: string;
        /**
         * The **`width`** property of the HTMLEmbedElement interface returns a string that reflects the width attribute of the <embed> element, indicating the displayed width of the resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLEmbedElement/width)
         */
        width: string;
    }

    /**
     * The **`HTMLFieldSetElement`** interface provides special properties and methods (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of <fieldset> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFieldSetElement)
     */
    export interface HTMLFieldSetElement extends HTMLElement {
        /**
         * The **`disabled`** property of the HTMLFieldSetElement interface is a boolean value that reflects the <fieldset> element's disabled attribute, which indicates whether the control is disabled.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFieldSetElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`name`** property of the HTMLFieldSetElement interface indicates the name of the <fieldset> element. It reflects the element's name attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFieldSetElement/name)
         */
        name: string;
    }

    /**
     * Implements the document object model (DOM) representation of the font element. The HTML Font Element <font> defines the font size, font face and color of text.
     * @deprecated
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFontElement)
     */
    export interface HTMLFontElement extends HTMLElement {
        /**
         * The obsolete **`HTMLFontElement.color`** property is a string that reflects the color HTML attribute, containing either a named color or a color specified in the hexadecimal #RRGGBB format.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFontElement/color)
         */
        color: string;
        /**
         * The obsolete **`HTMLFontElement.face`** property is a string that reflects the face HTML attribute, containing a comma-separated list of one or more font names.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFontElement/face)
         */
        face: string;
        /**
         * The obsolete **`HTMLFontElement.size`** property is a string that reflects the size HTML attribute. It contains either a font size ranging from 1 to 7 or a number relative to the default value 3, for example -2 or +1.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFontElement/size)
         */
        size: string;
    }

    /**
     * The **`HTMLFormElement`** interface represents a <form> element in the DOM. It allows access to—and, in some cases, modification of—aspects of the form, as well as access to its component elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement)
     */
    export interface HTMLFormElement extends HTMLElement {
        [index: number]: Element;
        [name: string]: any;
        relList: string;
        /**
         * The **`HTMLFormElement.acceptCharset`** property represents the character encoding for the given <form> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/acceptCharset)
         */
        acceptCharset: string;
        /**
         * The **`HTMLFormElement.action`** property represents the action of the <form> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/action)
         */
        action: string;
        /**
         * The **`autocomplete`** property of the HTMLFormElement interface indicates whether the value of the form's controls can be automatically completed by the browser. It reflects the <form> element's autocomplete attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/autocomplete)
         */
        autocomplete: AutoFillBase;
        /**
         * The **`HTMLFormElement.encoding`** property is an alternative name for the enctype element on the DOM HTMLFormElement object.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/encoding)
         */
        encoding: string;
        /**
         * The **`HTMLFormElement.enctype`** property is the MIME type of content that is used to submit the form to the server. Possible values are:
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/enctype)
         */
        enctype: string;
        /**
         * The **`HTMLFormElement.method`** property represents the HTTP method used to submit the <form>.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/method)
         */
        method: string;
        /**
         * The **`HTMLFormElement.name`** property represents the name of the current <form> element as a string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/name)
         */
        name: string;
        /**
         * The **`noValidate`** property of the HTMLFormElement interface is a boolean value indicating if the <form> will bypass constraint validation when submitted. It reflects the <form> element's novalidate attribute; if the attribute present, the value is true.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/noValidate)
         */
        noValidate: boolean;
        /**
         * The **`rel`** property of the HTMLFormElement interface reflects the rel attribute. It is a string containing what kinds of links the HTML <form> element creates, as a space-separated list of enumerated values.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/rel)
         */
        rel: string;
        /**
         * The **`target`** property of the HTMLFormElement interface represents the target of the form's action (i.e., the frame in which to render its output).
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/target)
         */
        target: string;
    }

    /** @deprecated */
    export interface HTMLFrameElement extends HTMLElement {
        /** @deprecated */
        frameBorder: string;
        /** @deprecated */
        longDesc: string;
        /** @deprecated */
        marginHeight: string;
        /** @deprecated */
        marginWidth: string;
        /** @deprecated */
        name: string;
        /** @deprecated */
        noResize: boolean;
        /** @deprecated */
        scrolling: string;
        /** @deprecated */
        src: string;
    }

    /**
     * The **`HTMLFrameSetElement`** interface provides special properties (beyond those of the regular HTMLElement interface they also inherit) for manipulating <frameset> elements.
     * @deprecated
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFrameSetElement)
     */
    export interface HTMLFrameSetElement extends HTMLElement, WindowEventHandlers {
        /** @deprecated */
        cols: string;
        /** @deprecated */
        rows: string;
    }

    /**
     * The **`HTMLHRElement`** interface provides special properties (beyond those of the HTMLElement interface it also has available to it by inheritance) for manipulating <hr> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLHRElement)
     */
    export interface HTMLHRElement extends HTMLElement {
        /** @deprecated */
        align: string;
        /** @deprecated */
        color: string;
        /** @deprecated */
        noShade: boolean;
        /** @deprecated */
        size: string;
        /** @deprecated */
        width: string;
    }

    /**
     * The **`HTMLHeadElement`** interface contains the descriptive information, or metadata, for a document. This object inherits all of the properties and methods described in the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLHeadElement)
     */
    export interface HTMLHeadElement extends HTMLElement {
    }

    /**
     * The **`HTMLHeadingElement`** interface represents the different heading elements, <h1> through <h6>. It inherits methods and properties from the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLHeadingElement)
     */
    export interface HTMLHeadingElement extends HTMLElement {
        /** @deprecated */
        align: string;
    }

    /**
     * The **`HTMLHtmlElement`** interface serves as the root node for a given HTML document. This object inherits the properties and methods described in the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLHtmlElement)
     */
    export interface HTMLHtmlElement extends HTMLElement {
        /**
         * Returns **`version`** information about the document type definition (DTD) of a document. While this property is recognized by Mozilla, the return value for this property is always an empty string.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLHtmlElement/version)
         */
        version: string;
    }

    /**
     * The **`HTMLIFrameElement`** interface provides special properties and methods (beyond those of the HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of inline frame elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement)
     */
    export interface HTMLIFrameElement extends HTMLElement {
        sandbox: string;
        /** @deprecated */
        align: string;
        /**
         * The **`allow`** property of the HTMLIFrameElement interface indicates the Permissions Policy specified for this <iframe> element. The policy defines what features are available to the <iframe> element (for example, access to the microphone, camera, battery, web-share, etc.) based on the origin of the request.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/allow)
         */
        allow: string;
        /**
         * The **`allowFullscreen`** property of the HTMLIFrameElement interface is a boolean value that reflects the allowfullscreen attribute of the <iframe> element, indicating whether to allow the iframe's contents to use requestFullscreen().
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/allowFullscreen)
         */
        allowFullscreen: boolean;
        /** @deprecated */
        frameBorder: string;
        /**
         * The **`height`** property of the HTMLIFrameElement interface returns a string that reflects the height attribute of the <iframe> element, indicating the height of the frame in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/height)
         */
        height: string;
        /**
         * The **`loading`** property of the HTMLIFrameElement interface is a string that provides a hint to the user agent indicating whether the iframe should be loaded immediately on page load, or only when it is needed.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/loading)
         */
        loading: "eager" | "lazy";
        /** @deprecated */
        longDesc: string;
        /** @deprecated */
        marginHeight: string;
        /** @deprecated */
        marginWidth: string;
        /**
         * The **`name`** property of the HTMLIFrameElement interface is a string value that reflects the name attribute of the <iframe> element, indicating the specific name of the <iframe> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/name)
         */
        name: string;
        /**
         * The **`HTMLIFrameElement.referrerPolicy`** property reflects the HTML referrerpolicy attribute of the <iframe> element defining which referrer is sent when fetching the resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/referrerPolicy)
         */
        referrerPolicy: ReferrerPolicy;
        /** @deprecated */
        scrolling: string;
        /**
         * The **`HTMLIFrameElement.src`** A string that reflects the src HTML attribute, containing the address of the content to be embedded.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/src)
         */
        src: string;
        /**
         * The **`srcdoc`** property of the HTMLIFrameElement interface gets or sets the inline HTML markup of the frame's document.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/srcdoc)
         */
        srcdoc: string;
        /**
         * The **`width`** property of the HTMLIFrameElement interface returns a string that reflects the width attribute of the <iframe> element, indicating the width of the frame in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement/width)
         */
        width: string;
    }

    /**
     * The **`HTMLImageElement`** interface represents an HTML <img> element, providing the properties and methods used to manipulate image elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
     */
    export interface HTMLImageElement extends HTMLElement {
        /**
         * The deprecated **`align`** property of the HTMLImageElement interface is a string which indicates how to position the image relative to its container. It reflects the <img> element's align content attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/align)
         */
        align: string;
        /**
         * The **`alt`** property of the HTMLImageElement interface provides fallback (alternate) text to display when the image specified by the <img> element is not displayed, whether because of an error, because the user has disabled the loading of images, or because the image hasn't finished loading yet. It reflects the <img> element's alt content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/alt)
         */
        alt: string;
        /**
         * The deprecated **`border`** property of the HTMLImageElement interface specifies the number of pixels thick the border surrounding the image should be. A value of 0, the default, indicates that no border should be drawn. It reflects the <img> element's border content attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/border)
         */
        border: string;
        /**
         * The **`crossOrigin`** property of the HTMLImageElement interface is a string which specifies the Cross-Origin Resource Sharing (CORS) setting to use when retrieving the image. It reflects the <img> element's crossorigin content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/crossOrigin)
         */
        crossOrigin: string | null;
        /**
         * The **`decoding`** property of the HTMLImageElement interface provides a hint to the browser as to how it should decode the image. More specifically, whether it should wait for the image to be decoded before presenting other content updates or not. It reflects the <img> element's decoding content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/decoding)
         */
        decoding: "async" | "sync" | "auto";
        /**
         * The **`fetchPriority`** property of the HTMLImageElement interface represents a hint to the browser indicating how it should prioritize fetching a particular image relative to other images. It reflects the <img> element's fetchpriority content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority)
         */
        fetchPriority: "high" | "low" | "auto";
        /**
         * The **`height`** property of the HTMLImageElement interface indicates the height at which the image is drawn, in CSS pixels, if the image is being drawn or rendered to any visual medium such as a screen or printer. Otherwise, it's the natural, pixel density-corrected height of the image.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/height)
         */
        height: number;
        /**
         * The deprecated **`hspace`** property of the HTMLImageElement interface specifies the number of pixels of empty space to leave empty on the left and right sides of the <img> element when laying out the page. It reflects the <img> element's hspace content attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/hspace)
         */
        hspace: number;
        /**
         * The **`isMap`** property of the HTMLImageElement interface indicates that the image is part of a server-side map. If so, the coordinates where the user clicked on the image are sent to the server. It reflects the <img> element's ismap content attribute. This attribute is allowed only if the <img> element is a descendant of an <a> element with a valid href attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/isMap)
         */
        isMap: boolean;
        /**
         * The **`loading`** property of the HTMLImageElement interface provides a hint to the user agent on how to handle the loading of the image which is currently outside the window's visual viewport. This helps to optimize the loading of the document's contents by postponing loading the image until it's expected to be needed, rather than immediately during the initial page load. It reflects the <img> element's loading content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading)
         */
        loading: "eager" | "lazy";
        /**
         * The deprecated **`longDesc`** property of the HTMLImageElement interface specifies the URL of a text or HTML file which contains a long-form description of the image. This can be used to provide optional added details beyond the short description provided in the title attribute. It reflects the <img> element's longdesc content attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/longDesc)
         */
        longDesc: string;
        /** @deprecated */
        lowsrc: string;
        /**
         * The deprecated **`name`** property of the HTMLImageElement interface specifies a name for the element. It reflects the <img> element's name content attribute. It has been replaced by the id property available on all elements, and is kept only for compatibility reasons.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/name)
         */
        name: string;
        /**
         * The **`referrerPolicy`** property of the HTMLImageElement interface defining which referrer is sent when fetching the resource. It reflects the <img> element's referrerpolicy content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/referrerPolicy)
         */
        referrerPolicy: string;
        /**
         * The **`sizes`** property of the HTMLImageElement interface allows you to specify the layout width of the image for each of a list of media queries. This provides the ability to automatically select among different images—even images of different orientations or aspect ratios—as the document state changes to match different media conditions. It reflects the <img> element's sizes content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes)
         */
        sizes: string;
        /**
         * The **`src`** property of the HTMLImageElement interface specifies the image to display in the <img> element. It reflects the <img> element's src content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/src)
         */
        src: string;
        /**
         * The **`srcset`** property of the HTMLImageElement interface identifies one or more image candidate strings, separated using commas (,), each specifying image resources to use under given circumstances. Each image candidate string contains an image URL and an optional width or pixel density descriptor that indicates the conditions under which that candidate should be used instead of the image specified by the src property. It reflects the <img> element's srcset content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)
         */
        srcset: string;
        /**
         * The **`useMap`** property of the HTMLImageElement interface providing the name of the client-side image map to apply to the image. It reflects the <img> element's usemap content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/useMap)
         */
        useMap: string;
        /**
         * The deprecated **`vspace`** property of the HTMLImageElement interface specifies the number of pixels of empty space to leave empty on the top and bottom sides of the <img> element when laying out the page. It reflects the <img> element's vspace content attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/vspace)
         */
        vspace: number;
        /**
         * The **`width`** property of the HTMLImageElement interface indicates the width at which the image is drawn, in CSS pixels, if the image is being drawn or rendered to any visual medium such as a screen or printer. Otherwise, it's the natural, pixel density-corrected width of the image.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/width)
         */
        width: number;
    }

    /**
     * The **`HTMLInputElement`** interface provides special properties and methods for manipulating the options, layout, and presentation of <input> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement)
     */
    export interface HTMLInputElement extends HTMLElement, PopoverTargetAttributes {
        /**
         * The **`accept`** property of the HTMLInputElement interface reflects the <input> element's accept attribute, generally a comma-separated list of unique file type specifiers providing a hint for the expected file type for an <input> of type file. If the attribute is not explicitly set, the accept property is an empty string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/accept)
         */
        accept: string;
        /** @deprecated */
        align: string;
        /**
         * The **`alt`** property of the HTMLInputElement interface defines the textual label for the button for users and user agents who cannot use the image. It reflects the <input> element's alt attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/alt)
         */
        alt: string;
        /**
         * The **`autocomplete`** property of the HTMLInputElement interface indicates whether the value of the control can be automatically completed by the browser. It reflects the <input> element's autocomplete attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/autocomplete)
         */
        autocomplete: AutoFill;
        /**
         * The **`capture`** property of the HTMLInputElement interface reflects the <input> element's capture attribute. Only relevant to the <input> of type file, the property and attribute specify whether, a new file should be captured from a user-facing (user) or outward facing (environment) camera or microphone. The type of file is defined the accept attribute. If the attribute is not explicitly set, the capture property is an empty string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/capture)
         */
        capture: string;
        /**
         * The **`checked`** property of the HTMLInputElement interface specifies the current checkedness of the element; that is, whether the form control is checked or not.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/checked)
         */
        checked: boolean;
        /**
         * The **`defaultChecked`** property of the HTMLInputElement interface specifies the default checkedness state of the element. This property reflects the <input> element's checked attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/defaultChecked)
         */
        defaultChecked: boolean;
        /**
         * The **`defaultValue`** property of the HTMLInputElement interface indicates the original (or default) value of the <input> element. It reflects the element's value attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/defaultValue)
         */
        defaultValue: string;
        /**
         * The **`dirName`** property of the HTMLInputElement interface is the directionality of the element and enables the submission of that value. It reflects the value of the <input> element's dirName attribute. This property can be retrieved or set.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/dirName)
         */
        dirName: string;
        /**
         * The **`HTMLInputElement.disabled`** property is a boolean value that reflects the disabled HTML attribute, which indicates whether the control is disabled. If it is disabled, it does not accept clicks. A disabled element is unusable and un-clickable.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`HTMLInputElement.files`** property allows you to access the FileList selected with the <input type="file"> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/files)
         */
        files: FileList | null;
        /**
         * The **`formAction`** property of the HTMLInputElement interface is the URL of the program that is executed on the server when the form that owns this control is submitted. It reflects the value of the <input>'s formaction attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/formAction)
         */
        formAction: string;
        /**
         * The **`formEnctype`** property of the HTMLInputElement interface is the MIME type of the content sent to the server when the <input> with the formEnctype is the method of form submission. It reflects the value of the <input>'s formenctype attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/formEnctype)
         */
        formEnctype: string;
        /**
         * The **`formMethod`** property of the HTMLInputElement interface is the HTTP method used to submit the <form> if the <input> element is the control that submits the form. It reflects the value of the <input>'s formmethod attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/formMethod)
         */
        formMethod: string;
        /**
         * The **`formNoValidate`** property of the HTMLInputElement interface is a boolean value indicating if the <form> will bypass constraint validation when submitted via the <input>. It reflects the <input> element's formnovalidate attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/formNoValidate)
         */
        formNoValidate: boolean;
        /**
         * The **`formTarget`** property of the HTMLInputElement interface is the tab, window, or iframe where the response of the submitted <form> is to be displayed. It reflects the value of the <input> element's formtarget attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/formTarget)
         */
        formTarget: string;
        /**
         * The **`height`** property of the HTMLInputElement interface specifies the height of a control. It reflects the <input> element's height attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/height)
         */
        height: number;
        /**
         * The **`indeterminate`** property of the HTMLInputElement interface returns a boolean value that indicates whether the checkbox is in the indeterminate state. For example, a "select all/deselect all" checkbox may be in the indeterminate state when some but not all of its sub-controls are checked. The indeterminate state can only be set via JavaScript and is only relevant to checkbox controls.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/indeterminate)
         */
        indeterminate: boolean;
        /**
         * The **`max`** property of the HTMLInputElement interface reflects the <input> element's max attribute, which generally defines the maximum valid value for a numeric or date-time input. If the attribute is not explicitly set, the max property is an empty string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/max)
         */
        max: string;
        /**
         * The **`maxLength`** property of the HTMLInputElement interface indicates the maximum number of characters (in UTF-16 code units) allowed to be entered for the value of the <input> element, and the maximum number of characters allowed for the value to be valid. It reflects the element's maxlength attribute. -1 means there is no limit on the length of the value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/maxLength)
         */
        maxLength: number;
        /**
         * The **`min`** property of the HTMLInputElement interface reflects the <input> element's min attribute, which generally defines the minimum valid value for a numeric or date-time input. If the attribute is not explicitly set, the min property is an empty string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/min)
         */
        min: string;
        /**
         * The **`minLength`** property of the HTMLInputElement interface indicates the minimum number of characters (in UTF-16 code units) required for the value of the <input> element to be valid. It reflects the element's minlength attribute. -1 means there is no minimum length requirement.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/minLength)
         */
        minLength: number;
        /**
         * The **`HTMLInputElement.multiple`** property indicates if an input can have more than one value. Firefox currently only supports multiple for <input type="file">.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/multiple)
         */
        multiple: boolean;
        /**
         * The **`name`** property of the HTMLInputElement interface indicates the name of the <input> element. It reflects the element's name attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/name)
         */
        name: string;
        /**
         * The **`pattern`** property of the HTMLInputElement interface represents a regular expression a non-null <input> value should match. It reflects the <input> element's pattern attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/pattern)
         */
        pattern: string;
        /**
         * The **`placeholder`** property of the HTMLInputElement interface represents a hint to the user of what can be entered in the control. It reflects the <input> element's placeholder attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/placeholder)
         */
        placeholder: string;
        /**
         * The **`readOnly`** property of the HTMLInputElement interface indicates that the user cannot modify the value of the <input>. It reflects the <input> element's readonly boolean attribute; returning true if the attribute is present and false when omitted.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/readOnly)
         */
        readOnly: boolean;
        /**
         * The **`required`** property of the HTMLInputElement interface specifies that the user must fill in a value before submitting a form. It reflects the <input> element's required attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/required)
         */
        required: boolean;
        /**
         * The **`selectionDirection`** property of the HTMLInputElement interface is a string that indicates the direction in which the user is selecting the text.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/selectionDirection)
         */
        selectionDirection: SelectionDirection | null;
        /**
         * The **`selectionEnd`** property of the HTMLInputElement interface is a number that represents the end index of the selected text. That is, it represents the index of the character immediately following the selection. Likewise, when there is no selection, this returns the offset of the character immediately following the current text input cursor position.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/selectionEnd)
         */
        selectionEnd: number | null;
        /**
         * The **`selectionStart`** property of the HTMLInputElement interface is a number that represents the beginning index of the selected text. When nothing is selected, then returns the position of the text input cursor (caret) inside of the <input> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/selectionStart)
         */
        selectionStart: number | null;
        /**
         * The **`size`** property of the HTMLInputElement interface defines the number of visible characters displayed. It reflects the <input> element's size attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/size)
         */
        size: number;
        /**
         * The **`src`** property of the HTMLInputElement interface specifies the source of an image to display as the graphical submit button. It reflects the <input> element's src attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/src)
         */
        src: string;
        /**
         * The **`step`** property of the HTMLInputElement interface indicates the step by which numeric or date-time <input> elements can change. It reflects the element's step attribute. Valid values include the string "any" or a string containing a positive floating point number. If the attribute is not explicitly set, the step property is an empty string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/step)
         */
        step: string;
        /**
         * The **`type`** property of the HTMLInputElement interface indicates the kind of data allowed in the <input> element, for example a number, a date, or an email. Browsers will select the appropriate widget and behavior to help users to enter a valid value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/type)
         */
        type: string;
        /** @deprecated */
        useMap: string;
        /**
         * The **`value`** property of the HTMLInputElement interface represents the current value of the <input> element as a string.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/value)
         */
        value: string;
        /**
         * The **`valueAsDate`** property of the HTMLInputElement interface represents the current value of the <input> element as a Date, or null if conversion is not possible.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/valueAsDate)
         */
        valueAsDate: Date | null;
        /**
         * The **`valueAsNumber`** property of the HTMLInputElement interface represents the current value of the <input> element as a number or NaN if converting to a numeric value is not possible.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/valueAsNumber)
         */
        valueAsNumber: number;
        /**
         * The **`webkitdirectory`** property of the HTMLInputElement interface reflects the webkitdirectory HTML attribute, which indicates that <input type="file"> elements can only select directories instead of files.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory)
         */
        webkitdirectory: boolean;
        /**
         * The **`width`** property of the HTMLInputElement interface specifies the width of a control. It reflects the <input> element's width attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/width)
         */
        width: number;
    }

    /**
     * The **`HTMLLIElement`** interface exposes specific properties and methods (beyond those defined by regular HTMLElement interface it also has available to it by inheritance) for manipulating list elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLIElement)
     */
    export interface HTMLLIElement extends HTMLElement {
        /** @deprecated */
        type: string;
        /**
         * The **`value`** property of the HTMLLIElement interface indicates the ordinal position of the list element inside a given <ol>. It can be smaller than 0. If the <li> element is not a child of an <ol> element, the property has no meaning.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLIElement/value)
         */
        value: number;
    }

    /**
     * The **`HTMLLabelElement`** interface gives access to properties specific to <label> elements. It inherits methods and properties from the base HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLabelElement)
     */
    export interface HTMLLabelElement extends HTMLElement {
        /**
         * The **`HTMLLabelElement.htmlFor`** property reflects the value of the for content property. That means that this script-accessible property is used to set and read the value of the content property for, which is the ID of the label's associated control element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLabelElement/htmlFor)
         */
        htmlFor: string;
    }

    /**
     * The **`HTMLLegendElement`** is an interface allowing to access properties of the <legend> elements. It inherits properties and methods from the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLegendElement)
     */
    export interface HTMLLegendElement extends HTMLElement {
        /** @deprecated */
        align: string;
    }

    /**
     * The **`HTMLLinkElement`** interface represents reference information for external resources and the relationship of those resources to a document and vice versa (corresponds to <link> element; not to be confused with <a>, which is represented by HTMLAnchorElement). This object inherits all of the properties and methods of the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement)
     */
    export interface HTMLLinkElement extends HTMLElement, LinkStyle {
        blocking: string;
        relList: string;
        sizes: string;
        /**
         * The **`as`** property of the HTMLLinkElement interface returns a string representing the type of content to be preloaded by a link element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/as)
         */
        as: string;
        /** @deprecated */
        charset: string;
        /**
         * The **`crossOrigin`** property of the HTMLLinkElement interface specifies the Cross-Origin Resource Sharing (CORS) setting to use when retrieving the resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/crossOrigin)
         */
        crossOrigin: string | null;
        /**
         * The **`disabled`** property of the HTMLLinkElement interface is a boolean value that represents whether the link is disabled. It only has an effect with style sheet links (rel property set to stylesheet).
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`fetchPriority`** property of the HTMLLinkElement interface represents a hint to the browser indicating how it should prioritize fetching a particular resource relative to other resources of the same type. It reflects the <link> element's fetchpriority content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/fetchPriority)
         */
        fetchPriority: "high" | "low" | "auto";
        /**
         * The **`href`** property of the HTMLLinkElement interface contains a string that is the URL associated with the link.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/href)
         */
        href: string;
        /**
         * The **`hreflang`** property of the HTMLLinkElement interface is used to indicate the language and the geographical targeting of a page. This hint can be used by browsers to select the more appropriate page or to improve SEO.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/hreflang)
         */
        hreflang: string;
        /**
         * The **`imageSizes`** property of the HTMLLinkElement interface indicates the size and conditions for the preloaded images defined by the imageSrcset property. It reflects the value of the <link> element's imagesizes attribute. This property can retrieve or set the imagesizes attribute value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/imageSizes)
         */
        imageSizes: string;
        /**
         * The **`imageSrcset`** property of the HTMLLinkElement interface is a string which identifies one or more comma-separated image candidate strings. This property reflects the value of the <link> element's imagesrcset attribute. This property can retrieved or set the imagesrcset attribute value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/imageSrcset)
         */
        imageSrcset: string;
        /**
         * The **`integrity`** property of the HTMLLinkElement interface is a string containing inline metadata that a browser can use to verify that a fetched resource has been delivered without unexpected manipulation.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/integrity)
         */
        integrity: string;
        /**
         * The **`media`** property of the HTMLLinkElement interface is a string representing a list of one or more media formats to which the resource applies.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/media)
         */
        media: string;
        /**
         * The **`referrerPolicy`** property of the HTMLLinkElement interface reflects the HTML referrerpolicy attribute of the <link> element defining which referrer is sent when fetching the resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/referrerPolicy)
         */
        referrerPolicy: string;
        /**
         * The **`rel`** property of the HTMLLinkElement interface reflects the rel attribute. It is a string containing a space-separated list of link types indicating the relationship between the resource represented by the <link> element and the current document.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/rel)
         */
        rel: string;
        /** @deprecated */
        rev: string;
        /** @deprecated */
        target: string;
        /**
         * The **`type`** property of the HTMLLinkElement interface is a string that reflects the MIME type of the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement/type)
         */
        type: string;
    }

    interface LinkStyle {
    }

    /**
     * The **`HTMLMapElement`** interface provides special properties and methods (beyond those of the regular object HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of map elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMapElement)
     */
    export interface HTMLMapElement extends HTMLElement {
        /**
         * The **`name`** property of the HTMLMapElement represents the unique name <map> element. Its value can be used with the useMap attribute of the <img> element to reference a <map> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMapElement/name)
         */
        name: string;
    }

    /**
     * The **`HTMLMarqueeElement`** interface provides methods to manipulate <marquee> elements.
     * @deprecated
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMarqueeElement)
     */
    export interface HTMLMarqueeElement extends HTMLElement {
        /** @deprecated */
        behavior: string;
        /** @deprecated */
        bgColor: string;
        /** @deprecated */
        direction: string;
        /** @deprecated */
        height: string;
        /** @deprecated */
        hspace: number;
        /** @deprecated */
        loop: number;
        /** @deprecated */
        scrollAmount: number;
        /** @deprecated */
        scrollDelay: number;
        /** @deprecated */
        trueSpeed: boolean;
        /** @deprecated */
        vspace: number;
        /** @deprecated */
        width: string;
    }

    /**
     * The **`HTMLMenuElement`** interface provides additional properties (beyond those inherited from the HTMLElement interface) for manipulating a <menu> element. <menu> is a semantic alternative to the <ul> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMenuElement)
     */
    export interface HTMLMenuElement extends HTMLElement {
        /**
         * The **`compact`** property of the HTMLMenuElement interface indicates that spacing between list items should be reduced. The exact handling of the compact attribute is browser-specific. Instead of using this property, consider using CSS line-height instead.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMenuElement/compact)
         */
        compact: boolean;
    }

    /**
     * The **`HTMLMetaElement`** interface contains descriptive metadata about a document provided in HTML as <meta> elements. This interface inherits all of the properties and methods described in the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement)
     */
    export interface HTMLMetaElement extends HTMLElement {
        /**
         * The **`HTMLMetaElement.content`** property gets or sets the content attribute of pragma directives and named <meta> data in conjunction with HTMLMetaElement.name or HTMLMetaElement.httpEquiv. For more information, see the content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement/content)
         */
        content: string;
        /**
         * The **`HTMLMetaElement.httpEquiv`** property gets or sets the pragma directive or an HTTP response header name for the HTMLMetaElement.content attribute. For more details on the possible values, see the http-equiv attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement/httpEquiv)
         */
        httpEquiv: string;
        /**
         * The **`HTMLMetaElement.media`** property enables specifying the media for theme-color metadata.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement/media)
         */
        media: string;
        /**
         * The **`HTMLMetaElement.name`** property is used in combination with HTMLMetaElement.content to define the name-value pairs for the metadata of a document. The name attribute defines the metadata name and the content attribute defines the value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement/name)
         */
        name: string;
        /**
         * The **`HTMLMetaElement.scheme`** property defines the scheme of the value in the HTMLMetaElement.content attribute. The scheme property was created to enable providing additional information to be used to interpret the value of the content property. The scheme property takes as its value a scheme format (i.e., YYYY-MM-DD) or scheme format name (i.e., ISBN), or a URI providing more information regarding the scheme format. The scheme defines the format of the value of the content attribute. The scheme content is interpreted as an extension of the element's HTMLMetaElement.name if a browser or user agent recognizes the scheme.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement/scheme)
         */
        scheme: string;
    }

    /**
     * The HTML <meter> elements expose the **`HTMLMeterElement`** interface, which provides special properties and methods (beyond the HTMLElement object interface they also have available to them by inheritance) for manipulating the layout and presentation of <meter> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement)
     */
    export interface HTMLMeterElement extends HTMLElement {
        /**
         * The **`high`** property of the HTMLMeterElement interface represents the high boundary of the <meter> element as a floating-point number. It reflects the element's high attribute, or the value of max if not defined. The value of high is clamped by the low and max values.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement/high)
         */
        high: number;
        /**
         * The **`low`** property of the HTMLMeterElement interface represents the low boundary of the <meter> element as a floating-point number. It reflects the element's low attribute, or the value of min if not defined. The value of low is clamped by the min and max values.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement/low)
         */
        low: number;
        /**
         * The **`max`** property of the HTMLMeterElement interface represents the maximum value of the <meter> element as a floating-point number. It reflects the element's max attribute, or the min value if no max is set, or 1 if neither the min or the max is defined.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement/max)
         */
        max: number;
        /**
         * The **`min`** property of the HTMLMeterElement interface represents the minimum value of the <meter> element as a floating-point number. It reflects the element's min attribute, or 0 if no min is defined.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement/min)
         */
        min: number;
        /**
         * The **`optimum`** property of the HTMLMeterElement interface represents the optimum boundary of the <meter> element as a floating-point number. It reflects the element's optimum attribute, or the midpoint between min and max values if not defined. The value of optimum is clamped by the min and max values.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement/optimum)
         */
        optimum: number;
        /**
         * The **`value`** property of the HTMLMeterElement interface represents the current value of the <meter> element as a floating-point number. It reflects the element's value attribute. If no value is set, it is the HTMLMeterElement.min value or 0, whichever is greater.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement/value)
         */
        value: number;
    }

    /**
     * The **`HTMLModElement`** interface provides special properties (beyond the regular methods and properties available through the HTMLElement interface they also have available to them by inheritance) for manipulating modification elements, that is <del> and <ins>.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLModElement)
     */
    export interface HTMLModElement extends HTMLElement {
        /**
         * The **`cite`** property of the HTMLModElement interface indicates the URL of the resource explaining the modification. It reflects the cite attribute of the <del> element and <ins> elements.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLModElement/cite)
         */
        cite: string;
        /**
         * The **`dateTime`** property of the HTMLModElement interface is a string containing a machine-readable date with an optional time value. It reflects the datetime HTML attribute of the <del> and <ins> elements.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLModElement/dateTime)
         */
        dateTime: string;
    }

    /**
     * The **`HTMLOListElement`** interface provides special properties (beyond those defined on the regular HTMLElement interface it also has available to it by inheritance) for manipulating ordered list elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOListElement)
     */
    export interface HTMLOListElement extends HTMLElement {
        /**
         * The **`compact`** property of the HTMLOListElement interface indicates that spacing between list items should be reduced. The exact handling of the compact attribute is browser-specific. Instead of using this property, consider using CSS line-height instead.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOListElement/compact)
         */
        compact: boolean;
        /**
         * The **`reversed`** property of the HTMLOListElement interface indicates order of a list.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOListElement/reversed)
         */
        reversed: boolean;
        /**
         * The **`start`** property of the HTMLOListElement interface indicates starting value of the ordered list, with default value of 1.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOListElement/start)
         */
        start: number;
        /**
         * The **`type`** property of the HTMLOListElement interface indicates the kind of marker to be used to display ordered list.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOListElement/type)
         */
        type: string;
    }

    /**
     * The **`HTMLObjectElement`** interface provides special properties and methods (beyond those on the HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of <object> element, representing external resources.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement)
     */
    export interface HTMLObjectElement extends HTMLElement {
        /** @deprecated */
        align: string;
        /** @deprecated */
        archive: string;
        /** @deprecated */
        border: string;
        /** @deprecated */
        code: string;
        /** @deprecated */
        codeBase: string;
        /** @deprecated */
        codeType: string;
        /**
         * The **`data`** property of the HTMLObjectElement interface returns a string that reflects the data HTML attribute, specifying the address of a resource's data.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement/data)
         */
        data: string;
        /** @deprecated */
        declare: boolean;
        /**
         * The **`height`** property of the HTMLObjectElement interface Returns a string that reflects the height HTML attribute, specifying the displayed height of the resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement/height)
         */
        height: string;
        /** @deprecated */
        hspace: number;
        /**
         * The **`name`** property of the HTMLObjectElement interface returns a string that reflects the name HTML attribute, specifying the name of the browsing context.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement/name)
         */
        name: string;
        /** @deprecated */
        standby: string;
        /**
         * The **`type`** property of the HTMLObjectElement interface returns a string that reflects the type HTML attribute, specifying the MIME type of the resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement/type)
         */
        type: string;
        /**
         * The **`useMap`** property of the HTMLObjectElement interface returns a string that reflects the usemap HTML attribute, specifying a <map> element to use.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement/useMap)
         */
        useMap: string;
        /** @deprecated */
        vspace: number;
        /**
         * The **`width`** property of the HTMLObjectElement interface returns a string that reflects the width HTML attribute, specifying the displayed width of the resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement/width)
         */
        width: string;
    }

    /**
     * The **`HTMLOptGroupElement`** interface provides special properties and methods (beyond the regular HTMLElement object interface they also have available to them by inheritance) for manipulating the layout and presentation of <optgroup> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptGroupElement)
     */
    export interface HTMLOptGroupElement extends HTMLElement {
        /**
         * The **`disabled`** property of the HTMLOptGroupElement interface is a boolean value that reflects the <optgroup> element's disabled attribute, which indicates whether the control is disabled.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptGroupElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`label`** property of the HTMLOptGroupElement interface is a string value that reflects the <optgroup> element's label attribute, which provides a textual label to the group of options.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptGroupElement/label)
         */
        label: string;
    }

    /**
     * The **`HTMLOptionElement`** interface represents <option> elements and inherits all properties and methods of the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement)
     */
    export interface HTMLOptionElement extends HTMLElement {
        /**
         * The **`defaultSelected`** property of the HTMLOptionElement interface specifies the default selected state of the element. This property reflects the <option> element's selected attribute. The presence of the selected attribute sets the defaultSelected property to true.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement/defaultSelected)
         */
        defaultSelected: boolean;
        /**
         * The **`disabled`** property of the HTMLOptionElement is a boolean value that indicates whether the <option> element is unavailable to be selected. The property reflects the value of the disabled HTML attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`label`** property of the HTMLOptionElement represents the text displayed for an option in a <select> element or as part of a list of suggestions in a <datalist> element. It reflects the <option> element's label attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement/label)
         */
        label: string;
        /**
         * The **`selected`** property of the HTMLOptionElement interface specifies the current selectedness of the element; that is, whether the <option> is selected or not.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement/selected)
         */
        selected: boolean;
        /**
         * The **`text`** property of the HTMLOptionElement represents the text inside the <option> element. This property represents the same information as Node.textContent.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement/text)
         */
        text: string;
        /**
         * The **`value`** property of the HTMLOptionElement interface represents the value of the <option> element as a string, or the empty string if no value is set. It reflects the element's value attribute, if present. Otherwise, it returns or sets the contents of the element, similar to the textContent property.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement/value)
         */
        value: string;
    }

    /**
     * The **`HTMLOutputElement`** interface provides properties and methods (beyond those inherited from HTMLElement) for manipulating the layout and presentation of <output> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOutputElement)
     */
    export interface HTMLOutputElement extends HTMLElement {
        htmlFor: string;
        /**
         * The **`defaultValue`** property of the HTMLOutputElement interface represents the default text content of this <output> element. Getting and setting this value is equivalent to getting and setting textContent on the <output>.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOutputElement/defaultValue)
         */
        defaultValue: string;
        /**
         * The **`name`** property of the HTMLOutputElement interface indicates the name of the <output> element. It reflects the element's name attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOutputElement/name)
         */
        name: string;
        /**
         * The **`value`** property of the HTMLOutputElement interface represents the value of the <output> element as a string, or the empty string if no value is set. It returns or sets the contents of the element, similar to the textContent property.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLOutputElement/value)
         */
        value: string;
    }

    /**
     * The **`HTMLParagraphElement`** interface provides special properties (beyond those of the regular HTMLElement object interface it inherits) for manipulating <p> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLParagraphElement)
     */
    export interface HTMLParagraphElement extends HTMLElement {
        /** @deprecated */
        align: string;
    }

    /**
     * The **`HTMLParamElement`** interface provides special properties (beyond those of the regular HTMLElement object interface it inherits) for manipulating <param> elements, representing a pair of a key and a value that acts as a parameter for an <object> element.
     * @deprecated
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLParamElement)
     */
    export interface HTMLParamElement extends HTMLElement {
        /** @deprecated */
        name: string;
        /** @deprecated */
        type: string;
        /** @deprecated */
        value: string;
        /** @deprecated */
        valueType: string;
    }

    /**
     * The **`HTMLPictureElement`** interface represents a <picture> HTML element. It doesn't implement specific properties or methods.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLPictureElement)
     */
    export interface HTMLPictureElement extends HTMLElement {
    }

    /**
     * The **`HTMLPreElement`** interface exposes specific properties and methods (beyond those of the HTMLElement interface it also has available to it by inheritance) for manipulating a block of preformatted text (<pre>).
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLPreElement)
     */
    export interface HTMLPreElement extends HTMLElement {
        /** @deprecated */
        width: number;
    }

    /**
     * The **`HTMLProgressElement`** interface provides special properties and methods (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of <progress> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLProgressElement)
     */
    export interface HTMLProgressElement extends HTMLElement {
        /**
         * The **`max`** property of the HTMLProgressElement interface represents the upper bound of the <progress> element's range.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLProgressElement/max)
         */
        max: number;
        /**
         * The **`value`** property of the HTMLProgressElement interface represents the current progress of the <progress> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLProgressElement/value)
         */
        value: number;
    }

    /**
     * The **`HTMLQuoteElement`** interface provides special properties and methods (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating quoting elements, like <blockquote> and <q>, but not the <cite> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLQuoteElement)
     */
    export interface HTMLQuoteElement extends HTMLElement {
        /**
         * The **`cite`** property of the HTMLQuoteElement interface indicates the URL for the source of the quotation. It reflects the <q> element's cite attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLQuoteElement/cite)
         */
        cite: string;
    }

    /**
     * HTML <script> elements expose the **`HTMLScriptElement`** interface, which provides special properties and methods for manipulating the behavior and execution of <script> elements (beyond the inherited HTMLElement interface).
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement)
     */
    export interface HTMLScriptElement extends HTMLElement {
        blocking: string;
        /**
         * The **`async`** property of the HTMLScriptElement interface is a boolean value that controls how the script should be executed. For classic scripts, if the async property is set to true, the external script will be fetched in parallel to parsing and evaluated as soon as it is available. For module scripts, if the async property is set to true, the script and all their dependencies will be fetched in parallel to parsing and evaluated as soon as they are available.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/async)
         */
        async: boolean;
        /** @deprecated */
        charset: string;
        /**
         * The **`crossOrigin`** property of the HTMLScriptElement interface reflects the Cross-Origin Resource Sharing settings for the script element. For classic scripts from other origins, this controls if full error information will be exposed. For module scripts, it controls the script itself and any script it imports. See CORS settings attributes for details.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/crossOrigin)
         */
        crossOrigin: string | null;
        /**
         * The **`defer`** property of the HTMLScriptElement interface is a boolean value that controls how the script should be executed. For classic scripts, if the defer property is set to true, the external script will be executed after the document has been parsed, but before firing DOMContentLoaded event. For module scripts, the defer property has no effect.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/defer)
         */
        defer: boolean;
        /** @deprecated */
        event: string;
        /**
         * The **`fetchPriority`** property of the HTMLScriptElement interface represents a hint to the browser indicating how it should prioritize fetching an external script relative to other external scripts. It reflects the <script> element's fetchpriority content attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/fetchPriority)
         */
        fetchPriority: "high" | "low" | "auto";
        /** @deprecated */
        htmlFor: string;
        /**
         * The **`integrity`** property of the HTMLScriptElement interface is a string that contains inline metadata that a browser can use to verify that a fetched resource has been delivered without unexpected manipulation.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/integrity)
         */
        integrity: string;
        /**
         * The **`noModule`** property of the HTMLScriptElement interface is a boolean value that indicates whether the script should be executed in browsers that support ES modules. Practically, this can be used to serve fallback scripts to older browsers that do not support JavaScript modules.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/noModule)
         */
        noModule: boolean;
        /**
         * The **`referrerPolicy`** property of the HTMLScriptElement interface reflects the HTML referrerpolicy of the <script> element, which defines how the referrer is set when fetching the script and any scripts it imports.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/referrerPolicy)
         */
        referrerPolicy: string;
        /**
         * The **`src`** property of the HTMLScriptElement interface is a string representing the URL of an external script; this can be used as an alternative to embedding a script directly within a document.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/src)
         */
        src: string;
        /**
         * The **`text`** property of the HTMLScriptElement interface represents the inline text content of the <script> element. It behaves in the same way as the textContent and innerText property.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/text)
         */
        text: string;
        /**
         * The **`type`** property of the HTMLScriptElement interface is a string that reflects the type of the script.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement/type)
         */
        type: string;
    }

    /**
     * The **`HTMLSelectElement`** interface represents a <select> HTML Element. These elements also share all of the properties and methods of other HTML elements via the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement)
     */
    export interface HTMLSelectElement extends HTMLElement {
        [name: number]: HTMLOptionElement | HTMLOptGroupElement;
        /**
         * The **`autocomplete`** property of the HTMLSelectElement interface indicates whether the value of the control can be automatically completed by the browser. It reflects the <select> element's autocomplete attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/autocomplete)
         */
        autocomplete: AutoFill;
        /**
         * The **`HTMLSelectElement.disabled`** property is a boolean value that reflects the disabled HTML attribute, which indicates whether the control is disabled. If it is disabled, it does not accept clicks. A disabled element is unusable and un-clickable.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`length`** property of the HTMLSelectElement interface specifies the number of <option> elements in the <select> element. It represents the number of nodes in the options collection. On setting, it acts as (HTMLOptionsCollection.length).
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/length)
         */
        length: number;
        /**
         * The **`multiple`** property of the HTMLSelectElement interface specifies that the user may select more than one option from the list of options. It reflects the <select> element's multiple attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/multiple)
         */
        multiple: boolean;
        /**
         * The **`name`** property of the HTMLSelectElement interface indicates the name of the <select> element. It reflects the element's name attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/name)
         */
        name: string;
        /**
         * The **`required`** property of the HTMLSelectElement interface specifies that the user must select an option with a non-empty string value before submitting a form. It reflects the <select> element's required attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/required)
         */
        required: boolean;
        /**
         * The **`selectedIndex`** property of the HTMLSelectElement interface is the numeric index of the first selected <option> element in a <select> element, if any, or −1 if no <option> is selected. Setting this property selects the option at that index and deselects all other options, while setting it to -1 deselects any currently selected options.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/selectedIndex)
         */
        selectedIndex: number;
        /**
         * The **`size`** property of the HTMLSelectElement interface specifies the number of options, or rows, that should be visible at one time. It reflects the <select> element's size attribute. If omitted, the value is 0.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/size)
         */
        size: number;
        /**
         * The **`HTMLSelectElement.value`** property contains the value of the first selected <option> element associated with this <select> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement/value)
         */
        value: string;
    }

    /**
     * The **`HTMLSlotElement`** interface of the Shadow DOM API enables access to the name and assigned nodes of an HTML <slot> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement)
     */
    export interface HTMLSlotElement extends HTMLElement {
        /**
         * The **`name`** property of the HTMLSlotElement interface returns or sets the slot name. A slot is a placeholder inside a web component that users can fill with their own markup.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement/name)
         */
        name: string;
    }

    /**
     * The **`HTMLSourceElement`** interface provides special properties (beyond the regular HTMLElement object interface it also has available to it by inheritance) for manipulating <source> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement)
     */
    export interface HTMLSourceElement extends HTMLElement {
        /**
         * The **`height`** property of the HTMLSourceElement interface is a non-negative number indicating the height of the image resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/height)
         */
        height: number;
        /**
         * The **`media`** property of the HTMLSourceElement interface is a string representing the intended destination medium for the resource. The value is a media query, which is a comma separated list of media-types, media-features, and logical operators.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/media)
         */
        media: string;
        /**
         * The **`sizes`** property of the HTMLSourceElement interface is a string representing a list of one or more sizes, representing sizes between breakpoints, to which the resource applies.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/sizes)
         */
        sizes: string;
        /**
         * The **`src`** property of the HTMLSourceElement interface is a string indicating the URL of a media resource to use as the source for the element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/src)
         */
        src: string;
        /**
         * The **`srcset`** property of the HTMLSourceElement interface is a string containing a comma-separated list of candidate images.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/srcset)
         */
        srcset: string;
        /**
         * The **`type`** property of the HTMLSourceElement interface is a string representing the MIME type of the media resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/type)
         */
        type: string;
        /**
         * The **`width`** property of the HTMLSourceElement interface is a non-negative number indicating the width of the image resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement/width)
         */
        width: number;
    }

    /**
     * The **`HTMLSpanElement`** interface represents a <span> element and derives from the HTMLElement interface, but without implementing any additional properties or methods.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSpanElement)
     */
    export interface HTMLSpanElement extends HTMLElement {
    }

    /**
     * The **`HTMLStyleElement`** interface represents a <style> element. It inherits properties and methods from its parent, HTMLElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLStyleElement)
     */
    export interface HTMLStyleElement extends HTMLElement, LinkStyle {
        blocking: string;
        /**
         * The **`HTMLStyleElement.disabled`** property can be used to get and set whether the stylesheet is disabled (true) or not (false).
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLStyleElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`HTMLStyleElement.media`** property specifies the intended destination medium for style information.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLStyleElement/media)
         */
        media: string;
        /**
         * The **`HTMLStyleElement.type`** property returns the type of the current style. The value mirrors the HTML <style> element's type attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLStyleElement/type)
         */
        type: string;
    }

    /**
     * The **`HTMLTableCaptionElement`** interface provides special properties (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating table <caption> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCaptionElement)
     */
    export interface HTMLTableCaptionElement extends HTMLElement {
        /**
         * The **`align`** property of the HTMLTableCaptionElement interface is a string indicating how to horizontally align text in the <caption> table element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCaptionElement/align)
         */
        align: string;
    }

    /**
     * The **`HTMLTableCellElement`** interface provides special properties and methods (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of table cells, either header cells (<th>) or data cells (<td>), in an HTML document.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement)
     */
    export interface HTMLTableCellElement extends HTMLElement {
        /**
         * The **`abbr`** property of the HTMLTableCellElement interface indicates an abbreviation associated with the cell. If the cell does not represent a header cell <th>, it is ignored.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/abbr)
         */
        abbr: string;
        /**
         * The **`align`** property of the HTMLTableCellElement interface is a string indicating how to horizontally align text in the <th> or <td> table cell.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/align)
         */
        align: string;
        /** @deprecated */
        axis: string;
        /**
         * The **`HTMLTableCellElement.bgColor`** property is used to set the background color of a cell or get the value of the obsolete bgColor attribute, if present.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/bgColor)
         */
        bgColor: string;
        /**
         * The **`ch`** property of the HTMLTableCellElement interface does nothing. It reflects the char attribute of the cell element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/ch)
         */
        ch: string;
        /**
         * The **`chOff`** property of the HTMLTableCellElement interface does nothing. It reflects the charoff attribute of the cell element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/chOff)
         */
        chOff: string;
        /**
         * The **`colSpan`** property of the HTMLTableCellElement interface represents the number of columns this cell must span; this lets the cell occupy space across multiple columns of the table. It reflects the colspan attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/colSpan)
         */
        colSpan: number;
        /**
         * The **`headers`** property of the HTMLTableCellElement interface contains a list of IDs of <th> elements that are headers for this specific cell.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/headers)
         */
        headers: string;
        /** @deprecated */
        height: string;
        /**
         * The **`noWrap`** property of the HTMLTableCellElement interface returns a Boolean value indicating if the text of the cell may be wrapped on several lines or not.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/noWrap)
         */
        noWrap: boolean;
        /**
         * The **`rowSpan`** property of the HTMLTableCellElement interface represents the number of rows this cell must span; this lets the cell occupy space across multiple rows of the table. It reflects the rowspan attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/rowSpan)
         */
        rowSpan: number;
        /**
         * The **`scope`** property of the HTMLTableCellElement interface indicates the scope of a <th> cell.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/scope)
         */
        scope: string;
        /**
         * The **`vAlign`** property of the HTMLTableCellElement interface is a string indicating how to vertically align text in a <th> or <td> table cell.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement/vAlign)
         */
        vAlign: string;
        /** @deprecated */
        width: string;
    }

    /**
     * The **`HTMLTableColElement`** interface provides properties for manipulating single or grouped table column elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement)
     */
    export interface HTMLTableColElement extends HTMLElement {
        /**
         * The **`align`** property of the HTMLTableColElement interface is a string indicating how to horizontally align text in a table <col> column element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement/align)
         */
        align: string;
        /**
         * The **`ch`** property of the HTMLTableColElement interface does nothing. It reflects the char attribute of the <col> element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement/ch)
         */
        ch: string;
        /**
         * The **`chOff`** property of the HTMLTableColElement interface does nothing. It reflects the charoff attribute of the <col> element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement/chOff)
         */
        chOff: string;
        /**
         * The **`span`** property of the HTMLTableColElement interface represents the number of columns this <col> or <colgroup> must span; this lets the column occupy space across multiple columns of the table. It reflects the span attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement/span)
         */
        span: number;
        /**
         * The **`vAlign`** property of the HTMLTableColElement interface is a string indicating how to vertically align text in a table <col> column element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement/vAlign)
         */
        vAlign: string;
        /** @deprecated */
        width: string;
    }

    /** @deprecated prefer HTMLTableCellElement */
    export interface HTMLTableDataCellElement extends HTMLTableCellElement {
    }

    /**
     * The **`HTMLTableElement`** interface provides special properties and methods (beyond the regular HTMLElement object interface it also has available to it by inheritance) for manipulating the layout and presentation of tables in an HTML document.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement)
     */
    export interface HTMLTableElement extends HTMLElement {
        /**
         * The **`HTMLTableElement.align`** property represents the alignment of the table.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/align)
         */
        align: string;
        /**
         * The bgcolor property of the HTMLTableElement represents the background color of the table.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/bgColor)
         */
        bgColor: string;
        /**
         * The **`HTMLTableElement.border`** property represents the border width of the <table> element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/border)
         */
        border: string;
        /**
         * The **`HTMLTableElement.cellPadding`** property represents the padding around the individual cells of the table.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/cellPadding)
         */
        cellPadding: string;
        /**
         * While you should instead use the CSS border-spacing property, the obsolete HTMLTableElement interface's **`cellSpacing`** property represents the spacing around the individual <th> and <td> elements representing a table's cells. Any two cells are separated by the sum of the cellSpacing of each of the two cells.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/cellSpacing)
         */
        cellSpacing: string;
        /**
         * The HTMLTableElement interface's **`frame`** property is a string that indicates which of the table's exterior borders should be drawn.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/frame)
         */
        frame: string;
        /**
         * The **`HTMLTableElement.rules`** property indicates which cell borders to render in the table.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/rules)
         */
        rules: string;
        /**
         * The **`HTMLTableElement.summary`** property represents the table description.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/summary)
         */
        summary: string;
        /**
         * The **`HTMLTableElement.tHead`** represents the <thead> element of a <table>. Its value will be null if there is no such element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/tHead)
         */
        tHead: HTMLTableSectionElement | null;
        /**
         * The **`HTMLTableElement.width`** property represents the desired width of the table.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableElement/width)
         */
        width: string;
    }

    /** @deprecated prefer HTMLTableCellElement */
    export interface HTMLTableHeaderCellElement extends HTMLTableCellElement {
    }

    /**
     * The **`HTMLTableRowElement`** interface provides special properties and methods (beyond the HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of rows in an HTML table.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement)
     */
    export interface HTMLTableRowElement extends HTMLElement {
        /**
         * The **`align`** property of the HTMLTableRowElement interface is a string indicating how to horizontally align text in the <tr> table row. Individual cells can override it.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement/align)
         */
        align: string;
        /**
         * The **`HTMLTableRowElement.bgColor`** property is used to set the background color of a row or retrieve the value of the obsolete bgColor attribute, if present.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement/bgColor)
         */
        bgColor: string;
        /**
         * The **`ch`** property of the HTMLTableRowElement interface does nothing. It reflects the char attribute of the <tr> element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement/ch)
         */
        ch: string;
        /**
         * The **`chOff`** property of the HTMLTableRowElement interface does nothing. It reflects the charoff attribute of the <tr> element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement/chOff)
         */
        chOff: string;
        /**
         * The **`vAlign`** property of the HTMLTableRowElement interface is a string indicating how to vertically align text in a <tr> table row. Individual cells can override it.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement/vAlign)
         */
        vAlign: string;
    }

    /**
     * The **`HTMLTableSectionElement`** interface provides special properties and methods (beyond the HTMLElement interface it also has available to it by inheritance) for manipulating the layout and presentation of sections, that is headers, footers and bodies (<thead>, <tfoot>, and <tbody>, respectively) in an HTML table.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableSectionElement)
     */
    export interface HTMLTableSectionElement extends HTMLElement {
        /**
         * The **`align`** property of the HTMLTableSectionElement interface is a string indicating how to horizontally align text in a <thead>, <tbody> or <tfoot> table section. Individual rows and cells can override it.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableSectionElement/align)
         */
        align: string;
        /**
         * The **`ch`** property of the HTMLTableSectionElement interface does nothing. It reflects the char attribute of the section element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableSectionElement/ch)
         */
        ch: string;
        /**
         * The **`chOff`** property of the HTMLTableSectionElement interface does nothing. It reflects the charoff attribute of the section element.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableSectionElement/chOff)
         */
        chOff: string;
        /**
         * The **`vAlign`** property of the HTMLTableSectionElement interface is a string indicating how to vertically align text in a <thead>, <tbody> or <tfoot> table section. Individual rows and cells can override it.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTableSectionElement/vAlign)
         */
        vAlign: string;
    }

    /**
     * The **`HTMLTemplateElement`** interface enables access to the contents of an HTML <template> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement)
     */
    export interface HTMLTemplateElement extends HTMLElement {
        /**
         * The **`shadowRootClonable`** property reflects the value of the shadowrootclonable attribute of the associated <template> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement/shadowRootClonable)
         */
        shadowRootClonable: boolean;
        /**
         * The **`shadowRootDelegatesFocus`** property of the HTMLTemplateElement interface reflects the value of the shadowrootdelegatesfocus attribute of the associated <template> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement/shadowRootDelegatesFocus)
         */
        shadowRootDelegatesFocus: boolean;
        /**
         * The **`shadowRootMode`** property of the HTMLTemplateElement interface reflects the value of the shadowrootmode attribute of the associated <template> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement/shadowRootMode)
         */
        shadowRootMode: string;
        /**
         * The **`shadowRootSerializable`** property reflects the value of the shadowrootserializable attribute of the associated <template> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement/shadowRootSerializable)
         */
        shadowRootSerializable: boolean;
    }

    /**
     * The **`HTMLTextAreaElement`** interface provides properties and methods for manipulating the layout and presentation of <textarea> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement)
     */
    export interface HTMLTextAreaElement extends HTMLElement {
        /**
         * The **`autocomplete`** property of the HTMLTextAreaElement interface indicates whether the value of the control can be automatically completed by the browser. It reflects the <textarea> element's autocomplete attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/autocomplete)
         */
        autocomplete: AutoFill;
        /**
         * The **`cols`** property of the HTMLTextAreaElement interface is a positive integer representing the visible width of the multi-line text control, in average character widths. It reflects the <textarea> element's cols attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/cols)
         */
        cols: number;
        /**
         * The **`defaultValue`** property of the HTMLTextAreaElement interface represents the default text content of this text area. Getting and setting this value is equivalent to getting and setting textContent on the <textarea>.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/defaultValue)
         */
        defaultValue: string;
        /**
         * The **`dirName`** property of the HTMLTextAreaElement interface is the directionality of the element. It reflects the value of the <textarea> element's dirName attribute. This property can be retrieved or set.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/dirName)
         */
        dirName: string;
        /**
         * The **`disabled`** property of the HTMLTextAreaElement interface indicates whether this multi-line text control is disabled and cannot be interacted with. It reflects the <textarea> element's disabled attribute. When false, this textarea may still be disabled if its containing element, such as a <fieldset>, is disabled.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`maxLength`** property of the HTMLTextAreaElement interface indicates the maximum number of characters (in UTF-16 code units) allowed to be entered for the value of the <textarea> element, and the maximum number of characters allowed for the value to be valid. It reflects the element's maxlength attribute. -1 means there is no limit on the length of the value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/maxLength)
         */
        maxLength: number;
        /**
         * The **`minLength`** property of the HTMLTextAreaElement interface indicates the minimum number of characters (in UTF-16 code units) required for the value of the <textarea> element to be valid. It reflects the element's minlength attribute. -1 means there is no minimum length requirement.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/minLength)
         */
        minLength: number;
        /**
         * The **`name`** property of the HTMLTextAreaElement interface indicates the name of the <textarea> element. It reflects the element's name attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/name)
         */
        name: string;
        /**
         * The **`placeholder`** property of the HTMLTextAreaElement interface represents a hint to the user of what can be entered in the control. It reflects the <textarea> element's placeholder attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/placeholder)
         */
        placeholder: string;
        /**
         * The **`readOnly`** property of the HTMLTextAreaElement interface indicates that the user cannot modify the value of the control. Unlike the disabled attribute, the readonly attribute does not prevent the user from clicking or selecting in the control. It reflects the <textarea> element's readonly attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/readOnly)
         */
        readOnly: boolean;
        /**
         * The **`required`** property of the HTMLTextAreaElement interface specifies that the user must fill in a value before submitting a form. It reflects the <textarea> element's required attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/required)
         */
        required: boolean;
        /**
         * The **`rows`** property of the HTMLTextAreaElement interface is a positive integer representing the visible text lines of the text control. It reflects the <textarea> element's rows attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/rows)
         */
        rows: number;
        /**
         * The **`selectionDirection`** property of the HTMLTextAreaElement interface specifies the current direction of the selection. The possible values are "forward", "backward", and "none". The forward value indicates the selection was performed in the start-to-end direction of the current locale, with backward indicating the opposite direction. The none value occurs if the direction is unknown. It can be used to both retrieve and change the direction of the <textarea>s selected text.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/selectionDirection)
         */
        selectionDirection: SelectionDirection;
        /**
         * The **`selectionEnd`** property of the HTMLTextAreaElement interface specifies the end position of the current text selection in a <textarea> element. It is a number representing the last index of the selected text. It can be used to both retrieve and set the index of the end of a <textarea>s selected text.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/selectionEnd)
         */
        selectionEnd: number;
        /**
         * The **`selectionStart`** property of the HTMLTextAreaElement interface specifies the start position of the current text selection in a <textarea> element. It is a number representing the beginning index of the selected text. It can be used to both retrieve and set the start of the index of the beginning of a <textarea>s selected text.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/selectionStart)
         */
        selectionStart: number;
        /**
         * The **`value`** property of the HTMLTextAreaElement interface represents the value of the <textarea> element as a string, which is an empty string if the widget contains no content. It returns or sets the raw value contained in the control.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/value)
         */
        value: string;
        /**
         * The **`wrap`** property of the HTMLTextAreaElement interface indicates how the control should wrap the value for form submission. It reflects the <textarea> element's wrap attribute. Note that the "hard" value only has an effect when the cols attribute is also set.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement/wrap)
         */
        wrap: string;
    }

    /**
     * The **`HTMLTimeElement`** interface provides special properties (beyond the regular HTMLElement interface it also has available to it by inheritance) for manipulating <time> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTimeElement)
     */
    export interface HTMLTimeElement extends HTMLElement {
        /**
         * The **`dateTime`** property of the HTMLTimeElement interface is a string that reflects the datetime HTML attribute, containing a machine-readable form of the element's date and time value.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTimeElement/dateTime)
         */
        dateTime: string;
    }

    /**
     * The **`HTMLTitleElement`** interface is implemented by a document's <title>. This element inherits all of the properties and methods of the HTMLElement interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTitleElement)
     */
    export interface HTMLTitleElement extends HTMLElement {
        /**
         * The **`text`** property of the HTMLTitleElement interface represents the child text content of the document's title as a string. It contains the <title> element's content as text; if HTML tags are included within the <title> element, they are included as part of the string value rather than being parsed as HTML.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTitleElement/text)
         */
        text: string;
    }

    /**
     * The **`HTMLTrackElement`** interface represents an HTML <track> element within the DOM. This element can be used as a child of either <audio> or <video> to specify a text track containing information such as closed captions or subtitles.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement)
     */
    export interface HTMLTrackElement extends HTMLElement {
        /**
         * The **`default`** property of the HTMLTrackElement interface represents whether the track will be enabled if the user's preferences do not indicate that another track would be more appropriate. It reflects the <track> element's boolean default attribute, returning true if present and false otherwise.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/default)
         */
        default: boolean;
        /**
         * The **`kind`** property of the HTMLTrackElement interface represents the type of track, or how the text track is meant to be used. It reflects the <track> element's enumerated kind attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/kind)
         */
        kind: string;
        /**
         * The **`label`** property of the HTMLTrackElement represents the user-readable title displayed when listing subtitle, caption, and audio descriptions for a track. It reflects the <track> element's label attribute.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/label)
         */
        label: string;
        /**
         * The **`src`** property of the HTMLTrackElement interface reflects the value of the <track> element's src attribute, which indicates the URL of the text track's data.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/src)
         */
        src: string;
        /**
         * The **`srclang`** property of the HTMLTrackElement interface reflects the value of the <track> element's srclang attribute or the empty string if not defined.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/srclang)
         */
        srclang: string;
    }

    /**
     * The **`HTMLUListElement`** interface provides special properties (beyond those defined on the regular HTMLElement interface it also has available to it by inheritance) for manipulating unordered list (<ul>) elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLUListElement)
     */
    export interface HTMLUListElement extends HTMLElement {
        /**
         * The **`compact`** property of the HTMLUListElement interface indicates that spacing between list items should be reduced. The exact handling of the compact attribute is browser-specific. Instead of using this property, consider using CSS line-height instead.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLUListElement/compact)
         */
        compact: boolean;
        /** @deprecated */
        type: string;
    }

    /**
     * The **`HTMLUnknownElement`** interface represents an invalid HTML element and derives from the HTMLElement interface, but without implementing any additional properties or methods.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLUnknownElement)
     */
    export interface HTMLUnknownElement extends HTMLElement {
    }

    /**
     * Implemented by the <video> element, the **`HTMLVideoElement`** interface provides special properties and methods for manipulating video objects. It also inherits properties and methods of HTMLMediaElement and HTMLElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
     */
    export interface HTMLVideoElement extends HTMLMediaElement {
        /**
         * The HTMLVideoElement **`disablePictureInPicture`** property reflects the HTML attribute indicating whether the picture-in-picture feature is disabled for the current element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/disablePictureInPicture)
         */
        disablePictureInPicture: boolean;
        /**
         * The **`height`** property of the HTMLVideoElement interface returns an integer that reflects the height attribute of the <video> element, specifying the displayed height of the resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/height)
         */
        height: number;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/enterpictureinpicture_event) */
        onenterpictureinpicture: ((this: HTMLVideoElement, ev: PictureInPictureEvent) => any) | null;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/leavepictureinpicture_event) */
        onleavepictureinpicture: ((this: HTMLVideoElement, ev: PictureInPictureEvent) => any) | null;
        playsInline: boolean;
        /**
         * The **`poster`** property of the HTMLVideoElement interface is a string that reflects the URL for an image to be shown while no video data is available. If the property does not represent a valid URL, no poster frame will be shown.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/poster)
         */
        poster: string;
        /**
         * The **`width`** property of the HTMLVideoElement interface returns an integer that reflects the width attribute of the <video> element, specifying the displayed width of the resource in CSS pixels.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/width)
         */
        width: number;
    }

    /**
     * The **`MathMLElement`** interface represents any MathML element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MathMLElement)
     */
    export interface MathMLElement extends Element, ElementCSSInlineStyle, GlobalEventHandlers, HTMLOrSVGElement {
    }

    /**
     * The **`SVGAElement`** interface provides access to the properties of an <a> element, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAElement)
     */
    export interface SVGAElement extends SVGGraphicsElement, SVGURIReference {
        relList: string;
        /**
         * The **`download`** property of the SVGAElement interface returns a string indicating that the browser should treat the linked URL as a download.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAElement/download)
         */
        download: string;
        /**
         * The **`hreflang`** property of the SVGAElement interface returns a string indicating the language of the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAElement/hreflang)
         */
        hreflang: string;
        /**
         * The **`ping`** property of the SVGAElement interface returns a string that reflects the ping attribute, containing a space-separated list of URLs to which, when the hyperlink is followed, POST requests with the body PING will be sent by the browser (in the background). Typically used for tracking.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAElement/ping)
         */
        ping: string;
        referrerPolicy: string;
        /**
         * The **`rel`** property of the SVGAElement returns a string reflecting the value of the rel attribute of the SVG <a> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAElement/rel)
         */
        rel: string;
        /**
         * The **`type`** property of the SVGAElement interface returns a string indicating the MIME type of the linked resource.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAElement/type)
         */
        type: string;
    }

    /**
     * The **`SVGGraphicsElement`** interface represents SVG elements whose primary purpose is to directly render graphics into a group.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGGraphicsElement)
     */
    export interface SVGGraphicsElement extends SVGElement, SVGTests {
    }

    /**
     * All of the SVG DOM interfaces that correspond directly to elements in the SVG language derive from the **`SVGElement`** interface.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGElement)
     */
    export interface SVGElement extends Element, ElementCSSInlineStyle, GlobalEventHandlers, HTMLOrSVGElement {
    }

    interface SVGTests {
    }

    interface SVGURIReference {
    }

    /**
     * The **`SVGAnimateElement`** interface corresponds to the <animate> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAnimateElement)
     */
    export interface SVGAnimateElement extends SVGAnimationElement {
    }

    /**
     * The **`SVGAnimationElement`** interface is the base interface for all of the animation element interfaces: SVGAnimateElement, SVGSetElement, SVGAnimateColorElement, SVGAnimateMotionElement and SVGAnimateTransformElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAnimationElement)
     */
    export interface SVGAnimationElement extends SVGElement, SVGTests {
    }

    /**
     * The **`SVGAnimateMotionElement`** interface corresponds to the <animateMotion> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAnimateMotionElement)
     */
    export interface SVGAnimateMotionElement extends SVGAnimationElement {
    }

    /**
     * The **`SVGAnimateTransformElement`** interface corresponds to the <animateTransform> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGAnimateTransformElement)
     */
    export interface SVGAnimateTransformElement extends SVGAnimationElement {
    }

    /**
     * The **`SVGCircleElement`** interface is an interface for the <circle> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGCircleElement)
     */
    export interface SVGCircleElement extends SVGGeometryElement {
    }

    /**
     * The **`SVGGeometryElement`** interface represents SVG elements whose rendering is defined by geometry with an equivalent path, and which can be filled and stroked. This includes paths and the basic shapes.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGGeometryElement)
     */
    export interface SVGGeometryElement extends SVGGraphicsElement {
    }

    /**
     * The **`SVGClipPathElement`** interface provides access to the properties of <clipPath> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGClipPathElement)
     */
    export interface SVGClipPathElement extends SVGElement {
    }

    /**
     * The **`SVGComponentTransferFunctionElement`** interface represents a base interface used by the component transfer function interfaces.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGComponentTransferFunctionElement)
     */
    export interface SVGComponentTransferFunctionElement extends SVGElement {
    }

    /**
     * The **`SVGDefsElement`** interface corresponds to the <defs> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGDefsElement)
     */
    export interface SVGDefsElement extends SVGGraphicsElement {
    }

    /**
     * The **`SVGDescElement`** interface corresponds to the <desc> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGDescElement)
     */
    export interface SVGDescElement extends SVGElement {
    }

    /**
     * The **`SVGEllipseElement`** interface provides access to the properties of <ellipse> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGEllipseElement)
     */
    export interface SVGEllipseElement extends SVGGeometryElement {
    }

    /**
     * The **`SVGFEBlendElement`** interface corresponds to the <feBlend> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEBlendElement)
     */
    export interface SVGFEBlendElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    interface SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEColorMatrixElement`** interface corresponds to the <feColorMatrix> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEColorMatrixElement)
     */
    export interface SVGFEColorMatrixElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEComponentTransferElement`** interface corresponds to the <feComponentTransfer> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEComponentTransferElement)
     */
    export interface SVGFEComponentTransferElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFECompositeElement`** interface corresponds to the <feComposite> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFECompositeElement)
     */
    export interface SVGFECompositeElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEConvolveMatrixElement`** interface corresponds to the <feConvolveMatrix> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEConvolveMatrixElement)
     */
    export interface SVGFEConvolveMatrixElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEDiffuseLightingElement`** interface corresponds to the <feDiffuseLighting> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEDiffuseLightingElement)
     */
    export interface SVGFEDiffuseLightingElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEDisplacementMapElement`** interface corresponds to the <feDisplacementMap> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEDisplacementMapElement)
     */
    export interface SVGFEDisplacementMapElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEDistantLightElement`** interface corresponds to the <feDistantLight> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEDistantLightElement)
     */
    export interface SVGFEDistantLightElement extends SVGElement {
    }

    /**
     * The **`SVGFEDropShadowElement`** interface corresponds to the <feDropShadow> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEDropShadowElement)
     */
    export interface SVGFEDropShadowElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEFloodElement`** interface corresponds to the <feFlood> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEFloodElement)
     */
    export interface SVGFEFloodElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEFuncAElement`** interface corresponds to the <feFuncA> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEFuncAElement)
     */
    export interface SVGFEFuncAElement extends SVGComponentTransferFunctionElement {
    }

    /**
     * The **`SVGFEFuncBElement`** interface corresponds to the <feFuncB> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEFuncBElement)
     */
    export interface SVGFEFuncBElement extends SVGComponentTransferFunctionElement {
    }

    /**
     * The **`SVGFEFuncGElement`** interface corresponds to the <feFuncG> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEFuncGElement)
     */
    export interface SVGFEFuncGElement extends SVGComponentTransferFunctionElement {
    }

    /**
     * The **`SVGFEFuncRElement`** interface corresponds to the <feFuncR> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEFuncRElement)
     */
    export interface SVGFEFuncRElement extends SVGComponentTransferFunctionElement {
    }

    /**
     * The **`SVGFEGaussianBlurElement`** interface corresponds to the <feGaussianBlur> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEGaussianBlurElement)
     */
    export interface SVGFEGaussianBlurElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEImageElement`** interface corresponds to the <feImage> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEImageElement)
     */
    export interface SVGFEImageElement extends SVGElement, SVGFilterPrimitiveStandardAttributes, SVGURIReference {
    }

    /**
     * The **`SVGFEMergeElement`** interface corresponds to the <feMerge> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEMergeElement)
     */
    export interface SVGFEMergeElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEMergeNodeElement`** interface corresponds to the <feMergeNode> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEMergeNodeElement)
     */
    export interface SVGFEMergeNodeElement extends SVGElement {
    }

    /**
     * The **`SVGFEMorphologyElement`** interface corresponds to the <feMorphology> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEMorphologyElement)
     */
    export interface SVGFEMorphologyElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEOffsetElement`** interface corresponds to the <feOffset> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEOffsetElement)
     */
    export interface SVGFEOffsetElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFEPointLightElement`** interface corresponds to the <fePointLight> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFEPointLightElement)
     */
    export interface SVGFEPointLightElement extends SVGElement {
    }

    /**
     * The **`SVGFESpecularLightingElement`** interface corresponds to the <feSpecularLighting> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFESpecularLightingElement)
     */
    export interface SVGFESpecularLightingElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFESpotLightElement`** interface corresponds to the <feSpotLight> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFESpotLightElement)
     */
    export interface SVGFESpotLightElement extends SVGElement {
    }

    /**
     * The **`SVGFETileElement`** interface corresponds to the <feTile> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFETileElement)
     */
    export interface SVGFETileElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFETurbulenceElement`** interface corresponds to the <feTurbulence> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFETurbulenceElement)
     */
    export interface SVGFETurbulenceElement extends SVGElement, SVGFilterPrimitiveStandardAttributes {
    }

    /**
     * The **`SVGFilterElement`** interface provides access to the properties of <filter> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGFilterElement)
     */
    export interface SVGFilterElement extends SVGElement, SVGURIReference {
    }

    /**
     * The **`SVGForeignObjectElement`** interface provides access to the properties of <foreignObject> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGForeignObjectElement)
     */
    export interface SVGForeignObjectElement extends SVGGraphicsElement {
    }

    /**
     * The **`SVGGElement`** interface corresponds to the <g> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGGElement)
     */
    export interface SVGGElement extends SVGGraphicsElement {
    }

    /**
     * The SVGGradient interface is a base interface used by SVGLinearGradientElement and SVGRadialGradientElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGGradientElement)
     */
    export interface SVGGradientElement extends SVGElement, SVGURIReference {
    }

    /**
     * The **`SVGImageElement`** interface corresponds to the <image> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGImageElement)
     */
    export interface SVGImageElement extends SVGGraphicsElement, SVGURIReference {
        /**
         * The **`crossOrigin`** property of the SVGImageElement interface is a string which specifies the Cross-Origin Resource Sharing (CORS) setting to use when retrieving the image. It reflects the crossorigin content attribute of the given <image> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGImageElement/crossOrigin)
         */
        crossOrigin: string | null;
    }

    /**
     * The **`SVGLineElement`** interface provides access to the properties of <line> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGLineElement)
     */
    export interface SVGLineElement extends SVGGeometryElement {
    }

    /**
     * The **`SVGLinearGradientElement`** interface corresponds to the <linearGradient> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGLinearGradientElement)
     */
    export interface SVGLinearGradientElement extends SVGGradientElement {
    }

    /**
     * The **`SVGMPathElement`** interface corresponds to the <mpath> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGMPathElement)
     */
    export interface SVGMPathElement extends SVGElement, SVGURIReference {
    }

    /**
     * The **`SVGMarkerElement`** interface provides access to the properties of <marker> elements, as well as methods to manipulate them. The <marker> element defines the graphics used for drawing marks on a shape.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGMarkerElement)
     */
    export interface SVGMarkerElement extends SVGElement, SVGFitToViewBox {
    }

    interface SVGFitToViewBox {
    }

    /**
     * The **`SVGMaskElement`** interface provides access to the properties of <mask> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGMaskElement)
     */
    export interface SVGMaskElement extends SVGElement {
    }

    /**
     * The **`SVGMetadataElement`** interface corresponds to the <metadata> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGMetadataElement)
     */
    export interface SVGMetadataElement extends SVGElement {
    }

    /**
     * The **`SVGPathElement`** interface corresponds to the <path> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGPathElement)
     */
    export interface SVGPathElement extends SVGGeometryElement {
    }

    /**
     * The **`SVGPatternElement`** interface corresponds to the <pattern> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGPatternElement)
     */
    export interface SVGPatternElement extends SVGElement, SVGFitToViewBox, SVGURIReference {
    }

    /**
     * The **`SVGPolygonElement`** interface provides access to the properties of <polygon> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGPolygonElement)
     */
    export interface SVGPolygonElement extends SVGGeometryElement, SVGAnimatedPoints {
    }

    interface SVGAnimatedPoints {
    }

    /**
     * The **`SVGPolylineElement`** interface provides access to the properties of <polyline> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGPolylineElement)
     */
    export interface SVGPolylineElement extends SVGGeometryElement, SVGAnimatedPoints {
    }

    /**
     * The **`SVGRadialGradientElement`** interface corresponds to the <RadialGradient> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGRadialGradientElement)
     */
    export interface SVGRadialGradientElement extends SVGGradientElement {
    }

    /**
     * The **`SVGRectElement`** interface provides access to the properties of <rect> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGRectElement)
     */
    export interface SVGRectElement extends SVGGeometryElement {
    }

    /**
     * The **`SVGSVGElement`** interface provides access to the properties of <svg> elements, as well as methods to manipulate them. This interface contains also various miscellaneous commonly-used utility methods, such as matrix operations and the ability to control the time of redraw on visual rendering devices.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGSVGElement)
     */
    export interface SVGSVGElement extends SVGGraphicsElement, SVGFitToViewBox, WindowEventHandlers {
        /**
         * The **`currentScale`** property of the SVGSVGElement interface reflects the current scale factor relative to the initial view to take into account user magnification and panning operations on the outermost <svg> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGSVGElement/currentScale)
         */
        currentScale: number;
    }

    /**
     * The **`SVGScriptElement`** interface corresponds to the SVG <script> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGScriptElement)
     */
    export interface SVGScriptElement extends SVGElement, SVGURIReference {
        /**
         * The **`type`** read-only property of the SVGScriptElement interface reflects the type attribute of the given <script> element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGScriptElement/type)
         */
        type: string;
    }

    /**
     * The **`SVGSetElement`** interface corresponds to the <set> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGSetElement)
     */
    export interface SVGSetElement extends SVGAnimationElement {
    }

    /**
     * The **`SVGStopElement`** interface corresponds to the <stop> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGStopElement)
     */
    export interface SVGStopElement extends SVGElement {
    }

    /**
     * The **`SVGStyleElement`** interface corresponds to the SVG <style> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGStyleElement)
     */
    export interface SVGStyleElement extends SVGElement, LinkStyle {
        /**
         * The **`SVGStyleElement.disabled`** property can be used to get and set whether the stylesheet is disabled (true) or not (false).
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGStyleElement/disabled)
         */
        disabled: boolean;
        /**
         * The **`SVGStyleElement.media`** property is a media query string corresponding to the media attribute of the given SVG style element.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGStyleElement/media)
         */
        media: string;
        /**
         * The **`SVGStyleElement.title`** property is a string corresponding to the title attribute of the given SVG style element. It may be used to select between alternate style sheets.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGStyleElement/title)
         */
        title: string;
        /**
         * The **`SVGStyleElement.type`** property returns the type of the current style. The value reflects the associated SVG <style> element's type attribute.
         * @deprecated
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGStyleElement/type)
         */
        type: string;
    }

    /**
     * The **`SVGSwitchElement`** interface corresponds to the <switch> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGSwitchElement)
     */
    export interface SVGSwitchElement extends SVGGraphicsElement {
    }

    /**
     * The **`SVGSymbolElement`** interface corresponds to the <symbol> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGSymbolElement)
     */
    export interface SVGSymbolElement extends SVGElement, SVGFitToViewBox {
    }

    /**
     * The **`SVGTSpanElement`** interface represents a <tspan> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGTSpanElement)
     */
    export interface SVGTSpanElement extends SVGTextPositioningElement {
    }

    /**
     * The **`SVGTextPositioningElement`** interface is implemented by elements that support attributes that position individual text glyphs. It is inherited by SVGTextElement and SVGTSpanElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGTextPositioningElement)
     */
    export interface SVGTextPositioningElement extends SVGTextContentElement {
    }

    /**
     * The **`SVGTextContentElement`** interface is implemented by elements that support rendering child text content. It is inherited by various text-related interfaces, such as SVGTextElement, SVGTSpanElement, and SVGTextPathElement.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGTextContentElement)
     */
    export interface SVGTextContentElement extends SVGGraphicsElement {
    }

    /**
     * The **`SVGTextElement`** interface corresponds to the <text> elements.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGTextElement)
     */
    export interface SVGTextElement extends SVGTextPositioningElement {
    }

    /**
     * The **`SVGTextPathElement`** interface corresponds to the <textPath> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGTextPathElement)
     */
    export interface SVGTextPathElement extends SVGTextContentElement, SVGURIReference {
    }

    /**
     * The **`SVGTitleElement`** interface corresponds to the <title> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGTitleElement)
     */
    export interface SVGTitleElement extends SVGElement {
    }

    /**
     * The **`SVGUseElement`** interface corresponds to the <use> element.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGUseElement)
     */
    export interface SVGUseElement extends SVGGraphicsElement, SVGURIReference {
    }

    /**
     * The **`SVGViewElement`** interface provides access to the properties of <view> elements, as well as methods to manipulate them.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGViewElement)
     */
    export interface SVGViewElement extends SVGElement, SVGFitToViewBox {
    }

    export interface HTMLElementTagNameMap {
        "a": HTMLAnchorElement;
        "abbr": HTMLElement;
        "address": HTMLElement;
        "area": HTMLAreaElement;
        "article": HTMLElement;
        "aside": HTMLElement;
        "audio": HTMLAudioElement;
        "b": HTMLElement;
        "base": HTMLBaseElement;
        "bdi": HTMLElement;
        "bdo": HTMLElement;
        "blockquote": HTMLQuoteElement;
        "body": HTMLBodyElement;
        "br": HTMLBRElement;
        "button": HTMLButtonElement;
        "canvas": HTMLCanvasElement;
        "caption": HTMLTableCaptionElement;
        "cite": HTMLElement;
        "code": HTMLElement;
        "col": HTMLTableColElement;
        "colgroup": HTMLTableColElement;
        "data": HTMLDataElement;
        "datalist": HTMLDataListElement;
        "dd": HTMLElement;
        "del": HTMLModElement;
        "details": HTMLDetailsElement;
        "dfn": HTMLElement;
        "dialog": HTMLDialogElement;
        "div": HTMLDivElement;
        "dl": HTMLDListElement;
        "dt": HTMLElement;
        "em": HTMLElement;
        "embed": HTMLEmbedElement;
        "fieldset": HTMLFieldSetElement;
        "figcaption": HTMLElement;
        "figure": HTMLElement;
        "footer": HTMLElement;
        "form": HTMLFormElement;
        "h1": HTMLHeadingElement;
        "h2": HTMLHeadingElement;
        "h3": HTMLHeadingElement;
        "h4": HTMLHeadingElement;
        "h5": HTMLHeadingElement;
        "h6": HTMLHeadingElement;
        "head": HTMLHeadElement;
        "header": HTMLElement;
        "hgroup": HTMLElement;
        "hr": HTMLHRElement;
        "html": HTMLHtmlElement;
        "i": HTMLElement;
        "iframe": HTMLIFrameElement;
        "img": HTMLImageElement;
        "input": HTMLInputElement;
        "ins": HTMLModElement;
        "kbd": HTMLElement;
        "label": HTMLLabelElement;
        "legend": HTMLLegendElement;
        "li": HTMLLIElement;
        "link": HTMLLinkElement;
        "main": HTMLElement;
        "map": HTMLMapElement;
        "mark": HTMLElement;
        "menu": HTMLMenuElement;
        "meta": HTMLMetaElement;
        "meter": HTMLMeterElement;
        "nav": HTMLElement;
        "noscript": HTMLElement;
        "object": HTMLObjectElement;
        "ol": HTMLOListElement;
        "optgroup": HTMLOptGroupElement;
        "option": HTMLOptionElement;
        "output": HTMLOutputElement;
        "p": HTMLParagraphElement;
        "picture": HTMLPictureElement;
        "pre": HTMLPreElement;
        "progress": HTMLProgressElement;
        "q": HTMLQuoteElement;
        "rp": HTMLElement;
        "rt": HTMLElement;
        "ruby": HTMLElement;
        "s": HTMLElement;
        "samp": HTMLElement;
        "script": HTMLScriptElement;
        "search": HTMLElement;
        "section": HTMLElement;
        "select": HTMLSelectElement;
        "slot": HTMLSlotElement;
        "small": HTMLElement;
        "source": HTMLSourceElement;
        "span": HTMLSpanElement;
        "strong": HTMLElement;
        "style": HTMLStyleElement;
        "sub": HTMLElement;
        "summary": HTMLElement;
        "sup": HTMLElement;
        "table": HTMLTableElement;
        "tbody": HTMLTableSectionElement;
        "td": HTMLTableCellElement;
        "template": HTMLTemplateElement;
        "textarea": HTMLTextAreaElement;
        "tfoot": HTMLTableSectionElement;
        "th": HTMLTableCellElement;
        "thead": HTMLTableSectionElement;
        "time": HTMLTimeElement;
        "title": HTMLTitleElement;
        "tr": HTMLTableRowElement;
        "track": HTMLTrackElement;
        "u": HTMLElement;
        "ul": HTMLUListElement;
        "var": HTMLElement;
        "video": HTMLVideoElement;
        "wbr": HTMLElement;
    }

    export interface HTMLElementDeprecatedTagNameMap {
        "acronym": HTMLElement;
        "applet": HTMLUnknownElement;
        "basefont": HTMLElement;
        "bgsound": HTMLUnknownElement;
        "big": HTMLElement;
        "blink": HTMLUnknownElement;
        "center": HTMLElement;
        "dir": HTMLDirectoryElement;
        "font": HTMLFontElement;
        "frame": HTMLFrameElement;
        "frameset": HTMLFrameSetElement;
        "isindex": HTMLUnknownElement;
        "keygen": HTMLUnknownElement;
        "listing": HTMLPreElement;
        "marquee": HTMLMarqueeElement;
        "menuitem": HTMLElement;
        "multicol": HTMLUnknownElement;
        "nextid": HTMLUnknownElement;
        "nobr": HTMLElement;
        "noembed": HTMLElement;
        "noframes": HTMLElement;
        "param": HTMLParamElement;
        "plaintext": HTMLElement;
        "rb": HTMLElement;
        "rtc": HTMLElement;
        "spacer": HTMLUnknownElement;
        "strike": HTMLElement;
        "tt": HTMLElement;
        "xmp": HTMLPreElement;
    }

    export interface SVGElementTagNameMap {
        "a": SVGAElement;
        "animate": SVGAnimateElement;
        "animateMotion": SVGAnimateMotionElement;
        "animateTransform": SVGAnimateTransformElement;
        "circle": SVGCircleElement;
        "clipPath": SVGClipPathElement;
        "defs": SVGDefsElement;
        "desc": SVGDescElement;
        "ellipse": SVGEllipseElement;
        "feBlend": SVGFEBlendElement;
        "feColorMatrix": SVGFEColorMatrixElement;
        "feComponentTransfer": SVGFEComponentTransferElement;
        "feComposite": SVGFECompositeElement;
        "feConvolveMatrix": SVGFEConvolveMatrixElement;
        "feDiffuseLighting": SVGFEDiffuseLightingElement;
        "feDisplacementMap": SVGFEDisplacementMapElement;
        "feDistantLight": SVGFEDistantLightElement;
        "feDropShadow": SVGFEDropShadowElement;
        "feFlood": SVGFEFloodElement;
        "feFuncA": SVGFEFuncAElement;
        "feFuncB": SVGFEFuncBElement;
        "feFuncG": SVGFEFuncGElement;
        "feFuncR": SVGFEFuncRElement;
        "feGaussianBlur": SVGFEGaussianBlurElement;
        "feImage": SVGFEImageElement;
        "feMerge": SVGFEMergeElement;
        "feMergeNode": SVGFEMergeNodeElement;
        "feMorphology": SVGFEMorphologyElement;
        "feOffset": SVGFEOffsetElement;
        "fePointLight": SVGFEPointLightElement;
        "feSpecularLighting": SVGFESpecularLightingElement;
        "feSpotLight": SVGFESpotLightElement;
        "feTile": SVGFETileElement;
        "feTurbulence": SVGFETurbulenceElement;
        "filter": SVGFilterElement;
        "foreignObject": SVGForeignObjectElement;
        "g": SVGGElement;
        "image": SVGImageElement;
        "line": SVGLineElement;
        "linearGradient": SVGLinearGradientElement;
        "marker": SVGMarkerElement;
        "mask": SVGMaskElement;
        "metadata": SVGMetadataElement;
        "mpath": SVGMPathElement;
        "path": SVGPathElement;
        "pattern": SVGPatternElement;
        "polygon": SVGPolygonElement;
        "polyline": SVGPolylineElement;
        "radialGradient": SVGRadialGradientElement;
        "rect": SVGRectElement;
        "script": SVGScriptElement;
        "set": SVGSetElement;
        "stop": SVGStopElement;
        "style": SVGStyleElement;
        "svg": SVGSVGElement;
        "switch": SVGSwitchElement;
        "symbol": SVGSymbolElement;
        "text": SVGTextElement;
        "textPath": SVGTextPathElement;
        "title": SVGTitleElement;
        "tspan": SVGTSpanElement;
        "use": SVGUseElement;
        "view": SVGViewElement;
    }

    export interface MathMLElementTagNameMap {
        "a": MathMLElement;
        "annotation": MathMLElement;
        "annotation-xml": MathMLElement;
        "maction": MathMLElement;
        "math": MathMLElement;
        "merror": MathMLElement;
        "mfrac": MathMLElement;
        "mi": MathMLElement;
        "mmultiscripts": MathMLElement;
        "mn": MathMLElement;
        "mo": MathMLElement;
        "mover": MathMLElement;
        "mpadded": MathMLElement;
        "mphantom": MathMLElement;
        "mprescripts": MathMLElement;
        "mroot": MathMLElement;
        "mrow": MathMLElement;
        "ms": MathMLElement;
        "mspace": MathMLElement;
        "msqrt": MathMLElement;
        "mstyle": MathMLElement;
        "msub": MathMLElement;
        "msubsup": MathMLElement;
        "msup": MathMLElement;
        "mtable": MathMLElement;
        "mtd": MathMLElement;
        "mtext": MathMLElement;
        "mtr": MathMLElement;
        "munder": MathMLElement;
        "munderover": MathMLElement;
        "semantics": MathMLElement;
    }
}
