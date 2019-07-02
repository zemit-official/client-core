import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {TITLE_PREFIX, TITLE_SUFFIX} from "../../../../src/constants";
import Animation from "./Animation";

class Page extends React.Component {

	static defaultProps = {
		title: 'Untitled'
	};

	static propTypes = {
		children: PropTypes.node.isRequired
	};

	constructor(props) {
		super(props);

		this.slug = props.match.path.toLowerCase()
									.replace(/[^\w ]+/g,'')
									.replace(/ +/g,'-')
	}

	componentDidMount() {
		document.documentElement.classList.add('route-' + this.slug);
		document.title = TITLE_PREFIX + this.props.title + TITLE_SUFFIX;
	}

	componentWillUnmount() {
		document.documentElement.classList.remove('route-' + this.slug);
	}

	render() {

		const {className = '', history, location, match, ...rest} = this.props;

		let cx = className + ' h-100-xs p-large-lg pb-none-lg p-medium-xs pb-none-xs page';
		if(this.props.state && this.props.state.prev) {
			cx += ' page--prev';
		}

		return (
			<Animation {...rest} className={cx} enabled={true} animation={'fadeIn'}>
				<section>
					{this.props.children}
				</section>
			</Animation>
		)
	}
}

export default withRouter(Page);
