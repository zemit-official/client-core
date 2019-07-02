export class Shortcut {

	_list = {};
	_callbacks = {};

	// http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
	_specialKeys = {
		'esc': 27,
		'tab': 9,
		'space': 32,
		'enter': 13,
		'backspace': 8,

		'scrolllock': 145,
		'capslock': 20,
		'numlock': 144,

		'pause': 19,
		'break': 19,

		'insert': 45,
		'home': 36,
		'delete': 46,
		'end': 35,

		'pageup': 33,
		'pagedown': 34,

		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,

		'f1': 112,
		'f2': 113,
		'f3': 114,
		'f4': 115,
		'f5': 116,
		'f6': 117,
		'f7': 118,
		'f8': 119,
		'f9': 120,
		'f10': 121,
		'f11': 122,
		'f12': 123,
	};

	_attachEvent = event => {

		let inputTags = ['INPUT', 'TEXTAREA'];
		let tagName = event.target.tagName.toUpperCase();

		let isInInput = inputTags.indexOf(tagName) !== -1
			|| event.target.getAttribute('contenteditable') !== null;

		if(!event.altKey && isInInput) {
			return;
		}

		let keys = this.eventToKeys(event);
		this.run(keys, event);
	};

	attach(rootElement) {

		this._rootElement = rootElement;
		this._rootElement.addEventListener('keydown', this._attachEvent);
	}

	detach() {
		this._rootElement.removeEventListener('keydown', this._attachEvent);
	}

	eventToKeys(event) {

		let result = (event.ctrlKey || event.metaKey) ? 'ctrl+' : '';
		result += event.altKey ? 'alt+' : '';
		result += event.shiftKey ? 'shift+' : '';

		let specialKey = Object.keys(this._specialKeys).find(key => {
			return this._specialKeys[key] === event.which
		});

		result += specialKey ? specialKey : event.which;
		result = result.toLowerCase();

		if(result.endsWith('+')) {
			result = result.substr(0, result.length - 1);
		}

		return result;
	}

	reorderKeys(keys) {

		let splittedKeys = keys.split('+');
		let lastKey = splittedKeys[splittedKeys.length - 1];
		let reorderedKeys = splittedKeys.indexOf('ctrl') !== -1 ? 'ctrl+' : '';
		reorderedKeys += splittedKeys.indexOf('alt') !== -1 ? 'alt+' : '';
		reorderedKeys += splittedKeys.indexOf('shift') !== -1 ? 'shift+' : '';
		reorderedKeys += ['ctrl', 'alt', 'shift'].indexOf(lastKey) === -1
			? lastKey.length === 1 ? lastKey.toUpperCase().charCodeAt(0) : lastKey
			: '';

		reorderedKeys = reorderedKeys.toLowerCase();

		if(reorderedKeys.endsWith('+')) {
			reorderedKeys = reorderedKeys.substr(0, reorderedKeys.length - 1);
		}

		return reorderedKeys;
	}

	get(name) {

		let listKeys = Object.keys(this._list);
		for(let i = 0; i < listKeys.length; i++) {
			let keys = this._list[listKeys[i]];
			for(let y = 0; y < keys.length; y++) {
				if(keys[y].name === name) {
					return keys[y];
				}
			}
		}

		return null;
	}

	getKeysByName(name, prettify = false) {

		let shortcut = this.get(name);
		if(shortcut) {

			let keys = shortcut.originalKeys;
			if(prettify) {

				keys = keys.toUpperCase();
				keys = keys.replace('+', ' + ');
			}

			return keys;
		}

		return null;
	}

	add(name, keys, callback) {

		let originalKeys = keys;

		keys = keys.toLowerCase();
		keys = this.reorderKeys(keys);

		if(!this._list[keys]) {
			this._list[keys] = [];
		}

		this._list[keys].push({
			name: name,
			keys: keys,
			originalKeys: originalKeys,
			callback: callback
		});

		this._callbacks[callback] = {
			keys: keys,
			index: this._list[keys].length - 1
		};
	}

	remove(callback) {

		let info = this._callbacks[callback];
		if(info) {
			delete this._callbacks[callback];
			this._list[info.keys].splice(info.index, 1);
		}
	}

	run(keys, event) {

		keys = keys.toLowerCase();
		keys = this.reorderKeys(keys);

		if(!this._list[keys]) {
			return;
		}

		this._list[keys].forEach(shortcut => {
			shortcut.callback(event);
		});
	}
}
