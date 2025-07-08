"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, Mic, Type, Globe, Zap, Shield, Download } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Powered by Gemini AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Break Language Barriers
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Translate any language to any other language with AI-powered precision. 
            Voice translation, text translation, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/translate">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Languages className="w-5 h-5 mr-2" />
                Start Translating
              </Button>
            </Link>
            {isInstallable && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleInstallClick}
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900"
              >
                <Download className="w-5 h-5 mr-2" />
                Install App
              </Button>
            )}
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">English</div>
                <div className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  Hello, how are you today?
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">Spanish</div>
                <div className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  Hola, ¿cómo estás hoy?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Powerful Translation Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Advanced AI-powered translation with voice support, multiple languages, and seamless user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Type className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Text Translation</CardTitle>
              <CardDescription>
                Translate text between any languages with high accuracy using advanced AI models.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Voice Translation</CardTitle>
              <CardDescription>
                Speak in any language and get instant voice translations with speech recognition.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle>100+ Languages</CardTitle>
              <CardDescription>
                Support for over 100 languages with automatic language detection capabilities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Get instant translations powered by Google's Gemini AI with optimized performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your translations are processed securely with no data storage on our servers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Progressive Web App</CardTitle>
              <CardDescription>
                Install on any device for offline access and native app-like experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Connect with the World?
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Start translating now and break down language barriers in real-time.
              </p>
              <Link href="/translate">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Languages className="w-5 h-5 mr-2" />
                  Start Translating Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}