import React, {Component} from 'react';
import "../styles/components/ClickableZone.scss";

class ClickableZone extends Component {

	render() {

		const {className = '', children, onClick, ...rest} = this.props;
		let cx = className + ' zm-clickable-zone row-xs align-middle-xs';

		if(onClick instanceof Function) {
			cx += ' zm-clickable-onclick';
		}

		return (
			<div className={cx} onClick={onClick} {...rest}>
				{children}
			</div>
		);
	}
}

export default ClickableZone;
