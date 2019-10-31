import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select,Modal,Button,Badge,Dropdown,Popconfirm,Checkbox,Form,Input} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from './KpExerciseView.css';
import Tex from './renderer.js';
import *as action from '../Action/';
import {connect} from 'react-redux';

export default class ExercisesView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        	title_img_width: "auto",
	        title_img_height: "3rem",
	        expand:props.expand ? false : true,
	    };
	}

	handleShow(){
		this.setState({expand:!this.state.expand});
	}

	titleImageLoaded(){
      console.log(this.title_img.width, window.innerWidth);
      if(this.title_img.width > window.innerWidth){
        this.setState({title_img_width: "90%", title_img_height: "auto"})
      }
    }

	render(){
		const {expand, display, title_img_width, title_img_height} = this.state;
		if(this.props.exercise){
			console.log("this.props.exercise: ",this.props.exercise);
			console.log("this.props.exercise_sample: ",this.props.exercise_sample);
			var {title, exercise_type, answer, breakdown, title_img_url, title_audio_url, exercise_id} = this.props.exercise;
			const exercise_sample = this.props.exercise_sample;
			var sample;

        	var answerDom = [];
        	if(exercise_sample){
        		answer = exercise_sample.answer ? exercise_sample.answer : answer;
        		sample = exercise_sample.sample;
        		title_img_url = exercise_sample.title_img_url ? exercise_sample.title_img_url : title_img_url;
        		title_audio_url = exercise_sample.title_audio_url ? exercise_sample.title_audio_url : title_audio_url;
				
        	}
        	console.log("answer: ",answer);
        	console.log("sample: ",sample);
        	switch(exercise_type){
				case 0:  
					answerDom = (  //填空题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{answer.map((item, i) => {
								return(
									<div>
										<Tex className="step_content" content={item.value} sample={sample}/>
									</div>
								);
							})}
						</div>
					);
					break;
				case 1:
					answerDom = (  //选择题选项和答案
						answer.map((item, i) => {
							return(
								<Row className="row_answer" type="flex" justify="start" align="middle">
									<Col span={1}>
										<p><Checkbox checked={expand? item.correct:0} disabled ></Checkbox></p>
									</Col>
									<Col span={18}>
										<Tex content={item.value} sample={sample} />
									</Col>
								</Row>
							);
						})
					);
					break;
				case 2:
					answerDom = (  //选择题 图片选项和答案
						answer.map((item, i) => {
							return(
								<Row className="row_answer" type="flex" justify="start" align="middle">
									<Col span={1}>
										<p><Checkbox checked={expand? item.correct:0} disabled ></Checkbox></p>
									</Col>
									<Col span={18}>
										<div style={{width:130,height:60}}>
											<img className="answer_img" src={item.value}/>
										</div>
									</Col>
								</Row>
							);
						})
					);
					break;
				case 3:  
					answerDom = (  //解答题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{answer.map((item, i) => {
								return(
									<div>
										<Tex className="step_content" content={item.value} sample={sample}/>
									</div>
								);
							})}
						</div>
					);
					break;
	        }

        	var steps = [];
			for(var j = 0; j < breakdown.length; j++) {
            	steps.push(
            	<div key={j} className="step_frame">
					<Row type="flex" justify="start">
						<Col span={1}>
							<p>{(j+1).toString()}.</p>
						</Col>
						<Col span={23}>
							<Tex content={breakdown[j].content} sample={sample}/>
            				<div><a>{breakdown[j].kpname}</a></div>
						</Col>
					</Row>
            	</div>
            	);
        	}
        	
        		
        	return(
				<div style={{padding: "10px",
							border: "1px solid #e9e9e9"}}>
					<div className="exercise_id_div">
						{exercise_id}
					</div>
					<div className="exercise_body_frame">
						<Tex content={title} sample={sample}/>
						{
							title_img_url? 
							<div style={{width:680,height:60}}>
								<img src={title_img_url} height="100px"
				                  ref={element => {this.title_img = element;}}
				                  onLoad = {() => this.titleImageLoaded()} 
				                  style={{width: title_img_width, height: title_img_height}}
				                />
							</div> 
							:
							null
						}
						{
							title_audio_url? 
							<div style={{width:680,height:60}}>
								<audio src={title_audio_url} controls="controls">
				                    Your browser does not support the audio element.
				                </audio>
							</div> 
							:
							null
						}
						{answerDom}
					</div>
					<div style={expand ? {display: "block"} : {display: "none"}} className="kp_step">
						<p className="step_annouce">步骤：</p>
						<div>
							{steps}
						</div>
					</div>
					<div className="button_frame">
						<Button onClick={()=>this.handleShow()}>{!expand? "解题详情" : "收起详情"}</Button>
					</div>
				</div>
			);
		}
	}
}



