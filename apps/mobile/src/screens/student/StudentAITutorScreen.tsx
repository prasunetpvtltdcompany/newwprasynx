import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, fontSize, spacing, borderRadius, shadows } from '../../theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SUGGESTIONS = [
  'Explain Binary Search Tree',
  'What is OS and its types?',
  'Help me with DSA question',
  'How does DBMS normalization work?'
];

export function StudentAITutorScreen() {
  const { student, user } = useAuthStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const studentName = student?.full_name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'Rohan';

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Here is a detailed explanation regarding "${trimmed}":\n\nIn your current curriculum, this is a core concept. In a full production build, this assistant queries your course materials, lecture notes, and assignments to give context-aware explanations. Let me know if you would like to explore specific practice queries!`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.safeContainer} edges={['top']}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>AI Tutor</Text>
        </View>

        {messages.length === 0 ? (
          <ScrollView contentContainerStyle={styles.welcomeContainer} showsVerticalScrollIndicator={false}>
            <View style={[styles.botIconWrap, { backgroundColor: '#F3F0FF' }]}>
              <Ionicons name="logo-android" size={48} color="#6D4CFF" />
            </View>
            <Text style={[styles.welcomeGreeting, { color: colors.text }]}>Hi {studentName}! 👋</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>How can I help you today?</Text>

            <View style={styles.suggestionsGrid}>
              {SUGGESTIONS.map((suggestion, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.suggestionBubble, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
                  onPress={() => handleSend(suggestion)}
                >
                  <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color="#6D4CFF" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.sender === 'user' ? styles.userRow : styles.aiRow,
                ]}
              >
                {msg.sender === 'ai' && (
                  <View style={[styles.avatarCircle, { backgroundColor: '#6D4CFF' }]}>
                    <Ionicons name="logo-android" size={16} color="#FFF" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === 'user'
                      ? { backgroundColor: '#6D4CFF', borderBottomRightRadius: 4 }
                      : { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.borderLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      { color: msg.sender === 'user' ? '#FFF' : colors.text },
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      { color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.textMuted },
                    ]}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
            {isTyping && (
              <View style={[styles.messageRow, styles.aiRow]}>
                <View style={[styles.avatarCircle, { backgroundColor: '#6D4CFF' }]}>
                  <Ionicons name="logo-android" size={16} color="#FFF" />
                </View>
                <View style={[styles.messageBubble, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderLight, borderBottomLeftRadius: 4 }]}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, { backgroundColor: colors.textMuted }]} />
                    <View style={[styles.typingDot, { backgroundColor: colors.textMuted, opacity: 0.6 }]} />
                    <View style={[styles.typingDot, { backgroundColor: colors.textMuted, opacity: 0.3 }]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.borderLight }]}
            placeholder="Ask anything..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: inputText.trim() ? '#6D4CFF' : colors.borderLight }]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color={inputText.trim() ? '#FFF' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeContainer: { flex: 1 },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  welcomeContainer: { flex: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  botIconWrap: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  welcomeGreeting: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  welcomeSubtitle: { fontSize: fontSize.md, fontWeight: '500', marginBottom: spacing.xxl },
  suggestionsGrid: { width: '100%', gap: spacing.md },
  suggestionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  suggestionText: { fontSize: fontSize.sm, fontWeight: '600', flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.md, paddingBottom: spacing.lg },
  messageRow: { flexDirection: 'row', marginBottom: spacing.md, maxWidth: '85%' },
  userRow: { alignSelf: 'flex-end' },
  aiRow: { alignSelf: 'flex-start' },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm, marginTop: 4 },
  messageBubble: { padding: spacing.md, borderRadius: borderRadius.xl, maxWidth: '100%' },
  messageText: { fontSize: fontSize.sm, lineHeight: 20 },
  messageTime: { fontSize: 9, marginTop: spacing.xs, alignSelf: 'flex-end', fontWeight: '500' },
  typingDots: { flexDirection: 'row', gap: 4, paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: fontSize.sm,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
