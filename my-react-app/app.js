import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const socket = io('http://your-server-ip:4000'); // Replace with your server IP

const App = () => {
  const [myId, setMyId] = useState('');
  const [otherId, setOtherId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setMyId(socket.id);
    });

    socket.on('signal', (data) => {
      if (data.to === myId) {
        peer.signal(data.signal);
      }
    });

    const p = new SimplePeer({ initiator: true, trickle: false });
    p.on('signal', (signal) => {
      socket.emit('signal', { signal, to: otherId });
    });

    p.on('connect', () => {
      console.log('CONNECTED');
    });

    p.on('data', (data) => {
      setMessages((prevMessages) => [...prevMessages, data.toString()]);
    });

    setPeer(p);
  }, [myId, otherId]);

  const sendMessage = () => {
    peer.send(message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text>Your ID: {myId}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter other peer ID"
        value={otherId}
        onChangeText={setOtherId}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
      <View>
        {messages.map((msg, index) => (
          <Text key={index}>{msg}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default App; ('Asta chat')
