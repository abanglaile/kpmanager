import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input, Button, Select, Checkbox} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Option = Select.Option;

class ExerciseSample extends React.Component {

	componentDidMount(){
    	console.log(this.props.params.exercise_id);
    	if(this.props.params.exercise_id > 0){
    		//加载已有题目信息
    		this.props.getExercise(this.props.params.exercise_id);
    	}

    	this.props.checkParams();
    }

	renderSample(){
		const params = this.props.params;
		let params_rows;
		for(let key in params){
			params_rows += 
				<Row>
					<span>{key}</span>
		            <Input value={params[key]} onChange={(e) => this.props.blankInputChange(e.target.value, i)} rows={1} />
				</Row>;
		}
		return params_rows;
	}

	renderTitle(){
		return(
			<div>
				<div>{this.props.title}</div>
	            <img src={title_img_url} height="100px"/>
            </div>
		)
	}

    renderAnswer(){
    	const { choiceAnswer, blankAnswer, choiceImgAnswer, exercise_id, exercise_type } = this.props;
		var answerRow = [];
		var isDisabled = false;
		switch(exercise_type){
			//填空题
		    case 0:
		    	isDisabled = blankAnswer.length <= 1 ? true : false;
		    	answerRow = blankAnswer.map((item, i) => {
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
				isDisabled = choiceAnswer.length <=2 ? true : false;
				answerRow = choiceAnswer.map((item, i) => {
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
				answerRow = choiceImgAnswer.map((item, i) => {
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
	}
    
    render(){	
    	return(
    		<div>
    			<Row style={{marginTop: '10px'}} type = "flex">
				</Row>
				<Row>
					<Col span={12}>
						{renderSample()}
					</Col>
					<Col span={12}>
						{renderTitle()}
						{renderAnswer()}
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
  	title: newState.title,
  	title_img_url: newState.title_img_url,
    title_audio_url: newState.title_audio_url,
  	sample: newState.sample,
  }
}, action)(ExerciseSample);


