import React, {Component} from 'react';
import "../styles/components/Input.scss";
import ClickableZone from "./ClickableZone";
import Icon from "./Icon";
import Animation from "./Animation";
import {getScoreRange, calculateScore, PasswordStrength, calculateBits} from "../../util/zemit/Password";
import {Validation} from "../../util/zemit/Validation";
import ProgressBar from "./ProgressBar";
import {VoiceRecognition, VoiceRecognitionSettings} from "../../util/zemit/VoiceRecognition";
import VoiceRecognitionIcon from "./VoiceRecognitionIcon";

class Input extends Component {

	_isPristine = true;
	_isBlurredPristine = true;
	_isSame = true;
	_hasFocused = false;
	_hasBlurred = false;
	_blurTimeout = null;
	_originalValue = null;
	_errorMessages = [];
	_totalErrorMessages = 0;
	_errorMessagesRendered = [];

	constructor(props) {
		super(props);

		this.state = {
			value: null,
			focused: false,
			type: this.props.type,
			passwordStrength: 0,
			passwordStrengthRange: PasswordStrength.BAD,
			voiceRecognitionIsListening: false
		};

		this.containerRef = React.createRef();
		this.inputRef = React.createRef();
	}

	hasError() {

		return this._totalErrorMessages > 0;
	}

	reset() {

		this.updateValue(null);
		this.updateValidation();
		this._isPristine = true;
		this._isBlurredPristine = true;
		this._isSame = true;
		this._hasFocused = false;
		this._hasBlurred = false;
	}

	clearErrorMessages() {
		this._errorMessages = [];
	}

	updateValidation() {

		const { validation } = this.props;

		let validations = validation;
		if(!(validation instanceof Array)) {
			validations = [validation];
		}

		let totalErrorMessages = 0;
		this._errorMessagesRendered = [];

		// Reset error messages
		Object.keys(this._errorMessages).map(message => {
			this._errorMessages[message] = false;
			return message;
		});

		if(validations.length > 0) {
			validations.forEach(validation => {
				if(validation instanceof Validation) {

					validation.setValue(this.inputRef.current.value);
					let isValid = validation.isValid();

					let errorMessages = validation.getRenderedErrorMessages();

					if(errorMessages.length > 0) {
						errorMessages.forEach((message) => {
							this._errorMessages[message] = true;
							totalErrorMessages++;
						});
					}
				}
			});
		}

		Object.keys(this._errorMessages).map((message, key) => {
			let isVisible = this._errorMessages[message];
			this._errorMessagesRendered.push(
				<li key={key}>
					<Animation enabled={isVisible} animation={'height'}>
						<span>{message}</span>
					</Animation>
				</li>
			);
			return message;
		});

		this._totalErrorMessages = totalErrorMessages;
	}

	updateValue(value = null) {

		let state = {
			value: value,
		};

		if(this.props.strength) {
			state.passwordStrength = calculateScore(value);
			state.passwordStrengthRange = getScoreRange(state.passwordStrength);
			state.calculateBits = calculateBits(value);
		}

		this.inputRef.current.value = value;

		if(value !== this._originalValue) {
			this._isPristine = false;
		}

		if(!this._isBlurredPristine) {
			this.updateValidation();
		}

		this.setState(state);
	}

	updateSelection(value) {

		let start = this.inputRef.current.selectionStart;
		let finish = this.inputRef.current.selectionEnd;
		let allText = this.inputRef.current.value;
		let newValue = allText.substring(0, start)
			+ value
			+ allText.substring(finish, allText.length);

		this.updateValue(newValue);

		this.inputRef.current.setSelectionRange(finish + value.length, finish + value.length);
		this.inputRef.current.focus();
		this.inputRef.current.scrollLeft = this.inputRef.current.scrollWidth;
	}

	initVoiceRecognition(settings) {

		this._voiceRegognition = new VoiceRecognition();

		this._voiceRegognition.setDefaultCommand((speechToText) => {
			this.updateSelection(speechToText);
		});

		let overridedSettings = {...settings};
		overridedSettings.continuous = true;

		overridedSettings.onStartListening = () => {
			this.setState({
				voiceRecognitionIsListening: true
			});
			settings.onStartListening();
		};
		overridedSettings.onStopListening = () => {
			this.setState({
				voiceRecognitionIsListening: false
			});
			settings.onStopListening();
		};

		this._voiceRegognition.init(overridedSettings);
	}

	handleVoiceRecognition() {

		if(this._voiceRegognition.isListening()) {
			this._voiceRegognition.stop();
		}
		else {
			this._voiceRegognition.listen();
		}

		this.inputRef.current.focus();
	}

	handleToggleShowPassword(event) {

		this.setState({
			type: this.state.type === 'text' ? 'password' : 'text'
		});

		this.inputRef.current.focus();
	}

	handleClearTextInput(event) {

		this.updateValue(null);
		this.inputRef.current.focus();
	}

	handleSetFocus(event) {

		this.updateValue(this.state.value);
		this.inputRef.current.focus();
	}

	handleOnKeyUp(event) {

		this.updateValue(event.target.value);
	}

	handleFocus(event, skipFocus = false) {

		if(skipFocus) {
			return;
		}

		this._hasFocused = true;

		this.setState({
			focused: true
		});
	}

