import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input, Button, Select, Checkbox} from 'antd';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';
import ExerciseView from './exercise-view.js'

import *as action from '../Action/';
import {connect} from 'react-redux';

const Option = Select.Option;

class ExerciseSample extends React.Component {

	renderSample(){
		var {sample_list, sample_select} =  this.props;
		sample_select = 0;
		console.log(sample_list);
		if(sample_list && sample_list[sample_select]){
			let {sample, sample_index} = sample_list[sample_select];
			const sample_key = this.props.sample_key;
			let sample_rows = [];
			sample = JSON.parse(sample);
			for(let key in sample){
				console.log(sample[key]);
				sample_rows.push(
					<div style={{ marginBottom: 16 }}>
			            <Input value={sample[key]} addonBefore={key} onChange={(e) => this.props.sampleInputChange(e.target.value, i)} />
					</div>
				)	
			}
			for(let key in sample_key){
				if(!sample[key]){
					sample_rows.push(
						<div style={{ marginBottom: 16 }}>
			            	<Input value={sample[key]} addonBefore={key} addonAfter={<Icon type="setting" />} onChange={(e) => this.props.sampleInputChange(e.target.value, i)} />
						</div>
					)
				}
			}
			return sample_rows;
		}
		
	}
    
    render(){
    	var answer = this.props.choiceAnswer;
    	switch(this.props.exercise_type){
    		case 0:
    			answer = this.props.blankAnswer;
    			break;
    		case 1:
    			answer = this.props.choiceAnswer;
    			break;
    		case 2:
    			answer = this.props.choiceImgAnswer;
    			break;
    	}

		var {sample_list, sample_select} =  this.props;
		let sample = {};
		if(sample_list && sample_list[sample_select]){
			sample = JSON.parse(sample_list[sample_select].sample);
		}
		
    	var exercise = {
    		exercise_id: this.props.exercise_id,
    		exercise_type: this.props.exercise_type,
    		title: this.props.title,
			title_img_url: this.props.title_img_url,
    		title_audio_url: this.props.title_audio_url,
    		answer: answer,
    		breakdown: this.props.breakdown, 
    		sample: sample,
    	}	
    	return(
    		<div>
    			<Row style={{marginTop: '10px'}} type = "flex">
				</Row>
				<Row>
					<Col span={12}>
						{this.renderSample()}
					</Col>
					<Col span={12}>
						<ExerciseView exercise={exercise} />
					</Col>	
				</Row>
    		</div>
    	);
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  return {
  	exercise_id: newState.exercise_id,
  	exercise_type: newState.exercise_type,
  	choiceAnswer: newState.choiceAnswer,
  	choiceImgAnswer: newState.choiceImgAnswer,
  	blankAnswer: newState.blankAnswer,
  	choiceImgAnswer: newState.choiceImgAnswer,
  	title: newState.title,
  	title_img_url: newState.title_img_url,
    title_audio_url: newState.title_audio_url,
  	sample_list: newState.sample_list,
  	sample_select: newState.sample_select,
	breakdown: newState.breakdown,
  	sample_key: newState.sample_key,
  }
}, action)(ExerciseSample);



