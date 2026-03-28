import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Clock, CheckCircle, MessageCircle, MapPin, Phone, Mail, X, ShieldCheck, ZoomIn, CalendarDays, Facebook, Camera, Sparkles, Shirt, Info, ExternalLink, Scissors, Map as MapIcon, Send, ChevronUp, ClipboardCheck } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- 🔗 你的 GitHub & EmailJS 設定 ---
const GITHUB_BASE = "https://raw.githubusercontent.com/icatnews/commercial-landing-pages/main/03-photo-studio/assets";
const getAsset = (folder: string, filename: string) => `${GITHUB_BASE}/${folder}/${filename}`;

// ⚠️ 實戰測試：這是跳轉 LINE 並帶入文字的關鍵網址
const MY_LINE_URL = "https://line.me/ti/p/your_link_here"; 
const LINE_ID = "your_line_id";

const EMAILJS_CONFIG = {
  SERVICE_ID: "service_db9pt7h",
  TEMPLATE_ID: "template_ojrf71d", // 影心影像專用範本
  PUBLIC_KEY: "9OI4di6PoE9_CUbk2"  // 你剛剛提供的 Key
};

// --- 數據區：真實評論 ---
const REAL_REVIEWS = [
  { id: 1, initial: "李", name: "李千千", text: "老闆非常專業，拍照很快，修圖自然...把衣服的輪廓很完整的呈現。", date: "7 個月前" },
  { id: 5, initial: "邱", name: "邱婉淋 Eva", text: "效率非常快，當天拿到照片！服務真的很貼心。", date: "3 週前" },
  { id: 10, initial: "M", name: "Maggie Li", text: "畢業學士服寫真拍得很唯美，光線處理得非常優雅。", date: "4 個月前" },
  { id: 20, initial: "E", name: "Emily", text: "第二次回訪，老闆一如既往的細心與專業。大安區最推！", date: "1 週前" },
  { id: 11, initial: "陳", name: "陳冠廷", text: "修圖技術一流，細節處理得非常好，完全沒有僵硬感。", date: "1 週前" }
];

const SERVICES = [
  { id: 'id', title: "精緻證件照", price: "880", time: "15 min", retouch: "2-3 天", delivery: "店取或郵寄", img: "svc-id.jpeg", count: 6, prefix: 'id-' },
  { id: 'pro', title: "專業形象寫真", price: "5,800", time: "1-3 hrs", retouch: "7-14 天", delivery: "雲端交付", img: "svc-pro.jpeg", count: 6, prefix: 'pro-', featured: true },
  { id: 'family', title: "溫馨全家福", price: "9,900", time: "1-3 hrs", retouch: "7-14 天", delivery: "雲端交付", img: "svc-family.jpeg", count: 6, prefix: 'fam-' },
  { id: 'memo', title: "各式紀念寫真", price: "5,800", time: "1-3 hrs", retouch: "7-14 天", delivery: "雲端交付", img: "svc-memo.jpeg", count: 6, prefix: 'memo-' },
  { id: 'pet', title: "專業寵物照", price: "5,800", time: "1-3 hrs", retouch: "7-14 天", delivery: "雲端交付", img: "svc-pet.jpeg", count: 9, prefix: 'pet-' }
];

// --- 數據區：企劃項目 (精準對接 GitHub 資料夾與檔案前綴) ---
const CAMPAIGNS = [
  { id: 'c1', title: "春：櫻之漫步", folder: "camp-spring", prefix: "spr-", tag: "季節限定", period: "3月-4月", desc: "粉色系光影與花卉佈景。", count: 6 },
  { id: 'c2', title: "夏：畢業回憶", folder: "camp-summer", prefix: "sum-", tag: "人氣企劃", period: "5月-7月", desc: "紀錄最意氣風發的模樣。", count: 6 },
  { id: 'c3', title: "秋：和服美學", folder: "camp-autumn", prefix: "aut-", tag: "主題特展", period: "8月-10月", desc: "職人佈景結合日式光影。", count: 6 },
  { id: 'c4', title: "冬：聖誕合照", folder: "camp-winter", prefix: "win-", tag: "年度壓軸", period: "11月-12月", desc: "專屬聖誕軟裝佈置紀念。", count: 6 }
];

