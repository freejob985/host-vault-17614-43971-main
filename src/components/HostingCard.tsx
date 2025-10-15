import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { 
  Copy, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2,
  Star,
  Server,
  Shield,
  Terminal,
  Globe,
  Key,
  Link2,
  ClipboardCopy
} from 'lucide-react';
import { Hosting, HostingType } from '@/types/hosting';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HostingCardProps {
  hosting: Hosting;
  onEdit: (hosting: Hosting) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const hostingIcons: Record<HostingType, React.ComponentType<{ className?: string }>> = {
  cpanel: Server,
  plesk: Shield,
  directadmin: Key,
  ftp: Terminal,
  ssh: Terminal,
  wordpress: Globe,
  other: Server,
};

const hostingColors: Record<HostingType, string> = {
  cpanel: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  plesk: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  directadmin: 'bg-green-500/10 text-green-600 dark:text-green-400',
  ftp: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  ssh: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  wordpress: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  other: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

export function HostingCard({ hosting, onEdit, onDelete, onToggleFavorite }: HostingCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = hostingIcons[hosting.type];

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label}`);
    } catch {
      toast.error('فشل النسخ');
    }
  };

  const copyAllInfo = async () => {
    const info = `الاسم: ${hosting.name}
النوع: ${hosting.type}
الرابط: ${hosting.url}
اسم المستخدم: ${hosting.username}
كلمة المرور: ${hosting.password}${hosting.notes ? '\nملاحظات: ' + hosting.notes : ''}${hosting.tags.length > 0 ? '\nالوسوم: ' + hosting.tags.join(', ') : ''}`;
    
    try {
      await navigator.clipboard.writeText(info);
      toast.success('تم نسخ جميع المعلومات إلى الحافظة');
    } catch {
      toast.error('فشل النسخ');
    }
  };

  const openUrl = () => {
    // فتح الرابط عبر صفحة الوسيطة المباشرة
    const proxyUrl = new URL('/auto-login-direct.html', window.location.origin);
    proxyUrl.searchParams.set('url', hosting.url);
    proxyUrl.searchParams.set('username', hosting.username);
    proxyUrl.searchParams.set('password', hosting.password);
    proxyUrl.searchParams.set('auto_submit', 'false');
    
    // إضافة معاملات إضافية للدعم الشامل
    proxyUrl.searchParams.set('form_id', 'login_form');
    proxyUrl.searchParams.set('username_field', 'user');
    proxyUrl.searchParams.set('password_field', 'pass');
    proxyUrl.searchParams.set('submit_button', 'login_submit');
    
    window.open(proxyUrl.toString(), '_blank');
    toast.success('تم فتح صفحة تسجيل الدخول التلقائي');
  };

  const openWithCredentials = () => {
    // فتح الرابط عبر صفحة الوسيطة المباشرة مع التعبئة والإرسال التلقائي
    const proxyUrl = new URL('/auto-login-direct.html', window.location.origin);
    proxyUrl.searchParams.set('url', hosting.url);
    proxyUrl.searchParams.set('username', hosting.username);
    proxyUrl.searchParams.set('password', hosting.password);
    proxyUrl.searchParams.set('auto_submit', 'true');
    
    // إضافة معاملات إضافية للدعم الشامل
    proxyUrl.searchParams.set('form_id', 'login_form');
    proxyUrl.searchParams.set('username_field', 'user');
    proxyUrl.searchParams.set('password_field', 'pass');
    proxyUrl.searchParams.set('submit_button', 'login_submit');
    
    // نسخ اسم المستخدم كنسخة احتياطية
    copyToClipboard(hosting.username, 'اسم المستخدم (نسخة احتياطية)');
    
    setTimeout(() => {
      window.open(proxyUrl.toString(), '_blank');
      toast.info('تم فتح صفحة تسجيل الدخول التلقائي - اتبع التعليمات');
    }, 100);
  };

  const generateShareLink = () => {
    const params = new URLSearchParams({
      name: hosting.name,
      type: hosting.type,
      url: hosting.url,
      username: hosting.username,
      password: hosting.password,
      notes: hosting.notes || '',
      tags: hosting.tags.join(','),
      autoOpen: 'true'
    });
    const shareUrl = `${window.location.origin}?${params.toString()}`;
    copyToClipboard(shareUrl, 'رابط المشاركة');
    toast.success('يمكنك الآن لصق الرابط في المتصفح للفتح التلقائي');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card className="p-5 hover:shadow-hover transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={cn('p-3 rounded-xl', hostingColors[hosting.type])}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg truncate">{hosting.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onToggleFavorite(hosting.id)}
              >
                <Star 
                  className={cn(
                    "w-4 h-4",
                    hosting.favorite && "fill-yellow-400 text-yellow-400"
                  )} 
                />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground truncate">{hosting.url}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => onEdit(hosting)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(hosting.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-[100px]">اسم المستخدم:</span>
          <code className="flex-1 bg-muted px-2 py-1 rounded text-sm truncate">
            {hosting.username}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 shrink-0"
            onClick={() => copyToClipboard(hosting.username, 'اسم المستخدم')}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-[100px]">كلمة المرور:</span>
          <code className="flex-1 bg-muted px-2 py-1 rounded text-sm truncate">
            {showPassword ? hosting.password : '••••••••'}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 shrink-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 shrink-0"
            onClick={() => copyToClipboard(hosting.password, 'كلمة المرور')}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {hosting.notes && (
        <p className="text-sm text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
          {hosting.notes}
        </p>
      )}

      {hosting.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {hosting.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={openWithCredentials}
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            فتح مع البيانات
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={openUrl}
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            فتح الرابط
          </Button>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={copyAllInfo}
        >
          <ClipboardCopy className="w-4 h-4 ml-2" />
          نسخ جميع المعلومات
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3">
        آخر تحديث: {new Date(hosting.updatedAt).toLocaleDateString('ar')}
      </p>
        </Card>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={openWithCredentials}>
          <ExternalLink className="w-4 h-4 ml-2" />
          فتح مع البيانات
        </ContextMenuItem>
        <ContextMenuItem onClick={openUrl}>
          <ExternalLink className="w-4 h-4 ml-2" />
          فتح الرابط فقط
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={copyAllInfo}>
          <ClipboardCopy className="w-4 h-4 ml-2" />
          نسخ جميع المعلومات
        </ContextMenuItem>
        <ContextMenuItem onClick={() => copyToClipboard(hosting.url, 'الرابط')}>
          <Copy className="w-4 h-4 ml-2" />
          نسخ الرابط
        </ContextMenuItem>
        <ContextMenuItem onClick={() => copyToClipboard(hosting.username, 'اسم المستخدم')}>
          <Copy className="w-4 h-4 ml-2" />
          نسخ اسم المستخدم
        </ContextMenuItem>
        <ContextMenuItem onClick={() => copyToClipboard(hosting.password, 'كلمة المرور')}>
          <Copy className="w-4 h-4 ml-2" />
          نسخ كلمة المرور
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={generateShareLink}>
          <Link2 className="w-4 h-4 ml-2" />
          إنشاء رابط مشاركة
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onToggleFavorite(hosting.id)}>
          <Star className={cn("w-4 h-4 ml-2", hosting.favorite && "fill-yellow-400 text-yellow-400")} />
          {hosting.favorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEdit(hosting)}>
          <Pencil className="w-4 h-4 ml-2" />
          تعديل
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDelete(hosting.id)} className="text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4 ml-2" />
          حذف
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
