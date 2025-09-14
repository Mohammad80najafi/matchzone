import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function CallbackPage() {
  // این صفحه در کلاینت فراخوانی می‌شود و توکن را در hash می‌فرستیم.
  // اما چون RSC است، به hash دسترسی ندارد؛ پس از یک اسکریپت کوچک استفاده می‌کنیم.
  return (
    <html>
      <body>
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            const hash = window.location.hash.slice(1);
            const params = new URLSearchParams(hash);
            const token = params.get('token');
            if (!token) { window.location.replace('/login'); return; }
            fetch('/auth/set-cookie', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
              .then(() => window.location.replace('/dashboard'))
              .catch(() => window.location.replace('/login'));
          })();
        `}} />
      </body>
    </html>
  );
}
