// 🎤 Voice Interface Integration System
// Immediate Improvement: Speech recognition and text-to-speech capabilities

class VoiceInterfaceManager {
	constructor() {
		this.isSupported = this.checkBrowserSupport();
		this.isListening = false;
		this.isSpeaking = false;

		// Speech recognition setup
		this.recognition = null;
		this.synthesis = window.speechSynthesis;

		// Voice configuration
		this.voiceConfig = {
			language: "zh-TW",
			rate: 0.9,
			pitch: 1.0,
			volume: 0.8,
			voice: null,
		};

		// Recognition configuration
		this.recognitionConfig = {
			continuous: false,
			interimResults: true,
			maxAlternatives: 3,
			language: "zh-TW",
		};

		// Command patterns for voice control
		this.voiceCommands = {
			start: ["開始", "你好", "嗨", "hello", "hi"],
			stop: ["停止", "結束", "stop", "暫停"],
			repeat: ["重複", "再說一遍", "repeat", "重說"],
			louder: ["大聲一點", "音量大", "louder", "大聲"],
			quieter: ["小聲一點", "音量小", "quieter", "小聲"],
			faster: ["快一點", "快速", "faster", "加速"],
			slower: ["慢一點", "慢速", "slower", "減速"],
			clear: ["清除", "重新開始", "clear", "清空"],
		};

		// Initialize system
		this.initialize();
	}

	// Check browser support for speech APIs
	checkBrowserSupport() {
		const hasRecognition =
			"webkitSpeechRecognition" in window ||
			"SpeechRecognition" in window;
		const hasSynthesis = "speechSynthesis" in window;

		console.log(
			`🎤 語音支援狀態: 語音識別=${hasRecognition}, 語音合成=${hasSynthesis}`
		);

		return {
			recognition: hasRecognition,
			synthesis: hasSynthesis,
			full: hasRecognition && hasSynthesis,
		};
	}

	// Initialize voice interface
	async initialize() {
		if (!this.isSupported.full) {
			console.warn("⚠️ 瀏覽器不完全支援語音功能");
			return false;
		}

		try {
			// Initialize speech recognition
			this.setupSpeechRecognition();

			// Initialize speech synthesis
			await this.setupSpeechSynthesis();

			// Setup voice commands
			this.setupVoiceCommands();

			console.log("✅ 語音介面初始化完成");
			return true;
		} catch (error) {
			console.error("🚨 語音介面初始化錯誤:", error);
			return false;
		}
	}

	// Setup speech recognition
	setupSpeechRecognition() {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			throw new Error("Speech Recognition not supported");
		}

		this.recognition = new SpeechRecognition();

		// Configure recognition
		Object.assign(this.recognition, this.recognitionConfig);

		// Setup event handlers
		this.recognition.onstart = () => {
			this.isListening = true;
			this.onListeningStart();
		};

		this.recognition.onresult = (event) => {
			this.handleSpeechResult(event);
		};

		this.recognition.onend = () => {
			this.isListening = false;
			this.onListeningEnd();
		};

		this.recognition.onerror = (event) => {
			console.error("🚨 語音識別錯誤:", event.error);
			this.onRecognitionError(event);
		};

