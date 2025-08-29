'use client';
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  Send,
  PlayCircle,
  Globe,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer dir='rtl' className='mt-12'>
      <div className='w-full border-t border-white/10 bg-gradient-to-br from-[#0F1A1A] via-[#0C0C0F] to-[#0A0A0A]'>
        <div className='max-w-7xآفl mx-auto px-4 py-10'>
          {/* ردیف بالا */}
          <div className='grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-3'>
            {/* ارتباط با ما */}
            <div>
              <h3 className='mb-4 font-bold text-white'>ارتباط با ما</h3>
              <ul className='space-y-2 text-sm text-[#C9C9C9]'>
                <li className='flex items-center gap-2'>
                  <Phone className='size-4 text-[#00FF85]' />
                  <span>021-91027500 — 021-58434000</span>
                </li>
                <li className='flex items-center gap-2'>
                  <Mail className='size-4 text-[#00FF85]' />
                  <span>support@matchzone.ir</span>
                </li>
                <li className='flex items-center gap-2'>
                  <MapPin className='size-4 text-[#00FF85]' />
                  <span>تهران، ایران</span>
                </li>
              </ul>
            </div>

            {/* شبکه‌های اجتماعی (با آیکون‌های جایگزین) */}
            <div>
              <h3 className='mb-4 font-bold text-white'>شبکه‌های اجتماعی</h3>
              <div className='flex items-center gap-3'>
                <a className='footer-social' href='#' aria-label='Instagram'>
                  <Camera className='size-4' />
                </a>
                <a className='footer-social' href='#' aria-label='Telegram'>
                  <Send className='size-4' />
                </a>
                <a className='footer-social' href='#' aria-label='YouTube'>
                  <PlayCircle className='size-4' />
                </a>
                <a className='footer-social' href='#' aria-label='Website'>
                  <Globe className='size-4' />
                </a>
              </div>
              <p className='mt-3 text-xs text-[#9D9D9D]'>
                ما را در شبکه‌ها دنبال کنید تا از تورنمنت‌ها و لابی‌های جدید
                باخبر شوید.
              </p>
            </div>

            {/* لینک‌های سریع */}
            <div className='md:pl-10'>
              <h3 className='mb-4 font-bold text-white'>لینک‌های سریع</h3>
              <ul className='grid grid-cols-2 gap-y-2 text-sm text-[#C9C9C9]'>
                <li>
                  <a className='footer-link' href='#lobbies'>
                    لابی‌ها
                  </a>
                </li>
                <li>
                  <a className='footer-link' href='#leaderboard'>
                    برترین‌ها
                  </a>
                </li>
                <li>
                  <a className='footer-link' href='#hambazi'>
                    هم‌بازی
                  </a>
                </li>
                <li>
                  <a className='footer-link' href='#store'>
                    فروشگاه
                  </a>
                </li>
                <li>
                  <a className='footer-link' href='/profile'>
                    پروفایل
                  </a>
                </li>
                <li>
                  <a className='footer-link' href='#contact'>
                    ارتباط با ما
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ردیف نمادها */}
          <div className='border-b border-white/10 py-6'>
            <div className='flex flex-wrap items-center justify-center gap-4 md:justify-between'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className='grid h-14 w-28 place-items-center rounded-xl border border-white/10 bg-[#111] text-xs text-[#8A8A8A]'
                >
                  Logo {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* کپی‌رایت */}
          <div className='py-6 text-center text-[12px] text-[#9D9D9D]'>
            تمامی حقوق این وب‌سایت متعلق به{' '}
            <span className='font-semibold text-white'>MatchZone</span> است
            <span className='mx-2 text-[#00FF85]'>•</span> ۱۴۰۴
          </div>
        </div>
      </div>

      <style jsx global>{`
        .footer-social {
          display: grid;
          place-items: center;
          height: 40px;
          width: 40px;
          border-radius: 12px;
          background: #0f0f0f;
          color: #eaeaea;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
        }
        .footer-social:hover {
          color: #0a0a0a;
          background: #00ff85;
          box-shadow: 0 0 12px rgba(0, 255, 133, 0.35);
          border-color: rgba(0, 255, 133, 0.35);
        }
        .footer-link {
          position: relative;
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          right: 0;
          bottom: -2px;
          height: 2px;
          width: 0%;
          background: #00ff85;
          border-radius: 9999px;
          transition: width 0.2s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
      `}</style>
    </footer>
  );
}
