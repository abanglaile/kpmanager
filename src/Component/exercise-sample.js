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
		var {sample_list, sample_index} =  this.props;

		sample_index=0;
		sample_list = [{}]
		const sample = sample_index && sample_list ? sample_list[sample_index] : {};
		const sample_key = this.props.sample_key;
		let sample_rows = [];
		for(let key in sample){
			sample_rows += 
				<Row>
					<span>{key}</span>
		            <Input value={sample[key]} onChange={(e) => this.props.sampleInputChange(e.target.value, i)} rows={1} />

				</Row>;
		}
		for(let key in sample_key){
			if(!sample[key]){
				sample_rows += 
				<Row>
					<span>{key}</span>
		            <Input value={sample_key[key]} onChange={(e) => this.props.sampleInputChange(e.target.value, i)} rows={1} />

				</Row>;
			}
		}
		return sample_rows;
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

    	var exercise = {
    		exercise_id: this.props.exercise_id,
    		exercise_type: this.props.exercise_type,
    		title: this.props.title,
			title_img_url: this.props.title_img_url,
    		title_audio_url: this.props.title_audio_url,
    		answer: answer,
    		breakdown: this.props.breakdown, 
    		sample: this.props.sample,
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
  	sample_index: newState.sample_index,
	breakdown: newState.breakdown,
  	sample_key: newState.sample_key,
  }
}, action)(ExerciseSample);