		this.recognition.onnomatch = () => {
			console.warn("⚠️ 無法識別語音");
			this.onNoMatch();
		};
	}

	// Setup speech synthesis
	async setupSpeechSynthesis() {
		if (!this.synthesis) {
			throw new Error("Speech Synthesis not supported");
		}

		// Wait for voices to load
		await this.waitForVoices();

		// Find best Chinese voice
		this.voiceConfig.voice = this.findBestChineseVoice();

		if (!this.voiceConfig.voice) {
			console.warn("⚠️ 找不到中文語音，使用預設語音");
		}
	}

	// Wait for voices to be available
	waitForVoices() {
		return new Promise((resolve) => {
			const voices = this.synthesis.getVoices();
			if (voices.length > 0) {
				resolve(voices);
			} else {
				this.synthesis.onvoiceschanged = () => {
					resolve(this.synthesis.getVoices());
				};
			}
		});
	}

	// Find the best Chinese voice
	findBestChineseVoice() {
		const voices = this.synthesis.getVoices();

		// Preferred voice order
		const preferredVoices = ["zh-TW", "zh-CN", "zh-HK", "zh", "Chinese"];

		for (const preferred of preferredVoices) {
			const voice = voices.find(
				(v) =>
					v.lang.includes(preferred) ||
					v.name.toLowerCase().includes("chinese") ||
					v.name.toLowerCase().includes("mandarin")
			);
			if (voice) return voice;
		}

		return voices[0]; // Fallback to first available voice
	}

	// Setup voice commands recognition
	setupVoiceCommands() {
		this.commandPatterns = new Map();

		Object.entries(this.voiceCommands).forEach(([command, patterns]) => {
			patterns.forEach((pattern) => {
				this.commandPatterns.set(pattern.toLowerCase(), command);
			});
		});
	}

	// Start listening for speech
	startListening(options = {}) {
		if (!this.isSupported.recognition || this.isListening) {
			return false;
		}

		try {
			// Apply any custom options
			if (options.continuous !== undefined) {
				this.recognition.continuous = options.continuous;
			}
			if (options.interimResults !== undefined) {
				this.recognition.interimResults = options.interimResults;
			}

			this.recognition.start();
			console.log("🎤 開始語音識別...");
			return true;
		} catch (error) {
			console.error("🚨 無法開始語音識別:", error);
			return false;
		}
	}

	// Stop listening
	stopListening() {
		if (this.isListening && this.recognition) {
			this.recognition.stop();
			console.log("🛑 停止語音識別");
		}
	}

	// Speak text using TTS
	speak(text, options = {}) {
		if (!this.isSupported.synthesis || this.isSpeaking) {
			return false;
		}

		try {
			// Stop any current speech
			this.synthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);

			// Apply configuration
			utterance.voice = this.voiceConfig.voice;
			utterance.rate = options.rate || this.voiceConfig.rate;
			utterance.pitch = options.pitch || this.voiceConfig.pitch;
			utterance.volume = options.volume || this.voiceConfig.volume;
			utterance.lang = options.language || this.voiceConfig.language;

			// Setup event handlers
			utterance.onstart = () => {
				this.isSpeaking = true;
				this.onSpeechStart(text);
			};

			utterance.onend = () => {
				this.isSpeaking = false;
				this.onSpeechEnd();
			};

			utterance.onerror = (event) => {
				this.isSpeaking = false;
				console.error("🚨 語音合成錯誤:", event.error);
				this.onSpeechError(event);
			};

			this.synthesis.speak(utterance);
			console.log("🔊 開始語音播放:", text.substring(0, 50) + "...");
			return true;
		} catch (error) {
			console.error("🚨 語音播放失敗:", error);
			return false;
		}
	}

	// Stop speaking
	stopSpeaking() {
		if (this.isSpeaking) {
			this.synthesis.cancel();
			this.isSpeaking = false;
			console.log("🛑 停止語音播放");
		}
	}

	// Handle speech recognition results
	handleSpeechResult(event) {
		let finalTranscript = "";
		let interimTranscript = "";

		for (let i = event.resultIndex; i < event.results.length; i++) {
			const transcript = event.results[i][0].transcript;

			if (event.results[i].isFinal) {
				finalTranscript += transcript;
			} else {
				interimTranscript += transcript;
			}
		}

		// Handle interim results
		if (interimTranscript) {
			this.onInterimResult(interimTranscript);
		}

		// Handle final results
		if (finalTranscript) {
			console.log("🎤 語音識別結果:", finalTranscript);

			// Check for voice commands first
			const command = this.detectVoiceCommand(finalTranscript);
			if (command) {
				this.executeVoiceCommand(command, finalTranscript);
			} else {
				this.onFinalResult(finalTranscript);
			}
		}
	}

	// Detect voice commands in speech
	detectVoiceCommand(text) {
		const lowerText = text.toLowerCase().trim();

		for (const [pattern, command] of this.commandPatterns) {
			if (lowerText.includes(pattern)) {
				return command;
			}
		}

		return null;
	}

	// Execute voice commands
	executeVoiceCommand(command, originalText) {
		console.log(`🎯 執行語音指令: ${command}`);

		switch (command) {
			case "stop":
				this.stopListening();
				this.stopSpeaking();
				break;

			case "repeat":
				this.onRepeatRequest();
				break;

			case "louder":
				this.adjustVolume(0.1);
				break;

			case "quieter":
				this.adjustVolume(-0.1);
				break;

			case "faster":
				this.adjustRate(0.1);
				break;

			case "slower":
				this.adjustRate(-0.1);
				break;

			case "clear":
				this.onClearRequest();
				break;

			default:
				// If command not handled, treat as regular input
				this.onFinalResult(originalText);
		}
	}

	// Adjust speech volume
	adjustVolume(delta) {
		this.voiceConfig.volume = Math.max(
			0,
			Math.min(1, this.voiceConfig.volume + delta)
		);
		console.log(
			`🔊 音量調整至: ${Math.round(this.voiceConfig.volume * 100)}%`
		);
	}

	// Adjust speech rate
	adjustRate(delta) {
		this.voiceConfig.rate = Math.max(
			0.5,
			Math.min(2, this.voiceConfig.rate + delta)
		);
		console.log(
			`⚡ 語速調整至: ${Math.round(this.voiceConfig.rate * 100)}%`
		);
	}

	// Get voice interface status
	getStatus() {
		return {
			isSupported: this.isSupported,
			isListening: this.isListening,
			isSpeaking: this.isSpeaking,
			voiceConfig: this.voiceConfig,
			availableVoices: this.synthesis
				? this.synthesis.getVoices().length
				: 0,
		};
	}

	// Event handlers (to be overridden by implementing class)
	onListeningStart() {
		// Override in implementation
		console.log("🎤 開始聆聽...");
	}

	onListeningEnd() {
		// Override in implementation
		console.log("🎤 停止聆聽");
	}

	onInterimResult(transcript) {
		// Override in implementation
		console.log("🔄 臨時結果:", transcript);
	}

	onFinalResult(transcript) {
		// Override in implementation
		console.log("✅ 最終結果:", transcript);
	}

	onSpeechStart(text) {
		// Override in implementation
		console.log("🔊 開始播放語音");
	}

	onSpeechEnd() {
		// Override in implementation
		console.log("🔊 語音播放完成");
	}

	onRecognitionError(event) {
		// Override in implementation
		console.error("🚨 語音識別錯誤:", event.error);
	}

	onSpeechError(event) {
		// Override in implementation
		console.error("🚨 語音播放錯誤:", event.error);
	}

	onNoMatch() {
		// Override in implementation
		console.warn("⚠️ 無法識別語音內容");
	}

	onRepeatRequest() {
		// Override in implementation
		console.log("🔄 請求重複");
	}

	onClearRequest() {
		// Override in implementation
		console.log("🗑️ 請求清除");
	}

	// Utility methods
	isVoiceInputSupported() {
		return this.isSupported.recognition;
	}

	isVoiceOutputSupported() {
		return this.isSupported.synthesis;
	}

	getAvailableVoices() {
		if (!this.synthesis) return [];
		return this.synthesis.getVoices().map((voice) => ({
			name: voice.name,
			lang: voice.lang,
			isDefault: voice.default,
			isLocal: voice.localService,
		}));
	}

	// Test voice functionality
	async testVoice() {
		console.log("🧪 測試語音功能...");

		if (this.isSupported.synthesis) {
			await this.speak("語音測試成功！Smart-Chat3 語音系統已準備就緒。");
		}

		if (this.isSupported.recognition) {
			console.log("🎤 請說話測試語音識別...");
			this.startListening();
		}
	}
}

export default VoiceInterfaceManager;
