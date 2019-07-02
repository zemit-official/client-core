import React, {Component} from 'react';
import "../styles/components/Loader.scss";
import Animation from "./Animation";

export const ZmLoaderTheme = {
	LIGHT: 'light',
	DARK: 'dark'
};

class Loader extends Component {
	render() {

		const {animation, enabled, visible, className, theme, ...rest} = this.props;
		let cx = (className ? className + ' ' : '') + 'zm-loader row-xs align-middle-xs content-center-xs';

		if(theme === ZmLoaderTheme.DARK) {
			cx += ' zm-loader-dark';
		}

		return (
			<Animation enabled={visible} animation={'fadeIn'} className={cx} {...rest} mountOnEnter unmountOnExit>
				<div>
					<div className={'zm-loader-content'}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</Animation>
		);
	}
}

export default Loader;
