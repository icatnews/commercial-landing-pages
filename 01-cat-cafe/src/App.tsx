/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import { 
  Menu, X, Coffee, Heart, MapPin, Clock, Phone, 
  Instagram, Facebook, ChevronRight, Send,
  Calendar, Sparkles, MessageCircle, Mail,
  PieChart, Activity, Info, Utensils, Zap, CheckCircle2,
  UserCircle2, Users
} from 'lucide-react';

// --- Constants & Assets ---
const GITHUB_BASE = "https://raw.githubusercontent.com/icatnews/commercial-landing-pages/main/01-cat-cafe/assets/";

const CAFE_ASSETS = {
  hero: { 
    main: `${GITHUB_BASE}hero/hero-main.jpg`, 
    accent: `${GITHUB_BASE}hero/hero-main01.jpg`, 
    interior: `${GITHUB_BASE}hero/feature-interior.jpg` 
  },
  cats: [
    { name: "Chester", src: `${GITHUB_BASE}cats/cat-chester.jpg`, breed: "異國短毛貓 (Exotic Shorthair)", gender: "公", personality: "秩序守護者、靈魂哲學家、固執。", workStatus: "排班中", currentActivity: "在收銀台監督店長。", likes: "玩逗貓棒、在鍵盤上睡覺。" },
    { name: "Cleo", src: `${GITHUB_BASE}cats/cat-cleo.jpg`, breed: "三花貓 (Calico)", gender: "母", personality: "益智大師 (Puzzle Master)。", workStatus: "門診中", currentActivity: "今天去洗牙，晚點回來。", likes: "被拍屁屁、解開零食罐的蓋子。" },
    { name: "Harry", src: `${GITHUB_BASE}cats/cat-harry.jpg`, breed: "蘇格蘭折耳貓 (Scottish Fold)", gender: "公", personality: "溫柔、容易受驚、深思熟慮。", workStatus: "休息中", currentActivity: "躲在紙箱裡觀察大家。", likes: "安靜的角落、被輕輕梳毛。" },
    { name: "Mochi", src: `${GITHUB_BASE}cats/cat-mochi.jpg`, breed: "曼赤肯 (Munchkin)", gender: "母", personality: "衝刺女王、甜美又傲嬌。", workStatus: "排班中", currentActivity: "在門口迎賓 (順便討摸)。", likes: "吃肉泥、追逐會動的影子。" },
    { name: "Nacho", src: `${GITHUB_BASE}cats/cat-nacho.jpg`, breed: "橘色虎斑貓 (Orange Tabby)", gender: "公", personality: "忠誠夥伴、等食動力。", workStatus: "排班中", currentActivity: "在客人的腿上踏踏。", likes: "追逐雷射筆、大口吃罐罐。" },
    { name: "Pebble", src: `${GITHUB_BASE}cats/cat-pebble.jpg`, breed: "曼赤肯 (Munchkin)", gender: "母", personality: "笨拙探險家。", workStatus: "休息中", currentActivity: "在貓跳台最高處睡覺。", likes: "看窗外的小鳥、玩瓶蓋。" }
  ],
  menu: {
    coffee: Array.from({ length: 6 }, (_, i) => `${GITHUB_BASE}menu/coffee-0${i + 1}.jpg`),
    dessert: Array.from({ length: 6 }, (_, i) => `${GITHUB_BASE}menu/dessert-0${i + 1}.jpg`),
    treat: Array.from({ length: 6 }, (_, i) => `${GITHUB_BASE}menu/cat-treat-0${i + 1}.jpg`)
  }
};

