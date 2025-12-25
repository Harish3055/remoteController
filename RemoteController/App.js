import React, { useEffect, useState, useRef } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import stylesContent from "./src/styles.json";

const styles = StyleSheet.create(stylesContent);

function RectButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function SquareButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.buttonSquare} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [socket, setSocket] = useState("");
  const [_, setStatus] = useState("");
  const searchInputRef = useRef(null);
  useEffect(() => {
    const ws = new WebSocket("wss://4577b19f-11a3-4cb8-9496-017d66144547-00-2vzaz8b5kpix4.spock.replit.dev");
    ws.onopen = () => console.log("✅ Connected to WebSocket");
    ws.onmessage = (msg) => {
      console.log("📩 From server:", msg.data);
      setStatus(msg.data);
    }
    ws.onerror = (err) => console.error("❌ WebSocket error", err.message);
    ws.onclose = () => console.log("❌ Disconnected");

    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
      console.log("➡️ Sent:", msg);
    }
  };
  const getMessage = () =>{
    return `search:${searchInputRef.current.value}`;
  }
  return (
    <>
      <View style={styles.body}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.row}>
            <TextInput
              ref={searchInputRef}
              placeholderTextColor="#bbb"
              style={styles.input}
              placeholder="Search in Chrome..."
              onSubmitEditing={(e) => sendMessage(`search:${e.nativeEvent.text}`)}
            />

            <View style={styles.squareBox}>
              <SquareButton title="🔍" onPress={() => sendMessage(getMessage())}/>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rectBox}>
              <RectButton title="▶ Play" onPress={() => sendMessage("play")} />
            </View>
            <View style={styles.rectBox}>
              <RectButton title="⏸ Pause" onPress={() => sendMessage("pause")} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.squareBox}>
              <SquareButton title="🔼" onPress={() => sendMessage("scroll_up")} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.squareBox}>
              <SquareButton title="⬅️" onPress={() => sendMessage("prev_tab")}/>
            </View>
            <View style={styles.squareBox}>
              <SquareButton title="🆗" onPress={() => sendMessage("ok")}/>
            </View>
            <View style={styles.squareBox}>
              <SquareButton title="➡️" onPress={() => sendMessage("next_tab")}/>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.squareBox}>
                <SquareButton title="🔽" onPress={() => sendMessage("scroll_down")} />
              </View>
          </View>
          <View style={styles.row}>
            <View style={styles.squareBox}>
                <SquareButton title="«|" onPress={() => sendMessage("fast_backward")} />
            </View>
            <View style={styles.squareBox}>
                <SquareButton title="|»" onPress={() => sendMessage("fast_forward")} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.squareBox}>
              <SquareButton title="➕" onPress={() => sendMessage("volume_up")}/>
            </View>
            <View style={styles.squareBox}>
              <SquareButton title="➖" onPress={() => sendMessage("volume_down")}/>
            </View>
            <View style={styles.squareBox}>
              <SquareButton title="❌" onPress={() => sendMessage("mute_toggle")}/>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.squareBox}>
              <SquareButton title="🔙" onPress={() => sendMessage("back")}/>
            </View>
            <View style={styles.squareBox}>
              <SquareButton title="🔄" onPress={() => sendMessage("reload")}/>
            </View>
            <View style={styles.squareBox}>
              <SquareButton title="🔜" onPress={() => sendMessage("forward")}/>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}