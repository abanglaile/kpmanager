import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select,Modal,Button,Badge,Dropdown,Popconfirm,Checkbox} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './KpExerciseView.css';
import Tex from './renderer.js';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;

var urlip = 'http://127.0.0.1/klmanager/';

var title = "题目：@c = \\pm\\sqrt{a^2 + b^2}@，请问答案是多少？";
var answer = [
      { correct: 0, value: '@0 < m < 4@' },
      { correct: 1, value: '@0 \\leq m \\leq 4@' },
      { correct: 0, value: '@m \\geq 4@' },
      { correct: 0, value: '@0 < m \\leq 4@'}
    ];
var breakdown = [
      { sn: 0, value: 'f(x)定义域为R,则@mx^2 + mx + 1 \\geq 0@恒成立', kpid: '' ,kpname:'代数式'},
      { sn: 1, value: '当@m \\neq 0@, @y = mx^2 + mx + 1@为二次函数，函数图像开口向上，与x轴最多只有一个交点。即@\\Delta = m^2 -4m \\leq 0@, m > 0', kpid: '',kpname:'整式' },
      { sn: 2, value: '解得：@0 < m \\leq 4@', kpid: '',kpname:'分式' },
      { sn: 3, value: '当m = 0，f(x) = 1，符合题意。综上所述@0 \\leq m \\leq 4@', kpid: '',kpname:'二次根式'},
    ];

var problems = { title: title, answer: answer, type: true, breakdown: breakdown };

var kpcontent = [
				"圆的标准方程","求任意三角形外接圆的方程的两种方法",
				"三角形外接圆的圆心是外心，即三角形三边的垂直平分线的交点",
				"三角形内切圆的圆心是内心，即三角形的角平分线的交点",
				"三角形三条高线的交点是三角形的垂心",
				"圆的一般方程","用待定系数法求圆的方程","求动点的轨迹方程","圆与点的位置关系",
				"圆与直线的位置关系","判断圆与直线的位置关系方法","圆与圆的位置关系",
				"判断圆与圆的位置关系方法","公共弦的直线方程","直线与圆的方程应用"
				];

class OneExercise extends React.Component {
	constructor(props) {
		super(props);
		this.state={expand:false,isinbasket:false,display:'none'};
	}
	handleShow(){
		this.setState({expand:!this.state.expand});
		if(this.state.display === 'none'){
			this.setState({display:'block'});
		}
		else{
			this.setState({display:'none'});
		}
	}
	handleAddtoBasket(){
		this.setState({isinbasket:!this.state.isinbasket});
		this.props.onValueBack(this.props.exercise);
	}
	handleRemovefromBasket(){
		this.setState({isinbasket:!this.state.isinbasket});
		this.props.onValueRemove(this.props.exercise);
	}
	render(){
		const {expand,isinbasket,display} = this.state;
		if(this.props.exercise){
			console.log(this.props.exercise);
			const {title ,type, answer, breakdown} = this.props.exercise;
			var steps = [];
			for(var j = 0; j < breakdown.length; j++) {
            	steps.push(
            	<div key={j} className="step_frame">
            		<p className="step_index">（{(j+1).toString()}）&nbsp;</p><Tex className="step_content" content={breakdown[j].content}/>
            		<div className="step_kpname"><a>{breakdown[j].kpname}</a></div>
            	</div>
            	);
        	}
        	var choice = eval(answer);
        	var answerDom = (
				type ?
					choice.map((item, i) => {
        				return(
            				<Row className="row_loc" type="flex" justify="start">
            					<Col span={5}>
									<p><Checkbox checked={expand? item.correct:0} disabled className="choice_loc"></Checkbox></p><Tex className="choice_content_loc" content={item.value} />
								</Col>
            				</Row>
            			);
					})
				: <Tex content={answer} />
			);
        	return(
				<div className="exercise_frame">
					<div className="exercise_body_frame">
						<Tex content={title} />
						{answerDom}
					</div>
					<div style={{display}} className="kp_step">
						<p className="step_annouce">步骤：</p>
						<div>
							{steps}
						</div>
					</div>
					<div className="button_frame">
						<Button onClick={()=>this.handleShow()}>{!expand? "解题详情" : "收起详情"}</Button>
						<Button className="basket_button" onClick={!isinbasket? ()=>this.handleAddtoBasket() : ()=>this.handleRemovefromBasket()} type={!isinbasket? "primary" : ""}>
							{!isinbasket? "加入试题篮" : "移出试题篮"}
						</Button>	
					</div>
				</div>
			);
		}
	}
}

