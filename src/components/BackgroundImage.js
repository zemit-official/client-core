import React, {Component} from 'react';
import "../styles/components/BackgroundImage.scss";
import Animation from "./Animation";

const Status = {
	DEFAULT: 'default',
	LOADING: 'loading',
	LOADED: 'loaded',
	FAILED: 'failed',
};

class BackgroundImage extends Component {

	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			status: Status.DEFAULT,
			backgroundPosition: '50% 50%'
		};
	}

	handleLoad() {

		this.setState({status: Status.LOADED});

		if(this.props.onLoaded instanceof Function) {
			this.props.onLoaded();
		}
	}

	handleError() {
		this.setState({status: Status.FAILED});
	}

	handleParallax(event) {

		if(!this._isMounted) {
			return;
		}

		let top = event.clientY * 100 / window.innerHeight;
		let left = event.clientX * 100 / window.innerWidth;

		this.setState({backgroundPosition: `${left}% ${top}%`});
	}

	componentWillMount() {
		this._isMounted = true;
	}

	componentDidMount() {

		const img = new Image();
		img.onload = this.handleLoad.bind(this);
		img.onerror = this.handleError.bind(this);
		img.src = this.props.url;

		this.setState({status: Status.LOADING});

		if(this.props.parallax) {
			window.addEventListener('mousemove', this.handleParallax.bind(this));

			//TODO: Prevent touch events from moving the background
		}
	}

	componentWillUnmount() {

		this._isMounted = false;

		window.removeEventListener('mousemove', this.handleParallax.bind(this));
	}

	render() {

		const {className, children, onLoaded, parallax, ...rest} = this.props;

		let newClassName = (className ? className + ' ' : '') + 'zm-background-image zm-background-image-'
			+ this.state.status.toLowerCase()
			+ (this.props.parallax ? ' zm-background-image-parallax' : '');

		let style = {
			backgroundPosition: this.state.backgroundPosition
		};

		if(this.state.status === Status.LOADED) {
			style.backgroundImage = 'url(' + this.props.url + ')';
		}

		return (
			<div className={newClassName} {...rest}>
				<Animation animation={'fadeIn'} enabled={this.state.status === Status.LOADED} className={'zm-background-overlay'}>
					<div style={style} />
				</Animation>
				<div className={'zm-background-content'}>
					{children}
				</div>
			</div>
		);
	}
}

export default BackgroundImage;