	handleBlur(event, skipBlur = false) {

		if(skipBlur) {
			return;
		}

		if(event.target.value !== this._originalValue) {
			this._isBlurredPristine = false;
		}

		this._blurTimeout = null;
		this._hasBlurred = true;

		let state = {
			value: event.target.value,
			focused: false
		};

		this.setState(state);
	}

	handlePaste(event) {

		this._isPristine = false;

		setTimeout(() => {
			this.updateValue(this.inputRef.current.value);
		});
	}

	bindEvents() {
		this.inputRef.current.addEventListener('keyup', this.handleOnKeyUp.bind(this));
		this.inputRef.current.addEventListener('focus', this.handleFocus.bind(this));
		this.inputRef.current.addEventListener('blur', this.handleBlur.bind(this));
	}

	unbindEvents() {
		this.inputRef.current.removeEventListener('keyup', this.handleOnKeyUp.bind(this));
		this.inputRef.current.removeEventListener('focus', this.handleFocus.bind(this));
		this.inputRef.current.removeEventListener('blur', this.handleBlur.bind(this));
	}

	componentWillUpdate(nextProps, nextState, nextContext) {

		this._isSame = this._originalValue === this.inputRef.current.value;
	}

	componentDidMount({autoFocus, voiceRecognition} = this.props) {

		this.bindEvents();
		this._originalValue = this.inputRef.current.value;

		if(autoFocus) {
			this.inputRef.current.focus();
		}

		if(voiceRecognition instanceof VoiceRecognitionSettings) {
			this.initVoiceRecognition(voiceRecognition);
		}
	}

	componentWillUnmount() {
		this.unbindEvents();
	}

	render() {

		const {name, icon, label, type, strength, disabled, showViewPasswordButton, showClearButton, voiceRecognition, validation, onPaste, ...rest} = this.props;

		let showClearButtonTag = showClearButton !== false && !!this.state.value;
		let showPasswordTag = showViewPasswordButton !== false && this.props.type === 'password' && !!this.state.value;
		let showVoiceRecognition = !disabled && voiceRecognition instanceof VoiceRecognitionSettings && this._voiceRegognition && this._voiceRegognition.isSupported();
		let cx = 'zm-input';
		cx += ' validation-' + (this._totalErrorMessages === 0 ? 'success' : 'error');

		if(this.state.focused) {
			cx += ' zm-focus';
		}

		if(!this._isBlurredPristine) {
			this.updateValidation();
		}

		return (
			<div className={cx} ref={this.containerRef}>
				<div className={'zm-input-content row-xs align-stretch-xs animated-flex-xs'}>
					<Animation enabled={!!icon} animation={'scaleIn'} className={'row-xs align-middle-xs zm-input-icon'} onClick={this.handleSetFocus.bind(this)} mountOnEnter unmountOnExit>
						<span>
							<Icon name={icon} />
						</span>
					</Animation>

					<Animation enabled={!!label} animation={'scaleIn'} className={'align-self-middle-xs zm-input-label'} onClick={this.handleSetFocus.bind(this)} mountOnEnter unmountOnExit>
						<label>{label}</label>
					</Animation>

					<input ref={this.inputRef} type={this.state.type} onPaste={this.handlePaste.bind(this)} disabled={disabled} name={name} {...rest} />

					<Animation enabled={showPasswordTag} animation={'scaleIn'} className="row-xs" mountOnEnter unmountOnExit>
						<ClickableZone onClick={this.handleToggleShowPassword.bind(this)}>
							<Icon name={this.state.type === 'password' ? 'visibility' : 'visibility_off'} />
						</ClickableZone>
					</Animation>

					<Animation enabled={showClearButtonTag} animation={'scaleIn'} className="row-xs" mountOnEnter unmountOnExit>
						<ClickableZone onClick={this.handleClearTextInput.bind(this)}>
							<Icon name="remove_circle_outline" />
						</ClickableZone>
					</Animation>

					<Animation enabled={showVoiceRecognition} animation={'scaleIn'} className={'row-xs voice-recognition-button'} mountOnEnter unmountOnExit>
						<ClickableZone onClick={this.handleVoiceRecognition.bind(this)}>
							<VoiceRecognitionIcon isListening={this.state.voiceRecognitionIsListening} />
						</ClickableZone>
					</Animation>
				</div>

				<Animation enabled={strength === true && !!this.state.value} animation={'height'} className={'password-strength'} mountOnEnter unmountOnExit>
					<ProgressBar percent={this.state.passwordStrength} colors={['FF1E00', '072FBE', 'B5BF23']}>
						{this.state.calculateBits} bit{this.state.calculateBits > 0 ? 's' : ''}
					</ProgressBar>
				</Animation>

				<Animation enabled={this._totalErrorMessages > 0} animation={'height'} className={'zm-validation-msg'} onExited={this.clearErrorMessages.bind(this)} mountOnEnter unmountOnExit>
					<div className="row-xs align-middle-xs">
						<Icon name={'error'} />
						<ul>
							{this._errorMessagesRendered}
						</ul>
					</div>
				</Animation>
			</div>
		);
	}
}

export default Input;
