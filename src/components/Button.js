import React, {Component} from 'react';
import "../styles/components/Button.scss";

class Button extends Component {

	constructor(props) {
		super(props);

		this.state = {
			innerStyle: {}
		};

		this.buttonRef = React.createRef();
		this.rippleRef = React.createRef();
	}

	handleClick(event) {

		let rect = event.currentTarget.getBoundingClientRect();

		this.setState({innerStyle: {
			top: event.clientY - rect.top,
			left: event.clientX - rect.left
		}});

		this.buttonRef.current.classList.remove('animate');
		setTimeout(() => {
			this.buttonRef.current.classList.add('animate');
		});
	}

	render({children, className = '', ...rest} = this.props) {

		let cx = className + ' zm-button';

		return (
			<button ref={this.buttonRef} className={cx} {...rest}>
				<div className="container" onClick={this.handleClick.bind(this)}>
					<div className="ripple" ref={this.rippleRef} style={this.state.innerStyle} />
					<div className="inner">
						{children}
					</div>
				</div>
			</button>
		);
	}
}

export default Button;
