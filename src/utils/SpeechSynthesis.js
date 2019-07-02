import currentAppLocale from "../../../../src/locales";

export class SpeechSynthesisSettings {

	lang = currentAppLocale.locale;
	onBeforeStart = () => {

	};
	onEnd = () => {

	};

	constructor(settings) {
		Object.assign(this, settings);
	}
}

export class SpeechSynthesis {

	_voices = [];
	_instance = window.speechSynthesis;
	_settings = new SpeechSynthesisSettings();

	init() {

		let loadVoices = () => {
			this._voices = this.getVoices();
		};

		this._instance.onvoiceschanged = loadVoices;
	}

	isSupported() {
		return 'speechSynthesis' in window;
	}

	getVoices() {
		return this._instance.getVoices();
	}

	getSettings() {
		return this._settings;
	}

	setSettings(settings) {
		Object.assign(this._settings, settings);
	}

	read(text, settings = this._settings) {

		let mergedSettings = new SpeechSynthesisSettings();
		Object.assign(mergedSettings, settings);

		// Create a new instance of SpeechSynthesisUtterance.
		var msg = new SpeechSynthesisUtterance();

		// Set the text.
		msg.text = text;

		// Set the attributes.
		msg.volume = 1;
		msg.rate = 1;
		msg.pitch = 1;

		// If a voice has been selected, find the voice and set the
		// utterance instance's voice attribute.
		msg.voice = this._voices.find(voice => {
			return voice.lang === mergedSettings.lang;
		});

		msg.onend = mergedSettings.onEnd;

		mergedSettings.onBeforeStart();

		// Queue this utterance.
		this._instance.cancel();
		this._instance.speak(msg);
	}
}
