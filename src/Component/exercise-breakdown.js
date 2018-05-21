import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Select, Button, Popconfirm, Input , InputNumber, Cascader, Checkbox, Tooltip} from 'antd';

import Tex from './renderer.js';
import QueueAnim from 'rc-queue-anim';
import NetUtil from '../utils/NetUtil';
import Config from '../utils/Config';

import *as action from '../Action/';
import {connect} from 'react-redux';

const Option = Select.Option;

let target = Config.server_url;
class ExerciseEditBreakdown extends React.Component {
	constructor(props) {
        super(props);
        this.state = { kp_options:[] };
        this.props.getCourse();

    }
    componentDidMount(){
    	this.props.updateMenu('2');
    	if(this.props.course_id){
    		this.loadChapterOptions(this.props.course_id);
    	}
    }

    componentDidUpdate(prevProps, prevState){
    	if(this.props.course_id && prevProps.course_id != this.props.course_id){
    		this.loadChapterOptions(this.props.course_id);
    	}
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

    loadKpOptions(selectedOptions){
    	var url = target + "/klmanager/getChapterKp";
    	const targetOption = selectedOptions[selectedOptions.length - 1];
    	targetOption.loading = true;
		// load options lazily
		NetUtil.get(url, {chapter_id: targetOption.value}, (results) => {
			for(var i = 0; i < results.length; i++){
				results[i].value = results[i].kpid;
				results[i].label = results[i].kpname;
			}
			targetOption.loading = false;
			targetOption.children = results;
			this.setState({kp_options: [...this.state.kp_options]})
		}, errors => {
			console.log(errors);
		});
  	}

    loadChapterOptions(course_id){
    	var url = target + "/klmanager/getBookChapter";    	
		NetUtil.get(url, {course_id: course_id}, (results) => {
			for(var i = 0; i < results.length; i++){
				results[i].value = results[i].bookid;
				results[i].label = results[i].bookname;
				results[i].children = [];
				var chapters = results[i].chapters;
				for(var j = 0; j < chapters.length; j++){
					results[i].children.push({value: chapters[j].chapterid, label: chapters[j].chaptername, isLeaf: false});
				}
			}
			this.setState({kp_options: results})
		}, errors => {
			console.log(errors);
		});
    }

    onAdd(){
    	//this.props.add(this.props.exercise_id);
    	var {breakdown} = this.props;
		const newData = {content:'', checked: false, sn: breakdown.length + 1, presn:(breakdown.length).toString()};
		this.props.addBreakdown(newData);
		//this.setState({breakdown: [...breakdown, newData]});
	}

	// onDel(){
	// 	// var {breakdown} = this.props;
	// 	// breakdown.splice(breakdown.length-1,1);
	// 	this.props.delBreakdown();
	// 	// this.setState({breakdown});
	// 	// this.props.onChange(breakdown);
	// }
    
	onKpSelect(value, selectedOptions, i){
		const targetOption = selectedOptions[selectedOptions.length - 1];
		var {breakdown} = this.props;
		breakdown[i].kpid = targetOption.value;
		breakdown[i].kpname = targetOption.label;
		this.props.updateBreakdown(breakdown);
		// this.setState({breakdown});
		// this.props.onChange(breakdown);
	}
	// onInputChange(e,i){
	// 	const value = e.target.value;
	// 	// var {breakdown} = this.props;
	// 	// breakdown[i].content = value;

	// 	this.props.inputChangeBreakdown(i, value);
	// 	// this.setState({breakdown});
	// 	// this.props.onChange(breakdown);
	// }
	// onCheckChange(e,i){
	// 	const checked = e.target.checked;
	// 	// const {breakdown} = this.props;
	// 	// breakdown[i].checked = value;
	// 	this.props.checkChangeBreakdown(i, checked);
	// 	// this.setState({breakdown});
	// 	// this.props.onChange(breakdown);
	// }
	// handlePresnChange(value,i){
	// 	// const {breakdown} = this.props;
	// 	// breakdown[i].presn = value;
	// 	this.props.presnChangeBreakdown(i, value);
	// 	// this.setState({breakdown});
	// 	// this.props.onChange(breakdown);
	// }
	displayRender(label){
		return label[label.length - 1];
	}
	//TODO:解决breakdown初始化问题
    render() {
    	var {kp_options} = this.state;
    	var {breakdown, exercise_id, course_id} = this.props;
    	breakdown = breakdown ? breakdown : [{sn: 1, presn: 0, kpid: -1, kpname: '', checked: false, content:''}];
    	var preoptions = [];
        for(var j = 0; j < breakdown.length; j++) {
            preoptions.push(<Option key={j*breakdown.length+j} value={breakdown[j].presn.toString}>{breakdown[j].presn}</Option>);
        }
		
    	var editunit = breakdown.map((item,i) => {
    		item.sn_rating = item.sn_rating ? item.sn_rating : 0;
    		return(
    			<div key={i}>
    				<Row type="flex" gutter={16} justify="space-between">
    					<Col span={12}>
    						<h3 className="step_input">{i+1}</h3>
    					</Col>
    					<Col span={12}></Col>
    				</Row>
    				<Row type="flex" gutter={16} justify="space-between">
		    			<Col span={12}>
		    				<Input 
		    					style = {{font: "14px/1.4 proxima-nova, Helvetica Neue, Arial, Helvetica, sans-serif" }}
					        	type="textarea" 
					        	onChange={(e)=>this.props.inputChangeBreakdown(e.target.value, i)} 
					        	rows={20}
								value={item.content}
					    	/>
					    	<div className="chose_kp">
								<Cascader 
									options={kp_options} 
									expandTrigger="hover" 
									onChange={(value, selectedOptions)=>this.props.selectKpBreakdown(selectedOptions, i)} 
									displayRender={(label)=>this.displayRender(label)} 
									placeholder="选择知识点"
									loadData={(e) => this.loadKpOptions(e)}
								/>
							</div>
							<Tooltip placement="topRight" title="请选择此题是否挂在此知识点">
								<div className="check_kp">
									<Checkbox checked = { item.checked ? item.checked : false} onChange={(e)=>this.props.checkChangeBreakdown(e.target.checked, i)}>主测点</Checkbox>
								</div>
							</Tooltip>
							<div style={{ float: 'right', display: 'inline'}}>
								<InputNumber value={item.sn_rating} style={{ width: 100 }} onChange={value => this.props.changeRatingBreakdown(value, i)} placeholder="填写步骤难度" />
							</div>
							<Tooltip placement="topRight" title="请选择前置知识点">
								<div style={{ float: 'right', display: 'inline'}}>
							      <Select value={item.presn.toString()} style={{ width: 40 }} onChange={(value)=>this.props.presnChangeBreakdown(value,i)}>
								  	{preoptions}
								  </Select>
								</div>
						    </Tooltip>
						    
		    			</Col>
						<Col span={12}>
							<div style = {{ height: '380px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								<Tex content={item.content} />
							</div>
							<div style = {{ width: '250px', marginTop: '5px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								{item.kpname}
							</div>
						</Col>
	    			</Row>
				</div>
			);
		});

		//更新答案按钮
		var isDisabled = exercise_id ? false : true;
		return (
			<div>
				<div style={{marginTop: '10px'}}>
					<Button  
						icon="plus" 
						onClick={()=>this.onAdd()}
					>添加</Button>
					<Button 
						icon="minus"  
						onClick={()=>this.props.delBreakdown()}
					>删除</Button>
					<Button disabled = {isDisabled} onClick={e => this.props.uploadBreakdown(exercise_id, breakdown)}>更新答案</Button>
					{this.renderCourseSelect()}
				</div>
				<QueueAnim component="ul" type={['right', 'left']} leaveReverse>
	            	{editunit}
	            </QueueAnim>
			</div>	
        );
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  console.log(newState);
  return {
  	breakdown: newState.breakdown,
  	course: newState.course,
  	course_id: newState.course_id,
    exercise_id: newState.exercise_id, 
    isLoading: newState.isLoading, 
  }
}, action)(ExerciseEditBreakdown);



