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
    let url = target + '/getCourse';
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

export const codeChange = (code) => {
    return {
        type: 'CODE_CHANGE',
        code,
    }
}

const codeRenderSuccess = (data) => {
    return {
        type: 'CODE_RENDER',
        url: data.url,
        log: data.log,
        wavUrl: data.wavUrl,
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

//获取图片成功
const getMediaListSuccess = (json) => {
  return {
        type: 'GET_MEDIA_LIST_SUCCESS',
        json
    }
}

//获取图片成功
const searchMediaSuccess = (media_res) => {
  return {
        type: 'SEARCH_MEDIA_SUCCESS',
        media_res,
    }
}

//搜索url
export const searchMedia = (media_url) => {
    let url = target + '/searchMedia';
    console.log(media_url);
    return dispatch => {
        return axios.post(url, {media_url})
        .then(function (response) {
            dispatch(searchMediaSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
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
    const {title, answer, breakdown} = exercise;
    var longtext = '';
    longtext += title;
    longtext += JSON.stringify(answer);
    longtext += JSON.stringify(breakdown);
    console.log(longtext);

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

export const sampleValueChange = (sample_index, sample_key, sample_value) => {
    return {
        type: "SAMPLE_VALUE_CHANGE",
        sample_index,
        sample_key,
        sample_value,
    }
}

export const sampleSelect = (sample_select) => {
    return {
        type: "SAMPLE_SELECT",
        sample_select,
    }

}

//获取exercise
export const getExercise = (exercise_id) => {
    let url = target + '/getExercise';
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
            dispatch(getSampleKey(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取sample_list
export const getSampleList = (exercise_id) => {
    let url = target + '/getSampleList';
    return dispatch => {
        dispatch(getDataStart());
        return axios.get(url,{
            params:{
                exercise_id,
            }
        })
        .then(function (response) {
            dispatch(getSampleListSuccess(response.data));
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

//更新题目答案输入包括选择和填空
export const answerInputChange = (value, i) => {
    return {
        type: 'CHANGE_ANSWER_INPUT',
        value,
        i,
    }
}

//更新SAMPLE中参数值
export const sampleInputChange = (value, key, sample_select) => {
    return {
        type: 'CHANGE_SAMPLE_INPUT',
        value,
        key,
        sample_select,
    }
}

//更新参数题图（img）
export const titleSampleImgChange = (value, sample_select) => {
    return {
        type: 'CHANGE_SAMPLE_IMG',
        value,
        sample_select,
    }
}

//更新参数题图（audio）
export const titleSampleAudioChange = (value, sample_select) => {
    return {
        type: 'CHANGE_SAMPLE_AUDIO',
        value,
        sample_select,
    }
}

//更新参数题目答案
export const sampleAnswerChange = (value, i, sample_select) => {
    return {
        type: 'CHANGE_SAMPLE_ANSWER',
        value,
        i,
        sample_select,
    }
}

//更新题目选项答案
export const choiceSelectChange = (i) => {
    return {
        type: 'CHANGE_CHOICE_SELECT',
        i,
    }
}

//更新参数题目选项答案
export const choiceSampleSelectChange = (i,sample_select) => {
    return {
        type: 'CHANGE_CHOICE_SAMPLE_SELECT',
        sample_select,
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

//增加参数题答案
export const addSampleAnswer = (exercise_type,sample_select) => {
    return {
        type: 'ADD_SAMPLE_ANSWER',
        exercise_type: exercise_type,
        sample_select : sample_select,
    }
}

//删除答案
export const delAnswer = (exercise_type) => {
    return {
        type: 'DEL_ANSWER',
        exercise_type: exercise_type,
    }
}

//删除参数题答案
export const delSampleAnswer = (exercise_type,sample_select) => {
    return {
        type: 'DEL_SAMPLE_ANSWER',
        exercise_type: exercise_type,
        sample_select : sample_select,
    }
}

//更新答案图片url
export const answerImgChange = (i, value) => {
    return {
        type: 'CHANGE_CHOICE_IMG',
        i,
        value,
    }
}

//更新参数答案图片url
export const answerSampleImgChange = (i, sample_select, url) => {
    console.log(url);
    return {
        type: 'CHANGE_CHOICE_SAMPLE_IMG',
        i,
        sample_select,
        url,
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


//更新题目audio url
export const titleAudioChange = (url) => {
    return {
        type: 'CHANGE_TITLE_AUDIO',
        url,
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

//新增exercise_sample 到 list 中
export const addInSampleList = (exercise_sample) => {
  return {
        type: 'ADD_IN_SAMPLE_LIST',
        exercise_sample,
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
            let url = target + "/updateBreakdown";

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

export const updateTabKey = (tab_state) => {
    return{
        type: 'UPDATE_TAB',
        tab_state
    }
}

export const updateRadioKey = (radio_state) => {
    return{
        type: 'UPDATE_RADIO',
        radio_state
    }
}

export const modalCancel = () => {
    return {
        type: 'MODAL_CANCEL',
    }
}

export const modalOpen = () => {
    return {
        type: 'MODAL_OPEN',
    }
}


//添加一组题目参数
export const addOneSample = (exercise_sample) => {
    let url = target + '/addOneSample';
    return dispatch => {
        return axios.post(url,{exercise_sample: exercise_sample})
        .then(function (response) {
            dispatch(getSampleList(exercise_sample.exercise_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }     
}

export const codeRender = (code) => {
    let url = target + '/renderly';
    return dispatch => {
        return axios.post(url, {code: code})
        .then(function (response) {
            console.log(response.data);
            dispatch(codeRenderSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getMediaList = (tag) => {
    let url = target + '/queryMediaList';
    return dispatch => {
        return axios.post(url, {tag})
        .then(function (response) {
            dispatch(getMediaListSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getQiniuToken = () => {
    let url = target + '/getQiniuToken';
    return dispatch => {
        return  axios.get(url,{})
        .then(function (response) {
            dispatch({
                type: 'GET_QINIU_TOKEN',
                uptoken: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const saveTestMedia = (save_url,save_wav_url) => {
    let url = target + '/saveTestMedia';
    // console.log('saveTestMedia save_url:',save_url);
    // console.log('saveTestMedia save_wav_url:',save_wav_url);
    return dispatch => {
        return axios.post(url, {save_url,save_wav_url})
        .then(function (response) {
            console.log(response.data);
            dispatch(saveTestMediaSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const uploadimg = () => {
    let url = target + '/saveTestMedia';
    console.log(save_url);
    return dispatch => {
        return axios.post(url, {save_url})
        .then(function (response) {
            console.log(response.data);
            dispatch(saveTestMediaSuccess(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const saveUrlChange = (save_url) => {
    return{
        type: 'SAVE_URL_CHANGE',
        save_url,
    }
}

export const saveWavUrlChange = (save_wav_url) => {
    return{
        type: 'SAVE_WAV_URL_CHANGE',
        save_wav_url,
    }
}

export const saveModalOpen = (wav_url) => {
    let save_url = "http://cdn.zhiqiu.pro/" + new Date().getTime().toString() + ".png";
    var save_wav_url = '';
    console.log("saveModalOpen wav_url:",wav_url);
    if(wav_url){
        save_wav_url = "http://cdn.zhiqiu.pro/" + new Date().getTime().toString() + "midi.wav";
    }
    return{
        type: 'SAVE_MODAL_OPEN',
        save_url: save_url,
        save_wav_url: save_wav_url
    }
}

export const saveUploadUrl = (upload_url,courseid) => {
    let url = target + '/saveUploadUrl';
    return dispatch => {
        return axios.post(url, {upload_url,courseid})
        .then(function (response) {
            dispatch({
                type: 'SAVE_UPLOAD_URL',
                upload_url: upload_url,
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const delSelectedFile = (keys,tag) => {
    let url = target + '/deleteSelectedFile';
    return dispatch => {
        return axios.post(url, {keys})
        .then(function (response) {
            dispatch(getMediaList(tag));
            // dispatch({
            //     type: 'DELETE_SELECTED_FILE',
            // });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const saveModalCancel = () => {
    return{
        type: 'SAVE_MODAL_CANCEL',
    }
}

const saveTestMediaSuccess = (media_res) => {
    console.log(media_res);
    return {
        type: 'SAVE_TEST_MEDIA',
        media_res,
    }
}

//更新一组题目参数
export const updateOneSample = (exercise_sample) => {
    if(exercise_sample){
        console.log("updateOneSample exercise_sample ",JSON.stringify(exercise_sample));
        let url = target + '/updateOneSample';
        exercise_sample.sample = JSON.stringify(exercise_sample.sample);
        exercise_sample.answer = JSON.stringify(exercise_sample.answer);
        return dispatch => {
            return axios.post(url,{exercise_sample})
            .then(function (response) {
                alert("保存成功！");
                // dispatch(addOneSampleSuccess(response.data.exercise_id));
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }else{
        return dispatch => {
            alert("请先添加样本!"); 
        }
    }

}

//批量更新所有参数
export const updateAllSample = (sample_list) => {
    let url = target + '/updateAllSample';
    return dispatch => {
        return axios.post(url,{sample_list: sample_list})
        .then(function (response) {
            dispatch(getSampleList(sample_list[0].exercise_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }     
}

export const deleteSampleField = (key, sample_select) => {
    return (dispatch, getState) =>{
        alert("将删除所有样本的"+key+"项！");
        var {sample_list} = getState().exerciseData.toJS();
        console.log("sample_list before",JSON.stringify(sample_list));
        for(var i=0;i<sample_list.length;i++){
            delete sample_list[i].sample[key];
            sample_list[i].sample = JSON.stringify(sample_list[i].sample);
            sample_list[i].answer = JSON.stringify(sample_list[i].answer);
        }
        console.log("sample_list after",JSON.stringify(sample_list));
        dispatch(updateAllSample(sample_list));
        
    }
       
}

//upload Exercise
export const uploadExercise = () => {
    return (dispatch, getState) => {
        var {course_id, exercise} = getState().exerciseData.toJS();
        var {title, exercise_rating, exercise_type, answer, breakdown, exercise_id} = exercise;
        var mask = 0;
        var answer;
        if(!title || !exercise_rating){
            mask = 1;
        }
        console.log(mask);
        // switch(exercise_type){
        //     case 0:
        //         if(!mask && answer){
        //             for(var i = 0; i < answer.length; i++){
        //                 if(!answer[i].value){
        //                     mask = 2;
        //                     break;
        //                 }
        //             }
        //         }
        //         break;
        //     case 1:
        //         if(!mask && answer){
        //             for(var i = 0; i < answer.length; i++){
        //                 if(!answer[i].value){
        //                     mask = 2;
        //                     break;
        //                 }
        //             }
        //         }
        //         break;
        //     case 2:
        //         if(!mask && answer){
        //             for(var i = 0; i < answer.length; i++){
        //                 if(!answer[i].url){
        //                     mask = 2;
        //                     break;
        //                 }
        //             }
        //         }
        //         break;
        //     default: 
        //         break;
        // }

        if(!mask && breakdown){
            var flagc = 0;
            for(var i = 0; i < breakdown.length; i++){
                var b = breakdown[i];
                if(!b.content || !b.kpid){
                    mask = 3;
                    break;
                }
                if(b.checked){
                    flagc = flagc + 1;
                }
            }
            if(flagc == 0){
                mask = 4;
            }
        }

        if(!mask){
            dispatch(uploadExerciseStart());
            if(exercise_id > 0){
                //修改题目
                let url = target + "/updateExercise";
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
                let url = target + "/addExercise";
                // var exercise = {title: title, 
                //                 title_img_url: title_img_url, 
                //                 title_audio_url: title_audio_url, 
                //                 answer: answer, 
                //                 exercise_type: exercise_type, 
                //                 exercise_rating: exercise_rating, 
                //                 breakdown: breakdown};

                return axios.post(url,{exercise: exercise, course_id: course_id})
                .then(function (response) {
                    if(response.data.exercise_id){
                        dispatch(uploadExerciseSuccess(response.data.exercise_id));
                        alert("上传题目成功，题目id为" + response.data.exercise_id);
                    }else{
                        alert("上传题目失败，请重新上传!");
                    }
                    
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
                case 4:
                    alert("请选择知识点分解的主测点");
                    break;
            }
        }
    }
}

