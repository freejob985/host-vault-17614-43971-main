import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: () => string;
  onImport: (data: string) => void;
}

export function ImportExportDialog({
  open,
  onClose,
  onExport,
  onImport,
}: ImportExportDialogProps) {
  const [importData, setImportData] = useState('');
  const [exportData, setExportData] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = onExport();
    setExportData(data);
    
    // تنزيل الملف
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hosting-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('تم تصدير البيانات بنجاح');
  };

  const handleImport = () => {
    try {
      onImport(importData);
      setImportData('');
      onClose();
      toast.success('تم استيراد البيانات بنجاح');
    } catch (error) {
      toast.error('فشل استيراد البيانات. تأكد من صحة البيانات');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>استيراد وتصدير البيانات</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 ml-2" />
              استيراد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              قم بتصدير جميع بياناتك إلى ملف JSON للنسخ الاحتياطي أو النقل إلى جهاز آخر.
            </p>
            
            <Button onClick={handleExport} className="w-full">
              <Download className="w-4 h-4 ml-2" />
              تصدير البيانات
            </Button>

            {exportData && (
              <div className="space-y-2">
                <label className="text-sm font-medium">البيانات المصدرة:</label>
                <Textarea
                  value={exportData}
                  readOnly
                  className="font-mono text-xs h-64"
                  dir="ltr"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(exportData);
                    toast.success('تم نسخ البيانات');
                  }}
                  className="w-full"
                >
                  نسخ إلى الحافظة
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                قم باستيراد البيانات من ملف JSON أو الصق محتوى الملف مباشرة.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 ml-2" />
                اختيار ملف JSON
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">أو الصق البيانات هنا:</label>
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='{"id": "...", "name": "...", ...}'
                className="font-mono text-xs h-64"
                dir="ltr"
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                ⚠️ تحذير: سيتم دمج البيانات المستوردة مع البيانات الحالية. قد تحدث تعارضات.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
          {importData && (
            <Button onClick={handleImport}>
              استيراد البيانات
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
