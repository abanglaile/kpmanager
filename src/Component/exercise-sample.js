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
	    this.state = {exercise_sample: {}};
  	}
	// componentDidMount(){
 //    	console.log(this.props.params.exercise_id);
 //    	if(this.props.params.exercise_id > 0){
 //    		//加载已有题目信息
 //    		this.props.getSampleList(this.props.params.exercise_id);
 //    		this.props.getSampleKey(this.props.exercise);
 //    	}
 //    }

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
			            	this.state.exercise_sample.sample[key] = e.target.value;
			            	this.setState({samlpe: this.state.sample});
			            }}
		            />
				</div>
			);
		}
		return sample_rows;
	}


	renderAnswerSample(){
		var {sample_list, sample_select} =  this.props;
		console.log("sample_list[sample_select]:"+ JSON.stringify(sample_list));
		const { exercise_type } = this.props.exercise;
		var {answer} = sample_list[sample_select];
		var answerRow = [];
		var isDisabled = false;
		switch(exercise_type){
			//填空题
		    case 0:
		    	isDisabled = answer.length <= 1 ? true : false;
		    	answerRow = answer.map((item, i) => {
					return(
						<Row className="choice_row" gutter={16} type="flex" justify="space-between">
		                    <Col span={12}>
		                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.blankInputChange(e.target.value, i)} rows={1} />
		                    </Col>
		                    <Col span={12}>
		                        <Tex content={item.value} />
		                    </Col>
		                </Row>
					);
		    	});
		    	break;
			//文字选择题
			case 1:
				isDisabled = answer.length <=2 ? true : false;
				answerRow = answer.map((item, i) => {
		            return(
		                <Row className="choice_row" gutter={16} type="flex" justify="space-between">
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.props.choiceSelectChange(i)} />
		                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.choiceInputChange(e.target.value, i)} rows={1} />
		                    </Col>
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} />
		                        <Tex content={item.value} />
		                    </Col>
		                </Row>
		            );
		        });
		        break;
		    case 2:
		    	//图片选择题
				answerRow = answer.map((item, i) => {
		            return(
		                <Row gutter={16} type="flex" justify="space-between">
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.props.choiceImgSelectChange(i)} />
		                        <ImgUpload button="Option_Img" onRemove={() => this.props.choiceImgRemove(i)} onChange={file => this.props.answerImgChange(i, file.url)} />
		                    </Col>
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} />
		                        <img src={item.url} height='100' />
		                    </Col>
		                </Row>
		                );
		        });
		        break;
		    default:
		    	break;
		}
		return answerRow;
	}

	addSample(){
		var {sample_list} =  this.props;
		let exercise_sample = this.state.exercise_sample;
		exercise_sample.sample_index = sample_list.length;
		this.props.addOneSample(exercise_sample);
	}

    
    render(){
    	var answer = this.props.choiceAnswer;

		var {sample_list, sample_select} =  this.props;
		let sample = {}, exercise_sample;
		if(sample_list && sample_list[sample_select]){
			exercise_sample = sample_list[sample_select];
			sample = exercise_sample.sample;
		}
		let exercise = this.props.exercise;		
	
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
					<Button onClick={() => this.props.updateOneSample(exercise_sample)}>保存</Button>
				</Row>
				{this.renderAnswerSample()}
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
		          onOk={() => this.props.addOneSample(exercise_sample)}
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



