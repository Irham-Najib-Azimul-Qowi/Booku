import { useState } from 'react';
import { Lock, User, Palette, Globe, Smartphone, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

interface SettingsPageProps {
  user: any;
}

const themes = [
  { id: 'light', name: 'Terang', preview: 'bg-white border' },
  { id: 'dark', name: 'Gelap', preview: 'bg-gray-900 border-gray-700' },
  { id: 'auto', name: 'Otomatis', preview: 'bg-gradient-to-r from-white to-gray-900 border' }
];

const accentColors = [
  { id: 'purple', name: 'Ungu', color: '#7E47B8' },
  { id: 'blue', name: 'Biru', color: '#3B82F6' },
  { id: 'green', name: 'Hijau', color: '#10B981' },
  { id: 'red', name: 'Merah', color: '#EF4444' },
  { id: 'orange', name: 'Orange', color: '#F97316' },
  { id: 'pink', name: 'Pink', color: '#EC4899' }
];

const activeDevices = [
  {
    id: '1',
    name: 'MacBook Pro',
    type: 'Desktop',
    location: 'Jakarta, Indonesia',
    lastActive: 'Sekarang',
    current: true
  },
  {
    id: '2',
    name: 'iPhone 13',
    type: 'Mobile',
    location: 'Jakarta, Indonesia',
    lastActive: '2 jam yang lalu',
    current: false
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'Tablet',
    location: 'Jakarta, Indonesia',
    lastActive: '1 hari yang lalu',
    current: false
  }
];

export function SettingsPage({ user }: SettingsPageProps) {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentAccent, setCurrentAccent] = useState('purple');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    collaboration: true,
    tasks: true,
    security: true
  });

  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: 'johndoe',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveAccount = () => {
    // Implementasi save account settings
    console.log('Saving account settings:', accountData);
  };

  const handleSavePreferences = () => {
    // Implementasi save preferences
    console.log('Saving preferences:', { theme: currentTheme, accent: currentAccent });
  };

  const handleRevokeDevice = (deviceId: string) => {
    // Implementasi revoke device
    console.log('Revoking device:', deviceId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Pengaturan</h1>
        <p className="text-gray-600">Kelola akun dan preferensi aplikasi Anda</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Akun
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tampilan
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={accountData.name}
                    onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={accountData.username}
                    onChange={(e) => setAccountData({...accountData, username: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={accountData.currentPassword}
                    onChange={(e) => setAccountData({...accountData, currentPassword: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={accountData.newPassword}
                    onChange={(e) => setAccountData({...accountData, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Notifikasi real-time di browser</p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Kolaborasi</Label>
                  <p className="text-sm text-gray-600">Update ketika ada kolaborasi</p>
                </div>
                <Switch 
                  checked={notifications.collaboration}
                  onCheckedChange={(checked) => setNotifications({...notifications, collaboration: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tugas & Deadline</Label>
                  <p className="text-sm text-gray-600">Pengingat tugas dan deadline</p>
                </div>
                <Switch 
                  checked={notifications.tasks}
                  onCheckedChange={(checked) => setNotifications({...notifications, tasks: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveAccount}
              className="bg-[#7E47B8] hover:bg-[#6A3A9A]"
            >
              Simpan Perubahan
            </Button>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema Tampilan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div 
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      currentTheme === theme.id 
                        ? 'border-[#7E47B8] bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentTheme(theme.id)}
                  >
                    <div className={`w-full h-16 rounded mb-3 ${theme.preview}`}></div>
                    <p className="font-medium text-center">{theme.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warna Aksen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {accentColors.map((color) => (
                  <div 
                    key={color.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      currentAccent === color.id 
                        ? 'border-gray-400 bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentAccent(color.id)}
                  >
                    <div 
                      className="w-full h-8 rounded mb-2"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <p className="text-sm text-center">{color.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bahasa & Wilayah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Bahasa</Label>
                <Select defaultValue="id">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="jp">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Zona Waktu</Label>
                <Select defaultValue="jakarta">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jakarta">Asia/Jakarta (WIB)</SelectItem>
                    <SelectItem value="makassar">Asia/Makassar (WITA)</SelectItem>
                    <SelectItem value="jayapura">Asia/Jayapura (WIT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSavePreferences}
              className="bg-[#7E47B8] hover:bg-[#6A3A9A]"
            >
              Simpan Preferensi
            </Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Autentikasi Dua Faktor (2FA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Keamanan Ekstra</p>
                  <p className="text-sm text-gray-600">
                    Tambahkan layer keamanan dengan kode verifikasi
                  </p>
                </div>
                <Switch 
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    2FA telah diaktifkan. Scan QR code dengan aplikasi authenticator Anda.
                  </p>
                  <Button variant="outline" className="mt-2">
                    Lihat QR Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perangkat Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {device.type === 'Desktop' && <Globe className="w-5 h-5" />}
                        {device.type === 'Mobile' && <Smartphone className="w-5 h-5" />}
                        {device.type === 'Tablet' && <Smartphone className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{device.name}</p>
                          {device.current && (
                            <Badge variant="secondary">Saat ini</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{device.location}</p>
                        <p className="text-xs text-gray-500">Aktif {device.lastActive}</p>
                      </div>
                    </div>
                    {!device.current && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRevokeDevice(device.id)}
                      >
                        Cabut Akses
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Keamanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Login berhasil</span>
                  <span className="text-xs text-gray-500">2 jam yang lalu</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Password diubah</span>
                  <span className="text-xs text-gray-500">3 hari yang lalu</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Login dari perangkat baru</span>
                  <span className="text-xs text-gray-500">1 minggu yang lalu</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}