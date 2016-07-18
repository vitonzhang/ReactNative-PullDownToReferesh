/**
 * FetchingView, RefreshView
 */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
	View,
	Text,
	StyleSheet,
	Animated,
	TouchableHighlight,
	Dimensions,
} from 'react-native';

import GiftedSpinner from '../components/react-native-gifted-spinner/GiftedSpinner.js';

// stateless functional components.
export const KLSpinner = () => {
	
	return (
		<View>
			<GiftedSpinner />
		</View>
	);
};

export class KLFetchingView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.rowlayout}>
				<View style={styles.leftView}> 
					<GiftedSpinner />
				</View>
				<View style={styles.rightView}>
					<Text style={styles.title}>{this.props.title}</Text>
				</View>
			</View>
		);
	}

}

KLFetchingView.propTypes = {
	title: PropTypes.string,
};

KLFetchingView.defaultProps = {
	title: '',
};

/**
*  
* Props
*	`title`: Text for title.
* 	`detail`: Text for detail.
*	`type`: 
*		'willRefresh' the arrow is down-top.
*		'waiting' the arrow is top-down.
* 	`rotateArrow`[*]: 
*/
export const KLWaitingType = 'waiting';
export const KLWillRefreshType = 'willRefresh';

export class KLRefreshView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			arrowAnim: new Animated.Value(0),
		};
		// windowWidth: Dimensions.get('window').width,
		// console.log(`windowWidth: ${this.state.windowWidth}`);
	}

	componentDidUpdate(prevProps, prevState) {
		// console.log(`[VerticalArrow|componentDidUpdate()]: ${this.props.type}`);

		if (this.props.rotateArrow) {
			setTimeout(this.arrowRotation.bind(this), 5);
			// this.arrowRotation();
		}
	}

	componentDidMount() {
	}

	arrowRotation() {

		// console.log('arrowRotation');
		Animated.timing(          			// Uses easing functions
	       this.state.arrowAnim,    		// The value to drive
	       {toValue: 1, duration: 5000}		// Configuration
    	).start();
	}

	getAnimatedState() {
		return 
			[	
				styles.block,
				{
					transform:[{ 
						rotate: this.state.arrowAnim.interpolate({
							inputRange: [0, 1],
							outputRange: ['0deg', '180deg'], })
                    	}
                    ],
				}, 
			];
	}

	render() {
		
		// console.log(`[VerticalArrow|render() type: ${this.props.type}]`);

		var imageSource = require('./down_arrow.png');
		if ( this.props.type === 'willRefresh' ) { 
			imageSource = require('./up_arrow.png');
		}
		
		return (
			<View style={styles.rowlayout}>
				<View style={styles.leftView}>
					<Animated.Image style={this.getAnimatedState()} 
						source={imageSource}>
					</Animated.Image>
				</View>

				<View style={styles.rightView}>
					<Text style={styles.title}>{this.props.title}</Text>
					<Text style={styles.detail}>{this.props.detail}</Text>
				</View>
			</View>
		);
	}
}

KLRefreshView.propTypes = {
	title: PropTypes.string, 
	detail: PropTypes.string,
	type: PropTypes.string,
	rotateArrow: PropTypes.bool,   
};

KLRefreshView.defaultProps = {
	title: 'Arrow Animation',
	detail: 'Detail Information for Arrow Animation',
	type: 'willRefresh',
	rotateArrow: false,
};

const styles = StyleSheet.create({

  block: {
    width: 20,
    height: 50,
    backgroundColor: 'red',
    resizeMode: 'contain',
  },

  rowlayout:{
  	flexDirection:'row',
  },

  leftView: {
  	flex: 1,
  	alignItems: 'center',
  },

  rightView: {
  	flex: 2,
  },

  title: {
  	fontSize: 14,
  	color: '#363738',
  },

  detail: {
  	marginTop: 4,
  	fontSize: 12,
  	color: '#d3d3d3',
  }, 

  button: {
  	height: 50,
  	textAlign: 'center',
  	flex: 1,
  	marginTop: 20,
  	marginBottom: 20, 
  	backgroundColor: 'red',
  },
});

// module.exports = KLRefreshView;