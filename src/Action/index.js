import NetUtil from '../utils/NetUtil'
import Config from '../utils/Config'
import {push} from 'react-router-redux'
import axios from 'axios';

let target = Config.server_url;

//获取Course成功
const getCourseSuccess = (json) => {
  return {
    type: 'GET_COURSE_SUCCESS',
    json,
  }
}

//获取course
export const getCourse = () => {
    let url = target + '/klmanager/getCourse';
    return dispatch => {
        dispatch(getDataStart());
        //加载course信息
        return axios.get(url,{})
        .then(function (response) {
            console.log('course');
            console.log(response.data);
            dispatch(getCourseSuccess(response.data));
        })
        .catch(function (error) {
            console.log('course error');
            console.log(error);
        });
    }
}

//开始题目数据
const getDataStart = () => {
  return {
    type: 'GET_DATA_START',
  }
}

//获取题目成功
const getExerciseSuccess = (json) => {
  return {
        type: 'GET_EXERCISE_SUCCESS',
        json
    }
}

//获取参数组成功
const getSampleListSuccess = (json) => {
  return {
        type: 'GET_SAMPLE_LIST_SUCCESS',
        json
    }
}

function getTitleParam(text){
    var params = [];
    text.replace(/(\@.*?\@)/g, function(word){
       //去掉首尾两个@
       word = word.substring(1, word.length - 1);
       params.push(word);
    });
    return params;
}

function getAnswerParam(textarray){
    var textarray = eval(textarray);
    var params = [];
    for(let i=0;i<textarray.length;i++){
        textarray[i].value.replace(/(\@.*?\@)/g, function(word){
           //去掉首尾两个@
           word = word.substring(1, word.length - 1);
           params.push(word);
        });
    }
    
    return params;
}

function getBreakdownParam(textarray){
    var params = [];
    for(let i=0;i<textarray.length;i++){
        textarray[i].content.replace(/(\@.*?\@)/g, function(word){
           //去掉首尾两个@
           word = word.substring(1, word.length - 1);
           params.push(word);
        });
    }
    
    return params;
}


// const getSampleKeys = (exercise) => {
//     const {title,answer,breakdown} = exercise;
//     let sample_key = {};

//     var titlekey_json = {};
//     var title_key = getTitleParam(title);
//     for(let i=0;i<title_key.length;i++){
//         titlekey_json[title_key[i]] = 'title';
//     }
//     console.log("titlekey_json: "+JSON.stringify(titlekey_json));

//     var answerkey_json = {};
//     var answer_key = getAnswerParam(answer);
//     for(let i=0;i<answer_key.length;i++){
//         answerkey_json[answer_key[i]] = 'answer';
//     }
//     console.log("answerkey_json: "+JSON.stringify(answerkey_json));

//     var breakdownkey_json = {};
//     var breakdown_key = getBreakdownParam(breakdown);
//     for(let i=0;i<breakdown_key.length;i++){
//         breakdownkey_json[breakdown_key[i]] = 'breakdown';
//     }
//     console.log("breakdown_key: "+JSON.stringify(breakdownkey_json));
    
// }

export const getSampleKey = (exercise) => {
    const {title,answer,breakdown} = exercise;
    var longtext = '';
    longtext += title;
    longtext += answer;
    longtext += JSON.stringify(breakdown);

    var totalkey_json = {};
    var total_key = getTitleParam(longtext);
    for(let i=0;i<total_key.length;i++){
        totalkey_json[total_key[i]] = 'total';
    }
    console.log("totalkey_json: "+JSON.stringify(totalkey_json));
    return {
        type: "GET_SAMPLE_KEY",
        totalkey_json,
    }
}

//选取course
export const courseSelect = (course_id) => {
    return {
        type: "COURSE_SELECT",
        course_id: parseInt(course_id),
    }
}

