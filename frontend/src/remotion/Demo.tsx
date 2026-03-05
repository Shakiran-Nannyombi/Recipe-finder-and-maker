import { interpolate, useCurrentFrame, AbsoluteFill, spring, useVideoConfig } from 'remotion';
import { ChefHat, Sparkles, TrendingUp, Users, Award, Zap } from 'lucide-react';

export const DemoVideo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Scene 1: Logo entrance (0-40)
    const logoScale = spring({
        frame: frame - 0,
        fps,
        config: { damping: 12 }
    });
    const logoOpacity = interpolate(frame, [0, 20], [0, 1]);

    // Scene 2: Main headline (40-80)
    const headlineOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
    const headlineY = interpolate(frame, [35, 50], [50, 0], { extrapolateRight: 'clamp' });

    // Scene 3: Feature cards (80-140)
    const card1Progress = spring({ frame: frame - 70, fps, config: { damping: 15 } });
    const card2Progress = spring({ frame: frame - 85, fps, config: { damping: 15 } });
    const card3Progress = spring({ frame: frame - 100, fps, config: { damping: 15 } });

    // Scene 4: Stats counter (140-180)
    const statsOpacity = interpolate(frame, [135, 150], [0, 1], { extrapolateRight: 'clamp' });
    const statsScale = interpolate(frame, [135, 150], [0.8, 1], { extrapolateRight: 'clamp' });

    // Background animation
    const bgRotation = interpolate(frame, [0, 180], [0, 360]);

    const features = [
        { icon: ChefHat, title: 'AI-Powered Recipes', color: '#f97316', progress: card1Progress },
        { icon: Sparkles, title: 'Smart Meal Planning', color: '#8b5cf6', progress: card2Progress },
        { icon: TrendingUp, title: 'Reduce Food Waste', color: '#10b981', progress: card3Progress }
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
            {/* Background images with parallax effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden'
            }}>
                {/* Image 1 */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: interpolate(frame, [0, 60, 120, 180], [0.4, 0.4, 0, 0]),
                    transform: `scale(${1 + frame * 0.001})`,
                    transition: 'opacity 1s'
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
                        alt="Cooking"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(249, 115, 22, 0.3) 100%)'
                    }} />
                </div>

                {/* Image 2 */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: interpolate(frame, [0, 60, 120, 180], [0, 0, 0.4, 0]),
                    transform: `scale(${1 + frame * 0.001})`,
                    transition: 'opacity 1s'
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=1920&q=80"
                        alt="Diverse cooking"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(139, 92, 246, 0.3) 100%)'
                    }} />
                </div>

                {/* Image 3 */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: interpolate(frame, [0, 60, 120, 180], [0, 0, 0, 0.4]),
                    transform: `scale(${1 + frame * 0.001})`,
                    transition: 'opacity 1s'
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1920&q=80"
                        alt="People cooking together"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(16, 185, 129, 0.3) 100%)'
                    }} />
                </div>
            </div>

            {/* Animated overlay gradients */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: 600,
                height: 600,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
                transform: `rotate(${bgRotation}deg)`,
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '10%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                transform: `rotate(${-bgRotation}deg)`,
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 80,
                position: 'relative',
                zIndex: 1
            }}>
                {/* Scene 1: Logo */}
                {frame < 80 && (
                    <div style={{
                        opacity: logoOpacity,
                        transform: `scale(${logoScale})`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 30
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            padding: 40,
                            borderRadius: 40,
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src="/RecipeAI.png"
                                alt="Recipe AI Logo"
                                style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                        <h1 style={{
                            fontSize: 120,
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f97316 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            margin: 0,
                            letterSpacing: -4
                        }}>
                            Recipe AI
                        </h1>
                        <p style={{
                            fontSize: 32,
                            color: '#94a3b8',
                            fontWeight: 600,
                            margin: 0
                        }}>
                            Your Kitchen, Reimagined
                        </p>
                    </div>
                )}

                {/* Scene 2: Main Headline */}
                {frame >= 40 && frame < 140 && (
                    <div style={{
                        opacity: headlineOpacity,
                        transform: `translateY(${headlineY}px)`,
                        textAlign: 'center',
                        marginBottom: 60
                    }}>
                        <h2 style={{
                            fontSize: 72,
                            fontWeight: 900,
                            color: '#ffffff',
                            margin: 0,
                            marginBottom: 20,
                            letterSpacing: -2
                        }}>
                            Cook Smarter with AI
                        </h2>
                        <p style={{
                            fontSize: 28,
                            color: '#cbd5e1',
                            fontWeight: 500,
                            maxWidth: 700,
                            margin: '0 auto'
                        }}>
                            Transform your ingredients into gourmet meals with personalized AI-powered recipes
                        </p>
                    </div>
                )}

                {/* Scene 3: Feature Cards */}
                {frame >= 70 && frame < 140 && (
                    <div style={{
                        display: 'flex',
                        gap: 40,
                        marginTop: 40
                    }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    opacity: feature.progress,
                                    transform: `translateY(${(1 - feature.progress) * 50}px) scale(${0.8 + feature.progress * 0.2})`,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(20px)',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: 30,
                                    padding: 40,
                                    width: 280,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 20,
                                    boxShadow: `0 20px 40px ${feature.color}20`
                                }}
                            >
                                <div style={{
                                    background: feature.color,
                                    padding: 20,
                                    borderRadius: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <feature.icon color="white" size={40} strokeWidth={2.5} />
                                </div>
                                <p style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    margin: 0,
                                    textAlign: 'center'
                                }}>
                                    {feature.title}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Scene 4: Stats */}
                {frame >= 140 && (
                    <div style={{
                        opacity: statsOpacity,
                        transform: `scale(${statsScale})`,
                        display: 'flex',
                        gap: 80,
                        marginTop: 60
                    }}>
                        {[
                            { icon: Users, value: '500K+', label: 'Active Users' },
                            { icon: Award, value: '10M+', label: 'Recipes Created' },
                            { icon: Zap, value: '60%', label: 'Less Food Waste' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 15
                                }}
                            >
                                <stat.icon color="#f97316" size={50} strokeWidth={2.5} />
                                <div style={{
                                    fontSize: 56,
                                    fontWeight: 900,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f97316 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    fontSize: 20,
                                    color: '#94a3b8',
                                    fontWeight: 600
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => {
                    const particleY = interpolate(
                        frame,
                        [0, 180],
                        [Math.random() * 1080, Math.random() * 1080 - 200]
                    );
                    const particleX = 100 + i * 200 + Math.sin(frame * 0.05 + i) * 50;
                    const particleOpacity = Math.sin(frame * 0.1 + i) * 0.3 + 0.3;

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: particleX,
                                top: particleY,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: i % 2 === 0 ? '#f97316' : '#8b5cf6',
                                opacity: particleOpacity,
                                filter: 'blur(2px)'
                            }}
                        />
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