class OneExerView extends React.Component {
	constructor(props){
		super(props);
	}
	handleDelete(){
		this.props.onDelValue(this.props.exercise);
	}
	render(){
		if(this.props.exercise){
			const {title ,type, answer, breakdown} = this.props.exercise;
        	var choice = eval(answer);
        	var answerDom = (
				type ?
					choice.map((item, i) => {
        				return(
            				<Row className="row_loc" type="flex" justify="start">
            					<Col span={5}>
									<p><Checkbox checked={item.correct} disabled className="choice_loc"></Checkbox></p><Tex className="choice_content_loc" content={item.value} />
								</Col>
            				</Row>
            			);
					})
				:
				<div className="exercise_body_frame">
					<Tex content={answer} />
				</div>
			);
			return(
				<div className="exercise_frame">
					<div className="exercise_body_frame">
						<Tex content={title} />
						{answerDom}
					</div>
					<div className="button_frame">
						<Button onClick={()=>this.handleDelete()}>删除</Button>	
					</div>
				</div>	
			);
		}
	}
}

class KpExerciseView extends React.Component {
	constructor(props) {
		super(props);
		this.state={basket_data:[],visible:false,current:'163840',kps:[],kpid:'',exer_data:[]};

		var urlMenu = urlip+'getBookChapter';
          NetUtil.get(urlMenu, {course_id:1}, (results) => {
                  this.state.menu = results;
                  console.log('menu:'+JSON.stringify(results));
                  var menuHtml = results.map(function(bookmenu,index,input) {
                      var chaEl = [];
                      var chmenu = bookmenu.chapters;
                      for(var j = 0; j < chmenu.length; j++) {
                            chaEl.push(<Menu.Item key= {chmenu[j].chapterid}>{chmenu[j].chaptername}</Menu.Item>);
                      }
                      return(
                            <SubMenu key={bookmenu.bookid} title={<span><Icon type="mail" /><span>{bookmenu.bookname}</span></span>}>
                                {chaEl}
                            </SubMenu>
                        )
                  })
                  this.setState({menuHtml});                
        });    
	}
	handlePreView(){
		this.setState({visible: true});
	}
	handleToBasket(currentData){
		const {basket_data} = this.state;
		const newData = currentData;
		this.setState({basket_data: [...basket_data, newData]});
	}
	handleOk(){
		this.setState({
	      visible: false,
	    });
	}
	handleCancel(){
	    this.setState({
	      visible: false,
	    });
    }
    handleChange(value){
		const {exer_data , kpid} = this.state;
        this.setState({ kpid: value },()=>{
            var data = [];
            var url = urlip+'getExerciseByKp';
            NetUtil.get(url, {kpid : 83885569}, (results) => {
                data = results;
                this.setState({ exer_data : data}); 
            })                         
        });
    }
	handleRemoveBasket(currentData){
		const {basket_data} = this.state;
		// console.log('remove data:' + JSON.stringify(this.state.data));
		Array.prototype.indexOf = function (val) {
	        for(var i = 0; i < this.length; i++){
	            if(this[i] == val){return i;}
	        }
	        return -1;
	    }
	    Array.prototype.remove = function (val) {
	        var index = this.indexOf(val);
	        if(index > -1){this.splice(index,1);}
	    }
	    basket_data.remove(currentData);
		this.setState({basket_data});
	}

