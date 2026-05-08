import { login, signup } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const redirectUrl = typeof params.redirect === 'string' ? params.redirect : '/';
  
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] p-8 sm:p-12 animate-[slideUp_0.5s_ease-out]">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-[#F2EEE7] mb-2">ACCESS</h1>
          <p className="text-[#8A8A8A] text-[10px] uppercase tracking-[0.3em]">
            Enter your credentials to continue
          </p>
        </div>

        <form className="flex flex-col gap-6">
          <input type="hidden" name="redirect" value={redirectUrl} />
          
          <div>
            <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2" htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required 
              className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#8A8A8A] text-[10px] uppercase tracking-[0.2em] mb-2" htmlFor="password">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              required 
              className="w-full bg-[#111] border border-[#2a2a2a] text-[#F2EEE7] text-sm px-4 py-3 rounded-sm outline-none focus:border-[#555] transition-colors"
            />
          </div>

          {params?.error && (
            <div className="text-[#7A1111] text-xs text-center p-3 bg-[#7A1111]/10 border border-[#7A1111]/30">
              {params.error}
            </div>
          )}
          
          {params?.message && (
            <div className="text-[#4CAF50] text-xs text-center p-3 bg-[#4CAF50]/10 border border-[#4CAF50]/30">
              {params.message}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-4">
            <button 
              formAction={login}
              className="w-full py-4 bg-[#7A1111] text-[#F2EEE7] text-xs font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#A61515] transition-all"
            >
              Log In
            </button>
            <button 
              formAction={signup}
              className="w-full py-4 border border-[#333] text-[#F2EEE7] text-xs font-bold uppercase tracking-[0.3em] rounded-sm hover:border-[#F2EEE7] transition-all"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