const PREP_GUIDES = [
  { 
    id: 'g1', title: "證件照穿搭攻略", icon: <Shirt />, 
    details: [
      "衣著建議：深色系、有領子的服裝（如正裝或襯衫）效果最佳，能與背景形成良好對比。",
      "避開地雷：請勿穿著白色、淡藍色衣服，以免與背景色融合。避免大面積亮片裝飾。",
      "妝髮叮嚀：建議化清爽淡妝，瀏海需整理至不遮擋眉毛與耳朵，以符合正式規範。",
      "配件調整：若平時配戴眼鏡，現場建議換成無鏡片框架，避免閃光燈反光。"
    ] 
  },
  { 
    id: 'g2', title: "形象照美學準備", icon: <Camera />, 
    details: [
      "服裝多樣性：建議準備 2-3 套風格迥異的服裝（如一正裝、一休閒），現場可供挑選。",
      "職人細節：拍攝前請修剪指甲、刮除雜毛（鬍鬚/眉毛間雜毛），這些細節會決定照片質感。",
      "狀態管理：拍攝前一晚請充足睡眠，避免大量飲水，確保當天面部輪廓清晰不水腫。",
      "引導互動：放鬆心情，老闆會全程引導動作與表情，您只需享受當下的自信。"
    ] 
  },
  { 
    id: 'g3', title: "毛孩拍攝秘訣", icon: <Sparkles />, 
    details: [
      "誘餌策略：請務必攜帶毛孩最愛的肉泥、零食 or 聲音清脆的玩具，這是捕捉眼神的靈魂。",
      "情緒安撫：建議拍攝前一小時不要進行劇烈運動，保持毛孩體力但不過於興奮喘氣。",
      "美容保養：建議拍前三天完成洗澡，當天簡單梳理即可，讓毛髮呈現自然蓬鬆感。",
      "主人陪伴：主人保持放鬆的語氣與肢體接觸，能讓毛孩在陌生的影棚環境更有安全感。"
    ] 
  }
];

