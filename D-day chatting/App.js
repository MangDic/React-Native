import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Setting from './Setting.js'

import AsyncStorage from '@react-native-async-storage/async-storage'; 
export default class App extends React.Component {
  constructor(props) { // state 구현
    super(props);
    this.state = {
      dday:new Date(),
      ddayTitle: '테스트 디데이',
      chatInput: '',
      chatLog: [],
      settingModal:false,
    }
  }
  async UNSAFE_componentWillMount() {
    try {
      const ddayString = await AsyncStorage.getItem('@dday');
      const chatLogString = await AsyncStorage.getItem('@chat');

      if(chatLogString == null){
        this.setState({chatLog: []});
      } else {
        const chatLog = JSON.parse(chatLogString);
        this.setState({chatLog: chatLog});
      }

      if(ddayString == null){
        this.setState(
          {
            dday: new Date(),
            ddayTitle: '',
          }
        );
      } else {
        const dday = JSON.parse(ddayString);
        this.setState(
          {
            dday: new Date(dday.date),
            ddayTitle: dday.title,
          }
        );
      }
    } catch(e) {
      console.log("ERR");
    }
}

  toggleSettingModal() {
    this.setState({
      settingModal: !this.state.settingModal
    })
  }

  chatHandler() {
    this.setState({
      chatLog: [ ...this.state.chatLog, this.makeDateString() + ' : ' + this.state.chatInput],
      chatInput: '',
    },async ()=>{
      const chatLogString = JSON.stringify(this.state.chatLog);
      await AsyncStorage.setItem('@chat', chatLogString);
    });
  }

  settingHandler(title, date) {
    this.setState({
      ddayTitle: title,
      dday: date,
    })
    this.toggleSettingModal();
  }

  makeDateString() {
    return this.state.dday.getFullYear() + '년 ' + (this.state.dday.getMonth()+1) + '월 ' + this.state.dday.getDate() + '일';
  }
  makeRemainString() {
    const distance = new Date().getTime() - this.state.dday.getTime();
    console.log(new Date(), this.state.dday,distance / (1000 * 60 * 60 * 24) )
    const remain = Math.floor(distance / (1000 * 60 * 60 * 24));
    if(remain < 0) {
      return 'D'+remain;
    } else if (remain > 0) {
      return 'D+'+remain;
    } else if (remain === 0) {
      return 'D-day';
    }
  }
  //함수 작성
  makeRemainString() {
    const distance = new Date().getTime() - this.state.dday.getTime();
    console.log(new Date(), this.state.dday,distance / (1000 * 60 * 60 * 24) )
    const remain = Math.floor(distance / (1000 * 60 * 60 * 24));
    if(remain < 0) {
      return 'D'+remain;
    } else if (remain > 0) {
      return 'D+'+remain;
    } else if (remain === 0) {
      return 'D-day';
    }
  }

  async settingHandler(title, date) {
    this.setState({
      ddayTitle: title,
      dday: date,
    });
    
    //저장루틴 추가
   try {
     const dday = {
       title: title,
       date: date,
     }
     const ddayString = JSON.stringify(dday);
     await AsyncStorage.setItem('@dday', ddayString);
   } catch (e) {
     console.log(e);
   }
    this.toggleSettingModal();
  }

  render() {
    return (
        <View style={styles.container}>
           <ImageBackground
      style={{width:'100%', height: '100%'}}
      source={require('./images/background.png')}>
        <View style={styles.settingView}>
        <TouchableOpacity onPress={()=>this.toggleSettingModal()}>
            <Image source={require('./icon/setting.png')}/>
          </TouchableOpacity>

        </View>
        <View style={styles.ddayView}>
          <Text style={styles.titleText}>
            {this.state.ddayTitle}까지
          </Text>
          <Text style={styles.ddayText}>
            {this.makeRemainString()}
          </Text>
          <Text style={styles.dateText}>
            {this.makeDateString()}
          </Text>

        </View>
        <View style={styles.chatView}>
        <ScrollView style={styles.chatScrollView}>
            {this.state.chatLog.map((chat)=>{
              return <Text style={styles.chat}>{chat}</Text>
            })}
          </ScrollView>
          <View style={styles.chatControl}>
          <TextInput style={
            styles.chatInput}
            value={this.state.chatInput}
            onChangeText={(changedText)=>{
              this.setState({chatInput: changedText})}
            }/>
          <TouchableOpacity
              style={styles.sendBtn}
              onPress={()=>this.chatHandler()}
            >
            <Text>
              전송
            </Text>
          </TouchableOpacity>
          </View>
        </View>
        {this.state.settingModal ?
            <Setting
              modalHandler={()=>this.toggleSettingModal()}
              settingHandler={(title, date)=>this.settingHandler(title, date)}/> //settingHandler추가
            : <></>}
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingView: {
    flex: 1,
    justifyContent:'center',
    alignItems:'flex-end',
    marginRight: '1%',
    marginTop:'15%',
  },
  ddayView: {
    flex: 6, // 비율
    justifyContent:'center',
    alignItems:'center',
  },
  chatView: {
    flex: 6,
    justifyContent:'center',
    marginBottom: '15%',
  },
  titleText: {
    alignSelf : 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A4A4A',

  },
  ddayText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  dateText: {
    alignSelf: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  sendBtn: {
    backgroundColor: 'rgb(97,99,250)',
    height: 40,
    width: 50,
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  chatInput: {
    backgroundColor: 'white',
    width: '75%',
    height: 40,
    borderWidth: 1,
    borderColor: '#a5a5a5',
    borderRadius: 20,
  },
  chatControl:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  chatScrollView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(201,201,201,0.7)',
    borderRadius: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: '#a5a5a5',
  },
  chat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    margin: 2,
  },

});