import React, {Component} from 'react';
import Icon from "./Icon";
import beep from "../assets/sounds/microphone-beep.wav";
import "../styles/components/VoiceRecognitionIcon.scss";
import {Sound} from "../../util/zemit/Sound";

class VoiceRecognitionIcon extends Component {

	_audioContext = null;
	_audioContextActive = false;
	_analyser = null;
	_microphone = null;
	_javascriptNode = null;
	_sound = null;

	constructor(props) {
		super(props);

		this.bubbleRef = React.createRef();
	}

	componentDidMount() {

		this._sound = new Sound();
		this._sound.register('microphone-beep', beep);
	}

	listenToVolume() {

		this._sound.play('microphone-beep');

		navigator.mediaDevices.getUserMedia({
			audio: true
		}).then(stream => {

			this._audioContext = new AudioContext();
			this._analyser = this._audioContext.createAnalyser();
			this._microphone = this._audioContext.createMediaStreamSource(stream);
			this._javascriptNode = this._audioContext.createScriptProcessor(2048, 1, 1);

			this._audioContextActive = true;

			this._analyser.smoothingTimeConstant = 0.8;
			this._analyser.fftSize = 1024;

			this._microphone.connect(this._analyser);
			this._analyser.connect(this._javascriptNode);
			this._javascriptNode.connect(this._audioContext.destination);
			this._javascriptNode.onaudioprocess = () => {
				let array = new Uint8Array(this._analyser.frequencyBinCount);
				this._analyser.getByteFrequencyData(array);

				let values = 0;

				let length = array.length;
				for (let i = 0; i < length; i++) {
					values += (array[i]);
				}

				let average = values / length;
				let scale = (Math.round(average) / 150);
				let opacity = Math.round(average) / 100;

				if(this.bubbleRef.current && average < 5) {
					this.bubbleRef.current.classList.remove('volume');
					this.bubbleRef.current.style.opacity = null;
					this.bubbleRef.current.style.transform = null;
				}
				else if(this.bubbleRef.current) {
					this.bubbleRef.current.classList.add('volume');
					this.bubbleRef.current.style.opacity = opacity;
					this.bubbleRef.current.style.transform = 'scale(' + scale + ')';
				}

				console.log(average, scale, values, length);
			}
		})
		.catch(function(err) {
			this.stopListeningToVolume();
			this.listenToVolume();
		});
	}

	stopListeningToVolume() {

		if(this._audioContextActive) {

			this._audioContext && this._audioContext.close();
			this._analyser && this._analyser.disconnect();
			this._microphone && this._microphone.disconnect();
			this._javascriptNode && this._javascriptNode.disconnect();

			setTimeout(() => {
				this.bubbleRef.current.classList.remove('volume');
				this.bubbleRef.current.style.opacity = null;
				this.bubbleRef.current.style.transform = null;
			});

			this._audioContextActive = false;
		}
	}

	componentWillUpdate(nextProps, nextState, nextContext) {

		if(this.props.isListening === nextProps.isListening) {
			return;
		}

		if(nextProps.isListening) {
			this.listenToVolume();
		}
		else {
			this.stopListeningToVolume();
		}
	}

	render({children, isListening, className = '', ...rest} = this.props) {

		let cx = className + ' zm-voice-recognition-icon ' + (
			isListening
				? 'is-listening'
				: 'is-stopped'
		);

		return (
			<div className={cx} {...rest}>
				<Icon name={isListening === false ? 'mic_none' : 'mic'} />
				<div className={'bubble'} ref={this.bubbleRef} />
				{children}
			</div>
		);
	}
}

export default VoiceRecognitionIcon;
