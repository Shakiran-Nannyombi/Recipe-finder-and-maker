import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { Zap, Shield, Heart, Sparkles } from 'lucide-react';

export const DemoVideo: React.FC = () => {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 20], [0, 1]);
    const scale = interpolate(frame, [0, 20], [0.8, 1]);

    // Title sequence
    const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
    const titleY = interpolate(frame, [20, 40], [20, 0], { extrapolateRight: 'clamp' });

    // Feature highlights
    const feature1Opacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const feature2Opacity = interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const feature3Opacity = interpolate(frame, [140, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
                {/* Logo & Intro */}
                <div style={{ opacity, transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                    <div style={{ backgroundColor: '#2563eb', padding: 20, borderRadius: 30, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)' }}>
                        <Sparkles color="white" size={60} />
                    </div>
                    <h1 style={{ fontSize: 80, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: -2 }}>Recipe AI</h1>
                </div>

                {/* Main Title */}
                <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginTop: 60, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 60, fontWeight: 800, color: '#1e293b', maxWidth: 800 }}>
                        Your Kitchen, <span style={{ color: '#2563eb', fontStyle: 'italic' }}>Reimagined.</span>
                    </h2>
                </div>

                {/* Features overlaying */}
                <div style={{ display: 'flex', gap: 40, marginTop: 80 }}>
                    <div style={{ opacity: feature1Opacity, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ backgroundColor: '#2563eb', padding: 15, borderRadius: 20 }}>
                            <Zap color="white" size={30} />
                        </div>
                        <p style={{ fontWeight: 700, color: '#334155' }}>Instant Recipes</p>
                    </div>
                    <div style={{ opacity: feature2Opacity, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ backgroundColor: '#f97316', padding: 15, borderRadius: 20 }}>
                            <Shield color="white" size={30} />
                        </div>
                        <p style={{ fontWeight: 700, color: '#334155' }}>Smart Pantry</p>
                    </div>
                    <div style={{ opacity: feature3Opacity, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ backgroundColor: '#ef4444', padding: 15, borderRadius: 20 }}>
                            <Heart color="white" size={30} />
                        </div>
                        <p style={{ fontWeight: 700, color: '#334155' }}>Adaptive Taste</p>
                    </div>
                </div>

                {/* Background Decorations */}
                <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.05)', filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.05)', filter: 'blur(80px)' }} />
            </div>
        </AbsoluteFill>
    );
};
