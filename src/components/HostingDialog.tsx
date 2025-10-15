import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TagsInput } from '@/components/TagsInput';
import { Hosting, HostingFormData, HostingType } from '@/types/hosting';

const hostingSchema = z.object({
  name: z.string().min(1, 'اسم الاستضافة مطلوب').max(100),
  type: z.enum(['cpanel', 'plesk', 'directadmin', 'ftp', 'ssh', 'wordpress', 'other']),
  url: z.string().url('رابط غير صالح').max(255),
  username: z.string().min(1, 'اسم المستخدم مطلوب').max(100),
  password: z.string().min(1, 'كلمة المرور مطلوبة').max(255),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
  favorite: z.boolean().default(false),
});

interface HostingDialogProps {
  open: boolean;
  hosting?: Hosting | null;
  onClose: () => void;
  onSave: (data: HostingFormData) => void;
}

const hostingTypes: { value: HostingType; label: string }[] = [
  { value: 'cpanel', label: 'cPanel' },
  { value: 'plesk', label: 'Plesk' },
  { value: 'directadmin', label: 'DirectAdmin' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'ftp', label: 'FTP' },
  { value: 'ssh', label: 'SSH' },
  { value: 'other', label: 'أخرى' },
];

export function HostingDialog({ open, hosting, onClose, onSave }: HostingDialogProps) {
  const form = useForm<HostingFormData>({
    resolver: zodResolver(hostingSchema),
    defaultValues: {
      name: '',
      type: 'cpanel',
      url: '',
      username: '',
      password: '',
      notes: '',
      tags: [],
      favorite: false,
    },
  });

  useEffect(() => {
    if (hosting) {
      form.reset({
        name: hosting.name,
        type: hosting.type,
        url: hosting.url,
        username: hosting.username,
        password: hosting.password,
        notes: hosting.notes || '',
        tags: hosting.tags,
        favorite: hosting.favorite || false,
      });
    } else {
      form.reset({
        name: '',
        type: 'cpanel',
        url: '',
        username: '',
        password: '',
        notes: '',
        tags: [],
        favorite: false,
      });
    }
  }, [hosting, form]);

  const onSubmit = (data: HostingFormData) => {
    onSave(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hosting ? 'تعديل الاستضافة' : 'إضافة استضافة جديدة'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الاستضافة *</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: موقعي الشخصي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الاستضافة *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الاستضافة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hostingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط لوحة التحكم *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com:2083" 
                      dir="ltr"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم *</FormLabel>
                    <FormControl>
                      <Input placeholder="username" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور *</FormLabel>
                    <FormControl>
                      <Input type="password" dir="ltr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أي ملاحظات إضافية..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوسوم</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="اكتب وسم واضغط Enter أو فاصلة"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button type="submit">
                {hosting ? 'حفظ التعديلات' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
