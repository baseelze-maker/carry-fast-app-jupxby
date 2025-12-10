
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as Haptics from "expo-haptics";

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hi! I saw your trip to London. Can you help me deliver some documents?',
    sender: 'other',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read',
  },
  {
    id: '2',
    text: 'Sure! I have 5kg available. What do you need to send?',
    sender: 'me',
    timestamp: new Date(Date.now() - 3500000),
    status: 'read',
  },
  {
    id: '3',
    text: 'Just some business documents, about 1.5kg. When do you arrive?',
    sender: 'other',
    timestamp: new Date(Date.now() - 3400000),
    status: 'read',
  },
  {
    id: '4',
    text: 'I arrive on February 15th at 10 AM. I can deliver to Central London.',
    sender: 'me',
    timestamp: new Date(Date.now() - 3300000),
    status: 'read',
  },
  {
    id: '5',
    text: 'Perfect! That works for me. What&apos;s your fee?',
    sender: 'other',
    timestamp: new Date(Date.now() - 3200000),
    status: 'read',
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const chatName = params.id || 'User';

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <IconSymbol 
            ios_icon_name="person.circle.fill" 
            android_material_icon_name="account-circle" 
            size={36} 
            color={colors.primary} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{chatName}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <IconSymbol 
            ios_icon_name="ellipsis.circle" 
            android_material_icon_name="more-vert" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <View
              style={[
                styles.messageWrapper,
                message.sender === 'me' ? styles.myMessageWrapper : styles.otherMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'me' ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'me' ? styles.myMessageText : styles.otherMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                <View style={styles.messageFooter}>
                  <Text
                    style={[
                      styles.messageTime,
                      message.sender === 'me' ? styles.myMessageTime : styles.otherMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                  {message.sender === 'me' && message.status && (
                    <View style={styles.statusContainer}>
                      {message.status === 'sent' && (
                        <IconSymbol 
                          ios_icon_name="checkmark" 
                          android_material_icon_name="check" 
                          size={12} 
                          color="rgba(255, 255, 255, 0.7)" 
                        />
                      )}
                      {message.status === 'delivered' && (
                        <IconSymbol 
                          ios_icon_name="checkmark.circle" 
                          android_material_icon_name="done-all" 
                          size={12} 
                          color="rgba(255, 255, 255, 0.7)" 
                        />
                      )}
                      {message.status === 'read' && (
                        <IconSymbol 
                          ios_icon_name="checkmark.circle.fill" 
                          android_material_icon_name="done-all" 
                          size={12} 
                          color={colors.secondary} 
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <IconSymbol 
            ios_icon_name="plus.circle.fill" 
            android_material_icon_name="add-circle" 
            size={28} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim().length === 0 && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={inputText.trim().length === 0}
        >
          <IconSymbol 
            ios_icon_name="arrow.up.circle.fill" 
            android_material_icon_name="send" 
            size={32} 
            color={inputText.trim().length > 0 ? colors.primary : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.success,
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  myMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: colors.textSecondary,
  },
  statusContainer: {
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 24,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  attachButton: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: colors.text,
    maxHeight: 80,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
