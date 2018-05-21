import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import { Layout, Icon, Row, Col, Menu, Select,Table,Button,Input,Dropdown,Popconfirm,Checkbox,Tabs,Progress,Popover,Tooltip} from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './stu_capacity.css';

const { Header, Footer, Sider, Content } = Layout;

var urlip = 'http://127.0.0.1/klmanager/';

const TabPane = Tabs.TabPane;

var capatity = [{
	  key: '1',
	  exercount: 560,
	  rate: 89.4,
	  ladderscore: 1800,
	}, {
	  key: '2',
	  exercount: 20,
	  rate: 88,
	  ladderscore: 1780,
	}, {
	  key: '3',
	  exercount: 50,
	  rate: 91,
	  ladderscore: 1884,
	}, 
];

var ladder = [{procount:10,score:1600},{procount:11,score:1605},{procount:12,score:1608}
			 ,{procount:13,score:1615},{procount:14,score:1611},{procount:15,score:1609}];

var bestkp = [{
	  key: '1',
	  kpname: '知识点1',
	  score: 1800,
	}, {
	  key: '2',
	  kpname: '知识点2',
	  score: 1700,
	}, {
	  key: '3',
	  kpname: '知识点3',
	  score: 1600,
	}, {
	  key: '4',
	  kpname: '知识点4',
	  score: 1500,
	}, {
	  key: '5',
	  kpname: '知识点5',
	  score: 1300,
	}, 
];
var worstkp = [{
	  key: '1',
	  kpname: '知识点1',
	  score: 800,
	}, {
	  key: '2',
	  kpname: '知识点2',
	  score: 1000,
	}, {
	  key: '3',
	  kpname: '知识点3',
	  score: 1100,
	}, {
	  key: '4',
	  kpname: '知识点4',
	  score: 1200,
	}, {
	  key: '5',
	  kpname: '知识点5',
	  score: 1250,
	}, 
];