	handleClick(e){
		const {kps} = this.state;
        this.setState({ current: e.key },()=>{
            var data = [];
            var url = urlip+'getChapterKp';
            NetUtil.get(url, {chapter_id : this.state.current}, (results) => {
                data = results;
                for (var i = 0; i < data.length; i++) {
                    kps.push(
		        		<Option  value={data[i].kpid.toString()}>{data[i].kpname}</Option>
		            );
                }
                this.setState({ kps }); 
            })                         
        });
	}

	render(){
		const {basket_data,exer_data,visible} = this.state;
		const menu = (
		  <Menu>
		    <Menu.Item className="menu_item">
		      <Button onClick={()=>this.handlePreView()} type="primary">试题预览</Button>
		    </Menu.Item>
		    <Menu.Item className="menu_item">
		      <Button onClick={()=>this.handlePreduce()} type="primary">生成试卷</Button>
		    </Menu.Item>
		  </Menu>
		);
		var exerViews = [];
		for(var j = 0; j < basket_data.length; j++) {
            exerViews.push(
            	<div key={j}>
            		<OneExerView exercise={basket_data[j]} onDelValue={(currentData)=>this.handleRemoveBasket(currentData)}/>
            	</div>
            );
        }
        var exerDatas = [];
		for(var j = 0; j < exer_data.length; j++) {
            exerDatas.push(
            	<div key={j+basket_data.length}>
            		<OneExercise exercise={exer_data[j]} onValueBack={(currentData)=>this.handleToBasket(currentData)} onValueRemove={(currentData)=>this.handleRemoveBasket(currentData)}/>
            	</div>
            );
        }
		return(
			<Layout>
			    <Header className="header">
			      <div className="logo" />
			      <Menu
			        theme="dark"
			        mode="horizontal"
			        defaultSelectedKeys={['2']}
			        style={{ lineHeight: '64px' }}
			      >
			        <Menu.Item key="1">nav 1</Menu.Item>
			        <Menu.Item key="2">nav 2</Menu.Item>
			        <Menu.Item key="3">nav 3</Menu.Item>
			      </Menu>
			    </Header>
			    <Content style={{ padding: '24px 120px' }}>
			      <Layout style={{ padding: '24px 0', background: '#fff'}}>
			        <Sider width={300} style={{ background: '#fff' }}>
			            <Menu onClick = { (e) => this.handleClick(e) } style = {{ width: 300 } }
                            defaultSelectedKeys = {[this.state.current]}
                            defaultOpenKeys = {['4'] } 
                        	mode = "inline" 
                        >
                            {this.state.menuHtml}
                        </Menu >
			        </Sider>
			        <Content style={{ padding: '0 24px', minHeight: 280 }}>
			          <Modal title="试题预览" visible={visible} width={700} onOk={()=>this.handleOk()} onCancel={()=>this.handleCancel()} okText="生成试卷">
				          {exerViews}
				      </Modal>
			          <Row className="row_loc" type="flex" justify="end">
						<Col span={12}>
						  <Select
						  	className="kp_select"
						    showSearch
						    style={{ width: 300 }}
						    dropdownMatchSelectWidth={false}
						    placeholder="选择知识点"
						    optionFilterProp="children"
						    onChange={(value)=>this.handleChange(value)}
						    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						  >
						    {this.state.kps}
						  </Select>
						</Col>
						<Col span={6}></Col>
						<Col span={6}>
							<Dropdown overlay={menu} placement="bottomRight">
								<Badge count={basket_data.length} style={{}}>
						          	<Button className="basket_pro">
						          		<Icon className="icon_basket" type="shopping-cart" />
						          		<a className="ant-dropdown-link" href="#">我的试题篮<Icon type="down" /></a>
						          	</Button>
					          	</Badge>
							</Dropdown>
						</Col>
					  </Row>
					  <div>
						{exerDatas}
					  </div> 
			        </Content>
			      </Layout>
			    </Content>
			    <Footer style={{ textAlign: 'center' }}>
			      ExerciseView ©2017 Created by Bourne
			    </Footer>
			</Layout>
		);
	}
}

ReactDOM.render( < KpExerciseView/>, document.getElementById('content'));