import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './Demo';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="Demo"
                component={DemoVideo}
                durationInFrames={180}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
