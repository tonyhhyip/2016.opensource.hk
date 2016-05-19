import { Component } from 'react';

/**
 * This class is designed to solve issue #16
 */
export default class TicketButton extends Component {

	constructor(props) {
		super(props);
		this.state = {display: false};
		var self = this;
		$(window).resize(function () {
			self.decideToShow()
		});
	}

	render() {
		let status = this.state.display ? 'inline-block' : 'none';
		return (
			<a className="btn btn-lg btn-hkosc" style={{ 'display': status }}>
				Get Your Ticket
			</a>
		);
	}

	decideToShow() {
		if (screen.width < 762) {
			this.display()
		} else {
			this.hide()
		}
	}

	componentDidMount() {
		this.decideToShow();
	}

	display() {
		this.setState({display: true});
	}

	hide() {
		this.setState({display: false});
	}

}