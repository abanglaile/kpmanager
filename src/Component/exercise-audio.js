import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ExerciseAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isPlay: false};
  }

  componentDidMount(){
      var audioNode = ReactDOM.findDOMNode(this.refs.audio),
          playNode = ReactDOM.findDOMNode(this.refs.play),
          timeline = ReactDOM.findDOMNode(this.refs.timeline),
          playhead = ReactDOM.findDOMNode(this.refs.playhead),
          timeCurrent = ReactDOM.findDOMNode(this.refs.timeCurrent),
          timeDuration = ReactDOM.findDOMNode(this.refs.timeDuration),
          timelineWidth = timeline.offsetWidth - playhead.offsetWidth,
          that = this,
          duration;
      
      // 是否能够不停下来进行缓冲的情况下持续播放指定的音频/视频
      function canplaythrough(){
        duration = audioNode.duration;
      }

      // 播放进度
      function timeUpdate() {
        var playPercent = timelineWidth * (audioNode.currentTime / duration);
        playhead.style.webkitTransform  = "translateX("+playPercent + "px)";
        playhead.style.transform = "translateX("+playPercent + "px)";
        if (audioNode.currentTime == duration) {
            that.setState({
                isPlay: false
            })
        }
        timeCurrent = '00:'+ formatTime(audioNode.currentTime);
      }

      // 得到初始数据
      function loadedmetadata() {
        timeDuration = '00:'+ formatTime(audioNode.duration);
        timeCurrent = '00:00';
      }

      this.loadedmetadata = loadedmetadata;

      // 进度条点击
      function timelineClick(e) {
          // 更新坐标位置
          var newLeft = e.pageX - timeline.offsetLeft;
          if (newLeft >= 0 && newLeft <= timelineWidth) {
              playhead.style.transform = "translateX("+ newLeft +"px)";
          }
          if (newLeft < 0) {
              playhead.style.transform = "translateX(0)";
          }
          if (newLeft > timelineWidth) {
              playhead.style.transform = "translateX("+ timelineWidth + "px)";
          }
          // 更新时间
          audioNode.currentTime = duration * (e.pageX - timeline.offsetLeft) / timelineWidth;
      }

      // 监听事件
      audioNode.addEventListener("loadedmetadata", that.loadedmetadata);
      audioNode.addEventListener("timeupdate", that.timeUpdate);
      audioNode.addEventListener("canplaythrough", that.canplaythrough);
      timeline.addEventListener("click", that.timelineClick);
  }
    

  componentWillUnmount() {
      var audioNode = ReactDOM.findDOMNode(this.refs.audio),
          timeline = ReactDOM.findDOMNode(this.refs.timeline);

      // 注销事件
      audioNode.removeEventListener("loadedmetadata", this.loadedmetadata);
      audioNode.removeEventListener("timeupdate", () => this.timeUpdate);
      audioNode.removeEventListener("canplaythrough", this.canplaythrough);
      timeline.removeEventListener("click", this.timelineClick);
  }

  play(){
      var audioNode = ReactDOM.findDOMNode(this.refs.audio);
      this.setState({
          isPlay: !this.state.isPlay
      })
      if (!this.state.isPlay) {
          audioNode.play();
      } else { // pause music
          audioNode.pause();
      }
  }

  render() {
      return (
          <div className="audio-wrap"> 
              <audio ref="audio" src={this.props.audioUrl} preload="metadata" controls />
              <i ref="play" className={"icon-play" + (this.state.isPlay ? " pause" : "")} onClick={(e) => this.play()}></i>
              <div ref="timeline" className="timeline">
                  <div ref="playhead" className="playhead"></div>
              </div>
              <div className="time-num">
                  <span ref="timeCurrent" className="num-current">00:00</span> / <span ref="timeDuration" className="num-duration">00:00</span>
              </div>
          </div>
      )
  }
}


