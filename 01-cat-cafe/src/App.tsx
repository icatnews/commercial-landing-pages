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
    { 
      name: "Chester", 
      src: `${GITHUB_BASE}cats/cat-chester.jpg`, 
      breed: "異國短毛貓 (Exotic Shorthair)", 
      gender: "公",
      personality: "秩序守護者、靈魂哲學家、固執。",
      workStatus: "排班中",
      currentActivity: "在收銀台監督店長。",
      likes: "玩逗貓棒、在鍵盤上睡覺。"
    },
    { 
      name: "Cleo", 
      src: `${GITHUB_BASE}cats/cat-cleo.jpg`, 
      breed: "三花貓 (Calico)", 
      gender: "母",
      personality: "益智大師 (Puzzle Master)。",
      workStatus: "門診中",
      currentActivity: "今天去洗牙，晚點回來。",
      likes: "被拍屁屁、解開零食罐的蓋子。"
    },
    { 
      name: "Harry", 
      src: `${GITHUB_BASE}cats/cat-harry.jpg`, 
      breed: "蘇格蘭折耳貓 (Scottish Fold)", 
      gender: "公",
      personality: "溫柔、容易受驚、深思熟慮。",
      workStatus: "休息中",
      currentActivity: "躲在紙箱裡觀察大家。",
      likes: "安靜的角落、被輕輕梳毛。"
    },
    { 
      name: "Mochi", 
      src: `${GITHUB_BASE}cats/cat-mochi.jpg`, 
      breed: "曼赤肯 (Munchkin)", 
      gender: "母",
      personality: "衝刺女王、甜美又傲嬌。",
      workStatus: "排班中",
      currentActivity: "在門口迎賓 (順便討摸)。",
      likes: "吃肉泥、追逐會動的影子。"
    },
    { 
      name: "Nacho", 
      src: `${GITHUB_BASE}cats/cat-nacho.jpg`, 
      breed: "橘色虎斑貓 (Orange Tabby)", 
      gender: "公",
      personality: "忠誠夥伴、等食動力。",
      workStatus: "排班中",
      currentActivity: "在客人的腿上踏踏。",
      likes: "追逐雷射筆、大口吃罐罐。"
    },
    { 
      name: "Pebble", 
      src: `${GITHUB_BASE}cats/cat-pebble.jpg`, 
      breed: "曼赤肯 (Munchkin)", 
      gender: "母",
      personality: "笨拙探險家。",
      workStatus: "休息中",
      currentActivity: "在貓跳台最高處睡覺。",
      likes: "看窗外的小鳥、玩瓶蓋。"
    }
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
  coffee_5: { name: "冰釀冷萃咖啡", price: 150, desc: "低溫慢速萃取，口感滑順不苦澀。保留咖啡豆最純粹的甘甜，清爽解渴的最佳選擇。", nutrition: { kcal: 2, carb: 0.5, fat: 0, protein: 0.2 } },
  
  dessert_0: { name: "焦 caramel 布丁貓", price: 120, desc: "Q彈口感，搭配手工熬煮焦糖。可愛的貓咪造型布丁，滑順入口，苦甜焦糖味恰到好處。", nutrition: { kcal: 210, carb: 24, fat: 11, protein: 4 } },
  dessert_1: { name: "法式檸檬塔", price: 150, desc: "酸甜平衡，每日限量供應。新鮮檸檬原汁製成的內餡，搭配酥脆塔皮，清新解膩。", nutrition: { kcal: 230, carb: 28, fat: 13, protein: 3 } },
  dessert_2: { name: "貓掌瑪德蓮", price: 80, desc: "外酥內軟，濃郁奶油香氣。精緻的貓掌造型，帶有淡淡的蜂蜜甜味，是配咖啡的絕佳小點。", nutrition: { kcal: 140, carb: 16, fat: 8, protein: 2 } },
  dessert_3: { name: "手工布朗尼", price: 140, desc: "濃郁巧克力風味，搭配香草冰淇淋。溫熱的布朗尼與冰涼冰淇淋在口中交融，極致享受。", nutrition: { kcal: 320, carb: 36, fat: 19, protein: 5 } },
  dessert_4: { name: "宇治抹茶千層", price: 160, desc: "層層堆疊的細緻抹茶香氣。選用頂級宇治抹茶粉，茶味濃郁不苦澀，口感層次豐富。", nutrition: { kcal: 195, carb: 21, fat: 11, protein: 5 } },
  dessert_5: { name: "伯爵茶戚風蛋糕", price: 130, desc: "輕盈蓬鬆，散發淡淡茶香。如雲朵般柔軟的蛋糕體，伴隨優雅的伯爵茶芬芳。", nutrition: { kcal: 160, carb: 19, fat: 8, protein: 3 } },
  
  treat_0: { name: "鮮煮雞肉絲", price: 60, desc: "無添加手工撕製，貓咪最愛。選用新鮮雞胸肉低溫烹煮，保留肉質原味與營養。", nutrition: { kcal: 45, carb: 0, fat: 0.3, protein: 11 } },
  treat_1: { name: "凍乾鮭魚塊", price: 80, desc: "低溫烘焙鎖住營養與鮮甜。富含 Omega-3，酥脆口感讓主子愛不釋口。", nutrition: { kcal: 55, carb: 0.5, fat: 2, protein: 10 } },
  treat_2: { name: "特製肉泥包", price: 50, desc: "多種口味可選，互動感十足。細緻肉泥質地，是增進您與貓咪感情的最佳利器。", nutrition: { kcal: 35, carb: 2, fat: 0.5, protein: 6 } },
  treat_3: { name: "鮪魚慕斯罐", price: 90, desc: "細緻慕斯質地，適口性極佳。嚴選深海鮪魚製成，營養均衡，適合各種年齡層。", nutrition: { kcal: 60, carb: 1, fat: 1.5, protein: 12 } },
  treat_4: { name: "貓草小餅乾", price: 40, desc: "添加天然貓草，幫助化毛。健康無負擔的點心，讓主子在享用美味的同時也能照顧身體。", nutrition: { kcal: 25, carb: 4, fat: 0.4, protein: 2 } },
  treat_5: { name: "鰹魚厚切片", price: 70, desc: "厚實口感，滿滿的海味精華。大塊切片滿足主子的撕咬慾望，營養又好玩。", nutrition: { kcal: 50, carb: 0.8, fat: 0.6, protein: 11.5 } }
};

