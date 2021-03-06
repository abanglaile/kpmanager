import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Select, Button, Popconfirm, Input , InputNumber, Cascader, Checkbox, Tooltip} from 'antd';

import Tex from './renderer.js';
import QueueAnim from 'rc-queue-anim';
import NetUtil from '../utils/NetUtil';
import Config from '../utils/Config';
import *as action from '../Action/';
import {connect} from 'react-redux';

const { TextArea } = Input;
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
			// console.log("this.props.breakdown[0].kpid",this.props.breakdown[0].kpid);
			if(this.props.breakdown[0].kpid){
				this.props.getKpTagBykpid(this.props.breakdown[0].kpid);
			}
    	}
    }

    renderCourseSelect(){
      const {course, course_id} = this.props;
      
      return (
        <Select placeholder="请先选择科目" value={course_id ? course_id.toString() : undefined}  style={{ paddingLeft: '10px', width: 150 }} onChange={(value) => this.props.courseSelect(value)}> 
		  {course.map((item,index) => (
                  <Option value={item.course_id.toString()}>{item.course_name}</Option>
              ))
          }      
        </Select>
      )
    }

    loadKpOptions(selectedOptions){
    	var url = target + "/getChapterKp";
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
    	var url = target + "/getBookChapter";    	
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
		// const newData = {content:'', checked: false, sn: breakdown.length + 1, presn:(breakdown.length).toString(), sn_rating: 500};
		const newData = {content:'', checked: false, sn: breakdown.length + 1, presn:(breakdown.length).toString(), kpid: -1,kp_tag_id:null,kp_tag_name:'', kpname: '', sn_rating: 500};
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

	selectBreakdownKp(selectedOptions, i){
		this.props.selectKpBreakdown(selectedOptions, i);
		this.props.getKpTagBykpid(selectedOptions[2].kpid);
		// var url = target + "/getKpTagBykpid";  
		// NetUtil.get(url, {kpid: selectedOptions[2].kpid}, (results) => {
		// 	console.log("results:",JSON.stringify(results));
		// 	this.setState({kp_tag: results})
		// }, errors => {
		// 	console.log(errors);
		// });
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
		var {breakdown, exercise_id, course_id, answer_assist_url, kp_tag} = this.props;
		var kp_tag_option = [];
		if(kp_tag.length){
			kp_tag_option = kp_tag.map((item) => <Option value={item.kp_tag_id}>{item.kp_tag_name}</Option>);
		}
		console.log("breakdown$$$",JSON.stringify(breakdown))
    	breakdown = breakdown ? breakdown : [{sn: 1, presn: 0, kpid: -1, kpname: '', kp_tag_id:null,kp_tag_name:'',checked: false, content:'', sn_rating: 500}];
    	var preoptions = [];
        for(var j = 0; j < breakdown.length; j++) {
			// console.log('breakdown[j].presn:',breakdown[j].presn);
            preoptions.push(<Option key={j*breakdown.length+j} value={breakdown[j].sn-1}>{breakdown[j].sn-1}</Option>);
        }
		
    	var editunit = breakdown.map((item,i) => {
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
		    				<TextArea 
		    					autosize={{ minRows: 15}} 
		    					style = {{font: "14px/1.4 proxima-nova, Helvetica Neue, Arial, Helvetica, sans-serif" }}
					        	type="textarea" 
					        	onChange={(e)=>this.props.inputChangeBreakdown(e.target.value, i)} 
								value={item.content}
					    	/>
					    	<div className="chose_kp">
								<Cascader 
									options={kp_options} 
									expandTrigger="hover" 
									// onChange={(value, selectedOptions)=>this.props.selectKpBreakdown(selectedOptions, i)}
									onChange={(value, selectedOptions)=>this.selectBreakdownKp(selectedOptions, i)} 
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
							<Tooltip placement="left" title="请选择前置知识点">
								<div style={{ float: 'right', display: 'inline'}}>
							      <Select value={item.presn.toString()} style={{ width: 40 }} onChange={(value)=>this.props.presnChangeBreakdown(value,i)}>
								  	{preoptions}
								  </Select>
								</div>
						    </Tooltip>
						    
		    			</Col>
						<Col span={12}>
							<div style = {{ height: '295px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								<Tex content={item.content} />
							</div>
							<div style = {{ width: '250px', marginTop: '5px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								{item.kpname}
							</div>
						</Col>
	    			</Row>
					<Row type="flex" gutter={16} justify="space-between">
    					<Col span={12}>
							<div style = {{marginTop: '5px'}}>
								<Select 
									labelInValue
									placeholder='知识点二级标签' 
									style={{ width: 165 }}
									onChange={(value)=> {this.props.selectBreakdownKpTag(value,i)}}
								>
									{kp_tag_option}
								</Select>
							</div>
    					</Col>
    					<Col span={12}>
							<div style = {{ width: '250px', marginTop: '5px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
								{item.kp_tag_name}
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
					<Button disabled = {isDisabled} onClick={e => this.props.uploadBreakdown(exercise_id, breakdown, answer_assist_url)}>更新分解</Button>
					{this.renderCourseSelect()}
				</div>
				<div style={{ marginBottom: 16 ,marginTop: 16}}>
					<Row type="flex" gutter={16} justify="space-between">
    					<Col span={12}>
							<Input  
								addonBefore="辅助图"  
								value = {answer_assist_url} 
								onChange={(e) => this.props.assistImgChange( e.target.value )}
							/>
    					</Col>
						<Col span={12}>
							{answer_assist_url ? 
								<img src={answer_assist_url} height='100' />
								:''
							}
						</Col>
    				</Row>
				</div>
				<QueueAnim type={['right', 'left']} leaveReverse>
	            	{editunit}
	            </QueueAnim>
			</div>	
        );
    }
}

export default connect(state => {
  var newState = state.exerciseData.toJS();
  console.log("exercise:",JSON.stringify(newState.exercise));
  return {
	breakdown: newState.exercise.breakdown,
	answer_assist_url: newState.exercise.answer_assist_url,
	course: newState.course,
  	course_id: newState.course_id,
    exercise_id: newState.exercise.exercise_id, 
	isLoading: newState.isLoading, 
	kp_tag: newState.kp_tag,
  }
}, action)(ExerciseEditBreakdown);