export default function App() {
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [bookingService, setBookingService] = useState<any>(null);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 🚀 EmailJS 提交邏輯 ---
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSending(true);

    emailjs.sendForm(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      formRef.current,
      EMAILJS_CONFIG.PUBLIC_KEY
    ).then((result) => {
        alert("🎉 預約諮詢已送出！老闆將儘速與您聯繫。");
        setBookingService(null);
        setIsSending(false);
    }, (error) => {
        alert("❌ 發送失敗，請直接撥打電話或 FB 私訊。");
        setIsSending(false);
    });
  };

  // --- 🚀 LINE 跳轉測試邏輯 ---
  const handleLineJump = () => {
    const formData = new FormData(formRef.current!);
    const name = formData.get('user_name');
    const phone = formData.get('user_phone');
    const date = formData.get('booking_date');
    const note = formData.get('message');

    const message = `你好！我想預約服務：\n【${bookingService?.title}】\n姓名：${name}\n電話：${phone}\n預約日期：${date}\n備註需求：${note || '無'}`;
    const encodedMsg = encodeURIComponent(message);
    const lineUrl = `https://line.me/R/msg/text/?${encodedMsg}`;
    
    alert("即將跳轉 LINE！\n若是在電腦測試會看到 QR Code，請用手機點擊即可自動帶入預約訊息。");
    window.open(lineUrl, '_blank');
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label}已複製到剪貼簿`);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#1D1D1F] font-sans selection:bg-[#D4AF37] selection:text-white antialiased">
      
      {/* 導覽列 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 h-20 flex items-center justify-between px-8 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'
      }`}>
        <div className={`font-bold text-2xl tracking-tighter cursor-pointer transition-colors ${isScrolled ? 'text-[#D4AF37]' : 'text-white'}`} onClick={() => scrollTo('home')}>
          影心影像 | PHOTO HEART
        </div>
        <div className={`hidden md:flex gap-10 text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
          <button onClick={() => scrollTo('home')} className="hover:text-[#D4AF37] transition-colors">首頁</button>
          <button onClick={() => scrollTo('reviews')} className="hover:text-[#D4AF37] transition-colors">客戶評價</button>
          <button onClick={() => scrollTo('services')} className="hover:text-[#D4AF37] transition-colors">服務項目</button>
          <button onClick={() => scrollTo('campaigns')} className="hover:text-[#D4AF37] transition-colors">年度企劃</button>
          <button onClick={() => setBookingService({title: "預約諮詢"})} className={`px-6 py-2 rounded-full font-bold transition-all ${
            isScrolled ? 'bg-[#1D1D1F] text-white hover:bg-black' : 'bg-white text-[#1D1D1F] hover:bg-[#D4AF37] hover:text-white'
          }`}>立即預約</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={getAsset('hero', 'head.mp4')} type="video/mp4" />
        </video>
        <div className="relative z-20 text-center text-white px-4">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{duration:1}} className="text-6xl md:text-8xl font-serif font-bold mb-8">
            你的形象價值百萬
          </motion.h1>
          <p className="text-xl md:text-2xl mb-12 font-light tracking-[0.2em] opacity-90">大安區 5.0 星職人影棚 ・ 定格最完美的瞬間</p>
          <button onClick={() => scrollTo('services')} className="bg-[#D4AF37] text-white px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl">
            開始探索美學
          </button>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-6xl font-bold">5.0</span>
              {[1,2,3,4,5].map(i => <Star key={i} className="fill-[#D4AF37] text-[#D4AF37] w-8 h-8" />)}
            </div>
            <h2 className="text-3xl font-serif text-gray-400 italic">大安區實測真實好評</h2>
          </div>
          <div className="flex items-center gap-3 text-blue-600 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
            <ShieldCheck className="w-6 h-6" /> <span className="font-bold">Google 真實驗證</span>
          </div>
        </div>
        {/* 💡 CSS 邏輯：電腦版跑馬燈，手機版 overflow-x-auto 手動滑動 */}
        <div className="flex gap-8 overflow-x-auto animate-marquee px-6 pb-4 no-scrollbar snap-x snap-mandatory">
          {[...REAL_REVIEWS, ...REAL_REVIEWS].map((rev, idx) => (
            <div key={idx} className="min-w-[300px] sm:min-w-[400px] bg-[#FAF9F6] p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow shadow-sm snap-center">
              <div>
                <div className="w-14 h-14 rounded-full bg-white mb-6 flex items-center justify-center font-bold text-2xl text-[#D4AF37] shadow-inner">{rev.initial}</div>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="fill-[#D4AF37] text-[#D4AF37] w-4 h-4" />)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{rev.text}"</p>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-200/50 text-xs text-gray-400">
                <span className="font-bold text-[#1D1D1F]">{rev.name}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-32 px-6 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {SERVICES.map((s) => (
            <div key={s.id} className={`group bg-white rounded-[3rem] overflow-hidden border transition-all duration-500 ${s.featured ? 'border-[#D4AF37] shadow-xl scale-105' : 'border-gray-100 shadow-sm'}`}>
              <div className="relative h-80 overflow-hidden">
                <img src={getAsset('services', s.img)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={s.title} referrerPolicy="no-referrer" />
                <button onClick={() => setSelectedGallery({
                  title: s.title,
                  folder: `gallery/${s.id}`,
                  prefix: s.prefix,
                  count: s.count
                })} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg tracking-widest uppercase">查看作品集</button>
              </div>
              <div className="p-10">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:items-baseline mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tighter">{s.title}</h3>
                  <div className="text-[#D4AF37] font-bold text-2xl font-mono">NT$ {s.price}</div>
                </div>
                <div className="space-y-4 mb-10 text-sm">
                  <div className="flex items-center gap-3 text-gray-400 font-medium">
                    <div className="p-1.5 bg-[#FFF9E6] rounded-md"><Clock className="w-4 h-4 text-[#FFB800]" /></div> 拍攝時長：{s.time}
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 font-medium">
                    <div className="p-1.5 bg-[#E6F9F1] rounded-md"><Scissors className="w-4 h-4 text-[#00B16A]" /></div> 修改校稿：{s.retouch}
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 font-medium">
                    <div className="p-1.5 bg-[#E6F2FF] rounded-md"><MapIcon className="w-4 h-4 text-[#007AFF]" /></div> 取件方式：{s.delivery}
                  </div>
                </div>
                <button onClick={() => setBookingService(s)} className={`w-full py-5 rounded-2xl font-bold transition-all text-lg ${s.featured ? 'bg-[#1D1D1F] text-white hover:bg-black' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  立即預約諮詢
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 拍攝準備指南 */}
      <section className="py-24 bg-white px-6 text-center">
        <h2 className="text-4xl font-serif mb-16">職人拍攝準備指南</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {PREP_GUIDES.map(g => (
            <div key={g.id} onClick={() => setSelectedGuide(g)} className="p-10 rounded-[3rem] bg-[#FAF9F6] border border-gray-100 hover:border-[#D4AF37] transition-all cursor-pointer group text-left hover:bg-white hover:shadow-xl">
              <div className="text-[#D4AF37] mb-6 w-12 h-12 group-hover:scale-110 transition-transform">{g.icon}</div>
              <h3 className="text-xl font-bold mb-4">{g.title}</h3>
              <p className="text-[#D4AF37] text-sm font-bold underline underline-offset-4">查看詳細內容 →</p>
            </div>
          ))}
        </div>
      </section>

      {/* 年度企劃 */}
      <section id="campaigns" className="py-32 bg-[#1D1D1F] text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
          <div>
             <span className="text-[#D4AF37] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Seasonal Series</span>
             <h2 className="text-5xl font-serif mb-8 text-[#D4AF37]">年度美學<br/>特別企劃</h2>
             <p className="text-gray-400 leading-relaxed font-light">根據季節推出的限量主題，邀您定格充滿生命力的視覺大片。</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAMPAIGNS.map(c => (
              <div key={c.id} onClick={() => setSelectedGallery({
                title: c.title,
                folder: `gallery/${c.folder}`,
                prefix: c.prefix,
                count: c.count
              })} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 hover:border-[#D4AF37] transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">{c.tag}</span>
                  <span className="text-gray-500 text-xs">{c.period}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">{c.title}</h3>
                <p className="text-gray-400 text-sm mb-6 font-light">{c.desc}</p>
                <button className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity font-mono">VIEW COLLECTION <ExternalLink className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

 {/* --- 最終完工版 Footer：底邊對齊 + 紅針必現 --- */}
<footer id="booking" className="bg-[#FAF9F6] pt-24 pb-16 px-6 border-t border-gray-100">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:items-end"> 
    
    {/* 左側：品牌資訊區 (佔比 2/5) */}
    <div className="lg:col-span-2 text-left space-y-10">
      <div>
        <h2 className="text-4xl font-serif text-[#D4AF37] mb-6 font-bold tracking-tighter">影心影像 | PHOTO HEART</h2>
        <p className="text-gray-500 mb-8 leading-relaxed max-w-sm text-sm">
          「捕捉真實，凝聚回憶」。我們透過專業的攝影視角與細膩的修圖工藝，為您訂製專屬於您的美麗畫面，定格最完美的瞬間。
        </p>
      </div>

      {/* 地址 */}
      <div className="flex gap-6 items-start">
        <div className="p-4 bg-white rounded-3xl shadow-sm border border-gray-50 flex-shrink-0">
          <MapPin className="text-[#D4AF37] w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Studio Location</p>
          <p className="text-lg font-medium leading-tight text-gray-800">台北市大安區四維路 198 巷 30 弄 12 號</p>
        </div>
      </div>

      {/* 聯絡方式 */}
      <div className="space-y-6">
        <a href="tel:0915198790" className="group block">
          <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Hotline</p>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <p className="text-xl group-hover:text-[#D4AF37] transition-colors font-bold text-gray-800">0915-198-790</p>
          </div>
        </a>
        <a href="mailto:photoheart.imagestudio@gmail.com" className="group block">
          <p className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">Official Email</p>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <p className="text-xl group-hover:text-[#D4AF37] transition-colors font-bold text-gray-800">發送諮詢信件</p>
          </div>
        </a>
      </div>
      
      {/* FB按鈕 - 這是對齊的基準線 */}
      <div className="pt-2">
        <a href="https://www.facebook.com/photoheartimagestudio" target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 bg-[#1877F2] text-white px-10 py-4 rounded-[1.5rem] font-bold hover:shadow-2xl hover:-translate-y-1 transition-all shadow-lg shadow-blue-200/40">
          <Facebook className="w-6 h-6" /> 官方粉絲專頁
        </a>
      </div>
    </div>

    {/* 右側：寬扁版地圖 (佔比 3/5) */}
    {/* 高度鎖定 h-[450px]，底邊會剛好對準左側 FB 按鈕的底邊 */}
    <div className="lg:col-span-3 rounded-[3.5rem] overflow-hidden shadow-2xl h-[450px] relative border-4 border-white bg-white">
      <iframe 
        title="Photo Heart Studio Map"
        /* 💡 最終解決方案：直接使用搜尋標籤 q= 模式，這會強制顯示紅針且絕對不會報錯 */
        src="https://maps.google.com/maps?q=影心影像工作室&t=&z=17&ie=UTF8&iwloc=B&output=embed"
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
      ></iframe>
    </div>
  </div>
  
  <p className="text-center mt-20 pt-8 border-t border-gray-100 text-[10px] text-gray-400 tracking-[0.4em] uppercase font-mono">
    © 2026 PHOTO HEART IMAGE STUDIO. ESTABLISHED IN TAIPEI.
  </p>
</footer>

      {/* --- MODALS --- */}

      {/* 作品集彈窗 */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <h2 className="text-2xl font-serif text-[#D4AF37] font-bold">{selectedGallery.title} 實拍範例</h2>
              <button onClick={() => setSelectedGallery(null)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all shadow-sm text-gray-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-gray-50">
              <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 pb-40">
                {[...Array(selectedGallery.count)].map((_, i) => {
                  const num = (i + 1).toString().padStart(2, '0');
                  const path = getAsset(selectedGallery.folder, `${selectedGallery.prefix}${num}.jpeg`);
                  return (
                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key={i} className="relative aspect-[3/4] bg-white rounded-[2.5rem] overflow-hidden shadow-lg group cursor-zoom-in" onClick={() => setZoomedImage(path)}>
                      <img src={path} className="w-full h-full object-cover shadow-sm" alt="portfolio" loading="lazy" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"><ZoomIn className="text-white w-10 h-10 drop-shadow-md" /></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 拍攝指南彈窗 */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-[3.5rem] p-12 max-w-lg w-full relative shadow-2xl">
              <button onClick={() => setSelectedGuide(null)} className="absolute top-8 right-8 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all text-gray-400"><X className="w-5 h-5" /></button>
              <div className="text-[#D4AF37] mb-8 w-16 h-16 bg-[#FAF9F6] p-4 rounded-3xl">{selectedGuide.icon}</div>
              <h3 className="text-3xl font-serif font-bold mb-8 tracking-tighter">{selectedGuide.title}</h3>
              <ul className="space-y-6">
                {selectedGuide.details.map((d: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start text-gray-600 leading-relaxed font-medium">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 預約單彈窗 (EmailJS 實戰版) */}
      <AnimatePresence>
        {bookingService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} className="bg-white rounded-[3.5rem] max-w-lg w-full relative shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 bg-white z-20 px-8 md:px-12 py-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">{bookingService.title} | 預約諮詢</h3>
                <button onClick={() => setBookingService(null)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              
              {/* Scrollable Content */}
              <div className="p-8 md:p-12 pt-6 overflow-y-auto flex-1">
                <form ref={formRef} onSubmit={handleSendEmail} className="space-y-6">
                  <input type="hidden" name="service_name" value={bookingService.title} />
                  <div className="grid grid-cols-2 gap-4 px-4 sm:px-0">
                    <div>
                      <label className="block text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px]">您的姓名</label>
                      <input type="text" name="user_name" placeholder="例：林小姐" required className="w-full p-4 rounded-2xl border bg-gray-50 focus:border-[#D4AF37] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px]">聯絡電話</label>
                      <input type="tel" name="user_phone" placeholder="0912-345-678" required className="w-full p-4 rounded-2xl border bg-gray-50 focus:border-[#D4AF37] outline-none transition-all" />
                    </div>
                  </div>
                  <div className="px-4 sm:px-0">
                    <label className="block text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px]">期望預約日期</label>
                    <div className="relative w-full">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                      <input 
                        type="date" 
                        name="booking_date" 
                        required 
                        className="w-full max-w-full p-4 pl-12 rounded-2xl border bg-gray-50 focus:border-[#D4AF37] outline-none transition-all box-border" 
                        style={{ boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div className="px-4 sm:px-0">
                    <label className="block text-gray-400 mb-2 font-bold uppercase tracking-widest text-[10px]">預約需求 / 備註</label>
                    <textarea name="message" placeholder="例如：想詢問寵物攝影是否包含裝扮、或是有特殊修圖需求..." rows={4} className="w-full p-4 rounded-2xl border bg-gray-50 focus:border-[#D4AF37] outline-none transition-all resize-none" />
                  </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 sm:px-0">
                  <button type="submit" disabled={isSending} className="bg-[#1D1D1F] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all disabled:opacity-50">
                    {isSending ? "發送中..." : <><Send className="w-5 h-5" /> 提交預約單</>}
                  </button>
                  <button type="button" onClick={handleLineJump} className="bg-[#06C755] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-200 hover:scale-[1.02] transition-all">
                    <ClipboardCheck className="w-6 h-6" /> 直接跳轉 LINE
                  </button>
                </div>
                
                <button type="button" onClick={() => copyToClipboard(LINE_ID, 'LINE ID')} className="mx-4 sm:mx-0 w-[calc(100%-2rem)] sm:w-full bg-white text-gray-400 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-gray-100 hover:bg-gray-50 transition-all">
                  <ExternalLink className="w-3 h-3" /> 僅複製 LINE ID
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* 放大圖片 (Lightbox) */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setZoomedImage(null)}>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={zoomedImage} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" referrerPolicy="no-referrer" />
            <button className="absolute top-10 right-10 text-white p-4 hover:bg-white/10 rounded-full transition-all"><X className="w-10 h-10" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🚀 懸浮功能中心 (Floating Action Hub) --- */}
      <div className="fixed bottom-8 right-2 md:right-8 z-[90] flex flex-col gap-4 items-end">
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-11 h-11 md:w-14 md:h-14 bg-white text-[#D4AF37] rounded-full shadow-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-all"
            >
              <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <a href="tel:0915198790" className="w-11 h-11 md:w-14 md:h-14 bg-white text-[#D4AF37] rounded-full shadow-2xl flex items-center justify-center border border-gray-100 hover:scale-110 transition-all">
          <Phone className="w-5 h-5 md:w-6 md:h-6" />
        </a>
        
        <a href="https://www.facebook.com/photoheartimagestudio" target="_blank" rel="noreferrer" className="w-11 h-11 md:w-14 md:h-14 bg-[#1877F2] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all">
          <Facebook className="w-5 h-5 md:w-6 md:h-6" />
        </a>
        
        <button onClick={() => setBookingService({title: "立即預約"})} className="bg-[#D4AF37] text-white w-11 h-11 md:w-auto md:px-6 md:py-4 rounded-full shadow-2xl flex items-center justify-center md:justify-start gap-3 font-bold hover:scale-105 transition-all">
          <CalendarDays className="w-5 h-5 md:w-6 md:h-6" /> <span className="hidden md:inline">立即預約</span>
        </button>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (min-width: 640px) {
          .animate-marquee { display: flex; animation: marquee 35s linear infinite; }
          .animate-marquee:hover { animation-play-state: paused; }
        }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
