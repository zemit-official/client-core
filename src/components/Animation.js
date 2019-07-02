import React from 'react';
import {CSSTransition} from "react-transition-group";

export const ZmAnimateElement = {

	_elements: [],
	_timeouts: [],

	animate: function(element, type, callback = () => {}, duration = 300) {

		let elementIndex = this._elements.indexOf(element);

		if(elementIndex === -1) {
			this._elements.push(element);
			elementIndex = this._elements.length - 1;
		}

		if(this._timeouts[elementIndex]) {
			clearTimeout(this._timeouts[elementIndex][0]);
			clearTimeout(this._timeouts[elementIndex][1]);
		}
		else {
			this._timeouts[elementIndex] = [];
		}

		element.style.animationDuration = duration + "ms";

		element.classList.remove('zm-animation-' + type);
		this._timeouts[elementIndex][0] = setTimeout(() => {
			element.classList.add('zm-animation-' + type);
			this._timeouts[elementIndex][1] = setTimeout(() => {
				element.classList.remove('zm-animation-' + type);
				element.style.animationDuration = null;
				this._elements.splice(elementIndex, 1);
				this._timeouts.splice(elementIndex, 1);
				callback();
			}, duration);
		});
	}
};

class Animation extends React.Component {

	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			enabled: false
		};
	}

	handleOnEnter(element) {

	}

	handleOnEntering(element) {

		let duration = parseInt(this.props.duration);
		element.style.transitionDuration = (isNaN(duration) ? 300 : duration) + 'ms';

		if(this.props.animation === 'height') {
			element.style.height = (element.scrollHeight) + 'px';
		}
	}

	handleOnEntered(element) {

		if(this.props.animation === 'height') {
			element.style.height = null;
		}
	}

	handleOnExit(element) {

		if(this.props.animation === 'height') {
			element.style.height = (element.scrollHeight) + 'px';
		}
	}

	handleOnExiting(element) {
		if(this.props.animation === 'height') {
			element.style.height = null;
		}
	}

	handleOnExited(element) {

		element.style.transitionDuration = null;

		if(this.props.onExited instanceof Function) {
			this.props.onExited(element);
		}
	}

	componentWillMount() {
		this._isMounted = true;

		setTimeout(() => {
			this._isMounted && this.setState({
				enabled: this.props.enabled === true || this.props.enabled === undefined
			});
		}, this.props.delay || 0);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentWillReceiveProps(nextProps, nextContext) {

		if(nextProps.enabled !== this.props.enabled) {
			this.setState({
				enabled: nextProps.enabled === true || this.props.enabled === undefined
			});
		}
	}

	render() {

		const {className, timeout, delay, enabled, children, duration, animation, staticContext, onEnter, onEntering, onEntered, onExit, onExiting, onExitered, appear, ...rest} = this.props;
		const cx = (className ? className : '') + ` zm-transition-${animation}`;

		let content = children;
		if(animation === 'height') {
			content = (
				<div>
					<div className={'zm-animation-height-container'}>
						{children}
					</div>
				</div>
			);
		}

		return (
			<CSSTransition in={this.state.enabled}
						   onEnter={this.handleOnEnter.bind(this)}
						   onEntering={this.handleOnEntering.bind(this)}
						   onEntered={this.handleOnEntered.bind(this)}
						   onExit={this.handleOnExit.bind(this)}
						   onExiting={this.handleOnExiting.bind(this)}
						   onExited={this.handleOnExited.bind(this)}
						   timeout={duration || 300}
						   className={cx}
						   appear
						   {...rest}>
				{content}
			</CSSTransition>
		);
	}
}

export default Animation;
