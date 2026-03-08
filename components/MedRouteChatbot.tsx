import React, { useMemo, useRef, useState } from 'react';

type Intent = 'DONATE' | 'RECEIVE' | 'NGO' | 'DELIVERY' | 'GOV' | 'UNKNOWN';
type Language = 'EN' | 'HI';

type ReceiverStep = 'NONE' | 'ASK_NAME' | 'ASK_LOCATION' | 'CONFIRM';
type DonorStep = 'NONE' | 'ASK_PHOTO' | 'ASK_HANDOFF';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

interface Props {
  onDonate: () => void;
  onRequest: () => void;
  onNGO: () => void;
  onGov: () => void;
  onDelivery: () => void;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

const containsHindi = (text: string) => /[\u0900-\u097F]/.test(text);

const detectIntent = (text: string): Intent => {
  const input = text.toLowerCase();

  if (['donate', 'i want to donate', 'extra medicines', 'unused medicine', 'give medicine', 'दान', 'have extra medicines'].some((k) => input.includes(k))) return 'DONATE';
  if (['need medicine', 'i need medicine', 'require medicine', 'medicine chahiye', 'मुझे दवा चाहिए', 'दवा चाहिए', 'request medicine'].some((k) => input.includes(k))) return 'RECEIVE';
  if (['ngo', 'become ngo partner', 'organization partner', 'एनजीओ'].some((k) => input.includes(k))) return 'NGO';
  if (['delivery partner', 'deliver medicines', 'rider', 'driver', 'courier', 'डिलीवरी'].some((k) => input.includes(k))) return 'DELIVERY';
  if (['government analytics', 'gov analytics', 'policy data', 'सरकारी'].some((k) => input.includes(k))) return 'GOV';

  return 'UNKNOWN';
};

const MedRouteChatbot: React.FC<Props> = ({ onDonate, onRequest, onNGO, onGov, onDelivery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('EN');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      from: 'bot',
      text: 'Hello! 👋 I am your MedRoute assistant. You can type or tap 🎙️ and speak. I support English and हिंदी. How can I help today?',
    },
  ]);
  const [activeIntent, setActiveIntent] = useState<Intent>('UNKNOWN');
  const [receiverStep, setReceiverStep] = useState<ReceiverStep>('NONE');
  const [donorStep, setDonorStep] = useState<DonorStep>('NONE');
  const [medicineName, setMedicineName] = useState('');

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const localized = useMemo(
    () => ({
      placeholder: language === 'HI' ? 'अपना संदेश लिखें या 🎙️ दबाकर बोलें…' : 'Type your message or tap 🎙️ to speak…',
      send: language === 'HI' ? 'भेजें' : 'Send',
      voice: language === 'HI' ? 'आवाज़' : 'Voice',
      welcome:
        language === 'HI'
          ? 'नमस्ते! मैं MedRoute सहायक हूँ। आप लिखकर या बोलकर बात कर सकते हैं। बताएं, आपको दवा चाहिए या दान करना है?'
          : 'Hi! I am your MedRoute assistant. You can type or speak with me. Would you like to request medicine or donate medicine?',
    }),
    [language]
  );

  const speakText = (text: string, lang: Language) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    utterance.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const botReply = (text: string, lang: Language = language) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'bot', text }]);
    speakText(text, lang);
  };

  const resetFlow = () => {
    setReceiverStep('NONE');
    setDonorStep('NONE');
    setMedicineName('');
  };

  const routeIntent = (intent: Intent, lang: Language) => {
    setActiveIntent(intent);
    resetFlow();

    if (intent === 'DONATE') {
      setDonorStep('ASK_PHOTO');
      botReply(
        lang === 'HI'
          ? 'बहुत अच्छा 🙏 मैं धीरे-धीरे मदद करूंगा। पहले दवा के पैकेट की पीछे वाली साइड का फोटो अपलोड करें, ताकि हम दवा का नाम और एक्सपायरी सुरक्षित तरीके से सत्यापित कर सकें।'
          : 'Wonderful 🙏 I will guide you step-by-step. First, please upload a clear photo of the back side of the medicine packet so we can safely verify the medicine details and expiry.',
        lang
      );
      return;
    }

    if (intent === 'RECEIVE') {
      setReceiverStep('ASK_NAME');
      botReply(
        lang === 'HI'
          ? 'बिलकुल, मैं आपकी मदद करूंगा। पहले दवा का नाम बताइए। अगर नाम पक्का नहीं है, तो जितना याद हो उतना लिख दीजिए।'
          : 'Of course, I am here to help. First, please tell me the medicine name. If you are unsure, share whatever you remember.',
        lang
      );
      return;
    }

    if (intent === 'NGO') {
      botReply(lang === 'HI' ? 'बहुत बढ़िया! मैं आपको NGO पार्टनर रजिस्ट्रेशन फ्लो में भेज रहा हूँ।' : 'Great! I am routing you to the NGO partner registration flow.', lang);
      onNGO();
      return;
    }

    if (intent === 'DELIVERY') {
      botReply(lang === 'HI' ? 'धन्यवाद! मैं आपको Delivery Partner onboarding में भेज रहा हूँ।' : 'Thanks! I am routing you to Delivery Partner onboarding.', lang);
      onDelivery();
      return;
    }

    if (intent === 'GOV') {
      botReply(lang === 'HI' ? 'मैं आपको Government analytics dashboard पर ले जा रहा हूँ।' : 'I am routing you to the Government analytics dashboard.', lang);
      onGov();
      return;
    }

    botReply(
      lang === 'HI'
        ? 'कोई बात नहीं, मैं मदद के लिए हूँ। आप ऐसे लिख सकते हैं: “मुझे दवा चाहिए”, “मैं दान करना चाहता हूँ”, “NGO पार्टनर”, “Delivery Partner”, या “Government analytics”.'
        : 'No problem, I am here to help. You can say: “I need medicine”, “I want to donate”, “NGO partner”, “Delivery partner”, or “Government analytics”.',
      lang
    );
  };

  const handleSendText = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const lang: Language = containsHindi(text) ? 'HI' : language;
    setLanguage(lang);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), from: 'user', text }]);
    setInput('');

    if (activeIntent === 'RECEIVE' && receiverStep === 'ASK_NAME') {
      setMedicineName(text);
      setReceiverStep('ASK_LOCATION');
      botReply(lang === 'HI' ? 'धन्यवाद। अब अपना स्थान बताएं, जैसे शहर, इलाका या पिनकोड।' : 'Thank you. Now please share your location, such as city, area, or PIN code.', lang);
      return;
    }

    if (activeIntent === 'RECEIVE' && receiverStep === 'ASK_LOCATION') {
      setReceiverStep('CONFIRM');
      botReply(
        lang === 'HI'
          ? `कृपया पुष्टि करें:\n1) दवा: ${medicineName}\n2) स्थान: ${text}\n\nअगर सही है तो “पुष्टि” लिखें।`
          : `Please confirm:\n1) Medicine: ${medicineName}\n2) Location: ${text}\n\nIf this is correct, type “confirm”.`,
        lang
      );
      return;
    }

    if (activeIntent === 'RECEIVE' && receiverStep === 'CONFIRM') {
      if (text.toLowerCase().includes('confirm') || text.includes('पुष्टि')) {
        botReply(
          lang === 'HI'
            ? 'आपका अनुरोध बन गया है ✅\nअगले कदम:\n1) उपलब्ध स्टॉक मिलान\n2) निकटतम NGO/हब असाइन\n3) डिलीवरी ETA SMS\n\nमैं आपको request portal पर ले जा रहा हूँ।'
            : 'Your request is created ✅\nNext steps:\n1) Availability matching\n2) Nearest NGO/hub assignment\n3) Delivery ETA by SMS\n\nRouting you to the medicine request portal now.',
          lang
        );
        onRequest();
      } else {
        botReply(lang === 'HI' ? 'ठीक है, कोई बात नहीं। कृपया दवा का नाम फिर से बताएं।' : 'That is okay. Please share the medicine name again.', lang);
        setReceiverStep('ASK_NAME');
      }
      return;
    }

    if (activeIntent === 'DONATE' && donorStep === 'ASK_PHOTO') {
      if (text.toLowerCase().includes('upload') || text.toLowerCase().includes('photo') || text.includes('फोटो')) {
        setDonorStep('ASK_HANDOFF');
        botReply(
          lang === 'HI'
            ? 'बहुत बढ़िया! अब एक विकल्प चुनें:\n1) Doorstep pickup schedule\n2) पास के MedRoute dropbox पर drop'
            : 'Perfect! Now choose one option:\n1) Schedule doorstep pickup\n2) Drop medicine at a nearby MedRoute dropbox',
          lang
        );
      } else {
        botReply(
          lang === 'HI'
            ? 'पहले कृपया पैकेट के पीछे की फोटो अपलोड करें (या “photo uploaded” लिखें)।'
            : 'Please upload the back-side photo first (or type “photo uploaded”).',
          lang
        );
      }
      return;
    }

    if (activeIntent === 'DONATE' && donorStep === 'ASK_HANDOFF') {
      const pickup = text.toLowerCase().includes('pickup') || text.toLowerCase().includes('doorstep') || text.includes('पिकअप');
      botReply(
        pickup
          ? lang === 'HI'
            ? 'Doorstep pickup चुना गया। मैं donor workflow खोल रहा हूँ, जहाँ आप तारीख और समय चुन सकते हैं।'
            : 'Doorstep pickup selected. I am opening donor workflow where you can choose date and time.'
          : lang === 'HI'
            ? 'अच्छा विकल्प। कृपया nearest MedRoute dropbox चुनें। मैं donor workflow खोल रहा हूँ।'
            : 'Nice option. Please choose your nearest MedRoute dropbox. Opening donor workflow now.',
        lang
      );
      onDonate();
      return;
    }

    routeIntent(detectIntent(text), lang);
  };

  const startVoiceInput = () => {
    const SpeechRecognitionClass = (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike; SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      || (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike; SpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      botReply(language === 'HI' ? 'इस ब्राउज़र में voice input उपलब्ध नहीं है। आप टाइप करके जारी रख सकते हैं।' : 'Voice input is not available in this browser. You can continue by typing.', language);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      setIsListening(false);
      handleSendText(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      botReply(language === 'HI' ? 'आवाज़ सुनने में दिक्कत हुई। कृपया फिर से बोलें या टाइप करें।' : 'I could not hear that clearly. Please try speaking again or type your message.', language);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            botReply(localized.welcome, language);
          }
        }}
        className="fixed bottom-8 right-8 z-[80] bg-sky-600 hover:bg-sky-500 text-white rounded-full px-5 py-3 shadow-2xl font-bold text-sm"
      >
        {isOpen ? 'Close Chat' : 'MedRoute Chat'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-[92vw] max-w-md bg-[#081421] border border-white/10 rounded-3xl shadow-2xl z-[80] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-black tracking-tight">MedRoute Conversational Assistant</h3>
              <p className="text-xs text-slate-400 mt-1">Speech-first (🎙️) • English + हिंदी • Elder-friendly</p>
            </div>
            <button
              onClick={() => setVoiceEnabled((prev) => !prev)}
              className="text-[11px] px-3 py-1 rounded-full border border-white/15 text-slate-200 hover:bg-white/10"
            >
              {localized.voice}: {voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="h-80 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  message.from === 'bot' ? 'bg-white/10 text-slate-100' : 'ml-auto bg-sky-600 text-white'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
            <button
              onClick={startVoiceInput}
              className={`px-3 py-2 rounded-xl text-sm font-bold ${isListening ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/15'}`}
            >
              {isListening ? 'Listening…' : '🎙️'}
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSendText(input)}
              placeholder={localized.placeholder}
              className="flex-1 bg-[#030a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button onClick={() => handleSendText(input)} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold">
              {localized.send}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MedRouteChatbot;
