import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
export default function Footer() {
return( 
<div className="fixed bottom-0 left-0 w-full z-50">
<motion.footer
          className="px-6 py-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Marketeer
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-600">
              <button className="hover:text-gray-900 transition-colors">
                Help
              </button>
              <button className="hover:text-gray-900 transition-colors">
                Privacy
              </button>
              <button className="hover:text-gray-900 transition-colors">
                Terms
              </button>
            </div>
          </div>
        </motion.footer>
        </div>
        );
}