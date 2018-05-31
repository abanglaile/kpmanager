import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Button, Select, InputNumber, Checkbox} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from './exerciseEdit.css';
import Tex from './renderer.js';

import ExerciseAnswer from './exercise-answer.js';
import ExerciseTitle from './exercise-title.js';
import QueueAnim from 'rc-queue-anim';
import ExerciseImgUpload from './upload-qiniu.js';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Option = Select.Option;

//题干组件
class ExerciseMain extends React.Component {
    componentDidMount(){
      this.props.updateMenu('1');
      this.props.getCourse();
    }
    renderCourseSelect(){
      const {course, course_id} = this.props;
      
      return (
        <Select value={course_id ? course_id.toString() : ''} style={{ paddingLeft: '10px', width: 150 }} onChange={(value) => this.props.courseSelect(value)}>
          {course.map((item,index) => (
                  <Option value={item.course_id.toString()}>{item.course_name}</Option>
              ))
          }      
        </Select>
      )
    }
    render(){
    	var {exercise_id, exercise_rating} = this.props;
    	exercise_id = exercise_id > 0 ? exercise_id : '未保存';
    	exercise_rating = exercise_rating ? exercise_rating : 0;
    	return(
    		
		<div style={{paddingTop: '10px', paddingBottom: '10px'}}>
			<span>
				<Button onClick={e => this.props.uploadExercise()}>保存提交</Button> 
			</span>
			<div style={{ float: 'left', display: 'inline'}}>
				<InputNumber value={exercise_rating} onChange={value => this.props.changeRatingExercise(value)} placeholder="填写步骤难度" />
			</div>
			<span style={{paddingLeft: '10px'}}>
				题目id: {exercise_id}
			</span>
      {this.renderCourseSelect()}
			<ExerciseTitle />
			<ExerciseAnswer />
		</div>
    	);
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  return {
    exercise_id: newState.exercise.exercise_id, 
    exercise_rating: newState.exercise.exercise_rating,
    course: newState.course,
    course_id: newState.course_id,
    isLoading: newState.isLoading, 
  }
}, action)(ExerciseMain);
