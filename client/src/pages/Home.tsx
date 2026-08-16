/*
 * مبادرة "بيننا": دفتر ميداني يشرح تدخلاً وجاهياً محوره الأب والأسرة في غزة.
 * الموقع أداة عرض وتوثيق للمقترح؛ أما التدخل نفسه فينفذ عبر جلسات حضورية ومساحات آمنة.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import FileLibrary from "@/components/FileLibrary";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDot,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  UsersRound,
  Volume2,
  VolumeX,
  Waypoints,
  X,
} from "lucide-react";

// الصور داخل client/public/img لتُخدم كملفات ثابتة مع البناء.
const logoUrl = "/img/logo_7c90ce14.png";
const heroImage = "/img/binna-cover-2026_d4940ad9.png";
const familyImage = "/img/hero-banner_e1f3d1bd.png";
const communityImage = "/img/community_1b547e2d.png";
const mentorshipImage = "/img/mentorship_a47a42fe.png";

const tracks = [
  {
    id: "calm",
    number: "01",
    label: "المحور الأول",
    title: "أب يستعيد هدوءه",
    description: "مساحة عملية لفهم الضغط الذي يحمله الأب، وتعلّم التوقف والتنفس والاختيار قبل أن يتحول التوتر إلى أذى داخل البيت.",
    detail: "يتدرّب المشاركون على تقنية «توقف – تنفس – اختر»، وعلى التعرف إلى إشارات الانفعال، وطلب المساندة دون خجل أو وصمة.",
    icon: Waypoints,
    tone: "terracotta",
  },
  {
    id: "listen",
    number: "02",
    label: "المحور الثاني",
    title: "أب يصغي ويشارك",
    description: "تدريب على الإصغاء الفعال، ورسائل «أنا»، وتقاسم أعمال الرعاية حتى تصبح الشراكة سلوكاً يومياً لا شعاراً.",
    detail: "يضع كل أب خطة أسرية صغيرة قابلة للتطبيق، ويجرب حواراً قصيراً مع شريكته أو أطفاله حول حمل يمكن تخفيفه.",
    icon: HeartHandshake,
    tone: "sage",
  },
  {
    id: "protect",
    number: "03",
    label: "المحور الثالث",
    title: "أب يحمي دون عنف",
    description: "إعادة تعريف القوة بوصفها حماية واحتواءً وانضباطاً إيجابياً، لا صراخاً أو عقاباً بدنياً أو انسحاباً عاطفياً.",
    detail: "تتناول الجلسات بدائل العقاب، وإدارة الخلاف داخل الأسرة، ومتى يحتاج الأب إلى إحالة نفسية أو اجتماعية متخصصة.",
    icon: ShieldCheck,
    tone: "dusk",
  },
] as const;

const practices = [
  ["01", "توقف – تنفس – اختر", "ثلاثون ثانية فاصلة قبل الرد حين يرتفع الضغط."],
  ["02", "رسائل أنا", "أصف شعوري واحتياجي دون اتهام أو تهديد."],
  ["03", "مهمة مشتركة", "أختار عملاً يومياً واضحاً وأتقاسمه مع الأسرة."],
  ["04", "مساحة أمان", "أصغي لعشر دقائق دون مقاطعة أو تقليل من المشاعر."],
] as const;

const steps = [
  ["01", "ألاحظ", "ما الذي يحدث في جسدي وبيتي قبل أن أنفعل؟", "وعي"],
  ["02", "أهدأ", "أستخدم التوقف والتنفس وأؤجل الرد المؤذي.", "تنظيم"],
  ["03", "أقترب", "أسأل وأصغي وأشارك مهمة واحدة قابلة للملاحظة.", "شراكة"],
  ["04", "أنقل", "أشارك أداة نافعة مع أب آخر في الحي.", "استدامة"],
] as const;

const impactStats = [
  ["60", "", "أباً ومقدّم رعاية", "في ثلاث مجموعات تدريبية حضورية", UsersRound],
  ["06", "", "جلسات ميدانية", "موزعة على ثلاث مجموعات", CalendarDays],
  ["60", "", "خطة أسرية", "خطة واحدة قابلة للتطبيق لكل مشارك", Target],
  ["70", "%", "تحسناً مستهدفاً", "مع استهداف تطبيق 3 ممارسات أسرية على الأقل لدى 75% من المشاركين وفق القياس القبلي والبعدي", BarChart3],
] as const;

const impactBreakdown = [
  { id: "group-one", label: "المجموعة الأولى", percent: 33, detail: "20 أباً يطبقون أدوات التهدئة الذاتية وإدارة الضغط داخل الأسرة." },
  { id: "group-two", label: "المجموعة الثانية", percent: 33, detail: "20 أباً يتدربون على الإصغاء ورسائل «أنا» وتقاسم الرعاية." },
  { id: "group-three", label: "المجموعة الثالثة", percent: 34, detail: "20 أباً يطورون الانضباط الإيجابي وخطط الحماية دون عنف." },
] as const;

const workshops = [
  ["01", "الأب تحت الضغط", "فهم السياق وتسمية الحمل النفسي"],
  ["02", "التوقف قبل الانفجار", "تقنيات التهدئة والتنظيم الذاتي"],
  ["03", "كيف نصغي؟", "الإصغاء الفعال ورسائل «أنا»"],
  ["04", "الرعاية مسؤولية مشتركة", "تقاسم العمل داخل البيت"],
  ["05", "الحزم دون أذى", "بدائل العقاب والعنف"],
  ["06", "خطة بيت أكثر أماناً", "تثبيت العادة والإحالة عند الحاجة"],
] as const;

const budgets = [
  ["الجلسات والمواد التدريبية", "أدلة، قرطاسية، أدوات تطبيق ومساحات آمنة", "مكوّن أساسي"],
  ["التيسير والدعم النفسي الاجتماعي", "ميسرون ميدانيون، متابعة وحماية وإحالات", "مكوّن أساسي"],
  ["التنقل والتنسيق", "الوصول إلى مجموعات الآباء في أماكن الإيواء", "مكوّن تشغيلي"],
  ["القياس والتوثيق", "أدوات قبلي/بعدي وتقرير شراكة موثق", "مكوّن مساءلة"],
] as const;

const weeks = [
  ["01", "التهيئة وفهم الضغط", "فريق المبادرة", ["التعارف وقواعد الأمان", "فهم ضغط النزوح والإعالة", "تسمية الاحتياجات دون وصمة"], "خريطة ضغط أولية لكل مجموعة"],
  ["02", "التهدئة والتنظيم الذاتي", "ميسرو المجموعات", ["توقف – تنفس – اختر", "رصد إشارات الانفعال", "طلب المساندة عند الحاجة"], "أداة تهدئة قابلة للتجربة داخل البيت"],
  ["03", "الإصغاء ورسائل أنا", "ميسرو المجموعات", ["الإصغاء الفعال", "وصف الشعور والاحتياج", "تجربة حوار قصير دون اتهام"], "تجربة حوار أسري آمن"],
  ["04", "الرعاية مسؤولية مشتركة", "ميسرو المجموعات", ["تقاسم مهمة منزلية واضحة", "فهم أعباء الرعاية", "الاتفاق على خطوة يومية"], "خطة أسرية أولية لكل مشارك"],
  ["05", "الحزم دون عنف", "ميسرو المجموعات", ["بدائل العقاب", "إدارة الخلاف", "الحماية والاحتواء داخل البيت"], "خطة حماية أسرية قابلة للتطبيق"],
  ["06", "التثبيت والقياس", "المنسق والخبير", ["مراجعة التطبيق", "القياس القبلي والبعدي", "اختيار سفراء وإحالات عند الحاجة"], "60 خطة أسرية و6–10 سفراء محتملين"],
] as const;

const faqs = [
  ["هل المبادرة للآباء فقط؟", "محور التدخل هو الأب ومقدم الرعاية، لكن أثره يستهدف الأسرة كلها. تشارك الزوجة والأطفال عبر الخطط الأسرية والإحالات والأنشطة الداعمة، دون تحويلهم إلى جمهور ثانوي."],
  ["أين تنفذ الأنشطة؟", "في مساحات آمنة ومناسبة داخل أماكن الإيواء أو المجتمع المحلي، وبمجموعات صغيرة تراعي الخصوصية والظروف الأمنية."],
  ["هل هي حملة توعية؟", "لا. هي تدخل ميداني تدريبي تطبيقي: 6 جلسات موزعة على 3 مجموعات، خطط أسرية، متابعة، قياس قبلي وبعدي، وتأهيل سفراء محليين."],
  ["ماذا يحدث إذا احتاج أب إلى دعم متخصص؟", "تُحفظ الخصوصية، ويجري الميسر إحالة آمنة إلى خدمات نفسية أو اجتماعية متاحة وفق بروتوكول الشريك والمنطقة."],
  ["كيف تستمر المبادرة بعد انتهاء الجلسات؟", "من خلال خطط الأسر، وتأهيل 6–10 سفراء محليين، وتسليم الأدوات والتعلم المتراكم للشركاء والقيادات المجتمعية."],
] as const;

const pageTitles = ["الغلاف", "المشكلة", "الفجوة", "الحل", "المسار التدريبي", "منطق التغيير", "الأثر", "الميديا", "الميزانية", "الحماية", "الشراكة"];
const pageRoutes: Record<string, number> = { problem: 1, gap: 2, solution: 3, training: 4, change: 5, impact: 6, media: 7, budget: 8, protection: 9, join: 10, files: 10 };

type ViewMode = "story" | "book" | "scroll";

const storyScenes = [
  { number: "01", label: "المشهد الأول", title: "حين يحمل الأب أكثر مما يستطيع", intro: "في أماكن الإيواء، لا يعيش الأب ضغط الحرب وحده؛ يحمل مسؤولية الحماية والإعالة والخوف على أسرته. تبدأ بيننا من الاعتراف بهذا الحمل، لا من لوم صاحبه.", prompt: "افتح السؤال الذي لا يجد وقتاً للكلام.", page: 0, image: heroImage, caption: "الغلاف · الأب والأسرة", tone: "opening" },
  { number: "02", label: "المشهد الثاني", title: "المشكلة ليست نقص النوايا", intro: "كثير من الآباء يريدون حماية بيوتهم، لكن الضغط والعزلة وفقدان الخصوصية وغياب الأدوات قد يدفعهم إلى الصراخ أو الانسحاب أو العقاب.", prompt: "اقرأ المشكلة كما يعيشها البيت.", page: 1, image: communityImage, caption: "المشكلة · ضغط ونزوح ومسؤولية", tone: "blue" },
  { number: "03", label: "المشهد الثالث", title: "فجوة بين الرغبة والأداة", intro: "الفجوة ليست في الرغبة بحماية الأسرة؛ بل في غياب مساحة آمنة وتدريب عملي ومتابعة تساعد الأب على تحويل النية إلى سلوك يومي قابل للملاحظة.", prompt: "سمِّ الفجوة التي تمنع التغيير.", page: 2, image: familyImage, caption: "الفجوة · نية بلا أدوات", tone: "warm" },
  { number: "04", label: "المشهد الرابع", title: "حل ميداني يبدأ من الأب", intro: "بيننا تدخل وجاهي لا محاضرة: مجموعات صغيرة، تيسير يحترم الواقع، وأدوات عملية تنتقل من الجلسة إلى البيت دون إضافة عبء جديد.", prompt: "شاهد كيف يتحول الاحتياج إلى حل.", page: 3, image: mentorshipImage, caption: "الحل · مساحات آمنة وتدريب تطبيقي", tone: "sage" },
  { number: "05", label: "المشهد الخامس", title: "ست جلسات من الفهم إلى التثبيت", intro: "يتدرج المسار من فهم الضغط والتهدئة إلى الإصغاء وتقاسم الرعاية والحزم دون عنف ثم خطة بيت أكثر أماناً.", prompt: "افتح المسار التدريبي.", page: 4, image: mentorshipImage, caption: "التدريب · ست جلسات حضورية", tone: "terracotta" },
  { number: "06", label: "المشهد السادس", title: "إذا تغيّر الأب، اتسع الأمان", intro: "نربط بين الجلسة والممارسة والمتابعة: أب يلاحظ، يهدأ، يقترب، ثم ينقل أداة نافعة إلى أب آخر. هكذا تصبح النتيجة سلسلة لا لحظة.", prompt: "تابع منطق التغيير خطوة بخطوة.", page: 5, image: familyImage, caption: "منطق التغيير · ممارسة ثم متابعة", tone: "sand" },
  { number: "07", label: "المشهد السابع", title: "الأثر يُقاس باحترام", intro: "نقيس الوعي والممارسة قبلياً وبعدياً، ونوثق الخطط الأسرية والتعلم دون كشف خصوصية المشاركين. الأثر ليس رقماً منفصلاً عن حياة الناس.", prompt: "انظر إلى الأثر المتوقع بوضوح.", page: 6, image: communityImage, caption: "الأثر · تعلم ومساءلة", tone: "sage" },
  { number: "08", label: "المشهد الثامن", title: "الميديا تفتح باب الفهم", intro: "نستخدم قصة ميدانية وصوراً توثيقية مصونة الكرامة ومواداً تعريفية لشرح الفكرة للشركاء، لا لاستبدال العمل الوجاهي أو عرض الناس كصور.", prompt: "شاهد كيف نحكي الحكاية بمسؤولية.", page: 7, image: heroImage, caption: "الميديا · حكاية تحفظ الكرامة", tone: "blue" },
  { number: "09", label: "المشهد التاسع", title: "تمويل واضح لنتيجة واضحة", intro: "توجّه الميزانية إلى الجلسات والمواد والتيسير والدعم النفسي الاجتماعي والتنقل والقياس والتوثيق، بإجمالي 4,000 دولار.", prompt: "افتح خريطة الميزانية.", page: 8, image: communityImage, caption: "الميزانية · موارد تصل إلى الميدان", tone: "warm" },
  { number: "10", label: "المشهد العاشر", title: "الحماية ليست فقرة أخيرة", intro: "الخصوصية، الموافقة، قواعد السلوك، الإحالات الآمنة، وعدم كشف القصص أو الصور؛ كلها شروط تسبق النشاط وترافقه.", prompt: "اقرأ كيف نحمي المشاركين.", page: 9, image: mentorshipImage, caption: "الحماية · أمان وخصوصية وإحالة", tone: "sage" },
  { number: "11", label: "المشهد الأخير", title: "الشراكة هنا فعل حماية", intro: "دعم بيننا يعني تمويل جلسات آمنة، وتيسيراً مهنياً، وقياساً مسؤولاً، ومساحة لآباء يريدون أن يبنوا بيتاً أكثر أماناً رغم الحرب.", prompt: "افتح باب الشراكة.", page: 10, image: familyImage, caption: "الشراكة · لنَبْنِ بيننا", tone: "closing" },
];

function SectionKicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`notebook-kicker ${light ? "notebook-kicker--light" : ""}`}><span />{children}<b>✦</b></div>;
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("story");
  const [nightMode, setNightMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [impactFocus, setImpactFocus] = useState("group-one");
  const [modal, setModal] = useState<"guide" | "story" | "files" | null>(null);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev">("next");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const touchStart = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playPageTurn = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    const AudioContextConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(165, now);
    oscillator.frequency.exponentialRampToValueAtTime(92, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.13);
  };

  const goPage = (page: number) => {
    const bounded = Math.max(0, Math.min(pageTitles.length - 1, page));
    if (bounded !== currentPage) {
      setTurnDirection(bounded >= currentPage ? "next" : "prev");
      setCurrentPage(bounded);
      playPageTurn();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const go = (key: string) => {
    setMenuOpen(false);
    if (key === "files") {
      setModal("files");
      return;
    }
    if (viewMode !== "scroll") goPage(pageRoutes[key] ?? 0);
    else document.getElementById(`scroll-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (viewMode === "scroll" || modal || contentsOpen) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") goPage(currentPage + 1);
      if (event.key === "ArrowRight" || event.key === "ArrowUp") goPage(currentPage - 1);
      if (event.key === "Escape") { setContentsOpen(false); setModal(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentPage, viewMode, modal, contentsOpen]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => { touchStart.current = event.clientX; };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (touchStart.current === null || viewMode === "scroll") return;
    const delta = event.clientX - touchStart.current;
    if (Math.abs(delta) > 55) goPage(delta < 0 ? currentPage + 1 : currentPage - 1);
    touchStart.current = null;
  };

  const handleBookPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || viewMode !== "book") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--book-rotate-y", `${(x * 4).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--book-rotate-x", `${(-y * 3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--book-lift", `${Math.max(0, -y * 2).toFixed(2)}px`);
  };

  const resetBookTilt = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--book-rotate-y", "0deg");
    event.currentTarget.style.setProperty("--book-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--book-lift", "0px");
  };

  const renderPage = (page: number) => {
    const total = pageTitles.length.toString().padStart(2, "0");
    if (page === 0) return <article className="notebook-page notebook-cover"><div className="cover-label">دفتر مبادرة <span>2026</span></div><div className="cover-scribble">✦</div><div className="cover-layout"><div className="cover-copy"><SectionKicker>تدخل ميداني للأب والأسرة في غزة</SectionKicker><h1>بيننا</h1><p>آباء يبنون بيتاً آمناً رغم الحرب</p><div className="cover-line" /><span className="cover-prompt">افتح الدفتر من السؤال الذي لا يجد وقتاً للكلام.</span><button className="notebook-primary" onClick={() => goPage(1)}>افتح الدفتر <ArrowLeft size={17} /></button></div><div className="cover-visual"><img src={heroImage} alt="صورة تحريرية رمزية عن أب يحمي أسرته في ظروف صعبة" /><div className="cover-stamp"><span>الأمان</span><strong>يبدأ بيننا</strong><i>✦</i></div><small>ملاحظة ميدانية 01 / الأب والأسرة</small></div></div><div className="cover-footer"><span>القوة التي تحمي وتحتوي وتشارك</span><span>بيننا / 01</span></div></article>;
    if (page === 1) return <article className="notebook-page page-impact page-problem"><div className="page-number">02 <span>/ {total}</span></div><SectionKicker light>المشكلة</SectionKicker><div className="impact-page-heading"><h2>ضغط الحرب<br /><em>يدخل البيت.</em></h2><p>النزوح وفقدان الخصوصية والقلق على الإعالة قد تدفع الأب إلى الصمت أو الانفجار أو العقاب، رغم رغبته في حماية أسرته.</p></div><div className="impact-page-grid"><div className="impact-page-stat"><ShieldCheck size={20} /><strong>01</strong><b>ضغط متراكم</b><span>الخوف والإعالة وفقدان المأوى يستهلكون قدرة الأب على الهدوء.</span></div><div className="impact-page-stat"><HeartHandshake size={20} /><strong>02</strong><b>بيت متوتر</b><span>الصمت أو الصراخ أو الانسحاب قد يصبح لغة يومية بلا بديل.</span></div><div className="impact-page-stat"><Target size={20} /><strong>03</strong><b>رغبة بلا أداة</b><span>الأب يريد الحماية لكنه لا يجد تدريباً قريباً من واقعه.</span></div></div><div className="impact-focus-note">لا نبدأ من لوم الأب؛ نبدأ من الاعتراف بحمله وبحق أسرته في أمان يومي.</div></article>;
    if (page === 2) return <article className="notebook-page page-gap"><div className="page-number">03 <span>/ {total}</span></div><SectionKicker>الفجوة</SectionKicker><div className="idea-grid"><div><h2>نية طيبة<br /><em>بلا أدوات.</em></h2><p className="page-lead">الفجوة ليست في الرغبة بحماية الأسرة؛ بل في غياب مساحة آمنة وتدريب عملي ومتابعة تساعد الأب على تحويل النية إلى سلوك يومي قابل للملاحظة.</p></div><div className="idea-side"><div className="page-photo"><img src={familyImage} alt="أب مع أطفاله أمام خيمة نزوح" /><span>من النية إلى الممارسة</span></div><blockquote><Quote size={19} /><p>بيننا تصل إلى المسافة بين ما يريد الأب فعله وما يستطيع فعله تحت الضغط.</p></blockquote></div></div><div className="page-bottom-note"><span>الفجوة</span><p>قلة التدخلات التي تخاطب الأب مباشرة كشريك في الأمان الأسري وتجمع التدريب والمتابعة والإحالة في مسار واحد.</p></div></article>;
    if (page === 3) return <article className="notebook-page page-tracks page-solution"><div className="page-number">04 <span>/ {total}</span></div><SectionKicker>الحل</SectionKicker><div className="page-heading-row"><h2>حل ميداني<br /><em>يبدأ من الأب.</em></h2><p>تدخل وجاهي لا محاضرة: مجموعات صغيرة، تيسير يحترم الواقع، وأدوات عملية تنتقل من الجلسة إلى البيت.</p></div><div className="notebook-track-list">{tracks.map((track) => { const Icon = track.icon; const open = activeTrack === track.id; return <div className={`notebook-track-card notebook-track-card--${track.tone} ${open ? "is-open" : ""}`} key={track.id}><div className="track-card-main"><span className="track-index">{track.number}</span><Icon size={24} /><div><small>{track.label}</small><h3>{track.title}</h3><p>{track.description}</p></div></div><button onClick={() => setActiveTrack(open ? null : track.id)} aria-expanded={open}>{open ? "أغلق" : "افتح التفاصيل"}{open ? <ChevronDown size={15} /> : <Plus size={15} />}</button>{open && <div className="notebook-track-detail">{track.detail}</div>}</div>; })}</div><div className="page-margin-note">الحل ليس درساً منفصلاً؛ إنه ممارسة تُجرب داخل البيت.</div></article>;
    if (page === 4) return <article className="notebook-page page-campaign"><div className="page-number">05 <span>/ {total}</span></div><SectionKicker>المسار التدريبي</SectionKicker><div className="campaign-page-head"><div><h2>ست جلسات<br /><em>من الفهم إلى التثبيت.</em></h2><p>مسار تطبيقي قصير يدرّب الأب على التهدئة والإصغاء والشراكة والحماية دون عنف.</p></div><div className="campaign-card-note"><CalendarDays size={20} /><strong>06</strong><span>جلسات حضورية<br />في ثلاث مجموعات</span></div></div><div className="episode-book-grid">{workshops.map(([number, title, type]) => <button className="episode-book-card" key={number} onClick={() => setModal("guide")}><span>{number}</span><i><Check size={11} /></i><strong>{title}</strong><small>{type}</small></button>)}</div><div className="page-bottom-note"><span>60 أباً</span><p>ينتج كل مشارك خطة أسرية قابلة للتطبيق، وتراجع في الجلسات اللاحقة مع احترام الخصوصية.</p></div></article>;
    if (page === 5) return <article className="notebook-page page-change"><div className="page-number">06 <span>/ {total}</span></div><SectionKicker>منطق التغيير</SectionKicker><div className="resilience-heading"><h2>من الوعي<br /><em>إلى السلوك.</em></h2><p>نربط بين الجلسة والممارسة والمتابعة: أب يلاحظ، يهدأ، يقترب، ثم ينقل أداة نافعة إلى أب آخر.</p></div><div className="resilience-notes">{steps.map(([number, title, text, tag]) => <div key={number}><span className="change-step-number">{number}</span><strong>{title}</strong><span>{text}</span><small>{tag}</small></div>)}</div><div className="page-margin-note">التغيير يصبح ممكناً حين يكون صغيراً، مرئياً، ومدعوماً.</div></article>;
    if (page === 6) return <article className="notebook-page page-practice"><div className="page-number">07 <span>/ {total}</span></div><SectionKicker>الأثر</SectionKicker><div className="practice-budget-grid"><div><h2>أرقام<br /><em>تخدم الناس.</em></h2><div className="practice-book-list">{impactStats.map(([value, suffix, label, note, Icon]) => <div key={label}><span><Icon size={15} /></span><div><strong>{value}{suffix} · {label}</strong><p>{note}</p></div><Check size={15} /></div>)}</div></div><div className="budget-book"><div className="budget-title"><span>توزيع المشاركين</span><strong>60</strong><small>أب ومقدم رعاية في ثلاث مجموعات</small></div>{impactBreakdown.map((item) => <button className="budget-book-row" key={item.id} onClick={() => setImpactFocus(item.id)}><div><strong>{item.label}</strong><b>{item.percent}%</b></div><div className="budget-meter"><span className={impactFocus === item.id ? "budget-orange" : "budget-sage"} style={{ width: `${item.percent}%` }} /></div><small>{item.detail}</small></button>)}<div className="small-text-action"><ClipboardCheck size={14} /> قياس قبلي وبعدي مع تقرير تعلم</div></div></div></article>;
    if (page === 7) return <article className="notebook-page page-media"><div className="page-number">08 <span>/ {total}</span></div><SectionKicker>الميديا</SectionKicker><div className="join-page-layout"><div><h2>نحكي<br /><em>بمسؤولية.</em></h2><p>الميديا هنا أداة تعريف وتوثيق تحفظ الكرامة: قصة ميدانية، صور بموافقة، ومواد مختصرة تشرح للشريك ماذا يحدث في الميدان.</p><div className="media-points"><span><Check size={14} /> لا صورة بلا موافقة</span><span><Check size={14} /> لا قصة تكشف هوية أسرة</span><span><Check size={14} /> لا محتوى يستبدل العمل الوجاهي</span></div></div><div className="join-page-visual"><img src={heroImage} alt="صورة تحريرية رمزية تحفظ كرامة الأسرة" /><div><HeartHandshake size={16} />الحكاية تفتح باب الفهم</div></div></div><div className="page-bottom-note"><span>مبدأنا</span><p>نستخدم الصورة لتقريب الفكرة لا لاستعراض الناس، ونشارك المواد وفق موافقات وحماية واضحة.</p></div></article>;
    if (page === 8) return <article className="notebook-page page-budget"><div className="page-number">09 <span>/ {total}</span></div><SectionKicker>الميزانية</SectionKicker><div className="page-heading-row"><h2>4,000 دولار<br /><em>تصل إلى الميدان.</em></h2><p>ميزانية مختصرة وواضحة تربط كل بند بما يحتاجه الأب والميسر والمجموعة.</p></div><div className="budget-line-list">{budgets.map(([title, detail, tag]) => <div key={title}><span className="budget-line-dot" /><div><strong>{title}</strong><p>{detail}</p></div><small>{tag}</small></div>)}</div><div className="page-bottom-note"><span>المساءلة</span><p>يقدم الشريك تقريراً مالياً وتقرير تعلم يوضح التنفيذ والمخرجات دون كشف بيانات المشاركين.</p></div></article>;
    if (page === 9) return <article className="notebook-page page-protection"><div className="page-number">10 <span>/ {total}</span></div><SectionKicker>الحماية</SectionKicker><div className="resilience-heading"><h2>الأمان<br /><em>قبل النشاط.</em></h2><p>الخصوصية والموافقة وقواعد السلوك والإحالات الآمنة ليست ملحقاً؛ إنها شروط تسبق الجلسة وترافقها.</p></div><div className="resilience-notes"><div><ShieldCheck size={18} /><strong>مساحة آمنة</strong><span>اختيار مكان مناسب وقواعد واضحة للحديث.</span></div><div><HeartHandshake size={18} /><strong>موافقة وخصوصية</strong><span>لا تصوير ولا مشاركة قصص دون موافقة.</span></div><div><ClipboardCheck size={18} /><strong>إحالة مسؤولة</strong><span>مسار آمن للدعم النفسي والاجتماعي عند الحاجة.</span></div></div><div className="faq-book-list">{faqs.slice(0, 3).map(([question, answer], index) => <div className={`faq-book-item ${activeFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setActiveFaq(activeFaq === index ? null : index)}>{question}{activeFaq === index ? <ChevronDown size={15} /> : <Plus size={15} />}</button>{activeFaq === index && <p>{answer}</p>}</div>)}</div><div className="page-margin-note">لا أثر بلا حماية.</div></article>;
    return <article className="notebook-page page-join"><div className="page-number">11 <span>/ {total}</span></div><div className="join-page-layout"><div><SectionKicker>الشراكة</SectionKicker><h2>لنَبْنِ<br /><em>بيننا.</em></h2><p>تحتاج المبادرة إلى شريك يؤمن بأن حماية الأسرة تبدأ من دعم الأب بأدوات عملية، وميسرين مؤهلين، ومساحة آمنة، وقياس مسؤول للأثر.</p><div className="join-page-buttons"><button className="notebook-primary" onClick={() => setModal("story")}>تواصل للشراكة <Send size={16} /></button><button className="notebook-quiet" onClick={() => setModal("files")}><FileText size={16} /> مكتبة الوثائق</button></div></div><div className="join-page-visual"><img src={mentorshipImage} alt="دائرة حوار داعمة بين آباء وأفراد من المجتمع" /><div><HeartHandshake size={16} />الأمان يبدأ بيننا</div></div></div><div className="steps-book-row">{steps.map(([number, title, text, tag]) => <div key={number}><span>{number} · {tag}</span><strong>{title}</strong><p>{text}</p></div>)}</div><div className="join-signoff">أب واحد مدعوم، بيت أكثر أماناً <HeartHandshake size={16} /></div></article>;
  };

  const renderStoryScene = () => {
    const scene = storyScenes[currentPage];
    const progress = ((currentPage + 1) / storyScenes.length) * 100;
    return <main className={`story-stage story-stage--${scene.tone}`} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <div className="story-progress" aria-label={`المشهد ${scene.number} من ${storyScenes.length}`}><span style={{ width: `${progress}%` }} /></div>
      <div className="story-scene-meta"><span>{scene.label}</span><b>{scene.number} / {storyScenes.length.toString().padStart(2, "0")}</b></div>
      <div className="story-scene-grid"><div className="story-copy"><SectionKicker>{currentPage === 0 ? "تدخل ميداني للآباء في غزة" : "قصة مبادرة بيننا"}</SectionKicker><span className="story-chapter-mark">{scene.number}</span><h1>{scene.title}</h1><p className="story-intro">{scene.intro}</p><div className="story-rule" /><p className="story-prompt"><CircleDot size={15} />{scene.prompt}</p><div className="story-actions"><button className="notebook-primary" onClick={() => goPage(currentPage + 1)} disabled={currentPage === storyScenes.length - 1}>{currentPage === storyScenes.length - 1 ? "هذه لحظتك" : "أكمل القصة"} <ArrowLeft size={17} /></button>{currentPage > 0 && <button className="notebook-quiet" onClick={() => goPage(currentPage - 1)}><ArrowRight size={16} /> المشهد السابق</button>}{currentPage > 0 && currentPage < storyScenes.length - 1 && <button className="story-detail-link" onClick={() => { setViewMode("book"); goPage(scene.page); }}>اقرأ التفاصيل <FileText size={14} /></button>}</div></div><div className="story-visual-wrap"><div className="story-visual-frame"><img src={scene.image} alt={scene.caption} /><span className="story-visual-index">مشهد {scene.number}</span><div className="story-caption"><span>{scene.caption}</span><i>✦</i></div></div><div className="story-side-note"><span>دفتر بيننا</span><strong>{currentPage === 0 ? "يبدأ من الأب" : currentPage === storyScenes.length - 1 ? "ينتقل إلى الشريك" : "يمرّ من بيت إلى بيت"}</strong></div></div></div>
      <div className="story-scene-footer"><span>بيننا · آباء يبنون بيتاً آمناً رغم الحرب</span><span>{currentPage === storyScenes.length - 1 ? "الشراكة التي تفتح باباً" : "الفصل التالي يضيف أداة"}</span></div>
      <div className="story-navigation"><button className="story-arrow" onClick={() => goPage(currentPage - 1)} disabled={currentPage === 0} aria-label="المشهد السابق"><ArrowRight size={18} /></button><div className="story-dots">{storyScenes.map((item, index) => <button key={item.number} className={index === currentPage ? "is-active" : ""} onClick={() => goPage(index)} aria-label={`الانتقال إلى ${item.label}`}><span>{item.number}</span></button>)}</div><button className="story-arrow" onClick={() => goPage(currentPage + 1)} disabled={currentPage === storyScenes.length - 1} aria-label="المشهد التالي"><ArrowLeft size={18} /></button></div>
      <div className="story-hint"><span>اسحب لمتابعة الحكاية</span><i>✦</i><span>أو استخدم الأسهم</span></div>
    </main>;
  };

  const scrollSlugs = ["cover", "problem", "gap", "solution", "training", "change", "impact", "media", "budget", "protection", "join"] as const;
  const bookClass = `notebook-app ${nightMode ? "notebook-app--night" : ""} ${viewMode === "scroll" ? "notebook-app--scroll" : viewMode === "story" ? "notebook-app--story" : "notebook-app--book"}`;
  return <div className={bookClass} dir="rtl">
    <header className="notebook-header"><button className="notebook-brand" onClick={() => { setViewMode("story"); goPage(0); }}><span><img src={logoUrl} alt="" /></span><b>بيننا</b><small>آباء يبنون بيتاً آمناً رغم الحرب</small></button><div className="notebook-view-switch"><span>طريقة العرض</span><button className={viewMode === "story" ? "active" : ""} onClick={() => setViewMode("story")}><CircleDot size={15} /> قصة</button><button className={viewMode === "book" ? "active" : ""} onClick={() => setViewMode("book")}><BookOpen size={15} /> دفتر</button><button className={viewMode === "scroll" ? "active" : ""} onClick={() => setViewMode("scroll")}><FileText size={15} /> تمرير</button><button className="night-switch" onClick={() => setNightMode(!nightMode)}>{nightMode ? <Sun size={15} /> : <Moon size={15} />} {nightMode ? "نهار" : "ليل"}</button><button className="sound-switch" onClick={() => setSoundEnabled((enabled) => !enabled)} aria-pressed={soundEnabled} title={soundEnabled ? "كتم صوت تقليب الصفحات" : "تشغيل صوت تقليب الصفحات"}>{soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />} {soundEnabled ? "صوت التقليب" : "الصوت مكتوم"}</button>{isAuthenticated && <button className="notebook-auth" onClick={() => void logout()}>خروج</button>}</div><button className="notebook-menu-button" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></header>
    {menuOpen && <nav className="notebook-menu"><button onClick={() => go("problem")}>المشكلة</button><button onClick={() => go("gap")}>الفجوة</button><button onClick={() => go("solution")}>الحل</button><button onClick={() => go("training")}>المسار التدريبي</button><button onClick={() => go("change")}>منطق التغيير</button><button onClick={() => go("impact")}>الأثر</button><button onClick={() => go("media")}>الميديا</button><button onClick={() => go("budget")}>الميزانية</button><button onClick={() => go("protection")}>الحماية</button><button onClick={() => go("join")}>الشراكة</button><button onClick={() => setModal("files")}>مكتبة الوثائق <FileText size={15} /></button></nav>}
    {viewMode === "story" ? renderStoryScene() : viewMode === "book" ? <><div className="notebook-controls"><button onClick={() => setContentsOpen(true)}><BookOpen size={15} /> الفهرس</button><button disabled={currentPage === 0} onClick={() => goPage(currentPage - 1)}><ArrowRight size={15} /> السابق</button><span>صفحة {currentPage + 1} / {pageTitles.length}</span><button disabled={currentPage === pageTitles.length - 1} onClick={() => goPage(currentPage + 1)}>التالي <ArrowLeft size={15} /></button></div><main className="book-stage book-stage--3d" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handleBookPointerMove} onPointerLeave={resetBookTilt}><div className="book-object"><div className={`page-turn page-turn--${turnDirection}`} key={currentPage}>{renderPage(currentPage)}</div></div><div className="book-hint"><span>اسحب لقلب الصفحات</span><i>✦</i><span>أو استخدم الأسهم</span></div></main></> : <main className="scroll-stage">{pageTitles.map((_, index) => <section id={`scroll-${scrollSlugs[index]}`} key={index}>{renderPage(index)}</section>)}</main>}
    <footer className="notebook-footer"><span>صُنع بالاهتمام <HeartHandshake size={13} /></span><span>بيننا · غزة · 2026</span><button onClick={() => setModal("story")}><Mail size={13} /> تواصل للشراكة</button></footer>
    {contentsOpen && <div className="contents-overlay" onClick={() => setContentsOpen(false)}><div className="contents-card" onClick={(event) => event.stopPropagation()}><button className="contents-close" onClick={() => setContentsOpen(false)}><X size={17} /></button><SectionKicker>فهرس الدفتر</SectionKicker><h2>تدخل واحد،<br /><em>فصول كثيرة.</em></h2><div>{pageTitles.map((title, index) => <button key={title} onClick={() => { setContentsOpen(false); goPage(index); }}><span>0{index + 1}</span><strong>{title}</strong><ArrowLeft size={15} /></button>)}</div></div></div>}
    {modal && <div className="modal-backdrop" role="presentation" onClick={() => setModal(null)}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)} aria-label="إغلاق"><X size={19} /></button>{modal === "files" ? <><div className="modal-symbol"><FileText size={22} /></div><SectionKicker>وثائق الشراكة</SectionKicker><h2 id="modal-title">مكتبة<br /><em>بيننا.</em></h2><p>هذه مساحة لحفظ مقترحات الشراكة والمواد التدريبية للمستخدمين المصرح لهم. أما أنشطة المبادرة نفسها فتنفذ وجاهياً في الميدان.</p><FileLibrary /></> : modal === "guide" ? <><div className="modal-symbol"><BookOpen size={22} /></div><SectionKicker>نشاط ميداني</SectionKicker><h2 id="modal-title">الأداة تبدأ<br /><em>من موقف.</em></h2><p>جرّب اليوم: توقف، تنفس، واختر جملة تبدأ بـ «أنا أشعر...» بدل الصراخ أو الاتهام. ثم اكتب مهمة واحدة يمكن مشاركتها داخل البيت.</p><div className="modal-choices"><div><Check size={15} /> أسمّي الضغط قبل أن أتصرف</div><div><Check size={15} /> أصغي دون مقاطعة</div><div><Check size={15} /> أشارك مسؤولية واضحة</div></div><button className="notebook-primary modal-button" onClick={() => { setModal(null); goPage(8); }}>افتح باب الشراكة <ArrowLeft size={17} /></button></> : <><div className="modal-symbol"><MessageCircle size={22} /></div><SectionKicker>شراكة بيننا</SectionKicker><h2 id="modal-title">لنبنِ مساحة<br /><em>أكثر أماناً.</em></h2><p>اكتب لنا عن جهة أو مجتمع أو مساحة يمكن أن تستضيف جلسات الآباء، وسنتواصل لمناقشة الشراكة الميدانية.</p><form className="story-form" onSubmit={(event) => { event.preventDefault(); setModal(null); }}><label>الاسم أو الجهة <input required placeholder="اسمك أو اسم الجهة" /></label><label>رسالتك <textarea required rows={3} placeholder="كيف يمكن أن نتعاون ميدانياً؟" /></label><button className="notebook-primary modal-button" type="submit">أرسل طلب الشراكة <Send size={17} /></button></form></>}</div></div>}
  </div>;
}
