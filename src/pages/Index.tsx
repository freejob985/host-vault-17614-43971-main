import { useState, useMemo, useEffect } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Trash2,
  Star,
  Server
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HostingCard } from '@/components/HostingCard';
import { HostingDialog } from '@/components/HostingDialog';
import { ImportExportDialog } from '@/components/ImportExportDialog';
import { Hosting, HostingFormData, HostingType } from '@/types/hosting';
import { saveHostings, loadHostings, exportHostings, importHostings, clearAllData } from '@/lib/storage';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hostings, setHostings] = useState<Hosting[]>(() => loadHostings());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<HostingType | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteAllDialog, setDeleteAllDialog] = useState(false);
  const [editingHosting, setEditingHosting] = useState<Hosting | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle URL parameters for "Open with Data"
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const type = params.get('type') as HostingType;
    const url = params.get('url');
    const username = params.get('username');
    const password = params.get('password');
    const notes = params.get('notes');
    const tags = params.get('tags');
    const autoOpen = params.get('autoOpen');

    if (name && type && url && username) {
      const formData: HostingFormData = {
        name: decodeURIComponent(name),
        type,
        url: decodeURIComponent(url),
        username: decodeURIComponent(username),
        password: password ? decodeURIComponent(password) : '',
        notes: notes ? decodeURIComponent(notes) : '',
        tags: tags ? decodeURIComponent(tags).split(',').filter(t => t) : [],
        favorite: false,
      };

      setEditingHosting({
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Hosting);
      
      if (autoOpen === 'true') {
        setDialogOpen(true);
      }
      
      // Clear URL parameters after loading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const filteredHostings = useMemo(() => {
    let filtered = hostings;

    // فلترة حسب المفضلة
    if (showFavoritesOnly) {
      filtered = filtered.filter(h => h.favorite);
    }

    // فلترة حسب النوع
    if (filterType !== 'all') {
      filtered = filtered.filter(h => h.type === filterType);
    }

    // البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(query) ||
        h.url.toLowerCase().includes(query) ||
        h.username.toLowerCase().includes(query) ||
        h.notes?.toLowerCase().includes(query) ||
        h.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // ترتيب المفضلة أولاً
    return filtered.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [hostings, searchQuery, filterType, showFavoritesOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredHostings.length / itemsPerPage);
  const paginatedHostings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHostings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHostings, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, showFavoritesOnly]);

  const handleSave = (data: HostingFormData) => {
    if (editingHosting) {
      // تعديل
      const updated = hostings.map(h =>
        h.id === editingHosting.id
          ? { ...h, ...data, updatedAt: new Date().toISOString() }
          : h
      );
      setHostings(updated);
      saveHostings(updated);
      toast.success('تم تحديث الاستضافة بنجاح');
    } else {
      // إضافة جديد
      const newHosting: Hosting = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newHosting, ...hostings];
      setHostings(updated);
      saveHostings(updated);
      toast.success('تم إضافة الاستضافة بنجاح');
    }
    setDialogOpen(false);
    setEditingHosting(null);
  };

  const handleDelete = (id: string) => {
    const updated = hostings.filter(h => h.id !== id);
    setHostings(updated);
    saveHostings(updated);
    toast.success('تم حذف الاستضافة');
  };

  const handleToggleFavorite = (id: string) => {
    const updated = hostings.map(h =>
      h.id === id
        ? { ...h, favorite: !h.favorite, updatedAt: new Date().toISOString() }
        : h
    );
    setHostings(updated);
    saveHostings(updated);
  };

  const handleEdit = (hosting: Hosting) => {
    setEditingHosting(hosting);
    setDialogOpen(true);
  };

  const handleExport = () => {
    return exportHostings();
  };

  const handleImport = (data: string) => {
    const imported = importHostings(data);
    const merged = [...hostings, ...imported];
    setHostings(merged);
    saveHostings(merged);
  };

  const handleDeleteAll = () => {
    clearAllData();
    setHostings([]);
    setDeleteAllDialog(false);
    toast.success('تم حذف جميع البيانات');
  };

  const stats = {
    total: hostings.length,
    favorites: hostings.filter(h => h.favorite).length,
    cpanel: hostings.filter(h => h.type === 'cpanel').length,
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Server className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">مدير الاستضافات</h1>
                <p className="text-sm text-muted-foreground">
                  إدارة آمنة لبيانات الاستضافة ولوحات التحكم
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setImportExportOpen(true)}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  setEditingHosting(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة استضافة
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-muted-foreground">إجمالي الاستضافات</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.favorites}
              </p>
              <p className="text-xs text-muted-foreground">المفضلة</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-accent">{stats.cpanel}</p>
              <p className="text-xs text-muted-foreground">cPanel</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن استضافة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="cpanel">cPanel</SelectItem>
                <SelectItem value="plesk">Plesk</SelectItem>
                <SelectItem value="directadmin">DirectAdmin</SelectItem>
                <SelectItem value="wordpress">WordPress</SelectItem>
                <SelectItem value="ftp">FTP</SelectItem>
                <SelectItem value="ssh">SSH</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showFavoritesOnly ? 'default' : 'outline'}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="w-full sm:w-auto"
            >
              <Star className={showFavoritesOnly ? 'fill-current' : ''} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {filteredHostings.length === 0 ? (
          <div className="text-center py-16">
            <Server className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد استضافات</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== 'all'
                ? 'لم يتم العثور على نتائج. جرب تغيير البحث أو الفلتر'
                : 'ابدأ بإضافة أول استضافة لك'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة استضافة
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedHostings.map((hosting) => (
                <HostingCard
                  key={hosting.id}
                  hosting={hosting}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <span className="px-4">...</span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>


      {/* Dialogs */}
      <HostingDialog
        open={dialogOpen}
        hosting={editingHosting}
        onClose={() => {
          setDialogOpen(false);
          setEditingHosting(null);
        }}
        onSave={handleSave}
      />

      <ImportExportDialog
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        onExport={handleExport}
        onImport={handleImport}
      />

      <AlertDialog open={deleteAllDialog} onOpenChange={setDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف جميع الاستضافات المحفوظة. هذا الإجراء لا يمكن التراجع عنه.
              تأكد من تصدير بياناتك قبل الحذف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف الكل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