//获取exercise
export const getExercise = (exercise_id) => {
    let url = target + '/klmanager/getExercise';
    return dispatch => {
        dispatch(getDataStart());
        //加载已有题目信息
        return axios.get(url,{
            params:{
                exercise_id,
            }
        })
        .then(function (response) {
            dispatch(getExerciseSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取sample_list
export const getSampleList = (exercise_id) => {
    let url = target + '/klmanager/getSampleList';
    return dispatch => {
        dispatch(getDataStart());
        return axios.get(url,{
            params:{
                exercise_id,
            }
        })
        .then(function (response) {
            dispatch(getSampleListSuccess(response.data));
            if(response.data){//如果有参数组
              dispatch(getSampleKey(response.data));  
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


//改变题目类型
export const exerciseTypeChange = (exercise_type) => {
    return {
        type: 'CHANGE_EXERCISE_TYPE',
        exercise_type: parseInt(exercise_type),
    }
}

//更新题目选择输入
export const choiceInputChange = (value, i) => {
    return {
        type: 'CHANGE_CHOICE_INPUT',
        value,
        i,
    }
}

//更新题目选项答案
export const choiceSelectChange = (i) => {
    return {
        type: 'CHANGE_CHOICE_SELECT',
        i,
    }
}

//更新填空答案
export const blankInputChange = (value, i) => {
    return {
        type: 'CHANGE_BLANK_INPUT',
        value,
        i,
    }
}

//增加答案
export const addAnswer = (exercise_type) => {
    return {
        type: 'ADD_ANSWER',
        exercise_type: exercise_type,
    }
}

//删除答案
export const delAnswer = (exercise_type) => {
    return {
        type: 'DEL_ANSWER',
        exercise_type: exercise_type,
    }
}

//更新答案图片url
export const answerImgChange = (i, url) => {
    console.log(url);
    return {
        type: 'CHANGE_CHOICE_IMG',
        i,
        url,
    }
}

export const choiceImgSelectChange = (i) => {
    return {
        type: 'CHANGE_CHOICE_IMG_SELECT',
        i,
    }
}

export const choiceImgRemove = (i) => {
    return {
        type: 'REMOVE_CHOICE_IMG',
        i,
    }
}

//更新题目标题
export const titleChange = (title) => {
    return {
        type: 'TITLE_CHANGE',
        title,
    }
}

//更新题目图片url
export const titleImgChange = (url) => {
    return {
        type: 'CHANGE_TITLE_IMG',
        url,
    }
}

//删除题目图片url
export const titleImgRemove = () => {
    return {
        type: 'REMOVE_TITLE_IMG',
    }
}

//更新题目audio url
export const titleAudioChange = (url) => {
    return {
        type: 'CHANGE_TITLE_AUDIO',
        url,
    }
}

//删除题目音频url
export const titleAudioRemove = () => {
    return {
        type: 'REMOVE_TITLE_AUDIO',
    }
}

//更新breakdown_input
export const inputChangeBreakdown = (content, i) => {
    return {
        type: 'CHANGE_INPUT_BREAKDOWN',
        i,
        content,
    }
}

//更新breakdown_presn
export const presnChangeBreakdown = (presn, i) => {
    return {
        type: 'CHANGE_PRESN_BREAKDOWN',
        i,
        content,
    }
}

//更新breakdown_check
export const checkChangeBreakdown = (checked, i) => {
    return {
        type: 'CHANGE_CHECK_BREAKDOWN',
        i,
        checked,
    }
}

export const addBreakdown = (newData) => {
    return {
        type: 'ADD_BREAKDOWN',
        newData,
    }
}

export const delBreakdown = () => {
    return {
        type: 'DEL_BREAKDOWN',
    }
}

//更新breakdown_kp
export const selectKpBreakdown = (selectOption, i) => {
    return {
        type: 'SELECT_KP_BREAKDOWN',
        kpid: selectOption[2].kpid,
        kpname: selectOption[2].kpname,
        i,
    }
}

//更新breakdown难度
export const changeRatingBreakdown = (rating, i) => {
    return {
        type: 'CHANGE_RATING_BREAKDOWN',
        rating,
        i,
    }
}

//更新题目breakdown
export const updateBreakdown = (breakdown) => {
    return {
    	type: 'UPDATE_BREAKDOWN',
    	breakdown,
    }
}

export const changeRatingExercise = (rating) => {
    return {
        type: 'CHANGE_RATING_EXERCISE',
        rating,
    }
}

//开始题目数据
const uploadExerciseStart = () => {
  return {
    type: 'UPLOAD_EXERCISE_START',
  }
}

//获取题目成功
const uploadExerciseSuccess = (exercise_id) => {
  return {
        type: 'UPLOAD_EXERCISE_SUCCESS',
        exercise_id,
    }
}

//upload Breakdown
export const uploadBreakdown = (exercise_id, breakdown) => {
    return (dispatch) => {
        var mask = 0;
        if(exercise_id == 0){
            mask = 1;
        }
        if(!mask && breakdown){
            for(var i = 0; i < breakdown.length; i++){
                const b = breakdown[i];
                if(!b.content || !b.kpid ){
                    mask = 3;
                    break;
                }
            }
        }
        if(!mask){
            let url = target + "/klmanager/updateBreakdown";

            return axios.post(url,{exercise_id: exercise_id, breakdown: breakdown})
            .then(function (response) {
                alert("更新题目成功！");
                // dispatch(getExerciseSuccess(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

        }else{
            if(mask == 1)
                alert("请先保存题目！");
            else alert("知识分解未填写完整");
        }
    }
}

export const updateMenu = (menu_state) => {
    return{
        type: 'UPDATE_MENU',
        menu_state
    }
}


//添加一组题目参数
export const addOneSample = (sample, index, exercise_id) => {
    let url = target + '/klmanager/addOneSample';
    return dispatch => {
        return axios.post(url,{sample: sample, sample_index: index, exercise_id: exercise_id})
        .then(function (response) {
            // dispatch(addOneSampleSuccess(response.data.exercise_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }     
}

//更新一组题目参数
export const updateOneSample = (sample, index, exercise_id) => {
    let url = target + '/klmanager/updateOneSample';
    return dispatch => {
        return axios.post(url,{sample: sample, sample_index: index, exercise_id: exercise_id})
        .then(function (response) {
            // dispatch(addOneSampleSuccess(response.data.exercise_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }     
}

//批量更新所有参数
export const updateAllSample = (sample_list) => {
    let url = target + '/klmanager/updateAllSample';
    return dispatch => {
        return axios.post(url,{sample_list: sample_list})
        .then(function (response) {
            // dispatch(addOneSampleSuccess(response.data.exercise_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }     
}


//upload Exercise
export const uploadExercise = () => {
    return (dispatch, getState) => {
        var {course_id, blankAnswer, choiceAnswer, choiceImgAnswer, exercise} = getState().exerciseData.toJS();
        var {title, exercise_rating, exercise_type, breakdown} = exercise;
        var mask = 0;
        var answer;
        if(!title || !exercise_rating){
            mask = 1;
        }
        console.log(mask);
        switch(exercise_type){
            case 0:
                if(!mask && blankAnswer){
                    for(var i = 0; i < blankAnswer.length; i++){
                        if(!blankAnswer[i].value){
                            mask = 2;
                            break;
                        }
                    }
                    answer = blankAnswer;
                }
                break;
            case 1:
                if(!mask && choiceAnswer){
                    for(var i = 0; i < choiceAnswer.length; i++){
                        if(!choiceAnswer[i].value){
                            mask = 2;
                            break;
                        }
                    }
                    answer = choiceAnswer;
                }
                break;
            case 2:
                if(!mask && choiceImgAnswer){
                    for(var i = 0; i < choiceImgAnswer.length; i++){
                        if(!choiceImgAnswer[i].url){
                            mask = 2;
                            break;
                        }
                    }
                    console.log("choiceImgAnswer");
                    answer = choiceImgAnswer;
                }
                break;
            default: 
                break;
        }

        if(!mask && breakdown){
            for(var i = 0; i < breakdown.length; i++){
                const b = breakdown[i];
                if(!b.content || !b.kpid){
                    mask = 3;
                    break;
                }
            }
        }

        exercise.answer = answer;

        if(!mask){
            dispatch(uploadExerciseStart());
            if(exercise_id > 0){
                //修改题目
                let url = target + "/klmanager/updateExercise";
                // var exercise = {exercise_id: exercise_id, 
                //                 title: title, 
                //                 title_img_url: title_img_url, 
                //                 title_audio_url: title_audio_url, 
                //                 answer: answer, 
                //                 exercise_type: exercise_type, 
                //                 exercise_rating: exercise_rating, 
                //                 breakdown: breakdown};
                return axios.post(url,{exercise: exercise})
                .then(function (response) {
                    dispatch(uploadExerciseSuccess(response.data.exercise_id));
                    alert("更新题目成功！");
                })
                .catch(function (error) {
                    console.log(error);
                });

            }else{
                //新增题目
                let url = target + "/klmanager/addExercise";
                // var exercise = {title: title, 
                //                 title_img_url: title_img_url, 
                //                 title_audio_url: title_audio_url, 
                //                 answer: answer, 
                //                 exercise_type: exercise_type, 
                //                 exercise_rating: exercise_rating, 
                //                 breakdown: breakdown};

                return axios.post(url,{exercise: exercise, course_id: course_id})
                .then(function (response) {
                    dispatch(uploadExerciseSuccess(response.data.exercise_id));
                    alert("上传题目成功，题目id为" + response.data.exercise_id);
                })
                .catch(function (error) {
                    console.log(error);
                });

            }
        }
        else{
            switch(mask){
                case 1: 
                    alert("题干信息未填写完整");
                    break;
                case 2:
                    alert("答案信息未填写完整");
                    break;
                case 3:
                    alert("知识分解未填写完整");
                    break;
            }
        }
    }
}

