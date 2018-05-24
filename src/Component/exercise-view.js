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
		this.state={expand:false};
	}

	handleShow(){
		this.setState({expand:!this.state.expand});
		// if(this.state.display === 'none'){
		// 	this.setState({display:'block'});
		// }
		// else{
		// 	this.setState({display:'none'});
		// }
	}

	render(){
		const {expand, display} = this.state;
		if(this.props.exercise){
			const {title, type, answer, breakdown, title_img_url, exercise_id, sample} = this.props.exercise;
			const isinbasket = this.props.isinbasket;
			var steps = [];
			for(var j = 0; j < breakdown.length; j++) {
            	steps.push(
            	<div key={j} className="step_frame">
            		<p className="step_index">（{(j+1).toString()}）&nbsp;</p>
            		<Tex className="step_content" content={breakdown[j].content} sample={sample}/>
            		<div className="step_kpname"><a>{breakdown[j].kpname}</a></div>
            	</div>
            	);
        	}
        	var choice = eval(answer);
        	var answerDom = [];
        	switch(type){
        		case 0:  
        			answerDom = (  //填空题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{choice.map((item, i) => {
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
						choice.map((item, i) => {
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
						choice.map((item, i) => {
	        				return(
	            				<Row className="row_answer" type="flex" justify="start" align="middle">
	            					<Col span={1}>
										<p><Checkbox checked={expand? item.correct:0} disabled ></Checkbox></p>
									</Col>
	            					<Col span={18}>
										<div style={{width:130,height:60}}>
											<img className="answer_img" src={item.url}/>
										</div>
									</Col>
	            				</Row>
	            			);
						})
					);
					break;
        	}
        		
        	return(
				<div className="exercise_frame">
					<div className="exercise_id_div">
						{exercise_id}
					</div>
					<div className="exercise_body_frame">
						<Tex content={title} sample={sample}/>
						{
							title_img_url? 
							<div style={{width:680,height:60}}>
								<img className="answer_img" src={title_img_url}/>
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



