import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, socialLogin } from '../services/authService';
import toast, { Toaster } from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, Loader2 } from 'lucide-react';
import { auth, googleProvider } from "../firebase"; 
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const errorStyle = {
    style: { border: '1px solid #ff4b4b', padding: '16px', color: '#ff4b4b', fontWeight: 'bold' },
    iconTheme: { primary: '#ff4b4b', secondary: '#FFFAEE' },
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await socialLogin({
        email: user.email,
        full_name: user.displayName,
        avatar: user.photoURL
      });

      toast.success(`Chào mừng ${user.displayName}!`);
      navigate('/');
    } catch (err) {
      toast.error("Đăng nhập Google thất bại hoặc đã bị hủy.", errorStyle);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(credentials);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Sai tài khoản hoặc mật khẩu.', errorStyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Đăng nhập</h1>
          <p className="mt-2 text-slate-500 font-medium">Hệ thống PhuongAnh Marine Rope</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Mail size={16} className="text-blue-500" /> Email
            </label>
            <input 
              type="email" required value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 focus:border-blue-500 outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Lock size={16} className="text-blue-500" /> Mật khẩu
            </label>
            <input 
              type="password" required value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button disabled={loading} className="w-full rounded-3xl bg-slate-900 py-4 font-bold text-white hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="relative my-8 text-center uppercase text-xs text-slate-400 font-bold">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <span className="relative bg-white px-4">Hoặc tiếp tục với</span>
        </div>

        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-100 py-4 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95">
          <FcGoogle size={24} /> <span>Google (Gmail)</span>
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}