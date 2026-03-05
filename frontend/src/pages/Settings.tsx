import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Palette, Trash2, Save, Shield, Mail } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        // Meal Preferences
        aiSensitivity: 50,
        metricUnits: true,
        defaultServings: 4,

        // Notifications
        emailNotifications: true,
        pushNotifications: false,
        expiryAlerts: true,
        recipeRecommendations: true,

        // Privacy
        profileVisibility: 'private',
        shareRecipes: false,

        // Appearance
        theme: 'light',
        language: 'en'
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = () => {
        console.log('Saving settings:', settings);
        // TODO: Implement save functionality
    };

    const handleDeleteAccount = () => {
        console.log('Deleting account...');
        // TODO: Implement delete account functionality
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 pt-16 md:pt-0">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-orange-50 to-white px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <SettingsIcon className="w-10 h-10 text-orange-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Settings</h1>
                    </div>
                    <p className="text-slate-600 text-base md:text-lg">Customize your Recipe AI experience</p>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-8 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Meal Preferences */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-orange-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Meal Preferences</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-slate-700 font-medium">AI Suggestion Sensitivity</label>
                                    <span className="text-sm text-slate-500">{settings.aiSensitivity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.aiSensitivity}
                                    onChange={(e) => setSettings({ ...settings, aiSensitivity: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Higher values mean more personalized suggestions</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-slate-700 font-medium">Metric Units</label>
                                    <p className="text-xs text-slate-500">Use kg, g, ml instead of lbs, oz, cups</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={settings.metricUnits}
                                        onChange={(e) => setSettings({ ...settings, metricUnits: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-700 font-medium block mb-2">Default Servings</label>
                                <select
                                    value={settings.defaultServings}
                                    onChange={(e) => setSettings({ ...settings, defaultServings: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                >
                                    <option value="1">1 serving</option>
                                    <option value="2">2 servings</option>
                                    <option value="4">4 servings</option>
                                    <option value="6">6 servings</option>
                                    <option value="8">8 servings</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-slate-700 font-medium">Email Notifications</label>
                                    <p className="text-xs text-slate-500">Receive recipe updates via email</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-slate-700 font-medium">Push Notifications</label>
                                    <p className="text-xs text-slate-500">Get notified on your device</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={settings.pushNotifications}
                                        onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-slate-700 font-medium">Expiry Alerts</label>
                                    <p className="text-xs text-slate-500">Get notified when items are expiring</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={settings.expiryAlerts}
                                        onChange={(e) => setSettings({ ...settings, expiryAlerts: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-slate-700 font-medium">Recipe Recommendations</label>
                                    <p className="text-xs text-slate-500">AI-powered recipe suggestions</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={settings.recipeRecommendations}
                                        onChange={(e) => setSettings({ ...settings, recipeRecommendations: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Privacy & Security</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-slate-700 font-medium block mb-2">Profile Visibility</label>
                                <select
                                    value={settings.profileVisibility}
                                    onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                >
                                    <option value="public">Public - Anyone can see</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="private">Private - Only me</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-slate-700 font-medium">Share Recipes Publicly</label>
                                    <p className="text-xs text-slate-500">Allow others to see your created recipes</p>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        className="sr-only peer"
                                        type="checkbox"
                                        checked={settings.shareRecipes}
                                        onChange={(e) => setSettings({ ...settings, shareRecipes: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <button className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors">
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Palette className="w-5 h-5 text-purple-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Appearance</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-slate-700 font-medium block mb-2">Theme</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setSettings({ ...settings, theme: 'light' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'light'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="w-full h-12 bg-white rounded-lg border border-slate-200 mb-2"></div>
                                        <p className="text-sm font-medium text-slate-700">Light</p>
                                    </button>
                                    <button
                                        onClick={() => setSettings({ ...settings, theme: 'dark' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'dark'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="w-full h-12 bg-slate-800 rounded-lg border border-slate-700 mb-2"></div>
                                        <p className="text-sm font-medium text-slate-700">Dark</p>
                                    </button>
                                    <button
                                        onClick={() => setSettings({ ...settings, theme: 'auto' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'auto'
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="w-full h-12 bg-gradient-to-r from-white to-slate-800 rounded-lg border border-slate-300 mb-2"></div>
                                        <p className="text-sm font-medium text-slate-700">Auto</p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-700 font-medium block mb-2">Language</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="it">Italiano</option>
                                    <option value="ja">日本語</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                        >
                            <Save className="w-5 h-5" />
                            Save Changes
                        </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                            <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-red-700 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-2 border-2 border-red-500 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-red-900">Are you absolutely sure?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                                    >
                                        Yes, Delete My Account
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-6 py-2 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
