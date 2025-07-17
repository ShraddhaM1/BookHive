import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
  Keyboard,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getResponse } from "../services/getResponse";

export default function ChatScreen() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [history, setHistory] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadChats = async () => {
      const stored = await AsyncStorage.getItem("chats");
      if (stored) {
        setChats(JSON.parse(stored));
      }
    };
    loadChats();
  }, [activeChatId]);

  useEffect(() => {
    const newHistory = messages.map((msg) => {
      return { role: msg.sender, parts: [{ text: msg.text }] };
    });
    setHistory(newHistory);
  }, [selectedChat, messages]);

  const saveChats = async (newChats) => {
    await AsyncStorage.setItem("chats", JSON.stringify(newChats));
    setChats(newChats);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput("");
    const response = await getResponse(input, history);
    const modelMsg = {
      text: response,
      sender: "model",
      timestamp: new Date().toISOString(),
    };
    const newMsgs = [...updatedMessages, modelMsg];
    setMessages(newMsgs);
    const updatedChats = chats.map((chat) =>
      chat.id === activeChatId ? { ...chat, messages: newMsgs } : chat
    );
    saveChats(updatedChats);
  };

  const createNewChat = () => {
    const id = Date.now().toString();
    const newChat = { id, name: "New Chat", messages: [], archived: false };
    const updated = [newChat, ...chats];
    saveChats(updated);
    setActiveChatId(id);
    setMessages([]);
  };

  const handleChatPress = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
  };

  const renameChat = (id) => {
    const name = prompt("Enter new name:");
    if (!name) return;
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, name } : chat
    );
    saveChats(updated);
  };

  const deleteChat = (id) => {
    Alert.alert("Confirm Delete", "Delete this chat?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updated = chats.filter((chat) => chat.id !== id);
          saveChats(updated);
          if (id === activeChatId) {
            setActiveChatId(null);
            setMessages([]);
          }
        },
      },
    ]);
  };

  const archiveChat = (id) => {
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, archived: true } : chat
    );
    saveChats(updated);
    if (id === activeChatId) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  const unarchiveChat = (id) => {
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, archived: false } : chat
    );
    saveChats(updated);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.user : styles.model,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/welcome_screen.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={50}
        >
          <View style={styles.chatList}>
            <TouchableOpacity style={styles.newChatBtn} onPress={createNewChat}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>

            <FlatList
              data={chats.filter((chat) => !chat.archived)}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.chatBtn,
                    activeChatId === item.id && styles.chatBtnActive,
                  ]}
                  onPress={() => handleChatPress(item)}
                  onLongPress={() => {
                    setSelectedChat(item);
                    setShowOptions(true);
                  }}
                >
                  <Text style={styles.chatBtnText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{ ...styles.messages, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {activeChatId && (
            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Ask anything..."
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <Modal visible={showOptions} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowOptions(false)}
            >
              <View style={styles.modalBox}>
                <TouchableOpacity
                  onPress={() => {
                    renameChat(selectedChat.id);
                    setShowOptions(false);
                  }}
                >
                  <Text style={styles.modalOption}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteChat(selectedChat.id);
                    setShowOptions(false);
                  }}
                >
                  <Text style={styles.modalOption}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    archiveChat(selectedChat.id);
                    setShowOptions(false);
                  }}
                >
                  <Text style={styles.modalOption}>Archive</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "light grey", // Soft white overlay for readability
  },
  container: { flex: 1 },
  chatList: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  newChatBtn: {
    flexDirection: "row",
    backgroundColor: "#020202",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
  },
  newChatText: { color: "#fff", marginLeft: 5, fontWeight: "bold" },
  chatBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
  },
  chatBtnActive: {
    backgroundColor: "#c9c9ff",
  },
  chatBtnText: { color: "#000" },
  messages: { padding: 10 },
  message: {
    marginVertical: 4,
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
  },
  user: {
    backgroundColor: "#dcdcff",
    alignSelf: "flex-end",
  },
  model: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  messageText: { color: "#000" },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputArea: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sendBtn: {
    backgroundColor: "#c9c0ff",
    padding: 10,
    marginLeft: 10,
    borderRadius: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 200,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 10,
    fontWeight: "bold",
    color: "#333",
  },
});
