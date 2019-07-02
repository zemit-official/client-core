import React, {Component} from 'react';
import Icon from "./Icon";

class Alert extends Component {


	render() {

		const {className, icon, children, ...rest} = this.props;
		let cx = (className ? className + ' ' : '') + ' zm-alert zm-alert-danger mb-small-xs row-xs align-middle-xs';

		return (
			<div className={cx} {...rest}>
				<Icon name={icon} className={'ml-small-xs mr-small-xs'} />
				<div className="zm-alert-content">
					{children}
				</div>
			</div>
		);
	}
}

export default Alert;
