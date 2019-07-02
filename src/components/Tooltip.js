import React, {Component} from 'react';

class Tooltip extends Component {

	_tooltip = null;

	componentDidMount() {

		const {content} = this.props;

		this._tooltip = (
			<div className={'zm-tooltip'}>
				<div className={'zm-tooltip-pointer'} />
				<div className={'zm-tooltip-content'}>
					{content}
				</div>
			</div>
		);

		// const rootEl = document.createElement('div');
		// document.body.appendChild(rootEl);
		// ReactDOM.render(this._tooltip, rootEl)
	}

	componentWillUnmount() {

	}

	render() {
		const {children, className, content, ...rest} = this.props;

		let cx = (className ? className + ' ' : '') + 'zm-tooltip';

		// let tooltip = (
		// 	<div className={cx} {...rest}>
		// 		<div className={'zm-tooltip-pointer'} />
		// 		<div className={'zm-tooltip-content'}>
		// 			{content}
		// 		</div>
		// 	</div>
		// );

		return children;
	}
}

export default Tooltip;
