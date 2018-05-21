import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input } from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './kpgradeview.css';
import { ModifyGradePage } from './GradeFormInput.js';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;
var urlip = 'http://10.251.221.31/usermanager/';
     
class GradeView extends React.Component {
    constructor(props) {
    super(props);
    this.state = { data: [], current: '512'};
    this.columns = [{
        title: '序号',
        dataIndex: 'kpindex',
        width: '10%',
    }, {
        title: '知识点名称',
        dataIndex: 'kpname',
        width: '30%',
    }, {
        title: '评级',
        dataIndex: 'grade',
        width: '10%',
    },{
        title: '备注',
        dataIndex: 'eval_desc',
        width: '30%',
    }, {
        title: '更改时间',
        dataIndex: 'eval_time',
        width: '12%',
    },{
        title: '修改',
        dataIndex: 'modify',
        width: '8%',
        render: (text, record, index) => this.renderColumn(this.state.data,index,text),
    }];

    var data = [];
    var datasource = [];
    var url = urlip+'getuserkp?chapterid=163840&&userid=1';
    // var url = urlip+'/getChapterKp?chapter_id='+this.state.current;
    console.log('url:'+url);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    NetUtil.get(url, '', (results) => {
        data = results;
        // console.log('data:'+JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            var rowdata = { key: data[i].kpid, kpindex: data[i].kpindex, kpname: data[i].kpname, grade:data[i].grade, eval_desc: data[i].eval_desc, eval_time:data[i].eval_time };
            datasource.push(rowdata);
            // console.log(JSON.stringify(rowdata));
        }
        this.setState({ data:datasource });
    })
    var urlMenu = urlip+'getBookChapter?course_id=1';
      NetUtil.get(urlMenu, '', (results) => {
              this.state.menu = results;
              console.log('menu:'+JSON.stringify(this.state.menu));
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
              this.setState({
                    menuHtml
              });                
    });            
    }
    renderColumn(data, index, text) {
        const { grade } = data[index];
        if (typeof grade === 'undefined') {
            return text;
        }
        return (<ModifyGradePage
            property = {data[index]}
            onSave = {
                (dataline) => this.onModify(index,dataline)
            }
        />);
    }
    onModify(index,dataline){
        const { data } = this.state;
        // console.log('add position:' + JSON.stringify(data));
        var url = urlip + 'evaluserkp';
        NetUtil.post(url, dataline, '', (results) => {
            data[index].grade = results[0].grade;
            data[index].eval_desc = results[0].eval_desc;
            data[index].eval_time = results[0].eval_time;
            this.setState({data});
        });       
    }
    handleClick(e) {
        console.log('Clicked: ', e);
        console.log('e.key: '+e.key);
        this.setState({ current: e.key },()=>{
            var data = [];
            var datasource = [];
            // var url = 'http://10.251.221.175/server/klmanager/getChapterKp?chapter_id=512';
            var url = urlip+'getChapterKp?chapter_id='+this.state.current;
            console.log('url:'+url);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            NetUtil.get(url, '', (results) => {
                data = results;
                console.log('data:'+JSON.stringify(data));
                for (var i = 0; i < data.length; i++) {
                    var rowdata = { key: data[i].kpid,kpindex: data[i].kpindex, kpname: data[i].kpname,grade:data[i].grade,eval_desc: data[i].eval_desc,eval_time:data[i].eval_time };
                    datasource.push(rowdata);
                    console.log('rowdata:'+JSON.stringify(rowdata));
                }   
                this.setState({ data:datasource }); 
                console.log('this.state.data1:'+JSON.stringify(this.state.data));
            })
            console.log('this.state.data2:'+JSON.stringify(this.state.data));
            // console.log('this.state.current2 : '+this.state.current);                         
        });
        // console.log('this.state.current1 : '+this.state.current);                  
    }


    render() {
        const columns = this.columns;
        var menu = this.state.menu;
        
        return ( < div >
            < Row >
            < Col lg = { 4 }
            md = { 6 }
            sm = { 24 }
            xs = { 24 } >
            < Menu onClick = { (e) => this.handleClick(e) }
            style = {
                { width: 240 } }
            defaultSelectedKeys = {
                [this.state.current] }
            defaultOpenKeys = {
                ['4'] }
            mode = "inline" >
            {this.state.menuHtml}
            </Menu >
            < /Col > < Col lg = { 20 }
            md = { 18 }
            sm = { 24 }
            xs = { 24 }
            style = {
                { padding: '50px' }
            }
            className = "main-container" >
            < div >
            < Table bordered  columns = { this.columns }
            dataSource = { this.state.data }
            /> < /div > < /Col> < /Row >< /div>
        );
    }
    }

    ReactDOM.render( < GradeView sytle = { Styles }
        />, document.getElementById('content'));
