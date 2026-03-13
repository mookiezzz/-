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
  ScanLine,
  AlertTriangle,
  KeyRound,
  Keyboard,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
type View = 'home' | 'unloading' | 'transport' | 'calling' | 'pickup';
type PickupStep = 'list' | 'verify' | 'scan' | 'manual_entry' | 'order_manual_entry' | 'match_list' | 'order_view' | 'detail' | 'sign';

// --- Components ---

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
        title="仓库自提签收"
        subtitle="自提订单现场交接验证"
        icon={PackageSearch}
        onClick={() => setCurrentView('pickup')}
      />
    </motion.div>
  );

  const [pickupStep, setPickupStep] = useState<PickupStep>('list');
  const [pickupTab, setPickupTab] = useState<'all' | 'mine'>('all');
  const [pickupFilter, setPickupFilter] = useState('全部');
  const [ownerFilter, setOwnerFilter] = useState('全部货主');
  const [warehouseFilter, setWarehouseFilter] = useState('全部仓库');
  const [pickupCode, setPickupCode] = useState('');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
          pickupStep === 'list' ? "自提订单列表" :
          pickupStep === 'verify' ? "自提验证" : 
          pickupStep === 'scan' ? "扫码验证" : 
          pickupStep === 'manual_entry' ? "手动录入单号" :
          pickupStep === 'order_manual_entry' ? "手动录入订单" :
          pickupStep === 'match_list' ? "匹配订单列表" :
          pickupStep === 'order_view' ? "订单详情" :
          pickupStep === 'detail' ? "交接详情" : 
          pickupStep === 'sign' ? "确认签收" : "异常上报"
        } 
        onBack={() => {
          if (pickupStep === 'list') setCurrentView('home');
          else if (pickupStep === 'verify') setPickupStep('list');
          else if (pickupStep === 'scan') setPickupStep('verify');
          else if (pickupStep === 'manual_entry') setPickupStep('verify');
          else if (pickupStep === 'order_manual_entry') setPickupStep('match_list');
          else if (pickupStep === 'match_list') {
            setPickupStep('verify');
          }
          else if (pickupStep === 'order_view') setPickupStep('match_list');
          else if (pickupStep === 'detail') setPickupStep('match_list');
          else if (pickupStep === 'sign') setPickupStep('detail');
        }} 
      />

      <div className="p-4 pb-24 flex flex-col gap-4">
        {pickupStep === 'list' && (
          <div className="flex flex-col gap-3">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-2">
              <button 
                onClick={() => setPickupTab('all')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  pickupTab === 'all' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                )}
              >
                所有订单
              </button>
              <button 
                onClick={() => setPickupTab('mine')}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  pickupTab === 'mine' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
                )}
              >
                我的签收
              </button>
            </div>

            {pickupTab === 'all' && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                <select 
                  value={pickupFilter}
                  onChange={(e) => setPickupFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-[11px] font-medium text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>全部</option>
                  <option>已出库</option>
                  <option>已分配</option>
                  <option>待交接</option>
                </select>
                <select 
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-[11px] font-medium text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>全部货主</option>
                  <option>货主A</option>
                  <option>货主B</option>
                  <option>货主C</option>
                </select>
                <select 
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2 py-2 text-[11px] font-medium text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option>全部仓库</option>
                  <option>合肥1号仓</option>
                  <option>南京2号仓</option>
                  <option>杭州3号仓</option>
                </select>
              </div>
            )}

            {(pickupTab === 'all' ? [
              { owner: '货主A', warehouse: '合肥1号仓', code: '551253', name: '安徽省合肥市瑶海区新站广场1016', date: '2025-10-28', status: '已出库' },
              { owner: '货主B', warehouse: '南京2号仓', code: '662341', name: '江苏省南京市江宁区百家湖', date: '2025-11-05', status: '已签收' },
              { owner: '货主C', warehouse: '杭州3号仓', code: '773452', name: '浙江省杭州市西湖区西溪路', date: '2025-12-12', status: '已分配' },
            ] : [
              { owner: '货主B', warehouse: '南京2号仓', code: '662341', name: '江苏省南京市江宁区百家湖', date: '2025-11-05', status: '已签收' },
            ])
            .filter(order => {
              const tabMatch = pickupTab === 'mine' || true; // Tab already filters data
              const statusMatch = pickupFilter === '全部' || order.status === pickupFilter;
              const ownerMatch = ownerFilter === '全部货主' || order.owner === ownerFilter;
              const warehouseMatch = warehouseFilter === '全部仓库' || order.warehouse === warehouseFilter;
              return statusMatch && ownerMatch && warehouseMatch;
            })
            .map((order, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{order.owner}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{order.warehouse}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      order.status === '已出库' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                      order.status === '已签收' ? "bg-green-50 text-green-600 border border-green-100" :
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{order.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{order.name}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">收货人编码: {order.code}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Fixed Bottom Button for List View */}
            <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-40">
              <button 
                onClick={() => setPickupStep('verify')}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                <ScanLine className="w-5 h-5" />
                自提签收
              </button>
            </div>
          </div>
        )}

        {pickupStep === 'verify' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <KeyRound className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">请输入自提码</h3>
                <p className="text-sm text-gray-400">验证客户提供的6位自提码</p>
              </div>
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000"
                value={pickupCode}
                onChange={(e) => setPickupCode(e.target.value)}
                className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => {
                    if (pickupCode.length === 6) setPickupStep('manual_entry');
                  }}
                  disabled={pickupCode.length !== 6}
                  className="py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-base shadow-sm disabled:opacity-50 disabled:border-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
                >
                  <Keyboard className="w-5 h-5" />
                  验证并录入
                </button>
                <button 
                  onClick={() => {
                    if (pickupCode.length === 6) setPickupStep('scan');
                  }}
                  disabled={pickupCode.length !== 6}
                  className="py-4 bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <ScanLine className="w-5 h-5" />
                  验证并扫码
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                自提码验证通过后需扫描或录入验证配货单号（支持一维码和二维码）
              </p>
            </div>
          </div>
        )}

        {pickupStep === 'manual_entry' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Keyboard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">录入配货单号</h3>
                <p className="text-sm text-gray-400">请输入配货单号进行验证</p>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="请输入配货单号"
                  value={deliveryCode}
                  onChange={(e) => setDeliveryCode(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                />
              </div>
              <button 
                onClick={() => {
                  if (deliveryCode.trim()) setPickupStep('match_list');
                }}
                disabled={!deliveryCode.trim()}
                className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                确认并验证
              </button>
            </div>
          </div>
        )}

        {pickupStep === 'scan' && (
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col items-center">
              <div className="relative w-64 h-64 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Simulated Scanner UI */}
                <div className="absolute inset-0 border-2 border-blue-500/30"></div>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                
                {/* Scanning Animation Line */}
                <motion.div 
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-4 right-4 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                />
                
                <ScanLine className="w-24 h-24 text-blue-500/20" />
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-lg font-bold text-gray-800">请扫描自提二维码</h3>
                <p className="text-sm text-gray-400 mt-2 px-4">请将客户出示的自提二维码置于框内进行扫描验证</p>
              </div>
              
              <button 
                onClick={() => setPickupStep('match_list')}
                className="mt-8 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                <ScanLine className="w-5 h-5" />
                模拟扫描成功
              </button>
            </div>
            
            <p className="text-xs text-gray-400 text-center px-8">
              提示：如果无法扫描，请尝试调整光线或距离，或返回重新输入自提码。
            </p>
          </div>
        )}

        {pickupStep === 'match_list' && (
          <div className="flex flex-col gap-4">
            {/* Common Store Info Header */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400">货主</span>
                      <span className="text-xs font-bold text-gray-700">货主A</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400">发货仓库</span>
                      <span className="text-xs font-bold text-gray-700">合肥1号仓</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">当前匹配门店</p>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      551253 / 安徽省合肥市瑶海区新站广场1016
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                可交接订单
                <span className="text-xs font-normal text-gray-400 ml-auto">共 2 笔</span>
              </h4>
              <div className="space-y-3">
                {[
                  { id: 'OMSSO202602251622601328918', outboundId: 'SO120260313000556', highlight: true },
                  { id: 'OMSSO202602251622601328919', outboundId: 'SO120260313000557', highlight: true },
                ].map((order) => (
                  <button 
                    key={order.id} 
                    onClick={() => {
                      setSelectedOrder({ ...order, store: '551253 / 安徽省合肥市瑶海区新站广场1016' });
                      setPickupStep('order_view');
                    }}
                    className="w-full text-left p-3 bg-blue-50/50 border border-blue-100 rounded-xl relative overflow-hidden active:bg-blue-100 transition-colors"
                  >
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">可交接</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">订单</span>
                        <span className="text-sm font-bold text-blue-600 underline decoration-blue-200 underline-offset-4">
                          {order.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">出库</span>
                        <span className="text-xs font-medium text-gray-600">{order.outboundId}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
              <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-red-600 rounded-full"></div>
                待交接订单
                <span className="text-xs font-normal text-red-400 ml-auto">共 1 笔</span>
              </h4>
              
              <div className="mb-3 p-2 bg-red-50 rounded-lg flex items-start gap-2 border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-600 font-medium">该订单未在当前拣货明细表里，请确认</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'OMSSO202602251622601328920', outboundId: 'SO120260313000558', highlight: false },
                ].map((order) => (
                  <button 
                    key={order.id} 
                    onClick={() => {
                      setSelectedOrder({ ...order, store: '551253 / 安徽省合肥市瑶海区新站广场1016' });
                      setPickupStep('order_view');
                    }}
                    className="w-full text-left p-3 bg-red-50/30 border border-red-100 rounded-xl active:bg-red-50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">订单</span>
                        <span className="text-sm font-bold text-red-600 underline decoration-red-200 underline-offset-4">
                          {order.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">出库</span>
                        <span className="text-xs font-medium text-gray-600">{order.outboundId}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  onClick={() => setPickupStep('order_manual_entry')}
                  className="flex-1 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-base active:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Keyboard className="w-5 h-5" />
                  录入订单
                </button>
                <button 
                  onClick={() => setPickupStep('scan')}
                  className="flex-1 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-base active:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ScanLine className="w-5 h-5" />
                  添加订单
                </button>
              </div>
              <button 
                onClick={() => setPickupStep('detail')}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 active:opacity-90"
              >
                继续签收
              </button>
            </div>
          </div>
        )}

        {pickupStep === 'order_manual_entry' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Keyboard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">录入订单号</h3>
                <p className="text-sm text-gray-400">请输入订单号进行验证匹配</p>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="请输入订单号"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                />
              </div>
              <button 
                onClick={() => {
                  if (orderCode.trim()) setPickupStep('match_list');
                }}
                disabled={!orderCode.trim()}
                className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                确认并录入
              </button>
            </div>
          </div>
        )}

        {pickupStep === 'order_view' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">订单详情</h4>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">订单编号</span>
                  <span className="text-gray-800 font-bold break-all">{selectedOrder?.id}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">出库单号</span>
                  <span className="text-gray-800 font-bold break-all">{selectedOrder?.outboundId}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">门店信息</span>
                  <span className="text-gray-800 font-medium leading-relaxed">{selectedOrder?.store}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">货主</span>
                    <span className="text-gray-800 font-medium">货主A</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">发货仓库</span>
                    <span className="text-gray-800 font-medium">合肥1号仓</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">送货方式</span>
                    <span className="text-gray-800 font-medium">自提</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">状态</span>
                    <span className="text-blue-600 font-bold">{selectedOrder?.highlight ? '待交接' : '处理中'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs">创建时间</span>
                  <span className="text-gray-800 font-medium">2025-10-28 14:30:22</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">物料清单</h4>
              <div className="space-y-3">
                {[
                  { name: '工业级传感器 A-01', qty: '10' },
                  { name: '精密连接线组', qty: '50' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setPickupStep('match_list')}
              className="w-full py-4 bg-gray-800 text-white rounded-xl font-bold text-lg shadow-lg mt-4"
            >
              确认返回
            </button>
          </div>
        )}

        {pickupStep === 'detail' && (
          <div className="flex flex-col gap-4">
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
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  现场拍照
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">要求拍摄司机车牌照片、冷藏冷冻货物照片、常温货物照片</p>
              </div>
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

            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:opacity-90"
              >
                确认完成签收
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">确认签收</h3>
                <p className="text-gray-500 text-sm mb-8">您确定已完成所有货物的交接并确认签收吗？</p>
                
                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={() => {
                      setShowConfirmModal(false);
                      setPickupStep('list');
                      setPickupCode('');
                      setPhotos([]);
                      // Optional: show a success toast instead of alert
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
                  >
                    确定完成
                  </button>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full py-3 text-gray-400 font-medium"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
