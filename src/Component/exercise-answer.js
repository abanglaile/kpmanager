import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Input, Button, Select, Checkbox} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';
// import Tex from './tex.js';

import ImgUpload from './upload-qiniu.js';
import *as action from '../Action/';
import {connect} from 'react-redux';
// import {InlineMath,BlockMath} from 'react-katex';


const Option = Select.Option;

class ExerciseAnswer extends React.Component {
    render(){
    	const {exercise} = this.props;
    	const {exercise_id, exercise_type, answer} = exercise;
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
		                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.answerInputChange(e.target.value, i)} rows={1} />
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
					console.log("item.value",item.value);
		            return(
		                <Row className="choice_row" gutter={16} type="flex" justify="space-between">
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.props.choiceSelectChange(i)} />
		                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.answerInputChange(e.target.value, i)} rows={1} />
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
		                <Row className="choice_row" gutter={16} type="flex" justify="space-between">
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} onChange={(e) => this.props.choiceSelectChange(i)} />
		                        <Input className="edit_choice_input" value={item.value} onChange={(e) => this.props.answerImgChange( i, e.target.value )} rows={1} />
		                    </Col>
		                    <Col span={12}>
		                        <Checkbox className="edit_choice_select" checked={item.correct} />
		                        <img src={item.value} height='100' />
		                    </Col>
		                </Row>
		                );
		        });
		        break;
		    default:
		    	break;
		}

    	return(
    		<div>
    			<Row style={{marginTop: '10px',marginBottom:"10px"}} type = "flex">
    				<Select value={exercise_type.toString()} style={{ width: '120px' }} onChange={e => this.props.exerciseTypeChange(e)}>
						<Option value="0">填空题</Option>
						<Option value="1">文字选择题</Option>
						<Option value="2">图片选择题</Option>
					</Select>
					<Button icon="plus" onClick={()=>this.props.addAnswer(exercise_type)}></Button>
					<Button disabled = {isDisabled} icon="minus" onClick={()=>this.props.delAnswer(exercise_type)}></Button>
				</Row>
	    		{answerRow}
    		</div>
    	);
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  console.log("newState:",newState);
  return {
  	exercise : newState.exercise,
  }
}, action)(ExerciseAnswer);


