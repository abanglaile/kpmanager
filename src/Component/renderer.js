import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import katex from 'katex';
// import {InlineMath,BlockMath} from 'react-katex';

export default class Tex extends React.Component {
  constructor(props) { 
    super(props);
    // console.log('props.content:'+props.content);
    this.state = {content: props.content, sample: props.sample};
    this.onChange = this.onChange.bind(this);
  }

  onChange(val){
    console.log(val);
  }

  componentWillReceiveProps(nextProps) {
    const {content} = nextProps;
    this.setState({content});
  }

  replaceSample(content, sample){
    var new_content = content;
    if(sample){
      new_content = content.replace(/(\@.*?\@)/g, function(word){
        //去掉首尾两个@
        const newword = word.substring(1, word.length - 1);
        return sample[newword] ? sample[newword] : word;
      }) 
    }
    return new_content;
  }

  render() { 
    var { style, content, sample } = this.props;
    // content = content ? content.toString() : '';
    content = this.replaceSample(content, sample);
    content = content.replace(/\n/g,"<br/>");
    var htmlContent = content.replace(/(\$.*?\$)/g, function(word){
        //去掉首尾两个$
        word = word.substring(1, word.length - 1);
        // try{
        // return  <InlineMath math={word} />; 
        var res = katex.renderToString(word, {
            throwOnError: false
        });
        // }catch(e){
        //   // return ('请查看两个$符号间是不是漏了啥，点确定后继续修改:\n'+e);
        //   return e;
        // }
        return res;
        // return word;
      }
    );


    // htmlContent = htmlContent.replace(/\r\n/g,"<br/>");
    // htmlContent = htmlContent.replace(/\n/g,"<br/>");
    // console.log("after replace",htmlContent);
    return (
        // <Component  html={htmlContent} />
      <div style={{font: "18px/1.4 proxima-nova, Helvetica Neue, Arial, Helvetica, sans-serif" }} dangerouslySetInnerHTML={{__html: htmlContent}} />
      );
  }
}
// var content = "题目：@c = \\pm\\sqrt{a^2 + b^2}@，请问答案是多少？";
// ReactDOM.render(<Tex content = {content} />, document.getElementById('root'));