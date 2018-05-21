import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tex from './renderer.js';

import *as action from '../Action/';
import {connect} from 'react-redux';

class ExerciseEditBreakdown extends React.Component {
	constructor(props) {
        super(props);
        this.state = { breakdown: this.props.breakdown, kp_options:[], exercise_id: this.props.et.exercise_id };
    }
    componentDidMount(){
    	this.loadKpOptions();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.breakdown !== this.state.breakdown){
        	this.setState({ breakdown: nextProps.breakdown });
        }
    }

    loadKpData(selectedOptions){
    	var url = server_url + "/klmanager/getChapterKp";
    	const targetOption = selectedOptions[selectedOptions.length - 1];
    	targetOption.loading = true;
		// load options lazily
		NetUtil.get(url, {chapter_id: targetOption.value}).then((results) => {
			for(var i = 0; i < results.length; i++){
				results[i].value = results[i].kpid;
				results[i].label = results[i].kpname;
			}
			targetOption.loading = false;
			targetOption.children = results;
			this.setState({kp_options: [...this.state.kp_options]})
		});
  	}

    loadKpOptions(){
    	var url = "http://127.0.0.1:3000/klmanager/getBookChapter";    	
		NetUtil.get(url, {course_id: 2}).then((results) => {
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
		});
    }

    onAdd(){
    	const {breakdown} = this.props;
		const newData = {value:'', sn: breakdown.length, presn:(breakdown.length).toString()};
		this.props.updateBreakdown({breakdown: [...breakdown, newData]});
		//this.setState({breakdown: [...breakdown, newData]});
	}

	onDel(){
		const {breakdown} = this.props;
		breakdown.splice(breakdown.length-1,1);
		this.props.updateBreakdown({breakdown});
		// this.setState({breakdown});
		// this.props.onChange(breakdown);
		console.log(breakdown);
	}
    
	onKpSelect(value, selectedOptions, i){
		const targetOption = selectedOptions[selectedOptions.length - 1];
		const {breakdown} = this.props;
		breakdown[i].kpid = targetOption.value;
		breakdown[i].kpname = targetOption.label;
		this.props.updateBreakdown({breakdown});
		// this.setState({breakdown});
		// this.props.onChange(breakdown);
	}
	onInputChange(e,i){
		const value = e.target.value;
		const {breakdown} = this.props;
		breakdown[i].content = value;
		this.props.updateBreakdown({breakdown});
		// this.setState({breakdown});
		// this.props.onChange(breakdown);
	}
	onCheckChange(e,i){
		const value = e.target.checked;
		const {breakdown} = this.props;
		breakdown[i].checked = value;
		this.props.updateBreakdown({breakdown});
		// this.setState({breakdown});
		// this.props.onChange(breakdown);
	}
	handlePresnChange(value,i){
		const {breakdown} = this.props;
		breakdown[i].presn = value;
		this.props.updateBreakdown({breakdown});
		// this.setState({breakdown});
		// this.props.onChange(breakdown);
	}
	displayRender(label){
		return label[label.length - 1];
	}
	//TODO:解决breakdown初始化问题
    render() {
    	var {breakdown, kp_options} = this.state;
    	console.log(breakdown.length);
    	
    	var preoptions = [];
        for(var j = 0; j < breakdown.length; j++) {
            preoptions.push(<Option key={j*breakdown.length+j} value={breakdown[j].presn.toString}>{breakdown[j].presn}</Option>);
        }
        kp_options = kp_options?kp_options:[];

    	var editunit = breakdown.map((item,i) => {
    		console.log(item.checked);
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
					        	type="textarea" 
					        	onChange={(e)=>this.onInputChange(e,i)} 
					        	rows={10}
								value={item.content}
					    	/>
					    	<div className="chose_kp">
								<Cascader 
									options={kp_options} 
									expandTrigger="hover" 
									onChange={(value, selectedOptions)=>this.onKpSelect(value, selectedOptions,i)} 
									displayRender={(label)=>this.displayRender(label)} 
									placeholder="选择知识点"
									loadData={(e) => this.loadKpData(e)}
								/>
							</div>
							<Tooltip placement="topRight" title="请选择此题是否挂在此知识点">
								<div className="check_kp">
									<Checkbox checked = { item.checked ? item.checked : false} onChange={(e)=>this.onCheckChange(e,i)}>主测点</Checkbox>
								</div>
							</Tooltip>
							<Tooltip placement="topRight" title="请选择前置知识点">
								<div className="select_prekp">
							      <Select  defaultValue={i.toString()} className="select_kp"  style={{ width: 40 }} onChange={(value)=>this.handlePresnChange(value,i)}>
								  	{preoptions}
								  </Select>
								</div>
						    </Tooltip>
		    			</Col>
						<Col span={12}>
							<div style = {{ height: '200px', padding: '5px', border: '1px solid #d9d9d9', background: '#fff'}}>
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

		return (
			<div>
				<div style={{marginTop: '10px'}}>
					<Button  
						icon="plus" 
						onClick={()=>this.onAdd()}
					>添加</Button>
					<Button 
						icon="minus"  
						onClick={()=>this.onDel()}
					>删除</Button>
				</div>
				<QueueAnim component="ul" type={['right', 'left']} leaveReverse>
	            	{editunit}
	            </QueueAnim>
			</div>	
        );
    }
}

export default connect(state => {
  console.log(state);
  return {
  	breakdown: state.breakdown,
    exercise_id: state.exercise_id, 
    isLoading: state.isLoading, 
  }
}, action)(ExerciseEditBreakdown);