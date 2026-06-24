import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

class VoiceService {
  recording = null;

  async requestPermissions() {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  }

  async startRecording() {
    const ok = await this.requestPermissions();
    if (!ok) throw new Error('Microphone permission denied');

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    this.recording = recording;
    return recording;
  }

  async stopRecording() {
    if (!this.recording) return null;
    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI();
    this.recording = null;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    return uri;
  }

  async transcribeAudio(audioUri) {
    if (!OPENAI_KEY || !audioUri) return '';
    try {
      const formData = new FormData();
      formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'audio.m4a' });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENAI_KEY}` },
        body: formData,
      });
      const d = await r.json();
      return d.text || '';
    } catch (e) {
      console.error('Whisper error:', e);
      return '';
    }
  }

  speak(text, onStart, onDone) {
    const clean = text.replace(/[*_#`\[\]]/g, '').replace(/\n/g, ' ');
    Speech.speak(clean, {
      language: 'en-US',
      pitch: 1.05,
      rate: 0.92,
      onStart: () => { onStart?.(); },
      onDone:  () => { onDone?.(); },
      onError: () => { onDone?.(); },
    });
  }

  stop() { Speech.stop(); }
}

export default new VoiceService();