import React, {Component} from 'react';
import '../styles/components/ProgressBar.scss';
import Rainbow from 'rainbowvis.js';

class ProgressBar extends Component {

	render() {

		const {className, children, percent, hexColor, colorClass, colors, ...rest} = this.props;

		let cx = (className ? className + ' ' : '') + 'zm-progress-bar';
		let cxPercent = 'zm-progress-bar-percent';
		let style = {
			width: percent + '%'
		};

		if(hexColor) {
			style.backgroundColor = hexColor;
		}
		else if(colorClass) {
			cxPercent += ' ' + colorClass;
		}
		else if(colors instanceof Array) {

			var rainbow = new Rainbow();
			rainbow.setNumberRange(1, 100);
			rainbow.setSpectrum(...colors);

			style.backgroundColor = '#' + rainbow.colourAt(Math.round(percent));
		}
		else {
			cxPercent += ' default';
		}

		if(percent === 0) {
			cx += ' empty';
		}

		if(percent === 100) {
			cx += ' complete';
		}

		return (
			<div className={cx} {...rest}>
				<div className={cxPercent} style={style}>
					{children}
				</div>
			</div>
		);
	}
}

export default ProgressBar;
