import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Row, Col, Menu, Select, Button, Popconfirm, Input } from 'antd';
import NetUtil from './utils/NetUtil';
import Styles from './view.css';
import { AddKpPage } from './FormInput2.js';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

class EditableCell extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: this.props.value,
                editable: this.props.editable || false,
            };
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.editable !== this.state.editable) {
                this.setState({ editable: nextProps.editable });
                if (nextProps.editable) {
                    this.cacheValue = this.state.value;
                }
            }
            if (nextProps.status && nextProps.status !== this.props.status) {
                if (nextProps.status === 'save') {
                    this.props.onChange(this.state.value);
                } else if (nextProps.status === 'cancel') {
                    this.setState({ value: this.cacheValue });
                    this.props.onChange(this.cacheValue);
                }
            }
        }
        
        shouldComponentUpdate(nextProps, nextState) {
            return nextProps.editable !== this.state.editable ||
                nextState.value !== this.state.value;
        }
        handleChange(e) {
            const value = e.target.value;
            this.setState({ value });
        }
        render() {
            const { value, editable } = this.state;
            return ( < div className = "editable-cell" > {
                    editable ?
                    < div className = "editable-cell-input-wrapper" >
                    < Input
                    value = { value }
                    onChange = {
                        (e) => this.handleChange(e)
                    }
                    /> < /div > :
                        < div className = "editable-cell-text-wrapper" > { value.toString() || ' ' } < /div>
                } < /div>);
            }
        }

        class ViewEdit extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { data: [], isedit: [] };
                    this.columns = [{
                        title: '知识点id',
                        dataIndex: 'kpid',
                        width: '10%',
                        visible: 'false',
                    }, {
                        title: '序号',
                        dataIndex: 'kpindex',
                        width: '10%',
                        render: (text, record, index) => this.renderColumns(this.state.isedit, index, 'kpindex', text),
                    }, {
                        title: '知识点名称',
                        dataIndex: 'kpname',
                        width: '25%',
                        render: (text, record, index) => this.renderColumns(this.state.isedit, index, 'kpname', text),
                    }, {
                        title: '备注',
                        dataIndex: 'description',
                        width: '40%',
                        render: (text, record, index) => this.renderColumns(this.state.isedit, index, 'description', text),
                    }, {
                        title: 'Action',
                        dataIndex: 'action',
                        render: (text, record, index) => {
                            const editable = this.state.isedit[index].editable;
                            console.log('1:' + this.state.isedit[index].editable);
                            console.log('action:' + JSON.stringify(this.state));
                            console.log('index:' + index + ' editable:' + editable);
                            return ( < div className = "editable-row-operations" > {
                                    editable ?
                                    < span >
                                    < a onClick = {
                                        () => this.editDone(index, 'save')
                                    } > Save < /a> < Popconfirm title = "Sure to cancel?"
                                    onConfirm = {
                                        () => this.editDone(index, 'cancel')
                                    } >
                                    < a > Cancel < /a> < /Popconfirm > < /span> : < span > < span > < a onClick = {
                                    () => this.edit(index)
                                } > Edit < /a> < /span > < span className = "ant-divider" / >
                                < span >
                                < Popconfirm title = "Sure to delete?"
                                onConfirm = {
                                    () => this.onDelete(index)
                                } >
                                < a href = "#" > Delete < /a> < /Popconfirm > < /span> < /span >
                            } < /div>);
                        },
                    }];
                    var data = [];
                    var datasource = [];
                    var url = 'http://10.251.221.175/server/klmanager/getChapterKp?chapter_id=512';
                    NetUtil.get(url, '', (results) => {
                        data = results;
                        console.log(JSON.stringify(data));
                        var isedit = new Array([data.length]);
                        console.log(data.length);
                        for (var i = 0; i < data.length; i++) {
                            var rowdata = { key: i, kpid: data[i].kpid, kpindex: data[i].kpindex, kpname: data[i].kpname, description: data[i].description };
                            datasource.push(rowdata);
                            console.log(JSON.stringify(rowdata));
                            isedit[i] = { editable: false };
                        }
                        this.state.data = datasource;
                        this.state.isedit = isedit;
                        console.log("fetch");
                        this.setState({ datasource });
                    })
                    var urlMenu = 'http://10.251.221.175/server/klmanager/getBookChapter?course_id=2';
                      NetUtil.get(urlMenu, '', (results) => {
                              this.state.menu = results;
                              console.log(this.state.menu);
                              var menuHtml = results.map(function(bookmenu,index,input) {
                              var chaEl = [];
                              var chmenu = bookmenu.chapters;
                              for(var j = 0; j < chmenu.length; j++) {
                                    chaEl.push(<Menu.Item key={(index*chmenu.length+j+1).toString()}>{chmenu[j].chaptername}</Menu.Item>);
                              }
                              return(
                                    <SubMenu key={"sub"+index} title={<span><Icon type="mail" /><span>{bookmenu.bookname}</span></span>}>
                                        {chaEl}
                                    </SubMenu>
                                )
                              })
                              this.setState({
                                    menuHtml
                              });
                    
                    });

                    
                    //this.state.menu = [{ "bookid": 4, "bookname": "高中数学必修一", "chapters": [{ "chapterid": 512, "chaptername": "函数与集合" }] }];
                }
                

                renderColumns(isedit, index, key, text) {
                    const { editable, status } = isedit[index];
                    if (typeof editable === 'undefined') {
                        return text;
                    }
                    return ( < EditableCell editable = { editable }
                        value = { text }
                        onChange = { value => this.handleChange(key, index, value) }
                        status = { status }
                        />);
                    }
                    handleChange(key, index, value) {
                        const { data } = this.state;
                        data[index][key] = value;
                        this.setState({ data });
                    }
                    onDelete(index) {
                        const { data } = this.state;
                        var url = 'http://10.251.221.175/server/klmanager/delete';
                        var kpid = { kpid: data[index].kpid };
                        console.log('delete kpid:' + JSON.stringify(kpid));
                        NetUtil.post(url, kpid, '', (results) => { console.log(results); })
                        data.splice(index, 1);
                        this.setState({ data });
                    }
                    handleAdd(dataline) {
                        const { data, isedit } = this.state;
                        console.log('add position:' + JSON.stringify(data));
                        const newIsedit = { editable: false };
                        var url = 'http://10.251.221.175/server/klmanager/add';
                        NetUtil.post(url, dataline, '', (results) => {
                            console.log('add dataline:' + JSON.stringify(dataline));
                            const newData = {
                                key: data.length,
                                kpid: results.kpid,
                                kpindex: dataline.form.kpindex,
                                kpname: dataline.form.kpname,
                                description: dataline.form.description,
                            };
                            console.log('newData:' + JSON.stringify(newData));
                            console.log(results);
                            this.setState({
                                data: [...data, newData],
                                isedit: [...isedit, newIsedit],
                            });
                        });
                    }
                    edit(index) {
                        const { isedit } = this.state;
                        isedit[index].editable = true;
                        this.setState({ isedit });
                        console.log(JSON.stringify(isedit));
                    }
                    editDone(index, type) {
                        const { data, isedit } = this.state;
                        console.log("this.state:" + JSON.stringify(this.state));
                        console.log("data -1:" + JSON.stringify(isedit));
                        isedit[index].editable = false;
                        isedit[index].status = type;
                        this.setState({ data }, () => {
                            delete isedit[index].status;
                            if (type === 'save') {
                                const dataline = data[index];
                                console.log("dataline:" + JSON.stringify(dataline));
                                var url = 'http://10.251.221.175/server/klmanager/modify';
                                NetUtil.post(url, dataline, '', (results) => { console.log(results); })
                            }
                        });
                    }
                    handleClick(e) {
                        console.log('Clicked: ', e);
                        this.setState({ current: e.key });
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
                            < Menu onClick = { this.handleClick }
                            style = {
                                { width: 240 } }
                            defaultSelectedKeys = {
                                ['1'] }
                            defaultOpenKeys = {
                                ['sub1'] }
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
                            < AddKpPage style = {
                                { float: 'left' }
                            }
                            onCreate = {
                                (dataline) => this.handleAdd(dataline)
                            }
                            /> < Table columns = { this.columns }
                            dataSource = { this.state.data }
                            /> < /div > < /Col> < /Row > < /div>
                        );
                    }
                }

                ReactDOM.render( < ViewEdit sytle = { Styles }
                        />, document.getElementById('content'));
