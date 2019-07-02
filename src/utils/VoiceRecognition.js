import currentAppLocale from "../../../../src/locales";

export class VoiceRecognitionSettings {
	continuous = false;
	maxAlternatives = 10;
	lang = currentAppLocale.locale;
	onStartListening = () => {};
	onStopListening = () => {};

	constructor(settings) {
		Object.assign(this, settings);
	}
}

export class VoiceRecognition {

	_isListening = false;
	_instance = null;
	_commands = [];
	_defaultCommand = () => {};
	_defaultSettings = new VoiceRecognitionSettings();
	
	init(settings = this._defaultSettings) {

		let mergedSettings = {...this._defaultSettings};
		Object.assign(mergedSettings, settings);
		
		let recognition = (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition);
		if(!recognition) {
			return;
		}

		this._instance = new recognition();

		this._instance.onstart = settings.onStartListening;
		this._instance.onend = settings.onStopListening;

		this._instance.onresult = (event) => {

			const speechToText = event.results[event.results.length - 1][0].transcript;
			console.log('RECOGNITION:', speechToText);
			console.log('RECOGNITION RESULTS:', event.results);

			let commands = this.getCommands();
			for (let i = 0; i < commands.length; i++) {
				const command = commands[i];
				if(command.callback instanceof Function) {

					let commandTexts = command.text;
					if(!(command.text instanceof Array)) {
						commandTexts = [command.text];
					}

					for (let j = 0; j < commandTexts.length; j++) {
						const commandText = commandTexts[j];
						if(speechToText === commandText) {
							return command.callback(event.results);
						}
					}
				}
			}

			this._defaultCommand(speechToText, event.results);
		};

		this._instance.continuous = mergedSettings.continuous;
		this._instance.maxAlternatives = mergedSettings.maxAlternatives;
		this._instance.lang = mergedSettings.lang;
	}

	isSupported() {

		return 'SpeechRecognition' in window
			|| 'webkitSpeechRecognition' in window
			|| 'mozSpeechRecognition' in window
			|| 'msSpeechRecognition' in window;
	}

	listen() {

		if(this._instance) {
			this._instance.start();
			this._isListening = true;
		}
	}

	stop() {

		if(this._instance) {
			this._instance.stop();
		}

		this._isListening = false;
	}

	isListening() {
		return this._isListening;
	}

	setLang(lang = 'en-US') {

		if(this._instance) {
			this._instance.lang = lang;
		}
	}
	
	setCommands(commands = []) {

		this._commands = commands;
	}

	getCommands() {

		return this._commands;
	}

	setDefaultCommand(callback = () => {}) {

		this._defaultCommand = callback;
	}
}
