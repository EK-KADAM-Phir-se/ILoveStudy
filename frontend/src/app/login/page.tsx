import Login from '../components/Login';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 hover:border-slate-700/30 transition-all duration-300">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(79,70,229,0.15)]">
            ILoveStudy
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Access your ultimate exam preparation workspace
          </p>
        </div>
        <Login />
      </div>
    </div>
  );
}