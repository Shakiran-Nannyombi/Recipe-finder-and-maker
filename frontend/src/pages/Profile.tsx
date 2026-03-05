import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Award, TrendingUp, Heart, BookOpen } from 'lucide-react';

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Chef Guest',
        email: 'chef@recipeai.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Passionate home cook exploring new flavors and techniques. Love experimenting with fusion cuisine!',
        joinedDate: 'January 2024',
        avatar: ''
    });

    const stats = [
        { label: 'Recipes Created', value: '24', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-100' },
        { label: 'Recipes Saved', value: '156', icon: Heart, color: 'text-red-500', bg: 'bg-red-100' },
        { label: 'Cookbooks', value: '8', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Achievements', value: '12', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-100' }
    ];

    const achievements = [
        { id: 1, title: 'First Recipe', description: 'Created your first recipe', icon: '🎉', unlocked: true },
        { id: 2, title: 'Recipe Master', description: 'Created 10 recipes', icon: '👨‍🍳', unlocked: true },
        { id: 3, title: 'Healthy Chef', description: 'Made 20 healthy recipes', icon: '🥗', unlocked: true },
        { id: 4, title: 'Global Cuisine', description: 'Tried 5 different cuisines', icon: '🌍', unlocked: true },
        { id: 5, title: 'Pantry Pro', description: 'Maintained pantry for 30 days', icon: '📦', unlocked: false },
        { id: 6, title: 'Social Chef', description: 'Shared 10 recipes', icon: '🤝', unlocked: false }
    ];

    const recentActivity = [
        { id: 1, action: 'Created', item: 'Thai Green Curry', time: '2 hours ago', type: 'recipe' },
        { id: 2, action: 'Saved', item: 'Mediterranean Quinoa Bowl', time: '5 hours ago', type: 'save' },
        { id: 3, action: 'Added to pantry', item: 'Fresh Salmon', time: '1 day ago', type: 'pantry' },
        { id: 4, action: 'Completed', item: 'Recipe Master Achievement', time: '2 days ago', type: 'achievement' }
    ];

    const handleSave = () => {
        console.log('Saving profile:', profile);
        setIsEditing(false);
        // TODO: Implement save functionality
    };

    const handleAvatarChange = () => {
        console.log('Change avatar');
        // TODO: Implement avatar upload
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 pt-16 md:pt-0">
            {/* Header with Cover */}
            <div className="relative">
                <div className="h-48 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 transform translate-y-1/2">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>
                                <button
                                    onClick={handleAvatarChange}
                                    className="absolute bottom-2 right-2 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Name and Actions */}
                            <div className="flex-1 text-center md:text-left pb-4">
                                <h1 className="text-3xl font-bold text-slate-900 mb-1">{profile.name}</h1>
                                <p className="text-slate-600 flex items-center justify-center md:justify-start gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {profile.location}
                                </p>
                            </div>

                            <div className="pb-4">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-8 pt-20 pb-8">
                <div className="max-w-6xl mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                                    <p className="text-sm text-slate-600">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Profile Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={profile.location}
                                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                            <textarea
                                                value={profile.bio}
                                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Mail className="w-5 h-5 text-slate-400" />
                                            <span>{profile.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="w-5 h-5 text-slate-400" />
                                            <span>{profile.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <MapPin className="w-5 h-5 text-slate-400" />
                                            <span>{profile.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                            <span>Joined {profile.joinedDate}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-slate-700">{profile.bio}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Achievements */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Achievements</h2>
                                    <span className="text-sm text-slate-500">
                                        {achievements.filter(a => a.unlocked).length} / {achievements.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {achievements.map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className={`p-4 rounded-xl border-2 transition-all ${achievement.unlocked
                                                ? 'border-orange-200 bg-orange-50'
                                                : 'border-slate-200 bg-slate-50 opacity-50'
                                                }`}
                                        >
                                            <div className="text-4xl mb-2">{achievement.icon}</div>
                                            <h3 className="font-bold text-slate-900 text-sm mb-1">{achievement.title}</h3>
                                            <p className="text-xs text-slate-600">{achievement.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Activity */}
                        <div className="space-y-6">
                            {/* Recent Activity */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                    <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                                </div>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'recipe'
                                                ? 'bg-orange-100'
                                                : activity.type === 'save'
                                                    ? 'bg-red-100'
                                                    : activity.type === 'pantry'
                                                        ? 'bg-blue-100'
                                                        : 'bg-yellow-100'
                                                }`}>
                                                {activity.type === 'recipe' && <BookOpen className="w-5 h-5 text-orange-500" />}
                                                {activity.type === 'save' && <Heart className="w-5 h-5 text-red-500" />}
                                                {activity.type === 'pantry' && <MapPin className="w-5 h-5 text-blue-500" />}
                                                {activity.type === 'achievement' && <Award className="w-5 h-5 text-yellow-500" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-900">
                                                    <span className="font-medium">{activity.action}</span> {activity.item}
                                                </p>
                                                <p className="text-xs text-slate-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pro Plan Card */}
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="w-6 h-6" />
                                    <h3 className="font-bold text-lg">Pro Plan</h3>
                                </div>
                                <p className="text-sm opacity-90 mb-4">
                                    Unlock unlimited recipes, advanced AI features, and exclusive content.
                                </p>
                                <button className="w-full bg-white text-orange-500 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
