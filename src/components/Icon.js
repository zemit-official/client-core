import React, {Component} from 'react';
import "../styles/components/Icon.scss";
// import 'material-design-icons/iconfont/material-icons.css';

class Icon extends Component {

	render() {

		const { className = '', name, ...rest } = this.props;
		let cx = 'zm-icon material-icons md-dark ' + className;

		return (
			<i className={cx} {...rest}>
				{name}
			</i>
		);
	}
}

export default Icon;
