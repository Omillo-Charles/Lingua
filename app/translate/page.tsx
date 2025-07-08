"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages, Mic, Volume2, Copy, RotateCcw, Loader2, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LANGUAGES } from '@/lib/languages';

interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);
  const { toast } = useToast();

  // Web Speech API support
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechRecognition(new SpeechRecognition());
      }
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem('linguaflow-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);

      // Add to history
      const newTranslation: Translation = {
        id: Date.now().toString(),
        sourceText,
        translatedText: data.translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date(),
      };

      const newHistory = [newTranslation, ...history.slice(0, 9)]; // Keep last 10
      setHistory(newHistory);
      localStorage.setItem('linguaflow-history', JSON.stringify(newHistory));

      toast({
        title: "Success",
        description: "Translation completed successfully",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const startListening = () => {
    if (!speechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);
    speechRecognition.lang = sourceLang;
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;

    speechRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSourceText(transcript);
      setIsListening(false);
    };

    speechRecognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Speech recognition failed. Please try again.",
        variant: "destructive"
      });
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    speechRecognition.start();
  };

  const stopListening = () => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string, lang: string) => {
    if (!speechSynthesis) {
      toast({
        title: "Error",
        description: "Speech synthesis not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Error",
        description: "Speech synthesis failed",
        variant: "destructive"
      });
    };

    speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI-Powered Translation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Translate text and speech between any languages instantly
        </p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Text Translation
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice Translation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Text Translation</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapLanguages}
                    disabled={isTranslating}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    disabled={isTranslating}
                  >
                    Clear
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Source Text</label>
                    <div className="flex gap-1">
                      {sourceText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakText(sourceText, sourceLang)}
                          disabled={isTranslating}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className="min-h-[200px] bg-white/50 dark:bg-gray-900/50"
                    disabled={isTranslating}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Translation</label>
                    <div className="flex gap-1">
                      {translatedText && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(translatedText, targetLang)}
                            disabled={isTranslating}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translatedText)}
                            disabled={isTranslating}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={translatedText}
                    readOnly
                    placeholder="Translation will appear here..."
                    className="min-h-[200px] bg-white/50 dark:bg-gray-900/50"
                  />
                </div>
              </div>

              <Button 
                onClick={handleTranslate}
                disabled={isTranslating || !sourceText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle>Voice Translation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Speak in</label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Translate to</label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isTranslating}
                    className={`w-20 h-20 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isListening ? 'Listening... Click to stop' : 'Click to start voice recording'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Recognized Text</label>
                    {sourceText && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(sourceText, sourceLang)}
                        disabled={isTranslating}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="min-h-[150px] p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                    {sourceText || <span className="text-gray-400">Speak to see text here...</span>}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Translation</label>
                    {translatedText && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakText(translatedText, targetLang)}
                          disabled={isTranslating}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(translatedText)}
                          disabled={isTranslating}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="min-h-[150px] p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                    {translatedText || <span className="text-gray-400">Translation will appear here...</span>}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleTranslate}
                disabled={isTranslating || !sourceText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Translate Speech
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Translation History */}
      {history.length > 0 && (
        <Card className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle>Recent Translations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.slice(0, 5).map((translation) => (
                <div key={translation.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {LANGUAGES.find(l => l.code === translation.sourceLang)?.name}
                      </Badge>
                      <span className="text-gray-400">→</span>
                      <Badge variant="secondary" className="text-xs">
                        {LANGUAGES.find(l => l.code === translation.targetLang)?.name}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {translation.sourceText}
                    </div>
                    <div className="text-sm font-medium">
                      {translation.translatedText}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(translation.translatedText)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}