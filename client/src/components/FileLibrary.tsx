import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Loader2, LogIn, Trash2, UploadCloud } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,application/pdf,text/plain";

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} كيلوبايت`;
  return `${(size / (1024 * 1024)).toFixed(1)} ميغابايت`;
}

export default function FileLibrary() {
  const { isAuthenticated, loading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<"story" | "training" | "report" | "media" | "other">("story");
  const [notice, setNotice] = useState<string | null>(null);
  const filesQuery = trpc.files.list.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: async () => {
      setNotice("تم حفظ الملف في مكتبتك بنجاح.");
      await utils.files.list.invalidate();
      if (inputRef.current) inputRef.current.value = "";
    },
    onError: error => setNotice(error.message || "تعذر رفع الملف حالياً."),
  });
  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: async () => {
      setNotice("تمت إزالة الملف من مكتبتك.");
      await utils.files.list.invalidate();
    },
    onError: error => setNotice(error.message || "تعذر حذف الملف حالياً."),
  });

  const handleUpload = (file?: File) => {
    if (!file) return;
    setNotice(null);
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setNotice("الحد الأقصى للملف هو 8 ميغابايت.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : "";
      uploadMutation.mutate({ filename: file.name, mimeType: file.type, category, data });
    };
    reader.onerror = () => setNotice("تعذر قراءة الملف من الجهاز.");
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="file-library-state"><Loader2 className="file-library-spin" size={18} /> جارٍ التحقق من الجلسة...</div>;
  }

  if (!isAuthenticated) {
    return <div className="file-library-state"><LogIn size={19} /><p>سجّل الدخول لإضافة قصتك أو رفع دليل تدريبي وملفات المبادرة.</p><button className="notebook-primary file-library-login" onClick={() => startLogin()}>تسجيل الدخول</button></div>;
  }

  return <div className="file-library">
    <div className="file-library-upload-row">
      <div><strong>مكتبة الخيط</strong><span>ارفع صورة، PDF، أو ملفاً نصياً بحجم أقصى 8 ميغابايت.</span></div>
      <div className="file-library-controls">
        <select value={category} onChange={event => setCategory(event.target.value as typeof category)} aria-label="تصنيف الملف">
          <option value="story">قصة أو مشاركة</option>
          <option value="training">دليل تدريبي</option>
          <option value="report">تقرير</option>
          <option value="media">صورة أو وسائط</option>
          <option value="other">أخرى</option>
        </select>
        <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} hidden onChange={event => handleUpload(event.target.files?.[0])} />
        <button className="notebook-primary file-library-upload" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}><UploadCloud size={16} /> {uploadMutation.isPending ? "جارٍ الرفع" : "ارفع ملفاً"}</button>
      </div>
    </div>
    {notice && <p className="file-library-notice" role="status">{notice}</p>}
    {filesQuery.isLoading ? <div className="file-library-state"><Loader2 className="file-library-spin" size={18} /> جارٍ تحميل المكتبة...</div> : filesQuery.data?.length ? <div className="file-library-list">{filesQuery.data.map(file => <div className="file-library-item" key={file.id}>{file.mimeType.startsWith("image/") ? <ImageIcon size={18} /> : <FileText size={18} />}<div><strong>{file.filename}</strong><span>{formatBytes(file.sizeBytes)} · {new Date(file.createdAt).toLocaleDateString("ar-EG")}</span></div><a href={file.url} target="_blank" rel="noreferrer">فتح</a><a href={file.url} download={file.filename}>تنزيل</a><button aria-label={`حذف ${file.filename}`} onClick={() => deleteMutation.mutate({ id: file.id })} disabled={deleteMutation.isPending}><Trash2 size={15} /></button></div>)}</div> : <div className="file-library-empty">لا توجد ملفات بعد. ابدأ بإضافة أول خيط.</div>}
  </div>;
}
