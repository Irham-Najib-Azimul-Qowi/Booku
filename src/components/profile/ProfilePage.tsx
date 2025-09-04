import { useState } from 'react';
import { Camera, Edit3, MapPin, Calendar, Mail, Globe, Github, Twitter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ProfilePageProps {
  user: any;
}

const recentActivities = [
  {
    id: '1',
    type: 'note',
    title: 'Membuat catatan "Konsep Dasar React Hooks"',
    time: '2 jam yang lalu',
    category: 'Proyek Coding'
  },
  {
    id: '2',
    type: 'task',
    title: 'Menyelesaikan tugas "Project Setup"',
    time: '1 hari yang lalu',
    category: 'Development'
  },
  {
    id: '3',
    type: 'note',
    title: 'Mengedit catatan "Database Design Best Practices"',
    time: '2 hari yang lalu',
    category: 'Backend'
  },
  {
    id: '4',
    type: 'collaboration',
    title: 'Berkolaborasi pada catatan "API Documentation"',
    time: '3 hari yang lalu',
    category: 'Team Work'
  },
  {
    id: '5',
    type: 'task',
    title: 'Membuat tugas baru "Implement Authentication"',
    time: '1 minggu yang lalu',
    category: 'Security'
  }
];

const stats = [
  { label: 'Total Catatan', value: 97, icon: '📝' },
  { label: 'Tugas Selesai', value: 23, icon: '✅' },
  { label: 'Kolaborasi', value: 8, icon: '🤝' },
  { label: 'Bulan Ini', value: 12, icon: '📅' }
];

export function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: 'Jakarta, Indonesia',
    website: 'https://johndoe.dev',
    github: 'johndoe',
    twitter: '@johndoe'
  });

  const handleSave = () => {
    // Implementasi save profile
    console.log('Saving profile:', editedUser);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-[#7E47B8] hover:bg-[#6A3A9A]"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center md:text-left mt-4">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  {editedUser.location}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  Bergabung Januari 2024
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Tentang</h2>
                  <p className="text-gray-600 max-w-2xl">
                    {user?.bio || editedUser.bio}
                  </p>
                </div>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editedUser.bio}
                          onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                          placeholder="Ceritakan tentang diri Anda..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                          id="location"
                          value={editedUser.location}
                          onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editedUser.website}
                          onChange={(e) => setEditedUser({...editedUser, website: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSave}
                          className="bg-[#7E47B8] hover:bg-[#6A3A9A]"
                        >
                          Simpan
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Batal
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 mb-4">
                <a 
                  href={editedUser.website} 
                  className="flex items-center gap-1 text-sm text-[#7E47B8] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
                <a 
                  href={`https://github.com/${editedUser.github}`}
                  className="flex items-center gap-1 text-sm text-[#7E47B8] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a 
                  href={`https://twitter.com/${editedUser.twitter.replace('@', '')}`}
                  className="flex items-center gap-1 text-sm text-[#7E47B8] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="font-semibold text-lg">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'note' ? 'bg-blue-100' :
                        activity.type === 'task' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'note' && '📝'}
                        {activity.type === 'task' && '✅'}
                        {activity.type === 'collaboration' && '🤝'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                          <Badge variant="secondary" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {index < recentActivities.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Overview */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-[#7E47B8] hover:bg-[#6A3A9A]">
                📝 Catatan Baru
              </Button>
              <Button variant="outline" className="w-full justify-start">
                ✅ Tambah Tugas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📁 Buat Kategori
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🤝 Undang Kolaborator
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Minggu Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Catatan Dibuat</span>
                  <Badge>5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tugas Selesai</span>
                  <Badge>3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Kolaborasi</span>
                  <Badge>2</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-sm">Total Aktivitas</span>
                  <Badge variant="secondary">10</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}