// --- Helper Functions ---

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 11; hour <= 19; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  slots.push("20:00");
  slots.push("其他 (請於備註填寫)");
  return slots;
};

// --- Reusable Components ---

const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  animate = false
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'outline', 
  className?: string,
  onClick?: () => void,
  animate?: boolean
}) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";
  const variants = {
    primary: "bg-[#E67E22] text-white hover:bg-[#D35400] shadow-lg",
    secondary: "bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-md",
    outline: "border-2 border-[#5D4037] text-[#5D4037] hover:bg-[#5D4037] hover:text-white"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={animate ? { boxShadow: ["0px 0px 0px rgba(230,126,34,0)", "0px 0px 20px rgba(230,126,34,0.5)", "0px 0px 0px rgba(230,126,34,0)"] } : {}}
      transition={animate ? { duration: 2, repeat: Infinity } : {}}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
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

  useEffect(() => {
    // Set Cat of the Day
    const randomIndex = Math.floor(Math.random() * CAFE_ASSETS.cats.length);
    setCatOfTheDay(CAFE_ASSETS.cats[randomIndex]);

    // Check Cafe Status
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday
      const hour = now.getHours();
      
      if (day === 1) { // Monday is closed
        setIsOpen(false);
      } else if (hour >= 11 && hour < 20) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };

    checkStatus();
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(checkStatus, 60000);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // --- Form States (Refactored to formData object) ---
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    people: "1 位",
    phone: "",
    message: ""
  });
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false); // 先關閉手機選單
    setTimeout(() => {    // 延遲 300ms 避開動畫衝突
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // 扣除上方導航列高度
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        window.scrollTo({
          top: elementRect - bodyRect - offset,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  const handleReservationFromCat = (catName: string) => {
    setSelectedCat(null);
    setFormData(prev => ({ ...prev, name: `我想看 ${catName} 的 [您的名字]` }));
    setTimeout(() => {
      scrollToSection('contact');
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 400);
  };

  const handleReservationFromMenu = (itemName: string) => {
    setFormData(prev => {
      const prefix = "我想預定：";
      let currentMessage = prev.message.trim();
      
      // 如果目前備註不包含前綴，則視為新開始
      if (!currentMessage.startsWith(prefix)) {
        return { ...prev, message: `${prefix}${itemName} x 1` };
      }

      // 提取品項部分
      const itemsPart = currentMessage.substring(prefix.length);
      const items = itemsPart.split("、").map(i => i.trim()).filter(i => i !== "");
      
      let found = false;
      const updatedItems = items.map(item => {
        // 檢查是否為當前點擊的餐點 (格式為 "名稱 x 數量")
        if (item.startsWith(`${itemName} x `)) {
          found = true;
          const parts = item.split(" x ");
          const count = parseInt(parts[parts.length - 1], 10) || 0;
          return `${itemName} x ${count + 1}`;
        }
        return item;
      });

      if (!found) {
        updatedItems.push(`${itemName} x 1`);
      }

      return { ...prev, message: `${prefix}${updatedItems.join("、")}` };
    });

    setSelectedItem(null);
    setTimeout(() => {
      scrollToSection('contact');
    }, 400);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();

    // --- EmailJS 實作 (嚴格映射 Key 值) ---
    const templateParams = {
      name: formData.name,      // 完整字串，包含貓咪名稱
      date: formData.date,
      time: formData.time,
      people: formData.people.replace(' 位', ''), // 移除「位」字串，避免 Email 中出現重複單位
      phone: formData.phone,
      message: formData.message // 備註內容
    };

    // 使用使用者提供的金鑰
    emailjs.send(
      'service_db9pt7h', 
      'template_ok52qkf', 
      templateParams, 
      '9OI4di6PoE9_CUbk2'
    )
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        setIsSubmitted(true);
        // 重置表單
        setFormData({
          name: "",
          date: "",
          time: "",
          people: "1 位",
          phone: "",
          message: ""
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      }, (err) => {
        console.error('Failed to send email...', err);
        alert('預約傳送失敗，請檢查網路連線或直接撥打電話與我們聯繫。');
      });
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4E342E] font-sans selection:bg-[#E67E22] selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#5D4037]/10">
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-[#E67E22] transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
        
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-10 h-10 bg-[#E67E22] rounded-full flex items-center justify-center text-white group-hover:bg-[#D35400] transition-colors">
              <Coffee size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">MeowCafe <span className="text-[#E67E22]">台北</span></span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-[#5D4037]/10">
              <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isOpen ? '營業中 Open' : '休息中 Closed'}
              </span>
            </div>
            {['關於我們', '店內貓咪', '精選菜單', '預約訂位'].map((item, i) => (
              <button 
                key={i} 
                onClick={() => scrollToSection(['about', 'cats', 'menu', 'contact'][i])}
                className="hover:text-[#E67E22] transition-colors"
              >
                {item}
              </button>
            ))}
            <Button variant="primary" className="px-6 py-2 text-sm" onClick={() => scrollToSection('contact')}>
              立即預約
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FDFBF7] border-b border-[#5D4037]/10 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6 font-medium">
                {['關於我們', '店內貓咪', '精選菜單', '預約訂位'].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => scrollToSection(['about', 'cats', 'menu', 'contact'][i])}
                    className="text-left text-lg hover:text-[#E67E22]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <FadeInUp>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E67E22]/10 text-[#E67E22] rounded-full text-sm font-bold">
                <Sparkles size={16} />
                <span>台北最療癒的角落</span>
              </div>
              {catOfTheDay && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#5D4037]/5 text-[#5D4037] rounded-full text-sm font-bold cursor-pointer hover:bg-[#5D4037]/10 transition-colors"
                  onClick={() => setSelectedCat(catOfTheDay)}
                >
                  <Heart size={14} className="text-[#E67E22]" />
                  <span>今日推薦店長：{catOfTheDay.name}</span>
                </motion.div>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              在貓咪的呼嚕聲中<br />
              品味<span className="text-[#E67E22]">醇厚時光</span>
            </h1>
            <p className="text-lg text-[#5D4037]/80 mb-10 max-w-lg leading-relaxed">
              MeowCafe 不只是一家咖啡廳，更是一個讓靈魂休息的避風港。我們提供精品手沖咖啡與手工甜點，還有 6 位毛茸茸的店長隨時準備療癒您的心。
            </p>
            <div className="flex flex-wrap gap-4">
              <Button animate onClick={() => scrollToSection('menu')}>
                查看精選菜單 <ChevronRight size={20} />
              </Button>
              <Button variant="outline" onClick={() => scrollToSection('about')}>
                了解更多
              </Button>
            </div>
          </FadeInUp>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]"
            >
              <img 
                src={CAFE_ASSETS.hero.main} 
                alt="Cafe Main" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -bottom-10 -left-10 z-20 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-8 border-[#FDFBF7] hidden lg:block"
            >
              <img 
                src={CAFE_ASSETS.hero.accent} 
                alt="Cafe Accent" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E67E22]/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-20 w-60 h-60 bg-[#5D4037]/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeInUp className="order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-square">
                <img 
                  src={CAFE_ASSETS.hero.interior} 
                  alt="Interior" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </FadeInUp>
            <FadeInUp className="order-1 md:order-2" delay={0.2}>
              <h2 className="text-4xl font-bold mb-8">不只是咖啡，<br />更是一場感官的溫柔革命</h2>
              <div className="space-y-8">
                {[
                  { icon: <Coffee />, title: "精品豆手沖", desc: "嚴選世界各地莊園精品豆，由專業咖啡師精準控溫手沖，呈現最純粹的風味。" },
                  { icon: <Heart />, title: "貓咪友善環境", desc: "全店採用防滑地板與空氣淨化系統，確保您與貓咪都能在最舒適的空間互動。" },
                  { icon: <Utensils />, title: "職人手工甜點", desc: "每日限量製作，減糖配方讓您享受美味無負擔，每一口都是職人的堅持。" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-[#E67E22] shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-[#5D4037]/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Cats Section */}
      <section id="cats" className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInUp>
              <h2 className="text-4xl font-bold mb-4">遇見我們的店長</h2>
              <p className="text-[#5D4037]/70">點擊照片查看詳細的今日狀態與個性</p>
            </FadeInUp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAFE_ASSETS.cats.map((cat, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedCat(cat)}
                  className="group relative rounded-3xl overflow-hidden shadow-lg bg-white h-full flex flex-col cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={cat.src} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-[#4E342E]">{cat.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cat.workStatus === '排班中' ? 'bg-green-100 text-green-700' : 
                        cat.workStatus === '休息中' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cat.workStatus}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-[#E67E22] font-bold text-sm">{cat.breed}</span>
                    </div>
                    <p className="text-[#5D4037]/70 text-sm leading-relaxed line-clamp-2">
                      {cat.personality}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-[#E67E22]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInUp>
              <h2 className="text-4xl font-bold mb-4">精選菜單</h2>
              <p className="text-[#5D4037]/70 mb-10">為您與您的毛孩準備的專屬美味</p>
              
              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { id: 'coffee', label: '手沖咖啡', icon: <Coffee size={18} /> },
                  { id: 'dessert', label: '精緻甜點', icon: <Utensils size={18} /> },
                  { id: 'treat', label: '貓咪零食', icon: <Heart size={18} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-[#E67E22] text-white shadow-lg' 
                        : 'bg-[#FDFBF7] text-[#5D4037]/60 hover:bg-[#E67E22]/10'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 col-span-full"
              >
                {CAFE_ASSETS.menu[activeTab].map((img, i) => {
                  const itemKey = `${activeTab}_${i}`;
                  const detail = MENU_DATA[itemKey];
                  return (
                    <motion.div
                      key={itemKey}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      onClick={() => setSelectedItem({ ...detail, image: img })}
                      className="group cursor-pointer bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#5D4037]/5"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={img} 
                          alt={detail?.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold group-hover:text-[#E67E22] transition-colors">{detail?.name}</h3>
                          <span className="text-[#E67E22] font-bold">NT$ {detail?.price}</span>
                        </div>
                        <p className="text-[#5D4037]/60 text-sm line-clamp-2 mb-4">
                          {detail?.desc}
                        </p>
                        <div className="flex items-center text-xs font-bold text-[#5D4037]/40 gap-4">
                          <span className="flex items-center gap-1"><Zap size={12} /> {detail?.nutrition.kcal} kcal</span>
                          <span className="flex items-center gap-1"><Activity size={12} /> 高人氣</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#FDFBF7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FadeInUp>
              <h2 className="text-4xl font-bold mb-4">客人的溫暖回饋</h2>
              <p className="text-[#5D4037]/70">來自每一位被療癒過的靈魂</p>
            </FadeInUp>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "林小姐", role: "軟體工程師", text: "這裡是我下班後的避風港。手沖咖啡非常專業，貓咪們也都很溫柔，特別是 Chester，總是安靜地陪在旁邊。", avatar: "https://picsum.photos/seed/user1/100/100" },
              { name: "陳先生", role: "自由接案者", text: "環境非常安靜，很適合帶著筆電來工作。累的時候抬頭看看貓咪在玩耍，壓力瞬間消失了一大半。", avatar: "https://picsum.photos/seed/user2/100/100" },
              { name: "張同學", role: "大學生", text: "甜點真的超好吃！貓掌瑪德蓮可愛到捨不得吃。店員對貓咪很有愛心，空間也維持得很乾淨。", avatar: "https://picsum.photos/seed/user3/100/100" }
            ].map((t, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#5D4037]/5 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold">{t.name}</h4>
                      <p className="text-xs text-[#5D4037]/40">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-[#5D4037]/70 italic leading-relaxed flex-grow">
                    「{t.text}」
                  </p>
                  <div className="flex gap-1 mt-6 text-[#E67E22]">
                    {Array.from({ length: 5 }).map((_, j) => <Heart key={j} size={14} fill="currentColor" />)}
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Reservation */}
      <section id="contact" className="py-24 bg-[#5D4037] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeInUp>
              <h2 className="text-4xl font-bold mb-8">準備好與貓咪<br />來場約會了嗎？</h2>
              <p className="text-white/70 mb-10 leading-relaxed">
                為了確保每位客人的體驗品質與貓咪的休息空間，我們採全預約制。請提前於線上預約，我們將為您保留最舒適的位置。
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">店址</h4>
                    <p className="text-white/60">台北市大安區療癒路 102 號</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">營業時間</h4>
                    <p className="text-white/60">週二至週日 11:00 - 20:00 (週一公休)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">電話</h4>
                    <p className="text-white/60">02-2345-6789</p>
                  </div>
                </div>
              </div>
            </FadeInUp>
            
            <FadeInUp delay={0.2}>
              <div className="bg-white rounded-3xl p-8 text-[#4E342E] shadow-2xl min-h-[400px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <h3 className="text-2xl font-bold mb-6 text-center">快速預約</h3>
                      <form className="space-y-4" onSubmit={handleReservation}>
                        <div>
                          <label className="block text-sm font-bold mb-2">姓名</label>
                          <input 
                            ref={nameInputRef}
                            type="text" 
                            required 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#5D4037]/10 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50" 
                            placeholder="您的稱呼" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold mb-2">日期</label>
                            <input 
                              type="date" 
                              required 
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-[#5D4037]/10 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold mb-2">預約時段</label>
                            <select 
                              required 
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-xl border border-[#5D4037]/10 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50"
                            >
                              <option value="">請選擇時段</option>
                              {timeSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2">人數</label>
                          <select 
                            required 
                            name="people"
                            value={formData.people}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#5D4037]/10 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50"
                          >
                            <option value="1 位">1 位</option>
                            <option value="2 位">2 位</option>
                            <option value="3 位">3 位</option>
                            <option value="4 位以上">4 位以上</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2">備註與特殊需求</label>
                          <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#5D4037]/10 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50 min-h-[100px]" 
                            placeholder="例如：過敏需求、慶生安排、想坐窗邊..."
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2">聯絡電話</label>
                          <input 
                            type="tel" 
                            required 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#5D4037]/10 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50" 
                            placeholder="09xx-xxx-xxx" 
                          />
                        </div>
                        <Button className="w-full py-4 mt-4" animate>
                          確認送出預約 <Send size={18} />
                        </Button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-[#E67E22]/10 text-[#E67E22] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">預約成功！</h3>
                      <p className="text-[#5D4037]/70 text-lg mb-8">
                        我們已收到您的預約，<br />將由專人儘速與您聯繫確認。
                      </p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-[#E67E22] font-bold hover:underline"
                      >
                        返回修改資料
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInUp>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#FDFBF7] border-t border-[#5D4037]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-8">
            <motion.a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: "#E67E22" }}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors"
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: "#E67E22" }}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors"
            >
              <Facebook size={20} />
            </motion.a>
            <motion.a 
              href="mailto:service@meowcafe.com"
              whileHover={{ scale: 1.2, color: "#E67E22" }}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors"
            >
              <Mail size={20} />
            </motion.a>
          </div>
          <p className="text-sm text-[#5D4037]/40">© 2024 MeowCafe Taipei. All rights reserved. 台北市大安區療癒路 102 號</p>
        </div>
      </footer>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection('hero')}
              className="w-14 h-14 bg-white text-[#5D4037] rounded-full shadow-xl flex items-center justify-center border border-[#5D4037]/10 hover:bg-[#FDFBF7] transition-colors"
            >
              <ChevronRight size={28} className="-rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>
        <motion.a 
          href="https://line.me/ti/p/@line" // 這裡之後可以換成您的真實 LINE ID 連結
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, filter: "brightness(1.1)" }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#00B900] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#00A300] transition-colors"
        >
          <MessageCircle size={28} />
        </motion.a>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollToSection('contact')}
          className="w-14 h-14 bg-[#E67E22] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#D35400] transition-colors"
        >
          <Calendar size={28} />
        </motion.button>
      </div>

      {/* Cat Light-box Modal */}
      <AnimatePresence>
        {selectedCat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCat(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedCat(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-[#E67E22] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Left: Image */}
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src={selectedCat.src} 
                  alt={selectedCat.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right: Content */}
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl font-bold">{selectedCat.name}</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      selectedCat.workStatus === '排班中' ? 'bg-green-100 text-green-700' : 
                      selectedCat.workStatus === '休息中' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedCat.workStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#E67E22] font-bold mb-6">
                    <Sparkles size={18} />
                    <span>{selectedCat.breed} ({selectedCat.gender})</span>
                  </div>
                  
                  {/* Today's Vibe Section */}
                  <div className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#5D4037]/5 mb-6">
                    <div className="flex items-center gap-2 mb-4 font-bold text-sm uppercase tracking-wider text-[#5D4037]/40">
                      <Activity size={16} />
                      <span>今日狀態 (Today's Vibe)</span>
                    </div>
                    <p className="text-xl text-[#5D4037] leading-relaxed font-bold mb-2">
                      正在做什麼：{selectedCat.currentActivity}
                    </p>
                    <p className="text-[#5D4037]/70 italic">
                      「{selectedCat.personality}」
                    </p>
                  </div>

                  {/* Likes Section */}
                  <div className="bg-[#E67E22]/5 rounded-2xl p-6 border border-[#E67E22]/10">
                    <div className="flex items-center gap-2 mb-3 font-bold text-sm text-[#E67E22]">
                      <Heart size={16} />
                      <span>愛好描述 (Likes)</span>
                    </div>
                    <p className="text-[#5D4037] leading-relaxed">
                      {selectedCat.likes}
                    </p>
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleReservationFromCat(selectedCat.name)}>
                  與牠預約約會
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Menu Light-box Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-[#E67E22] hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Left: Image */}
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right: Content */}
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">{selectedItem.name}</h2>
                    <span className="text-2xl font-bold text-[#E67E22]">NT$ {selectedItem.price}</span>
                  </div>
                  <p className="text-lg text-[#5D4037]/70 leading-relaxed">
                    {selectedItem.desc}
                  </p>
                </div>

                {/* Nutrition Chart Section */}
                <div className="bg-[#FDFBF7] rounded-3xl p-6 border border-[#5D4037]/5">
                  <div className="flex items-center gap-2 mb-6 font-bold text-sm uppercase tracking-wider text-[#5D4037]/40">
                    <PieChart size={16} />
                    <span>營養成分分析 (每份)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E67E22]/10 flex items-center justify-center text-[#E67E22]">
                        <Zap size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-[#5D4037]/40 font-bold">熱量</div>
                        <div className="font-bold">{selectedItem.nutrition.kcal} <span className="text-[10px] font-normal">kcal</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#5D4037]/10 flex items-center justify-center text-[#5D4037]">
                        <Activity size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-[#5D4037]/40 font-bold">蛋白質</div>
                        <div className="font-bold">{selectedItem.nutrition.protein} <span className="text-[10px] font-normal">g</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#5D4037]/10 flex items-center justify-center text-[#5D4037]">
                        <Utensils size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-[#5D4037]/40 font-bold">碳水</div>
                        <div className="font-bold">{selectedItem.nutrition.carb} <span className="text-[10px] font-normal">g</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#5D4037]/10 flex items-center justify-center text-[#5D4037]">
                        <Info size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-[#5D4037]/40 font-bold">脂肪</div>
                        <div className="font-bold">{selectedItem.nutrition.fat} <span className="text-[10px] font-normal">g</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-10" onClick={() => handleReservationFromMenu(selectedItem.name)}>
                  預約這道美味
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
