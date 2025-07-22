import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoBtn(porps) {
    const router = useRouter();
    const { text } = porps;
  return (
    <button className="flex items-center gap-3" onClick={() => router.push("/")}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div>
      <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Marketeer
      </span>
        {text && (<h1 className="text-sm text-gray-600">
                    Profile & Settings
                  </h1>)}
    </div>
      
    </button>
  );
}