const MENU_DATA: Record<string, any> = {
  coffee_0: { name: "衣索比亞 耶加雪菲", price: 180, desc: "花香調、柑橘風味、清爽回甘。嚴選精品莊園豆，每一口都能感受到高原的清新氣息。", nutrition: { kcal: 5, carb: 1, fat: 0, protein: 0.5 } },
  coffee_1: { name: "哥倫比亞 聖奧古斯丁", price: 190, desc: "堅果巧克力調、醇厚度高。口感紮實滑順，帶有迷人的可可餘韻，適合午後細細品味。", nutrition: { kcal: 8, carb: 1.5, fat: 0.2, protein: 0.6 } },
  coffee_2: { name: "貓咪拉花拿鐵", price: 160, desc: "綿密奶泡繪製超萌店貓圖案。結合濃育義式濃縮與絲滑鮮乳，視覺與味覺的雙重療癒。", nutrition: { kcal: 150, carb: 12, fat: 8, protein: 6 } },
  coffee_3: { name: "貓掌拿鐵", price: 170, desc: "特製貓掌造型奶泡，療癒感十足。蓬鬆的奶泡像雲朵般輕盈，是店內拍照打卡的第一名。", nutrition: { kcal: 155, carb: 13, fat: 8.5, protein: 6.2 } },
  coffee_4: { name: "雲朵焦糖瑪奇朵", price: 165, desc: "如雲朵般輕盈的奶泡與焦糖交織。香甜焦糖醬淋在綿密奶泡上，層次分明，甜蜜入心。", nutrition: { kcal: 180, carb: 22, fat: 9, protein: 5 } },
  coffee_5: { name: "冰釀冷萃咖啡", price: 150, desc: "低溫慢速萃取，口感滑順不苦澀。", nutrition: { kcal: 2, carb: 0.5, fat: 0, protein: 0.2 } },
  dessert_0: { name: "焦糖布丁貓", price: 120, desc: "Q彈口感，搭配手工熬煮焦糖。", nutrition: { kcal: 210, carb: 24, fat: 11, protein: 4 } },
  dessert_1: { name: "法式檸檬塔", price: 150, desc: "酸甜平衡，每日限量供應。", nutrition: { kcal: 230, carb: 28, fat: 13, protein: 3 } },
  dessert_2: { name: "貓掌瑪德蓮", price: 80, desc: "外酥內軟，濃郁奶油香氣。", nutrition: { kcal: 140, carb: 16, fat: 8, protein: 2 } },
  dessert_3: { name: "手工布朗尼", price: 140, desc: "濃郁巧克力風味，搭配冰淇淋。", nutrition: { kcal: 320, carb: 36, fat: 19, protein: 5 } },
  dessert_4: { name: "宇治抹茶千層", price: 160, desc: "層層堆疊的細緻抹茶香氣。", nutrition: { kcal: 195, carb: 21, fat: 11, protein: 5 } },
  dessert_5: { name: "伯爵茶戚風蛋糕", price: 130, desc: "輕盈蓬鬆，散發淡淡茶香。", nutrition: { kcal: 160, carb: 19, fat: 8, protein: 3 } },
  treat_0: { name: "鮮煮雞肉絲", price: 60, desc: "無添加手工撕製，貓咪最愛。", nutrition: { kcal: 45, carb: 0, fat: 0.3, protein: 11 } },
  treat_1: { name: "凍乾鮭魚塊", price: 80, desc: "低溫烘焙鎖住營養與鮮甜。", nutrition: { kcal: 55, carb: 0.5, fat: 2, protein: 10 } },
  treat_2: { name: "特製肉泥包", price: 50, desc: "多種口味可選，互動感十足。", nutrition: { kcal: 35, carb: 2, fat: 0.5, protein: 6 } },
  treat_3: { name: "鮪魚慕斯罐", price: 90, desc: "細緻慕斯質地，適口性極佳。", nutrition: { kcal: 60, carb: 1, fat: 1.5, protein: 12 } },
  treat_4: { name: "貓草小餅乾", price: 40, desc: "添加天然貓草，幫助化毛。", nutrition: { kcal: 25, carb: 4, fat: 0.4, protein: 2 } },
  treat_5: { name: "鰹魚厚切片", price: 70, desc: "厚實口感，滿滿的海味精華。", nutrition: { kcal: 50, carb: 0.8, fat: 0.6, protein: 11.5 } }
};

// --- Helper Components ---
const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

