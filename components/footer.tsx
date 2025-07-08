import { Languages, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Languages className="w-4 h-4" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LinguaFlow
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for global communication</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            © 2025 LinguaFlow. Powered by Google Gemini AI. <span className="font-semibold text-blue-600 dark:text-blue-400">Built with OMYTECH</span>
          </p>
        </div>
      </div>
    </footer>
  );
}