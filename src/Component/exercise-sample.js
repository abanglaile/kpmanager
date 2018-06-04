import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input, Button, Icon, Select, Modal, Checkbox} from 'antd';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';
import ExerciseView from './exercise-view.js'

import *as action from '../Action/';
import {connect} from 'react-redux';

const Option = Select.Option;

class ExerciseSample extends React.Component {

	constructor(props) { 
	    super(props);
	    // console.log('props.content:'+props.content);
	    this.state = {sample: {}};
  	}
	componentDidMount(){
    	console.log(this.props.params.exercise_id);
    	if(this.props.params.exercise_id > 0){
    		//加载已有题目信息
    		this.props.getSampleList(this.props.params.exercise_id);
    		this.refreshSampleKey();
    	}
    }

    refreshSampleKey(){
    	if(this.props.exercise){
			var exercise = this.props.exercise;
			switch(exercise.exercise_type){
				case 0: 
					exercise.answer = this.props.blankAnswer;
					break;
				case 1:
					exercise.answer = this.props.choiceAnswer;
					break;
				case 2:
					exercise.answer = this.props.choiceImageAnswer;
					break;	
			}

			console.log('exercise', exercise);
			this.props.getSampleKey(exercise);
		}
    }

	renderSample(){
		var {sample_list, sample_select} =  this.props;
		
		if(sample_list && sample_list[sample_select]){
			let {sample, sample_index} = sample_list[sample_select];
			const sample_key = this.props.sample_key;
			let sample_rows = [];
			console.log(sample_key);
			for(let key in sample){
				console.log(sample[key]);
				sample_rows.push(
					<div style={{ marginBottom: 16 }}>
			            <Input value={sample[key]} 
			            addonBefore={key} 
			            addonAfter={sample_key[key] ? '' : <Icon type="minus" onClick={(e) => this.props.deleteSampleField(key, sample_select)} />} 
			            onChange={(e) => this.props.sampleInputChange(e.target.value, key, sample_select)} />
					</div>
				)	
			}
			for(let key in sample_key){
				if(!sample[key]){
					sample_rows.push(
						<div style={{ marginBottom: 16 }}>
				            <Input value={sample[key]} 
				            addonBefore={key}
				            onChange={(e) => this.props.sampleInputChange(e.target.value, key, sample_select)} />
						</div>
					)
				}
			}
			return sample_rows;
		}
		
	}

	renderNewSample(){
		const sample_key = this.props.sample_key;
		let sample_rows = [];
		for(let key in sample_key){
			sample_rows.push(
				<div style={{ marginBottom: 16 }}>
		            <Input value={this.state.sample[key] ? this.state.sample[key] : ''} 
			            addonBefore={key}
			            onChange={(e) => {
			            	this.state.sample[key] = e.target.value;
			            	this.setState({samlpe: this.state.sample});
			            }}
		            />
				</div>
			);
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

		var {sample_list, sample_select} =  this.props;
		let sample = {}, exercise_sample;
		if(sample_list && sample_list[sample_select]){
			exercise_sample = sample_list[sample_select];
			sample = sample_list[sample_select].sample;
		}
		let exercise = this.props.exercise;
		exercise.answer = answer;
	
		console.log(this.props.modalVisible);
    	return(
    		<div>
    			<Row style={{marginTop: '18px'}} type = "flex">
    				<Select defaultValue={0} style={{width: '80'}} onChange={e => this.props.sampleSelect(e)}>
				      {
				      	sample_list.map((item, i) => {
				      		return <Option value={item.sample_index}>{item.sample_index}</Option>
				      	})
				      }
				    </Select>
				    <Button onClick={this.props.modalOpen}>添加样本</Button>
				</Row>
    			<Row style={{marginTop: '18px'}} type = "flex">
    				<Button onClick={this.refreshSampleKey}>检查参数</Button>
					<Button onClick={this.props.updateOneSample(exercise_sample)}>保存</Button>
				</Row>
				<Row>
					<Col span={12}>
						{this.renderSample()}
					</Col>
					<Col span={12}>
						<ExerciseView exercise={exercise} sample={sample}/>
					</Col>	
				</Row>
				<Modal title="添加样本"
		          visible={this.props.modalVisible}
		          onOk={this.props.modalCancel}
		          confirmLoading={this.props.isLoading}
		          onCancel={this.props.modalCancel}
		        >
		          {this.renderNewSample()}
		        </Modal>
    		</div>
    	);
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  return {
  	choiceAnswer: newState.choiceAnswer,
  	choiceImgAnswer: newState.choiceImgAnswer,
  	blankAnswer: newState.blankAnswer,
  	exercise: newState.exercise,
  	sample_list: newState.sample_list,
  	sample_select: newState.sample_select,
  	sample_key: newState.sample_key,
  	modalVisible: newState.modalVisible
  }
}, action)(ExerciseSample);