const Button = ({ children, variant = 'primary', className = '', onClick, animate = false }: { children: React.ReactNode, variant?: 'primary' | 'secondary' | 'outline', className?: string, onClick?: () => void, animate?: boolean }) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";
  const variants = {
    primary: "bg-[#E67E22] text-white hover:bg-[#D35400] shadow-lg",
    secondary: "bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-md",
    outline: "border-2 border-[#5D4037] text-[#5D4037] hover:bg-[#5D4037] hover:text-white"
  };
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} animate={animate ? { boxShadow: ["0px 0px 0px rgba(230,126,34,0)", "0px 0px 20px rgba(230,126,34,0.5)", "0px 0px 0px rgba(230,126,34,0)"] } : {}} transition={animate ? { duration: 2, repeat: Infinity } : {}} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </motion.button>
  );
};

// --- Main Application ---
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'coffee' | 'dessert' | 'treat'>('coffee');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [catOfTheDay, setCatOfTheDay] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({ name: "", date: "", time: "", people: "1 位", phone: "", message: "" });
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * CAFE_ASSETS.cats.length);
    setCatOfTheDay(CAFE_ASSETS.cats[randomIndex]);
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      setIsOpen(day !== 1 && hour >= 11 && hour < 20);
    };
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
      setShowBackToTop(window.scrollY > 500);
    };
    checkStatus();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🚀 核心修正：相容手機與網頁的平滑滾動
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false); // 先關閉選單
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // 預留頂部導航列的高度
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150); // 縮短延遲讓反應更靈敏，但仍避開選單關閉動畫
  };

  const handleReservationFromCat = (catName: string) => {
    setSelectedCat(null);
    setFormData(prev => ({ ...prev, name: `我想看 ${catName} 的 [您的名字]` }));
    setTimeout(() => {
      scrollToSection('contact');
      nameInputRef.current?.focus();
    }, 400);
  };

  // 🛍️ 核心修正：餐點數量累加邏輯
  const handleReservationFromMenu = (itemName: string) => {
    setFormData(prev => {
      const prefix = "我想預定：";
      let currentMsg = prev.message.trim();
      
      if (!currentMsg.startsWith(prefix)) {
        return { ...prev, message: `${prefix}${itemName} x 1` };
      }

      const itemsPart = currentMsg.substring(prefix.length);
      const items = itemsPart.split("、").map(i => i.trim()).filter(i => i !== "");
      let found = false;

      const updatedItems = items.map(item => {
        if (item.startsWith(`${itemName} x `)) {
          found = true;
          const count = parseInt(item.split(" x ")[1]) || 1;
          return `${itemName} x ${count + 1}`;
        }
        return item;
      });

      if (!found) updatedItems.push(`${itemName} x 1`);
      return { ...prev, message: `${prefix}${updatedItems.join("、")}` };
    });

    setSelectedItem(null);
    setTimeout(() => scrollToSection('contact'), 400);
  };

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const templateParams = { ...formData, people: formData.people.replace(' 位', '') };
    emailjs.send('service_db9pt7h', 'template_ok52qkf', templateParams, '9OI4di6PoE9_CUbk2')
      .then(() => {
        setIsSubmitted(true);
        setFormData({ name: "", date: "", time: "", people: "1 位", phone: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      }, () => alert('預約失敗，請撥打電話聯繫。'));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4E342E] font-sans selection:bg-[#E67E22] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#5D4037]/10">
        <div className="absolute top-0 left-0 h-1 bg-[#E67E22]" style={{ width: `${scrollProgress}%` }} />
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 bg-[#E67E22] rounded-full flex items-center justify-center text-white"><Coffee size={24} /></div>
            <span className="text-xl font-bold">MeowCafe <span className="text-[#E67E22]">台北</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('about')}>關於我們</button>
            <button onClick={() => scrollToSection('cats')}>店內貓咪</button>
            <button onClick={() => scrollToSection('menu')}>精選菜單</button>
            <button onClick={() => scrollToSection('contact')}>預約訂位</button>
            <Button variant="primary" className="px-6 py-2 text-sm" onClick={() => scrollToSection('contact')}>立即預約</Button>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#FDFBF7] border-b overflow-hidden">
              <div className="px-6 py-8 flex flex-col gap-6">
                <button onClick={() => scrollToSection('about')}>關於我們</button>
                <button onClick={() => scrollToSection('cats')}>店內貓咪</button>
                <button onClick={() => scrollToSection('menu')}>精選菜單</button>
                <button onClick={() => scrollToSection('contact')}>預約訂位</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section id="hero" className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <FadeInUp>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">在貓咪的呼嚕聲中<br />品味<span className="text-[#E67E22]">醇厚時光</span></h1>
          <p className="text-lg text-[#5D4037]/80 mb-10">MeowCafe 不只是一家咖啡廳，更是一個讓靈魂休息的避風港。</p>
          <div className="flex gap-4"><Button onClick={() => scrollToSection('menu')}>查看菜單</Button></div>
        </FadeInUp>
        <div className="rounded-3xl overflow-hidden shadow-2xl"><img src={CAFE_ASSETS.hero.main} alt="hero" /></div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-white px-6"><div className="max-w-7xl mx-auto text-center"><h2 className="text-4xl font-bold mb-8">不只是咖啡，更是一場感官的溫柔革命</h2></div></section>

      {/* Cats */}
      <section id="cats" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">遇見我們的店長</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {CAFE_ASSETS.cats.map((cat, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer" onClick={() => setSelectedCat(cat)}>
              <img src={cat.src} alt={cat.name} className="w-full aspect-video object-cover" />
              <div className="p-6"><h3 className="text-2xl font-bold">{cat.name}</h3><p className="text-[#E67E22] font-bold">{cat.breed}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-24 bg-white px-6 max-w-7xl mx-auto">
        <div className="flex justify-center gap-4 mb-12">
          {['coffee', 'dessert', 'treat'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-3 rounded-full font-bold ${activeTab === tab ? 'bg-[#E67E22] text-white' : 'bg-[#FDFBF7]'}`}>{tab === 'coffee' ? '手沖咖啡' : tab === 'dessert' ? '精緻甜點' : '貓咪零食'}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {CAFE_ASSETS.menu[activeTab].map((img, i) => {
            const detail = MENU_DATA[`${activeTab}_${i}`];
            return (
              <div key={i} onClick={() => setSelectedItem({ ...detail, image: img })} className="bg-[#FDFBF7] rounded-3xl overflow-hidden cursor-pointer p-6">
                <img src={img} className="rounded-2xl mb-4 aspect-video object-cover" />
                <div className="flex justify-between font-bold"><h3>{detail.name}</h3><span className="text-[#E67E22]">NT$ {detail.price}</span></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-[#5D4037] text-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <FadeInUp>
            <h2 className="text-4xl font-bold mb-8">準備好與貓咪<br />來場約會了嗎？</h2>
            <div className="space-y-6">
              <div className="flex gap-4"><MapPin /> 台北市大安區療癒路 102 號</div>
              <div className="flex gap-4"><Clock /> 週二至週日 11:00 - 20:00</div>
            </div>
          </FadeInUp>
          <div className="bg-white rounded-3xl p-8 text-[#4E342E]">
            {!isSubmitted ? (
              <form className="space-y-4" onSubmit={handleReservation}>
                <input ref={nameInputRef} className="w-full p-4 border rounded-xl" placeholder="您的稱呼" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="w-full p-4 border rounded-xl" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                  <select className="w-full p-4 border rounded-xl" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required>
                    <option value="">選擇時段</option><option value="11:00">11:00</option><option value="15:00">15:00</option>
                  </select>
                </div>
                <textarea ref={messageInputRef} className="w-full p-4 border rounded-xl h-32" placeholder="備註需求" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                <input className="w-full p-4 border rounded-xl" placeholder="聯絡電話" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                <Button className="w-full py-4">確認送出</Button>
              </form>
            ) : <div className="text-center py-12"><h3 className="text-2xl font-bold mb-4">預約成功！</h3><p>專人將儘速與您聯繫。</p></div>}
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedCat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedCat(null)} />
            <div className="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full">
              <img src={selectedCat.src} className="w-full aspect-video object-cover" />
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{selectedCat.name}</h2>
                <p className="mb-6">{selectedCat.personality}</p>
                <Button className="w-full" onClick={() => handleReservationFromCat(selectedCat.name)}>與牠約會</Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedItem(null)} />
            <div className="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full">
              <img src={selectedItem.image} className="w-full aspect-video object-cover" />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
                <p className="mb-6">{selectedItem.desc}</p>
                <Button className="w-full" onClick={() => handleReservationFromMenu(selectedItem.name)}>預約這道美味</Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
