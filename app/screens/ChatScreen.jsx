import { StyleSheet, Text, View, } from 'react-native'
import React, { useState, useCallback, useLayoutEffect } from 'react'
import { Avatar, GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = () => {

    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        console.log('useLayoutEffect');

        setMessages(
            [
                {
                    "_id": "shreyu@redefine",
                    "createdAt": new Date(),
                    "text": "Hello Girish Chauhan",
                    "user": {
                        "_id": 'aditey@redefine.com',
                        "name": 'Aditey',
                        "avatar": "https://i.pravatar.cc/300"
                    }
                }
            ]
        );

    }, [])
    const onSend = useCallback((messages = []) => {

        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    })
    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={false}
            showUserAvatar={true}
            onSend={message => onSend(message)}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            textInputStyle={{
                backgroundColor: '#fff',
                borderRadius: 20,
            }}
            user={{
                _id: 'girish@redefine.com',
                avatar: 'https://i.pravatar.cc/300'

            }}
        />
    );
}

export default ChatScreen

const styles = StyleSheet.create({

})