class OverallAbility extends React.Component{
	constructor(props) {
		super(props);
		this.state={ data : capatity , activeKey : '1'};
	}
	onTabChange(key){
		this.setState({activeKey : key});
	}
	render(){
		const {data,activeKey} = this.state;
		var vary20 = data[0].ladderscore-data[1].ladderscore;
		var vary50 = data[0].ladderscore-data[2].ladderscore;
    	return(
    	  <div>
    	  	<div className="tab_content">
		        <Tabs size='small' tabPosition='left' onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
		          <TabPane tab="全部" key="1">
			        <Row type="flex" justify="start">
						<Col span={5}><p className="p_header">练题数</p></Col>
						<Col span={5}><p className="p_header">正确率</p></Col>
						<Col span={5}><p className="p_header">天梯分</p></Col>
					</Row>
		          	<Row align="middle" type="flex" justify="start" className="row_content">
						<Col span={5}><p className="p_content">{data[0].exercount}</p></Col>
						<Col span={5}><div className="p_content"><Progress type="circle" percent={data[0].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
						<Col span={5}><p className="p_content">{data[0].ladderscore}</p></Col>
					</Row>
		          </TabPane>
		          <TabPane tab="近20题" key="2">
		          	<Row type="flex" justify="start">
						<Col span={5}><p className="p_header">练题数</p></Col>
						<Col span={5}><p className="p_header">正确率</p></Col>
						<Col span={5}><p className="p_header">天梯分变化</p></Col>
					</Row>
		          	<Row align="middle" type="flex" justify="start" className="row_content">
						<Col span={5}><p className="p_content">{data[1].exercount}</p></Col>
						<Col span={5}><div className="p_content"><Progress type="circle" percent={data[1].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
						<Col span={5}><p className="p_content">{vary20>0? "+"+vary20 : "-"+Math.abs(vary20)}</p></Col>
					</Row>
		          </TabPane>
		          <TabPane tab="近50题" key="3">
		          	<Row type="flex" justify="start">
						<Col span={5}><p className="p_header">练题数</p></Col>
						<Col span={5}><p className="p_header">正确率</p></Col>
						<Col span={5}><p className="p_header">天梯分变化</p></Col>
					</Row>
		          	<Row align="middle" type="flex" justify="start" className="row_content">
						<Col span={5}><p className="p_content">{data[2].exercount}</p></Col>
						<Col span={5}><div className="p_content"><Progress type="circle" percent={data[2].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
						<Col span={5}><p className="p_content">{vary50>0? "+"+vary50 : "-"+Math.abs(vary50)}</p></Col>
					</Row>
		          </TabPane>
		        </Tabs>
	        </div>
	        <div className="d_ladder">
	        	<p className="p_ladder_title">天梯积分</p>
	        	<LadderScore/>
	        </div>
	        <div className="d_kp">
	        	<RecentKp/>
	        </div>
	      </div>
    	);
	}
}

const Line = createG2((chart) => {
  	var defs = {
	  procount: {
	    type: 'linear',
	    alias:'练习题数',
	  },
	  score: {
	    type: 'linear',
	    alias:'天梯分数',
	    tickCount : 6,
	  },
	};

	// console.log(chart);
    chart.source(chart._attrs.data,defs);
    chart.line().position('procount*score').size(2);
    chart.render();
});

class LadderScore extends React.Component {
	constructor(props) {
		super(props);
		this.state={
		    data: ladder,
		    width: 520,
		    height: 250,
		    plotCfg: {
		      margin: [10, 50, 50, 85],
		    },
		};
    }
    componentDidMount(){
    }
    render(){
    	return (
	      <div>
	        <Line
	          data={this.state.data}
	          width={this.state.width}
	          height={this.state.height}
	          plotCfg={this.state.plotCfg}
	        />
	      </div>
	    );
    }
}

class RecentKp extends React.Component {
	constructor(props) {
		super(props);
		this.state={best_data : bestkp,worst_data : worstkp};
    }
    render(){
    	const {best_data,worst_data} = this.state;
    	var bestDom = [];
    	var worstDom = [];
		for(var j=0;j<best_data.length;j++){
			bestDom.push(
				<div key={j}>
					<Row type="flex" justify="start">
						<Col span={4}><p>{best_data[j].kpname}</p></Col>
						<Col span={10}>
							<Progress 
    							percent={(best_data[j].score/2000)*100} 
    							format={() => ''}
	    				    />
	    				</Col>
	    				<Col span={2}><p>{best_data[j].score+'分'}</p></Col>
					</Row>
				</div>
			);
		}
		for(var j=0;j<worst_data.length;j++){
			worstDom.push(
				<div key={j}>
					<Row type="flex" justify="start">
						<Col span={4}><p>{worst_data[j].kpname}</p></Col>
						<Col span={10}>
							<Progress 
    							percent={(worst_data[j].score/2000)*100} 
    							format={() => ''}
	    				    />
	    				</Col>
	    				<Col span={2}><p>{worst_data[j].score+'分'}</p></Col>
					</Row>
				</div>
			);
		}
    	return(
    		<div>
    			<p className="p_d_kp">最近掌握最好的知识点</p>
    			<div className="kp_dom">{bestDom}</div>
    			<p className="p_d_kp">最近掌握最差的知识点</p>
    			<div className="kp_dom">{worstDom}</div>
    		</div>
    	);
    }
}

class KpAbility extends React.Component {
	constructor(props) {
		super(props);
		this.state={current:'163840',kp_data:[]};
		this.columns = [{
            title: '知识点名称',
            dataIndex: 'kpname',
            width: '50%',
        }, {
            title: '能力分值',
            dataIndex: 'score',
            width: '25%',
        }, {
            title: '最近更新时间',
            dataIndex: 'updatetime',
            width: '25%',
        }];
	}

	componentDidMount(){
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

	handleClick(e){
		const {kp_data} = this.state;
        this.setState({ current: e.key },()=>{
            var url = urlip+'getChapterKp';//接口还需重写
            NetUtil.get(url, {chapter_id : this.state.current}, (results) => {
                kp_data = results;
                this.setState({ kp_data }); 
            })                         
        });
	}

	render(){
		const {kp_data} = this.state;
		return(
			<Layout style={{ padding: '24px 0', background: '#fff'}}>
		        <Sider width={300} style={{ background: '#fff' }}>
		            <Menu onClick = { (e) => this.handleClick(e) } style = {{ width: 300 } }
                        defaultSelectedKeys = {[this.state.current]}
                        defaultOpenKeys = {['1'] } 
                    	mode = "inline" 
                    >
                        {this.state.menuHtml}
                    </Menu >
		        </Sider>
		        <Content style={{ padding: '0 24px', minHeight: 280 }}>
		           < Table columns = { this.columns } dataSource = { kp_data }/> 
		        </Content>
	        </Layout>
		);
	}
}

class StuCapacity extends React.Component {
	constructor(props){
		super(props);
		this.state = { activeKey : '1'};
	}
	
	onTabChange(key){
		this.setState({activeKey : key});
	}

	render(){
		const {activeKey} =this.state;
		return(
			<Layout className="layout">
			    <Header>
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
			    <Content style={{ padding: '0 250px' }}>
			      <p style={{ margin: '12px 0' }}>学生姓名：小明</p>
			      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
					<Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
					    <TabPane tab="综合能力" key="1"><OverallAbility/></TabPane>
					    <TabPane tab="近期表现" key="2"></TabPane>
					    <TabPane tab="知识点能力" key="3"><KpAbility/></TabPane>
				    </Tabs>
			      </div>
			    </Content>
			    <Footer style={{ textAlign: 'center' }}>
			      Ant Design ©2017 Created by Bourne
			    </Footer>
			 </Layout>
		);
	}
}

ReactDOM.render( < StuCapacity/>, document.getElementById('content'));



