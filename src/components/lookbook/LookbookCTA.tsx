export function LookbookCTA() {
  return (
    <section className="py-32 bg-[#0a0a0a] border-t border-[#1a1a1a] flex flex-col items-center text-center px-4">
      <h2 className="font-display text-5xl sm:text-7xl text-[#F2EEE7] mb-8">THE MARKS ARE LIVE</h2>
      <p className="text-[#8A8A8A] text-sm uppercase tracking-[0.3em] max-w-md mx-auto mb-12 leading-relaxed">
        Limited quantities. Once sold out, they never return.
      </p>
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
        <a 
          href="/shop" 
          className="w-full sm:w-auto px-10 py-5 bg-[#F2EEE7] text-[#050505] font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#7A1111] hover:text-[#F2EEE7] transition-all duration-300"
        >
          Shop The Drop
        </a>
        <a 
          href="/contact" 
          className="w-full sm:w-auto px-10 py-5 border border-[#333] text-[#F2EEE7] font-bold text-xs uppercase tracking-[0.3em] hover:border-[#F2EEE7] transition-all duration-300"
        >
          Join Waitlist
        </a>
      </div>
    </section>
  );
}
