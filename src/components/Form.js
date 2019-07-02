import React from 'react';
import * as ReactDOM from "react-dom";
import {ZmAnimateElement} from "./Animation";
import "../styles/components/Form.scss";
import Error from "../../util/zemit/Error";

class Form extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			isLoaded: false,
			hasError: false,
			data: null,
			error: null
		};

		this.formRef = React.createRef();
	}

	hasError() {
		return this.state.hasError;
	}

	getAllInputs() {

		const {children} = this.props;

		let inputs = [];
		let search = (children) => {
			React.Children.forEach(children, element => {

				switch(element.type.displayName) {
					case 'Input':
						inputs.push(element);
						break;
					default:
						break;
				}

				if(element.props.children && element.props.children.length > 0) {
					inputs.concat(search(element.props.children));
				}
			});
		};

		search(children);

		return inputs;
	}

	getComponent(element) {

		let key = Object.keys(element).find(key=>key.startsWith("__reactInternalInstance$"));
		let internalInstance = element[key];
		if (internalInstance == null) return null;

		// react 16+
		if (internalInstance.return) {
			return internalInstance._debugOwner
				? internalInstance._debugOwner.stateNode
				: internalInstance.return.stateNode;
		}
		// react <16
		else {
			return internalInstance._currentElement._owner._instance;
		}
	}

	submit(callback = () => {}) {

		this.setState({
			hasError: false
		});

		let firstError = null;
		let dataToSend = {};
		let formData = new FormData();
		let node = ReactDOM.findDOMNode(this);
		let inputs = node.querySelectorAll('.zm-input');
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];

			let component = this.getComponent(input);
			let ref = component.inputRef.current;
			let name = ref.getAttribute('name');
			component.updateValidation();

			if(component.hasError()) {
				component._hasBlurred = true;

				if(!firstError) {
					firstError = component;
				}
			}

			dataToSend[name] = component.state.value;
			formData.append(name, component.state.value);
		}

		if(firstError) {

			firstError.inputRef.current.scrollIntoView({
				behavior: 'smooth'
			});

			setTimeout(() => {
				ZmAnimateElement.animate(firstError.containerRef.current, 'zoom');
			}, 300);

			firstError.inputRef.current.focus();

			this.setState({
				hasError: true
			});

			callback(false);
		}
		else {

			this.setState({
				isLoading: true,
				isLoaded: false
			});

			let {url, method = 'POST'} = this.props;

			fetch(url, {
				method: method,
				body: JSON.stringify(dataToSend),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
			})
				.then(res => {
					if(res.ok) {
						return res.json();
					}
					else {
						throw new Error(res);
					}
				})
				.then(result => {

					this.setState({
						isLoaded: true,
						isLoading: false,
						hasError: false,
						data: result
					});

					callback(result);

				}).catch( async error => {

					const content = await error.getMessage().json();

					this.setState({
						isLoaded: true,
						isLoading: false,
						hasError: true,
						error: content.error
					});

					this.formRef.current.scrollIntoView({
						behavior: 'smooth'
					});

					callback(content);
				});
		}
	}

	render({children, className = '', url, method = 'POST', ...rest} = this.props) {

		let cx = className + ' zm-form';

		if(this.state.isLoading) {
			cx += ' is-loading';
		}

		return (
			<form className={cx} ref={this.formRef} action={url} method={method} {...rest}>
				{children}
			</form>
		);
	}
}

export default Form;
