/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Volume2, 
  ArrowRightCircle, 
  Truck, 
  ClipboardList, 
  BellRing, 
  User,
  ArrowLeft,
  History,
  MapPin,
  Clock,
  CheckCircle2,
  PackageSearch,
  Camera,
  Signature,
  AlertTriangle,
  ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
type View = 'home' | 'unloading' | 'transport' | 'calling' | 'pickup';
type PickupStep = 'verify' | 'detail' | 'sign' | 'exception';

// --- Components ---

const SignaturePad = ({ onSave }: { onSave: (data: string) => void }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-48 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={clear} className="text-sm text-gray-500 px-3 py-1 border border-gray-200 rounded-lg">清除</button>
        <button onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) onSave(canvas.toDataURL());
        }} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg">确认签字</button>
      </div>
    </div>
  );
};

const Header = ({ userId = "1959" }: { userId?: string }) => (
  <div className="relative h-64 w-full overflow-hidden">
    {/* Background Image Placeholder - Stylized for Logistics */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <img 
        src="https://picsum.photos/seed/logistics/800/600?blur=2" 
        alt="Logistics Background" 
        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        referrerPolicy="no-referrer"
      />
      {/* Abstract shapes to mimic the blueprint look */}
      <div className="absolute top-10 right-10 w-32 h-32 border border-blue-200 rounded-lg rotate-12 opacity-30" />
      <div className="absolute bottom-5 left-20 w-48 h-24 border border-blue-300 rounded-full -rotate-6 opacity-20" />
    </div>

    <div className="relative z-10 p-6 flex flex-col h-full justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-white shadow-sm">
          <User className="w-6 h-6 text-blue-500" />
        </div>
        <span className="text-gray-800 font-medium text-lg drop-shadow-sm">{userId}</span>
      </div>

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-blue-600 tracking-tight">茗星配</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">仓储运输管理</h2>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  onClick, 
  extra,
  count,
  countColor = "text-red-500"
}: { 
  title: string; 
  subtitle: string; 
  icon: React.ElementType; 
  onClick: () => void;
  extra?: React.ReactNode;
  count?: string | number;
  countColor?: string;
}) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col gap-4 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <ArrowRightCircle className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-gray-500 text-sm">
          {count !== undefined && <span className={cn("font-bold mr-1", countColor)}>{count}</span>}
          {subtitle}
        </p>
      </div>
      <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-2xl">
        <Icon className="w-10 h-10 text-blue-500/80" />
      </div>
    </div>
    {extra}
  </motion.div>
);

const SubPageHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-bottom border-gray-100 p-4 flex items-center gap-4">
    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <ArrowLeft className="w-6 h-6 text-gray-700" />
    </button>
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4 p-4 pb-24"
    >
      <FeatureCard 
        title="卸货排队取号"
        subtitle="送货到仓后排队取号进行卸货"
        icon={BellRing}
        onClick={() => setCurrentView('unloading')}
        extra={
          <div className="bg-blue-50/50 rounded-xl p-3 flex items-center justify-between group">
            <div className="flex items-center gap-2 text-blue-600">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">查看仓库到仓指引</span>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
        }
      />

      <FeatureCard 
        title="运输计划"
        subtitle="个正在进行中计划"
        count={0}
        icon={Truck}
        onClick={() => setCurrentView('transport')}
      />

      <FeatureCard 
        title="仓库叫号管理"
        subtitle="个待叫号预约"
        count={224}
        icon={ClipboardList}
        onClick={() => setCurrentView('calling')}
      />

      <FeatureCard 
        title="仓库自提收货"
        subtitle="自提订单现场交接验证"
        icon={PackageSearch}
        onClick={() => setCurrentView('pickup')}
      />
    </motion.div>
  );

  const [pickupStep, setPickupStep] = useState<PickupStep>('verify');
  const [pickupCode, setPickupCode] = useState('');
  const [exceptionReason, setExceptionReason] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPickup = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-30 overflow-y-auto"
    >
      <SubPageHeader 
        title={
          pickupStep === 'verify' ? "自提验证" : 
          pickupStep === 'detail' ? "交接详情" : 
          pickupStep === 'sign' ? "确认签收" : "异常上报"
        } 
        onBack={() => {
          if (pickupStep === 'verify') setCurrentView('home');
          else if (pickupStep === 'detail') setPickupStep('verify');
          else if (pickupStep === 'sign') setPickupStep('detail');
          else if (pickupStep === 'exception') setPickupStep('sign');
        }} 
      />

      <div className="p-4 pb-24 flex flex-col gap-4">
        {pickupStep === 'verify' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <ScanLine className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">请输入取件码</h3>
              <p className="text-sm text-gray-400">验证客户提供的6位取件码</p>
            </div>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              value={pickupCode}
              onChange={(e) => setPickupCode(e.target.value)}
              className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={() => {
                if (pickupCode.length === 6) setPickupStep('detail');
              }}
              disabled={pickupCode.length !== 6}
              className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              验证并进入交接
            </button>
          </div>
        )}

        {pickupStep === 'detail' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">基本信息</h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">订单编号</span>
                  <span className="text-gray-800 font-bold break-all">OMSSO202602251622601328918</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">客户源单号</span>
                  <span className="text-gray-800 font-medium">BO2026022500017288</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">收货人编码</span>
                    <span className="text-gray-800 font-medium">551253</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">预计配送日期</span>
                    <span className="text-gray-800 font-medium">2025-10-28</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">收货人名称</span>
                  <span className="text-gray-800 font-medium leading-relaxed">安徽省合肥市瑶海区新站广场1016</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">交接物料明细</h4>
              <div className="space-y-4">
                {[
                  { name: '工业级传感器 A-01', qty: '10', spec: '200x150mm' },
                  { name: '精密连接线组', qty: '50', spec: '1.5m / 屏蔽型' },
                  { name: '控制面板外壳', qty: '5', spec: '铝合金 / 喷砂' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">规格: {item.spec}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 font-bold">x{item.qty}</p>
                      <p className="text-[10px] text-gray-400">PCS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setPickupStep('sign')}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200"
              >
                进入签收
              </button>
            </div>
          </div>
        )}

        {pickupStep === 'sign' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                现场拍照
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 relative">
                    <img src={p} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-6 h-6 text-gray-300" />
                  <span className="text-[10px] text-gray-400 mt-1">添加照片</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Signature className="w-5 h-5 text-blue-500" />
                电子签字
              </h4>
              <SignaturePad onSave={(data) => console.log('Signature saved', data)} />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => {
                  alert('签收成功！');
                  setCurrentView('home');
                  setPickupStep('verify');
                  setPickupCode('');
                  setPhotos([]);
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200"
              >
                确认完成签收
              </button>
              <button 
                onClick={() => setPickupStep('exception')}
                className="w-full py-3 flex items-center justify-center gap-2 text-red-500 font-medium border border-red-100 rounded-xl"
              >
                <AlertTriangle className="w-4 h-4" />
                提报异常
              </button>
            </div>
          </div>
        )}

        {pickupStep === 'exception' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              异常原因提报
            </h4>
            <textarea 
              rows={6}
              placeholder="请详细描述异常情况（如：货物破损、数量不符、规格错误等）..."
              value={exceptionReason}
              onChange={(e) => setExceptionReason(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            <div className="mt-4 p-3 bg-red-50 rounded-xl flex gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs text-red-600">提报异常后，该订单将进入异常处理流程，需相关负责人审核。</p>
            </div>
            <button 
              onClick={() => {
                if (exceptionReason) {
                  alert('异常已提报');
                  setCurrentView('home');
                  setPickupStep('verify');
                  setExceptionReason('');
                }
              }}
              disabled={!exceptionReason}
              className="mt-6 w-full py-4 bg-red-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-200 disabled:opacity-50"
            >
              提交异常
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderUnloading = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-30 overflow-y-auto"
    >
      <SubPageHeader title="卸货排队取号" onBack={() => setCurrentView('home')} />
      <div className="p-4 pb-24 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-2">当前排队人数</p>
          <p className="text-5xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-400 mt-4">预计等待时间: 45分钟</p>
          <button className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform">
            立即取号
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            最近取号记录
          </h4>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-700">A-{100 + i}</p>
                  <p className="text-xs text-gray-400">2024-05-20 14:30</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">已完成</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTransport = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-30 overflow-y-auto"
    >
      <SubPageHeader title="运输计划" onBack={() => setCurrentView('home')} />
      <div className="p-4 pb-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Truck className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">暂无进行中的计划</h3>
        <p className="text-gray-400 mt-2">您可以点击下方按钮创建新的运输任务</p>
        <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-md">
          新建计划
        </button>
      </div>
    </motion.div>
  );

  const renderCalling = () => (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-30 overflow-y-auto"
    >
      <SubPageHeader title="仓库叫号管理" onBack={() => setCurrentView('home')} />
      <div className="p-4 pb-24 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100">
            <p className="text-blue-100 text-xs mb-1">待叫号</p>
            <p className="text-3xl font-bold">224</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs mb-1">今日已处理</p>
            <p className="text-3xl font-bold text-gray-800">1,452</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h4 className="font-bold text-gray-800">叫号队列</h4>
            <button className="text-blue-600 text-sm font-medium">刷新</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { id: 'B-201', time: '15:10', status: '等待中', dock: '-' },
              { id: 'B-200', time: '15:05', status: '进行中', dock: '3号门' },
              { id: 'B-199', time: '14:55', status: '已完成', dock: '1号门' },
            ].map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    item.status === '等待中' ? "bg-yellow-400" : 
                    item.status === '进行中' ? "bg-blue-500 animate-pulse" : "bg-green-500"
                  )} />
                  <div>
                    <p className="font-bold text-gray-800">{item.id}</p>
                    <p className="text-xs text-gray-400">{item.time} • 月台: {item.dock}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-md",
                    item.status === '等待中' ? "bg-yellow-50 text-yellow-600" : 
                    item.status === '进行中' ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                  )}>
                    {item.status}
                  </span>
                  {item.status === '等待中' && (
                    <button className="p-1 bg-blue-600 text-white rounded-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <Header />
      
      <main className="relative -mt-6 z-20">
        <AnimatePresence mode="wait">
          {currentView === 'home' && renderHome()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {currentView === 'unloading' && renderUnloading()}
        {currentView === 'transport' && renderTransport()}
        {currentView === 'calling' && renderCalling()}
        {currentView === 'pickup' && renderPickup()}
      </AnimatePresence>

      {/* Bottom Navigation Mockup */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40">
        <div className="flex flex-col items-center gap-1 text-blue-600">
          <div className="p-1 bg-blue-50 rounded-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">工作台</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <Clock className="w-6 h-6" />
          <span className="text-[10px] font-medium">消息</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">我的</span>
        </div>
      </div>
    </div>
  );
}
