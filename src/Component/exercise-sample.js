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
      this.state = {
        title_img_width: "auto",
        title_img_height: "3rem",
        answer_img_width: "auto",
      	answer_img_height: "3rem",
      };
    }

    componentDidMount(){
    	this.props.updateMenu('3');
    }

    titleImageLoaded(){
      console.log(this.title_img.width, window.innerWidth);
      if(this.title_img.width > window.innerWidth){
        this.setState({title_img_width: "90%", title_img_height: "auto"})
      }
    }

    answerImageLoaded(){
	    if(this.answer_img.width > window.innerWidth){
	      this.setState({answer_img_width: "90%", answer_img_height: "auto"})
	    }
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
			console.log("renderSample",JSON.stringify(sample));
			const sample_key = this.props.sample_key;
			console.log("rendersample_key",JSON.stringify(sample_key));
			let sample_rows = [];
			console.log(sample_key);
			for(let key in sample){
				console.log('sample[key]:',sample[key]);
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
				if(sample[key] == null){
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
	
	renderMediaTitleSample(){
		var {sample_list, sample_select} =  this.props;
		const {title_img_width, title_img_height} = this.state;
		if(sample_list && sample_list[sample_select]){
			var media_title = [];
			var {title_img_url, title_audio_url} = sample_list[sample_select];
			media_title.push(
			  <div>	
				<Row gutter={16} style={{marginTop:"15px",marginBottom:"15px"}}>
					<Col span={12}>
					  <Input 
		                  addonBefore="Title_Img"
		                  value={title_img_url} 
		                  onChange={(e) => this.props.titleSampleImgChange( e.target.value , sample_select)}
		                />  
		              </Col>
					<Col span={12}>
				    	<img src={title_img_url} height="100px"
		                  ref={element => {this.title_img = element;}}
		                  onLoad = {() => this.titleImageLoaded()} 
		                  style={{width: title_img_width, height: title_img_height}}
		                />
          			</Col>
				</Row>
	            <Row gutter={16}>
	              <Col span={12}>
	                <Input 
	                  addonBefore="Title_Audio"
	                  value={title_audio_url}
	                  onChange={(e) => this.props.titleSampleAudioChange( e.target.value , sample_select)}
	                />               
	              </Col>
	              <Col span={12}>
	                <audio src={title_audio_url} controls="controls">
	                    Your browser does not support the audio element.
	                </audio>
	              </Col>
	            </Row>
	          </div>	  
			);
			return media_title;
		}
	}


	renderAnswerSample(){
		var {sample_list, sample_select} =  this.props;
		const {answer_img_width, answer_img_height} = this.state;
		console.log("sample_list:"+ JSON.stringify(sample_list));
		console.log("sample_select:"+ sample_select);
		if(sample_list && sample_list[sample_select]){
			var {answer, exercise_type} = sample_list[sample_select];
			var answerRow = [];
			answerRow.push(
				<Row style={{marginTop: '18px',marginBottom: '10px'}} type = "flex">
					<Button icon="plus" onClick={()=>this.props.addSampleAnswer(exercise_type,sample_select)}></Button>
					<Button icon="minus" onClick={()=>this.props.delSampleAnswer(exercise_type,sample_select)}></Button>
				</Row>);
			switch(exercise_type){
				//填空题
			    case 0:
			    	answerRow.push(answer.map((item, i) => {
						return(
							<Row className="choice_row" gutter={16} type="flex" justify="space-between">
			                    <Col span={12}>
			                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.sampleAnswerChange(e.target.value, i, sample_select)} rows={1} />
			                    </Col>
			                    <Col span={12}>
			                        <Tex content={item.value} />
			                    </Col>
			                </Row>
						);
			    	}));
			    	break;
				//文字选择题
				case 1:
					answerRow.push(answer.map((item, i) => {
			            return(
			                <Row className="choice_row" gutter={16} type="flex" justify="space-between">
			                    <Col span={12}>
			                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.props.choiceSampleSelectChange(i,sample_select)} />
			                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.sampleAnswerChange(e.target.value, i, sample_select)} rows={1} />
			                    </Col>
			                    <Col span={12}>
			                        <Checkbox className="edit_choice_select" checked={item.correct} />
			                        <Tex content={item.value} />
			                    </Col>
			                </Row>
			            );
			        }));
			        break;
			    case 2:
			    	//图片选择题
					answerRow.push(answer.map((item, i) => {
			            return(
			                <Row gutter={16} type="flex" justify="space-between">
			                    <Col span={12}>
			                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.props.choiceSampleSelectChange(i,sample_select)} />
			                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.sampleAnswerChange(e.target.value, i, sample_select)} rows={1} />
			                    </Col>
			                    <Col span={12}>
			                        <Checkbox className="edit_choice_select" checked={item.correct} />
			                        <img src={item.value} ref={element => {this.answer_img = element;}} 
                    					onLoad = {() => this.answerImageLoaded()} 
                    					style={{height: answer_img_height, width: answer_img_width}}
                    				/>
			                    </Col>
			                </Row>
			                );
			        }));
					break;
				case 3://解答题
					answerRow.push(answer.map((item, i) => {
						return(
							<Row className="choice_row" gutter={16} type="flex" justify="space-between">
								<Col span={12}>
									<Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.sampleAnswerChange(e.target.value, i, sample_select)} rows={1} />
								</Col>
								<Col span={12}>
									<Tex content={item.value} />
								</Col>
							</Row>
						);
					}));
					break;
				case 4://音频题
					answerRow.push(answer.map((item, i) => {
						return(
							<Row className="choice_row" gutter={16} type="flex" justify="space-between">
								<Col span={12}>
									<Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.sampleAnswerChange(e.target.value, i, sample_select)} rows={1} />
								</Col>
								<Col span={12}>
									<Tex content={item.value} />
								</Col>
							</Row>
						);
					}));
					break;
			    default:
			    	break;
			}
			return answerRow;
		}	
	}

	
	sampleOnChange(e){
		console.log('e  :::'+e);		
		if(e == 'add'){
			var {sample_list} =  this.props;
			let {exercise_type,exercise_id} = this.props.exercise;
			if(exercise_id){
				let exercise_sample = {};
				const sample_key = this.props.sample_key;
				let sample = {};
				for(let key in sample_key){
					sample[key] = '';
				}
				console.log("sample :",JSON.stringify(sample));
				console.log("exercise_id :",exercise_id);
				if(exercise_type == 1 || exercise_type == 2){
					exercise_sample = {
						sample : JSON.stringify(sample),
						exercise_id : exercise_id,
						sample_index : sample_list.length ,
						exercise_type : exercise_type,
						answer : JSON.stringify([
				            {value: '', correct: false}, 
				            {value: '', correct: false},
				            {value: '', correct: false},
				            {value: '', correct: false}
				        ]),
				        title_img_url : '',
						title_audio_url : '',
					}
				}else if(exercise_type == 0){
					exercise_sample = {
						sample : JSON.stringify(sample),
						exercise_id : exercise_id,
						sample_index : sample_list.length ,
						exercise_type : exercise_type,
						answer : JSON.stringify([{value: ''}]),
						title_img_url : '',
						title_audio_url : '',
					}
				}
				// console.log("exercise_sample :",JSON.stringify(exercise_sample));
				// this.props.addInSampleList(exercise_sample);
				this.props.sampleSelect(sample_list.length);
				this.props.addOneSample(exercise_sample);
			}else{
				alert("请先提交题干部分！");
			}		
		}else{
			this.props.sampleSelect(e);
		}
	}


    
    render(){
		var {sample_list, sample_select} =  this.props;
		let sample = {}, exercise_sample;
		console.log("sample_list:   ",sample_list);
		console.log("sample_list.length:   ",sample_list.length);
		if(sample_list && sample_list[sample_select]){
			exercise_sample = sample_list[sample_select];
			sample = exercise_sample.sample;
		}
		let exercise = this.props.exercise;		
	

    	return(
    		<div>
    			<Row style={{marginTop: '18px'}} type = "flex">
    				<Select 
    					value={sample_list[sample_select] ? sample_list[sample_select].sample_index : ''} 
    					style={{width: '80'}} 
    					onChange={e => this.sampleOnChange(e)}
    				>
				      {
				      	sample_list.map((item, i) => {
				      		return <Option value={item.sample_index}>{item.sample_index}</Option>
				      	})
				      }
				      <Option value='add'>添加样本</Option>
				    </Select>
				</Row>
    			<Row style={{marginTop: '18px'}} type = "flex">
    				<Button onClick={() => this.props.getSampleKey(exercise)}>检查参数</Button>
					<Button onClick={() => this.props.updateOneSample(exercise_sample)}>保存</Button>
				</Row>
				{this.renderMediaTitleSample()}
				{this.renderAnswerSample()}
				<Row gutter={16} style={{marginTop:"20px"}} >
					<Col span={12}>
						{this.renderSample()}
					</Col>
					<Col span={12}>
						<ExerciseView exercise={exercise} exercise_sample={exercise_sample}/>
					</Col>	
				</Row>
				<Modal>
		        </Modal>
    		</div>
    	);
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  return {
  	exercise: newState.exercise,
  	sample_list: newState.sample_list,
  	sample_select: newState.sample_select,
  	sample_key: newState.sample_key,
  	modalVisible: newState.modalVisible
  }
}, action)(ExerciseSample);



